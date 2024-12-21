import React, { useState,useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; 
import { useNavigate } from "react-router-dom";
function AddAvailableCards() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayInfo, setDisplayInfo] = useState([]);
const [location, setLocation] = useState("")
const [governorate_id , setGovernorate_id ] = useState("")
const [address, setAddress] = useState("")
const [phone, setPhone] = useState("")
const [mapslink, setMapslink] = useState("")
const [govermentData, setGovermentData] = useState([])
const [AvailableCards, setAvailableCards] = useState([])

  const handleGoverment = (e) => {
    const selectedGovermentId = e.target.value;
    setGovernorate_id (selectedGovermentId);
  };
  useEffect(() => {
    const fetchGoverment = async () => {
      try {
        const response = await axios.get("http://localhost:8080/cards/");
        setGovermentData(response.data);
      } catch (error) {
        console.error("Error fetching goverment:", error);
      }
    };

    fetchGoverment();
  }, []);
  const handlePost = async () => {

    if (!name || !location || !mapslink || !governorate_id  || !address || !phone ) {
      Toastify({
        text: "Please Fill All Field",
        duration: 3000, // Duration in milliseconds
        gravity: "top", // 'top' or 'bottom'
        position: 'right', // 'left', 'center', 'right'
        backgroundColor: "#CA1616",
      }).showToast();
      return;
    }
    try {
     
      const response = await axios.post(
        "http://localhost:8080/cards/add/availablecard",
       { name,location,mapslink,governorate_id,address,phone}
      );

      setAvailableCards(response.data);
      Toastify({
        text: "Added completely",
        duration: 3000, // Duration in milliseconds
        gravity: "top", // 'top' or 'bottom'
        position: 'right', // 'left', 'center', 'right'
        backgroundColor: "#833988",
      }).showToast();
      navigate('/goverment')

    } catch (error) {
      console.log(`Error fetching post data ${error}`);

    }
  };
  return (
    <>
      <NavBar title={"البطاقات المتوفرة في المكتبات"} />
      <div className="container ">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">اضافة مكتبة</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">اسم المكتبة</p>
            <input type="text"value={name} className="input_addcourse" onChange={(e)=>setName(e.target.value)}/>{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الموقع</p>
            <input type="text"value={location} className="input_addcourse" onChange={(e)=>setLocation(e.target.value)}/>{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">رابط الموقع </p>
            <input type="text"value={mapslink} className="input_addcourse" onChange={(e)=>setMapslink(e.target.value)}/>{" "}
          </div>
      
        </div>
      
        <div className="row mt-4">
        <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">المحافظة </p>
            <select
              name="department"
              value={governorate_id }
              onChange={handleGoverment}
              id="lang"
              className="select_dep"
            >
              <option value="">اختر محافظة</option>
              {govermentData.map((gov) => (
                <option key={gov.id} value={gov.id}>
                  {gov.governorate}
                </option>
              ))}
            </select>
          </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">العنوان</p>
            <input type="text" value={address} className="input_addcourse" onChange={(e)=>setAddress(e.target.value)}/>{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
          <p className="input_title_addcourse">الرقم </p>
          <input type="text" value={phone} className="input_addcourse" onChange={(e)=>setPhone(e.target.value)}/>{" "}

        
            {/*End when add video display name of it */}
          </div>
          <div className="d-flex justify-content-center align-items-center ">

        <button className="btn_addCourse px-5 py-2 mt-5"onClick={handlePost}>اضافة</button>
          </div>
     
        </div>

      </div>

    
    </>
  );
}

export default AddAvailableCards;
