import { useState, useEffect, useContext } from 'react';
import { useMyChatsQuery } from '../redux/api/api';
import Sidebar from '../components/Sidebar';
import Messages from '../components/Messages';
import { useDispatch } from 'react-redux';
import { setContacts as setReduxContacts } from '../redux/chatSlice';
import { SocketContext } from '../features/Socket';



export default function Chat() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState({});
  const [contacts, setContacts] = useState([]);
  const dispatch = useDispatch();
  const socket = useContext(SocketContext).socket;


    const { data, error, isLoading } = useMyChatsQuery("")

  useEffect(() => {
    //  console.log("data", data)
    setContacts(data?.chats || []);
     dispatch(setReduxContacts(data?.chats));

  },[data, dispatch])

  const newGroupHandler = (group) => {
    setContacts(prev => [...prev, group]);
    dispatch(setReduxContacts([...contacts, group]));
  }

  
    useEffect(() => {
      socket.on('NEW_GROUP', newGroupHandler)
  
  
      return () => {     
      socket.off('NEW_GROUP', newGroupHandler)
      
        
  
  
      }
    }, [socket, contacts]);


  const getContactMessages = (contactId) => {
    return messages[contactId] || [];
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
    <Sidebar 
    sidebarOpen={sidebarOpen} 
    contacts={contacts} 
    selectedContact={selectedContact}
    setSelectedContact={setSelectedContact}
    isLoading={isLoading}
    />

      {/* Main Chat Area */}
       <Messages 
           sidebarOpen={sidebarOpen}
           setSidebarOpen={setSidebarOpen}
        selectedContact={selectedContact}
        getContactMessages={getContactMessages}
       />
    </div>
  );
}