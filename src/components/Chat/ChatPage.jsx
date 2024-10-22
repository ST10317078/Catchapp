import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatComponent from './ChatComponent';
import './ChatPage.css'; // CSS for the chat page

const ChatPage = ({ currentUserId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [pinnedChats, setPinnedChats] = useState([]); // List of pinned chats

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handlePinChat = (user) => {
    if (!pinnedChats.find((chat) => chat.id === user.id)) {
      setPinnedChats([...pinnedChats, user]); // Pin the chat if not already pinned
    }
  };

  return (
    <div className="chat-page">
      {currentUserId ? (
        <>
          <ChatList
            pinnedChats={pinnedChats}
            onUserSelect={handleUserSelect}
            currentUserId={currentUserId}
          />
          {selectedUser && (
            <ChatComponent
              selectedUser={selectedUser}
              currentUserId={currentUserId}
              onPinChat={handlePinChat}
            />
          )}
        </>
      ) : (
        <p>Error: current user ID is missing.</p>
      )}
    </div>
  );
};

export default ChatPage;
