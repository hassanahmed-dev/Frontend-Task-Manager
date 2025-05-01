// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Loader from "./Loader";
// import "./Profile.css";

// const API_URL = import.meta.env.VITE_API_URL || 'https://backend-task-manager-production.up.railway.app';
// const DEFAULT_AVATAR = '/defult.png';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [error, setError] = useState(null);
//   const [isFirstTime, setIsFirstTime] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
//   const [avatarLoading, setAvatarLoading] = useState(false);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const navigate = useNavigate();

  
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     age: "",
//     gender: "",
//     phone: "",
//     country: "",
//     city: "",
//     address: "",
//     qualification: ""
//   });

//   // Basic country list
//   const countryList = [
//     { name: "Pakistan" },
//     { name: "India" },
//     { name: "Iran" },
//     { name: "Iraq" },
//     { name: "United States" },
//     { name: "United Kingdom" },
//     { name: "Canada" },
//     { name: "Australia" },
//     { name: "Afghanistan" }
//   ];

//   // Helper function to get avatar URL
//   const getAvatarUrl = (filename) => {
//     if (!filename) return DEFAULT_AVATAR;
//     return `${API_URL}/api/user/uploads/${filename}`;
//   };

//   const fetchUserData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const token = localStorage.getItem("token");
      
//       if (!token) {
//         navigate("/login");
//         return;
//       }
      
//       const response = await axios.get(`${API_URL}/api/user`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         }
//       });
      
//       const userData = response.data;
      
//       // Save user data to local storage
//       localStorage.setItem("user", JSON.stringify(userData));
//       setUser(userData);
      
//       // Set avatar if available
//       if (userData.profileImage) {
//         const avatarUrl = getAvatarUrl(userData.profileImage);
//         setAvatar(avatarUrl);
//         setPreviewImage(avatarUrl);
//       }
      
//       if (!userData.firstName || !userData.lastName) {
//         setIsFirstTime(true);
//         setIsModalOpen(true);
//       }

//       if (userData) {
//         setFormData({
//           firstName: userData.firstName || "",
//           lastName: userData.lastName || "",
//           age: userData.age || "",
//           gender: userData.gender || "",
//           phone: userData.phone || "",
//           country: userData.country || "",
//           city: userData.city || "",
//           address: userData.address || "",
//           qualification: userData.qualification || ""
//         });
//       }
//     } catch (error) {
//       setError("Failed to load profile data. Please try again later.");
//       console.error("Error fetching user data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // First try to load from localStorage
//     const userStr = localStorage.getItem("user");
//     if (userStr) {
//       try {
//         const storedUser = JSON.parse(userStr);
//         setUser(storedUser);
//         if (storedUser.profileImage) {
//           const avatarUrl = getAvatarUrl(storedUser.profileImage);
//           setAvatar(avatarUrl);
//           setPreviewImage(avatarUrl);
//         }
//       } catch (e) {
//         console.error("Error parsing stored user", e);
//       }
//     }
    
//     // Then fetch fresh data from server
//     fetchUserData();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       setIsLoggingOut(true);
//       const token = localStorage.getItem("token");
      
//       try {
//         await axios.post(
//           `${API_URL}/api/logout`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       } catch (err) {
//         console.error("Error calling logout API:", err);
//         // Continue with logout even if API fails
//       }
      
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
      
//       setTimeout(() => {
//         navigate("/");
//       }, 500);
//     } catch (error) {
//       setError("Logout failed. Please try again.");
//       console.error("Logout failed:", error);
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (isFirstTime) {
//       if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
//       if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
//       if (!formData.age) newErrors.age = "Age is required";
//       if (!formData.gender) newErrors.gender = "Gender is required";
//       if (!formData.phone) newErrors.phone = "Phone number is required";
//       if (!formData.country) newErrors.country = "Country is required";
//       if (!formData.city) newErrors.city = "City is required";
//       if (!formData.qualification) newErrors.qualification = "Qualification is required";
//       if (!formData.address) newErrors.address = "Address is required";
//     } else {
//       if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
//       if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       return;
//     }
    
//     try {
//       setIsUpdating(true);
//       setError(null);
//       const token = localStorage.getItem("token");
      
//       if (!token) {
//         navigate("/login");
//         return;
//       }
      
//       // If there's a file selected, upload it first
//       if (selectedFile) {
//         const uploadSuccess = await uploadAvatar();
//         if (!uploadSuccess) {
//           setIsUpdating(false);
//           return;
//         }
//       }
      
//       const response = await axios.put(
//         `${API_URL}/api/user/update`, 
//         formData,  
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           },
//         }
//       );
      
