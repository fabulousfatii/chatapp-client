import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {

    const { user, isLoading }=useSelector((state)=>state.auth);

    if(isLoading){
        return <h1>Loading...</h1>
    }

  if(!user) return <Navigate to="/login"/>
  return <Outlet/>
}

const UnprotectedRoutes = ({user}) => {
  if(user === true) return <Navigate to="/" />
  else return <Outlet/>
}

export { ProtectedRoutes, UnprotectedRoutes }
