import React, { useState,useEffect } from "react";
import NavBar from "../component/NavBar";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import '../Css/search.css'
import Table from "react-bootstrap/Table";
import DeletePopUp from "../component/DeletePopUp";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; 
import Spinner from "react-bootstrap/Spinner";

function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState(""); // State for modal title
  const [descriptionPopup, setDescriptionPopup] = useState(""); 
  const [library, setLibrary] = useState([])
  const [currentId, setCurrentId] = useState(null); 
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const handleOpenModal = (id) => {
    setCurrentId(id);
    setSmShow(true);
    setTitlePopup("حذف كتاب"); // Set your modal title dynamically
    setDescriptionPopup("هل أنت متأكد من حذف هذا الكتاب ؟"); // Set your modal description dynamically
  };

  const handleCloseModal = () => {
    setSmShow(false);
  };
  const handleUpdate = (id) => {
    navigate('/updatelibrary', { state: { id } });
  };
  
  useEffect(()=>{
    const fetchLibrary = async () => {
      try {
        const response = await axios.get("http://localhost:8080/library/");
        setLibrary(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching library:", error);
      }
    };
fetchLibrary()
  },[])
  const handleInputChange = (event) => {
      const query = event.target.value;
      setSearchQuery(query);

      // Filter blogs based on search query
      const filteredResults = library.filter((lib) =>
        lib.book_name.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredResults);
    };
    const dataToDisplay = searchQuery ? searchResults : library;


  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/library/delete/${currentId}`
      );

      // Remove the deleted department from state
      setLibrary((prevData) =>
        prevData.filter((data) => data.id !== currentId)
      );

      Toastify({
        text: "Department deleted successfully",
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
      <NavBar title={"مكتبة بصمة "} />
      <section classNameName="margin_section">
        <div className="container ">
    
               <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12 ">
              <Link to="/addlibrary">
              <Button className="add_btn">
                <span className="plus_icon">+</span>
                اضف كتاب{" "}
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
                        <th className="desc_table_cardprice">اسم الكتاب </th>
                        <th className="desc_table_cardprice"> اسم الكاتب</th>
                        <th className="desc_table_cardprice">القسم</th>
                        <th className="desc_table_cardprice">عدد الصفحات </th>
                        <th className="desc_table_cardprice">التاريخ</th>

                        <th className="desc_table_cardprice">الإجراء</th>
                      </tr>
                    </thead>
                    {loading ? (
                  <div className="spinner-container">
                    <Spinner animation="border" variant="warning" />
                  </div>
                ) : (
                    <tbody>
                      {dataToDisplay.map((library)=>(
                      <tr>
                        <td>{library.book_name} </td>
                        <td> {library.author}</td>
                        <td>{library.department_name}</td>
                        <td>{library.page_num}</td>
                        <td>{library.created_date} </td>

                        <td>
                        <i class="fa-regular fa-pen-to-square fa-lg ps-2" style={{color:"#6dab93"}}   onClick={() => handleUpdate(library.id)}  ></i>
                        <i className="fa-regular fa-trash-can fa-lg" style={{color:"#944b43"}}   onClick={() => handleOpenModal(library.id)}
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
        <DeletePopUp  show={smShow}
        onHide={handleCloseModal}
        title={titlePopup}
        description={descriptionPopup}
        handleDelete={handleDelete}
        />
      </section>
    </>
  );
}

export default Library;
