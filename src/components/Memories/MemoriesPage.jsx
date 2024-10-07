import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import './MemoriesPage.css';
import { FaHeart, FaComment, FaUserPlus, FaVolumeUp, FaVolumeMute, FaShareAlt } from 'react-icons/fa';

const MemoriesPage = () => {
  const [memories, setMemories] = useState([]);
  const [user, setUser] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [visibleComments, setVisibleComments] = useState({});
  const commentRefs = useRef({});

  useEffect(() => {
    setUser(auth.currentUser);
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    const memoriesSnapshot = await getDocs(collection(db, 'memories'));
    const memoriesList = memoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch user data for usernames
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const usersData = {};
    usersSnapshot.docs.forEach((doc) => {
      usersData[doc.id] = doc.data().username;
    });

    const updatedMemories = memoriesList.map((memory) => {
      const posterUsername = usersData[memory.userId] || 'Unknown';
      if (memory.comments) {
        const commentsWithUsernames = memory.comments.map((comment) => ({
          ...comment,
          username: usersData[comment.userId] || 'Unknown',
        }));
        return { ...memory, comments: commentsWithUsernames, username: posterUsername };
      }
      return { ...memory, username: posterUsername };
    });

    setMemories(updatedMemories);
  };

  const handleLike = async (memoryId) => {
    const memoryRef = doc(db, 'memories', memoryId);
    const userId = user.uid;

    const memory = memories.find((memory) => memory.id === memoryId);
    
    // Ensure likes is an array before proceeding
    const hasLiked = Array.isArray(memory.likes) && memory.likes.includes(userId);

    try {
      if (hasLiked) {
        // Remove the user from the likes array
        await updateDoc(memoryRef, { likes: arrayRemove(userId) });

        // Update the state to reflect the change in the UI
        setMemories((prevMemories) =>
          prevMemories.map((mem) =>
            mem.id === memoryId ? { ...mem, likes: mem.likes.filter((id) => id !== userId) } : mem
          )
        );
      } else {
        // Add the user to the likes array
        await updateDoc(memoryRef, { likes: arrayUnion(userId) });

        // Update the state to reflect the change in the UI
        setMemories((prevMemories) =>
          prevMemories.map((mem) =>
            mem.id === memoryId ? { ...mem, likes: [...(mem.likes || []), userId] } : mem
          )
        );
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleComment = async (memoryId) => {
    const memoryRef = doc(db, 'memories', memoryId);
    const newComment = {
      userId: user.uid,
      comment: commentText,
      timestamp: new Date().toISOString(),
    };

    try {
      await updateDoc(memoryRef, {
        comments: arrayUnion(newComment),
      });
      setCommentText(''); // Clear the input after submitting
      fetchMemories(); // Re-fetch memories after adding a comment
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleFollow = async (targetUserId) => {
    // Your existing handleFollow logic...
  };

  const handleVideoClick = (memoryId) => {
    const currentVideo = document.getElementById(`video-${memoryId}`);

    if (!currentVideo) return; // Exit if the video element is not found

    if (playingVideoId && playingVideoId !== memoryId) {
      // Pause the currently playing video
      const previousVideo = document.getElementById(`video-${playingVideoId}`);
      if (previousVideo) {
        previousVideo.pause();
      }
    }

    // Play or pause the current video
    if (currentVideo.paused) {
      currentVideo.play();
      setPlayingVideoId(memoryId); // Set this video as currently playing
    } else {
      currentVideo.pause();
      setPlayingVideoId(null); // No video is playing
    }
  };

  const toggleMute = (memoryId) => {
    const videoElement = document.getElementById(`video-${memoryId}`);
    if (videoElement) {
      videoElement.muted = !videoElement.muted; // Toggle mute
    }
  };

  const handleShare = (memoryId) => {
    alert(`Memory shared! (ID: ${memoryId})`);
  };

  const toggleComments = (memoryId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [memoryId]: !prev[memoryId],
    }));
  };

  useEffect(() => {
    Object.keys(visibleComments).forEach((memoryId) => {
      if (visibleComments[memoryId] && commentRefs.current[memoryId]) {
        commentRefs.current[memoryId].scrollTop = commentRefs.current[memoryId].scrollHeight;
      }
    });
  }, [visibleComments]);

  return (
    <div className="memories-page">
      {memories.map((memory) => (
        <div key={memory.id} className="memory-reel">
          <div className="memory-media">
            {memory.type === 'video' ? (
              <video
                id={`video-${memory.id}`}
                muted
                loop
                onClick={() => handleVideoClick(memory.id)} // Play/pause on click
                src={memory.mediaUrl}
                className="memory-video"
              ></video>
            ) : (
              <img src={memory.mediaUrl} alt={memory.caption} className="memory-image" />
            )}
          </div>
          <div className="icon-container">
            <FaHeart
              className={`icon ${Array.isArray(memory.likes) && memory.likes.includes(user.uid) ? 'liked' : ''}`}
              onClick={() => handleLike(memory.id)}
            />
            <span>{Array.isArray(memory.likes) ? memory.likes.length : 0}</span>

            <FaComment
              className="icon"
              onClick={() => toggleComments(memory.id)}
            />
            <span>{Array.isArray(memory.comments) ? memory.comments.length : 0}</span>

            <FaUserPlus className="icon" onClick={() => handleFollow(memory.userId)} />

            {document.getElementById(`video-${memory.id}`)?.muted ? (
              <FaVolumeMute className="icon" onClick={() => toggleMute(memory.id)} />
            ) : (
              <FaVolumeUp className="icon" onClick={() => toggleMute(memory.id)} />
            )}

            <FaShareAlt className="icon" onClick={() => handleShare(memory.id)} />
          </div>

          <div className="memory-info">
            <h3>{memory.caption}</h3>
            <p>Posted by: {memory.username}</p>

            {visibleComments[memory.id] && (
  <div 
    className={`comment-section ${visibleComments[memory.id] ? 'open' : ''}`}
    ref={(el) => (commentRefs.current[memory.id] = el)}
  >
    {memory.comments?.map((comment, index) => (
      <p key={index}><strong>{comment.username}</strong>: {comment.comment}</p>
    ))}

    {/* Styled input for adding a new comment */}
    <input
      type="text"
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder="Add a comment and press Enter"
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          handleComment(memory.id);
        }
      }}
    />
  </div>
)}

          </div>
        </div>
      ))}
    </div>
  );
};

export default MemoriesPage;
