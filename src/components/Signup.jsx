import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, message, Image, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Signup.css';

const { Title, Text } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await axios.post(`${apiUrl}/api/auth/signup`, values);
      
      message.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         'Signup failed. Please try again.';
      console.error('Signup error:', err);
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="welcome-section">
          <Image 
            src="/logo.jpg" 
            alt="Task Manager Logo" 
            preview={false}
            width={100}
          />
          <Title level={2} className="welcome-title">
            Join Us Today!
          </Title>
          <Text className="welcome-subtitle">
            Create your account to start managing tasks efficiently
          </Text>
        </div>

        <Divider />

        {error && (
          <div className="auth-error">
            <Text type="danger">{error}</Text>
          </div>
        )}

        <Form 
          layout="vertical" 
          onFinish={onFinish} 
          className="auth-form"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Please choose a username!' },
              { min: 3, message: 'Username must be at least 3 characters!' },
              { max: 20, message: 'Username cannot exceed 20 characters!' },
              { 
                pattern: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers and underscores!'
              }
            ]}
            hasFeedback
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Choose a username"
              size="large"
              autoComplete="username"
              className="signup-input"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email address!' },
            ]}
            hasFeedback
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Enter your email"
              size="large"
              autoComplete="email"
              className="signup-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please create a password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
              { max: 30, message: 'Password cannot exceed 30 characters!' },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Create a password"
              size="large"
              autoComplete="new-password"
              className="signup-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="signup-button"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Form.Item>
        </Form>

        <div className="login-option">
          <Text>
            Already have an account? <Link to="/login" className="login-link">Login</Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Signup;