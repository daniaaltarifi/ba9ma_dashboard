import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import { useNavigate, useLocation } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; 
import axios from "axios";
import { API_URL } from "../App";

function UpdateAbout() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [descr, setDescr] = useState("");
  const [about_id, setAbout_id] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.id) {
      setAbout_id(location.state.id);
      fetchAboutData(location.state.id);
    } else {
      console.warn('No ID found in location.state');
    }
  }, [location.state]);

  const fetchAboutData = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/abouts/getaboutById/${id}`);
      const { title, descr, img } = response.data;
      setTitle(title);
      setDescr(descr);
      setSelectedFile(img); // Optionally, you might want to show the existing image or handle it differently
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

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

      // Only append the fields that have been modified
      if (title) formData.append('title', title);
      if (descr) formData.append('descr', descr);
      if (selectedFile && typeof selectedFile !== 'string') {
        formData.append('img', selectedFile);
      }

      const response = await axios.put(
        `${API_URL}/abouts/updateabout/${about_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Toastify({
        text: "Updated successfully",
        duration: 3000,
        gravity: "top",
        position: 'right',
        backgroundColor: "#833988",
      }).showToast();

      navigate('/boxslider');
    } catch (error) {
      console.log(`Error in updating data: ${error}`);
    }
  };

  return (
    <>
      <NavBar title={"عن بصمة"} />
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل عن بصمة</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">العنوان</p>
            <input
              type="text"
              className="input_addcourse"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الوصف</p>
            <textarea
              className="input_textarea_addcourse"
              value={descr}
              onChange={(e) => setDescr(e.target.value)}
            ></textarea>
          </div>
          <div className="col-lg-8 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الصورة</p>
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
                <p className="selected_file_addcourse">
                  {typeof selectedFile === 'string' ? selectedFile : selectedFile.name}
                </p>
                <i
                  className="fa-solid fa-square-xmark fa-lg mt-2"
                  onClick={handleDeleteSelectedFile}
                  style={{ color: "#944b43" }}
                ></i>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-center align-items-center ">
            <button className="btn_addCourse px-5 py-2" onClick={handleUpdate}>حفظ</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateAbout;