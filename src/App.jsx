import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { ProtectedRoutes, UnprotectedRoutes } from './features/ProtectedRoutes'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { server } from './constant/config'
  import { userExists,userNotExists } from './redux/userSlice'
import Header from './components/Header'
import { SocketProvider } from './features/Socket'
import { saveAlertsToLocalStorage } from './features/features'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


function App() {

   const user=useSelector((state)=>state.auth.user);
   const newMessageAlert=useSelector((state)=>state.chat.newMessageAlert);

  const dispatch= useDispatch();
  useEffect(()=>{

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${server}/api/users/myProfile`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (response) {
          dispatch(userExists({ userdata: response.data.user, user: true }));

        }
      } catch (error) {
        dispatch(userNotExists({ user: false }));
        console.log(error);
      }
    };

    fetchUser();

  },[dispatch])

  useEffect(() => {
    // Save newMessageAlert to localStorage whenever it changes
    saveAlertsToLocalStorage({ key: 'NEW_MESSAGE_ALERT', value: newMessageAlert})
  }, [newMessageAlert]);

  
  return (
   <SocketProvider>
     <BrowserRouter>
            <Header/>

     <Routes>

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoutes />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Route>

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

    </Routes>
    </BrowserRouter>
      <ToastContainer
           position="top-right"
           autoClose={2000}
           hideProgressBar={false}
           newestOnTop={false}
           closeOnClick
           rtl={false}
           pauseOnFocusLoss
           draggable
           pauseOnHover
           theme="dark"
         />
   </SocketProvider>
       
  )
}

export default App
