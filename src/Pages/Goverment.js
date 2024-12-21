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
function Goverment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState(""); // State for modal title
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [goverment, setGoverment] = useState([]);
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState(null); 
  const [availableCards, setAvailableCards] = useState([])
  const [currentType, setCurrentType] = useState(null);

  const handleOpenModal = (type,id) => {
    setCurrentId(id);
    setCurrentType(type);

    setSmShow(true);
    setTitlePopup("حذف "); // Set your modal title dynamically
    setDescriptionPopup("هل أنت متأكد من حذف ؟"); // Set your modal description dynamically
  };

  const handleCloseModal = () => {
    setSmShow(false);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/availablecards`);
        const data = response.data;
        setGoverment(data);
      } catch (error) {
        console.log(`Error getting data from frontend: ${error}`);
      }
    };
    const fetchAvailableCards = async () => {

    try {
      const response = await axios.get(`${API_URL}/availablecards/available-cards`);
      setAvailableCards(response.data);
    } catch (error) {
      console.error("Error fetching AvailableCards:", error);
    }
  };
    fetchData();
    fetchAvailableCards()

  }, []);
 
  const handleDelete = async () => {
    try {
      if (currentType === 'availableCards') {
        await axios.delete(
          `${API_URL}/availablecards/available-cards/${currentId}`
        );
        setAvailableCards((prevData) =>
          prevData.filter((data) => data.id !== currentId)
        );
        Toastify({
          text: "Available Card deleted successfully",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#F57D20",
        }).showToast();
      } else if (currentType === 'dataToDisplay') {
        await axios.delete(
          `${API_URL}/availablecards/delete/${currentId}`
        );
        setGoverment((prevData) =>
          prevData.filter((data) => data.id !== currentId)
        );
        Toastify({
          text: "Governorate deleted successfully",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#F57D20",
        }).showToast();
      }
      handleCloseModal(); 
    } catch (error) {
      console.error(`Error deleting ${currentType}:`, error);
    }
  };
  
  const handleInputChange = (event) => {
      const query = event.target.value;
      setSearchQuery(query);
      const filteredResults = goverment.filter((gov) =>
        gov.governorate.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
    };
    const dataToDisplay= searchQuery ? searchResults : goverment
    const handleUpdate = (id) => {
      navigate('/updateavailablecard', { state: { id } });
    };
  return (
    <>
      <NavBar title={"المحافظات"} />
      <section classNameName="margin_section">
        <div className="container ">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 ">
              <Link to="/addgoverment">
                <Button className="add_btn">
                  <span className="plus_icon">+</span>
                  اضف محافظة{" "}
                </Button>
              </Link>
            </div>

                       {/* search */}
                       <div className="col-lg-6 col-md-12 col-sm-12 ">
              <div className="navbar__search faq__search">
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
                    <th className="desc_table_cardprice">المحافظة </th>
                    <th className="desc_table_cardprice">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {dataToDisplay.map((gov) => (
                    <tr>
                      <td>{gov.governorate} </td>

                      <td>
                        <i
                          className="fa-regular fa-trash-can fa-lg"
                          style={{ color: "#944b43" }}
                          onClick={() => handleOpenModal('dataToDisplay', gov.id)}
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
      <section classNameName="margin_section">
      <p className="title_page_navbar" style={{marginRight:"7vh"}}>البطاقات المتوفرة في المكتبات </p>

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
                      {availableCards.map((AvailableCards)=>(
                      <tr>
                        <td>{AvailableCards.name} </td>
                        <td> {AvailableCards.location}</td>
                        <td> {AvailableCards.mapslink}</td>
                        <td>{AvailableCards.governorate.governorate}</td>
                        <td>{AvailableCards.address}</td>
                        <td>{AvailableCards.phone} </td>

                        <td>
                        <i class="fa-regular fa-pen-to-square fa-lg ps-2" style={{color:"#6dab93"}}   onClick={() => handleUpdate(AvailableCards.id)}  ></i>
                        <i className="fa-regular fa-trash-can fa-lg" style={{color:"#944b43"}}  
        onClick={() => handleOpenModal('availableCards', AvailableCards.id)}
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

export default Goverment;
