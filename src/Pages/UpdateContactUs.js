import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { API_URL } from "../App";
function UpdateContactUs() {
  const navigate = useNavigate();
  const location = useLocation();
  const [contactusId, setContactusId] = useState("");
  const [title, setTitle] = useState("");
  const [descr, setDescr] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [whatsup, setWhatsup] = useState("");
  const [contactus, setContactus] = useState([]);

  useEffect(() => {
    if (location.state && location.state.id) {
      setContactusId(location.state.id);
      const fetchContact = async () => {
        try {
          const response = await axios.get(`${API_URL}/contactdynamic/contactbyid/${location.state.id}`);
          const contact = response.data;

          // Check if the response contains expected data
          if (Array.isArray(contact) && contact.length > 0) {
            const contactDetails = contact[0]; // Adjust based on actual data structure
            setTitle(contactDetails.title);
            setDescr(contactDetails.descr);
            setPhone(contactDetails.phone);
            setEmail(contactDetails.email);
            setFacebook(contactDetails.facebook);
            setWhatsup(contactDetails.whatsup);
          } else {
            console.warn('No contact data available');
          }
        } catch (error) {
          console.error('Error fetching contact data:', error);
        }
      };

      fetchContact();
    } else {
      console.warn('No ID found in location.state');
    }
  }, [location.state]);


  const handleUpdate = async () => {
    if (!title || !descr || !phone || !email || !facebook || !whatsup) {
      Toastify({
        text: "Please Fill All Fields",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#CA1616",
      }).showToast();
      return;
    }
    try {
      const response = await axios.put(
        `${API_URL}/contactdynamic/update/${contactusId}`, // Use contactusId here
        { title, descr,phone,email,facebook,whatsup }
      );

      // Update the department data in state
      setContactus((prevAdd) =>
        prevAdd.map((data) => (data.id === contactusId ? response.data : data))
      );

      Toastify({
        text: "Updated successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();
      navigate("/contactus");
    } catch (error) {
      console.log(`Error updating data: ${error}`);
    }
  };
  return (
    <>
      <NavBar title={" التواصل"} />
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل التواصل</div>
          </div>
        </div>
        <div className="row mt-4 ">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">العنوان</p>
            <input
              type="text"
              className="input_addcourse"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الوصف</p>
            <input
              type="text"
              className="input_addcourse"
              value={descr}

              onChange={(e) => setDescr(e.target.value)}
            />{" "}
          </div>
        </div>

        <div className="row mt-4  ">
        <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">رقم الهاتف</p>
            <input
              type="text"
              className="input_addcourse"
              value={phone}

              onChange={(e) => setPhone(e.target.value)}
            />{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">البريد الالكتروني</p>
            <input
              type="text"
              className="input_addcourse"
              value={email}

              onChange={(e) => setEmail(e.target.value)}
            />{" "}
          </div>
          
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الفيسبوك</p>
            <input
              type="text"
              className="input_addcourse"
              value={facebook}

              onChange={(e) => setFacebook(e.target.value)}
            />{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الواتساب</p>
            <input
              type="text"
              className="input_addcourse"
              value={whatsup}

              onChange={(e) => setWhatsup(e.target.value)}
            />{" "}
          </div>
          <div className=" d-flex justify-content-center align-items-center ">
            <button
              className="btn_addCourse px-5 py-2 mt-5 "
              onClick={handleUpdate}
            >
              حفظ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateContactUs;
