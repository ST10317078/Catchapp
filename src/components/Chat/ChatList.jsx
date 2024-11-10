import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './ChatList.css';

const ChatList = ({ users, pinnedChats, currentUserId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [lastMessages, setLastMessages] = useState({});
  const [readStatus, setReadStatus] = useState({});
  const navigate = useNavigate();

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Retrieve the last message and its read status for each user
  useEffect(() => {
    const unsubscribeArray = [];

    users.forEach((user) => {
      const chatId = [currentUserId, user.id].sort().join('_');
      const chatDocRef = doc(db, 'chats', chatId);

      const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const chatData = docSnapshot.data();
          const lastMessage = chatData.messages?.[chatData.messages.length - 1] || null;

          console.log(`Fetched last message for ${chatId}:`, lastMessage);

          // Update last messages
          setLastMessages((prevMessages) => ({
            ...prevMessages,
            [user.id]: lastMessage,
          }));

          // Update read status
          if (lastMessage) {
            const isRead = lastMessage.read || lastMessage.receiverId !== currentUserId;
            setReadStatus((prevStatus) => ({
              ...prevStatus,
              [user.id]: isRead,
            }));
          }
        } else {
          console.log(`Chat document does not exist for ${chatId}. Initializing...`);
          // Initialize the chat document if it doesn't exist
          setDoc(chatDocRef, { messages: [] }).then(() => {
            console.log(`Initialized empty chat document for ${chatId}`);
          }).catch(error => {
            console.error(`Error initializing chat document for ${chatId}:`, error);
          });

          setLastMessages((prevMessages) => ({
            ...prevMessages,
            [user.id]: null,
          }));
          setReadStatus((prevStatus) => ({
            ...prevStatus,
            [user.id]: true,
          }));
        }
      });

      unsubscribeArray.push(unsubscribe);
    });

    return () => {
      unsubscribeArray.forEach((unsubscribe) => unsubscribe());
    };
  }, [users, currentUserId]);

  // Mark the last message as read when navigating to the chat
  const handleUserSelect = (user) => {
    navigate(`/chat/${user.id}`);
  };

  return (
    <div className="chat-list">
      <div className="chat-list-header">Chat</div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="pinned-chats">
        <h4>Pinned Chats</h4>
        {pinnedChats.map((user) => (
          <div 
            key={user.id}
            className="chat-list-item"
            onClick={() => handleUserSelect(user)}
          >
            <img src={user.profilePicUrl || 'https://via.placeholder.com/40'} alt="Profile" />
            <div className="chat-details">
              <span>{user.username}</span>
              <p>{lastMessages[user.id]?.message || 'No messages yet'}</p>
            </div>
            {lastMessages[user.id] && !readStatus[user.id] ? (
              <span className="unread-dot" style={{ backgroundColor: 'green' }}></span>
            ) : (
              <span className="read-dot" style={{ backgroundColor: 'gray' }}></span>
            )}
          </div>
        ))}
      </div>

      <div className="all-users">
        <h4>All Users</h4>
        {filteredUsers.map((user) => (
          <div 
            key={user.id}
            className="chat-list-item"
            onClick={() => handleUserSelect(user)}
          >
            <img src={user.profilePicUrl || 'https://via.placeholder.com/40'} alt="Profile" />
            <div className="chat-details">
              <span>{user.username}</span>
              <p>{lastMessages[user.id]?.message || 'No messages yet'}</p>
            </div>
            {lastMessages[user.id] && !readStatus[user.id] ? (
              <span className="unread-dot" style={{ backgroundColor: 'green' }}></span>
            ) : (
              <span className="read-dot" style={{ backgroundColor: 'gray' }}></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
