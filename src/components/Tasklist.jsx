import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Card, Row, Col, List, message } from 'antd';
import { CheckCircleOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, FlagOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import './Tasklist.css';

const Tasklist = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Handle window resize to detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Make sure tasks is always an array
  const taskArray = Array.isArray(tasks) ? tasks : [];
  
  // Sort tasks by createdAt (newest first)
  const sortedTasks = [...taskArray].sort((a, b) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return new Date(b.createdAt) - new Date(a.createdAt); // Descending order
  });

  // Limit to first 10 tasks if not showing all
  const displayedTasks = showAll ? sortedTasks : sortedTasks.slice(0, 10);
  
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'blue';y
        
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in-progress':
        return 'blue';
      case 'pending':
        return 'gold';
      default:
        return 'default';
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      if (onTaskUpdate) {
        // Create updated task object with new status
        const updatedTask = {
          title: task.title,
          description: task.description || "",
          priority: task.priority || "medium",
          dueDate: task.dueDate,
          status: newStatus
        };
        
        // Confirm task has an _id before updating
        if (!task._id) {
          message.error('Cannot update task: Missing task ID');
          return;
        }
        
        await onTaskUpdate(task._id, updatedTask);
      }
    } catch (error) {
      console.error('Error changing task status:', error);
      message.error('Failed to update task status');
    }
  };

  // Table columns for desktop view
  const columns = [
    {
      title: 'Title & Description',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
      render: (text, record) => (
        <div>
          <div className="task-title">{text || 'Untitled'}</div>
          {record.description && (
            <div className="task-description">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Details',
      key: 'details',
      width: '30%',
      render: (_, record) => (
        <div className="task-details">
          <div className="task-detail-item">
            <CalendarOutlined /> <span>{record.dueDate ? moment(record.dueDate).format('MMM D, YYYY') : 'No due date'}</span>
          </div>
          <div className="task-detail-item">
            <FlagOutlined style={{ color: getPriorityColor(record.priority || 'medium') }} /> 
            <Tag color={getPriorityColor(record.priority || 'medium')}>
              {record.priority ? record.priority.charAt(0).toUpperCase() + record.priority.slice(1) : 'Medium'}
            </Tag>
          </div>
          <div className="task-detail-item">
            <ClockCircleOutlined /> 
            <Tag color={getStatusColor(record.status || 'pending')}>
              {record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : 'Pending'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '30%',
      render: (_, record) => (
        <Space size="small">
          {(record.status !== 'completed') && (
            <Button 
              type="primary"
              icon={<CheckCircleOutlined />} 
              size="small"
              onClick={() => handleStatusChange(record, 'completed')}
              className="complete-btn"
            >
              Complete
            </Button>
          )}
          <Button 
            type="default" 
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              if (record && record._id) {
                onTaskUpdate && onTaskUpdate(record._id, null, true);
              } else {
                message.error('Cannot edit this task');
              }
            }}
            className="edit-btn"
          >
            Edit
          </Button>
          <Button 
            type="default" 
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => {
              if (record && record._id) {
                onTaskDelete && onTaskDelete(record._id);
              } else {
                message.error('Cannot delete this task');
              }
            }}
            className="delete-btn"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Mobile card view
  const renderMobileView = () => {
    return (
      <List
        className="task-list-mobile"
        itemLayout="vertical"
        dataSource={displayedTasks}
        renderItem={task => (
          <Card 
            className={`task-card ${task.status === 'completed' ? 'completed-card' : ''}`}
            key={task._id || Math.random().toString()}
          >
            <div className="task-content">
              <h3 className="task-title">{task.title || 'Untitled'}</h3>
              
              {task.description && (
                <div className="task-description">
                  {task.description}
                </div>
              )}
              
              <div className="task-info">
                <div className="task-date">
                  <CalendarOutlined /> {task.dueDate ? moment(task.dueDate).format('MMM D, YYYY') : 'No due date'}
                </div>
                
                <div className="task-tags">
                  <Tag color={getPriorityColor(task.priority || 'medium')}>
                    <FlagOutlined /> {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'}
                  </Tag>
                  <Tag color={getStatusColor(task.status || 'pending')}>
                    <ClockCircleOutlined /> {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : 'Pending'}
                  </Tag>
                </div>
              </div>
            </div>

            <div className="task-card-actions">
              {(task.status !== 'completed') && (
                <Button 
                  type="primary"
                  icon={<CheckCircleOutlined />} 
                  onClick={() => handleStatusChange(task, 'completed')}
                  className="complete-btn"
                >
                  Complete
                </Button>
              )}
              <Button 
                type="default" 
                icon={<EditOutlined />}
                onClick={() => {
                  if (task && task._id) {
                    onTaskUpdate && onTaskUpdate(task._id, null, true);
                  }
                }}
                className="edit-btn"
              >
                Edit
              </Button>
              <Button 
                type="default" 
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  if (task && task._id) {
                    onTaskDelete && onTaskDelete(task._id);
                  }
                }}
                className="delete-btn"
              >
                Delete
              </Button>
            </div>
          </Card>
        )}
      />
    );
  };

  // Desktop table view
  const renderDesktopView = () => {
    return (
      <Table 
        columns={columns} 
        dataSource={displayedTasks.map(task => ({...task, key: task._id || Math.random().toString()}))}
        pagination={false}
        size="middle"
        className="tasks-table"
        rowClassName={(record) => record.status === 'completed' ? 'completed-row' : ''}
      />
    );
  };

  return (
    <div className="tasklist-container">
      {isMobile ? renderMobileView() : renderDesktopView()}
      
      {sortedTasks.length > 10 && (
        <div className="read-more-container">
          <Button 
            type="primary" 
            onClick={toggleShowAll}
            className="read-more-button"
          >
            {showAll ? 'Show Less' : `Read More (${sortedTasks.length - 10} more tasks)`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tasklist;
