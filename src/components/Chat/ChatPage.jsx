import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Import Firebase Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods
import ChatList from './ChatList';
import ChatComponent from './ChatComponent';
import './ChatPage.css'; // CSS for the chat page

const ChatPage = ({ currentUserId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [pinnedChats, setPinnedChats] = useState([]); // List of pinned chats
  const [users, setUsers] = useState([]); // List of all users

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsersFromFirestore();
        setUsers(usersData); // Set the users in state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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
      <ChatList
        users={users} // Pass the users array to ChatList
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
    </div>
  );
};

// Define the function to fetch users from Firestore
const getUsersFromFirestore = async () => {
  const usersCollection = collection(db, 'users'); // Reference to the 'users' collection
  const usersSnapshot = await getDocs(usersCollection);
  const usersList = usersSnapshot.docs.map(doc => ({
    id: doc.id, // Firebase document ID
    ...doc.data() // All other user data
  }));
  return usersList;
};

export default ChatPage;
