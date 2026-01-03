# Chat Station Frontend (React + Vite)

Modern React SPA for Chat Station using Vite, TailwindCSS, DaisyUI, Zustand, and Axios. This app consumes the backend API for auth and messaging.

## Quick Start
```bash
npm install
npm run dev
```
Open http://localhost:5173.

## Configuration
No `.env` is required for local dev. The base API URL is selected by mode in [src/lib/axios.jsx](src/lib/axios.jsx):
- development → http://localhost:3000/api
- production → https://chat-station.onrender.com/api

Socket.IO connects to the backend origin selected by `BASE_URL` inside the auth store. Ensure backend `.env` contains `CLIENT_URL=http://localhost:5173` and the socket server allows it.

## Features
- Auth: login, signup, logout, check session
- Profile: update profile image via backend
- Chats: list chat partners and contacts, select conversation
- Messages: load conversation messages, send text or image
- Presence: live online users via Socket.IO (with cookie-auth handshake)
- Realtime: receive `newMessage` events and append to the open conversation
- UI: tab switcher, sound toggle

## State Stores
- Auth store: [src/store/useAuthStore.js](src/store/useAuthStore.js)
	- Methods: `checkAuth()`, `signup(data)`, `login(data)`, `logout()`, `updateProfile({ profilePic })`
	- `updateProfile` calls `PUT /auth/update-profile` and updates `authUser`
	- Socket: `connectSocket()` connects after auth using `withCredentials: true`; `disconnectSocket()` clears listeners and instance
- Chat store: [src/store/useChatStore.js](src/store/useChatStore.js)
	- Methods: `getAllContacts()`, `getMyChatPartners()`, `setActiveTab(tab)`, `setSelectedUser(user)`, `getMessagesByUserId(userId)`, `sendMessage({ text, image })`
	- Subscriptions: `subscribeToMessages()`/`unsubscribeFromMessages()` manage the Socket.IO `newMessage` listener and append messages for the selected user

## Notable Components
- Page: [src/pages/ChatPage.jsx](src/pages/ChatPage.jsx)
- Lists: [src/components/ChatsList.jsx](src/components/ChatsList.jsx), [src/components/ContactList.jsx](src/components/ContactList.jsx)
- Chat: [src/components/ChatContainer.jsx](src/components/ChatContainer.jsx), [src/components/MessageInput.jsx](src/components/MessageInput.jsx), [src/components/ChatHeader.jsx](src/components/ChatHeader.jsx)
- Profile: [src/components/ProfileHeader.jsx](src/components/ProfileHeader.jsx)

## Recent Fixes
- Prevent crashes on tab switch by defaulting arrays (`onlineUsers`, `chats`, `allContacts`) in components
- Restored `getMessagesByUserId` and `sendMessage` in chat store
- Implemented `updateProfile` in auth store for profile image updates
- Socket connection hardened to avoid duplicates; added connect error logging
 - Wired realtime `newMessage` subscription in chat store

## Build
```bash
npm run build
npm run preview
```
Serves the built app locally.

## Tips
- If you see CORS errors for Socket.IO, confirm backend `CLIENT_URL` and the socket server allowlist include `http://localhost:5173`.
- For emails in development, Resend only sends to the `EMAIL_FROM` address. Verify a domain to send to any recipient in production.
 - If sending a message returns 500, ensure the backend emits with `io.to(<receiverSocketId>).emit("newMessage", message)` and that the controller imports `io` from the socket module.
