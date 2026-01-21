import React, { useContext, useState, useEffect } from "react"; // Added useEffect
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../main";
import "./Navbar.css";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [sticky, setSticky] = useState(false); // State for scroll effect
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  // Scroll effect logic
  useEffect(() => {
    const handleScroll = () => {
      // If user scrolls more than 50px, set sticky to true
      if (window.scrollY > 50) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await axios
      .get("https://clinical-backend-kh2m.onrender.com/api/v1/user/patient/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
        setShow(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const goToLogin = () => {
    setShow(false);
    navigateTo("/login");
  };

  return (
    // Dynamic class: navbar sticky or just navbar
    <nav className={sticky ? "navbar sticky" : "navbar"}>
      <div className="logo">
        <img src="/logo.png" alt="logo" className="logo-img" />
      </div>

      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          <Link to={"/"} onClick={() => setShow(false)}>Home</Link>
          <Link to={"/appointment"} onClick={() => setShow(false)}>Appointment</Link>
          <Link to={"/about"} onClick={() => setShow(false)}>About Us</Link>
        </div>

        <div className="nav-buttons">
          {isAuthenticated ? (
            <button className="logoutBtn btn" onClick={handleLogout}>LOGOUT</button>
          ) : (
            <button className="loginBtn btn" onClick={goToLogin}>LOGIN</button>
          )}
        </div>
      </div>

      <div className="hamburger" onClick={() => setShow(!show)}>
        {show ? <MdClose /> : <GiHamburgerMenu />}
      </div>
    </nav>
  );
};

export default Navbar;