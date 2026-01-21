import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "./MessageForm.css"

const MessageForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "https://clinical-backend-kh2m.onrender.com/api/v1/message/send",
          { firstName, lastName, email, phone, message },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setMessage("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };


  return (
    <>


      <div className="container form-component message-form glass-card">
        <div className="form-header">
          <h2>Send Us A Message</h2>
          <h2 className="arb-text" dir="rtl">أرسل لنا رسالة</h2>
        </div>

        <form onSubmit={handleMessage}>
          <div className="input-row">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="input-row">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <textarea
            rows={5}
            placeholder="Your Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="btn-container">
            <button type="submit" className="submit-btn">Send Message</button>
          </div>
        </form>

        <img src="/Vector.png" alt="decorative background" className="bg-vector" />
      </div>
    </>
  );
};

export default MessageForm;