//       const updatedUser = response.data.user;
      
//       // Make sure to preserve the profileImage field
//       const newUser = {
//         ...updatedUser,
//         profileImage: updatedUser.profileImage || user?.profileImage
//       };
      
//       setUser(newUser);
//       localStorage.setItem("user", JSON.stringify(newUser));
//       setIsFirstTime(false);
//       setIsModalOpen(false);
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to update profile. Please try again.");
//       console.error("Update failed:", error);
//     } finally {
//       setIsUpdating(false);
//     }
//   };
  
//   const handleImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     // Validate file size and type
//     if (file.size > 5 * 1024 * 1024) {
//       setError("Image size should be less than 5MB");
//       return;
//     }
    
//     const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
//     if (!validTypes.includes(file.type)) {
//       setError("Please select a valid image file (JPEG, PNG, GIF)");
//       return;
//     }
    
//     // Save the file for later upload
//     setSelectedFile(file);
    
//     // Create preview
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setPreviewImage(e.target.result);
//     };
//     reader.readAsDataURL(file);
//   };
  
//   // Handle removing profile image
//   const handleRemoveImage = async () => {
//     try {
//       setAvatarLoading(true);
//       setError(null);
      
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }
      
//       // Call API to remove profile image from server
//       const response = await axios.delete(
//         `${API_URL}/api/user/remove-profile-image`,
//         {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }
//       );
      
//       if (response.data && response.data.success) {
//         // Update user data from response
//         const { user: updatedUser } = response.data;
        
//         // Update state and local storage
//         setUser(updatedUser);
//         setAvatar(DEFAULT_AVATAR);
//         setPreviewImage(DEFAULT_AVATAR);
//         setSelectedFile(null);
//         localStorage.setItem('user', JSON.stringify(updatedUser));
        
//         setError(null);
//       } else {
//         throw new Error("Failed to remove profile image");
//       }
//     } catch (err) {
//       console.error("Remove avatar failed:", err);
//       setError(err.response?.data?.message || "Failed to remove avatar. Please try again.");
//     } finally {
//       setAvatarLoading(false);
//     }
//   };
  
//   const uploadAvatar = async () => {
//     if (!selectedFile) return false;
    
//     try {
//       setAvatarLoading(true);
//       setError(null);
      
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return false;
//       }
      
//       // Create FormData
//       const formDataObj = new FormData();
//       formDataObj.append('profileImage', selectedFile);
      
//       // Send file using FormData
//       const response = await axios.post(
//         `${API_URL}/api/user/upload-profile-image`,
//         formDataObj,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );
      
//       if (response.data && response.data.success) {
//         // Get the avatar information from response
//         const { imageUrl, user: updatedUser } = response.data;
        
//         // Update avatar in state
//         setAvatar(imageUrl);
//         setPreviewImage(imageUrl);
        
//         // Update user object with new profile image
//         const newUser = { 
//           ...user, 
//           profileImage: updatedUser.profileImage
//         };
        
//         // Update state and local storage
//         setUser(newUser);
//         localStorage.setItem('user', JSON.stringify(newUser));
        
//         // Clear selected file after successful upload
//         setSelectedFile(null);
//         return true;
//       } else {
//         throw new Error("Invalid response format from server");
//       }
//     } catch (err) {
//       console.error("Avatar upload failed:", err);
//       setError(err.response?.data?.message || "Failed to upload avatar. Please try again.");
//       return false;
//     } finally {
//       setAvatarLoading(false);
//     }
//   };
  
//   // Function to upload avatar independently (not with form submit)
//   const handleAvatarUpload = async (e) => {
//     e.preventDefault();
//     if (selectedFile) {
//       await uploadAvatar();
//     } else {
//       setError("Please select an image first");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="profile-page">
//         <div className="profile-card">
//           <Loader size="large" color="primary" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-page">
//       {error && (
//         <div className="error-message">
//           {error}
//           <button onClick={() => setError(null)} className="close-error">×</button>
//         </div>
//       )}
      
