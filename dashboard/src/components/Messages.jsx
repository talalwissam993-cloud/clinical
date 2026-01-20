import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { IoMailOpenOutline, IoCallOutline, IoPersonCircleSharp, IoTrashOutline } from "react-icons/io5";

const Messages = ({ url }) => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "https://clinical-backend-kh2m.onrender.com/api/v1/message/getall",
          { withCredentials: true }
        );
        setMessages(data.messages);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchMessages();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page messages">
      <div className="page-header">
        <div className="title-area">
          <h1>Inbox</h1>
          <p>Manage patient inquiries and feedback</p>
        </div>
      </div>

      <div className="message-list">
        {messages && messages.length > 0 ? (
          messages.map((element) => (
            <div className="msg-card" key={element._id}>
              {/* Header of the Message Card */}
              <div className="msg-header">
                <div className="sender-info">
                  <IoPersonCircleSharp className="sender-icon" />
                  <div>
                    <h4>{`${element.firstName} ${element.lastName}`}</h4>
                    <span>{element.email}</span>
                  </div>
                </div>
                <div className="msg-date">
                  <button className="delete-msg-btn">
                    <IoTrashOutline />
                  </button>
                </div>
              </div>

              {/* Body: The actual message content */}
              <div className="msg-body">
                <p>{element.message}</p>
              </div>

              {/* Footer: Quick Contact */}
              <div className="msg-footer">
                <a href={`tel:${element.phone}`} className="contact-pill">
                  <IoCallOutline /> {element.phone}
                </a>
                <a href={`mailto:${element.email}`} className="contact-pill">
                  <IoMailOpenOutline /> Reply via Email
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-messages">
            <div className="icon-circle">
              <IoMailOpenOutline />
            </div>
            <h3>Your inbox is empty</h3>
            <p>New messages from the contact form will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Messages;
