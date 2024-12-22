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
import { API_URL } from "../App";

function Blogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState(""); // State for modal title
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const handleOpenModal = (id) => {
    setSmShow(true);
    setCurrentId(id);
    setTitlePopup("حذف مقال");
    setDescriptionPopup("هل أنت متأكد من حذف هذا المقال ؟");
   };

  const handleCloseModal = () => {
    setSmShow(false);
  };
  const handleUpdate = (id) => {
    navigate('/updateblog', { state: { id } });
  };
  
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter blogs based on search query
    const filteredResults = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredResults);
  };
  const dataToDisplay = searchQuery ? searchResults : blogs;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/blog/All-blogs`);
        setBlogs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchBlogs();
  }, []);
  const handleApproved = async (blogId) => {
    try {
      // Update the blog status in the database using PUT
      await axios.put(`${API_URL}/blog/updateActionBlogs/${blogId}`, {
        action: "approved",
      });

      // Fetch the updated list of blogs
      const response = await axios.get(`${API_URL}/blog/All-blogs`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error updating blog status:", error);
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/blog/delete-blog/${currentId}`);

      // Remove the deleted department from state
      setBlogs((prevData) => prevData.filter((data) => data.id !== currentId));

      Toastify({
        text: "Blog deleted successfully",
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
  return (
    <>
      <NavBar title={"مدونة بصمة"} />
      <section classNameName="margin_section">
        <div className="container ">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 ">
              <Link to="/addblog">
                <Button className="add_btn">
                  <span className="plus_icon">+</span>
                  اضف مقالا{" "}
                </Button>
              </Link>
            </div>

            {/* search */}
            <div className="col-lg-6 col-md-12 col-sm-12 ">
              <div className="navbar__search search_blog_cont">
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
                    <th className="desc_table_cardprice">عنوان المقال </th>
                    <th className="desc_table_cardprice"> صاحب المقال</th>
                    <th className="desc_table_cardprice">القسم</th>
                    <th className="desc_table_cardprice">النص </th>
                    <th className="desc_table_cardprice">الموافقة </th>
                    <th className="desc_table_cardprice">الإجراء</th>
                  </tr>
                </thead>
                {loading ? (
                  <div className="spinner-container">
                    <Spinner animation="border" variant="warning" />
                  </div>
                ) : (
                <tbody>
                  {dataToDisplay.map((blog) => (
                    <tr key={blog.id}>
                      <td>{blog.title} </td>
                      <td> {blog.author}</td>
                      <td>{blog.Department.title}</td>
                      <td>{blog.descr}</td>
                      {blog.action === "approved" ? (
                      <td>
 Approved
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
                          <button type="button" className="btn btn-danger"  onClick={() => handleOpenModal(blog.id)}>
                            رفض
                          </button>
                        </td>
                      )}

                      <td>
                        <i
                          class="fa-regular fa-pen-to-square fa-lg ps-2"
                          style={{ color: "#6dab93" }}
                          onClick={() => handleUpdate(blog.id)}                        ></i>
                        <i
                          className="fa-regular fa-trash-can fa-lg"
                          style={{ color: "#944b43" }}
                          onClick={() => handleOpenModal(blog.id)}
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

export default Blogs;
