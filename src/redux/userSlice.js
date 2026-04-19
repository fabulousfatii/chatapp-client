import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    isAdmin: false,
    isLoading:true,
    userdata:null,
    selectedChat:null
 }

export const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userExists: (state,action) => {
       state.user = action.payload.user,
       state.isLoading= false,
       state.userdata= action.payload.userdata

    },
userNotExists: (state,action) => {
       state.user = action.payload.user,
       state.isLoading = false

    },
    selectedChatDetails: (state,action) => {
         state.selectedChat = action.payload
    }
  }
})
// Action creators are generated for each case reducer function
export const { userExists, userNotExists, selectedChatDetails } = userSlice.actions

export default userSlice.reducer
