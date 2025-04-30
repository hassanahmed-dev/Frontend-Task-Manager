import { Button, Form, Input, message, Typography, Image } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState } from 'react';
import './ForgotPassword.css';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // onFinish function to handle form submission
  const onFinish = async (values) => {
    try {
      setLoading(true); // Start loading
      setError(null); // Reset error state

      // Use import.meta.env for Vite
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        // Handle missing API URL
        setError("API URL is not defined. Please check your environment variables.");
        return;
      }

      // Make the API request to reset the password
      const res = await axios.post(`${apiUrl}/api/auth/forgot-password`, values);

      if (res.status === 200) {
        setSuccess(true);
        message.success("Password reset link sent to your email!");
        setTimeout(() => navigate("/login"), 3000);  // Navigate after 3 seconds
      } else {
        // If something goes wrong with the response
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      // Handle errors, both from the API and other sources
      const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           "Something went wrong. Please try again.";
      console.error("Forgot password error:", err);
      setError(errorMessage); // Set the error state to display
      message.error(errorMessage); // Show error message in UI
    } finally {
      setLoading(false); // Stop loading once the operation is complete
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <Image 
          src="/logo.jpg" 
          alt="Company Logo" 
          preview={false}
          width={200}
          height={150}
        />
      </div>

      <Title level={2} className="auth-title">
        Forgot Password
      </Title>

      {error && (
        <div className="auth-error">
          <Text type="danger">{error}</Text>
        </div>
      )}

      {/* Show success message */}
      {success && (
        <div className="auth-success">
          <Text type="success">Password reset link has been sent!</Text>
        </div>
      )}

      {!success && (
        <Form 
          onFinish={onFinish} 
          layout="vertical" 
          className="auth-form"
        >
          <Form.Item
            name="email"
            rules={[ 
              { required: true, message: 'Please input your email!' }, 
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              size="large" 
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Form.Item>

          <div className="auth-actions">
            <Text>
              Remembered your password? <Link to="/login">Log In</Link>
            </Text>
          </div>
        </Form>
      )}

      {success && (
        <div className="auth-actions" style={{ marginTop: 24 }}>
          <Button type="primary" onClick={() => navigate('/login')}>
            Back to Login
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
