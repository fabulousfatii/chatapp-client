import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './userSlice'
import { chatApi } from './api/api'
import { chatSlice } from './chatSlice'

export const store = configureStore({
  reducer: {
    [userSlice.name] : userSlice.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [chatSlice.name]: chatSlice.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware),
})