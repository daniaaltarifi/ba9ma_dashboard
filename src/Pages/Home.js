import SideBar from "../component/SideBar.js";
import NavBar from "../component/NavBar.js";
import "../Css/home.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../App.js";
function Home() {
  const [departmentData, setDepartmentData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);

  const length = [
    {
      id: 1,
      title: "الأقسام",
      numLength: departmentData.length,
      link: "/department",
    },
    {
      id: 2,
      title: "المواد",
      numLength: coursesData.length,
      link: "/courses",
    },
    {
      id: 3,
      title: "الطلاب",
      numLength: users.length,
      link: "/users",
    },
    {
      id: 4,
      title: "المعلمين",
      numLength: teachers.length,
      link: "/teacher",
    },
    {
      id: 5,
      title: "الكتب",
      numLength: libraries.length,
      link: "/library",
    },
    {
      id: 6,
      title: "المقالات",
      numLength: blogs.length,
      link: "/blogs",
    },
    {
      id: 7,
      title: "التعليقات",
      numLength: comments.length,
      link: "/comments",
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          departmentResponse,
          coursesResponse,
          usersResponse,
          teachersResponse,
          libraryResponse,
          blogResponse,
          commentsResponse,
        ] = await Promise.all([
          axios.get(`${API_URL}/departments/getDepartments`),
          axios.get(`${API_URL}/Courses`),
          axios.get(`${API_URL}/users/getUserByRole/student`),
          axios.get(`${API_URL}/TeacherRoutes`),
          axios.get(`${API_URL}/Libraries/getLibraries`),
          axios.get(`${API_URL}/blog/All-blogs`),
          axios.get(`${API_URL}/Comments/getComments`),
        ]);
        const usersData = usersResponse.data;
        const student = usersData.filter((user) => user.role === "student");
        setDepartmentData(departmentResponse.data);
        setCoursesData(coursesResponse.data);
        setUsers(student);
        setTeachers(teachersResponse.data);
        setLibraries(libraryResponse.data);
        setBlogs(blogResponse.data);
        setComments(commentsResponse.data);
      } catch (error) {
        console.log(`Error getting data from frontend: ${error}`);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <NavBar title="الاحصاءات" />
      <section className="margin_section">
        <div className="container-fluid">
          <div className="row d-flex justify-content-center align-items-center">
            {length.map((card) => (
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={card.id}>
                <Link
                  to={card.link}
                  className="box_home d-flex  align-items-center text-center"
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={require("../assets/department.png")}
                    alt="department"
                    className="img-fluid icon_home"
                  />
                  <p className="title_section_home">{card.title}</p>
                  <p className="num_length_home">{card.numLength}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
