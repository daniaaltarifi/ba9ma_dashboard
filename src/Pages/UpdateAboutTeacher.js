import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { API_URL } from "../App";
function UpdateAboutTeacher() {
  const navigate = useNavigate();
  const location = useLocation();
  const [aboutteacherId, setAboutteacherId] = useState("");
  const [title, setTitle] = useState("");
  const [descr, setDescr] = useState("");
  const [para, setPara] = useState("");
  const [img, setImg] = useState("");
  
  const [aboutteacher, setAboutteacher] = useState([]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };
  const handleDeleteSelectedFile=()=>{
    setImg(null);
  }
  useEffect(() => {
    if (location.state && location.state.id) {
      setAboutteacherId(location.state.id);
      const fetchContact = async () => {
        try {
          const response = await axios.get(`${API_URL}/aboutTeacher/getAboutTeacherById/${location.state.id}`);
          const contact = response.data;

          // Check if the response contains expected data
          // if (Array.isArray(contact) && contact.length > 0) {
            const contactDetails = contact; // Adjust based on actual data structure
            setTitle(contactDetails.title);
            setDescr(contactDetails.descr);
            setPara(contactDetails.para);
            setImg(contactDetails.img);
          
          // } else {
          //   console.warn('No contact data available');
          // }
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
    // if (!title || !descr || !img || !para) {
    //   Toastify({
    //     text: "Please Fill All Fields",
    //     duration: 3000,
    //     gravity: "top",
    //     position: "right",
    //     backgroundColor: "#CA1616",
    //   }).showToast();
    //   return;
    // }
    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('descr', descr);
        formData.append('para', para);
        formData.append('img', img);
  
        const response = await axios.put(
          `${API_URL}/aboutTeacher/updateaboutTeacher/${aboutteacherId}`,
          formData, // Send the FormData object
          {
            headers: {
              "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
            },
          }
        );
        setAboutteacher((prevAdd) =>
          prevAdd.map((data) =>
            data.id === aboutteacherId ? response.data : data
          )
        );
        Toastify({
          text: "Updated completely",
          duration: 3000, // Duration in milliseconds
          gravity: "top", // 'top' or 'bottom'
          position: 'right', // 'left', 'center', 'right'
          backgroundColor: "#833988",
        }).showToast();
      navigate("/whoweare");
    } catch (error) {
      console.log(`Error updating data: ${error}`);
    }
  };
  return (
    <>
      <NavBar title={" معلمينا"} />
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل معلمينا</div>
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
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">النص</p>
            <input
              type="text"
              className="input_addcourse"
              value={para}

              onChange={(e) => setPara(e.target.value)}
            />{" "}
          </div>
        </div>
        <div className="col-lg-8 col-md-6 col-sm-12">
          <p className="input_title_addcourse">الصورة  </p>

          <div className="file_input_addvideo">
              <button className="btn_choose_video">اختيار ملف</button>
              <input
                type="file"
                // value={img}
                className="choose_file_addcourse"
                onChange={handleFileChange}
              />
              <span className="ps-5 selected_file_addvideo">
                قم بتحميل الملفات من هنا
              </span>
              {!img && (
                <span className="selected_file_addcourse">
                  No file selected
                </span>
              )}
            </div>
            {/* when add video display name of it */}
            {img && (
              <div className="d-flex justify-content-around">
                <p className="selected_file_addcourse">{img.name}</p>
                <i
                  className="fa-solid fa-square-xmark fa-lg mt-2"onClick={handleDeleteSelectedFile}
                  style={{ color: "#944b43" }}
                ></i>
              </div>
            )}
            {/*End when add video display name of it */}
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
      </div>
    </>
  );
}

export default UpdateAboutTeacher;
