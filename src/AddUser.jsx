import React, { useState, useEffect } from 'react';
import './styles/add.css';
import { useNavigate, useLocation } from 'react-router-dom';

const LOCAL_STORAGE_KEY = 'userDatabase'; // Key for local storage

const AddUser = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedUsers) {
      setUsers(storedUsers);
    }

    // Check if there is user data passed for update
    if (location.state) {
      const { userToUpdate } = location.state;
      setFormData(userToUpdate); // Pre-fill form with the user data
    }
  }, [location.state]);

  const saveUsers = (newUsers) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUsers));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      const existingUser = users.find(user => user.email === formData.email);
      if (existingUser && !location.state) {
        alert('Email already exists!');
        return;
      }

      // If user is being updated
      if (location.state) {
        const updatedUsers = [...users];
        updatedUsers[location.state.index] = formData; // Update the user in the array
        setUsers(updatedUsers);
        saveUsers(updatedUsers);
        alert('User updated successfully!');
      } else {
        const newUser = { ...formData, isBlocked: false, active: true, loginHistory: [] };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        saveUsers(updatedUsers); // Save updated users to local storage
        alert('User registered successfully!');
      }

      setFormData({ username: '', email: '', password: '' });
      setErrors({});
      navigate('/user-lists');
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className='main-container'>
      <h2>{location.state ? 'Update User' : 'Register'}</h2>
      <form className='form-container'>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button className='addbutton1' onClick={handleSubmit} type="submit">{location.state ? 'Update' : 'Register'}</button>
      </form>
    </div>
  );
};

export default AddUser;
