import React from "react";
import Hero from "../components/Hero/Hero";
import AppointmentForm from "../components/Appointment/AppointmentForm";

const Appointment = ({ url }) => {
  return (
    <>
      <Hero
        title={"Schedule Your Appointment | Dayhat Al-yasmin Medical Institute"}
        title2={"حدد موعدك | مجمع ضاحية الياسمين الطبي"}
        imageUrl={"/signin.png"}
      />
      <AppointmentForm url={url} />
    </>
  );
};

export default Appointment;
