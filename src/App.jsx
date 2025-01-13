import './App.css'
import { Route, Routes } from 'react-router-dom'
import Auth from './Auth'
import UserList from './UserList'
import AddUser from './AddUser'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Auth/>}/>
        <Route path='/register'  element={<Auth insideRegister={true}/>}/>
        <Route path='/user-lists' element={<UserList/>}/>
        <Route path='/add-user' element={<AddUser/>}/>
        </Routes>
    </>
  )
}

export default App
