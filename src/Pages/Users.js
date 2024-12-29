import React, { useEffect, useState } from "react";
import NavBar from "../component/NavBar";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import "../Css/search.css";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Modal from "react-bootstrap/Modal";
import DeletePopUp from "../component/DeletePopUp";
import { API_URL } from "../App";

function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Student"); // default role
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [smShow, setSmShow] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [titlePopup, setTitlePopup] = useState("");
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const handleOpenModal = (id) => {
    setCurrentId(id);
    setSmShow(true);
    setTitlePopup("حذف طالب"); // Set your modal title dynamically
    setDescriptionPopup("هل أنت متأكد من حذف هذا الطالب ؟");
  }
  const handleCloseModal = () => {
    setSmShow(false);
  };
  const validateName = (name) => {
    if (name.trim() === "") {
      setNameError("الرجاء أدخال الاسم !");
      return false;
    } else {
      setNameError("");
      return true;
    }
  };

  const validateEmail = (email) => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("الرجاء ادخال بريد الكتروني صحيح");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("الرجاء ادخال كلمة مرور قوية");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("كلمة المرور غير متطابقة");
      return;
    } else {
      setConfirmPasswordError("");
    }

    try {
      const res = await axios.post(
        `${API_URL}/users/register`,
        {
          name,
          email,
          password,
          role:"Student",
          confirmPassword,
        }
      );
      setUsers(res.data);
      window.location.reload();

      handleClose();
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data === "Email already in use"
      ) {
        setEmailError(
          "البريد الإلكتروني مستخدم بالفعل. يرجى إدخال بريد إلكتروني آخر."
        );
      } else {
        console.error(err);
        setError("حدث خطأ ما. يرجى المحاولة مرة أخرى.");
      }
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
         `${API_URL}/users/getUserByRole/Student`
        );
        const usersdata = response.data;
        // const student = usersdata.filter((user) => user.role === "student");

        setUsers(usersdata);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users :", error);
      }
    };
    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter blogs based on search query
    const filteredResults = users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredResults);
  };
  const dataToDisplay = searchQuery ? searchResults : users;
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/users/deleteStudent/${currentId}`);

      // Remove the deleted department from state
      setUsers((prevData) =>
        prevData.filter((data) => data.id !== currentId)
      );

      Toastify({
        text: "Student deleted successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();

      handleCloseModal(); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting Student:", error);
    }
  };
  return (
    <>
      <NavBar title={"المسجلين"} />
      <section classNameName="margin_section">
        <div className="container ">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 ">
              {/* <Link to="/addteacher"> */}
              <Button className="add_btn" onClick={handleShow}>
                <span className="plus_icon">+</span>
                اضف طالب{" "}
              </Button>
              {/* </Link> */}
            </div>
            {/* Modal Add student */}
            <Modal show={show} onHide={handleClose} dir="rtl">
              <Modal.Title className="modal_title">اضافة طالب</Modal.Title>

              <Modal.Body>
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label className="text_field ">اسم الطالب</Form.Label>
                    <Form.Control
                      type="text"
                      className={`input_filed_modal  ${
                        nameError ? "error" : ""
                      }`}
                      onBlur={() => validateName(name)}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {nameError && <p className="error_message">{nameError}</p>}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label className="text_field text-center">
                      الأيميل{" "}
                    </Form.Label>
                    <Form.Control
                      type="email"
                      className={`input_filed_modal ${
                        emailError ? "error" : ""
                      }`}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => validateEmail(email)}
                      value={email}
                    />
                    {emailError && (
                      <span className="error_message">{emailError}</span>
                    )}
                  </Form.Group>{" "}
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label className="text_field text-center">
                      كلمة السر{" "}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      className={`input_filed_modal ${
                        passwordError ? "error" : ""
                      }`}
                      onBlur={() => validatePassword(password)}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && (
                      <p className="error_message">{passwordError}</p>
                    )}
                  </Form.Group>{" "}
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label className="text_field text-center">
                      تأكيد كلمة السر{" "}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      className={`input_filed_modal ${
                        confirmPasswordError ? "error" : ""
                      }`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {confirmPasswordError && (
                      <p className="error_message">{confirmPasswordError}</p>
                    )}
                  </Form.Group>{" "}
                </Form>
              </Modal.Body>
              <Modal.Footer>
                {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
                {error && <p className="error_message">{error}</p>}

                <Button onClick={handleRegister} className="buy_department_btn">
                  اضافة{" "}
                </Button>
              </Modal.Footer>
            </Modal>
            {/* End Modal Add student */}
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
                    <th className="desc_table_cardprice">اسم الطالب </th>
                    <th className="desc_table_cardprice"> الايميل</th>
                    <th className="desc_table_cardprice"> الاجراء</th>
                  </tr>
                </thead>
                {loading ? (
        <div className="spinner-container">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
                <tbody>
                {dataToDisplay.length === 0 ? (
              <tr>
                <td colSpan="2">No users found</td>
              </tr>
            ) : (
                  dataToDisplay.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name} </td>
                      <td> {user.email}</td>
                      <td> 
                      <i className="fa-regular fa-trash-can fa-lg" style={{color:"#944b43"}}   onClick={() => handleOpenModal(user.id)}/>

                      </td>
                    </tr>
                ))
              )}
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

export default Users;
