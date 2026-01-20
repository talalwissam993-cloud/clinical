import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { IoPersonSharp, IoMailOutline, IoCallOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import "./Department.css"



const Departments = () => {
  const departmentsArray = [
    {
      name: "Internist",
      name2: "الطب الباطني",
      imageUrl: "/departments/Internist.png"

    },
    {
      name: "Pediatrics",
      name2: "طب الأطفال",
      imageUrl: "/departments/pedia.jpg",
    },
    {
      name: "Orthopedics",
      name2: "جراحة العظام",
      imageUrl: "/departments/ortho.jpg",
    },
    {
      name: "Cardiology",
      name2: "طب القلب",
      imageUrl: "/departments/cardio.jpg",
    },
    {
      name: "Neurology",
      name2: "طب الأعصاب",
      imageUrl: "/departments/neuro.jpg",
    },
    {
      name: "Oncology",
      name2: "علم الأورام",
      imageUrl: "/departments/onco.jpg",
    },
    {
      name: "Radiology",
      name2: "الأشعة",
      imageUrl: "/departments/radio.jpg",
    },
    {
      name: "Physical Therapy",
      name2: "العلاج الطبيعي",
      imageUrl: "/departments/therapy.jpg",
    },
    {
      name: "Dermatology",
      name2: "طب الأمراض الجلدية",
      imageUrl: "/departments/derma.jpg",
    },
    {
      name: "ENT",
      name2: "الأنف والأذن والحنجرة",
      imageUrl: "/departments/ent.jpg",
    },
  ];

  const responsive = {
    extraLarge: {
      breakpoint: { max: 3000, min: 1324 },
      items: 4,
      slidesToSlide: 1, // optional, default to 1.
    },
    large: {
      breakpoint: { max: 1324, min: 1005 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    medium: {
      breakpoint: { max: 1005, min: 700 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
    small: {
      breakpoint: { max: 700, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "https://clinical-backend-kh2m.onrender.com/api/v1/user/doctors",
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
    <>
      <div className="doctors-carousel-wrapper">
        <h2>Departments <span style={{ float: "right", fontSize: "30px" }}>الأقسام</span></h2>
        <Carousel responsive={responsive} infinite={true} autoPlay={true}
          removeArrowOnDeviceType={[
            // "superLargeDesktop",
            // "desktop",
            "tablet",
            "mobile",
          ]}
        >
          {departmentsArray.map((depart, index) => {
            return (
              <div key={index} className="card">
                <div className="depart-name" >
                  <p>{depart.name}</p>
                  <p>{depart.name2}</p>
                </div>

                <img src={depart.imageUrl} alt="Department" />
              </div >

            );
          })}
        </Carousel >

      </div >

      <div className="doctors-carousel-wrapper">
        <h2>Our Doctors <span style={{ float: "right", fontSize: "30px" }}>الأطباء المتاحين</span></h2>

        <Carousel responsive={responsive} infinite={true} autoPlay={true}>
          {doctors && doctors.length > 0 ? (
            doctors.map((element) => (
              <div className="doctor-card-premium" key={element._id}>
                {/* Top Section: Profile & Department */}
                <div className="card-header">
                  <div className="img-wrapper">
                    {element.docAvatar?.url ? (
                      <img src={element.docAvatar.url} alt="doctor" />
                    ) : (
                      <IoPersonSharp />
                    )}
                  </div>
                  <span className="dept-tag">{element.doctorDepartment}</span>
                </div>

                {/* Middle Section: Name & Contact */}
                <div className="card-body">
                  <h3>{`Dr. ${element.firstName} ${element.lastName}`}</h3>
                  <div className="contact-info">
                    <p><IoMailOutline /> {element.email}</p>
                    <p><IoCallOutline /> {element.phone}</p>
                  </div>
                </div>

                {/* Bottom Section: Stats/Meta */}
                <div className="card-footer">
                  <div className="stat">
                    <label>Available</label>
                    <span>Available</span>
                  </div>
                  <div className="stat">
                    <label>GENDER</label>
                    <span>{element.gender}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-doctors">
              <IoPersonSharp />
              <p>Awaiting medical staff data...</p>
            </div>
          )}
        </Carousel>
      </div>
    </>
  );
};

export default Departments;
