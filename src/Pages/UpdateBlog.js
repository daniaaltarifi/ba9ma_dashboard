import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/blog.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../App";
function UpdateBlog() {
  const [tags, setTags] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayInfo, setDisplayInfo] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [descr, setDescr] = useState("");
  const [department_id, setDepartment_id] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [blogId, setBlogId] = useState("");
  const location = useLocation();
  const [imagePreview, setImagePreview] = useState(null);
  useEffect(() => {
    // Check if location.state exists and contains the id
    if (location.state && location.state.id) {
      setBlogId(location.state.id);
    } else {
      console.warn("No ID found in location.state");
    }
  }, [location.state]);
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    // Create a preview URL for the image
    // if (file) {
    //   const previewUrl = URL.createObjectURL(file);
    //   setImagePreview(previewUrl);
    // }
  };

  const handleAddButtonClick = () => {
    if (tags) {
      // Generate a unique ID (or use a library for unique IDs)
      const newId = Date.now();

      // Add the new tag to the existing list
      setDisplayInfo((prevInfo) => [
        ...prevInfo,
        {
          id: newId, // Unique identifier for each tag
          title: tags,
        },
      ]);

      // Clear the input field after adding
      setTags("");
    }
  };

  useEffect(() => {
    if (!blogId) return;

    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/blog/getBlogById/${blogId}`
        );
        const blogData = response.data;

        console.log("Fetched blog data:", blogData);

        setTitle(blogData.title || "");
        setAuthor(blogData.author || "");
        setDescr(blogData.descr || "");
        setDepartment_id(blogData.department_id || "");

        // Process tag IDs and names
        if (blogData.tag_ids && blogData.tag_names) {
          const tagIds = blogData.tag_ids.split(",").map((id) => id.trim());
          const tagNames = blogData.tag_names
            .split(",")
            .map((name) => name.trim());

          // Create a mapping of tag IDs to names
          const tagMap = tagIds.reduce((acc, id, index) => {
            acc[id] = tagNames[index] || "";
            return acc;
          }, {});

          // Set displayInfo with tag objects
          setDisplayInfo(
            tagIds.map((id) => ({
              id: id, // Use the tag ID from the response
              title: tagMap[id] || "", // Match title with the ID
            }))
          );
        } else {
          setDisplayInfo([]); // No tags, set to empty array
        }

        setSelectedFile(blogData.img || "");
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    fetchBlogDetails();
  }, [blogId]);

  const handleDepartment = (e) => {
    const selectedDepartmentId = e.target.value;
    setDepartment_id(selectedDepartmentId);
  };
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/departments/getDepartments`
        );
        setDepartmentData(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("descr", descr);
      formData.append("department_id", department_id);

      // Conditionally append the image file only if one is selected
      if (selectedFile) {
        formData.append("img", selectedFile);
      }

      // Handle tags
      const tagsArray = Array.isArray(displayInfo)
        ? displayInfo.map((tag) => tag.title)
        : [];
      tagsArray.forEach((tag) => formData.append("tags[]", tag));

      // Send the PUT request
      const response = await axios.put(
        `${API_URL}/blog/update-blog/${blogId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setBlogs((prevAdd) =>
        prevAdd.map((data) => (data.id === blogId ? response.data : data))
      );

      Toastify({
        text: "Updated completely",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#833988",
      }).showToast();

      navigate("/blogs");
    } catch (error) {
      console.log(`Error fetching post data: ${error}`);
    }
  };

  const handleDeleteTag = async (tagId) => {
    console.log("Attempting to delete tag with ID:", tagId);
    try {
      // Ensure the tagId is valid before making the request
      if (!tagId || isNaN(tagId)) {
        throw new Error("Invalid tagId");
      }

      // Send a DELETE request to the backend to remove the tag
      const response = await axios.delete(
        `${API_URL}/Tags/deleteTag/${tagId}`
      );

      console.log(
        `Response from server after deleting tag ${tagId}:`,
        response
      );

      // Remove the tag from the local state
      setDisplayInfo((prevInfo) => prevInfo.filter((tag) => tag.id !== tagId));

      Toastify({
        text: "Tag deleted successfully",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#944b43",
      }).showToast();
    } catch (error) {
      console.error("Error deleting tag:", error.message);
      Toastify({
        text: "Error deleting tag",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff0000",
      }).showToast();
    }
  };

  return (
    <>
      <NavBar title={"مدونة بصمة"} />
      <div className="container ">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">تعديل مقال</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">عنوان المقال</p>
            <input
              type="text"
              className="input_addcourse"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">صاحب المقال</p>
            <input
              type="text"
              className="input_addcourse"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />{" "}
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">القسم </p>
            <select
              name="department"
              value={department_id}
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
            </select>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">الوصف</p>
            <textarea
              type="text"
              value={descr}
              className="input_textarea_addcourse"
              onChange={(e) => setDescr(e.target.value)}
            ></textarea>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">اضف تاغ</p>
            <div className="input-wrapper">
              <input
                type="text"
                className="input_addtag"
                onChange={(e) => setTags(e.target.value)}
              />
              <button
                type="button"
                className="btn_add_tag"
                onClick={handleAddButtonClick}
              >
                اضافة
              </button>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="entries_container d-flex flex-wrap justify-content-evenly">
              {displayInfo.map((tag) => (
                <div key={tag.id} className="entry">
                  <div className="d-flex justify-content-between">
                    <p className="tag_data">
                      {tag.title}

                      <i
                        className="fa-solid fa-square-xmark fa-lg mt-2"
                        onClick={() => handleDeleteTag(tag.id)} // Call the delete handler here
                        style={{ color: "#944b43" }}
                      ></i>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-12"></div>
            <div className="col-lg-8 col-md-6 col-sm-12">
              <p className="input_title_addcourse">اضف صورة </p>

              <div className="file_input_addvideo">
                <button className="btn_choose_video">اختيار ملف</button>
                <input
                  type="file"
                  className="choose_file_addcourse"
                  onChange={handleFileChange}
                  accept="img/*"
                />
                {!selectedFile && (
                  <>
                    <span className="ps-5 selected_file_addvideo">
                      قم بتحميل الملفات من هنا
                    </span>

                    <span className="selected_file_addcourse">
                      No file selected
                    </span>
                  </>
                )}
              </div>

              {/* Display the name of the selected file */}
              {selectedFile && (
                <div className="d-flex justify-content-around">
                  <p className="selected_file_addcourse">{selectedFile.name}</p>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-center align-items-center ">
            <button
              className="btn_addCourse px-5 py-2 mt-4 "
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

export default UpdateBlog;
