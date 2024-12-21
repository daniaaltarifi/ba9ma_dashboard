import React, { useState } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem
} from "cdbreact";
import { NavLink } from "react-router-dom";
import '../Css/sidebar.css'
import { Link } from "react-router-dom";
const Sidebar = () => {
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
       <Link to="/Home" className="link_logo"><img src={require("../assets/ba9ma2.png")} alt="logo" className="logo img-fluid"/></Link>
      </header>
      <div className="nav">
        <li>
          <Link to="/Home" lassName="background_icon" onClick={handleBackground}>
            <img src={require("../assets/home.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
        <li>
        <Link to="/department" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/department.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
        <li>
        <Link to="/courses" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/book.png")} alt=""className="img-fluid "width={"35px"} /> 
          </Link>
        </li>
        <li>
        <Link to="/teacher" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/teacher.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
        
        <li>
        <Link to="/order" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/purchase.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
        <li>
        <Link to="/library" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/library.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
        <li>
        <Link to="/blogs" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/blog.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
        <li>
        <Link to="/comments" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/comment.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
        <li>
        <Link to="/users" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/group.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li> 
        <li>
        <Link to="/admin" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/user.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li> 
        <li>
        <Link to="/faq" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/help.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
        <li>
        <Link to="/coupon" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/coupon.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
        <li>
        <Link to="/slider" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/banner.png")} alt=""className="img-fluid slider_img_sidebar" /> 
          </Link>
        </li>
        {/* <li>
        <Link to="/about" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/question.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li> */}
        {/* <li>
        <Link to="/availablecards" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/credit-card.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li> */}
        <li>
        <Link to="/goverment" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/capitol.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
        <li>
        <Link to="/dynamicblog" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/blog.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
        <li>
        <Link to="/contactus" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/support.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
        </li>
        <li>
        <Link to="/boxslider" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/shipping.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
         
        </li>
        <li>
        <Link to="/basmatraining" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/training.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
         
        </li>
        <li>
        <Link to="/whoweare" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/info.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
         
        </li>
        {/* <li>
        <Link to="/aboutteacher" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/teacherabout.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
         
        </li> */}
        <li>
        <Link to="/purchasesteps" onClick={handleBackground} className="background_icon">
            <img src={require("../assets/buy.png")} alt=""className="img-fluid icon_sidebar" /> 
          </Link>
         
        </li>
      </div>
    </div>
   
  </div>

  );
};

export default Sidebar;
