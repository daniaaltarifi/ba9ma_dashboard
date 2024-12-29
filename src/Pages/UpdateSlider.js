import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import { useNavigate, useLocation } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import axios from "axios";
import { API_URL } from "../App";
function UpdateSlider() {
  const [img, setImg] = useState(null);
  const [slider_img, setSlider_img] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [title, seTitle] = useState("");
  const [descr, setDescr] = useState("");
  const [page, setPage] = useState("");
  const [slider_id, setSlider_id] = useState("");
  const [btn_name, setBtn_name] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.id) {
      setSlider_id(location.state.id);
    } else {
      console.warn("No ID found in location.state");
    }
  }, [location.state]);
  useEffect(() => {
    // if (location.state && location.state.id) {
    const fetchslider = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/sliders/getsliderbyid/${slider_id}`
        );
        const contact = response.data;
        // Check if the response contains expected data
        if (Array.isArray(contact) && contact.length > 0) {
          const contactDetails = contact[0]; // Adjust based on actual data structure
          seTitle(contactDetails.title);
          setDescr(contactDetails.descr);
          setPage(contactDetails.page);
          setBtn_name(contactDetails.btn_name);
          setImg(contactDetails.img);
          setSlider_img(contactDetails.slider_img);
        } else {
          console.warn("No contact data available");
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      }
    };

    fetchslider();
  }, [slider_id]);
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };
  const handleslider_imgChange = (e) => {
    const file = e.target.files[0];
    setSlider_img(file);
  };
  const handleDeleteimg = () => {
    setImg(null);
  };
  const handleDeleteImg = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/sliders/deleteimgSlider/${slider_id}`
      );

      if (response.status === 200) {
        setImg(null); // Clear the image state
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      console.error("Failed to delete image:", error.message);
    }
  };
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("descr", descr);
      formData.append("page", page);
      formData.append("btn_name", btn_name);

      formData.append("img", img);
      formData.append("slider_img", slider_img);

      const response = await axios.put(
        `${API_URL}/sliders/updateSlider/${slider_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the state with the new slider data
      setSliders((prevAdd) =>
        prevAdd.map((data) => (data.id === slider_id ? response.data : data))
      );

      Toastify({
        text: "Updated completely",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#833988",
      }).showToast();

      navigate("/slider");
    } catch (error) {
      console.error(`Error in fetch edit data: ${error}`);
    }
  };

  useEffect(() => {
    const inputElement = document.getElementById("page_disabled");
    if (inputElement) {
      inputElement.disabled = true;
    }
  }, []);
  return (
    <>
      <NavBar title={"الصور"} />
      <div className="container ">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل صورة</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">العنوان</p>
            <input
              type="text"
              className="input_addcourse"
              value={title}
              onChange={(e) => seTitle(e.target.value)}
            />{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الصفحة</p>
            <input
              type="text"
              className="input_addcourse"
              id="page_disabled"
              value={page}
              onChange={(e) => setPage(e.target.value)}
            />{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">زر التنقل</p>
            <input
              type="text"
              className="input_addcourse"
              value={btn_name}
              onChange={(e) => setBtn_name(e.target.value)}
            />{" "}
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
                  className="fa-solid fa-square-xmark fa-lg mt-2"
                  onClick={handleDeleteImg}
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
            {slider_img && (
              <div className="d-flex justify-content-around">
                <p className="selected_file_addcourse">{slider_img.name}</p>
                <i
                  className="fa-solid fa-square-xmark fa-lg mt-2"
                  onClick={handleDeleteimg}
                  style={{ color: "#944b43" }}
                ></i>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-center align-items-center ">
            <button className="btn_addCourse px-5 py-2 " onClick={handleUpdate}>
              حفظ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateSlider;
