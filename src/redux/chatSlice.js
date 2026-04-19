import { createSlice } from '@reduxjs/toolkit'
import { saveAlertsToLocalStorage } from '../features/features';

const initialState = {
    totalRequests:0,
    newMessageAlert: saveAlertsToLocalStorage(
      { key: 'NEW_MESSAGE_ALERT', get: true}) || [{
      chatId:"",
      count:0
    }],
    contacts:[],
 }

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getNotification: (state,action) => {
        state.totalRequests= action.payload   
    },
    newMessageAlertFunction: (state,action) => {
     const index= state.newMessageAlert.findIndex((item)=> item.chatId === action.payload.chatId);
     if(index >=0){
        state.newMessageAlert[index].count +=1;
     }else{
        state.newMessageAlert.push({chatId:action.payload.chatId, count:1});
     }
    },
    removeMessageAlert:(state, action)=>{
      state.newMessageAlert= state.newMessageAlert.filter((item)=> item.chatId !== action.payload);
    },
    setContacts:(state,action)=>{
      state.contacts= action.payload;
    }
    
  }
})
// Action creators are generated for each case reducer function
export const { getNotification, newMessageAlertFunction ,removeMessageAlert,setContacts } = chatSlice.actions

export default chatSlice.reducer
