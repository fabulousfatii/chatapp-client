// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { server } from '../../constant/config'

// Define a service using a base URL and expected endpoints
export const chatApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/` }),
   tagTypes:['Chats','Users'], // used for cache invalidation means this api provides 'Chats' tag
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: `chats/getMychats`,
        credentials: 'include'
      }),
        providesTags: ['Chats'] // provides the 'Chats' tag
    }),

    searchFriends: builder.query({
      query: (name)=>({
        url: `users/searchUser?name=${name}`,
        credentials: 'include'
      }),
      providesTags: ['Users'] // provides the 'Chats' tag
    }),

    sendRequest: builder.mutation({
      query: (userId) => ({
        url: `users/sendRequest`,
        method: 'PUT',
        credentials: 'include', 
        body:  userId ,
      }),
      invalidatesTags: ['Users'], // invalidates the 'Users' tag
    }),

    getRequests: builder.query({
      query: ()=>({
        url: `users/getNotifications`,
        credentials: 'include'
      }),
      providesTags: ['Users'] // provides the 'Chats' tag
    }),

    acceptRequest: builder.mutation({
      query: (requestId) => ({
        url: `users/acceptRequest`,
        method: 'PUT',
        body: requestId,
        credentials: 'include', 
      }),
      invalidatesTags: ['Users'], // invalidates the 'Users' tag
    }),
    getChatDetails: builder.query({
      query: (chatId) => ({
        url: `chats/${chatId}`,
        credentials: 'include'
      }),
      providesTags: ['Chats'] // provides the 'Chats' tag
    }),
    sendAttachments: builder.mutation({
      query: (data) => ({
        url: `chats/attachments`,
        credentials: 'include',
         method: 'POST',
        credentials: 'include', 
        body:  data ,
      }),
      providesTags: ['Chats'] // provides the 'Chats' tag
    }),
    newGroup: builder.mutation({
      query: (data) => ({
        url: `chats/newGroup`,
        credentials: 'include',
         method: 'POST',
        credentials: 'include', 
        body:  data ,
      }),
      providesTags: ['Chats'] // provides the 'Chats' tag
    }),
    deleteGroupMember: builder.mutation({
      query: (data) => ({
        url: `chats/removeMembers`,
        credentials: 'include',
         method: 'PUT',
        credentials: 'include', 
        body:  data ,
      }),
      invalidatesTags: ['Chats'] // invalidates the 'Chats' tag
    }),
    addGroupMember: builder.mutation({
      query: (data) => ({
        url: `chats/addMembers`,
        credentials: 'include',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Chats'] // invalidates the 'Chats' tag
    }),
    // add chatid in params
    leaveGroup: builder.mutation({
      query: (chatId) => ({
        url: `chats/leaveChat/${chatId}`, 
        credentials: 'include',
        method: 'DELETE', 
      }),
      invalidatesTags: ['Chats'] // invalidates the 'Chats' tag
    }),
    getMyGroups: builder.query({ 
      query: () => ({
        url: `chats/getMyGroups/`,
        credentials: 'include'
      }),
      providesTags: ['Chats'] // provides the 'Chats' tag
     })

  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useMyChatsQuery, 
  useLazySearchFriendsQuery,
 useSendRequestMutation,
 useGetRequestsQuery,
 useAcceptRequestMutation,
 useSendAttachmentsMutation,
 useNewGroupMutation,
  useDeleteGroupMemberMutation,
  useGetChatDetailsQuery,
  useAddGroupMemberMutation,
  useLeaveGroupMutation,
  useGetMyGroupsQuery
} = chatApi


