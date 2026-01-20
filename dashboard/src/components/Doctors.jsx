import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { IoPersonSharp, IoMailOutline, IoCallOutline } from "react-icons/io5";


const Doctors = ({ url }) => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);



  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          url + "/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  return (
    <section className="page doctors">
      <div className="page-header">
        <h1>Doctors Directory</h1>
        <p>Manage and view all registered medical professionals</p>
      </div>

      <div className="list-container">
        {doctors && doctors.length > 0 ? (
          doctors.map((element) => (
            <div className="doctor-row-card" key={element._id}>
              {/* Column 1: Profile Image */}
              <div className="col-profile">
                <div className="profile-img-container">
                  {element.docAvatar?.url ? (
                    <img src={element.docAvatar.url} alt="doctor" />
                  ) : (
                    <IoPersonSharp className="placeholder-icon" />
                  )}
                </div>
              </div>

              {/* Column 2: Name & Department */}
              <div className="col-info">
                <h4>{`${element.firstName} ${element.lastName}`}</h4>
                <span className="badge-dept">{element.doctorDepartment}</span>
              </div>

              {/* Column 3: Contact Details */}
              <div className="col-contact">
                <p><IoMailOutline className="row-icon" /> {element.email}</p>
                <p><IoCallOutline className="row-icon" /> {element.phone}</p>
              </div>

              {/* Column 4: Personal Info */}
              <div className="col-meta">
                <div className="meta-item">
                  <label>NIC</label>
                  <span>{element.nic}</span>
                </div>
                <div className="meta-item">
                  <label>GENDER</label>
                  <span>{element.gender}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data-state">
            <IoPersonSharp />
            <h3>No doctors found in the system.</h3>
          </div>
        )}
      </div>
    </section>
  );
};

export default Doctors;
