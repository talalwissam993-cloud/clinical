import React from "react";
import "./Hero.css";

const Hero = ({ title, title2, imageUrl }) => {
  return (
    <div className="hero-wrapper">
      {/* Decorative Blobs for background depth */}
      <div className="blob-1"></div>
      <div className="blob-2"></div>

      <div className="hero container">
        <div className="banner hero-content glass-card">
          <div className="accent-line"></div>
          <h1>{title}</h1>
          <h1 className="title-accent">{title2}</h1>

          <div className="description-wrapper">
            <p className="eng-text">
              Dahyat Al-Yasmin Clinic Institute is a state-of-the-art facility dedicated
              to providing comprehensive healthcare services with compassion and expertise.
            </p>

            <p className="arb-text" dir="rtl">
              معهد ضاحية الياسمين الطبي هو منشأة حديثة ومتطورة، مُكرسة لتقديم خدمات رعاية صحية شاملة بروح من التعاطف والخبرة.
            </p>
          </div>

        </div>

        <div className="banner image-banner">
          <img src={imageUrl} alt="hero" className="animated-image" />
          <div className="vector-bg">
            <img src="/Vector.png" alt="vector" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;