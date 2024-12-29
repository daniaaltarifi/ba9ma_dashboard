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
function DynamicBlog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState(""); // State for modal title
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [dynamicBlog, setDynamicBlog] = useState([]);
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState(null);

  const handleOpenModal = (id) => {
    setCurrentId(id);
    setSmShow(true);
    setTitlePopup("حذف عنوان المدونة"); // Set your modal title dynamically
    setDescriptionPopup("هل أنت متأكد من حذف عنوان المدونة ؟"); // Set your modal description dynamically
  };

  const handleCloseModal = () => {
    setSmShow(false);
  };
  const handleUpdate = (id) => {
    navigate("/updatedynamicblog", { state: { id } });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/dynamicBlogs/getDynamicBlogs`
        );
        const data = response.data;
        setDynamicBlog(data);
      } catch (error) {
        console.log(`Error getting data from frontend: ${error}`);
      }
    };
    fetchData();
  }, []);
  const dataToDisplay = searchQuery ? searchResults : dynamicBlog;
  return (
    <>
      <NavBar title={"عنوان المدونة "} />
      <section classNameName="margin_section">
        <div className="container ">
          <div className="row">

            {/* search */}
            <div className="col-lg-6 col-md-12 col-sm-12 ">
              {/* End search */}
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <Table striped hover>
                <thead>
                  <tr className="table_head_cardprice">
                    <th className="desc_table_cardprice">العنوان </th>
                    <th className="desc_table_cardprice"> الوصف</th>
                    <th className="desc_table_cardprice">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {dataToDisplay.map((dynamic) => (
                    <tr>
                      <td className="wrap-text">{dynamic.title} </td>
                      <td className="wrap-text"> {dynamic.descr}</td>

                      <td>
                        <i
                          class="fa-regular fa-pen-to-square fa-lg ps-2"
                          style={{ color: "#6dab93" }}
                          onClick={() => handleUpdate(dynamic.id)}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default DynamicBlog;
