import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatComponent from './ChatComponent';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './ChatPage.css';
import BottomNavbar from '../Nav/BottomNavBar'

const ChatPage = ({ currentUserId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [pinnedChats, setPinnedChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsersFromFirestore();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handlePinChat = (user) => {
    if (!pinnedChats.find((chat) => chat.id === user.id)) {
      setPinnedChats([...pinnedChats, user]);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="chat-page">
      <ChatList
        users={users}
        pinnedChats={pinnedChats}
        onUserSelect={handleUserSelect}
        currentUserId={currentUserId}
      />
      {selectedUser && (
        <ChatComponent
          selectedUser={selectedUser}
          currentUserId={currentUserId} // Ensure the current user ID is passed here
          onPinChat={handlePinChat}
        />
      )}
     <BottomNavbar />

    </div>
  );
};

// Function to fetch users from Firestore
const getUsersFromFirestore = async () => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  return usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export default ChatPage;
