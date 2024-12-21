import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { API_URL } from "../App";
function UpdateWhoweare() {
  const navigate = useNavigate();
  const location = useLocation();
  const [whoweareId, setWhoweareId] = useState("");
  const [title, setTitle] = useState("");
  
  const [whoweare, setWhoweare] = useState([]);

  useEffect(() => {
    if (location.state && location.state.id) {
      setWhoweareId(location.state.id);
      const fetchContact = async () => {
        try {
          const response = await axios.get(`${API_URL}/WhoWeAre/getWhoweareById/${location.state.id}`);
          const contact = response.data;

          // Check if the response contains expected data
          if (Array.isArray(contact) && contact.length > 0) {
            const contactDetails = contact[0]; // Adjust based on actual data structure
            setTitle(contactDetails.title);
          
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
    if (!title) {
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
        `${API_URL}/WhoWeAre/updateWhoweare/${whoweareId}`, // Use whoweareId here
        { title }
      );

      // Update the department data in state
      setWhoweare((prevAdd) =>
        prevAdd.map((data) => (data.id === whoweareId ? response.data : data))
      );

      Toastify({
        text: "Updated successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();
      navigate("/whoweare");
    } catch (error) {
      console.log(`Error updating data: ${error}`);
    }
  };
  return (
    <>
      <NavBar title={" من نحن"} />
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل من نحن</div>
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
          
          </div>
        </div>

        <div className="row mt-4  ">
      
          <div className=" d-flex justify-content-center align-items-center ">
            <button
              className="btn_addCourse px-5 py-2 mt-5 "
              onClick={handleUpdate}
            >
              حفظ
            </button>
          </div>
        </div>
    </>
  );
}

export default UpdateWhoweare;
