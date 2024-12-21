import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";

function AddCouponCode() {
  const [coupon_code, setCoupon_code] = useState("");
  const [coupon_type, setCoupon_type] = useState("course"); // Default to 'course'
  const [expiration_date, setExpiration_date] = useState(""); // State for expiration date
  const [departmentData, setDepartmentData] = useState([]);
  const [department_id, setDepartmentId] = useState("");
  const [coursesData, setCoursesData] = useState([]);
  const [course_id, setCourseId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_URL}/departments/getDepartments`);
       setDepartmentData(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
   
      const fetchCourses = async () => {
        try {
          const response = await axios.get(`${API_URL}/Courses`);
          setCoursesData(response.data);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };
      fetchCourses();
    
  }, []);

  const handleDepartment = (e) => {
    const selectedDepartmentId = e.target.value;
    setDepartmentId(selectedDepartmentId);
    setCourseId(""); // Clear selected course when department changes
  };

  const handleCourses = (e) => {
    const selectedCourseId = e.target.value;
    setCourseId(selectedCourseId);
    setDepartmentId("");

  };

  const handlePost = async () => {
    if (!expiration_date ||!coupon_code || (coupon_type === "department" && !department_id )|| (coupon_type === "course" && !course_id) ) {
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
      const response = await axios.post(
        `${API_URL}/Coupons/addCoupon`,
        { coupon_code, coupon_type, expiration_date, department_id, course_id }
      );
      Toastify({
        text: "Added successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();
      navigate('/coupon');
    } catch (error) {
      console.log(`Error fetching post data ${error}`);
    }
  };

  return (
    <>
      <NavBar title={"الكوبونات"} />
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">اضافة كوبون</div>
          </div>
        </div>
        <div className="row mt-4 d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">رمز الكوبون</p>
            <input
              type="text"
              className="input_addcourse"
              onChange={(e) => setCoupon_code(e.target.value)}
            />
          </div>
        </div>

        <div className="row mt-4 d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">حدد نوع الكوبون</p>
            <select
              className="input_addcourse"
              value={coupon_type}
              onChange={(e) => setCoupon_type(e.target.value)}
            >
              <option value="course">مادة</option>
              <option value="department">قسم</option>
            </select>
          </div>
        </div>
        {coupon_type === "department" && (
        <div className="row mt-4 d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">القسم</p>
            <select
              name="department"
              value={department_id}
              onChange={handleDepartment}
              className="input_addcourse"
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
 )}
        {coupon_type === "course" && (
          <div className="row mt-4 d-flex justify-content-center align-items-center">
            <div className="col-lg-4 col-md-6 col-sm-12">
              <p className="input_title_addcourse">مادة</p>
              <select
                name="course"
                value={course_id}
                onChange={handleCourses}
                className="input_addcourse"
              >
                <option value="">اختر مادة</option>
                {coursesData.map((cor) => (
                  <option key={cor.id} value={cor.id}>
                    {cor.subject_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}


        <div className="row mt-4 d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">تاريخ انتهاء الكوبون</p>
            <input
              type="date"
              className="input_addcourse"
              value={expiration_date}
              onChange={(e) => setExpiration_date(e.target.value)}
            />
          </div>
        </div>

        <div className="row mt-4 d-flex justify-content-center align-items-center">
          <div className="d-flex justify-content-center align-items-center">
            <button
              className="btn_addCourse px-5 py-2 mt-5"
              onClick={handlePost}
            >
              اضافة
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCouponCode;