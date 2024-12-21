import React, { useState,useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/blog.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; 
import { useNavigate } from "react-router-dom";
function AddBlog() {
  const [tags, setTags] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayInfo, setDisplayInfo] = useState([  ]);
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [descr, setDescr] = useState("")
  const [department_id, setDepartment_id] = useState("")
  const [blogs, setBlogs] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDeleteSelectedFile = () => {
    setSelectedFile(null);
  };
  const handleAddButtonClick = () => {
    if (tags) {
      // Generate a unique ID (or use a library for unique IDs)
      const newId = Date.now();
  
      // Add the new tag to the existing list
      setDisplayInfo(prevInfo => [
        ...prevInfo,
        {
          id: newId, // Unique identifier for each tag
          title: tags,
        },
      ]);

      setTags("");
    }
  };
  
  const handleDeleteCourse = (id) => {
    const updatedDisplayInfo = displayInfo.filter((entry) => entry.id !== id);
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
    if (!title || !author || !descr || !department_id || !selectedFile || !displayInfo) {
      Toastify({
        text: "Please Fill All Field",
        duration: 3000,
        gravity: "top",
        position: 'right',
        backgroundColor: "#CA1616",
      }).showToast();
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('descr', descr);
      formData.append('department_id', department_id);
      formData.append('img', selectedFile);
      
      const tagsArray = Array.isArray(displayInfo) ? displayInfo.map(tag => tag.title) : [];
      tagsArray.forEach(tag => formData.append('tags[]', tag));
  
      const response = await axios.post(
        "http://localhost:8080/blog/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setBlogs(response.data);
      Toastify({
        text: "Added completely",
        duration: 3000,
        gravity: "top",
        position: 'right',
        backgroundColor: "#833988",
      }).showToast();
      navigate('/blogs');
    } catch (error) {
      console.log(`Error fetching post data ${error}`);
    }
  };
  

  return (
    <>
      <NavBar title={"مدونة بصمة"} />
      <div className="container ">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">اضافة مقال</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">عنوان المقال</p>
            <input type="text" className="input_addcourse" onChange={(e)=>setTitle(e.target.value)}/>{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">صاحب المقال</p>
            <input type="text" className="input_addcourse" onChange={(e)=>setAuthor(e.target.value)} />{" "}
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
              onChange={(e)=>setDescr(e.target.value)}
            ></textarea>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">اضف تاغ</p>
            <div className="input-wrapper">
              <input
                type="text"
                className="input_addtag"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <button
                type="button"
                className="btn_add_tag"
                onClick={handleAddButtonClick}
              >
                اضافة
              </button>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="entries_container d-flex flex-wrap justify-content-evenly">
            {displayInfo.map((entry) => (
  <div key={entry.id} className="entry">
    <div className="d-flex justify-content-between">
      <p className="tag_data">
        {entry.title}
        <i
          className="fa-solid fa-square-xmark fa-lg mt-2"
          onClick={() => handleDeleteCourse(entry.id)} // Ensure this is passing the correct ID
          style={{ color: "#944b43" }}
        ></i>
      </p>
    </div>
  </div>
))}

            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-12"></div>
            <div className="col-lg-8 col-md-6 col-sm-12">
              <p className="input_title_addcourse">اضف صورة </p>

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
          </div>

          <div className="d-flex justify-content-center align-items-center ">
            <button className="btn_addCourse px-5 py-2 mt-4 "onClick={handlePost}>اضافة</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddBlog;
