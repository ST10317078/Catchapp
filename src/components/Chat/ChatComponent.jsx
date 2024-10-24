import React, { useState, useEffect } from 'react';
import { doc, setDoc, updateDoc, arrayUnion, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './ChatComponent.css';

const ChatComponent = ({ selectedUser, currentUserId, onPinChat }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    if (selectedUser && currentUserId) {
      const chatDocRef = doc(db, 'chats', `${currentUserId}_${selectedUser.id}`);

      const unsubscribe = onSnapshot(chatDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const chatData = docSnapshot.data();
          setChatHistory(chatData.messages || []);
        } else {
          setChatHistory([]);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedUser, currentUserId]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedUser && currentUserId) {
      const chatDocRef = doc(db, 'chats', `${currentUserId}_${selectedUser.id}`);
      const newMessage = {
        senderId: currentUserId,
        receiverId: selectedUser.id,
        message,
        timestamp: new Date(),
      };

      try {
        // Check if the chat document exists
        const chatDocSnapshot = await getDoc(chatDocRef);
        
        if (!chatDocSnapshot.exists()) {
          // If the document doesn't exist, create it with the first message
          await setDoc(chatDocRef, { messages: [newMessage] });
        } else {
          // If the document exists, update it by adding the new message
          await updateDoc(chatDocRef, {
            messages: arrayUnion(newMessage),
          });
        }

        setChatHistory((prevHistory) => [...prevHistory, newMessage]);
        setMessage('');

        // Optionally pin the sender to the receiver's chat list
        await pinSenderToReceiver(selectedUser.id, currentUserId);
        console.log("Message sent and sender pinned successfully");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.log("Invalid message data. Message not sent.");
    }
  };

  const pinSenderToReceiver = async (receiverId, senderId) => {
    try {
      const receiverDocRef = doc(db, 'users', receiverId);
      await updateDoc(receiverDocRef, {
        pinnedChats: arrayUnion(senderId),
      });
    } catch (error) {
      console.error('Error pinning sender to receiver:', error);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img
          src={selectedUser.profilePicUrl || 'https://via.placeholder.com/40'}
          alt="Profile"
          className="chat-profile-pic"
        />
        <span className="chat-username">{selectedUser.username}</span>
      </div>

      <div className="chat-history">
        {chatHistory.length > 0 ? (
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
    </div>
  );
};

export default ChatComponent;
