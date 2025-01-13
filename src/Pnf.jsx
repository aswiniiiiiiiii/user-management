import React from 'react'
import { Link } from 'react-router-dom'

const Pnf = () => {
  return (
    <div style={{display:'flex',justifyContent:'center',height:'100vh'}}>
     <div> 
        <img height={'500px'} src="https://i.pinimg.com/originals/db/b8/f9/dbb8f986409cbba56912fa3fc54ee41d.gif" alt="" />
        <h1>Page Not Found</h1>
        <h3><Link to={'/'}>Back To Home</Link></h3>
        </div>
    </div>
  )
}

export default Pnf
