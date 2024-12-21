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
function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState(""); // State for modal title
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [courses, setCourses] = useState([]);
  const [lessonCounts, setLessonCounts] = useState([]);
  const [student_courseCount, setstudent_courseCount] = useState({});
  const [currentId, setCurrentId] = useState(null);

  const navigate = useNavigate();
  const handleOpenModal = (id) => {
    setCurrentId(id);
    setSmShow(true);
    setTitlePopup("حذف مادة"); // Set your modal title dynamically
    setDescriptionPopup("هل أنت متأكد من حذف هذا المادة ؟"); // Set your modal description dynamically
  };

  const handleCloseModal = () => {
    setSmShow(false);
  };
  const handleUpdate = (id) => {
    navigate('/updatecourse', { state: { id } });
  };
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/courses/");
        const data = response.data;
        setCourses(data);
        fetchStudentCountsCourses(data);
        fetchLessonCounts(data); // Ensure this function is defined elsewhere
      } catch (error) {
        console.log(`Error getting data from frontend: ${error}`);
      }
    };
    fetchCourses();
  }, []);

  const fetchStudentCountsCourses = async (courses) => {
    const counts = {};
    await Promise.all(
      courses.map(async (course) => {
        try {
          const response = await axios.get(
            `http://localhost:8080/courses/users-counts/${course.id}`
          );
          counts[course.id] = response.data.student_count;
        } catch (error) {
          console.error(
            `Error fetching student count for teacher ${course.id}:`,
            error
          );
        }
      })
    );
    setstudent_courseCount(counts);
  };

  const fetchLessonCounts = async (courses) => {
    try {
      const courseIds = courses.map((course) => course.id); // Use course_id for API request

      // Fetch lesson counts for all course IDs in parallel
      const courseCountPromises = courseIds.map((id) =>
        axios.get(`http://localhost:8080/courses/lesson-counts/${id}`)
      );
      const courseCountsResponses = await Promise.all(courseCountPromises);
      const courseCountsData = courseCountsResponses.map(
        (response) => response.data[0].lesson_count
      );

      // Combine course counts with course data
      const coursesWithCounts = courses.map((course, index) => ({
        ...course,
        lesson_count: courseCountsData[index] || 0,
      }));

      // Update state or do something with the augmented data
      setLessonCounts(coursesWithCounts);
    } catch (error) {
      console.error("Error fetching course counts:", error);
    }
  };
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
  // const handleDelete = async () => {
  //   try {
  //     await axios.delete(`http://localhost:8080/courses/delete/${currentId}`);

  //     // Remove the deleted department from state
  //     setCourses((prevData) =>
  //       prevData.filter((data) => data.id !== currentId)
  //     );

  //     Toastify({
  //       text: "course deleted successfully",
  //       duration: 3000,
  //       gravity: "top",
  //       position: "right",
  //       backgroundColor: "#F57D20",
  //     }).showToast();

  //     handleCloseModal(); // Close the modal after deletion
  //   } catch (error) {
  //     console.error("Error deleting department:", error);
  //   }
  // };
 
  const handleDelete = async (currentId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/courses/delete/${currentId}`);
      const { message, hasUsers } = response.data;
  
      if (hasUsers) {
        if (window.confirm("This course has associated users. Are you sure you want to delete it?")) {
          await axios.delete(`http://localhost:8080/courses/delete/${currentId}?force=true`);
          // Optionally, you may handle the deletion in the backend with a query parameter to force deletion.
          setCourses((prevData) => prevData.filter((data) => data.id !== currentId));
          Toastify({
            text: "Course deleted successfully",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#F57D20",
          }).showToast();
        }
      } else {
        if (window.confirm("Are you sure you want to delete this course?")) {
          setCourses((prevData) => prevData.filter((data) => data.id !== currentId));
          Toastify({
            text: "Course deleted successfully",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#F57D20",
          }).showToast();
        }
      }
      handleCloseModal(); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };
  
  
  
  
  
  
  
  return (
    <>
      <NavBar title={"المواد"} />
      <section classNameName="margin_section">
        <div className="container ">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 ">
              <Link to="/addcourse">
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
              <Table striped hover >
                <thead>
                  <tr className="table_head_cardprice">
                    <th className="desc_table_cardprice"> المادة</th>
                    <th className="desc_table_cardprice">الأستاذ </th>
                    {/* <th className="desc_table_cardprice">عدد الدروس </th> */}
                    <th className="desc_table_cardprice">عدد الطلاب</th>

                    <th className="desc_table_cardprice">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(dataToDisplay) &&
                    dataToDisplay.map((course) => (
                      <tr key={course.id}>
                        <td>{course.subject_name}</td>
                        <td>{course.teacher_name}</td>
                      
                        <td>
                          {student_courseCount[course.id] !== undefined
                            ? student_courseCount[course.id]
                            : "0"}
                        </td>
                        <td>
                          <i
                            className="fa-regular fa-pen-to-square fa-lg ps-2"
                            style={{ color: "#6dab93" }}
                            onClick={() => handleUpdate(course.id)}
                          ></i>
                          <i
                            className="fa-regular fa-trash-can fa-lg"
                            style={{ color: "#944b43" }}
                            onClick={() => handleDelete(course.id)}
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
