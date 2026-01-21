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
      <hr />
      <div className="container map-wrapper">

        {/* Left Side: Information */}
        <div className="map-info">


          <div className="address-box">
            <i className="location-icon">📍</i>
            <div>
              <h3>Main Office</h3>

              <p>Amman,Dahyat Al-yasmin </p>
              <p>عمان ، ضاحية الياسمين ، دوار الياسمين ، فوق صيدلية الاعتدال</p>
            </div>
          </div>
        </div>

        {/* Right Side: The Map */}
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d211.65777535642988!2d35.893891006708145!3d31.91951708181763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca1820138a4e9%3A0xc38ca216495b7f36!2z2LXZitiv2YTZitmHINin2YTYp9i52KrYr9in2YQ!5e0!3m2!1sen!2sjo!4v1768971436260!5m2!1sen!2sjo"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <hr />
    </>
  );
};

export default AboutUs;
