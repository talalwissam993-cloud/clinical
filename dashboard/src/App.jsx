import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewDoctor from "./components/AddNewDoctor";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AddNewAdmin from "./components/AddNewAdmin";
import "./App.css";
import Users from "./components/Users";
import Count from "./components/Count";

const App = () => {
  const url = "http://localhost:5000"

  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          url + "/api/v1/user/admin/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard url={url} />} />
        <Route path="/login" element={<Login url={url} />} />
        <Route path="/doctor/addnew" element={<AddNewDoctor url={url} />} />
        <Route path="/admin/addnew" element={<AddNewAdmin url={url} />} />
        <Route path="/messages" element={<Messages url={url} />} />
        <Route path="/doctors" element={<Doctors url={url} />} />
        <Route path="/users" element={<Users url={url} />} />
        <Route path="/count" element={<Count url={url} />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
