import React, { useContext } from "react";
import Hero from "../components/Hero/Hero";
import MessageForm from "../components/MessageForm/MessageForm";
import Departments from "../components/Departments/Departments";
import Biography from "../components/Biography/Biography";

const Home = () => {
  return (
    <>
      <Hero
        title={
          "Welcome to Dahyat Al-Yasmin Clinic Institute | Your Trusted Healthcare Provider"
        }
        title2={
          "مرحباً بكم في معهد عيادات ضاحية الياسمين | مزود الرعاية الصحية الموثوق به"
        }
        imageUrl={"/hero.png"}
      />
      <Biography imageUrl={"/about.png"} />
      <Departments />
      <MessageForm />
    </>
  );
};

export default Home;
