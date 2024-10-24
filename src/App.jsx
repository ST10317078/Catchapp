import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import ChatPage from './components/Chat/ChatPage';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user); // This will set the entire user object
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {/* Ensure that ChatPage gets the current user's ID */}
      {currentUser ? <ChatPage currentUserId={currentUser.uid} /> : <p>Please log in</p>}
    </div>
  );
};

export default App;
