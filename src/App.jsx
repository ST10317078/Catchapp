import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EditProfile from './components/profile/editProfile';
import ProfilePage from './components/profile/ProfilePage';
import DealsPage from './components/Deals/DealsPage';
import AddDeal from './components/Deals/AddDeal';
import AddMemory from './components/Memories/addMemory';
import MemoriesPage from './components/Memories/MemoriesPage';
import BottomNavBar from './components/Nav/BottomNavBar'; // Import your BottomNavBar
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./globals.css";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [chatId, setChatId] = useState(null); // Example for chat state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="container">
        {/* Check if the user is logged in */}
        {currentUser ? (
          <>
            {/* Routes for logged-in users */}
            <Routes>
              <Route path="/ProfilePage" element={<ProfilePage />} />
              <Route path="/editProfile" element={<EditProfile />} />
              <Route path="/addMemory" element={<AddMemory />} />
              <Route path="/AddDeal" element={<AddDeal />} />
              <Route path="/DealsPage" element={<DealsPage />} />
              <Route path="/MemoriesPage" element={<MemoriesPage />} />
            </Routes>
            <BottomNavBar />

          </>
        ) : (
          <>
            {/* Routes for guests (non-logged-in users) */}
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
