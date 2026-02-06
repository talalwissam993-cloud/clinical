import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { PatientCard } from "../models/patientCardSchema.js";
import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";

// 1. UPSERT CARD (Admin Only - Create or Update Vitals)
export const upsertPatientCard = catchAsyncErrors(async (req, res, next) => {
    const {
        patientId, bloodGroup, height, weight,
        emergencyContactName, emergencyContactPhone, emergencyContactRelationship,
        testName, category, doctorNotes, medications // medications will come as a string
    } = req.body;

    // 1. Prepare base data
    const updateData = {
        bloodGroup,
        height,
        weight,
        emergencyContact: {
            name: emergencyContactName,
            phone: emergencyContactPhone,
            relationship: emergencyContactRelationship
        }
    };

    // 2. Parse medications if they exist
    if (medications) {
        updateData.medications = JSON.parse(medications);
    }

    // 3. Handle initial examination
    let initialExam = null;
    if (testName) {
        initialExam = { testName, category, doctorNotes, examinationDate: Date.now() };

        if (req.files && req.files.testImage) {
            const cloudinaryResponse = await cloudinary.uploader.upload(
                req.files.testImage.tempFilePath,
                { folder: "patient_tests" }
            );
            initialExam.testImage = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            };
        }
    }

    // 4. Update the Card
    const card = await PatientCard.findOneAndUpdate(
        { patientId },
        {
            $set: updateData,
            // Only push to examinations if an initialExam was created
            ...(initialExam && { $push: { examinations: initialExam } })
        },
        { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Record Updated", card });
});

// 2. GET PATIENT CARD (Admin or the Patient themselves)
export const getPatientCard = catchAsyncErrors(async (req, res, next) => {
    const { patientId } = req.params;

    // SECURITY CHECK: If the user is a patient, they can only see their OWN card.
    if (req.user.role === "Patient" && req.user._id.toString() !== patientId) {
        return next(new ErrorHandler("You are not authorized to view this card.", 403));
    }

    const card = await PatientCard.findOne({ patientId }).populate(
        "patientId",
        "firstName lastName email phone gender dob nic"
    );

    if (!card) return next(new ErrorHandler("Medical records not found", 404));

    res.status(200).json({ success: true, card });
});

// 3. ADD EXAMINATION (Admin Only)
export const addExamination = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { testName, category, doctorNotes } = req.body;

    let examData = { testName, category, doctorNotes, examinationDate: Date.now() };

    if (req.files && req.files.testImage) {
        const cloudinaryResponse = await cloudinary.uploader.upload(
            req.files.testImage.tempFilePath,
            { folder: "patient_tests" }
        );
        examData.testImage = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }

    const card = await PatientCard.findByIdAndUpdate(
        id,
        { $push: { examinations: examData } },
        { new: true, runValidators: true }
    );

    if (!card) return next(new ErrorHandler("Card not found", 404));
    res.status(200).json({ success: true, message: "Examination added", card });
});

// 4. ADD MEDICATION (Admin Only)
export const addMedication = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { name, dosage, frequency, duration, status } = req.body;

    const card = await PatientCard.findByIdAndUpdate(
        id,
        { $push: { medications: { name, dosage, frequency, duration, status } } },
        { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Medication added", card });
});

// 5. UPDATE MEDICATION STATUS (Admin Only)
export const updateMedicationStatus = catchAsyncErrors(async (req, res, next) => {
    const { cardId, medId } = req.params;
    const { status } = req.body;

    const card = await PatientCard.findOneAndUpdate(
        { _id: cardId, "medications._id": medId },
        { $set: { "medications.$.status": status } },
        { new: true }
    );

    res.status(200).json({ success: true, message: "Status updated", card });
});

// 6. SEARCH CARD BY NAME/NIC (Admin Only)
export const searchCardByNameOrNIC = catchAsyncErrors(async (req, res, next) => {
    const { query } = req.params;

    // 1. Find the User first
    const user = await User.findOne({
        role: "Patient",
        $or: [
            { nic: { $regex: query, $options: "i" } },
            { firstName: { $regex: query, $options: "i" } },
            { lastName: { $regex: query, $options: "i" } }
        ],
    });

    if (!user) return next(new ErrorHandler("No patient found", 404));

    // 2. IMPORTANT: Find the Card and specifically populate the user info
    // Mongoose will include medications and examinations by default unless excluded
    const card = await PatientCard.findOne({ patientId: user._id }).populate("patientId");

    if (!card) return next(new ErrorHandler("User found, but no medical card exists for them.", 404));

    res.status(200).json({ success: true, card });
});

// 7. DELETE EXAMINATION (Admin Only)
export const deleteExamination = catchAsyncErrors(async (req, res, next) => {
    const { cardId, examId } = req.params;
    const card = await PatientCard.findById(cardId);
    if (!card) return next(new ErrorHandler("Card not found", 404));

    const exam = card.examinations.id(examId);
    if (exam?.testImage?.public_id) {
        await cloudinary.uploader.destroy(exam.testImage.public_id);
    }

    card.examinations.pull(examId);
    await card.save();
    res.status(200).json({ success: true, message: "Examination removed" });
});

// 8. DELETE FULL CARD (Admin Only)
export const deleteFullCard = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const card = await PatientCard.findById(id);
    if (!card) return next(new ErrorHandler("Card not found", 404));

    const imagePromises = card.examinations
        .filter(exam => exam.testImage?.public_id)
        .map(exam => cloudinary.uploader.destroy(exam.testImage.public_id));

    await Promise.all(imagePromises);
    await card.deleteOne();

    res.status(200).json({ success: true, message: "Record erased" });
});

// 9. Get Active Reminders (For Patient Dashboard)
export const getActiveReminders = catchAsyncErrors(async (req, res, next) => {
    // A patient can only see their own reminders
    const card = await PatientCard.findOne({ patientId: req.user._id });

    if (!card) {
        return next(new ErrorHandler("No medical records found.", 404));
    }

    // Filter only Active medications
    const activeMeds = card.medications.filter(med => med.status === "Active");

    res.status(200).json({
        success: true,
        count: activeMeds.length,
        reminders: activeMeds.map(med => ({
            medicine: med.name,
            dosage: med.dosage,
            instruction: `${med.frequency} for ${med.duration}`,
            status: med.status
        }))
    });
});