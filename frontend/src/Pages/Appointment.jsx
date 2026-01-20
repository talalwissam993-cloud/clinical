import React from "react";
import Hero from "../components/Hero";
import AppointmentForm from "../components/AppointmentForm";

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
