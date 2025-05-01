import React, { useEffect, useContext, useState } from 'react';
import { AuthC } from '../../Auth/AuthProviderx';
import { Button } from 'flowbite-react';

const AllTasks = () => {
  const { user, updateUserCreditPoints } = useContext(AuthC);
  const [dailyPointsClaimed, setDailyPointsClaimed] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        setLoading(true);
        const today = new Date().toDateString();
        const lastLogin = localStorage.getItem(`lastLogin_${user.uid}`);
        if (lastLogin === today) {
          setDailyPointsClaimed(true);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleClaimPoints = async () => {
    if (user?.uid && !dailyPointsClaimed) {
      const today = new Date().toDateString();
      const lastLogin = localStorage.getItem(`lastLogin_${user.uid}`);
      if (lastLogin !== today) {
        const newPoints = (user.creditPoints || 0) + 50;
        try {
          await updateUserCreditPoints(user.uid, newPoints); // Update in DB
          localStorage.setItem(`lastLogin_${user.uid}`, today);
          console.log("Daily login points awarded: 50");
          setDailyPointsClaimed(true);
  
          // Send data to the server to store in the RewardP collection
          const response = await fetch('http://localhost:4000/claimDailyPoints', { // Adjust the URL if needed
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
              name: user.displayName, // Or user.name, depending on your user object
              points: newPoints,
            }),
          });
  
          if (!response.ok) {
            console.error('Failed to store daily points on server');
            //  Consider showing an error to the user
          }
  
  
        } catch (error) {
          console.error("Failed to award daily login points:", error);
        }
      }
    }
  };

  if (loading) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Loading...</p> {/* Show loading message */}
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Please log in to see your dashboard.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.displayName || 'User'}!</p>
      <p>Your Email: {user.email}</p>
      <p>Last Sign In Time: {user.metadata?.lastSignInTime || 'N/A'}</p>
      <p>Your Credit Points: {user.creditPoints || 0}</p>
      {!dailyPointsClaimed && (
        <Button onClick={handleClaimPoints}>Claim Daily Points (50)</Button>
      )}
      {dailyPointsClaimed && <p>Daily points already claimed today.</p>}
    </div>
  );
};

export default AllTasks;
