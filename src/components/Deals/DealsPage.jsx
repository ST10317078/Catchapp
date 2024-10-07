import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const DealsPage = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      const dealsCollection = collection(db, 'deals');
      const dealsSnapshot = await getDocs(dealsCollection);
      const dealsList = dealsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDeals(dealsList);
    };

    fetchDeals();
  }, []);

  return (
    <div className="deals-container">
      <h1>Restaurant Deals & Specials</h1>
      <div className="deals-grid">
        {deals.map((deal) => (
          <div key={deal.id} className="deal-card">
            <h3>{deal.title}</h3>
            <p>{deal.description}</p>
            <p><strong>Expiration:</strong> {deal.expirationDate}</p>
            <p><strong>Restaurant:</strong> {deal.restaurantName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsPage;
