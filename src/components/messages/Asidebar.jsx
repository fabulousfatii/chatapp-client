import React, { useState, useEffect } from 'react'
import { UserPlus, UserMinus, LogOut, SidebarCloseIcon, LucidePanelLeftClose, ArrowBigLeft, Trash2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAddGroupMemberMutation, useDeleteGroupMemberMutation, useGetMyGroupsQuery, useLazySearchFriendsQuery,useLeaveGroupMutation } from '../../redux/api/api';
import { server } from '../../constant/config';


const Asidebar = ({toggleMember, setProfileDetailsOpen,isSelected}) => {
      const selectedchat = useSelector((state) => state.auth.selectedChat);
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
      const [memberToDelete, setMemberToDelete] = useState(null);
      const contacts= useSelector((state)=>state.chat.contacts) || [];
      const [deleteGroupMember] = useDeleteGroupMemberMutation()
      const [addGroupMember] = useAddGroupMemberMutation()
      const [groupMembers, setGroupMembers] = useState(null)
      const userdata= useSelector((state)=>state.auth.userData)
      
      // Use searchFriends API to get actual users for adding to group
      const [searchFriends, { data: searchResults }] = useLazySearchFriendsQuery()
      const [searchQuery, setSearchQuery] = useState('')
      const [leaveGroup]= useLeaveGroupMutation()
      const {getMyGroups} = useGetMyGroupsQuery() // Reusing searchFriends to refresh groups after adding member

      // Search for users when dialog opens or search query changes
      useEffect(() => {
        if (addMemberDialogOpen) {
          searchFriends(searchQuery)
        }
      }, [addMemberDialogOpen, searchQuery, searchFriends])


       useEffect(()=>{

        const fetchMember= async()=>{
        const response= await fetch(`${server}/api/chats/getMyGroups/`,{  
          credentials: 'include', 
          method: 'GET',  })
        .then(res => res.json())
        .then(data => {
          const group = data.groups.find(group => group._id === selectedchat._id);
          setGroupMembers(group || null);
          // return group || null; // Return the found group or null if not found
        })
        .catch(error => {
          console.error("Error fetching groups:", error);
        });
        };

        fetchMember()
       },[selectedchat._id])

      // Get existing member IDs from the group
      const existingMemberIds = groupMembers?.members

      // Filter contacts to show only those not already in the group
      const availableContacts = contacts.filter(contact => 
        !existingMemberIds?.includes(contact._id) && !contact?.groupChat // Exclude group chats from the list
      );

      const handleDeleteClick = (member) => {
        setMemberToDelete(member);
        setDeleteDialogOpen(true);
      };

      const confirmDelete = () => {
        console.log("Deleted member:", memberToDelete);
        deleteGroupMember({ chatId: selectedchat._id, memberId: memberToDelete._id });
        setDeleteDialogOpen(false);
        setMemberToDelete(null);
      };

      const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setMemberToDelete(null);
      };

      const handleAddMemberClick = () => {
        setAddMemberDialogOpen(true);
      };

      const handleExitGroup =async () => {
        await leaveGroup(selectedchat._id)
        console.log("Exit group - chatId:", selectedchat._id);
        console.log("Chat deleted");
      };

      const handleSelectMember = (member) => {
        addGroupMember({ chatId: selectedchat._id, members: member.members });
        console.log("Selected member to add:", member);
        setAddMemberDialogOpen(false);
      };

      const cancelAddMember = () => {
        setAddMemberDialogOpen(false);
      };
    
  return (
    <>
     <aside className='h-full bg-linear-to-t  px-15 pt-20 from-blue-600 justify-start items-center flex flex-col to-indigo-700 w-sm absolute right-0 top-0 '>
      <div className='self-start cursor-pointer hover:bg-white '>          <ArrowBigLeft onClick={() => setProfileDetailsOpen(false)} className="w-10 "/>
</div>
          <div className="w-40 h-40 rounded-full mt-2 bg-linear-to-br from-blue-900 to-purple-900 border-2 border-white flex items-center justify-center text-white font-semibold">
            {/* {selectedchat.avatar} */}
            <img className="w-full h-full object-cover rounded-full"
            src={selectedchat.avatar} alt="Avatar" />
          </div>

          <h2 className="font-semibold text-white mt-4 text-lg">{selectedchat.name}</h2>
          <p className="text-sm text-gray-300">{selectedchat.status}</p>
          <p className="text-sm text-gray-300 mt-2">{selectedchat.groupChat ? `${selectedchat.members?.length || 0} members` : 'Individual Chat'}</p>

          {/* if group chat show members list */}
          {selectedchat?.groupChat && (
            <div className="w-full mt-4 bg-blue-900/40 border border-white/20 rounded-lg p-4 shadow-">
              <h3 className="text-sm text-gray-200 mb-2">Members</h3>
              <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
  
                {groupMembers?.members?.map((member) => {
                  return(
                  <div  onClick={() => toggleMember(member._id)}
                  key={member._id} className={`flex items-center gap-3 mb-2 cursor-pointer ${isSelected(member) ? 'bg-blue-600' : 'hover:bg-gray-700'} p-2 rounded-lg transition`}>
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
                      <img src={member?.avatar?.url} alt="" className='w-full h-full object-cover rounded-full' />
                    </div>
                    <p className="text-sm text-gray-300 flex-1">{member?.name}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteClick(member); }}
                      className="p-1 hover:bg-red-500/50 rounded-full transition"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                    </button>
                  </div>)
                })}
              </div>
              {/* Group chat specific buttons */}
              <div className="flex gap-3 mt-4 align-center justify-center">
                
                    <button 
                      onClick={handleAddMemberClick}
                      className="p-2 hover:bg-gray-100  rounded-full" 
                      title="Add Member"
                    >
                      <UserPlus className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100  rounded-full" title="Delete Member">
                      <UserMinus className="w-5 h-5 text-gray-400" />
                    </button>
                    <button onClick={handleExitGroup} className="p-2 hover:bg-gray-100  rounded-full" title="Exit Group">
                      <LogOut className="w-5 h-5 text-gray-400" />
                    </button>
              </div>
            </div>

          
                  
          )}


        </aside>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-80 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Remove Member</h3>
              <button onClick={cancelDelete} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to remove <span className="text-white font-medium">{memberToDelete}</span> from this group?
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Dialog */}
      {addMemberDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-80 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Add Member</h3>
              <button onClick={cancelAddMember} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />
            {availableContacts.length === 0 ? (
              <p className="text-gray-300 mb-6">No users available to add. Search for users by name.</p>
            ) : (
              <div className="max-h-60 overflow-y-auto mb-6">
                {availableContacts.map((user) => (
                  <div 
                    key={user._id}
                    onClick={() => handleSelectMember(user)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm text-gray-300">{user.name}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button 
                onClick={cancelAddMember}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </>
  )
}

export default Asidebar