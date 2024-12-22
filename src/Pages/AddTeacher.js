import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";
function AddTeacher() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayInfo, setDisplayInfo] = useState([]);
  const [department_id, setDepartment_id] = useState("");
  const [departmentData, setDepartmentData] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teacher_name, setTeacher_name] = useState("");
  const [descr, setDescr] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDeleteSelectedFile = () => {
    setSelectedFile(null);
  };
  const handleDeleteCourse = (id) => {
    // Delete the selected course by its ID
    const updatedDisplayInfo = displayInfo.filter((course) => course.id !== id);
    setDisplayInfo(updatedDisplayInfo);
  };
  const handleDepartment = (e) => {
    const selectedDepartmentId = e.target.value;
    setDepartment_id(selectedDepartmentId);
  };
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/departments/getDepartments`
        );
        setDepartmentData(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);
  const handlePost = async () => {
    if (!teacher_name || !descr || !department_id || !email || !selectedFile) {
      Toastify({
        text: "Please Fill All Field",
        duration: 3000, // Duration in milliseconds
        gravity: "top", // 'top' or 'bottom'
        position: "right", // 'left', 'center', 'right'
        backgroundColor: "#CA1616",
      }).showToast();
      return;
    }
    try {
      const formData = new FormData();
      formData.append("teacher_name", teacher_name);
      formData.append("descr", descr);
      formData.append("department_id", department_id);
      formData.append("email", email);
      formData.append("img", selectedFile);
      const response = await axios.post(
        `${API_URL}/TeacherRoutes/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTeachers(response.data);
      Toastify({
        text: "Added completely",
        duration: 3000, // Duration in milliseconds
        gravity: "top", // 'top' or 'bottom'
        position: "right", // 'left', 'center', 'right'
        backgroundColor: "#833988",
      }).showToast();
      navigate("/teacher");
    } catch (error) {
      console.log(`Error fetching post data ${error}`);
    }
  };
  return (
    <>
      <NavBar title={"المعلم"} />
      <div className="container ">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">اضافة معلم</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">اسم الاستاذ</p>
            <input
              type="text"
              className="input_addcourse"
              onChange={(e) => setTeacher_name(e.target.value)}
            />{" "}
          </div>
          {/* <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">اسم المادة</p>
            <input type="text" className="input_addcourse" onChange={(e)=>setTeacher_name(e.target.value)} />{" "}
          </div> */}
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الايميل</p>
            <input
              type="text"
              className="input_addcourse"
              onChange={(e) => setEmail(e.target.value)}
            />{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">القسم </p>
            <select
              name="department"
              value={department_id}
              onChange={handleDepartment}
              id="lang"
              className="select_dep"
            >
              <option value="">اختر قسم</option>
              {departmentData.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الوصف</p>
            <textarea
              type="text"
              className="input_textarea_addcourse"
              onChange={(e) => setDescr(e.target.value)}
            ></textarea>
          </div>

          <div className="col-lg-8 col-md-6 col-sm-12">
            <p className="input_title_addcourse">صورة الاستاذ </p>

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
              {!selectedFile && (
                <span className="selected_file_addcourse">
                  No file selected
                </span>
              )}
            </div>
            {/* when add video display name of it */}
            {selectedFile && (
              <div className="d-flex justify-content-around">
                <p className="selected_file_addcourse">{selectedFile.name}</p>
                <i
                  className="fa-solid fa-square-xmark fa-lg mt-2"
                  onClick={handleDeleteSelectedFile}
                  style={{ color: "#944b43" }}
                ></i>
              </div>
            )}
            {/*End when add video display name of it */}
          </div>
          <div className="d-flex justify-content-center align-items-center ">
            <button className="btn_addCourse px-5 py-2 " onClick={handlePost}>
              اضافة
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddTeacher;
