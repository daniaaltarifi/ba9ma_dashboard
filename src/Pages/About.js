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
function About() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState(""); // State for modal title
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [about, setAbout] = useState([]);
  const [currentId, setCurrentId] = useState(null);

  const navigate = useNavigate();
  const handleOpenModal = (id) => {
    setSmShow(true);
    setCurrentId(id);
    setTitlePopup("حذف صورة");
    setDescriptionPopup("هل أنت متأكد من حذف هذه الصورة ؟");
   };

  const handleCloseModal = () => {
    setSmShow(false);
  };
  const handleUpdate = (id) => {
    navigate('/updateAbout', { state: { id } });
  };
  
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter About based on search query
    const filteredResults = about.filter((slide) =>
      slide.title.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredResults);
  };
  const dataToDisplay = searchQuery ? searchResults : about;

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await axios.get("http://localhost:8080/about");
        setAbout(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchAbout();
  }, []);


  return (
    <>
      <NavBar title={"عن بصمة"} />
      <section classNameName="margin_section">
        <div className="container ">
        <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 ">
              {/* <Link to="/addfaq">
                <Button className="add_btn">
                  <span className="plus_icon">+</span>
                  اضف سؤال{" "}
                </Button>
              </Link> */}
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
                    <th className="desc_table_cardprice">عنوان  </th>
                    <th className="desc_table_cardprice"> الوصف</th>
                   
                    <th className="desc_table_cardprice">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {dataToDisplay.map((abou) => (
                    <tr key={abou.id}>
                      <td>{abou.title} </td>
                      <td> {abou.descr}</td>

                      <td>
                        <i
                          class="fa-regular fa-pen-to-square fa-lg ps-2"
                          style={{ color: "#6dab93" }}
                          onClick={() => handleUpdate(abou.id)}  ></i>
                        
                       
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

        />
      </section>
    </>
  );
}

export default About;