//       <div className="profile-card">
//         <div className="profile-header-section">
//           <div className="avatar-container">
//             <img 
//               src={avatar || DEFAULT_AVATAR} 
//               alt="Profile" 
//               className="profile-avatar"
//               onError={(e) => {
//                 e.target.src = DEFAULT_AVATAR;
//               }}
//             />
//           </div>
//           <h2 className="profile-username">
//             {user?.firstName && user?.lastName
//               ? `${user.firstName} ${user.lastName}`
//               : user?.username || "Guest"}
//           </h2>
//           <p className="profile-email-text">{user?.email}</p>
//         </div>

//         <div className="profile-info-section">
//           {user?.firstName && (
//             <div className="profile-info-item">
//               <span className="info-label">Name:</span>
//               <p className="info-value">{user.firstName} {user.lastName}</p>
//             </div>
//           )}
          
//           {user?.age && (
//             <div className="profile-info-item">
//               <span className="info-label">Age:</span>
//               <p className="info-value">{user.age}</p>
//             </div>
//           )}

//           {user?.gender && (
//             <div className="profile-info-item">
//               <span className="info-label">Gender:</span>
//               <p className="info-value">{user.gender}</p>
//             </div>
//           )}

//           {user?.country && (
//             <div className="profile-info-item">
//               <span className="info-label">Location:</span>
//               <p className="info-value">{user.city && `${user.city}, `}{user.country}</p>
//             </div>
//           )}

//           {user?.qualification && (
//             <div className="profile-info-item">
//               <span className="info-label">Qualification:</span>
//               <p className="info-value">{user.qualification}</p>
//             </div>
//           )}
          
//           {user?.phone && (
//             <div className="profile-info-item">
//               <span className="info-label">Phone:</span>
//               <p className="info-value">{user.phone}</p>
//             </div>
//           )}
//         </div>

//         <div className="profile-action-buttons">
//           <button 
//             className="edit-button" 
//             onClick={() => setIsModalOpen(true)}
//             disabled={isLoggingOut}
//           >
//             {isFirstTime ? "Complete Profile" : "Edit Profile"}
//           </button>
//           <button 
//             className="logout-button" 
//             onClick={handleLogout}
//             disabled={isLoggingOut}
//           >
//             {isLoggingOut ? "Logging Out..." : "Logout"}
//           </button>
//           <button 
//             className="go-back-button" 
//             onClick={() => navigate("/")}
//             disabled={isLoggingOut}
//           >
//               Go Back
//           </button>
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="profile-modal-overlay">
//           <div className="profile-edit-modal">
//             <div className="modal-title-section">
//               <h3 className="modal-title">
//                 {isFirstTime ? "Complete Your Profile " : "Update Your Profile"}
//               </h3>
//               {!isFirstTime && (
//                 <button 
//                   className="modal-close-button"
//                   onClick={() => setIsModalOpen(false)}
//                   disabled={isUpdating}
//                 >
//                   &times;
//                 </button>
//               )}
//             </div>

//             <form onSubmit={handleSubmit} className="profile-edit-form">
//               <div className="profile-image-upload">
//                 <img
//                   src={previewImage || avatar || DEFAULT_AVATAR}
//                   alt="Profile Preview"
//                   className="profile-image-preview"
//                   onError={(e) => {
//                     e.target.src = DEFAULT_AVATAR;
//                   }}
//                 />
//                 <div className="image-upload-controls">
//                   <label className="image-upload-button">
//                     Select Photo
//                     <input
//                       type="file"
//                       accept="image/jpeg, image/png, image/gif"
//                       onChange={handleImageSelect}
//                       disabled={isUpdating || avatarLoading}
//                     />
//                   </label>
//                   {selectedFile && (
//                     <button 
//                       type="button"
//                       onClick={handleAvatarUpload}
//                       disabled={isUpdating || avatarLoading}
//                       className="upload-avatar-button"
//                     >
//                       {avatarLoading ? "Uploading..." : "Upload Photo"}
//                     </button>
//                   )}
//                   <button 
//                     type="button"
//                     onClick={handleRemoveImage}
//                     disabled={isUpdating || avatarLoading || (!user?.profileImage && !previewImage)}
//                     className="remove-avatar-button"
//                   >
//                     Remove Photo
//                   </button>
//                 </div>
//                 {avatarLoading && <p>Uploading image...</p>}
//                 {selectedFile && <p className="selected-file-name">Selected: {selectedFile.name}</p>}
//               </div>
              
