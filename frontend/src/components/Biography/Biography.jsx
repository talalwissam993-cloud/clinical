import React from "react";
import "./Biography.css";

const Biography = ({ imageUrl }) => {
  return (
    <div className="hero-wrapper bio-section"> {/* Reusing wrapper for consistency */}
      <div className="blob-1 bio-blob"></div>

      <div className="hero container">
        {/* Image on the Left for Bio */}
        <div className="banner image-banner">
          <img src={imageUrl} alt="doctor bio" className="animated-image" />
          <div className="vector-bg">
            <img src="/Vector.png" alt="vector" />
          </div>
        </div>

        {/* Text Card on the Right for Bio */}
        <div className="banner hero-content glass-card">
          <div className="accent-line"></div>
          <p className="section-tag">Biography</p>
          <h1>Who We Are</h1>

          <div className="description-wrapper">
            <p className="eng-text">
              We are a team of dedicated professionals working on a 2026 MERN STACK
              project to revolutionize patient care. Our institute combines
              years of clinical expertise with modern digital solutions.
            </p>

            <p className="arb-text" dir="rtl">
              نحن فريق من المتخصصين المتفانين الذين يعملون على مشروع MERN STACK
              لتطوير الرعاية الصحية. يجمع معهدنا بين سنوات من الخبرة السريرية
              والحلول الرقمية الحديثة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biography;