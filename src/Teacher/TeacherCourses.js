import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import "../Css/search.css";
import Table from "react-bootstrap/Table";
import DeletePopUp from "../component/DeletePopUp";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; 
import { API_URL } from "../App";
function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState(""); // State for modal title
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [courses, setCourses] = useState([]);
  const [lessonCounts, setLessonCounts] = useState([]);
  const [student_courseCount, setstudent_courseCount] = useState({});
  const teacherId = localStorage.getItem('email');//return email as teacherid
  const [currentId, setCurrentId] = useState(null); 

  const navigate = useNavigate();
  const handleOpenModal = (id) => {
    setCurrentId(id)
    setSmShow(true);
    setTitlePopup("حذف مادة"); // Set your modal title dynamically
    setDescriptionPopup("هل أنت متأكد من حذف هذا المادة ؟"); // Set your modal description dynamically
  };

  const handleCloseModal = () => {
    setSmShow(false);
  };
  const handleUpdate = (id) => {
    navigate('/teacherupdatecourses', { state: { id } });
  };
  useEffect(() => {
    const fetchCourses = async () => {
            if (!teacherId) {
        console.error('Teacher ID not found in local storage');
        return;
      }
      
      try {
        const response = await axios.get(`${API_URL}/TeacherRoutes/teachercourse/${teacherId}`);
        const data = response.data;
        setCourses(data);
      
      } catch (error) {
        console.log(`Error getting data from frontend: ${error}`);
      }
    };

    fetchCourses();
  }, []);

 

  useEffect(() => {
  }, [lessonCounts]);

  const dataToDisplay = searchQuery ? searchResults : courses;
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filteredResults = courses.filter((course) =>
      course.subject_name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredResults);
  };
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_URL}/TeacherRoutes/deletecourseteacher/${currentId}`
      );

      // Remove the deleted department from state
      setCourses((prevData) =>
        prevData.filter((data) => data.id !== currentId)
      );

      Toastify({
        text: "Course deleted successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();

      handleCloseModal(); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting Course:", error);
    }
  };

  return (
    <>
      <NavBar title={"المواد"} />
      <section classNameName="margin_section">
        <div className="container ">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 ">
              <Link to="/teacheraddcourses">
                <Button className="add_btn">
                  <span className="plus_icon">+</span>
                  اضف مادة{" "}
                </Button>
              </Link>
            </div>

            {/* search */}
            <div className="col-lg-6 col-md-12 col-sm-12 ">
              <div className="navbar__search">
                <span>
                  <i
                    className="fa-solid fa-magnifying-glass fa-sm"
                    style={{ color: "#833988" }}
                  ></i>{" "}
                </span>
                <input
                  type="text"
                  placeholder="ابحث عن "
                  value={searchQuery}
                  className="search_blog"
                  onChange={handleInputChange}
                />
                <a
                  className="btn btn-s purple_btn search_btn_blog"
                  onChange={handleInputChange}
                >
                  بحث{" "}
                </a>
           
              </div>

              {/* End search */}
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <Table striped hover>
                <thead>
                  <tr className="table_head_cardprice">
                    <th className="desc_table_cardprice"> المادة</th>
                    <th className="desc_table_cardprice">القسم </th>
                    <th className="desc_table_cardprice">السعر قبل الخصم </th>
                    <th className="desc_table_cardprice">السعر بعد الخصم</th>
                    <th className="desc_table_cardprice">الوصف</th>

                    <th className="desc_table_cardprice">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(dataToDisplay) &&
                    dataToDisplay.map((course) => (
                      <tr key={course.id}>
                        <td>{course.subject_name}</td>
                        <td>{course.department_name}</td>
                        <td>{course.before_offer}</td>

                        <td>{course.after_offer}</td>

                        <td>{course.descr}</td>
                        <td>
                          <i
                            className="fa-regular fa-pen-to-square fa-lg ps-2"
                            style={{ color: "#6dab93" }}
                            onClick={() => handleUpdate(course.id)}
                          ></i>
                          <i
                            className="fa-regular fa-trash-can fa-lg"
                            style={{ color: "#944b43" }}
                            onClick={() => handleOpenModal(course.id)}
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

export default Courses;
