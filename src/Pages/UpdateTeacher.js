import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import { useNavigate, useLocation } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import axios from "axios";
import { API_URL } from "../App";

function UpdateTeacher() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayInfo, setDisplayInfo] = useState([]);
  const [department_id, setDepartment_id] = useState("");
  const [departmentData, setDepartmentData] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teacher_name, setTeacher_name] = useState("");
  const [descr, setDescr] = useState("");
  const [teacher_id, setTeacher_id] = useState("");
  const [email, setEmail] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Check if location.state exists and contains the id
    if (location.state && location.state.id) {
      setTeacher_id(location.state.id);
    } else {
      console.warn("No ID found in location.state");
    }
  }, [location.state]);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        if (teacher_id) {
          const response = await axios.get(
            `${API_URL}/TeacherRoutes/getTeacherById/${teacher_id}`
          );
          const teacherData = response.data;
          setTeacher_name(teacherData.teacher_name);
          setDescr(teacherData.descr);
          setDepartment_id(teacherData.department_id);
          setEmail(teacherData.email);
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeacher();
  }, [teacher_id]);

  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDeleteSelectedFile = () => {
    setSelectedFile(null);
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
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("teacher_name", teacher_name);
      formData.append("descr", descr);
      formData.append("department_id", department_id);
      formData.append("img", selectedFile);
      formData.append("email", email);

      const response = await axios.put(
        `${API_URL}/TeacherRoutes/updateTeacher/${teacher_id}`,
        formData, // Send the FormData object
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
          },
        }
      );
      setTeachers((prevAdd) =>
        prevAdd.map((data) => (data.id === teacher_id ? response.data : data))
      );
      Toastify({
        text: "Updated completely",
        duration: 3000, // Duration in milliseconds
        gravity: "top", // 'top' or 'bottom'
        position: "right", // 'left', 'center', 'right'
        backgroundColor: "#833988",
      }).showToast();
      navigate("/teacher");
    } catch (error) {
      console.log(`Error in fetch edit data: ${error}`);
    }
  };
  return (
    <>
      <NavBar title={"المواد"} />
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل معلم</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">اسم الاستاذ</p>
            <input
              type="text"
              className="input_addcourse"
              value={teacher_name}
              onChange={(e) => setTeacher_name(e.target.value)}
            />
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
              value={descr}
              onChange={(e) => setDescr(e.target.value)}
            ></textarea>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">البريد الإلكتروني</p>
            <input
              type="email"
              className="input_addcourse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />{" "}
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
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <button className="btn_addCourse px-5 py-2" onClick={handleUpdate}>
              حفظ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateTeacher;
