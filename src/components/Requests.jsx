import React, { useContext, useEffect, useRef, useState } from "react";
import { Bell, Search, X } from "lucide-react";
import { useAcceptRequestMutation, useGetRequestsQuery, useLazySearchFriendsQuery, useSendRequestMutation,  } from "../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { getNotification } from "../redux/chatSlice";
import { SocketContext } from "../features/Socket";
import { NEW_REQUEST } from "../constant/events";
// import { Socket } from "socket.io-client";

const Requests = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const user= useSelector((state)=>state.auth.userdata);
  const requests = useSelector((state) => state.chat.totalRequests );
  const dispatch = useDispatch();
  const socket = useContext(SocketContext).socket;
  

  const [sendRequestMutation, { isLoading: isLoadingSendRequest }] = useSendRequestMutation();
  const [acceptRequestMutation, { isLoading: isLoadingAcceptRequest }] = useAcceptRequestMutation();

  const  { data } = useGetRequestsQuery()



  useEffect(() => {
    if (data && data.request) {
      const totalrequests = data.request.filter((req) => req.receiver._id === user._id );
      dispatch(getNotification(totalrequests.length));
       
    }
  }, [data]);



   const newMessageHandler = (data) => {
    //console.log("new message received in frontend:",data  .message);
    dispatch(getNotification(requests + 1));
    console.log(requests)

  }

  useEffect(() => {
      socket.on(NEW_REQUEST, newMessageHandler)
      return () => {
        socket.off(NEW_REQUEST, newMessageHandler)
  
      }
    }, [socket, data]);



  // Handle accept/reject
  const handleAction = (id, type) => {
    try {
      if (type === "requested") {
        const userId = id;
         sendRequestMutation({ userId });
         toast.success('Friend request sent!');
        
      }else if (type === "Accepted") {
        const requestId = id;
         acceptRequestMutation({ requestId });
         dispatch(getNotification(requests - 1));
         toast.success('Friend request accepted!');

      }
    } catch (error) {
      console.error("Error handling friend request action:", error);
      toast.error('Failed to process the request. Please try again.');
    }
    // For "Rejected", do nothing
  };

 // Debounce the search input
  useEffect(() => {
    const timerId = setTimeout(() => {
    trigger(search);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [search]);

// Use the hook with debounced search
const [trigger, { data: searchResults }] = useLazySearchFriendsQuery();

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
    <div className="relative">
      {/* 🔔 Bell Icon */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative focus:outline-none"
      >
        <Bell
          size={22}
          className="cursor-pointer hover:text-blue-400 mt-2 transition"
        />
        {requests > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white px-1.5 rounded-full">
            {requests}
          </span>
        )}
      </button>

      {/* ⚡ Dialog Box */}
      {isOpen && (
        <div ref={dialogRef} className="absolute right-0 mt-3 w-80 bg-gray-900 text-white border border-gray-700 rounded-xl shadow-xl z-50 p-4 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Friend Requests</h2>
            <button onClick={() => setIsOpen(false)}>
              <X size={18} className="hover:text-red-400 transition" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search friends..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)}}
              className="bg-transparent outline-none text-sm text-white ml-2 w-full placeholder-gray-400"
            />
          </div>

  {/* Friend Requests List */}
  <div className="mt-4 space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
    {search.trim() !== "" ? (
      searchResults?.otherUsers.length > 0 ? (
        searchResults?.otherUsers.map((req) => (
          <div
            key={req._id}
            className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-lg"
          >
            <div>
              <p className="font-medium">{req.name}</p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleAction(req._id, "requested")}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-lg"
              >
                request
              </button>
              <button
                onClick={() => handleAction(req._id, "Rejected")}
                className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1 rounded-lg"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 mt-6">
          No friend found.
        </p>
      )
    ) : (
      <div>
        {/* requested users */}
        {data?.request.map((req) => {
          if (req.status === "pending" && req.sender._id === user._id) {
            return (
            <div
                key={req._id}
                className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-lg"
              >
                <div>
                  <p className="font-medium">{req.receiver.name}</p>
                </div>
                <div className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1 rounded-lg">requested</div>
              </div>
            );
          }else{
            return(
               <div
            key={req._id}
            className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-lg"
          >
            <div>
              <p className="font-medium">{req.sender.name}</p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleAction(req._id, "Accepted")}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-lg"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction(req.sender._id, "Rejected")}
                className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1 rounded-lg"
              >
                <X size={14} />
              </button>
            </div>
          </div>
            )
          }
        })}
      </div>
    )}
  </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
