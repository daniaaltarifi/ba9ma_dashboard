import React, { useState,useRef,useEffect ,useContext} from 'react';

import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import axios from 'axios';
import '../Css/sidebar.css'
import { API_URL } from '../App';
const Navbar = ({ title }) => {
  const { user, logout } = useContext(UserContext);
  const { isLoggedIn, userName, userId} = user;
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null); // Create a ref for the notification dropdown
const [orders,setOrders]=useState([])
  const toggleNotification = () => {
    setNotificationOpen(!isNotificationOpen);
  };
  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setNotificationOpen(false);
    }
  };
  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API_URL}/PaymentsDepartments/getallcourseusers`);
      const data = response.data;
      // Filter to only include unapproved payments
      const unapprovedOrders = data.filter(order => order.payment_status !== 'approved');
      
      // Reduce to ensure unique user_id
      const uniqueOrders = Array.from(
        unapprovedOrders.reduce((map, order) => {
          if (!map.has(order.user_id)) {
            map.set(order.user_id, order);
          }
          return map;
        }, new Map()).values()
      );

      setOrders(uniqueOrders);
    } catch (error) {
      console.log(`Error getting data from backend: ${error}`);
    }
  };
  useEffect(() => {
    fetchOrder()
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-9 col-md-6 col-sm-12">
          <p className="title_page_navbar">{title}</p>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="icon_profile_navbar ">
           
            <p
              className="dropdown-toggle list_profile_icon_navbar mx-3 "
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
             {userName}
            </p>
            <ul className="dropdown-menu ">
              <li>
                <Link to={`/profile/${userId}`} className="dropdown-item ">
                  حسابي
                </Link>
              </li>
              <li>
                <Link to="/" onClick={logout} className="dropdown-item">
                  تسجيل الخروج
                </Link>
              </li>
            </ul>

            <div className="notification-wrapper" ref={notificationRef}>
              <i
                className="fa-regular fa-bell mt-1"
                onClick={toggleNotification}
                style={{ color: "#833988", cursor: "pointer" }}
              ></i>
              {isNotificationOpen && (
                <div className="notification-dropdown">
                  <ul className='notif_list'>
                  {orders.map((order) =>(
                    <li>
                      <div className="notif_cont">
                        <p> هناك طلب شراء من قبل {order.student_name} <i className="fa-solid fa-xmark" style={{color:"#F57D20"}}></i></p>
                      </div>
                    </li>
                ))}
                  </ul>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;