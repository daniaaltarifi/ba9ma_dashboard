import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/order.css";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import DeletePopUp from "../component/DeletePopUp";
import Spinner from "react-bootstrap/Spinner";

function Order() {
  const [activeButton, setActiveButton] = useState("btn1");
  const [departmentOrder, setDepartmentOrder] = useState([]);
  const [courseOrder, setCourseOrder] = useState([]);
  const [courseUsers, setCourseUsers] = useState([]);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState(""); // State for modal title
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [currentId, setCurrentId] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [noCoursesMessage, setNoCoursesMessage] = useState('');
  const [noDepartmentMessage, setNoDepartmentessage] = useState('');

  // Handler function to change the color of the clicked button
  const handleClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const handleOpenModal = (id) => {
    setCurrentId(id);
    setSmShow(true);
    setTitlePopup("حذف طلب شراء"); // Set your modal title dynamically
    setDescriptionPopup("هل أنت متأكد من حذف طلب الشراء  ؟"); // Set your modal description dynamically
  };
  const handleCloseModal = () => {
    setSmShow(false);
  };
  // Function to determine button color
  const getButtonColor = (buttonId) => {
    return activeButton === buttonId ? "#833988" : "#F57D20";
  };
const fetchDepartmentOrder = async () => {
  setLoading(true);
  setNoDepartmentessage(''); // Clear previous message
  
  try {
    const response = await axios.get("http://localhost:8080/api/getcourseusers");
    const data = response.data;
    // Filter to only include unapproved payments
    const unapprovedPayments = data.filter(payment => payment.department_id !== null);

    if (unapprovedPayments.length === 0) {
      setNoDepartmentessage('لا يوجد طلبات شراء');
      setDepartmentOrder([]);
    } else {
      setDepartmentOrder(unapprovedPayments);
      setNoDepartmentessage('');
    }
  } catch (error) {
    console.log(`Error getting data from backend: ${error}`);
    setNoDepartmentessage('حدث خطأ أثناء جلب البيانات');
  } finally {
    setLoading(false);
  }
};

  const fetchCourseOrder = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/getcourseusers");
      const data = response.data;
      // Filter to only include unapproved payments
      const unapprovedPayments = data.filter(payment => payment.course_id !== null);
      setCourseOrder(unapprovedPayments);
      setNoCoursesMessage('');
      setLoading(false);
      if (unapprovedPayments.length === 0) {
        setNoCoursesMessage('لا يوجد طلبات شراء');
      } else {
        setCourseOrder(unapprovedPayments);
      }
    } catch (error) {
      console.log(`Error getting data from backend: ${error}`);
    }
  };
  useEffect(() => {
    fetchDepartmentOrder();
    fetchCourseOrder()
  }, []);

  const handleDeleteCourseUsers = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/delete/payments/${currentId}`);
      setDepartmentOrder((prevData) => prevData.filter((data) => data.payment_id !== currentId));
      setCourseOrder((prevData) => prevData.filter((data) => data.payment_id !== currentId));
      Toastify({
        text: "Order deleted successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();
      handleCloseModal()
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  }; 
  useEffect(() => {
    fetchDepartmentOrder();
  }, []);
  return (
    <>
      <NavBar title={"طلبات الشراء "} />
      <div className="container text-center">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12  mb-4">
            <div className="d-flex cont_btn_order">
              <button
                className="courses_dep px-5 py-4 background_btn"
                style={{ backgroundColor: getButtonColor("btn1") }}
                onClick={() => handleClick("btn1")}
              >
                المواد
              </button>
              <button
                className="courses_dep px-5 py-4  background_btn"
                style={{ backgroundColor: getButtonColor("btn2") }}
                onClick={() => handleClick("btn2")}
              >
                الاقسام
              </button>
            </div>
          </div>
          <div className="col-lg-9 col-md-12 col-sm-12"></div>
        </div>
        <div className="row">
          {activeButton === "btn1" ? (
            <Table striped hover>
              <thead>
              <tr className="table_head_cardprice">
      <th className="desc_table_cardprice">اسم الطالب</th>
      <th className="desc_table_cardprice">الايميل</th>
      <th className="desc_table_cardprice">العنوان</th>
      <th className="desc_table_cardprice">رقم الهاتف</th>
      <th className="desc_table_cardprice">اسم المادة</th>
      <th className="desc_table_cardprice">رمز الكوبون</th> {/* Add Coupon Code Column */}
      <th className="desc_table_cardprice">الاجراء</th>
    </tr>
              </thead>
              {loading ? (
                  <div className="spinner-container">
                    <Spinner animation="border" variant="warning" />
                  </div>
                ) : noCoursesMessage ? (
                  <div className="no-data-message ">
                    <p >{noCoursesMessage}</p>
                  </div>
                ) : (
              <tbody>
              {courseOrder.map((course) => (
                   <tr key={course.id}>
                   <td>{course.student_name}</td>
                   <td>{course.email}</td>
                   <td>{course.address}</td>
                   <td>{course.phone}</td>
                   <td>{course.subject_name}</td>
                   <td>{course.coupon_code}</td> {/* Display Coupon Code */}
                   <td>
                     
                        <i
                          className="fa-regular fa-trash-can fa-lg"
                          style={{ color: "#944b43" }}
                          onClick={() => handleOpenModal(course.payment_id)}

                          // onClick={()=>handleDeleteCourseUsers(course.payment_id)} 
                          ></i>
                      </td>
                  
                  </tr>
               ))}
               </tbody>
             )}
            </Table>
          ) : activeButton === "btn2" ? (
            <Table striped hover>
              <thead>
              <tr className="table_head_cardprice">
      <th className="desc_table_cardprice">اسم الطالب</th>
      <th className="desc_table_cardprice">الايميل</th>
      <th className="desc_table_cardprice">العنوان</th>
      <th className="desc_table_cardprice">رقم الهاتف</th>
      <th className="desc_table_cardprice">القسم</th>
      <th className="desc_table_cardprice">رمز الكوبون</th> {/* Add Coupon Code Column */}
      <th className="desc_table_cardprice">الاجراء</th>
    </tr>
              </thead>
              {loading ? (
                  <div className="spinner-container">
                    <Spinner animation="border" variant="warning" />
                  </div>
                 ) : noDepartmentMessage ? (
                  <div className="no-data-message ">
                    <p >{noDepartmentMessage}</p>
                  </div>
                ) : (
              <tbody>
                {departmentOrder.map((department) => (
      <tr key={department.id}>
        <td>{department.student_name}</td>
        <td>{department.email}</td>
        <td>{department.address}</td>
        <td>{department.phone}</td>
        <td>{department.department_name}</td>
        <td>{department.coupon_code}</td> {/* Display Coupon Code */}
        <td>
                        <i
                          className="fa-regular fa-trash-can fa-lg"
                          style={{ color: "#944b43" }}
                          onClick={() => handleOpenModal(department.payment_id)}

                          // onClick={()=>handleDeleteCourseUsers(department.payment_id)}                          
                           >

                          </i>

                      </td>
                   
                  </tr>
                 ))}
                 </tbody>
               )}
            </Table>
          ) : null}
        </div>
      </div>
      <DeletePopUp
          show={smShow}
          onHide={handleCloseModal}
          title={titlePopup}
          description={descriptionPopup}
          handleDelete={handleDeleteCourseUsers}
        />
    </>
  );
}

export default Order;