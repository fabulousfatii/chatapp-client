import { Search, X } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectedChatDetails } from '../redux/userSlice';

const Sidebar = ({contacts,setSelectedContact, isLoading}) => {

   const selectedContact =useSelector((state)=>state.auth.selectedChat);
    const dispatch= useDispatch();
    const newMessageAlert = useSelector((state) => state.chat.newMessageAlert);


      const [sidebarOpen, setSidebarOpen] = useState(true);

    // console.log({newMessageAlert})
      
    
  return (
     <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}>
           <div className="p-4 border-b border-gray-200">
             <div className="flex items-center justify-between mb-4">
               <h1 className="text-2xl font-bold text-gray-800">Chats</h1>
               <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                 <X className="w-6 h-6 text-gray-600" />
               </button>
             </div>
             <div className="relative">
               <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
               <input
                 type="text"
                 placeholder="Search contacts..."
                 className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>
           </div>
   
           <div className="flex-1 overflow-y-auto">
             {isLoading ? (
               // Loading skeleton
               Array.from({ length: 5 }).map((_, index) => (
                 <div key={index} className="p-4 border-b border-gray-100 animate-pulse">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                     <div className="flex-1">
                       <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                       <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                     </div>
                   </div>
                 </div>
               ))
             ) : contacts.length === 0 ? (
               <div className="flex items-center justify-center h-full text-gray-400">
                 <p>No chats yet</p>
               </div>
             ) : (
               contacts.map((contact) => (
                 <div
                   key={contact._id}
                   onClick={() => {
                     dispatch(selectedChatDetails(contact));
                  //    if (window.innerWidth < 1024) setSidebarOpen(false);
                   }}
                   className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition
                    ${ selectedContact?._id === contact._id ? 'bg-blue-50' : '' }`}
                 >
                   <div className="flex items-center gap-3">
                     <div className="relative">
                       <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                         {/* {contact?.avatar || null} */}
                         <img src={contact?.avatar[0] || null} alt=""  className='w-full h-full object-cover rounded-full' />
                       </div>
                       <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                         contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                       }`}></div>
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline">
                         <h3 className="font-semibold text-gray-900 truncate">{contact?.name}</h3>
                         {/* <span className="bg-rose-700 text-white text-center w-7 h-7 rounded-full">
                          </span> */}
                       </div>
                       {newMessageAlert?.map((alert,index)=>{
                          if(alert.chatId === contact._id){
                            return (
                              <p key={index} className="text-sm text-gray-600 truncate">{alert?.count} new messages</p>
                            )
                          }
                       })}
                     </div>
                   </div>
                 </div>
               ))
             )}
           </div>
         </div>
  )
}

export default Sidebar