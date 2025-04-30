import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import Loader from './Loader';
import moment from 'moment';
import axios from 'axios';
import 'moment/locale/en-gb';

moment.locale('en-gb');

const Calendar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const localizer = momentLocalizer(moment);
  const API_URL = import.meta.env.VITE_API_URL || 'https://backend-task-manager-production.up.railway.app';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchTasks();
    }
  }, [navigate]);

  const getAuthAxios = () => {
    const token = localStorage.getItem('token');
    return axios.create({
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const authAxios = getAuthAxios();
      const response = await authAxios.get(`${API_URL}/api/tasks`);
      const formattedTasks = response.data.data.map(task => {
        const base = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
        const startDate = new Date(base.setHours(0, 0, 0, 0));
        const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
        return {
          id: task._id,
          title: task.title,
          start: startDate,
          end: endDate,
          allDay: true,
          priority: task.priority
        };
      });
      setTasks(formattedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#1890ff';
    if (event.priority === 'high') backgroundColor = '#f5222d';
    else if (event.priority === 'medium') backgroundColor = '#fa8c16';
    else if (event.priority === 'low') backgroundColor = '#52c41a';

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleSelectEvent = () => {
    navigate('/');
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard calendar-container">
          <div className="dashboard-header">
            <h1>Calendar</h1>
          </div>
          <Card className="calendar-card">
            <div className="calendar-wrapper">
              <BigCalendar
                localizer={localizer}
                events={tasks}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                views={['month']}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={handleSelectEvent}
                popup
                toolbar
              />
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default Calendar;
