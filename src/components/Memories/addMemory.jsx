import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './addMemory.css';
import { auth, storage, db } from '../../firebase'; // Import Firestore and Storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { setDoc, doc } from 'firebase/firestore'; // Firestore import for saving the memory

const AddMemory = () => {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState(null); // Store the selected file
  const [mediaPreview, setMediaPreview] = useState(''); // Store the preview URL
  const [mediaType, setMediaType] = useState(''); // Track if it's an image or video
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const navigate = useNavigate();

  // Function to upload media to Firebase Storage
  const uploadMedia = async (file) => {
    const storageRef = ref(storage, `memories/${auth.currentUser.uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file is an image or video
      if (file.type.startsWith('image/')) {
        setMediaType('image');
      } else if (file.type.startsWith('video/')) {
        setMediaType('video');
      } else {
        setErrorMessage('Unsupported file type. Please upload an image or video.');
        return;
      }

      setMedia(file); // Store the file
      setMediaPreview(URL.createObjectURL(file)); // Create preview URL
    }
  };

  // Handle form submit to upload media and save data to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption || !media) {
      setErrorMessage('Both caption and media are required.');
      return;
    }

    setLoading(true); // Start loading

    try {
      // Create a memory object to store in Firestore
      const memoryData = {
        caption,
        mediaUrl: '', // Initialize with an empty string
        userId: auth.currentUser.uid, // Include the user's ID
        likes: 0, // Initialize with 0 likes
        comments: [], // Initialize with an empty comments array
        type: mediaType, // Add media type (image/video)
        timestamp: new Date(), // Add timestamp
      };

      // Upload media to Firebase Storage and get the media URL
      const uploadedUrl = await uploadMedia(media);
      memoryData.mediaUrl = uploadedUrl; // Set the uploaded media URL

      // Save the memory data to Firestore
      const memoryRef = doc(db, 'memories', `${auth.currentUser.uid}_${Date.now()}`);
      await setDoc(memoryRef, memoryData);

      // Reset the form and navigate to the memories page
      setCaption('');
      setMedia(null);
      setMediaPreview('');
      setMediaType('');
      setErrorMessage('');
      navigate('/MemoriesPage'); // Redirect to the memories page
    } catch (error) {
      setErrorMessage('Error uploading memory: ' + error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="add-memory-container">
      <h2>Add a New Memory</h2>

      {/* Error Message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Media Preview */}
      {mediaPreview && (
        <div className="media-preview">
          {mediaType === 'image' ? (
            <img src={mediaPreview} alt="Preview" />
          ) : (
            <video controls>
              <source src={mediaPreview} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      {/* File Input */}
      <div className="file-input-wrapper">
        <label htmlFor="media">Upload Image or Video</label>
        <input
          type="file"
          accept="image/*,video/*"
          id="media"
          onChange={handleFileChange}
        />
      </div>

      <form onSubmit={handleSubmit}>
        {/* Caption Input */}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Memory'}
        </button>
      </form>

      {/* Loading Indicator */}
      {loading && <div className="loading-indicator">Uploading your memory...</div>}
    </div>
  );
};

export default AddMemory;
