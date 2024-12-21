import React from 'react'
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import '../Css/department.css'
function DeletePopUp({show, onHide, title, description,handleDelete}) {
    
    //   const [smShow, setSmShow] = useState(false);
      // const [lgShow, setLgShow] = useState(false);
     
    
  return (
    <>
      {/* <Button  className="me-2">
        Small modal
      </Button> */}
    <Modal
      size="sm"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-sm"
      dialogClassName="custom-modal"
    >
      <Modal.Header style={{ display: "grid", placeItems: "center" }}>
        <Modal.Title id="example-modal-sizes-title-sm">
          <i
            className="fa-solid fa-triangle-exclamation fa-xl"
            style={{ color: "#934941" }}
          ></i>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ display: "grid", placeItems: "center" }}>
        <h5 style={{ color: "#833988", fontWeight: 700 }}>{title}</h5>
        <p style={{ color: "#833988", fontWeight: 400 }}>{description}</p>
        <div className='d-flex'>
          <Button className="me-2" style={{ backgroundColor: "#833988", border: "none" }} onClick={onHide}>
            الغاء
          </Button>
          <Button className="me-2" style={{ backgroundColor: "#944b43", border: "none" }} onClick={handleDelete}>
            حذف
          </Button>
        </div>
      </Modal.Body>
    </Modal>
    </>
  );
}



export default DeletePopUp