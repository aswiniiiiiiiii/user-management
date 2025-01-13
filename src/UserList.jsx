import React, { useEffect, useState } from "react";
import './styles/UserList.css';
import { Link, useNavigate } from "react-router-dom";

const LOCAL_STORAGE_KEY = 'userDatabase'; // Key for local storage

const UserList = () => {
  const [listUsers, setListUsers] = useState([]);
  const [search, setSearch] = useState(''); // State to store search query
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedUsers) {
      setListUsers(storedUsers);
      setFilteredUsers(storedUsers); // Initialize filtered users with all users
    }
  }, []);

  useEffect(() => {
    // Filter users based on active status and search query
    const filtered = listUsers.filter(user => {
      const statusMatch = user.active ? 'Active' : 'InActive';
      return statusMatch.toLowerCase().includes(search.toLowerCase()) || 
             user.username.toLowerCase().includes(search.toLowerCase()) || 
             user.email.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredUsers(filtered);
  }, [search, listUsers]);

  const toggleUserStatus = (index) => {
    const updatedUsers = listUsers.map((user, i) => {
      if (i === index) {
        return { ...user, active: !user.active }; // Toggle active status
      }
      return user;
    });

    setListUsers(updatedUsers);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUsers)); // Update local storage
  };

  const removeUser = (index) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = listUsers.filter((_, i) => i !== index);
      setListUsers(updatedUsers);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUsers)); // Update local storage
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleUpdate = (index) => {
    const userToUpdate = listUsers[index];
    navigate('/add-user', { state: { userToUpdate, index } }); // Pass user data and index
  };

  
  return (
    
   <>
   <div className="dash">
    <h3 style={{fontSize:'22px'}}>User-Managemnet <i className="fa-solid fa-edit"></i>

    </h3>
    <Link to={'/'} style={{textDecoration:"none"}}>Logout</Link>
   </div>
      <div className="container">
        
        <h1 className="title">User Listing</h1>
  
        {/* Search Input */}
  
        <div className="searchContainer">
          <h2>Search By status</h2>
          <input
            type="text"
            placeholder="Search by name, email, or status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* <button><i className="fa-solid fa-search"></i></button> */}
        </div>
  
        {/* Add New User Button */}
        <button className="newuserButton">
          <Link style={{ textDecoration: 'none', color: "white" }} to={'/add-user'}>+ Add New User</Link>
        </button>
  
        {/* Table for User Listing */}
        <table className="table">
          <thead>
            <tr>
              <th className="tableHeader">ID</th>
              <th className="tableHeader">Name</th>
              <th className="tableHeader">Email</th>
              <th className="tableHeader">Status</th>
              <th className="tableHeader">Previous Logins</th>
              <th className="tableHeader">Previous Logins Count</th>
              <th className="tableHeader">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} className="tableRow">
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.active ? 'Active' : 'InActive'}</td>
                <td>
                  {user.loginHistory && user.loginHistory.length > 1
                    ? formatDate(user.loginHistory[user.loginHistory.length - 2])
                    : user.loginHistory && user.loginHistory.length > 0
                      ? formatDate(user.loginHistory[user.loginHistory.length - 1])
                      : 'No logins yet'}
                </td>
                <td>{user.loginHistory ? user.loginHistory.length : 0}</td>
                <td className="actionButtons">
                  <button onClick={() => toggleUserStatus(index)} className="blockButton">
                    {user.active ? 'Block' : 'Unblock'}
                  </button>
                  
                  <button className="updateButton" onClick={() => handleUpdate(index)}>Update</button>
                  <button onClick={() => removeUser(index)} className="removeButton">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
   </>
  );
};

export default UserList;
