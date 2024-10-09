import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatComponent from './ChatComponent';
import './ChatPage.css'; // Add your CSS styles for the chat page
import { db } from '../../firebase'; // Firebase setup
import { collection, getDocs, query, where } from 'firebase/firestore';

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pinnedChats, setPinnedChats] = useState([]); // Initialize with an empty array

  useEffect(() => {
    fetchPinnedChats();
  }, []);

  // Function to search users from Firestore based on the search term
  const searchUsers = async (term) => {
    if (term.trim()) {
      const q = query(collection(db, 'users'), where('username', '>=', term));
      const userSnapshot = await getDocs(q);
      const users = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSearchResults(users);
    } else {
      setSearchResults([]); // Clear results when the search term is empty
    }
  };

  // Fetch pinned chats (in a real app, this might come from Firestore or localStorage)
  const fetchPinnedChats = () => {
    const storedPinnedChats = JSON.parse(localStorage.getItem('pinnedChats')) || [];
    setPinnedChats(storedPinnedChats);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const pinChat = (user) => {
    if (!pinnedChats.some((pinnedUser) => pinnedUser.id === user.id)) {
      const newPinnedChats = [...pinnedChats, user];
      setPinnedChats(newPinnedChats);
      localStorage.setItem('pinnedChats', JSON.stringify(newPinnedChats)); // Store in localStorage
    }
  };

  return (
    <div className="chat-page">
      {/* ChatList shows search input and pinned chats */}
      <ChatList
        pinnedChats={pinnedChats}
        onUserSelect={handleUserSelect}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchUsers={searchUsers}
        searchResults={searchResults}
        pinChat={pinChat}
      />

      {/* Chat window */}
      {selectedUser && <ChatComponent selectedUser={selectedUser} />}
    </div>
  );
};

export default ChatPage;
