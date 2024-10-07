// src/components/AddDeal.js
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const AddDeal = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [restaurantName, setRestaurantName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'deals'), {
        title,
        description,
        expirationDate,
        restaurantName,
      });
      alert('Deal added successfully!');
    } catch (error) {
      console.error('Error adding deal: ', error);
    }
  };

  return (
    <div className="add-deal-container">
      <form onSubmit={handleSubmit}>
        <h2>Add a New Deal</h2>
        <input
          type="text"
          placeholder="Deal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Deal Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Expiration Date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Restaurant Name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          required
        />
        <button type="submit">Add Deal</button>
      </form>
    </div>
  );
};

export default AddDeal;
