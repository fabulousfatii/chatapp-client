import { Menu, Send } from 'lucide-react';
import { useContext, useRef } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../features/Socket';
import { NEW_MESSAGE,NEW_MESSAGE_ALERT ,START_TYPING, STOP_TYPING } from '../constant/events';
import { useEffect } from 'react';
import { server } from '../constant/config';
import ChatHeader from './messages/ChatHeader';
import MessagesInput from './messages/MessagesInput';
import MessagesArea from './messages/MessagesArea';
import { newMessageAlertFunction, removeMessageAlert } from '../redux/chatSlice';

const Messages = ({ setSidebarOpen, sidebarOpen, getContactMessages }) => {

  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [userTyping,setUserTyping] = useState(false);
  const typeTimeoutRef = useRef(null);
  const selectedchat = useSelector((state) => state.auth.selectedChat);
  // const newMessageAlert = useSelector((state) => state.chat.newMessageAlert);
  const socket = useContext(SocketContext).socket;
  const user = useSelector((state) => state.auth.userdata);
  const messagesEndRef = useRef(null);
  const scrollUpRef = useRef(null);
  const dispatch = useDispatch();



  
  useEffect(() => {
    //when we dispatch selectedchat, this removes alert messages
    dispatch(removeMessageAlert(selectedchat?._id));
    setPage(1);
    setIsLoadingMore(false);
    fetchMessages();
  }, [selectedchat]);

  //on chat change
  useEffect(() => {

    return () => {
      setMessages([]);
      setPage(1);
    }
  },[selectedchat]);

  const fetchMessages = async () => {
    if (selectedchat) {
      setIsLoadingMessages(true);
      const data = await fetch(`${server}/api/chats/getMessages/${selectedchat._id}`, {
        credentials: 'include'
      }).then(res => res.json());
      setMessages(data.messages);
      setIsLoadingMessages(false);
       data.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
    }
  }


  const handleScroll = async () => {
    if (scrollUpRef.current.scrollTop === 0 && !isLoadingMore) {
      setIsLoadingMore(true);
      const previousHeight = scrollUpRef.current.scrollHeight;

      console.log('Scrolled to top, load more messages');
      const nextPage = page + 1;
      setPage(nextPage);

      if (selectedchat) {
        try {
          const data = await fetch(`${server}/api/chats/getMessages/${selectedchat._id}?page=${nextPage}`, {
            credentials: 'include'
          }).then(res => res.json());


          if (!data.messages || data.messages.length === 0) {
            setIsLoadingMore(false);
            return;
          }

          setMessages((prevMessages) => [...data.messages, ...prevMessages]);

          // Adjust scroll position after messages are updated
          setTimeout(() => {
            const newHeight = scrollUpRef.current.scrollHeight;
            scrollUpRef.current.scrollTop = newHeight - previousHeight;
          }, 100);


          console.log("fetch messages", data);
        } catch (error) {
          console.error("Error loading more messages:", error);
        } finally {
          setIsLoadingMore(false);
        }
      }
    }
  };


  const handleSendMessage = () => {
    if (message.trim() && selectedchat) {

      socket.emit(NEW_MESSAGE, {
        chatId: selectedchat._id,
        message: message,
        members: selectedchat.members,
      })

      setMessage('');
    }
  };


  const newMessageHandler = (data) => {
    
    if(data.chatId === selectedchat?._id) return;
    console.log("new message in fronted", data)
    setMessages(prev => [...prev, data.message]);

  }

  const newMessageAlertHandler = (data) => {
     
    if(data.chatId === selectedchat?._id) return;
    dispatch(newMessageAlertFunction(data));

  }

  const onInputMessage = (e) => {
    setMessage(e.target.value)

    
    if (!isTyping) {
      setIsTyping(true);
       const receiverId = selectedchat.members.filter((member) =>  member !== user._id);
      socket.emit("START_TYPING", 
        {  chatId: selectedchat._id, 
       members: receiverId }); 

       if(typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
    
      
      typeTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit("STOP_TYPING", 
        { chatId: selectedchat._id, 
       members: selectedchat.members }); 
      }, 3000); 
    }
    
  }
  const starTypingListener = (data) => {
    if (data.chatId !== selectedchat?._id) return;
    console.log("user is typing...");
    setUserTyping(true);
  }

  const stopTypingListener = (data) => {
    if (data.chatId !== selectedchat?._id) return;
    console.log("user stopped typing...");
    setUserTyping(false);
  }


  useEffect(() => {
    socket.on(NEW_MESSAGE, newMessageHandler)
    socket.on(NEW_MESSAGE_ALERT, newMessageAlertHandler)
    socket.on(START_TYPING, starTypingListener)
    socket.on(STOP_TYPING, stopTypingListener)


    return () => {
      socket.off(NEW_MESSAGE, newMessageHandler)
      socket.off(NEW_MESSAGE_ALERT, newMessageAlertHandler)
      socket.off(START_TYPING, starTypingListener)
      socket.off(STOP_TYPING, stopTypingListener)


    }
  }, [socket, messages]);
   
  // Scroll to bottom when messages change 
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);



  return (
    <div className="flex-1 relative flex flex-col">
      {selectedchat ? (
        <>
          {/* Chat Header */}
          <ChatHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} selectedchat={selectedchat} />

          {/* Messages Area */}
          <div
            ref={scrollUpRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              </div>
            ) : messages?.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <>
                <MessagesArea messages={messages}/>
                {userTyping && <p className='text-sm text-gray-500'>{userTyping ? `  typing...` : 'Someone is typing...'}</p>}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <MessagesInput onInputMessage={onInputMessage} message={message} setMessage={setMessage} handleSendMessage={handleSendMessage}
          selectedChat={selectedchat} typeTimeoutRef={typeTimeoutRef} />
        </>
      ) : (
        <div className="flex-1 flex  items-center justify-center bg-gray-50">
          <div className="text-center">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden mb-4 p-2 bg-blue-500 text-white rounded-full">
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Send className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome to Chat</h2>
          </div>
        </div>
      )}
    </div>)
}

export default Messages