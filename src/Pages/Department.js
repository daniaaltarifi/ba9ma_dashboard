import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/department.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import DeletePopUp from "../component/DeletePopUp";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import axios from "axios";
import { API_URL } from "../App";
function Department() {
  const [showPost, setShowPost] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState("");
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [departmentData, setDepartmentData] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [del, setDel] = useState([]);

  const handleClose = () => {
    setShowPost(false);
    setShowUpdate(false);
  };
  const handleShow = () => setShowPost(true);
  const handleShowForUpdate = (id) => {
    setCurrentId(id); // Set the current ID
    setShowUpdate(true); // Show the modal
  };

  const handleCloseModal = () => {
    setSmShow(false);
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/departments/getDepartments`);

      const data = response.data;
      setDepartmentData(data);
    } catch (error) {
      console.log(`Error getting data from frontend: ${error}`);
    }
  };

  useEffect(() => {
    fetchData();
  },[]);
  const handlePost = async () => {
    if (!title || !price) {
      Toastify({
        text: "Please Fill All Field",
        duration: 3000, // Duration in milliseconds
        gravity: "top", // 'top' or 'bottom'
        position: "right", // 'left', 'center', 'right'
        backgroundColor: "#CA1616",
      }).showToast();
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/departments/createDepartment`,
        { title, price }
      );
      setDepartmentData(response.data);
      Toastify({
        text: "Added completely",
        duration: 3000, // Duration in milliseconds
        gravity: "top", // 'top' or 'bottom'
        position: "right", // 'left', 'center', 'right'
        backgroundColor: "#F57D20",
      }).showToast();

      handleClose();
      fetchData()
    } catch (error) {
      console.log(`Error fetching post data ${error}`);
    }
  };
  const handleUpdate = async () => {
    if (!title || !price) {
      Toastify({
        text: "Please Fill All Fields",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#CA1616",
      }).showToast();
      return;
    }
    try {
      const response = await axios.put(
        `${API_URL}/departments/updateDepartment/${currentId}`, // Use currentId here
        { title, price }
      );
      // Update the department data in state
      setDepartmentData((prevAdd) =>
        prevAdd.map((data) => (data.id === currentId ? response.data.department : data))
      );

      Toastify({
        text: "Updated successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();

      handleClose(); // Close the modal after successful update
    } catch (error) {
      console.log(`Error updating data: ${error}`);
    }
  };
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_URL}/departments/deleteDepartment/${currentId}?confirm=true`
      );
      setSmShow(false);
      setDepartmentData((prevData) =>
        prevData.filter((data) => data.id !== currentId)
      );
      setUserIds([]);
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const [userIds, setUserIds] = useState([]);

  const handleOpenModal = async (id) => {
    setCurrentId(id);
    try {
      const response = await axios.delete(
        `${API_URL}/departments/deleteDepartment/${id}`
      );
      const { message, userIds } = response.data;

      setMessage(message);
      setUserIds(userIds);

      setSmShow(true);
    } catch (error) {
      console.error("Error checking payments:", error);
    }
  };

  return (
    <>
      <NavBar title="الأقسام" />
      <section className="margin_section">
        <Button onClick={handleShow} className="add_btn">
          <span className="plus_icon">+</span>
          اضف قسم{" "}
        </Button>
        <Modal show={showPost} onHide={handleClose} dir="rtl">
          <Modal.Title className="modal_title">اضافة قسم</Modal.Title>

          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label className="text_field "> عنوان القسم </Form.Label>
                <Form.Control
                  type="text"
                  className="input_filed_modal"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label className="text_field "> سعر القسم </Form.Label>
                <Form.Control
                  type="text"
                  className="input_filed_modal"
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handlePost} className="buy_department_btn">
              اضافة{" "}
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="container-fluid ">
          <div className="row d-flex justify-content-center align-items-center">
            {Array.isArray(departmentData) &&
              departmentData.map((card, id) => (
                <div
                  className="col-lg-3 col-md-6 col-sm-12 col_depa"
                  key={card.id}
                >
                  <div className=" info_cont_depa">
                    <img
                      src={require("../assets/department.png")}
                      alt="department"
                      className="img-fluid icon_department ms-3"
                    />
                    <p className="title_depa ">{card.title}</p>
                  </div>
                  <div className="btn_handle_cont">
                    <button
                      className="btn_handle_depa"
                      onClick={() => handleShowForUpdate(card.id)}
                    >
                      <i
                        className="fa-regular fa-pen-to-square"
                        style={{ color: "#fff" }}
                      ></i>
                    </button>
                    <button
                      className="btn_handle_depa"
                      onClick={() => handleOpenModal(card.id)}
                    >
                      <i
                        className="fa-regular fa-trash-can"
                        style={{ color: "#fff" }}
                      ></i>
                    </button>

                    <DeletePopUp
                      show={smShow}
                      onHide={handleCloseModal}
                      title={message}
                      // description={descriptionPopup}
                      handleDelete={handleDelete}
                    />
                  </div>
                  <Modal show={showUpdate} onHide={handleClose} dir="rtl">
                    <Modal.Title className="modal_title">تعديل قسم</Modal.Title>

                    <Modal.Body>
                      <Form>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className="text_field ">
                            {" "}
                            عنوان القسم{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="input_filed_modal"
                            onChange={(e) => {
                              setTitle(e.target.value);
                            }}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className="text_field ">
                            {" "}
                            سعر القسم{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="input_filed_modal"
                            onChange={(e) => {
                              setPrice(e.target.value);
                            }}
                          />
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
                      <Button
                        onClick={handleUpdate}
                        className="buy_department_btn"
                      >
                        تعديل{" "}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Department;