//               <div className="form-fields-grid">
//                 <div className="form-field-group">
//                   <label className="form-label">First Name{isFirstTime ? '*' : ''}</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleInputChange}
//                     placeholder="e.g. Hassan"
//                     className={`form-input ${errors.firstName ? 'error' : ''}`}
//                     disabled={isUpdating}
//                   />
//                   {errors.firstName && <span className="error-text">{errors.firstName}</span>}
//                 </div>

//                 <div className="form-field-group">
//                   <label className="form-label">Last Name{isFirstTime ? '*' : ''}</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleInputChange}
//                     placeholder="e.g. Khan"
//                     className={`form-input ${errors.lastName ? 'error' : ''}`}
//                     disabled={isUpdating}
//                   />
//                   {errors.lastName && <span className="error-text">{errors.lastName}</span>}
//                 </div>

//                 <div className="form-field-group">
//                   <label className="form-label">Age{isFirstTime ? '*' : ''}</label>
//                   <input
//                     type="number"
//                     name="age"
//                     value={formData.age}
//                     onChange={handleInputChange}
//                     placeholder="e.g. 25"
//                     min="1"
//                     max="120"
//                     className={`form-input ${errors.age ? 'error' : ''}`}
//                     disabled={isUpdating}
//                   />
//                   {errors.age && <span className="error-text">{errors.age}</span>}
//                 </div>

//                 <div className="form-field-group">
//                   <label className="form-label">Gender{isFirstTime ? '*' : ''}</label>
//                   <select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleInputChange}
//                     className={`form-select ${errors.gender ? 'error' : ''}`}
//                     disabled={isUpdating}
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                   {errors.gender && <span className="error-text">{errors.gender}</span>}
//                 </div>

//                 <div className="form-field-group">
//                   <label className="form-label">Phone Number{isFirstTime ? '*' : ''}</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     placeholder="e.g. 03001234567"
//                     pattern="[0-9]{10,15}"
//                     className={`form-input ${errors.phone ? 'error' : ''}`}
//                     disabled={isUpdating}
//                   />
//                   {errors.phone && <span className="error-text">{errors.phone}</span>}
//                 </div>

//                 <div className="form-field-group">
//                   <label className="form-label">Country{isFirstTime ? '*' : ''}</label>
//                   <select
//                     name="country"
//                     value={formData.country}
//                     onChange={handleInputChange}
//                     className={`form-select ${errors.country ? 'error' : ''}`}
//                     disabled={isUpdating}
//                   >
//                     <option value="">Select Country</option>
//                     {countryList.map((country, index) => (
//                       <option key={index} value={country.name}>
//                         {country.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.country && <span className="error-text">{errors.country}</span>}
//                 </div>

//                 <div className="form-field-group">
//                   <label className="form-label">City{isFirstTime ? '*' : ''}</label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     placeholder="e.g. Karachi"
//                     className={`form-input ${errors.city ? 'error' : ''}`}
//                     disabled={isUpdating}
//                   />
//                   {errors.city && <span className="error-text">{errors.city}</span>}
//                 </div>

//                 <div className="form-field-group">
//                   <label className="form-label">Qualification{isFirstTime ? '*' : ''}</label>
//                   <input
//                     type="text"
//                     name="qualification"
//                     value={formData.qualification}
//                     onChange={handleInputChange}
//                     placeholder="e.g. BSCS"
//                     className={`form-input ${errors.qualification ? 'error' : ''}`}
//                     disabled={isUpdating}
//                   />
//                   {errors.qualification && <span className="error-text">{errors.qualification}</span>}
//                 </div>

