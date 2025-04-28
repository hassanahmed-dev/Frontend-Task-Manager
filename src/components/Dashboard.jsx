import { useState, useEffect } from "react"
import { Inbox, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { Modal, Form, Input, DatePicker, Select, Button, message } from 'antd'
import moment from 'moment'
import axios from 'axios'
import Tasklist from './Tasklist'
import Loader from "./Loader"
import './Dashboard.css'

const { TextArea } = Input;
const { Option } = Select;

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [selectedTask, setSelectedTask] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      // If no token found, redirect to login
      navigate('/login')
    } else {
      // Fetch tasks
      fetchTasks()
    }
  }, [navigate])

  // Function to handle authentication errors
  const handleAuthError = (error) => {
    // Don't automatically redirect to login on 403 errors, just show an error message
    if (error.response && error.response.status === 401) {
      message.error('Your session has expired. Please login again.');
      localStorage.removeItem('token');
      navigate('/login');
    } else if (error.response && error.response.status === 403) {
      message.error('You do not have permission to perform this action.');
    }
  }

  // Function to get authorized axios instance
  const getAuthAxios = () => {
    // Get fresh token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      message.error('You are not logged in');
      navigate('/login');
      return null;
    }
    
    // Create axios instance with token
    return axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  };

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const authAxios = getAuthAxios();
      
      if (!authAxios) return;
      
      const response = await authAxios.get(`${API_URL}/api/tasks`);
      
      if (response.data && response.data.data) {
        setTasks(response.data.data || []);
      } else {
        setTasks([]);
        console.warn("Unexpected data format from API:", response.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      // Only handle auth errors, don't log user out for other errors
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        handleAuthError(err);
      } else {
        message.error('Failed to fetch tasks');
      }
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Dashboard stats data
  const stats = [
    {
      title: "Total Tasks",
      count: tasks.length,
      icon: <Inbox className="stat-icon" />,
      color: "blue",
      borderColor: "#3b82f6",
      bgColor: "#dbeafe",
      iconColor: "#3b82f6",
    },
    {
      title: "Completed",
      count: tasks.filter((task) => task.status === "completed").length,
      icon: <CheckCircle className="stat-icon" />,
      color: "green",
      borderColor: "#22c55e",
      bgColor: "#dcfce7",
      iconColor: "#22c55e",
    },
    {
      title: "Pending",
      count: tasks.filter((task) => task.status === "pending").length,
      icon: <Clock className="stat-icon" />,
      color: "yellow",
      borderColor: "#f59e0b",
      bgColor: "#fef3c7",
      iconColor: "#f59e0b",
    },
    {
      title: "High Priority",
      count: tasks.filter((task) => task.priority === "high").length,
      icon: <AlertCircle className="stat-icon" />,
      color: "red",
      borderColor: "#ef4444",
      bgColor: "#fee2e2",
      iconColor: "#ef4444",
    },
  ]

  const showModal = () => {
    setIsEditMode(false);
    setSelectedTask(null);
    form.resetFields();
    form.setFieldsValue({
      priority: 'medium'
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedTask(null);
  };

  const handleSubmit = async (values) => {
    try {
      const authAxios = getAuthAxios();
      
      if (!authAxios) return;
      
      const taskData = {
        title: values.title,
        description: values.description,
        priority: values.priority,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
        status: values.status || 'pending'
      };

      if (isEditMode && selectedTask) {
        // Update existing task
        await authAxios.put(`${API_URL}/api/tasks/${selectedTask._id}`, taskData);
        message.success('Task updated successfully');
      } else {
        // Create new task
        await authAxios.post(`${API_URL}/api/tasks`, taskData);
        message.success('Task created successfully');
      }
      
      // Refresh task list
      fetchTasks();
      setIsModalOpen(false);
      form.resetFields();
      setSelectedTask(null);
    } catch (err) {
      console.error('Error saving task:', err);
      // Only handle auth errors, don't log user out for other errors
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        handleAuthError(err);
      } else {
        message.error('Failed to save task');
      }
    }
  };

  const handleTaskUpdate = async (taskId, taskData, showModal = false) => {
    try {
      const authAxios = getAuthAxios();
      
      if (!authAxios) return;
      
      if (showModal) {
        // Get the task to edit and populate the form
        const taskToEdit = tasks.find(task => task._id === taskId);
        if (taskToEdit) {
          setSelectedTask(taskToEdit);
          setIsEditMode(true);
          form.setFieldsValue({
            title: taskToEdit.title,
            description: taskToEdit.description,
            priority: taskToEdit.priority,
            dueDate: taskToEdit.dueDate ? moment(taskToEdit.dueDate) : null,
            status: taskToEdit.status
          });
          setIsModalOpen(true);
        }
      } else if (taskData) {
        // Direct update without showing modal
        await authAxios.put(`${API_URL}/api/tasks/${taskId}`, taskData);
        message.success('Task updated successfully');
        fetchTasks();
      }
    } catch (err) {
      console.error('Error updating task:', err);
      // Only handle auth errors, don't log user out for other errors
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        handleAuthError(err);
      } else {
        message.error('Failed to update task');
      }
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const authAxios = getAuthAxios();
      
      if (!authAxios) return;
      
      await authAxios.delete(`${API_URL}/api/tasks/${taskId}`);
      message.success('Task deleted successfully');
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      // Only handle auth errors, don't log user out for other errors
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        handleAuthError(err);
      } else {
        message.error('Failed to delete task');
      }
    }
  };

  // Task form for the modal
  const taskForm = (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="title"
        label={<span>Task Title <span style={{ color: '#ff4d4f' }}>*</span></span>}
        rules={[{ required: true, message: 'Please enter the task title' }]}
      >
        <Input placeholder="Enter task title" />
      </Form.Item>
      
      <Form.Item
        name="description"
        label="Description"
      >
        <TextArea rows={4} placeholder="Enter task description (optional)" />
      </Form.Item>
      
      <Form.Item
        name="priority"
        label="Priority"
        initialValue="medium"
      >
        <Select placeholder="Select priority">
          <Option value="low">Low</Option>
          <Option value="medium">Medium</Option>
          <Option value="high">High</Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        name="status"
        label="Status"
        initialValue="pending"
      >
        <Select placeholder="Select status">
          <Option value="pending">Pending</Option>
          <Option value="in-progress">In Progress</Option>
          <Option value="completed">Completed</Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        name="dueDate"
        label="Due Date"
      >
        <DatePicker style={{ width: '100%' }} placeholder="Select date" />
      </Form.Item>
    </Form>
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard">
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <h1>My Tasks</h1>
            <button className="add-task-btn" onClick={showModal}>
              <Plus size={20} /> Add Task
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-container">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                {/* Colored top border */}
                <div className="card-border" style={{ backgroundColor: stat.borderColor }}></div>

                <div className="card-content">
                  {/* Card title */}
                  <h3 className="card-title">{stat.title}</h3>

                  {/* Card content */}
                  <div className="card-data">
                    {/* Icon container */}
                    <div
                      className="icon-container"
                      style={{
                        backgroundColor: stat.bgColor,
                        color: stat.iconColor,
                      }}
                    >
                      {stat.icon}
                    </div>

                    {/* Count */}
                    <span className="count-number">{stat.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Task List */}
          <div className="tasklist-section">
            <h2>Task List</h2>
            <Tasklist 
              tasks={tasks} 
              onTaskUpdate={handleTaskUpdate} 
              onTaskDelete={handleTaskDelete} 
            />
          </div>

          {/* Add/Edit Task Modal using Ant Design */}
          <Modal
            title={isEditMode ? "Edit Task" : "Add New Task"}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[
              <Button key="cancel" onClick={handleCancel} className="modal-footer-btn cancel-btn">
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={() => form.submit()} className="modal-footer-btn submit-btn">
                {isEditMode ? "Update Task" : "Add Task"}
              </Button>
            ]}
          >
            {taskForm}
          </Modal>
        </div>
      )}
    </>
  )
}

export default Dashboard
