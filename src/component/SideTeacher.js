import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import '../Css/sidebar.css'
import { Link } from "react-router-dom";
const SideTeacher = () => {
  const [activeLink, setActiveLink] = useState(null);

  const handleBackground = (e) => {
    // Remove background from previously active link
    if (activeLink) {
      activeLink.style.background = "";
      activeLink.style.padding = "";
      activeLink.style.borderRadius = "";
    }

    // Apply background to the clicked link
    const currentLink = e.currentTarget;
    currentLink.style.background = "#F57D20";
    currentLink.style.padding = "10px";
    currentLink.style.borderRadius = "10px";

    // Update state to track the active link
    setActiveLink(currentLink);
  };
  
  return (
    <div id="viewport" >
    <div id="sidebar" >
      <header>
       <Link to="/teachercourses" className="link_logo"><img src={require("../assets/ba9ma2.png")} alt="logo" className="logo img-fluid"/></Link>
      </header>
      <div className="nav">
        
    
    
        <li>
        <Link to="/teachercourses" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/teacher.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
        <li>
        <Link to="/teacheraddblog" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/blog.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
     
      </div>
    </div>
   
  </div>

  );
};

export default SideTeacher;