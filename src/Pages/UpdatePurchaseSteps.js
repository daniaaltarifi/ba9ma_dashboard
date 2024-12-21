import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import { useNavigate, useLocation } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import axios from "axios";
import { API_URL } from "../App";
function UpdatePurchaseSteps() {
  const [img, setImg] = useState(null);

  const [purchasesteps, setPurchasesteps] = useState([]);
  const [title, seTitle] = useState("");
  const [descr, setDescr] = useState("");
  const [purchase_id, setpurchase_id] = useState("");
  const location = useLocation();

//   useEffect(() => {
//     // Check if location.state exists and contains the id
//     if (location.state && location.state.page) {
//       setpurchase_id(location.state.page);
//     } else {
//       console.warn("No ID found in location.state");
//     }
//   }, [location.state]);
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };

  const handleDeleteimg = () => {
    setImg(null);
  };

  useEffect(() => {
    if (location.state && location.state.id) {
        setpurchase_id(location.state.id);
      const fetchPurchase = async () => {
        try {
          const response = await axios.get(`${API_URL}/purchasesteps/PurchaseStepsbyid/${location.state.id}`);
          const contact = response.data;
console.log("first contact: " , contact)
          // Check if the response contains expected data
          if (Array.isArray(contact) && contact.length > 0) {
            const contactDetails = contact[0]; // Adjust based on actual data structure
            seTitle(contactDetails.title);
            setDescr(contactDetails.descr);
            setImg(contactDetails.img);
           
          } else {
            console.warn('No contact data available');
          }
        } catch (error) {
          console.error('Error fetching contact data:', error);
        }
      };

      fetchPurchase();
    } else {
      console.warn('No ID found in location.state');
    }
  }, [location.state]);
  const handleUpdate = async () => {
    if (!purchase_id || !img || !title || !descr) {
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
      formData.append("title", title);
      formData.append("descr", descr);
      formData.append("img", img);

      const response = await axios.put(
        `${API_URL}/purchasesteps/update/${purchase_id}`,
        formData, // Send the FormData object
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
          },
        }
      );
      setPurchasesteps((prevAdd) =>
        prevAdd.map((data) => (data.id === purchase_id ? response.data : data))
      );
      Toastify({
        text: "Updated completely",
        duration: 3000, // Duration in milliseconds
        gravity: "top", // 'top' or 'bottom'
        position: "right", // 'left', 'center', 'right'
        backgroundColor: "#833988",
      }).showToast();
      navigate("/purchasesteps");
    } catch (error) {
      console.log(`Error in fetch edit data: ${error}`);
    }
  };
 
  return (
    <>
      <NavBar title={"خطوة الشراء"} />
      <div className="container ">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل خطوة الشراء</div>
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
         
          {/* <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">اسم المادة</p>
            <input type="text" className="input_addcourse" />{" "}
          </div> */}
          {/* <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">القسم </p>
            <select
              name="department"
              value={purchase_id}
              onChange={handleDepartment}
              id="lang"
              className="select_dep"
            >
              <option value="">اختر قسم</option>
              {sliderData.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.title}
                </option>
              ))}
            </select>
          </div> */}
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
            <p className="input_title_addcourse">صورة  </p>

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

export default UpdatePurchaseSteps;
