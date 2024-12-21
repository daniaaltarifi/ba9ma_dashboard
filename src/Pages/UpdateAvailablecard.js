import React, { useState,useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import { useLocation,useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; 
import axios from "axios";
import { API_URL } from "../App";
function UpdateAvailableCard() {
  const locationState = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState("")
const [governorate_id, setgovernorate_id] = useState(null)
const [address, setaddress] = useState("")
  const [phone, setphone] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayInfo, setDisplayInfo] = useState([]);
  const [availablecard, setavailablecard] = useState([])
  const [govermentData, setgovermentData] = useState([])
  const [availabalecardId, setAvailableCardId] = useState('');
  const [mapslink, setMapslink] = useState("")

  const handleGoverment = (e) => {
    const selectedgovermentId = e.target.value;
    setgovernorate_id(selectedgovermentId);
  };


   // Fetch available card data by ID when component mounts
   useEffect(() => {
    if (locationState.state && locationState.state.id) {
      setAvailableCardId(locationState.state.id);
      fetchCardDetails(locationState.state.id);
    } else {
      console.warn('No ID found in location.state');
    }
  }, [locationState.state]);

  const fetchCardDetails = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/availablecards/available-cards/${id}`);
      const card = response.data[0];
      setName(card.name);
      setLocation(card.location);
      setMapslink(card.mapslink);
      setgovernorate_id(card.governorate_id);
      setaddress(card.address);
      setphone(card.phone);
    } catch (error) {
      console.error("Error fetching card details:", error);
    }
  };
  useEffect(() => {
    // Check if location.state exists and contains the id
    if (locationState.state && locationState.state.id) {
        setAvailableCardId(locationState.state.id);
    } else {
      console.warn('No ID found in location.state');
    }
  }, [locationState.state]);
  useEffect(() => {
    const fetchGoverment = async () => {
        try {
          const response = await axios.get(`${API_URL}/availablecards`);
          setgovermentData(response.data);
        } catch (error) {
          console.error("Error fetching goverment:", error);
        }
      };
  
      fetchGoverment();
  }, []);
  

  const handleUpdate = async () => {
    
    try {
    
      const response = await axios.put(
        `${API_URL}/availablecards/available-cards/${availabalecardId}`,
        { name,location,mapslink,governorate_id,address,phone}
      );
      setavailablecard((prevAdd) =>
        prevAdd.map((data) =>
          data.id === availabalecardId ? response.data : data
        )
      );
      Toastify({
        text: "Updated completely",
        duration: 3000, // Duration in milliseconds
        gravity: "top", // 'top' or 'bottom'
        position: 'right', // 'left', 'center', 'right'
        backgroundColor: "#5EC693",
      }).showToast();
navigate('/goverment')
    } catch (error) {
      console.log(`Error in fetch edit data: ${error}`);
    }
  };
  return (
    <>
      <NavBar title={"البطاقات المتوفرة في المكتبات"} />
      <div className="container ">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل مكتبة</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse" >اسم المكتبة</p>
            <input type="text" className="input_addcourse" value={name} onChange={(e)=>setName(e.target.value)} />{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الموقع</p>
            <input type="text" className="input_addcourse" value={location} onChange={(e)=>setLocation(e.target.value)}/>{" "}
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
              value={governorate_id}
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
            <input type="text" className="input_addcourse" value={address} onChange={(e)=>setaddress(e.target.value)}/>{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
          <p className="input_title_addcourse">الرقم </p>
          <input type="text" className="input_addcourse" value={phone} onChange={(e)=>setphone(e.target.value)}/>{" "}

         
          </div>
          <div className="d-flex justify-content-center align-items-center ">

        <button className="btn_addCourse px-5 py-2 mt-5" onClick={handleUpdate}>حفظ</button>
          </div>
     
        </div>

      </div>

    
    </>
  );
}

export default UpdateAvailableCard;
