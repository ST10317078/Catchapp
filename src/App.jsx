import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EditProfile from './components/profile/editProfile';
import ProfilePage from './components/profile/ProfilePage';
import ChatComponent from './components/Chat/ChatComponent';
import ChatList from './components/Chat/ChatList';
import AddMemory from './components/Memories/addMemory';
import MemoriesPage from './components/Memories/MemoriesPage';
import ChatPage from './components/Chat/ChatPage';
import BottomNavbar from './components/Nav/BottomNavBar'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./globals.css";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="container">
        {currentUser ? (
          <>
            <Routes>
              <Route path="/chatList" element={<ChatList currentUserId={currentUser.uid} />} />
              <Route path="/chat/:userId" element={<ChatComponent currentUserId={currentUser.uid} />} />
              <Route path="/ProfilePage" element={<ProfilePage />} />
              <Route path="/editProfile" element={<EditProfile />} />
              <Route path="/addMemory" element={<AddMemory />} />
              <Route path="/MemoriesPage" element={<MemoriesPage />} />
              <Route path="/ChatPage" element={<ChatPage />} />
            </Routes>
            {/* Ensure BottomNavbar is inside the Router */}
            <BottomNavbar />
          </>
        ) : (
          <>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Register" element={<Register />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
