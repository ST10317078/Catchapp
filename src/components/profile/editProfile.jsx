import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './editProfile.css';
import { Link, useLocation } from 'react-router-dom'; // For navigation


const EditProfile = () => {
  const [bio, setBio] = useState('');
  const [province, setProvince] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [coverPic, setCoverPic] = useState(null);
  const [coverPicUrl, setCoverPicUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // For detecting active route

  const user = auth.currentUser;
  const defaultPicUrl = 'https://via.placeholder.com/150';
  const defaultCoverUrl = 'https://via.placeholder.com/1000x300';

  useEffect(() => {
    if (!profilePicUrl) {
      setProfilePicUrl(defaultPicUrl);
    }
    if (!coverPicUrl) {
      setCoverPicUrl(defaultCoverUrl);
    }
  }, [profilePicUrl, coverPicUrl]);

  const handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      const file = e.target.files[0];
      setProfilePicUrl(URL.createObjectURL(file));
    }
  };

  const handleCoverPicChange = (e) => {
    if (e.target.files[0]) {
      setCoverPic(e.target.files[0]);
      const file = e.target.files[0];
      setCoverPicUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }

      let uploadedProfilePicUrl = profilePicUrl;
      let uploadedCoverPicUrl = coverPicUrl;

      // Upload profile picture if selected
      if (profilePic) {
        const profilePicRef = ref(storage, `profilePictures/${user.uid}`);
        try {
          await uploadBytes(profilePicRef, profilePic);
          uploadedProfilePicUrl = await getDownloadURL(profilePicRef);
        } catch (err) {
          console.error('Error uploading profile picture:', err);
          setError('Failed to upload profile picture');
          setLoading(false);
          return;
        }
      }

      // Upload cover picture if selected
      if (coverPic) {
        const coverPicRef = ref(storage, `coverPictures/${user.uid}`);
        try {
          await uploadBytes(coverPicRef, coverPic);
          uploadedCoverPicUrl = await getDownloadURL(coverPicRef);
        } catch (err) {
          console.error('Error uploading cover picture:', err);
          setError('Failed to upload cover image');
          setLoading(false);
          return;
        }
      }

      // Save user data to Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          bio,
          province,
          profilePicUrl: uploadedProfilePicUrl || defaultPicUrl,
          coverPicUrl: uploadedCoverPicUrl || defaultCoverUrl,
          username: user.displayName,
          email: user.email,
        });
      } catch (err) {
        console.error('Error writing user data to Firestore:', err);
        setError('Failed to save profile data');
        setLoading(false);
        return;
      }

      navigate('./ProfilePage.jsx');
    } catch (err) {
      console.error('General error:', err);
      setError('Failed to update profile');
    }

    setLoading(false);
  };

  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit}>
        <div className="profile-header">
          {/* Cover Image */}
          <div className="cover-pic-wrapper">
            <label htmlFor="coverPic">Cover Image</label>
            <img className="cover-pic" src={coverPicUrl} alt="Cover" />
            <input
              type="file"
              accept="image/*"
              id="coverPic"
              onChange={handleCoverPicChange}
            />
          </div>

          {/* Profile Picture */}
          <div className="profile-pic-wrapper">
            <label htmlFor="profilePic">Profile Picture</label>
            <img className="profile-pic" src={profilePicUrl} alt="Profile" />
            <input
              type="file"
              accept="image/*"
              id="profilePic"
              onChange={handleProfilePicChange}
            />
          </div>
        </div>

        <div className="profile-info">
          {/* Bio */}
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          {/* Province Select Dropdown */}
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            required
          >
            <option value="" disabled>Select Province</option>
            <option value="Eastern Cape">Eastern Cape</option>
            <option value="Free State">Free State</option>
            <option value="Gauteng">Gauteng</option>
            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
            <option value="Limpopo">Limpopo</option>
            <option value="Mpumalanga">Mpumalanga</option>
            <option value="North West">North West</option>
            <option value="Northern Cape">Northern Cape</option>
            <option value="Western Cape">Western Cape</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
      </form>

       {/* Bottom Navbar */}
       <div className="bottom-navbar">
        <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <i className="nav-icon fas fa-user"></i>
          <span>Profile</span>
        </Link>
        <Link to="/deals" className={`nav-item ${location.pathname === '/deals' ? 'active' : ''}`}>
          <i className="nav-icon fas fa-tag"></i>
          <span>Deals</span>
        </Link>
        <Link to="/MemoriesPage" className={`nav-item ${location.pathname === '/memories' ? 'active' : ''}`}>
          <i className="nav-icon fas fa-images"></i>
          <span>Memories</span>
        </Link>
        <Link to="/chat" className={`nav-item ${location.pathname === '/chat' ? 'active' : ''}`}>
          <i className="nav-icon fas fa-comments"></i>
          <span>Chat</span>
        </Link>
      </div>
    </div>
  );
};

export default EditProfile;
