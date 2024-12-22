import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import { useLocation, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import axios from "axios";
import { API_URL } from "../App";

function UpdateLibrary() {
  const location = useLocation();
  const navigate = useNavigate();
  const [book_name, setBook_name] = useState("");
  const [author, setAuthor] = useState("");
  const [department_id, setDepartment_id] = useState(null);
  const [page_num, setPage_num] = useState("");
  const [libraryId, setLibraryId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayInfo, setDisplayInfo] = useState([]);
  const [library, setLibrary] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  const handleDepartment = (e) => {
    const selectedDepartmentId = e.target.value;
    setDepartment_id(selectedDepartmentId);
  };

  useEffect(() => {
    // Check if location.state exists and contains the id
    if (location.state && location.state.id) {
      setLibraryId(location.state.id);
    } else {
      console.warn("No ID found in location.state");
    }
  }, [location.state]);
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

  // Fetch library details when the component mounts
  useEffect(() => {
    if (location.state && location.state.id) {
      setLibraryId(location.state.id);

      const fetchLibrary = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/Libraries/getLibrary/${location.state.id}`
          );
          const library = response.data;
          setBook_name(library.book_name);
          setAuthor(library.author);
          setDepartment_id(library.department_id);
          setPage_num(library.page_num);
          // Handle the current file URL if needed (not shown in this code)
        } catch (error) {
          console.error("Error fetching library data:", error);
        }
      };

      fetchLibrary();
    } else {
      console.warn("No ID found in location.state");
    }
  }, [location.state]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDeleteSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("book_name", book_name);
      formData.append("author", author);
      formData.append("department_id", department_id);
      formData.append("page_num", page_num); // Append the selected image file
      formData.append("file_book", selectedFile); // Append the selected image file

      const response = await axios.put(
        `${API_URL}/Libraries/updateLibrary/${libraryId}`,
        formData, // Send the FormData object
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
          },
        }
      );
      setLibrary((prevAdd) =>
        prevAdd.map((data) => (data.id === libraryId ? response.data : data))
      );
      Toastify({
        text: "Updated completely",
        duration: 3000, // Duration in milliseconds
        gravity: "top", // 'top' or 'bottom'
        position: "right", // 'left', 'center', 'right'
        backgroundColor: "#5EC693",
      }).showToast();
      navigate("/library");
    } catch (error) {
      console.log(`Error in fetch edit data: ${error}`);
    }
  };
  return (
    <>
      <NavBar title={"مكتبة بصمة"} />
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل كتاب</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">اسم الكتاب</p>
            <input
              type="text"
              className="input_addcourse"
              value={book_name}
              onChange={(e) => setBook_name(e.target.value)}
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">اسم الكاتب</p>
            <input
              type="text"
              className="input_addcourse"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">القسم</p>
            <select
              name="department"
              value={department_id}
              onChange={(e) => setDepartment_id(e.target.value)}
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
            <input
              type="text"
              className="input_addcourse"
              value={page_num}
              onChange={(e) => setPage_num(e.target.value)}
            />
          </div>
          <div className="col-lg-8 col-md-6 col-sm-12">
            <p className="input_title_addcourse">رفع الكتاب</p>
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
            <button
              className="btn_addCourse px-5 py-2 mt-5"
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

export default UpdateLibrary;
