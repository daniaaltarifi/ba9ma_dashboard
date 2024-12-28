import "../Css/auth.css";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DeviceDetector from "device-detector-js";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { API_URL } from "../App";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [show, setShow] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [smShow, setSmShow] = useState(false);

  const getDeviceInfo = () => {
    const deviceDetector = new DeviceDetector();
    const userAgent = navigator.userAgent;
    const device = deviceDetector.parse(userAgent);

    return {
      deviceType: device.device.type || "unknown",
      os: device.os.name || "unknown",
      osVersion: device.os.version || "unknown",
      browser: device.client.name || "unknown",
      browserVersion: device.client.version || "unknown",
    };
  };
  const [ip, setIp] = useState("");

  useEffect(() => {
    // Fetch the IP address as plain text
    fetch("https://api.ipify.org?format=text")
      .then((response) => response.text())
      .then((data) => {
        setIp(data);
      })
      .catch((error) => console.error("Error fetching IP address:", error));
  }, []);

  
  const handleLogin = async () => {
    try {
      if (!mfaCode) {
        const response = await axios.post(`${API_URL}/users/login`, {
          email,
          password,
          ip,
          // ip:"109.144.197.162",
        });
        if (response.data.role === "Student") {
          setError("Unauthorized: You are not allowed to log in."); // Explicit error for Student role
          return; // Prevent further processing if the role is Student
        }
        if (
          response.status === 200 &&
          response.data ===
            "MFA code has been sent to your email. Please enter the code to complete login."
        ) {
          setError("")
          alert(response.data);
          setSmShow(true);
        }
      
      } else {
        // Verify email, password, and MFA code
        const res = await axios.post(`${API_URL}/users/login`, {
          email,
          password,
          mfaCode,
          ip
        });
  
        if (res.data.token) {
       
          localStorage.setItem("auth", res.data.token);
          localStorage.setItem("name", res.data.name);
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("id", res.data.id);
          localStorage.setItem("img", res.data.img);
          localStorage.setItem("email", email);
  
          // Redirect based on role
          if (res.data.role === "admin") {
            window.location.href = "/Home";
          } else if (res.data.role === "teacher") {
            window.location.href = "/teachercourses";
          } else {
            setError("Unauthorized: You are not allowed to log in."); // Explicit error
          }
        }
      }
    } catch (err) {
     handleError(err)
    }
  };
  const handleError = (err) => {
    if (!err.response || !err.response.status) {
      setError("Unable to connect to the server. Check your internet connection.");
      return;
    }
  
    const { status, data } = err.response;
  
    // Define a mapping for errors
    const errorMessages = {
      400: {
        "User not found": "The email you entered does not belong to any account.",
        "Invalid password": "The password you entered is incorrect. Please try again.",
        "Email is not authorized for login process":"Your email is not allowed to log in.",
        "MFA code has expired": "Your MFA code has expired. Please request a new one.",
        "Invalid MFA code": "The MFA code you entered is invalid. Please try again.",
      },
      403: {
        "Access is restricted to Jordan IPs only.":
          "You must be located in Jordan to access this system.",
        "Your IP is blocked due to too many failed login attempts.":
          "Your IP is temporarily blocked due to repeated failed attempts.",
      },
      500: {
        default: "An internal server error occurred. Please try again later.",
      },
    };
  
    // Match the error response to the correct message
    const message =
      errorMessages[status]?.[data] || // Match exact error message
      errorMessages[status]?.default || // Use default for the status code
      "An unexpected error occurred. Please try again later."; // Fallback for unknown errors
  
    setError(message);
  };
  
  return (
    <>
      <section className="login_cont ">
        <div className="container text-center ">
          <div className="row">
            <div className="col-lg-1"></div>
            <div className="col-lg-5 col-md-6 col-sm-12 box_purple_auth">
              <div className="">
                <div className="hello_logo_auth_cont">
                  <p className="hi_auth">مرحباً بك</p>
                  <img
                    src={require("../assets/ba9ma2.png")}
                    alt="ba9ma logo"
                    className="img-fluid logo_auth"
                  />
                </div>
                {/* <div>
                  <button type="button" className="btn auth_btn">
                  إنشاء حساب
                  </button>
                
                </div> */}
              </div>{" "}
            </div>
            <div className="col-lg-5 col-md-6 col-sm-12 cont_input_auth ">
              <div className="row m-5">
                <p className="title_of_input_auth">البريد الالكتروني</p>
                <input
                  type="text"
                  className={`search_blog ${error && "error_input"}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="row m-5">
                <p className="title_of_input_auth">كلمة المرور</p>
                <input
                  type="password"
                  className={`search_blog ${error && "error_input"}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Link to="/forgotPassword" className="forget_pass_auth">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              {smShow && (
    <div className="row m-5">
    <p className="title_of_input_auth">الكود </p>
    <input
      type="text"
      className={`search_blog ${error && "error_input"}`}
      value={mfaCode}
      onChange={(e) => setMfaCode(e.target.value)}
      />
       <button
        type="button"
        onClick={handleLogin}
        className="btn purple_btn mt-4"
      >
        Login
      </button>
  </div>
 
  )}
              {error && <p className="error_message">{error}</p>}
              {/* <button
                type="button"
                onClick={handleLogin}
                className="btn purple_btn mb-2"
              >
                تسجيل الدخول
              </button> */}
              <div>
  {!mfaCode && (
    <button
      type="button"
      onClick={handleLogin}
      className="btn purple_btn mb-2"
    >
      Send MFA Code
    </button>
  )}


</div>

            </div>

            <div className="col-lg-1"></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
