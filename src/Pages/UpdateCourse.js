import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css"; 
import Spinner from "react-bootstrap/Spinner";


function UpdateCourse() {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayInfo, setDisplayInfo] = useState([]);
  const [CourseId, setCourseId] = useState('');
  const [VideoId, setVideoId] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [priceBeforeDiscount, setPriceBeforeDiscount] = useState('');
  const [priceAfterDiscount, setPriceAfterDiscount] = useState('');
  const [description, setDescription] = useState('');
  const [departmentData, setDepartmentData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [departmentId, setDepartmentId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoLinks, setVideoLinks] = useState([]);
  const [defaultVideoFile, setDefaultVideoFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [existingVideo, setExistingVideo] = useState('');
  const [teacherIdTouched, setTeacherIdTouched] = useState(false);
  const [departmentIdTouched, setDepartmentIdTouched] = useState(false);
  const [currentContext, setCurrentContext] = useState(null);
  const [newBookFiles, setNewBookFiles] = useState([]);
  const [book, setBook] = useState(null);
  const [existingBook, setExistingBook] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [isDisabled, setIsDisabled] = useState(false); // State to control disabled attribute

  useEffect(() => {
    if (CourseId) {
      // Fetch course details when courseId is available
      fetchCourseDetails(CourseId);
      setIsDisabled(true); // Disable inputs when fetching details
    } else {
      setIsDisabled(false); // Enable inputs if no courseId
    }
  }, [CourseId]);
  useEffect(() => {
      if (location.state?.id) {
          setCourseId(location.state.id);
      } else {
          console.warn('No ID found in location.state');
      }
  }, [location.state]);

  const fetchData = async (url, setter) => {
      try {
          const response = await axios.get(url);
          setter(response.data);
      } catch (error) {
          console.error(`Error fetching data from ${url}:`, error);
      }
  };

  useEffect(() => {
      fetchData('http://localhost:8080/department', setDepartmentData);
      fetchData('http://localhost:8080/teacher', setTeacherData);
  }, []);

  useEffect(() => {
      if (CourseId) {
          fetchData(`http://localhost:8080/courses/links/${CourseId}`, setVideoLinks);
          fetchData(`http://localhost:8080/courses/videos/${CourseId}`, setVideoFiles);
          fetchCourseDetails(CourseId);
      }
  }, [CourseId]);

 // Fetch course details when courseId is available
 const fetchCourseDetails = async (id) => {
  try {
      const response = await axios.get(`http://localhost:8080/courses/${id}`);
      const courseData = response.data[0] || {};
      setCourseTitle(courseData.subject_name || '');
      setTeacherName(courseData.teacher_name || '');
      setDepartmentName(courseData.department_name || '');
      setPriceBeforeDiscount(courseData.before_offer || '');
      setPriceAfterDiscount(courseData.after_offer || '');
      setDescription(courseData.descr || '');
      setExistingImage(courseData.img || '');
      setExistingVideo(courseData.defaultvideo || '');
      setExistingBook(courseData.file_book || null);
      setVideoId(courseData.id);

  } catch (error) {
      console.error('Error fetching course details:', error);
  }
};
  
const addVideoField = () => {
  setVideoFiles((prevVideoFiles) => [
      ...prevVideoFiles,
      { id: null, title: '', url: '', file_book: null },
  ]);
};

const addLinkField = () => {
  setVideoLinks([...videoLinks, { id: null, title: '', link: '', file_book:null}]);
};

const handleDepartment = (e) => {
  setDepartmentId(e.target.value || null);
};

const handleteacher = (e) => {
  setTeacherId(e.target.value || null);
 
};
  
const handleFileChange = (e) => {
  setSelectedFile(e.target.files[0]);
};


const handleBookChange = (e) => {
  const file = e.target.files[0];
  setBook(file);
};
const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024; // 2 GB in bytes


// Function to handle default video file change
const handleDefaultVideoFileChange = (e) => {
  const file = e.target.files[0];

  if (file && file.size > MAX_FILE_SIZE) {
    Toastify({
      text: "File size exceeds the 1 GB limit",
      duration: 3000,
      gravity: "top",
      position: 'right',
      background: "#CA1616",
    }).showToast();
    return; // Prevent file from being uploaded
  }
  setDefaultVideoFile(file);
};


 



const handleVideoFileChange = (index, event) => {
  const file = event.target.files[0];
  if (file && file.size > MAX_FILE_SIZE) {
    Toastify({
      text: "File size exceeds the 1 GB limit",
      duration: 3000,
      gravity: "top",
      position: 'right',
      background: "#CA1616",
    }).showToast();
    return; // Prevent file from being uploaded
  }
  if (file) {
    const updatedVideos = [...videoFiles];
    updatedVideos[index] = { ...updatedVideos[index], url: file };
    setVideoFiles(updatedVideos);
  }
};




  

const handleLinkTitleChange = (index, event) => {
  const updatedLinks = [...videoLinks];
  updatedLinks[index] = { ...updatedLinks[index], title: event.target.value };
  setVideoLinks(updatedLinks);

};
const handleLinkChange = (index, event) => {
  const { name, value } = event.target;
  const updatedLinks = [...videoLinks];
  updatedLinks[index] = { ...updatedLinks[index], [name]: value };
  setVideoLinks(updatedLinks);
};











  const handleUpdate = async () => {
   
    setLoading(true)
    try {
        const formData = new FormData();
        formData.append('subject_name', courseTitle);
        // formData.append('teacher_id', teacherId);
        formData.append('before_offer', priceBeforeDiscount);
        formData.append('after_offer', priceAfterDiscount);
        formData.append('descr', description);
        // formData.append('department_id', departmentId);

        if (selectedFile) formData.append('img', selectedFile);
        if (defaultVideoFile) formData.append('defaultvideo', defaultVideoFile);
        if (book) formData.append('file_book', book); 
          
videoFiles.forEach((video, index) => {
  formData.append(`id`, video.id);  // Append the video ID
  formData.append(`title`, video.title); // Append the title

  formData.append(`videoFiles`, video.url); // Append the video file (url here represents the file object)
});
   ;

        videoLinks.forEach((link, index) => {
            formData.append(`videoLinks[${index}].id`, link.id);
            formData.append(`videoLinks[${index}].title`, link.title);
            formData.append(`videoLinks[${index}].link`, link.link);
           
        });

        const response = await axios.put(
            `http://localhost:8080/courses/${CourseId}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        setCourses((prevCourses) =>
            prevCourses.map((course) =>
                course.id === CourseId ? response.data : course
            )
        );

        Toastify({
            text: 'Updated successfully',
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#833988',
        }).showToast();

        navigate('/courses');
    } catch (error) {
        console.error('Error updating course:', error);
    }
};





   // Handler for file deletion
   const handleFileDelete = (index) => {
    const updatedVideoLinks = [...videoLinks];
    updatedVideoLinks[index] = {
      ...updatedVideoLinks[index],
     
    };
    setVideoLinks(updatedVideoLinks);
  };


const deleteVideo = async (id) => {
  try {
    await axios.delete(`http://localhost:8080/courses/videos/${id}`);
    setVideoFiles(videoFiles.filter(video => video.id !== id));
    Toastify({
      text: "Video deleted successfully",
      duration: 3000, // Duration in milliseconds
      gravity: "top", // 'top' or 'bottom'
      position: 'right', // 'left', 'center', 'right'
      backgroundColor: "#833988",
  }).showToast();
  } catch (error) {
    console.error('Error deleting video:', error);
  }
};

const deleteLink = async (id) => {
  try {
    await axios.delete(`http://localhost:8080/courses/videos/${id}`);
    setVideoLinks(videoLinks.filter(link => link.id !== id));
    Toastify({
      text: "Link deleted successfully",
      duration: 3000, // Duration in milliseconds
      gravity: "top", // 'top' or 'bottom'
      position: 'lift', // 'left', 'center', 'right'
      backgroundColor: "#833988",
  }).showToast();
  } catch (error) {
    console.error('Error deleting link:', error);
  }
};



const inputStyle = (touched, value) => ({
  border: `1px solid ${touched && !value ? 'red' : '#ccc'}`,
});
const BASE_URL = 'http://localhost:8080/'; // Adjust this to your server's base URL

const renderFilePreview = (filePath) => {
  if (filePath) {
    return `${BASE_URL}${filePath}`;
  }
  return '';
};

  return (
    <>
      <NavBar title={"المواد"} />
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل الماده</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">اسم المادة</p>
            <input
              type="text"
              className="input_addcourse"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">اسم الاستاذ</p>
            <input
              type="text"
              className="input_addcourse"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              disabled={isDisabled}
            />
            {/* <select
              style={inputStyle(true, teacherId)}
              name="teacherId"
              value={teacherId}
              onChange={handleteacher}
              id="lang"
              className="select_dep"
            >
              <option value="">اختر اسم الاستاذ</option>
              {teacherData.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacherName}
                </option>
              ))}
            </select> */}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">القسم</p>

            <input
              type="text"
              className="input_addcourse"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              disabled={isDisabled}
            />
            {/* <select
              name="department"
              style={inputStyle(true, departmentId)}
              value={departmentId}
              onChange={handleDepartment}
              id="lang"
              className="select_dep"
            >
              <option value="">اختر قسم</option>
              {departmentData.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.title}
                </option>
              ))}
            </select> */}
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">السعر بعد الخصم</p>
            <input
              type="text"
              className="input_addcourse"
              value={priceBeforeDiscount}
              onChange={(e) => setPriceBeforeDiscount(e.target.value)}
             
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">السعر قبل الخصم</p>
            <input
              type="text"
              className="input_addcourse"
              value={priceAfterDiscount}
              onChange={(e) => setPriceAfterDiscount(e.target.value)}
            />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <p className="input_title_addcourse">الوصف</p>
            <textarea
              className="input_textarea_addcourse"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
         
</div>
          <div className="row mt-5">

          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">صورة المادة</p>
            <div className="file-input-container">
              <input
                type="file"
                className="choose_file_addcourse"
                onChange={handleFileChange}
              />
              <span className="ps-5">اختر صورة</span>
              {selectedFile && <span>{selectedFile.name}</span>}
              {!selectedFile && existingImage && (
                <span className="selected_file_addcourse">{existingImage}</span>
              )}
              {!selectedFile && !existingImage && (
                <span className="selected_file_addcourse">No file selected</span>
              )}
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">فيديو المقدمة</p>
            <div className="file-input-container">
              <input
                type="file"
                className="choose_file_addcourse"
                onChange={handleDefaultVideoFileChange}
              />
              <span className="ps-5 selected_file_addcourse">عدل فيديو المقدمة</span>
              {defaultVideoFile && <span>{defaultVideoFile.name}</span>}
              {!defaultVideoFile && existingVideo && (
                <span className="selected_file_addcourse">{existingVideo}</span>
              )}
              {!defaultVideoFile && !existingVideo && (
                <span className="selected_file_addcourse">No file selected</span>
              )}
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6 col-sm-12">
  <p className="input_title_addcourse">كتاب المادة</p>
  <div className="file-input-container">
    <input
      type="file"
      className="choose_file_addcourse"
      onChange={handleBookChange}
    />
    <span className="ps-5 selected_file_addcourse">اختر كتاب</span>
    {book && <span className="selected_file_addcourse">{book.name}</span>}
    {!book && existingBook && (
      <>
                <span className="selected_file_addcourse">{existingBook}</span>
             
                </>
              )}
    {!book && !existingBook && (
      <span className="selected_file_addcourse">No file selected</span>
    )}
  </div>
</div>

        </div>
        <hr />

        <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">اضافة مواضيع  </div>
          </div>
        <div className="col-lg-12">
          <div className="row mt-4">
          
         

          {/* <p className="input_title_addcourse">اضافة فيديوهات جدبده او تعديلها</p> */}
          <div>
     
      
    </div>
    {videoFiles.length > 0 ? (
  videoFiles.map((video, index) => (
    <div key={index}>
      {/* Existing video file input */}
      <div className="file_input_addvideo">
        {!video.url && (
          <>
            <button className="btn_choose_video">اختيار فيديو</button>
            <input
              type="file"
              className="choose_file_addcourse"
              onChange={(e) => handleVideoFileChange(index, e)}
              required
            />
          </>
        )}
        <span className="ps-5 selected_file_addvideo">
          {video.url ? video.title : 'قم بتحميل الملفات من هنا'}
        </span>
        {!video.url && <span className="selected_file_addcourse">No file selected</span>}
      </div>

      

      {video.url && (
        <div className="d-flex justify-content-around mt-3">
          <p className="selected_file_addcourse">{video.title}</p>
          <i
            className="fa-solid fa-square-xmark fa-lg mt-2"
            onClick={() => deleteVideo(video.id)}
            style={{ color: '#944b43' }}
          ></i>
        </div>
      )}
    </div>
  ))
) : (
  <p className="input_title_addcourse mt-3">لم يتم تحميل أي فيديوهات بعد.</p>
)}




 <div>

<button onClick={addVideoField} className="btn btn_add_video ms-5">إضافة فيديو جديد</button>

     
   </div>
   {videoLinks.map((link, index) => (
        <div key={index} className="mb-3">
          {/* Input for the video title */}
          <input
            type="text"
            name="title"
            className="input_addcourse"
            value={link.title}
            onChange={(e) => handleLinkTitleChange(index, e)}
            placeholder="ادخل اسم الفيديو"
            required
          />

          {/* Input for the video link */}
          <input
            type="text"
            name="link"
            className="input_addcourse"
            value={link.link}
            onChange={(e) => handleLinkChange(index, e)}
            placeholder="ادخل رابط الفيديو"
            required
          />

          {/* File input for selecting a book */}
          {/* <div className="file_input_addvideo mt-2">
            {link.file_book ? (
              <span className="ps-5 selected_file_addvideo">
                {link.file_book.name || 'بوجد كتاب مرفق'}
                <a href={renderFilePreview(link.file_book)} download>Download Book</a>
                <i
                  className="fa-solid fa-trash"
                  onClick={() => handleFileDelete(index)}
                  style={{ color: '#944b43', cursor: 'pointer' }}
                ></i>
              </span>
            ) : (
              <>
                <button className="btn_choose_video">Choose Book</button>
                <input
                  type="file"
             
                />
              </>
            )}
          </div> */}

          {/* Delete icon for the link */}
          <i
            className="fa-solid fa-square-xmark fa-lg mt-2"
            onClick={() => deleteLink(link.id)}
            style={{ color: '#944b43' }}
          ></i>
        </div>
      ))}
 
  
    
    

    

    

   <div>


   <button onClick={addLinkField} className="btn btn_add_video ms-5">إضافة رابط جديد</button>
        
      </div>


          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-12">
           
      
<button className="btn_addCourse px-5 py-2  mt-5"onClick={handleUpdate} >  {loading && (
                             <Spinner animation="border" variant="warning"   size="sm" // Small size spinner
                             className="spinner_course"/>
                            )}
                          تحديث</button>
                             {/* Show spinner if loading */}
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateCourse;