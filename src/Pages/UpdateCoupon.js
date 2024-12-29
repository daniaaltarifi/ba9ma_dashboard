import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { API_URL } from "../App";

function UpdateCoupon() {
  const navigate = useNavigate();
  const location = useLocation();
  const [couponId, setCouponId] = useState("");
  const [coupon_code, setCoupon_code] = useState("");
  const [coupon_type, setCoupon_type] = useState("course");
  const [expiration_date, setExpiration_date] = useState("");
  const [course_id, setCourse_id] = useState("");
  const [department_id, setDepartment_id] = useState("");
  const [departmentData, setDepartmentData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state && location.state.id) {
      setCouponId(location.state.id);
    }
  }, [location.state]);

  useEffect(() => {
    if (!couponId) return;

    const fetchCoupon = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/Coupons/getCoupons/${couponId}`
        );
        const contact = response.data;

        if (Array.isArray(contact) && contact.length > 0) {
          const contactDetails = contact[0]; // Adjust based on actual data structure
          setCoupon_code(contactDetails.coupon_code);
          setCoupon_type(contactDetails.coupon_type);
          setCourse_id(contactDetails.course_id || "");
          setDepartment_id(contactDetails.department_id || "");
          const formattedDate = new Date(contactDetails.expiration_date)
            .toISOString()
            .split("T")[0];
          setExpiration_date(formattedDate);
        } else {
          console.warn("No contact data available");
        }
      } catch (err) {
        console.log(err);
        // setError("Error fetching coupon");
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        const [deptRes, courseRes] = await Promise.all([
          axios.get(`${API_URL}/departments/getDepartments`),
          axios.get(`${API_URL}/Courses`),
        ]);

        setDepartmentData(deptRes.data);
        setCoursesData(courseRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchCoupon();
    fetchData();
  }, [couponId]);

  const handleUpdate = async () => {
    if (
      !coupon_code ||
      (coupon_type === "department" && !department_id) ||
      (coupon_type === "course" && !course_id)
    ) {
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
      await axios.put(`${API_URL}/Coupons/updateCoupon/${couponId}`, {
        coupon_code,
        coupon_type,
        expiration_date,
        course_id,
        department_id,
      });

      Toastify({
        text: "Updated successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();

      navigate("/coupon");
    } catch (error) {
      Toastify({
        text: "Error updating coupon",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#CA1616",
      }).showToast();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <NavBar title={"الكوبونات"} />
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل كوبون</div>
          </div>
        </div>

        <div className="row mt-4 d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">رمز الكوبون</p>
            <input
              type="text"
              className="input_addcourse"
              value={coupon_code}
              onChange={(e) => setCoupon_code(e.target.value)}
            />
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <p className="input_title_addcourse">نوع الكوبون</p>
            <select
              className="input_addcourse"
              value={coupon_type}
              onChange={(e) => setCoupon_type(e.target.value)}
            >
              <option value="course">مادة</option>
              <option value="department">قسم</option>
            </select>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
            <p className="input_title_addcourse">تاريخ انتهاء الكوبون</p>
            <input
              type="date"
              className="input_addcourse"
              value={expiration_date}
              onChange={(e) => setExpiration_date(e.target.value)}
            />
          </div>
        </div>

        {coupon_type === "department" && (
          <div className="row mt-4 d-flex justify-content-center align-items-center">
            <div className="col-lg-4 col-md-6 col-sm-12">
              <p className="input_title_addcourse">القسم</p>
              <select
                value={department_id}
                onChange={(e) => setDepartment_id(e.target.value)}
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
                value={course_id}
                onChange={(e) => setCourse_id(e.target.value)}
                className="input_addcourse"
              >
                <option value="">اختر مادة</option>
                {coursesData.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.subject_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="row mt-4 d-flex justify-content-center align-items-center">
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

export default UpdateCoupon;
