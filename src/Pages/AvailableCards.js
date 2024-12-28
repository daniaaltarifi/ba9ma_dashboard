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
import { API_URL } from "../App";
function AvailableCards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState(""); // State for modal title
  const [descriptionPopup, setDescriptionPopup] = useState(""); 
  const [availableCards, setAvailableCards] = useState([])
  const [currentId, setCurrentId] = useState(null); 

  const navigate = useNavigate();
  const handleOpenModal = (id) => {
    setCurrentId(id);
    setSmShow(true);
    setTitlePopup("حذف المكتبة"); // Set your modal title dynamically
    setDescriptionPopup("هل أنت متأكد من حذف هذه لمكتبة ؟"); // Set your modal description dynamically
  };

  const handleCloseModal = () => {
    setSmShow(false);
  };
  const handleUpdate = (id) => {
    navigate('/updateavailablecard', { state: { id } });
  };
  
  useEffect(()=>{
    const fetchAvailableCards = async () => {
      try {
        const response = await axios.get(`${API_URL}/availablecards/available-cards`);
        setAvailableCards(response.data);
      } catch (error) {
        console.error("Error fetching AvailableCards:", error);
      }
    };
fetchAvailableCards()
  },[])
  const handleInputChange = (event) => {
      const query = event.target.value;
      setSearchQuery(query);

      // Filter blogs based on search query
      const filteredResults = availableCards.filter((card) =>
        card.name.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredResults);
    };
    const dataToDisplay = searchQuery ? searchResults : availableCards;


  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_URL}/availablecards/available-cards/${currentId}`
      );

      // Remove the deleted department from state
      setAvailableCards((prevData) =>
        prevData.filter((data) => data.id !== currentId)
      );

      Toastify({
        text: "Library deleted successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();

      handleCloseModal(); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting availablecards:", error);
    }
  };

  return (
    <>
      <NavBar title={"البطاقات المتوفرة في المكتبات  "} />
      <section classNameName="margin_section">
        <div className="container ">
    
               <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12 ">
              <Link to="/addavailablecard">
              <Button className="add_btn">
                <span className="plus_icon">+</span>
                اضف مكتبة{" "}
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
                        <th className="desc_table_cardprice">اسم المكتبة </th>
                        <th className="desc_table_cardprice"> الموقع</th>
                        <th className="desc_table_cardprice"> رابط الموقع</th>
                        <th className="desc_table_cardprice">المحافظة</th>
                        <th className="desc_table_cardprice">العنوان </th>
                        <th className="desc_table_cardprice">الرقم</th>

                        <th className="desc_table_cardprice">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataToDisplay.map((AvailableCards)=>(
                      <tr>
                        <td>{AvailableCards.name} </td>
                        <td> {AvailableCards.location}</td>
                        <td> {AvailableCards.mapslink}</td>
                        <td>{AvailableCards.Governorate?.governorate}</td>
                        <td>{AvailableCards.address}</td>
                        <td>{AvailableCards.phone} </td>

                        <td>
                        <i class="fa-regular fa-pen-to-square fa-lg ps-2" style={{color:"#6dab93"}}   onClick={() => handleUpdate(AvailableCards.id)}  ></i>
                        <i className="fa-regular fa-trash-can fa-lg" style={{color:"#944b43"}}   onClick={() => handleOpenModal(AvailableCards.id)}
 ></i>
                        </td>
                      </tr>

                      ))}
                    </tbody>
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

export default AvailableCards;
