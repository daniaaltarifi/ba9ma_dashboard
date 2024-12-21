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
function ContactUs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState(""); // State for modal title
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [contactus, setContactUs] = useState([]);
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState(null); 



  const handleCloseModal = () => {
    setSmShow(false);
  };
  const handleUpdate = (id) => {
    navigate('/updatecontactus', { state: { id } });
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/contactdynamic`);
        const data = response.data;
        setContactUs(data);
      } catch (error) {
        console.log(`Error getting data from frontend: ${error}`);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (event) => {
      const query = event.target.value;
      setSearchQuery(query);

      // Filter blogs based on search query
      const filteredResults = contactus.filter((contact) =>
        contact.ques.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredResults);
    };
    const dataToDisplay= searchQuery ? searchResults : contactus
  return (
    <>
      <NavBar title={"التواصل"} />
      <section classNameName="margin_section">
        <div className="container ">
          <div className="row">
            {/* <div className="col-lg-6 col-md-12 col-sm-12 ">
              <Link to="/addcontactus">
                <Button className="add_btn">
                  <span className="plus_icon">+</span>
                  اضف سؤال{" "}
                </Button>
              </Link>
            </div> */}

                       {/* search */}
                       <div className="col-lg-6 col-md-12 col-sm-12 ">
         

              {/* End search */}
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-12 col-md-12 col-sm-12"  >

              <Table striped hover >
                <thead>
                  <tr className="table_head_cardprice">
                    <th className="desc_table_cardprice">العنوان </th>
                    <th className="desc_table_cardprice"> الوصف</th>
                    <th className="desc_table_cardprice"> رقم الهاتف</th>
                    <th className="desc_table_cardprice"> الايميل</th>
                    <th className="desc_table_cardprice"> الفيسبوك</th>
                    <th className="desc_table_cardprice"> الواتساب</th>
                    <th className="desc_table_cardprice">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {dataToDisplay.map((contact) => (
                    <tr>
                      <td className="wrap-text">{contact.title} </td>
                      <td className="wrap-text"> {contact.descr}</td>
                      <td className="wrap-text"> {contact.phone}</td>
                      <td className="wrap-text"> {contact.email}</td>
                      <td className="wrap-text"> {contact.facebook}</td>
                      <td className="wrap-text"> {contact.whatsup}</td>


                      <td >
                        <i
                          class="fa-regular fa-pen-to-square fa-lg ps-2"
                          style={{ color: "#6dab93" }}
                          onClick={() => handleUpdate(contact.id)}
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

export default ContactUs;
