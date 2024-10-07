import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../firebase'; // Import Firebase
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore'; // Import necessary Firestore functions
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css'; // Custom CSS
import { FaTrash } from 'react-icons/fa'; // Import the delete icon
import { useLocation } from 'react-router-dom'; // For detecting active route

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null); // To store clicked memory
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isLoading, setIsLoading] = useState(false); // Loading state for delete button
  const videoRef = useRef(null); // Reference for the video element
  const navigate = useNavigate();
  const user = auth.currentUser;
  const location = useLocation(); // For detecting active route

  // Fetch the user's profile data and memories
  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUserData(querySnapshot.docs[0].data());
      }

      const memoriesRef = collection(db, 'memories');
      const memoriesQuery = query(memoriesRef, where('userId', '==', user.uid));
      const memoriesSnapshot = await getDocs(memoriesQuery);
      const memoriesList = memoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMemories(memoriesList);
    };

    fetchUserData();
  }, [user]);

  // Handle video click
  const handleMemoryClick = (memory) => {
    setSelectedMemory(memory);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMemory(null);
    if (videoRef.current) {
      videoRef.current.pause(); // Pause video when closing modal
      videoRef.current.currentTime = 0; // Reset time when closing
    }
  };

  // Delete memory
  const handleDeleteMemory = async (memoryId) => {
    const memoryRef = doc(db, 'memories', memoryId);
    setIsLoading(true); // Set loading state to true
    try {
      await deleteDoc(memoryRef); // Delete the document from Firestore
      // Update the state to remove the deleted memory from the UI
      setMemories((prevMemories) => prevMemories.filter((memory) => memory.id !== memoryId));
      handleCloseModal(); // Close the modal if it's open
    } catch (error) {
      console.error('Error deleting memory:', error); // Log any error
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="profile-page">
      {/* Cover Image */}
      <div className="cover-photo-container">
        <img
          src={userData?.coverPicUrl || 'https://via.placeholder.com/1000x300'}
          alt="Cover"
          className="cover-pic"
        />
      </div>

      {/* Profile Header */}
      <div className="profile-header-container">
        <div className="profile-header-content">
          <div className="profile-image-container">
            <img
              className="profile-image"
              src={userData?.profilePicUrl || 'https://via.placeholder.com/150'}
              alt="Profile"
            />
          </div>

          {/* User Info */}
          <div className="profile-info-container">
            <h2 className="profile-username">{userData?.username}</h2>
            <p className="profile-bio">{userData?.bio}</p>
            <p className="profile-location">{userData?.location}</p>

            {/* Edit Profile Button */}
            <button
              className="edit-profile-button"
              onClick={() => navigate('/editProfile')}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Memory Grid */}
      <div className="memory-grid">
        {memories.length > 0 ? (
          memories.map((memory) => (
            <div
              key={memory.id}
              className="memory-item"
              onClick={() => handleMemoryClick(memory)} // Open modal on click
            >
              {memory.type === 'image' ? (
                <img
                  src={memory.mediaUrl}
                  alt={memory.caption}
                  className="memory-image"
                />
              ) : (
                <video className="memory-video">
                  <source src={memory.mediaUrl} type="video/mp4" />
                </video>
              )}
            </div>
          ))
        ) : (
          <p>No memories found.</p>
        )}
      </div>

      {/* Modal for Enlarged Video */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>&times;</button>
            {selectedMemory.type === 'video' ? (
              <video
                className="enlarged-media"
                ref={videoRef}
                src={selectedMemory.mediaUrl}
                autoPlay
              />
            ) : (
              <img
                className="enlarged-media"
                src={selectedMemory.mediaUrl}
                alt={selectedMemory.caption}
              />
            )}
            <div className="modal-stats">
              <p>{selectedMemory.caption}</p>
              <p>Likes: {selectedMemory.likes?.length || 0}</p>
              <p>Comments: {selectedMemory.comments?.length || 0}</p>
              <button className="delete-button" onClick={(e) => {
                e.stopPropagation(); // Prevent modal from closing
                handleDeleteMemory(selectedMemory.id);
              }} disabled={isLoading}>
                {isLoading ? (
                  <span className="loader"></span> // Add a loader span
                ) : (
                  <>
                    <FaTrash /> Delete Video
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
