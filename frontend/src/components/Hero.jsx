import React from "react";

const Hero = ({ title, title2, imageUrl }) => {
  return (
    <>
      <div className="hero container">
        <div className="banner">
          <h1>{title}</h1>
          <h1>{title2}</h1>
          <p>
            Dahyat Al-Yasmin Clinic Institute is a state-of-the-art facility dedicated
            to providing comprehensive healthcare services with compassion and
            expertise. Our team of skilled professionals is committed to
            delivering personalized care tailored to each patient's needs. At
            Al-Yasmin Clinic, we prioritize your well-being, ensuring a harmonious
            journey towards optimal health and wellness.
          </p>
          <p>
            معهد ضاحية الياسمين الطبي هو منشأة حديثة ومتطورة، مُكرسة لتقديم خدمات رعاية صحية شاملة بروح من التعاطف والخبرة.
            يلتزم فريقنا من المهنيين المهرة بتقديم رعاية شخصية مصممة خصيصًا لتلبية احتياجات كل مريض.
            في عيادة الياسمين، نولي صحتكم وسلامتكم أولوية قصوى، ونضمن لكم رحلة متناغمة نحو الصحة والعافية الأمثل
          </p>
        </div>
        <div className="banner">
          <img src={imageUrl} alt="hero" className="animated-image" />
          <span>
            <img src="/Vector.png" alt="vector" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Hero;
