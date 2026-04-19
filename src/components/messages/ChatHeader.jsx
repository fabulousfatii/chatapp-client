import { Menu, MoreVertical, Phone, Video, Trash2, Settings, } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Asidebar from './Asidebar';
import { useDispatch, useSelector } from 'react-redux';


const ChatHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [profileDetailsOpen, setProfileDetailsOpen] = useState(false);
  const selectedchat = useSelector((state) => state.auth.selectedChat);

  const toggleMember = (contact) => {
    const isSelected = selectedMembers.some(m => m === contact);
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter(m => m !== contact));
    } else {
      setSelectedMembers([...selectedMembers, contact]);
    }
  };

  const isSelected = (member) => {
    return selectedMembers.some(m => m === member);
  };


  const handleDropdown=(option)=>{
    if(option==="settings"){
      setProfileDetailsOpen(true);
    }
    setDropdownOpen(!dropdownOpen);

  }

 //click outside to close dialog
   const dialogRef = useRef(null);
   
   useEffect(() => {
     const handleOutsideClick = (e) => {
       if (dialogRef.current && !dialogRef.current.contains(e.target)) {
         setDropdownOpen(false);
       }
     };
   
     document.addEventListener("mousedown", handleOutsideClick);
     return () => document.removeEventListener("mousedown", handleOutsideClick); // cleanup
   }, [dropdownOpen]);


  return (
    <div className="bg-white border-b  border-gray-200 p-4 mt-14 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-2">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
          <img src={selectedchat.avatar} className="object-cover w-full h-full rounded-full " alt=""  />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">
            {selectedchat.groupchat ? `${selectedchat.members?.length || 0} ${selectedchat.name}` : selectedchat.name}
          </h2>
          <p className="text-sm text-gray-500">{selectedchat.status}</p>
        </div>
      </div>
      <div className="flex gap-3">

        {/* settings and delete options for both group and individual chats */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          {dropdownOpen && (
            <div ref={dialogRef} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button onClick={()=> handleDropdown("settings")} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Chat
              </button>
            </div>
          )}



        </div>


        {/* aside bar to show profile details of the group or individual chat when settings is clicked */}
        {profileDetailsOpen &&
        <Asidebar 
        toggleMember={toggleMember}
        setProfileDetailsOpen={setProfileDetailsOpen}
        isSelected={isSelected}/>
        }

      </div>
    </div>)
}

export default ChatHeader