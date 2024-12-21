import "../Css/auth.css";
import { Link } from "react-router-dom";
import React, { useState } from 'react';
import axios from 'axios';
import DeviceDetector from 'device-detector-js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { API_URL } from "../App";
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const [show, setShow] = useState(false);


  const getDeviceInfo = () => {
    const deviceDetector = new DeviceDetector();
    const userAgent = navigator.userAgent;
    const device = deviceDetector.parse(userAgent);
  
    return {
      deviceType: device.device.type || 'unknown',
      os: device.os.name || 'unknown',
      osVersion: device.os.version || 'unknown',
      browser: device.client.name || 'unknown',
      browserVersion: device.client.version || 'unknown',
    };
  };
    const handleLogin = async (e) => {
    e.preventDefault();
    const deviceInfo = getDeviceInfo();

    try {
      const res = await axios.post(`${API_URL}/users/login`, {
        email, role, password,deviceInfo
      });
      // Check for device count error
      // if (res.status === 403 && res.data.message === 'You are logged in on too many devices. Please log out from another device.') {
      //   setError('You are logged in on too many devices. Please log out from another device.');
      //   return;
      // }
      
           // Store authentication data in local storage
 
        if (res.data.token) {
        localStorage.setItem('auth', res.data.token);
        localStorage.setItem('name', res.data.name);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('id', res.data.id);
        localStorage.setItem('img', res.data.img);

        localStorage.setItem('email', email);  // Store email in local storage again  
        // Redirect based on role
        if (res.data.role === 'admin') {
          window.location.href = '/Home';
        } else if (res.data.role === 'teacher') {
          window.location.href = '/teachercourses';
        } else {
          setError("غير مصرح لك بالدخول");
        }
      }
    }catch (err) {
      // if (err.response && err.response.status === 403) {
      //   setError('تسجيل الدخول غير متاح على هذا الجهاز');
      // } else {
        setError("البريد الالكتروني أو كلمة المرور غير صحيحة");
      // }
      console.error('Login error:', err);
    }
  };
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   const deviceInfo = getDeviceInfo();

  //   try {
  //     const res = await axios.post('http://localhost:8080/api/login', {
  //       email, role, password,deviceInfo
  //     });
  //     // Check for device count error
  //     // if (res.status === 403 && res.data.message === 'You are logged in on too many devices. Please log out from another device.') {
  //     //   setError('You are logged in on too many devices. Please log out from another device.');
  //     //   return;
  //     // }
      
  //          // Store authentication data in local storage
  //     localStorage.setItem('auth', res.data.token);
  //     localStorage.setItem('id', res.data.id);
  //     localStorage.setItem('name', res.data.name);
  //     localStorage.setItem('role', res.data.role);
  //     localStorage.setItem('img', res.data.img);

  //     localStorage.setItem('email', email);  // Store email in local storage

  //     // Check if the response contains the token
  //     if (res.data.token) {
  //       localStorage.setItem('auth', res.data.token);
  //       localStorage.setItem('name', res.data.name);
  //       localStorage.setItem('role', res.data.role);
  //       localStorage.setItem('id', res.data.id);
  //       localStorage.setItem('img', res.data.img);

  //       localStorage.setItem('email', email);  // Store email in local storage again  
  //       // Redirect based on role
  //       if (res.data.role === 'admin') {
  //         window.location.href = '/Home';
  //       } else if (res.data.role === 'teacher') {
  //         window.location.href = '/teachercourses';
  //       } else {
  //         setError("غير مصرح لك بالدخول");
  //       }
  //     }
  //   }catch (err) {
  //     if (err.response && err.response.status === 403) {
  //       setError('تسجيل الدخول غير متاح على هذا الجهاز');
  //     } else {
  //       setError("البريد الالكتروني أو كلمة المرور غير صحيحة");
  //     }
  //     console.error('Login error:', err);
  //   }
  // };
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
                  className={`search_blog ${error && 'error_input'}`}
                  value={email} onChange={(e) => setEmail(e.target.value)}
                 
                />
                



              </div>
              <div className="row m-5">
                <p className="title_of_input_auth">كلمة المرور</p>
                <input
                   type="password"
                   className={`search_blog ${error && 'error_input'}`}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                
                />
                <Link to="/forgotPassword" className="forget_pass_auth">نسيت كلمة المرور؟</Link>
                            </div>
              {error && <p className="error_message">{error}</p>}
              <button type="button" onClick={handleLogin} className="btn purple_btn mb-2">تسجيل الدخول</button>

            </div>
            
            <div className="col-lg-1"></div>
          </div>
        </div>
       
      </section>
    </>
  );
}

export default Login;