import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import wisdomRouter from "./router/wisdomRouter.js";
import patientCardRouter from "./router/patientCardRouter.js";
import medicineRouter from './router/medicineRoutes.js'
import prescriptionRouter from "./router/prescriptionRouter.js";
import clinicalRouter from "./router/clinicalRouter.js";
import hospitalRouter from "./router/hospitalRouter.js";
import messageChatRouter from "./router/messageChatRouter.js"




const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    // @ts-ignore
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_url],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/wisdom", wisdomRouter);
app.use("/api/v1/patientcard", patientCardRouter);
app.use("/api/v1/medicine", medicineRouter);
app.use("/api/v1/prescription", prescriptionRouter);
app.use("/api/v1/clinical", clinicalRouter);
app.use("/api/v1/hospital", hospitalRouter);
app.use("./api/v1/messages", messageChatRouter)


dbConnection();

app.use(errorMiddleware);
export default app;
