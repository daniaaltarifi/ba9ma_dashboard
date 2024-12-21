import React, { useEffect, useState } from "react";
import NavBar from "../component/NavBar";
import "../Css/order.css";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import DeletePopUp from "../component/DeletePopUp";
import Spinner from "react-bootstrap/Spinner";
import { API_URL } from "../App";

function Comments() {
  const [activeButton, setActiveButton] = useState("btn1");
  const [commentblog, setCommentblog] = useState([]);
  const [commentCourses, setCommentCourses] = useState([]);
  const [allComents, setAllComments] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState(""); // State for modal title
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [deleteFunction, setDeleteFunction] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  // Function to determine button color
  const getButtonColor = (buttonId) => {
    return activeButton === buttonId ? "#833988" : "#F57D20";
  };
  useEffect(() => {
    const fetchCommentBlogs = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/commentBlogs/getAllCommentBlogs`
        );
        setCommentblog(response.data);
        console.log("comment blog", response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs comments:", error);
      }
    };
    fetchCommentBlogs();
    const fetchCommentCourses = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/commentCourse/getAllCommentCourses`
        );
        setCommentCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs comments:", error);
      }
    };
    fetchCommentCourses();
    const fetchAllComment = async () => {
      try {
        const response = await axios.get(`${API_URL}/Comments/getComments`);
        setAllComments(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs comments:", error);
      }
    };
    fetchAllComment();
  }, []);
  const handleApproved = async (blogId) => {
    try {
      await axios.put(
        `${API_URL}/commentBlogs/updateActionCommentBlogs/${blogId}`,
        {
          action: "approved",
        }
      );
      const response = await axios.get(
        `${API_URL}/commentBlogs/getAllCommentBlogs`
      );
      setCommentblog(response.data);
    } catch (error) {
      console.error("Error updating blog status:", error);
    }
  };
  const handleApprovedCommentsCourse = async (courseid) => {
    try {
      await axios.put(
        `${API_URL}/commentCourse/updateActionCommentCourses/${courseid}`,
        {
          action: "approved",
        }
      );
      const response = await axios.get(
        `${API_URL}/commentCourse/getAllCommentCourses`
      );
      setCommentCourses(response.data);
    } catch (error) {
      console.error("Error updating comment status:", error);
    }
  };
  const handleApprovedComments = async (commentid) => {
    try {
      await axios.put(`${API_URL}/Comments/updateActionComment/${commentid}`, {
        action: "approved",
      });
      const response = await axios.get(
        `${API_URL}/Comments/getComments`
      );
      setAllComments(response.data);
    } catch (error) {
      console.error("Error updating comment status:", error);
    }
  };
  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`${API_URL}/commentCourse/deleteCommentCourse/${id}`);
      setCommentCourses((prevData) =>
        prevData.filter((data) => data.id !== id)
      );
      Toastify({
        text: "Comment deleted successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();

      handleCloseModal();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };
  const handleDeleteBlog = async (id) => {
    try {
      await axios.delete(`${API_URL}/commentBlogs/deleteCommentBlog/${id}`);
      setCommentblog((prevData) => prevData.filter((data) => data.id !== id));
      Toastify({
        text: "Comment deleted successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();

      handleCloseModal();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };
  const handleDeleteComments = async (id) => {
    try {
      await axios.delete(`${API_URL}/Comments/deleteComment/${id}`);
      setAllComments((prevData) => prevData.filter((data) => data.id !== id));
      Toastify({
        text: "Comment deleted successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();

      handleCloseModal();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };
  const handleCloseModal = () => {
    setSmShow(false);
  };
  return (
    <>
      <NavBar title={"التعليقات "} />
      <div className="container text-center">
        <div className="row">
          <div className="col-lg-12 col-md-6 col-sm-12 mb-4">
            <div className="d-flex cont_btn_order justify-content-center">
              <button
                className={`courses_dep px-5 py-4  `}
                style={{ backgroundColor: getButtonColor("btn1") }}
                onClick={() => handleClick("btn1")}
              >
                المدونة
              </button>

              <button
                className={`courses_dep px-5 py-4  `}
                style={{ backgroundColor: getButtonColor("btn2") }}
                onClick={() => handleClick("btn2")}
              >
                المواد
              </button>
              <button
                className={`courses_dep px-5 py-4  `}
                style={{ backgroundColor: getButtonColor("btn3") }}
                onClick={() => handleClick("btn3")}
              >
                تواصل معنا
              </button>
            </div>
          </div>

          {/* <div className="col-lg-9 col-md-12 col-sm-12"></div> */}
        </div>
        <div className="row">
          {activeButton === "btn1" ? (
            <Table striped hover>
              <thead>
                <tr className="table_head_cardprice">
                  <th className="desc_table_cardprice">الاسم</th>
                  <th className="desc_table_cardprice">الايميل</th>
                  <th className="desc_table_cardprice">المقال</th>
                  <th className="desc_table_cardprice">التعليق</th>
                  <th className="desc_table_cardprice">التاريخ</th>
                  <th className="desc_table_cardprice">الاجراء</th>
                </tr>
              </thead>
              {loading ? (
                <div className="spinner-container">
                  <Spinner animation="border" variant="warning" />
                </div>
              ) : (
                <tbody>
                  {commentblog.map((blog) => (
                    <tr>
                      <td>{blog.name}</td>
                      <td>{blog.email}</td>
                      <td>{blog.blog_name}</td>
                      <td>{blog.comment}</td>
                      <td>{blog.created_date}</td>
                      {blog.action === "approved" ? (
                        <td>
                          Approved
                          <i
                            className="fa-regular fa-trash-can fa-lg"
                            style={{ color: "#944b43" }}
                            onClick={() => handleDeleteBlog(blog.id)}
                          ></i>
                        </td>
                      ) : (
                        <td>
                          <button
                            type="button"
                            className="btn btn-success ms-2"
                            onClick={() => handleApproved(blog.id)}
                          >
                            قبول
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDeleteBlog(blog.id)}
                          >
                            رفض
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              )}
            </Table>
          ) : activeButton === "btn2" ? (
            <Table striped hover>
              <thead>
                <tr className="table_head_cardprice">
                  <th className="desc_table_cardprice">الاسم</th>
                  <th className="desc_table_cardprice">الايميل</th>
                  <th className="desc_table_cardprice">المادة </th>
                  <th className="desc_table_cardprice">التعليق</th>
                  <th className="desc_table_cardprice">التاريخ</th>
                  <th className="desc_table_cardprice">الاجراء</th>
                </tr>
              </thead>
              <tbody>
                {commentCourses.map((course) => (
                  <tr>
                    <td>{course.name}</td>
                    <td>{course.email}</td>
                    <td>{course.course_name}</td>
                    <td>{course.comment}</td>
                    <td>{course.created_date}</td>
                    {course.action === "approved" ? (
                      <td>
                        Approved
                        <i
                          className="fa-regular fa-trash-can fa-lg"
                          style={{ color: "#944b43" }}
                          onClick={() => handleDeleteCourse(course.id)}
                        ></i>
                      </td>
                    ) : (
                      <td>
                        <button
                          type="button"
                          className="btn btn-success ms-2"
                          onClick={() =>
                            handleApprovedCommentsCourse(course.id)
                          }
                        >
                          قبول
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          رفض
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Table striped hover>
              <thead>
                <tr className="table_head_cardprice">
                  <th className="desc_table_cardprice">الاسم </th>
                  <th className="desc_table_cardprice">الايميل</th>

                  <th className="desc_table_cardprice">التعليق</th>
                  <th className="desc_table_cardprice">التاريخ</th>
                  <th className="desc_table_cardprice">الاجراء</th>
                </tr>
              </thead>
              <tbody>
                {allComents.map((comment) => (
                  <tr>
                    <td>{comment.name}</td>
                    <td>{comment.email}</td>
                    {/* <td>{comment.comment}</td> */}
                    <td>{comment.comment.substring(0, 50)}</td>
                    <td>{comment.created_date}</td>
                    {comment.action === "approved" ? (
                      <td>
                        Approved
                        <i
                          className="fa-regular fa-trash-can fa-lg"
                          style={{ color: "#944b43" }}
                          onClick={() => handleDeleteComments(comment.id)}
                        ></i>
                      </td>
                    ) : (
                      <td>
                        <button
                          type="button"
                          className="btn btn-success ms-2"
                          onClick={() => handleApprovedComments(comment.id)}
                        >
                          قبول
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDeleteComments(comment.id)}
                        >
                          رفض
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
      {/* <DeletePopUp
          show={smShow}
          onHide={handleCloseModal}
          title={titlePopup}
          description={descriptionPopup}
        /> */}
    </>
  );
}

export default Comments;
