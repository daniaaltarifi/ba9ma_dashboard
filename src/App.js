import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { UserContext, UserProvider } from "./UserContext";
import Home from "./Pages/Home.js";
import SideBar from "./component/SideBar.js";
import SideTeacher from "./component/SideTeacher.js";
import Department from "./Pages/Department.js";
import Courses from "./Pages/Courses.js";
import AddCourse from "./Pages/AddCourse.js";
import UpdateCourse from "./Pages/UpdateCourse.js";
import Teacher from "./Pages/Teacher.js";
import AddTeacher from "./Pages/AddTeacher.js";
import UpdateTeacher from "./Pages/UpdateTeacher.js";
import Order from "./Pages/Order.js";
import Library from "./Pages/Library.js";
import AddLibrary from "./Pages/AddLibrary.js";
import UpdateLibrary from "./Pages/UpdateLibrary.js";
import Blogs from "./Pages/Blogs.js";
import AddBlog from "./Pages/AddBlog.js";
import Comments from "./Pages/Comments.js";
import Profile from "./Pages/Profile.js";
import Login from "./Pages/Login.js";
import Users from "./Pages/Users.js";
import Admin from "./Pages/Admin.js";
import Faq from "./Pages/Faq.js";
import AddFaq from "./Pages/AddFaq.js";
import UpdateFaq from "./Pages/UpdateFaq.js";
import UpdateBlog from "./Pages/UpdateBlog.js";
import Coupon from "./Pages/Coupon.js";
import TeacherCourses from "./Teacher/TeacherCourses.js";
import TeacherAddCourse from "./Teacher/TeacherAddCourse.js";
import AddCouponCode from "./Pages/AddCouponCode.js";
import UpdateCoupon from "./Pages/UpdateCoupon.js";
import TeacherUpdateCourse from "./Teacher/TeacherUpdateCourses.js";
import Slider from "./Pages/Slider.js";
import UpdateSlider from "./Pages/UpdateSlider.js";
import AddSlider from "./Pages/AddSlider.js";
import About from "./Pages/About.js";
import UpdateAbout from "./Pages/UpdateAbout.js";
import AvailableCards from "./Pages/AvailableCards.js";
import AddAvailableCards from "./Pages/AddAvailableCard.js";
import UpdateAvailableCard from "./Pages/UpdateAvailablecard.js";
import Goverment from "./Pages/Goverment.js";
import AddGoverment from "./Pages/AddGoverment.js";
import ProtectedRoute from "./component/ProtectedRoute.js";
import DynamicBlog from "./Pages/DynamicBlog.js";
import UpdateDynamicBlog from "./Pages/UpdateDynamicBlog.js";
import ContactUs from "./Pages/ContactUs.js";
import UpdateContactUs from "./Pages/UpdateContactUs.js";
import BoxUnderSlider from "./Pages/BoxUnderSlider.js";
import UpdateBoxUnderSlider from "./Pages/UpdateBoxUnderSlider.js";
import BasmaTraining from "./Pages/BasmaTraining.js";
import UpdateBasmaTraining from "./Pages/UpdateBasmaTraining.js";
import Whoweare from "./Pages/Whoweare.js";
import UpdateWhoweare from "./Pages/UpdateWhoweare.js";
import AboutTeacher from "./Pages/AboutTeacher.js";
import UpdateAboutTeacher from "./Pages/UpdateAboutTeacher.js";
import PurchaseSteps from "./Pages/PurchaseSteps.js";
import AddPurchaseSteps from "./Pages/AddPurchaseSteps.js";
import UpdatePurchaseSteps from "./Pages/UpdatePurchaseSteps.js";
import TeacherAddBlog from "./Teacher/TeacherAddBlog.js";
import ResetPassword from "./Pages/ResetPassword.js";
import ForgetPassword from "./Pages/ForgetPassword.js";
// export const API_URL='http://localhost:6060'
export const API_URL='https://backendba9ma.ba9maonline.com'

function AppContent() {
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);
  const showApp = location.pathname !== "/";
  const showForgetPassword = location.pathname !== "/forgotPassword";
  const showResetPassword = location.pathname !== "/resetPassword/:token";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  if (!showApp) {
    return <Login />;
  }
  if (!showForgetPassword) {
    return <ForgetPassword />;
  }
  if (!showResetPassword) {
    return <ResetPassword />;
  }
  if (user.role === "admin") {
    return <AppRouterAdmin />;
  }

  if (user.role === "teacher") {
    return <AppRouterTeacher />;
  }

  return null;
}

