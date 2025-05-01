import React, { useEffect, useContext, useState } from 'react';
import { AuthC } from '../../Auth/AuthProviderx';
import { Button, Spinner } from 'flowbite-react';
import UseAxiosPublic from '../../Auth/UseAxiosPublic';
import { GiGiftTrap } from 'react-icons/gi';
import { BsCalendarDate } from 'react-icons/bs';
import { TbTriangle } from 'react-icons/tb';

const Loading = () => (
  <div className="flex items-center justify-center h-screen">
             <Spinner aria-label="Default status example" />
  </div>
);


const AllTasks = () => {
  const { user, updateUserCreditPoints } = useContext(AuthC);
  const [dailyPointsClaimed, setDailyPointsClaimed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rewardData, setRewardData] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const axiosPublic = UseAxiosPublic();

  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        setLoading(true);
        const today = new Date().toDateString();
        const lastLogin = localStorage.getItem(`lastLogin_${user.uid}`);
        if (lastLogin === today) {
          setDailyPointsClaimed(true);
        }

        try {
          const response = await axiosPublic.get('/RewardP');
          const allRewardData = response.data;
          const userRewardData = allRewardData.filter(item => item.email === user.email);
          setRewardData(userRewardData);

          let pointsSum = 0;
          userRewardData.forEach(item => {
            pointsSum += item.points;
          });
          setTotalPoints(pointsSum);
        } catch (error) {
          console.error("Failed to fetch reward data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, axiosPublic]);

  const handleClaimPoints = async () => {
    if (user?.uid && !dailyPointsClaimed) {
      const today = new Date().toDateString();
      const lastLogin = localStorage.getItem(`lastLogin_${user.uid}`);
      if (lastLogin !== today) {
        const newPoints = (user.creditPoints || 0) + 50;
        try {
          await updateUserCreditPoints(user.uid, newPoints);
          localStorage.setItem(`lastLogin_${user.uid}`, today);
          console.log("Daily login points awarded: 50");
          setDailyPointsClaimed(true);
          setTotalPoints(prevPoints => prevPoints + 50);

          const response = await axiosPublic.post('/claimDailyPoints', {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            points: newPoints,
          });

          if (response.status !== 200) {
            console.error('Failed to store daily points on server');
          }
          if (user && updateUserCreditPoints) {
            updateUserCreditPoints(user.uid, newPoints);
          }
        } catch (error) {
          console.error("Failed to award daily login points:", error);
        }
      }
    }
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (!user) {
     return (
      <div className="flex flex-col items-center justify-center h-screen">
        <TbTriangle className="text-6xl text-red-500 mb-4" />
        <p className="text-lg text-gray-700">Please log in to see your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <div className="mb-6">
          <p className="text-lg text-gray-700">
            Welcome, <span className="font-semibold text-blue-600">{user.displayName || 'User'}</span>!
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Your Email:</span> {user.email}
          </p>
          <p className="text-xl text-green-600 flex items-center">
            <GiGiftTrap className="mr-2 text-green-500" />
            Total Credit Points: <span className="font-bold">{totalPoints}</span>
          </p>
        </div>
        {!dailyPointsClaimed && (
          <Button
            onClick={handleClaimPoints}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          >
            <BsCalendarDate className="mr-2" />
            Claim Daily Points (50)
          </Button>
        )}
        {dailyPointsClaimed && <p className="text-green-600">Daily points already claimed today.</p>}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Reward Points History</h2>
          {rewardData.length > 0 ? (
            <ul className="space-y-3">
              {rewardData.map((item, index) => (
                <li key={index} className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center justify-between">
                  <span className="text-gray-700">Timestamp: {new Date(item.timestamp).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No reward points history found for your account.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTasks;

