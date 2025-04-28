import { Layout, Menu, Dropdown, Avatar, Typography, Button, Drawer } from 'antd';
import { LogoutOutlined, UserOutlined, CalendarOutlined, DashboardOutlined, MenuOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useState, useEffect } from 'react';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [userName, setUserName] = useState('User');

  // Get user info from localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        // Set username from user data (fallback to username if no name is available)
        setUserName(userData.username || userData.name || 'User');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'logout',
      label: <span style={{ color: '#ff4d4f' }}>Logout</span>,
      icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
      onClick: handleLogout,
      style: { color: '#ff4d4f' },
      danger: true
    }
  ];

  const navItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/calendar',
      icon: <CalendarOutlined />,
      label: <Link to="/calendar">Calendar</Link>,
    },
  ];

  return (
    <Header className="navbar">
    <div className="navbar-left">
      <Link to="/" className="navbar-logo">
        <img src="/logo.jpg" alt="Task Manager Logo" />
      </Link>
    </div>

    <div className="navbar-center desktop-menu">
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={navItems}
      />
    </div>

    <div className="navbar-right desktop-menu">
    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
  <div className="user-dropdown">
    <Avatar  icon={<UserOutlined />} style={{ cursor: 'pointer' }} onClick={(e) => {e.stopPropagation(); navigate('/profile');
      }}
    />
    <Text  className="username"  style={{ cursor: 'pointer' }}  onClick={(e) => {e.stopPropagation();  navigate('/profile'); 
      }}
    >
      {userName}
    </Text>
  </div>
</Dropdown>
    </div>

    <Button 
      className="menu-button" 
      type="text" 
      icon={<MenuOutlined />} 
      onClick={() => setMobileMenuVisible(true)}
    />

    <Drawer
      title={
        <div className="drawer-header">
           <Avatar  icon={<UserOutlined />} style={{ cursor: 'pointer' }} onClick={(e) => {e.stopPropagation(); navigate('/profile'); }}/>
          <Text className="username" style={{ color: 'white', marginLeft: 8, cursor: 'pointer' }} onClick={(e) => {e.stopPropagation(); setMobileMenuVisible(false); navigate('/profile'); }}>{userName}</Text>
        </div>
      }
      placement="right"
      onClose={() => setMobileMenuVisible(false)}
      open={mobileMenuVisible}
      width={250}
      closable = {false}
    >
      <Menu
        theme="light"
        mode="vertical"
        selectedKeys={[location.pathname]}
        items={[
          ...navItems,
          {
            key: 'logout',
            label: <span style={{ color: '#ff4d4f' }}>Logout</span>,
            icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
            onClick: handleLogout,
            danger: true
          }
        ]}
      />
    </Drawer>
  </Header>
  );
};

export default Navbar;