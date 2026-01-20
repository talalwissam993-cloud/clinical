import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const users = ({ url }) => {
    const [users, setUsers] = useState([]);
    const { isAuthenticated } = useContext(Context);
    useEffect(() => {
        const fetchusers = async () => {
            try {
                const { data } = await axios.get(
                    "https://clinical-backend-kh2m.onrender.com/api/v1/user/users",
                    { withCredentials: true }
                );
                setUsers(data.users);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        };
        fetchusers();
    }, []);

    if (!isAuthenticated) {
        return <Navigate to={"/login"} />;
    }
    return (
        <section className="page users">
            <h1>users</h1>
            <div className="banner">
                {users && users.length > 0 ? (
                    users.map((element) => {
                        return (
                            <div className="user-row-card">
                                {/* 1. Left Section: Avatar or Initials */}
                                <div className="avatar-circle">
                                    {element.firstName[0]}{element.lastName[0]}
                                </div>

                                {/* 2. Middle Section: Primary Info */}
                                <div className="main-info">
                                    <h4>{`${element.firstName} ${element.lastName}`}</h4>
                                    <p className="email-text">{element.email}</p>
                                    <div className="sub-details">
                                        <span><i className="fa-solid fa-phone"></i> {element.phone}</span>
                                        <span><i className="fa-solid fa-calendar"></i> {element.dob?.substring(0, 10)}</span>
                                    </div>
                                </div>

                                {/* 3. Right Section: Metadata & Department */}
                                <div className="meta-info">
                                    {element.doctorDepartment && (
                                        <span className="dept-badge">{element.doctorDepartment}</span>
                                    )}
                                    <p><strong>NIC:</strong> {element.nic}</p>
                                    <p className="gender-tag">{element.gender}</p>
                                </div>
                            </div>

                        );
                    })
                ) : (
                    <h1>No Registered users Found!</h1>
                )}
            </div>
        </section>
    );
};

export default users;
