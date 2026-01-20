import React from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";
const AboutUs = ({ url }) => {
  return (
    <>
      <Hero
        title={"Learn More About Us | Dayhat Al-yasmin Medical Institute"}
        title2={"تعرّف علينا أكثر | معهد ضاحية الياسمين الطبي"}
        imageUrl={"/about.png"}
      />
      <Biography imageUrl={"/whoweare.png"} />
    </>
  );
};

export default AboutUs;
