import React, { useState,useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; 
import { useNavigate } from "react-router-dom";

function AddLibrary() {
  const navigate = useNavigate();
  const [book_name, setBook_name] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayInfo, setDisplayInfo] = useState([]);
const [author, setAuthor] = useState("")
const [department_id, setDepartment_id] = useState("")
const [page_num, setPage_num] = useState("")
const [departmentData, setDepartmentData] = useState([])
const [library, setLibrary] = useState([])

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDeleteSelectedFile=()=>{
    setSelectedFile(null);
  }
    const handleDeleteCourse = (id) => {
    // Delete the selected course by its ID
    const updatedDisplayInfo = displayInfo.filter(course => course.id !== id);
    setDisplayInfo(updatedDisplayInfo);
  };
  const handleDepartment = (e) => {
    const selectedDepartmentId = e.target.value;
    setDepartment_id(selectedDepartmentId);
  };
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:8080/department");
        setDepartmentData(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);
  const handlePost = async () => {

    if (!book_name || !author || !department_id || !page_num || !selectedFile) {
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
      formData.append('book_name', book_name);
      formData.append('author', author);
      formData.append('department_id', department_id);
      formData.append('page_num', page_num);
      formData.append('file_book', selectedFile);
      const maxSize = 100 * 1024 * 1024; // 100 MB
      if (selectedFile.size > maxSize) {
        Toastify({
          text: "File size exceeds 100 MB",
          duration: 3000,
          gravity: "top",
          position: 'right',
          backgroundColor: "#CA1616",
        }).showToast();
        return;
      }
      const response = await axios.post(
        "http://localhost:8080/library/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLibrary(response.data);
      Toastify({
        text: "Added completely",
        duration: 3000, // Duration in milliseconds
        gravity: "top", // 'top' or 'bottom'
        position: 'right', // 'left', 'center', 'right'
        backgroundColor: "#833988",
      }).showToast();
      navigate('/library')

    } catch (error) {
      console.log(`Error fetching post data ${error}`);
    }
  };
  return (
    <>
      <NavBar title={"المكتبة"} />
      <div className="container ">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">اضافة كتاب</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">اسم الكتاب</p>
            <input type="text"value={book_name} className="input_addcourse" onChange={(e)=>setBook_name(e.target.value)}/>{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">اسم الكاتب</p>
            <input type="text"value={author} className="input_addcourse" onChange={(e)=>setAuthor(e.target.value)}/>{" "}
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
            <p className="input_title_addcourse">عدد الصفحات</p>
            <input type="text" value={page_num} className="input_addcourse" onChange={(e)=>setPage_num(e.target.value)}/>{" "}
          </div>
          <div className="col-lg-8 col-md-6 col-sm-12">
          <p className="input_title_addcourse">رفع الكتاب </p>

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
                  className="fa-solid fa-square-xmark fa-lg mt-2"onClick={handleDeleteSelectedFile}
                  style={{ color: "#944b43" }}
                ></i>
              </div>
            )}
            {/*End when add video display name of it */}
          </div>
          <div className="d-flex justify-content-center align-items-center ">

        <button className="btn_addCourse px-5 py-2 mt-5"onClick={handlePost}>اضافة</button>
          </div>
     
        </div>

      </div>

    
    </>
  );
}

export default AddLibrary;
