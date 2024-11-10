import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, setDoc, updateDoc, arrayUnion, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './ChatComponent.css';

const ChatComponent = ({ currentUserId }) => {
  const { userId } = useParams();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user details from Firestore
  const fetchUserDetails = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        setSelectedUser(userSnapshot.data());
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Generate a unique chat ID based on user IDs
  const getChatId = (id1, id2) => [id1, id2].sort().join('_');

  // Fetch chat history and mark messages as read
  useEffect(() => {
    if (userId && currentUserId) {
      setLoading(true);
      fetchUserDetails(userId);

      const chatId = getChatId(currentUserId, userId);
      const chatDocRef = doc(db, 'chats', chatId);

      const unsubscribe = onSnapshot(chatDocRef, async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const chatData = docSnapshot.data();
          const updatedMessages = chatData.messages.map((msg) => {
            // Mark the message as read if it's for the current user
            if (msg.receiverId === currentUserId && !msg.read) {
              return { ...msg, read: true };
            }
            return msg;
          });

          setChatHistory(updatedMessages);

          // Batch update only unread messages
          const unreadMessages = updatedMessages.filter(msg => msg.receiverId === currentUserId && !msg.read);
          if (unreadMessages.length > 0) {
            await updateDoc(chatDocRef, {
              messages: updatedMessages,
            });
          }
        } else {
          setChatHistory([]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [userId, currentUserId]);

  // Handle message sending
  const handleSendMessage = async () => {
    if (message.trim() && selectedUser && currentUserId) {
      const chatId = getChatId(currentUserId, userId);
      const chatDocRef = doc(db, 'chats', chatId);
      const newMessage = {
        senderId: currentUserId,
        receiverId: userId,
        message,
        timestamp: new Date(),
        read: false,
      };
  
      try {
        const chatDocSnapshot = await getDoc(chatDocRef);
  
        if (!chatDocSnapshot.exists()) {
          await setDoc(chatDocRef, { messages: [newMessage] });
          console.log("Chat document created for:", chatId);
        } else {
          await updateDoc(chatDocRef, {
            messages: arrayUnion(newMessage),
          });
          console.log("Message added to existing chat:", chatId);
        }
  
        setChatHistory((prevHistory) => [...prevHistory, newMessage]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  

  return (
    <div className="chat-window">
      {selectedUser && (
        <>
          <div className="chat-header">
            <img
              src={selectedUser.profilePicUrl || 'https://via.placeholder.com/40'}
              alt="Profile"
              className="chat-profile-pic"
            />
            <span className="chat-username">{selectedUser.username}</span>
          </div>

          <div className="chat-history">
            {loading ? (
              <div>Loading messages...</div>
            ) : chatHistory.length > 0 ? (
              chatHistory.map((chat, index) => (
                <div key={index} className={`chat-message ${chat.senderId === currentUserId ? 'sent' : 'received'}`}>
                  <strong>{chat.senderId === currentUserId ? 'You' : selectedUser.username}:</strong> {chat.message}
                </div>
              ))
            ) : (
              <div className="no-messages">No messages yet</div>
            )}
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="chat-input"
              placeholder="Type a message..."
            />
            <button className="send-button" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatComponent;
