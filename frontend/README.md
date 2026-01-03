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

## Features
- Auth: login, signup, logout, check session
- Profile: update profile image via backend
- Chats: list chat partners and contacts, select conversation
- Messages: load conversation messages, send text or image
- UI: tab switcher, sound toggle, presence indicator (placeholder)

## State Stores
- Auth store: [src/store/useAuthStore.js](src/store/useAuthStore.js)
	- Methods: `checkAuth()`, `signup(data)`, `login(data)`, `logout()`, `updateProfile({ profilePic })`
	- `updateProfile` calls `PUT /auth/update-profile` and updates `authUser`
- Chat store: [src/store/useChatStore.js](src/store/useChatStore.js)
	- Methods: `getAllContacts()`, `getMyChatPartners()`, `setActiveTab(tab)`, `setSelectedUser(user)`, `getMessagesByUserId(userId)`, `sendMessage({ text, image })`
	- Subscriptions: `subscribeToMessages()` and `unsubscribeFromMessages()` are safe no-ops (enable sockets later)

## Notable Components
- Page: [src/pages/ChatPage.jsx](src/pages/ChatPage.jsx)
- Lists: [src/components/ChatsList.jsx](src/components/ChatsList.jsx), [src/components/ContactList.jsx](src/components/ContactList.jsx)
- Chat: [src/components/ChatContainer.jsx](src/components/ChatContainer.jsx), [src/components/MessageInput.jsx](src/components/MessageInput.jsx), [src/components/ChatHeader.jsx](src/components/ChatHeader.jsx)
- Profile: [src/components/ProfileHeader.jsx](src/components/ProfileHeader.jsx)

## Recent Fixes
- Prevent crashes on tab switch by defaulting arrays (`onlineUsers`, `chats`, `allContacts`) in components
- Restored `getMessagesByUserId` and `sendMessage` in chat store
- Implemented `updateProfile` in auth store for profile image updates

## Build
```bash
npm run build
npm run preview
```
Serves the built app locally.