//                 <div className="form-field-group full-width">
//                   <label className="form-label">Address{isFirstTime ? '*' : ''}</label>
//                   <textarea
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     placeholder="Full address..."
//                     rows="3"
//                     className={`form-textarea ${errors.address ? 'error' : ''}`}
//                     disabled={isUpdating}
//                   ></textarea>
//                   {errors.address && <span className="error-text">{errors.address}</span>}
//                 </div>
//               </div>

//               <div className="form-submit-section">
//                 <button 
//                   type="submit" 
//                   className="form-submit-button edit-button"
//                   disabled={isUpdating}
//                 >
//                   {isUpdating ? "Saving..." : "Save Changes"}
//                 </button>
//                 {!isFirstTime && (
//                   <button 
//                     type="button" 
//                     className="form-cancel-button logout-button"
//                     onClick={() => setIsModalOpen(false)}
//                     disabled={isUpdating}
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  Avatar, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Upload, 
  message, 
  Spin, 
  Divider,
  Row,
  Col,
  Alert
} from "antd";
import { 
  UserOutlined, 
  EditOutlined, 
  LogoutOutlined, 
  ArrowLeftOutlined,
  CloseOutlined,
  UploadOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import Loader from "./Loader";
import "./Profile.css";

const { Option } = Select;
const { TextArea } = Input;

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-task-manager-production.up.railway.app';
const DEFAULT_AVATAR = '/defult.png';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Basic country list
  const countryList = [
    { name: "Pakistan" },
    { name: "India" },
    { name: "Iran" },
    { name: "Iraq" },
    { name: "United States" },
    { name: "United Kingdom" },
    { name: "Canada" },
    { name: "Australia" },
    { name: "Afghanistan" }
  ];

  // Helper function to get avatar URL
  const getAvatarUrl = (filename) => {
    if (!filename) return DEFAULT_AVATAR;
    return `${API_URL}/api/user/uploads/${filename}`;
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }
      
      const response = await axios.get(`${API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      const userData = response.data;
      
      // Save user data to local storage
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      // Set avatar if available
      if (userData.profileImage) {
        const avatarUrl = getAvatarUrl(userData.profileImage);
        setAvatar(avatarUrl);
        setPreviewImage(avatarUrl);
      }
      
      if (!userData.firstName || !userData.lastName) {
        setIsFirstTime(true);
        setIsModalOpen(true);
      }

      if (userData) {
        form.setFieldsValue({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          age: userData.age || "",
          gender: userData.gender || "",
          phone: userData.phone || "",
          country: userData.country || "",
          city: userData.city || "",
          address: userData.address || "",
          qualification: userData.qualification || ""
        });
      }
    } catch (error) {
      setError("Failed to load profile data. Please try again later.");
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // First try to load from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const storedUser = JSON.parse(userStr);
        setUser(storedUser);
        if (storedUser.profileImage) {
          const avatarUrl = getAvatarUrl(storedUser.profileImage);
          setAvatar(avatarUrl);
          setPreviewImage(avatarUrl);
        }
      } catch (e) {
        console.error("Error parsing stored user", e);
      }
    }
    
    // Then fetch fresh data from server
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const token = localStorage.getItem("token");
      
      try {
        await axios.post(
          `${API_URL}/api/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("Error calling logout API:", err);
        // Continue with logout even if API fails
      }
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      setError("Logout failed. Please try again.");
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsUpdating(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }
      
      // If there's a file selected, upload it first
      if (selectedFile) {
        const uploadSuccess = await uploadAvatar();
        if (!uploadSuccess) {
          setIsUpdating(false);
          return;
        }
      }
      
      const response = await axios.put(
        `${API_URL}/api/user/update`, 
        values,  
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );
      
      const updatedUser = response.data.user;
      
      // Make sure to preserve the profileImage field
      const newUser = {
        ...updatedUser,
        profileImage: updatedUser.profileImage || user?.profileImage
      };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      setIsFirstTime(false);
      setIsModalOpen(false);
      message.success("Profile updated successfully!");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update profile. Please try again.";
      setError(errorMsg);
      message.error(errorMsg);
      console.error("Update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const beforeUpload = (file) => {
    const isImage = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type);
    if (!isImage) {
      message.error('You can only upload JPG/PNG/GIF files!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }
    
    // Save the file for later upload
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
    
    return false; // Prevent automatic upload
  };
  
  // Handle removing profile image
  const handleRemoveImage = async () => {
    try {
      setAvatarLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      // Call API to remove profile image from server
      const response = await axios.delete(
        `${API_URL}/api/user/remove-profile-image`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.data && response.data.success) {
        // Update user data from response
        const { user: updatedUser } = response.data;
        
        // Update state and local storage
        setUser(updatedUser);
        setAvatar(DEFAULT_AVATAR);
        setPreviewImage(DEFAULT_AVATAR);
        setSelectedFile(null);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setError(null);
        message.success("Profile image removed successfully!");
      } else {
        throw new Error("Failed to remove profile image");
      }
    } catch (err) {
      console.error("Remove avatar failed:", err);
      const errorMsg = err.response?.data?.message || "Failed to remove avatar. Please try again.";
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setAvatarLoading(false);
    }
  };
  
  const uploadAvatar = async () => {
    if (!selectedFile) return false;
    
    try {
      setAvatarLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return false;
      }
      
      // Create FormData
      const formDataObj = new FormData();
      formDataObj.append('profileImage', selectedFile);
      
      // Send file using FormData
      const response = await axios.post(
        `${API_URL}/api/user/upload-profile-image`,
        formDataObj,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        // Get the avatar information from response
        const { imageUrl, user: updatedUser } = response.data;
        
        // Update avatar in state
        setAvatar(imageUrl);
        setPreviewImage(imageUrl);
        
        // Update user object with new profile image
        const newUser = { 
          ...user, 
          profileImage: updatedUser.profileImage
        };
        
        // Update state and local storage
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        // Clear selected file after successful upload
        setSelectedFile(null);
        message.success("Profile image uploaded successfully!");
        return true;
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      const errorMsg = err.response?.data?.message || "Failed to upload avatar. Please try again.";
      setError(errorMsg);
      message.error(errorMsg);
      return false;
    } finally {
      setAvatarLoading(false);
    }
  };
  
  // Function to upload avatar independently (not with form submit)
  const handleAvatarUpload = async () => {
    if (selectedFile) {
      await uploadAvatar();
    } else {
      message.error("Please select an image first");
    }
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <Spin tip="Loading profile..." size="large">
          <div style={{ minHeight: '200px' }} />
        </Spin>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 24 }}
        />
      )}
      
      <Card className="profile-card">
        <div className="profile-header-section">
          <Avatar 
            size={128} 
            src={avatar || DEFAULT_AVATAR} 
            icon={<UserOutlined />}
            className="profile-avatar"
            onError={() => true}
          />
          <h2 className="profile-username">
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.username || "Guest"}
          </h2>
          <p className="profile-email-text">{user?.email}</p>
        </div>

        <Divider />

        <div className="profile-info-section">
          <Row gutter={[16, 16]}>
            {user?.firstName && (
              <Col span={12}>
                <div className="profile-info-item">
                  <span className="info-label">Name:</span>
                  <p className="info-value">{user.firstName} {user.lastName}</p>
                </div>
              </Col>
            )}
            
            {user?.age && (
              <Col span={12}>
                <div className="profile-info-item">
                  <span className="info-label">Age:</span>
                  <p className="info-value">{user.age}</p>
                </div>
              </Col>
            )}

            {user?.gender && (
              <Col span={12}>
                <div className="profile-info-item">
                  <span className="info-label">Gender:</span>
                  <p className="info-value">{user.gender}</p>
                </div>
              </Col>
            )}

            {user?.country && (
              <Col span={12}>
                <div className="profile-info-item">
                  <span className="info-label">Location:</span>
                  <p className="info-value">{user.city && `${user.city}, `}{user.country}</p>
                </div>
              </Col>
            )}

            {user?.qualification && (
              <Col span={12}>
                <div className="profile-info-item">
                  <span className="info-label">Qualification:</span>
                  <p className="info-value">{user.qualification}</p>
                </div>
              </Col>
            )}
            
            {user?.phone && (
              <Col span={12}>
                <div className="profile-info-item">
                  <span className="info-label">Phone:</span>
                  <p className="info-value">{user.phone}</p>
                </div>
              </Col>
            )}
          </Row>
        </div>

        <Divider />

        <div className="profile-action-buttons">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => setIsModalOpen(true)}
            loading={isLoggingOut}
            style={{ marginRight: 8 }}
          >
            {isFirstTime ? "Complete Profile" : "Edit Profile"}
          </Button>
          <Button 
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            loading={isLoggingOut}
            style={{ marginRight: 8 }}
          >
            Logout
          </Button>
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/")}
            disabled={isLoggingOut}
          >
            Go Back
          </Button>
        </div>
      </Card>

      <Modal
        title={isFirstTime ? "Complete Your Profile" : "Update Your Profile"}
        open={isModalOpen}
        onCancel={() => !isFirstTime && setIsModalOpen(false)}
        footer={null}
        width={800}
        closable={!isFirstTime}
        maskClosable={!isFirstTime}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            age: user?.age || "",
            gender: user?.gender || "",
            phone: user?.phone || "",
            country: user?.country || "",
            city: user?.city || "",
            address: user?.address || "",
            qualification: user?.qualification || ""
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar 
              size={128} 
              src={previewImage || avatar || DEFAULT_AVATAR} 
              icon={<UserOutlined />}
              className="profile-avatar"
              onError={() => true}
            />
            
            <div style={{ marginTop: 16 }}>
              <Upload
                beforeUpload={beforeUpload}
                showUploadList={false}
                accept="image/jpeg, image/png, image/gif"
                disabled={isUpdating || avatarLoading}
              >
                <Button icon={<UploadOutlined />} style={{ marginRight: 8 }}>
                  Select Photo
                </Button>
              </Upload>
              
              {selectedFile && (
                <Button 
                  onClick={handleAvatarUpload}
                  loading={avatarLoading}
                  style={{ marginRight: 8 }}
                >
                  Upload Photo
                </Button>
              )}
              
              <Button 
                danger
                icon={<DeleteOutlined />}
                onClick={handleRemoveImage}
                loading={avatarLoading}
                disabled={!user?.profileImage && !previewImage}
              >
                Remove Photo
              </Button>
            </div>
            
            {selectedFile && (
              <p style={{ marginTop: 8 }}>Selected: {selectedFile.name}</p>
            )}
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: 'Please input your first name!' }
                ]}
              >
                <Input placeholder="e.g. Hassan" disabled={isUpdating} />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  { required: true, message: 'Please input your last name!' }
                ]}
              >
                <Input placeholder="e.g. Khan" disabled={isUpdating} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="age"
                label="Age"
                rules={[
                  { required: isFirstTime, message: 'Please input your age!' }
                ]}
              >
                <Input type="number" min={1} max={120} disabled={isUpdating} />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[
                  { required: isFirstTime, message: 'Please select your gender!' }
                ]}
              >
                <Select placeholder="Select Gender" disabled={isUpdating}>
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: isFirstTime, message: 'Please input your phone number!' },
                  { pattern: /^[0-9]{10,15}$/, message: 'Please enter a valid phone number!' }
                ]}
              >
                <Input placeholder="e.g. 03001234567" disabled={isUpdating} />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="country"
                label="Country"
                rules={[
                  { required: isFirstTime, message: 'Please select your country!' }
                ]}
              >
                <Select placeholder="Select Country" disabled={isUpdating}>
                  {countryList.map((country, index) => (
                    <Option key={index} value={country.name}>
                      {country.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="city"
                label="City"
                rules={[
                  { required: isFirstTime, message: 'Please input your city!' }
                ]}
              >
                <Input placeholder="e.g. Karachi" disabled={isUpdating} />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="qualification"
                label="Qualification"
                rules={[
                  { required: isFirstTime, message: 'Please input your qualification!' }
                ]}
              >
                <Input placeholder="e.g. BSCS" disabled={isUpdating} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Address"
            rules={[
              { required: isFirstTime, message: 'Please input your address!' }
            ]}
          >
            <TextArea rows={3} disabled={isUpdating} />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            {!isFirstTime && (
              <Button 
                onClick={() => setIsModalOpen(false)}
                disabled={isUpdating}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;