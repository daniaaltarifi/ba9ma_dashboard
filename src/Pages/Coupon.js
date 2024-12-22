import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import "../Css/search.css";
import Table from "react-bootstrap/Table";
import DeletePopUp from "../component/DeletePopUp";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { API_URL } from "../App";

function Coupon() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState("");
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState(null);
  const [filterType, setFilterType] = useState("all"); // Filter type: 'all', 'course', 'department'

  // Fetch coupon data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [couponRes, deptRes, courseRes] = await Promise.all([
          axios.get(`${API_URL}/Coupons/getCoupons`),
          axios.get(`${API_URL}/departments/getDepartments`),
          axios.get(`${API_URL}/Courses`),
        ]);

        setCoupons(couponRes.data);
        setDepartments(deptRes.data);
        setCourses(courseRes.data);
      } catch (error) {
        console.log(`Error getting data from frontend: ${error}`);
      }
    };
    fetchData();
  }, []);

  // Handle modal operations
  const handleOpenModal = (id) => {
    setCurrentId(id);
    setSmShow(true);
    setTitlePopup("حذف كوبون");
    setDescriptionPopup("هل أنت متأكد من حذف هذا الكوبون؟");
  };

  const handleCloseModal = () => {
    setSmShow(false);
  };

  const handleUpdate = (id) => {
    navigate("/updatecoupon", { state: { id } });
  };

  // Handle coupon deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/Coupons/deleteCoupon/${currentId}`);
      setCoupons((prevData) =>
        prevData.filter((data) => data.id !== currentId)
      );
      Toastify({
        text: "Coupon deleted successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete(`${API_URL}/Coupons/deleteAllCoupons`);
      setCoupons([]);
      Toastify({
        text: "All coupons deleted successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();
    } catch (error) {
      console.error("Error deleting all coupons:", error);
    }
  };
  // Updated filtering logic
  const filteredCoupons = coupons.filter((coupon) => {
    const isCourse = coupon.coupon_type === "course" && coupon.course_id;
    const isDepartment =
      coupon.coupon_type === "department" && coupon.department_id;

    // Matching search query against coupon code or additional info (like course or department)
    const matchesSearch =
      coupon.coupon_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (isCourse &&
        courses.some(
          (course) =>
            course.id === coupon.course_id &&
            course.subject_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )) ||
      (isDepartment &&
        departments.some(
          (dept) =>
            dept.id === coupon.department_id &&
            dept.title.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    // Apply filter and search conditions
    if (filterType === "all") {
      return matchesSearch;
    } else if (filterType === "course") {
      return isCourse && matchesSearch;
    } else if (filterType === "department") {
      return isDepartment && matchesSearch;
    }
    return false;
  });

  // Use filteredCoupons for displaying data
  const dataToDisplay = filteredCoupons;

  // Render department title or course subject name
  const getAdditionalInfo = (coupon) => {
    if (coupon.coupon_type === "department") {
      const department = departments.find(
        (dept) => dept.id === coupon.department_id
      );
      return department ? department.title : "Unknown Department";
    } else if (coupon.coupon_type === "course") {
      const course = courses.find((cor) => cor.id === coupon.course_id);
      return course ? course.subject_name : "Unknown Course";
    }
    return "N/A";
  };

  const handleAddCoupon = () => {
    navigate("/addcoupon");
  };

  return (
    <>
      <NavBar title={"الكوبونات"} />
      <section className="margin_section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12">
              <Button className="add_btn" onClick={handleAddCoupon}>
                <span className="plus_icon">+</span>
                اضف كوبون
              </Button>
              <Button className="add_btn" onClick={handleDeleteAll}>
                <span className="plus_icon">-</span>
                حذف جميع الكوبونات
              </Button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="row mt-5">
            <div className="col-lg-6 col-md-6 col-sm-12 ">
              <div className="navbar__search">
                <span>
                  <i
                    className="fa-solid fa-magnifying-glass fa-sm"
                    style={{ color: "#833988" }}
                  ></i>{" "}
                </span>
                <input
                  type="text"
                  placeholder="ابحث عن   "
                  className="search_blog"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12">
              <select
                className="select_dep"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">الكل</option>
                <option value="course">مادة</option>
                <option value="department">قسم</option>
              </select>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <Table striped hover>
                <thead>
                  <tr className="table_head_cardprice">
                    <th className="desc_table_cardprice">الكوبون</th>
                    <th className="desc_table_cardprice">النوع</th>{" "}
                    {/* Display coupon_type */}
                    <th className="desc_table_cardprice">المعلومات</th>{" "}
                    {/* Additional info based on type */}
                    <th className="desc_table_cardprice">الاستخدام</th>{" "}
                    {/* Display used */}
                    <th className="desc_table_cardprice">
                      تاريخ انتهاء الكوبون
                    </th>{" "}
                    {/* Display expiration_date */}
                    <th className="desc_table_cardprice">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {dataToDisplay.map((couponData) => (
                    <tr key={couponData.id}>
                      <td>{couponData.coupon_code}</td>
                      <td>
                        {couponData.coupon_type === "course" ? "مادة" : "قسم"}
                      </td>
                      <td>{getAdditionalInfo(couponData)}</td>{" "}
                      {/* Display department or course info */}
                      <td>{couponData.used === true ? "مستخدم" : "غير مستخدم"}</td>{" "}
                      {/* Display used status */}
                      <td>
                        {new Date(
                          couponData.expiration_date
                        ).toLocaleDateString("ar-EG")}
                      </td>{" "}
                      {/* Format expiration_date */}
                      <td>
                        <i
                          className="fa-regular fa-pen-to-square fa-lg ps-2"
                          style={{ color: "#6dab93" }}
                          onClick={() => handleUpdate(couponData.id)}
                        ></i>
                        <i
                          className="fa-regular fa-trash-can fa-lg"
                          style={{ color: "#944b43" }}
                          onClick={() => handleOpenModal(couponData.id)}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <DeletePopUp
          show={smShow}
          onHide={handleCloseModal}
          title={titlePopup}
          description={descriptionPopup}
          handleDelete={handleDelete}
        />
      </section>
    </>
  );
}

export default Coupon;
