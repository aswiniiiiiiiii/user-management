import React, { useEffect, useState } from 'react';
import Login from './assets/login.png';
import './styles/Auth.css'
import { Link, useNavigate } from 'react-router-dom';

const LOCAL_STORAGE_KEY = 'userDatabase'; // Key for local storage

const Auth = ({ insideRegister }) => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [isBlocked,setIsBlocked] = useState(false)

     // Load user data from local storage on component mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedUsers) {
      setUsers(storedUsers);
    }
  }, []);
  // Save user data to local storage after registration/login
  const saveUsers = (newUsers) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUsers));
  };

  //register and login
  const handleSubmit = async () => {
    // e.preventDefault()
    console.log("inside register");
    
    if (insideRegister) {
      // Registration
      if (!username || !password || !email) {
        setLoginError('Please fill in all fields.');
        alert("Please fill in all fields")
        return;
      }

      const existingUser = users.find(
        (user) => user.username === username || user.email === email
      );
      if (existingUser) {
        setLoginError('Username or email already exists.');
        alert("Username or email already exists.")
        return;
      }

      const newUser = {
        username,
        password,
        email,
        isBlocked: false,
        active: true,  // Setting initial status to Active
        loginHistory: [],
       
      };
      setUsers([...users, newUser]);
      saveUsers([...users, newUser]); // Update local storage
      setUsername('');
      setPassword('');
      setEmail('');
      setIsBlocked(false)
      setLoggedIn(true);  
      navigate('/')
    } else {
      // Login
      setLoginError(null); // Clear previous errors
      const foundUser = users.find(
        (user) => user.email === email && user.password === password
      );
      console.log(foundUser);
    //   alert("Please fill in all fields")
      if (foundUser) {
        const updatedUsers = users.map(user => {
            if (user.email === email) {
              return {
                ...user,
                loginHistory: [...(user.loginHistory || []), new Date().toISOString()]
              };
            }
            return user;
          });
        saveUsers(updatedUsers);
        setLoggedIn(true);
        navigate('/user-lists')
      } else {
        setLoginError('Invalid username or password.');
        // alert("Invalid Email or password.")
      }
    }
  };
  return (
    <>
      <div className="authorisation-container">
        <div className="firstcontainer">
          <img src={Login} alt="Login" />
        </div>
        <div className="second-container">
          <div>
            <h1>Sign{ insideRegister ? "Up" :"In"} to Your Account</h1>
            <form>
             
             {
             insideRegister &&
             <label htmlFor="username">Username:
             <input  placeholder="Enter you Username"  value={username}  onChange={(e) => setUsername(e.target.value)} type="text" id="username"  required/>
           </label>
              
              }
              <label htmlFor="email">Email:
                <input placeholder="Enter you Email"  value={email}  onChange={(e) => setEmail(e.target.value)} type="email" id="email"  required/>
              </label>
              <label htmlFor="password">Password:
              <input placeholder="Enter you password"  value={password}  onChange={(e) => setPassword(e.target.value)} type="password" id="password"  required/>

              </label>
             {  
             insideRegister ?
                <div className='options'>
                    <button onClick={handleSubmit} type="submit">Register</button>
                    <p>Already a User? Please Click here to <Link to={'/'}>Login</Link></p>

                </div>

                :
               <div className='options'>
                    <button onClick={handleSubmit} type="submit">Login</button>
                  <p>New User? Please click here to <Link to={'/register'}>Register</Link></p>
               </div>
              }
              </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
