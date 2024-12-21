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
import Spinner from "react-bootstrap/Spinner";

function Teacher() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState("");
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [teacherId, settecherId] = useState(null);
  const [student_teacherCount, setstudent_teacherCount] = useState({});
  const [teachersWithCourseCounts, setTeachersWithCourseCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const handleOpenModal = (id) => {
    setSmShow(true);
    setCurrentId(id);
    setTitlePopup("حذف معلم"); // Set your modal title dynamically
    setDescriptionPopup("هل أنت متأكد من حذف هذا المعلم ؟"); // Set your modal description dynamically
  };

  const handleCloseModal = () => {
    setSmShow(false);
  };
  const handleUpdate = (id) => {
    navigate("/updateteacher", { state: { id } });
  };
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter blogs based on search query
    const filteredResults = teachers.filter((lib) =>
      lib.teacher_name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredResults);
  };
  const dataToDisplay = searchQuery ? searchResults : teachersWithCourseCounts;
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/teacher/"
        );
        const teachersData = response.data;
        setTeachers(teachersData);

        // Fetch counts after setting teachers
        fetchStudentCounts(teachersData);
        fetchCourseCountsForAllTeachers(teachersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  // Fetch student counts for each teacher
  const fetchStudentCounts = async (teachers) => {
    const counts = {};
    await Promise.all(
      teachers.map(async (teacher) => {
        try {
          const response = await axios.get(
            `http://localhost:8080/teacher/student-counts/${teacher.id}`
          );
          counts[teacher.id] = response.data.student_count;
        } catch (error) {
          console.error(
            `Error fetching student count for teacher ${teacher.id}:`,
            error
          );
        }
      })
    );
    setstudent_teacherCount(counts);
  };

  // Fetch course counts for each teacher
  const fetchCourseCountsForAllTeachers = async (teachersData) => {
    try {
      const teacherIds = teachersData.map((teacher) => teacher.id); // Assuming 'id' is the teacher's unique identifier

      // Fetch course counts for all teacher IDs in parallel
      const courseCountPromises = teacherIds.map((id) =>
        axios.get(`http://localhost:8080/courses/course-counts/${id}`)
      );

      const courseCountsResponses = await Promise.all(courseCountPromises);
      const courseCountsData = courseCountsResponses.map(
        (response) => response.data[0].course_count
      ); // Adjust as needed

      // Combine teacher data with course counts
      const teachersWithCounts = teachersData.map((teacher, index) => ({
        ...teacher,
        course_count: courseCountsData[index],
      }));

      setTeachersWithCourseCounts(teachersWithCounts);
    } catch (error) {
      console.error("Error fetching course counts:", error);
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/teacher/delete/${currentId}`
      );

      // Remove the deleted department from state
      setTeachers((prevData) =>
        prevData.filter((data) => data.id !== currentId)
      );
      window.location.reload();
      Toastify({
        text: "teacher deleted successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();

      handleCloseModal(); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };
  return (
    <>
      <NavBar title={"معلمو بصمة"} />
      <section classNameName="margin_section">
        <div className="container ">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 ">
              <Link to="/addteacher">
                <Button className="add_btn">
                  <span className="plus_icon">+</span>
                  اضف معلم{" "}
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
                    <th className="desc_table_cardprice">الأستاذ </th>
                    {/* <th className="desc_table_cardprice"> المادة</th> */}
                    <th className="desc_table_cardprice">الوصف</th>
                    <th className="desc_table_cardprice">الايميل</th>
                    <th className="desc_table_cardprice">عدد المواد </th>
                    <th className="desc_table_cardprice">عدد الطلاب</th>

                    <th className="desc_table_cardprice">الإجراء</th>
                  </tr>
                </thead>
                {loading ? (
                  <div className="spinner-container">
                    <Spinner animation="border" variant="warning" />
                  </div>
                ) : (
                  <tbody>
                    {dataToDisplay.map((teacher) => (
                      <tr key={teacher.id}>
                        <td>{teacher.teacher_name} </td>
                        {/* <td> محمد أحمد</td> */}
                        <td>{teacher.descr}</td>
                        <td>{teacher.email}</td>
                        <td>
                          {teacher.course_count !== undefined
                            ? teacher.course_count
                            : "0"}
                        </td>
                        <td>
                          {student_teacherCount[teacher.id] !== undefined
                            ? student_teacherCount[teacher.id]
                            : "0"}
                        </td>

                        <td>
                          <i
                            class="fa-regular fa-pen-to-square fa-lg ps-2"
                            style={{ color: "#6dab93" }}
                            onClick={() => handleUpdate(teacher.id)}
                          ></i>
                          <i
                            className="fa-regular fa-trash-can fa-lg"
                            style={{ color: "#944b43" }}
                            onClick={() => handleOpenModal(teacher.id)}
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
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

export default Teacher;