const AppRouterAdmin = () => {
    const originalConsoleError = console.error;
  console.error = (...args) => {
    if (/Warning/.test(args[0])) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
  return (
    <div className="App" dir="rtl">
      <SideBar />
      <div className="main-content">
        
        <Routes>
          <Route path="/Home" element={<ProtectedRoute element={<Home />} />} />
          {/* <Route path='/resetPassword/:token' element={<ResetPassword />}/> */}
          {/* <Route path="/forgotPassword"  element={<ForgetPassword />}/> */}
          <Route path="/department" element={<ProtectedRoute element={<Department />}/> } />
          <Route path="/courses" element={<ProtectedRoute element={<Courses />}/>} />
          <Route path="/addcourse" element={<ProtectedRoute element={<AddCourse />} />}/>
          <Route path="/updatecourse" element={<ProtectedRoute element={<UpdateCourse />}/>} />
          
          <Route path="/addteacher" element={<ProtectedRoute element={<AddTeacher />}/>} />
          <Route path="/updateteacher" element={<ProtectedRoute element={<UpdateTeacher />}/>} />
          <Route path="/order" element={<ProtectedRoute element={<Order />}/>} />
          <Route path="/library" element={<ProtectedRoute element={<Library />} />}/>
          <Route path="/addlibrary" element={<ProtectedRoute element={<AddLibrary />}/>} />
          <Route path="/updatelibrary" element={<ProtectedRoute element={<UpdateLibrary />}/>} />
          <Route path="/blogs" element={<ProtectedRoute element={<Blogs />} />}/>
          <Route path="/addblog"element={<ProtectedRoute element={<AddBlog />}/>}  />
          <Route path="/updateblog"  element={<ProtectedRoute element={<UpdateBlog />}/>} />
          <Route path="/comments" element={<ProtectedRoute element={<Comments />} />}/>
          <Route path="/profile/:id" element={<ProtectedRoute element={<Profile />}/>} />
          <Route path="/users" element={<ProtectedRoute element={<Users />}/>} />
          <Route path="/admin" element={<ProtectedRoute element={<Admin />} />}/>
          <Route path="/faq" element={<ProtectedRoute element={<Faq />}/>} />
          <Route path="/addfaq" element={<ProtectedRoute element={<AddFaq />} />}/>
          <Route path="/updatefaq" element={<ProtectedRoute element={<UpdateFaq />} />}/>
          <Route path="/coupon" element={<ProtectedRoute element={<Coupon />}/>} />
          <Route path="/addcoupon"element={<ProtectedRoute element={<AddCouponCode />}/>}  />
          <Route path="/updatecoupon" element={<ProtectedRoute element={<UpdateCoupon />} />}/>
          <Route path="/teacher" element={<ProtectedRoute element={<Teacher />}/>} />
          <Route path="/slider"element={<ProtectedRoute element={<Slider />}/>}  />
          <Route path="/addslider" element={<ProtectedRoute element={<AddSlider />}/>} />
          <Route path="/updateslider" element={<ProtectedRoute element={<UpdateSlider />}/>} />
          {/* <Route path="/about" element={<ProtectedRoute element={<About />} />}/> */}
          <Route path="/updateabout" element={<ProtectedRoute element={<UpdateAbout />} />}/>
          {/* <Route path="/availablecards" element={<ProtectedRoute element={<AvailableCards />}/>} /> */}
          <Route path="/addavailablecard" element={<ProtectedRoute element={<AddAvailableCards />}/>} />
          <Route path="/updateavailablecard" element={<ProtectedRoute element={<UpdateAvailableCard />} />}/>
          <Route path="/goverment" element={<ProtectedRoute element={<Goverment />} />}/>
          <Route path="/addgoverment" element={<ProtectedRoute element={<AddGoverment />}/>} />
          <Route path="/dynamicblog" element={<ProtectedRoute element={<DynamicBlog />}/>} />
          <Route path="/updatedynamicblog" element={<ProtectedRoute element={<UpdateDynamicBlog />}/>} />
          <Route path="/contactus" element={<ProtectedRoute element={<ContactUs />}/>} />
          <Route path="/updatecontactus" element={<ProtectedRoute element={<UpdateContactUs />}/>} />
          <Route path="/boxslider" element={<ProtectedRoute element={<BoxUnderSlider />}/>} />
          <Route path="/updateboxslider" element={<ProtectedRoute element={<UpdateBoxUnderSlider />}/>} />
          <Route path="/basmatraining" element={<ProtectedRoute element={<BasmaTraining />}/>} />
          <Route path="/updatebasmatraining" element={<ProtectedRoute element={<UpdateBasmaTraining />}/>} />
          <Route path="/whoweare" element={<ProtectedRoute element={<Whoweare />}/>} />
          <Route path="/updatewhoweare" element={<ProtectedRoute element={<UpdateWhoweare />}/>} />
          <Route path="/aboutteacher" element={<ProtectedRoute element={<AboutTeacher />}/>} />
          <Route path="/updateaboutteacher" element={<ProtectedRoute element={<UpdateAboutTeacher />}/>} />
          <Route path="/purchasesteps" element={<ProtectedRoute element={<PurchaseSteps />}/>} />
          <Route path="/addpurchasesteps" element={<ProtectedRoute element={<AddPurchaseSteps />}/>} />
          <Route path="/updatepurchasesteps" element={<ProtectedRoute element={<UpdatePurchaseSteps />}/>} />






        </Routes>
      </div>
    </div>
  );
};

const AppRouterTeacher = () => {
  return (
    <div className="App" dir="rtl">
      <SideTeacher />
      <div className="main-content">
        <Routes>
        <Route path="/profile/:id" element={<ProtectedRoute element={<Profile />} />}/>
          <Route path="/teachercourses" element={<ProtectedRoute element={<TeacherCourses />}/>} />
          <Route path="/teacheraddcourses" element={<ProtectedRoute element={<TeacherAddCourse />}/>} />
          <Route path="/teacherupdatecourses" element={<ProtectedRoute element={<TeacherUpdateCourse />}/>} />
          <Route path="/teacheraddblog" element={<ProtectedRoute element={<TeacherAddBlog />}/>} />

        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
};

export default App;