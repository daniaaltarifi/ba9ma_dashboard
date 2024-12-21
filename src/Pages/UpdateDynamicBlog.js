import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { API_URL } from "../App";
function UpdateDynamicBlog() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dynamicBlogId, setDynamicBlogId] = useState("");
  const [title, setTitle] = useState("");
  const [descr, setDescr] = useState("");
  const [dynamicBlog, setDynamicBlog] = useState([]);
  useEffect(() => {
    // Check if location.state exists and contains the id
    if (location.state && location.state.id) {
      setDynamicBlogId(location.state.id);
    } else {
      console.warn("No ID found in location.state");
    }
  }, [location.state]);
  const handleUpdate = async () => {
    if (!title || !descr) {
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
        `${API_URL}/dynamicBlogs/updateDynamicBlog/${dynamicBlogId}`, // Use dynamicBlogId here
        { title, descr }
      );

      // Update the department data in state
      setDynamicBlog((prevAdd) =>
        prevAdd.map((data) => (data.id === dynamicBlogId ? response.data : data))
      );

      Toastify({
        text: "Updated successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();
      navigate("/dynamicblog");
    } catch (error) {
      console.log(`Error updating data: ${error}`);
    }
  };
  return (
    <>
      <NavBar title={" عنوان المدونة"} />
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل عنوان المدونة</div>
          </div>
        </div>
        <div className="row mt-4  d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">العنوان</p>
            <input
              type="text"
              className="input_addcourse"
              onChange={(e) => setTitle(e.target.value)}
            />{" "}
          </div>
        </div>

        <div className="row mt-4  d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الوصف</p>
            <input
              type="text"
              className="input_addcourse"
              onChange={(e) => setDescr(e.target.value)}
            />{" "}
          </div>

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

export default UpdateDynamicBlog;
