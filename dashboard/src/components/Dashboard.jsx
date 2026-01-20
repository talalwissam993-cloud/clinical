// @ts-ignore
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

// @ts-ignore
const Dashboard = ({ url }) => {
  const [appointments, setAppointments] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "https://clinical-backend-kh2m.onrender.com/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  // @ts-ignore
  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `https://clinical-backend-kh2m.onrender.com/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      // @ts-ignore
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          // @ts-ignore
          appointment._id === appointmentId
            // @ts-ignore
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      // @ts-ignore
      toast.error(error.response.data.message);
    }
  };

  // @ts-ignore
  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>
                  {admin &&
                    `${admin.firstName} ${admin.lastName}`}{" "}
                </h5>
              </div>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Facilis, nam molestias. Eaque molestiae ipsam commodi neque.
                Assumenda repellendus necessitatibus itaque.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>hi</p>
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
    </>
  );
};

export default Dashboard;
