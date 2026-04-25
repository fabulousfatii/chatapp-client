import { Bell, MessageSquare, Search, User } from "lucide-react";
import NotificationDialog from "./Requests";
import Requests from "./Requests";
import { useEffect, useRef, useState } from "react";
import {useNavigate} from "react-router-dom";
import AddingGroups from "./AddingGroups";

const Header = () => {
  const[isOpen,setIsOpen]=useState(false);
  const navigate= useNavigate()

   const handleLogout=()=>{ 
    console.log("logout clicked");
    try{
      const response= fetch("http://localhost:3000/api/users/logout",{
        method:"POST",
        credentials:"include",
      });
      navigate("/login");

    
    }catch(error){
      console.log(error);
    }
   }
  
   //click outside to close dialog
   const dialogRef = useRef(null);
   
   useEffect(() => {
     const handleOutsideClick = (e) => {
       if (dialogRef.current && !dialogRef.current.contains(e.target)) {
         setIsOpen(false);
       }
     };
   
     document.addEventListener("mousedown", handleOutsideClick);
     return () => document.removeEventListener("mousedown", handleOutsideClick); // cleanup
   }, [isOpen]);

  return (
    <>
    <header className="flex fixed w-screen z-10 items-center justify-between px-4 py-3 bg-gray-900 text-white shadow-md">
      {/* Left: App Logo or Name */}
      <div className="flex items-center space-x-2">
        <MessageSquare className="text-blue-400" size={26} />
        <h1 className="text-md font-semibold">ChatConnect</h1>
      </div>

      {/* Middle: Search Bar */}
      {/* <div className="hidden md:flex items-center bg-gray-800 px-3 py-1 rounded-full w-1/3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search chats..."
          className="bg-transparent outline-none text-sm text-white ml-2 w-full placeholder-gray-400"
        />
      </div> */}

      {/* Right: Icons and User Profile */}
      <div className="flex items-center space-x-4">

        <Requests/>
        <AddingGroups/>

        
        <div className="relative" >
          <div onClick={() => setIsOpen(prev => !prev)}  className="w-10 h-10 relative rounded-full border-2 border-blue-400 cursor-pointer hover:scale-105 transition"
></div>
          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>

          {isOpen &&
           <div ref={dialogRef} className="absolute w-24 h-18 p-2 pt-5  top-11 right-0 bg-gray-900 rounded-3xl">
                    <button onClick={handleLogout} className="border-gray-400 cursor-pointer  p-1 px-4 text-center rounded-md "> logout</button>
                  </div>        }
          </div>
       

         </div>
    </header>
    </>
  );
};

export default Header;
