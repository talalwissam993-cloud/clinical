import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoPersonSharp, IoCalendarSharp, IoHourglassSharp, IoCheckmarkDoneSharp } from "react-icons/io5";
import './Count.css'
const Count = ({ url }) => {
    const [appointments, setAppointments] = useState([]);
    const [doctorCount, setDoctorCount] = useState(0);
    const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, today: 0 });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Appointments Table
                const apptRes = await axios.get(`${url}/api/v1/appointment/getall`, { withCredentials: true });
                setAppointments(apptRes.data.appointments);

                // 2. Fetch Dynamic Stats (from your new getAppointmentStats logic)
                const statsRes = await axios.get(`${url}/api/v1/appointment/getcount`, { withCredentials: true });
                setStats(statsRes.data.stats);

                // 3. Fetch Doctor Account Count (from your new getAllDoctors logic)
                const docRes = await axios.get(`${url}/api/v1/user/doctors`, { withCredentials: true });
                setDoctorCount(docRes.data.doctors.length);

            } catch (error) {
                toast.error("Failed to fetch dashboard data");
            }
        };
        fetchDashboardData();
    }, [url]);

    const handleUpdateStatus = async (appointmentId, status) => {
        try {
            const { data } = await axios.put(`${url}/api/v1/appointment/update/${appointmentId}`, { status }, { withCredentials: true });
            setAppointments((prev) => prev.map((apt) => apt._id === appointmentId ? { ...apt, status } : apt));
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const { isAuthenticated, admin } = useContext(Context);
    if (!isAuthenticated) return <Navigate to={"/login"} />;

    return (
        <section className="dashboard-container page">
            {/* HEADER HERO */}
            <div className="dashboard-hero">
                <div className="hero-content">
                    <p className="hero-label">Medical Administration</p>
                    <h1>Welcome, {admin?.firstName} 👋</h1>
                    <p className="hero-subtext">
                        Today you have <strong>{stats.today}</strong> new appointments.
                        There are currently <strong>{doctorCount}</strong> active doctor accounts.
                    </p>
                </div>
                <img src="/doc.png" alt="Doctor" className="hero-img" />
            </div>

            {/* STATS BENTO GRID */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon"><IoCalendarSharp /></div>
                    <div className="stat-info"><h3>{stats.total}</h3><p>Total Bookings</p></div>
                </div>

                <div className="stat-card yellow">
                    <div className="stat-icon"><IoHourglassSharp /></div>
                    <div className="stat-info"><h3>{stats.pending}</h3><p>Pending</p></div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon"><IoCheckmarkDoneSharp /></div>
                    <div className="stat-info"><h3>{stats.accepted}</h3><p>Accepted</p></div>
                </div>
                <div className="stat-card yellow">
                    <div className="stat-icon"><IoHourglassSharp /></div>
                    <div className="stat-info"><h3>{stats.rejected}</h3><p>Rejected</p></div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon"><IoPersonSharp /></div>
                    <div className="stat-info"><h3>{doctorCount}</h3><p>Doctor Accounts</p></div>
                </div>
            </div>

            {/* TABLE SECTION */}
            <div className="table-card">
                <div className="table-header">
                    <h3>Appointment Ledger</h3>
                    <span className="table-count">{appointments.length} Records</span>
                </div>
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Date</th>
                            <th>Doctor</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Visited</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((apt) => (
                            <tr key={apt._id}>
                                <td className="bold-name">{apt.firstName} {apt.lastName}</td>
                                <td>{apt.appointment_date.substring(0, 10)}</td>
                                <td>Dr. {apt.doctor.firstName}</td>
                                <td><span className="dept-badge">{apt.department}</span></td>
                                <td>
                                    <select
                                        className={`status-select ${apt.status.toLowerCase()}`}
                                        value={apt.status}
                                        onChange={(e) => handleUpdateStatus(apt._id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Accepted">Accepted</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </td>
                                <td className="center">
                                    {apt.hasVisited ? <GoCheckCircleFill className="green-check" /> : <AiFillCloseCircle className="red-cross" />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Count;