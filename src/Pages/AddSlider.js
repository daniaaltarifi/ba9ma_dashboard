import React, { useState,useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; 
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";
function AddSlider() {
  const [img, setImg] = useState(null);
  const [slider_img, setSlider_img] = useState(null);
  const [displayInfo, setDisplayInfo] = useState([]);
//   const [department_id, setDepartment_id] = useState("")
//   const [departmentData, setDepartmentData] = useState([])
  const [sliders, setSliders] = useState([])
const [teacher_name, setTeacher_name] = useState("")
const [descr, setDescr] = useState("")
const [page, setPage] = useState("")
const [title, setTitle] = useState("")
const [btn_name, setBtn_name] = useState("")

const navigate = useNavigate()
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };
  const handleslider_imgChange = (e) => {
    const file = e.target.files[0];
    setSlider_img(file);
  };
  const handleDeleteimg=()=>{
    setImg(null);
  }
    const handleDeleteCourse = (id) => {
    // Delete the selected course by its ID
    const updatedDisplayInfo = displayInfo.filter(course => course.id !== id);
    setDisplayInfo(updatedDisplayInfo);
  };
 

  const handlePost = async () => {

    if (!page || !slider_img) {
      Toastify({
        text: "Please Fill All Field",
        duration: 3000, // Duration in milliseconds
        gravity: "top", // 'top' or 'bottom'
        position: 'right', // 'left', 'center', 'right'
        backgroundColor: "#CA1616",
      }).showToast();
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('descr', descr);
      formData.append('page', page);
      formData.append('btn_name', btn_name);
      formData.append('img', img);
      formData.append('slider_img', slider_img);
      const response = await axios.post(
        `${API_URL}/sliders/addSlider`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSliders(response.data);
      Toastify({
        text: "Added completely",
        duration: 3000, // Duration in milliseconds
        gravity: "top", // 'top' or 'bottom'
        position: 'right', // 'left', 'center', 'right'
        backgroundColor: "#833988",
      }).showToast();
      navigate('/slider')

    } catch (error) {
      console.log(`Error fetching post data ${error}`);
    }
  };
  return (
    <>
      <NavBar title={"الصور"} />
      <div className="container ">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">اضافة صور</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">العنوان</p>
            <input type="text" className="input_addcourse" onChange={(e)=>setTitle(e.target.value)} />{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الصفحة</p>
            <input type="text" className="input_addcourse" onChange={(e)=>setPage(e.target.value)} />{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">زر التنقل</p>
            <input type="text" className="input_addcourse" onChange={(e)=>setBtn_name(e.target.value)} />{" "}
          </div>
        </div>
      
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الوصف</p>
            <textarea
              type="text"
              className="input_textarea_addcourse"onChange={(e)=>setDescr(e.target.value)}
            ></textarea>
          </div>
          <div className="col-lg-8 col-md-6 col-sm-12">
          <p className="input_title_addcourse">صورة صغيرة </p>

          <div className="file_input_addvideo">
              <button className="btn_choose_video">اختيار ملف</button>
              <input
                type="file"
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
                  className="fa-solid fa-square-xmark fa-lg mt-2"onClick={handleDeleteimg}
                  style={{ color: "#944b43" }}
                ></i>
              </div>
            )}
{/* slider img */}
<p className="input_title_addcourse">صورة كبيرة </p>

<div className="file_input_addvideo">
    <button className="btn_choose_video">اختيار ملف</button>
    <input
      type="file"
      className="choose_file_addcourse"
      onChange={handleslider_imgChange}
    />
    <span className="ps-5 selected_file_addvideo">
      قم بتحميل الملفات من هنا
    </span>
    {!slider_img && (
      <span className="selected_file_addcourse">
        No file selected
      </span>
    )}
  </div>
  {/* when add video display name of it */}
  {slider_img && (
    <div className="d-flex justify-content-around">
      <p className="selected_file_addcourse">{slider_img.name}</p>
      <i
        className="fa-solid fa-square-xmark fa-lg mt-2"onClick={handleDeleteimg}
        style={{ color: "#944b43" }}
      ></i>
    </div>
  )}
          </div>
          <div className="d-flex justify-content-center align-items-center ">

        <button className="btn_addCourse px-5 py-2 "onClick={handlePost}>اضافة</button>
          </div>
     
        </div>

      </div>

    
    </>
  );
}

export default AddSlider;
