import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { API_URL } from "../App";

function UpdateFaq() {
  const navigate = useNavigate();
  const location = useLocation();
  const [faqId, setFaqId] = useState("");
  const [ques, setQues] = useState("");
  const [ans, setAns] = useState("");

  // Fetch FAQ details by ID
  useEffect(() => {
    if (location.state && location.state.id) {
      setFaqId(location.state.id);
      fetchFaqById(location.state.id);
    } else {
      console.warn("No ID found in location.state");
    }
  }, [location.state]);

  const fetchFaqById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/Fqs/getFaq/${id}`);
      setQues(response.data.ques);
      setAns(response.data.ans);
    } catch (error) {
      console.error(`Error fetching FAQ data: ${error}`);
      Toastify({
        text: "Error fetching FAQ data",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#CA1616",
      }).showToast();
    }
  };

  const handleUpdate = async () => {
    if (!ques || !ans) {
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
        `${API_URL}/Fqs/updateFaq/${faqId}`,
        { ques, ans }
      );

      Toastify({
        text: "Updated successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();
      navigate("/faq");
    } catch (error) {
      console.log(`Error updating data: ${error}`);
    }
  };

  return (
    <>
      <NavBar title={"الاسئلة المتكررة"} />
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل سؤال</div>
          </div>
        </div>
        <div className="row mt-4  d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">السؤال</p>
            <input
              type="text"
              className="input_addcourse"
              value={ques}
              onChange={(e) => setQues(e.target.value)}
            />{" "}
          </div>
        </div>

        <div className="row mt-4  d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الجواب</p>
            <input
              type="text"
              className="input_addcourse"
              value={ans}
              onChange={(e) => setAns(e.target.value)}
            />{" "}
          </div>

          <div className=" d-flex justify-content-center align-items-center ">
            <button
              className="btn_addCourse px-5 py-2 mt-5 "
              onClick={handleUpdate}
            >
              حفظ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateFaq;