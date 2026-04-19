import { createContext, useMemo, useRef } from "react";
import { io } from "socket.io-client";
import { useContext } from "react";
import { server } from "../constant/config";

export const SocketContext = createContext();

const getSocket = ()=> useContext(SocketContext);

export const SocketProvider = ({ children }) => {
 const socket = useMemo(() => {
    // Initialize your socket connection here
    const newSocket = io( server, {withCredentials: true}); // Replace with your server URL
    return newSocket;
  }, []);
//   console.log(socket)
  return (
    <SocketContext.Provider value={{ socket, getSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
