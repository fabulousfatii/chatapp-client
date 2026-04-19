import axios from 'axios';
import React, { useState, useEffect, useContext, useRef } from 'react'
import { Plus, X, Search } from 'lucide-react';
import { useNewGroupMutation } from '../redux/api/api';
import { useSelector } from 'react-redux';
import { SocketContext } from '../features/Socket';

const AddingGroups = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [newGroup, { isLoading }] = useNewGroupMutation()
  const contacts= useSelector((state)=>state.chat.contacts) || [];
  const userdata = useSelector((state)=>state.auth.userdata) || {};
  const socket = useContext(SocketContext).socket;
  


  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact => 
    contact.name?.toLowerCase().includes(search.toLowerCase()) );

  // Get display name for a contact
  const getContactName = (contact) => {
    if (contact.chatName) return contact.chatName;
    if (contact.users && contact.users.length > 0) {
      return contact.users.map(u => u.name).join(', ');
    }
    return 'Unknown';
  };

 // Get avatar initials
  const getAvatarInitials = (contact) => {
    const name = getContactName(contact);
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  //Toggle member selection
  const toggleMember = (contact) => {
    const memberId = contact.members.filter(m=> m._id !== userdata._id); // Get the member ID that is not the current user
    const isSelected = memberId.some(m => m._id === contact._id);
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter(m => m._id !== contact._id));
    } else {
      setSelectedMembers([...selectedMembers, memberId[0]]); // Add the member ID to selected members
    }
  };




  // Check if contact is selected
  const isSelected = (contact) => {
    return selectedMembers.some(m => m._id === contact._id);
  };

  const handleCreateGroup = async () => {
    try {
      const groupData = {
        name: groupName || 'New Group',
        members: selectedMembers,
      };
      const response = await newGroup(groupData).unwrap(); //unwrap helps to get the actual response data or throw an error
      socket.emit('NEW_GROUP', {groupName,members:selectedMembers}); // Emit the new group event to the server
      setIsOpen(false);
      setSelectedMembers([]);
      setGroupName('');
      setSearch('');
      toast.success('Group created successfully!');

    } catch (error) {
      console.error('Error creating group:', error);
        toast.error('Failed to create group. Please try again.');
    }
  };

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
      {/* Button to open dialog */}
      <button
        onClick={() => setIsOpen(true)}  className="focus:outline-none"
        title="Add Group"
      >
        <Plus  size={22}  className="cursor-pointer hover:text-blue-400 transition"  />
      </button>


      {/* Dialog Box */}
      {isOpen && (
        <div ref={dialogRef} className="absolute right-0 top-10 mt-3 w-80 bg-gray-900 text-white border border-gray-700 rounded-xl shadow-xl z-50 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Add Group</h2>
            <button 
              onClick={() => {
                setIsOpen(false);
                setSelectedMembers([]);
                setSearch('');
              }}
            >
              <X size={18} className="hover:text-red-400 transition" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-gray-800 px-3 py-2 m-3 rounded-lg">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"  placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm text-white ml-2 w-full placeholder-gray-400"
            />
          </div>

          {/* Group name */}
            <div className="flex items-center bg-gray-800 px-3 py-2 m-3 rounded-lg">
            <input
              type="text"  placeholder="Group Name (optional)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="bg-transparent outline-none text-sm text-white ml-2 w-full placeholder-gray-400"
            />
          </div>

          {/* Contacts List */}
          <div className="max-h-60  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 px-3">
            {contacts.length > 0 ? (
              contacts?.map((contact,index) => {
               if(contact.groupChat) return null; // Skip group chats in the contact list  
                else return (
                <div
                  key={index}
                  onClick={() => toggleMember(contact)}
                  className={`flex items-center  justify-between p-3 rounded-lg mb-2 cursor-pointer transition ${
                    isSelected(contact) ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      <img  src={contact?.avatar || null}
                      className="w-full h-full object-cover rounded-full"/>
                      {getAvatarInitials(contact)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {contact?.name}
                      </p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                    isSelected(contact)
                      ? 'bg-white text-blue-600'  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}>
                    <Plus size={18} />
                  </div>
                </div>)
})   ) : (
              <p className="text-center text-gray-400 py-4">
                No contacts found.
              </p>
            )}
          </div>

          {/* Selected Count */}
          {selectedMembers.length > 0 && (
            <div className="px-4 py-2 text-sm text-gray-400">
              {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
            </div>
          )}

          {/* Create Group Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleCreateGroup}
              disabled={selectedMembers.length === 0}
              className={`w-full py-2 rounded-lg font-medium transition ${
                selectedMembers.length > 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'  : 'bg-gray-700 text-gray-500 cursor-not-allowed' }`}
            >
              Create Group
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AddingGroups
