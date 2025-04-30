import { Button, Form, Input, message, Typography, Image, Divider, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState } from 'react';
import './Login.css';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const res = await axios.post(`${apiUrl}/api/auth/login`, values);
      
      // Store token and user data
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      message.success("Login successful!");
      navigate("/"); // Redirect to dashboard instead of home
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         "Login.. failed. Please try again.";
      console.error("Login error:", err);
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="welcome-section">
          <Image 
            src="/logo.jpg" 
            alt="Task Manager Logo" 
            preview={false}
            width={100}
          />
          <Title level={2} className="welcome-title">
            Welcome Back!
          </Title>
          <Text className="welcome-subtitle">
            Log in to access your tasks and stay organized
          </Text>
        </div>

        <Divider />

        {error && (
          <div className="auth-error">
            <Text type="danger">{error}</Text>
          </div>
        )}

        <Form 
          onFinish={onFinish} 
          layout="vertical" 
          className="auth-form"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please input your email!' }, 
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="site-form-item-icon" />} 
              placeholder="Enter your email" 
              size="large" 
              autoComplete="email"
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' }, 
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="site-form-item-icon" />} 
              placeholder="Enter your password" 
              size="large"
              autoComplete="current-password"
              className="login-input"
            />
          </Form.Item>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              disabled={loading}
              className="login-button"
            >
              {loading ? 'Logging In...' : 'Login'}
            </Button>
          </Form.Item>

          <div className="signup-option">
            <Text>
              Don't have an account? <Link to="/signup" className="signup-link">Create Account</Link>
            </Text>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
