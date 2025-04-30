import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, message, Image } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import './ForgotPassword.css'; // Reuse the same CSS

const { Title, Text } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Validate token exists
  useEffect(() => {
    if (!token) {
      setError('Invalid password reset link');
      message.error('Invalid password reset link');
    }
  }, [token]);
  
  // Form submission handler
  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL;
      
      // Make API request to reset password with the token from URL and new password
      const response = await axios.post(
        `${apiUrl}/api/auth/reset-password/${token}`, 
        { password: values.password }
      );
      
      message.success('Password has been reset successfully!');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Failed to reset password. Please try again.';
      console.error('Reset password error:', err);
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
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
        Reset Your Password
      </Title>
      
      {error && (
        <div className="auth-error">
          <Text type="danger">{error}</Text>
        </div>
      )}
      
      <Form 
        onFinish={onFinish} 
        layout="vertical" 
        className="auth-form"
      >
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please enter your new password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
          hasFeedback
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="New Password" 
            size="large"
          />
        </Form.Item>
        
        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Confirm New Password" 
            size="large"
          />
        </Form.Item>
        
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            disabled={loading || !token}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Form.Item>
        
        <div className="auth-actions">
          <Text>
            Remembered your password? <Link to="/login">Log In</Link>
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default ResetPassword; 