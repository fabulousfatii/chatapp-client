import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {

    const { user, isLoading, userdata }=useSelector((state)=>state.auth);
    console.log("ProtectedRoutes - user:", user, "loading:", isLoading);
    if(isLoading){
        return <h1>Loading...</h1>
    }
    if(!user) {
        console.log("No user - redirecting to login");
        return <Navigate to="/login" />;
    }
  return <Outlet/>
}

const UnprotectedRoutes = ({user}) => {
  if(user === true) return <Navigate to="/chat" />
  else return <Outlet/>
}

export { ProtectedRoutes, UnprotectedRoutes }
