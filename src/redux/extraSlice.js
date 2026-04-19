import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isNewGroup: false,
    isAddMember: false,
    isNotification: false,
    isMobile: false,
    isSearch: false,
    isFileMenu: false,
    isDeleteMenu: false,
    uploadingLoader: false,
    selectedDeleteChat: {
    chatId: "",
    groupChat: false,
 },}

export const extraSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setNewGroup: (state,action) => {
       state.isNewGroup = action.payload;
    },
    setAddMember: (state,action) => {
       state.isAddMember = action.payload;
    },  
    setNotification: (state,action) => {
       state.isNotification = action.payload;
    },
    setIsMobile: (state,action) => {
       state.isMobile = action.payload;
    },
    setIsSearch: (state,action) => {
       state.isSearch = action.payload;
    },
    setIsFileMenu: (state,action) => {
       state.isFileMenu = action.payload;
    },
    setIsDeleteMenu: (state,action) => {
       state.isDeleteMenu = action.payload;
    },
    setUploadingLoader: (state,action) => {
       state.uploadingLoader = action.payload;
    },
    setSelectedDeleteChat: (state,action) => {
       state.selectedDeleteChat = action.payload;
    },





  },
})
// Action creators are generated for each case reducer function
export const { setNewGroup, setAddMember, setNotification, setIsMobile, setIsSearch, setIsFileMenu, setIsDeleteMenu, setUploadingLoader, setSelectedDeleteChat } = extraSlice.actions

export default extraSlice.reducer
