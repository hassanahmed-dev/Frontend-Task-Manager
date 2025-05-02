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
  Alert,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
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
    { name: "Afghanistan" },
  ];

  // Helper function to get avatar URL
  const getAvatarUrl = (url) => {
    if (!url) return DEFAULT_AVATAR;
    return url; // Cloudinary URL
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        console.log('No token found, redirecting to login');
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;
      console.log('Fetched user data:', userData);

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
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to load profile data. Please try again later.";
      setError(errorMsg);
      console.error("Error fetching user data:", error.message, error.response?.data);
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
        console.error("Error parsing stored user:", e);
      }
    }

    // Then fetch fresh data from server
    fetchUserData();
  }, []);

  useEffect(() => {
    // Set form fields after user data is loaded and modal is open
    if (user && isModalOpen) {
      form.setFieldsValue({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        gender: user.gender || "",
        phone: user.phone || "",
        country: user.country || "",
        city: user.city || "",
        address: user.address || "",
        qualification: user.qualification || "",
      });
    }
  }, [user, isModalOpen, form]);

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
        console.log('No token found, redirecting to login');
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/user/update`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsFirstTime(false);
      setIsModalOpen(false);
      message.success("Profile updated successfully!");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update profile. Please try again.";
      setError(errorMsg);
      console.error("Update failed:", error.message, error.response?.data);
      message.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const beforeUpload = (file) => {
    console.log('Selected file:', file.name);

    // Save the file for later upload
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('File preview generated:', e.target.result.substring(0, 50) + '...');
      setPreviewImage(e.target.result);
    };
    reader.onerror = (e) => {
      console.error('Error reading file:', e);
      message.error('Failed to read file for preview.');
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
        console.log('No token found, redirecting to login');
        navigate("/login");
        return;
      }

      // Call API to remove profile image from server
      const response = await axios.delete(
        `${API_URL}/api/user/remove-profile-image`,
        {
          headers: { Authorization: `Bearer ${token}` },
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

        message.success("Profile image removed successfully!");
      } else {
        throw new Error("Failed to remove profile image");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to remove avatar. Please try again.";
      setError(errorMsg);
      console.error("Remove avatar failed:", err.message, err.response?.data);
      message.error(errorMsg);
    } finally {
      setAvatarLoading(false);
    }
  };

  const uploadAvatar = async () => {
    if (!selectedFile) {
      console.error('No file selected for upload');
      message.error("Please select an image first");
      return false;
    }

    try {
      setAvatarLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate("/login");
        return false;
      }

      // Create base64 string
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64String = reader.result;
            console.log('Base64 string to send:', base64String.substring(0, 50) + '...');

            // Send base64 image data
            const response = await axios.post(
              `${API_URL}/api/user/upload-profile-image`,
              { profileImage: base64String },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
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
                profileImage: updatedUser.profileImage,
              };

              // Update state and local storage
              setUser(newUser);
              localStorage.setItem('user', JSON.stringify(newUser));

              // Clear selected file after successful upload
              setSelectedFile(null);
              message.success("Profile image uploaded successfully!");
              resolve(true);
            } else {
              throw new Error("Invalid response format from server");
            }
          } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to upload avatar. Please try again.";
            setError(errorMsg);
            console.error("Avatar upload failed:", err.message, err.response?.data);
            message.error(errorMsg);
            reject(err);
          }
        };
        reader.onerror = () => {
          console.error('Failed to read file for upload');
          message.error('Failed to read file for upload.');
          reject(new Error("Failed to read file"));
        };
      });
    } catch (err) {
      console.error("Avatar upload failed:", err);
      return false;
    } finally {
      setAvatarLoading(false);
    }
  };

  // Function to upload avatar independently
  const handleAvatarUpload = async () => {
    await uploadAvatar();
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
            onError={() => {
              setAvatar(DEFAULT_AVATAR);
              return true;
            }}
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
                  <p className="info-value">
                    {user.firstName} {user.lastName}
                  </p>
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
                  <p className="info-value">
                    {user.city && `${user.city}, `}
                    {user.country}
                  </p>
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
            qualification: user?.qualification || "",
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar
              size={128}
              src={previewImage || avatar || DEFAULT_AVATAR}
              icon={<UserOutlined />}
              className="profile-avatar"
              onError={() => {
                setPreviewImage(DEFAULT_AVATAR);
                return true;
              }}
            />

            <div style={{ marginTop: 16 }}>
              <Upload
                beforeUpload={beforeUpload}
                showUploadList={false}
                accept="image/*"
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
                disabled={!user?.profileImage && !selectedFile}
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
                rules={[{ required: true, message: 'Please input your first name!' }]}
              >
                <Input placeholder="e.g. Hassan" disabled={isUpdating} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please input your last name!' }]}
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
                rules={[{ required: isFirstTime, message: 'Please input your age!' }]}
              >
                <Input type="number" min={1} max={120} disabled={isUpdating} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: isFirstTime, message: 'Please select your gender!' }]}
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
                  { pattern: /^[0-9]{10,15}$/, message: 'Please enter a valid phone number!' },
                ]}
              >
                <Input placeholder="e.g. 03001234567" disabled={isUpdating} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: isFirstTime, message: 'Please select your country!' }]}
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
                rules={[{ required: isFirstTime, message: 'Please input your city!' }]}
              >
                <Input placeholder="e.g. Karachi" disabled={isUpdating} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="qualification"
                label="Qualification"
                rules={[{ required: isFirstTime, message: 'Please input your qualification!' }]}
              >
                <Input placeholder="e.g. BSCS" disabled={isUpdating} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: isFirstTime, message: 'Please input your address!' }]}
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
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;