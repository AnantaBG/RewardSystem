import React, { useEffect, useContext, useState } from 'react';
import { AuthC } from '../../Auth/AuthProviderx';
import { Button, Spinner, Card, Table } from 'flowbite-react';
import UseAxiosPublic from '../../Auth/UseAxiosPublic';
import { GiGiftTrap } from 'react-icons/gi';
import { BsCalendarDate } from 'react-icons/bs';
import { TbTriangle } from 'react-icons/tb';
import { FaSave } from 'react-icons/fa'; // Import save icon

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
  const [savedPosts, setSavedPosts] = useState([]); // State for saved feeds
  const [recentActivity, setRecentActivity] = useState([]); // State for recent activity
  const axiosPublic = UseAxiosPublic();
  const adminEmail = 'anantabanikofficial@gmail.com';

  useEffect(() => {
    const fetchData = async () => {
      if (user?.email) {
        setLoading(true);
        const today = new Date().toDateString();
        const lastLogin = localStorage.getItem(`lastLogin_${user.email}`);
        if (lastLogin === today) {
          setDailyPointsClaimed(true);
        }

        try {
          const rewardResponse = await axiosPublic.get('/RewardP');
          setRewardData(rewardResponse.data); // Store all reward data

          const userRewardData = rewardResponse.data.filter(item => item.email === user.email);
          let pointsSum = 0;
          userRewardData.forEach(item => {
            pointsSum += item.points;
          });
          setTotalPoints(pointsSum);

          // Load saved posts from local storage (same logic as before)
          const storedSavedPosts = localStorage.getItem('savedPosts');
          if (storedSavedPosts) {
            setSavedPosts(JSON.parse(storedSavedPosts));
          }

          // Simulate fetching recent activity (replace with your actual API call)
          const activityResponse = await axiosPublic.get(`/user-activities/${user.email}`);
          setRecentActivity(activityResponse.data);

        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email, axiosPublic]);

  const handleClaimPoints = async () => {
    if (user?.email && !dailyPointsClaimed) {
      const today = new Date().toDateString();
      const lastLogin = localStorage.getItem(`lastLogin_${user.email}`);
      if (lastLogin !== today) {
        const pointsToAdd = 50;
        try {
          await updateUserCreditPoints(user.email, pointsToAdd);
          localStorage.setItem(`lastLogin_${user.email}`, today);
          console.log("Daily login points awarded: 50");
          setDailyPointsClaimed(true);
          setTotalPoints(prevTotalPoints => prevTotalPoints + pointsToAdd);

          const response = await axiosPublic.post('/claimDailyPoints', {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            points: pointsToAdd,
          });

          if (response.status !== 200) {
            console.error('Failed to store daily points on server');
          } else {
            setRewardData(prevRewardData => [
              ...prevRewardData,
              {
                email: user.email,
                points: pointsToAdd,
                timestamp: new Date().toISOString(),
              },
            ]);
          }
        } catch (error) {
          console.error("Failed to award daily login points:", error);
        }
      }
    }
  };

  if (loading) {
    return <Loading />;
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
          {user.email !== adminEmail && (
            <>
              <p className="text-gray-600">
                <span className="font-medium">Your Email:</span> {user.email}
              </p>
              <p className="text-xl text-green-600 flex items-center">
                <GiGiftTrap className="mr-2 text-green-500" />
                Total Credit Points: <span className="font-bold">{totalPoints}</span>
              </p>
              {dailyPointsClaimed && <p className="text-green-600">Daily points already claimed today.</p>}
            </>
          )}
        </div>
        {user.email !== adminEmail && !dailyPointsClaimed && (
          <Button
            onClick={handleClaimPoints}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          >
            <BsCalendarDate className="mr-2" />
            Claim Daily Points (50)
          </Button>
        )}

        {user.email === adminEmail && rewardData.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Reward Data</h2>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Points</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {rewardData.map((dataItem, index) => (
                  <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{dataItem.email}</Table.Cell>
                    <Table.Cell>{dataItem.name}</Table.Cell>
                    <Table.Cell>{dataItem.points}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}

        {user.email !== adminEmail && savedPosts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Saved Feeds</h2>
            <div className="space-y-3">
              {savedPosts.map((post) => (
                <Card key={`saved-${post.id}`}>
                  <div className="mb-2">
                    <h5 className="text-xl font-semibold text-gray-900">{post.author} ({post.source})</h5>
                    <p className="text-gray-700">{post.content}</p>
                    <a href={post.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">View</a>
                  </div>
                  {/* If you want to allow unsaving from here */}
                  {/* <Button color="gray" size="sm">Unsave</Button> */}
                </Card>
              ))}
            </div>
          </div>
        )}

        {recentActivity.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <ul className="space-y-3">
              {recentActivity.map((activity) => (
                <li key={`${activity.postId}-${activity.activityType}`} className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <p className="text-gray-700">
                    You <span className="font-semibold">{activity.activityType}</span> a post from{' '}
                    <span className="font-medium">{activity.postDetails?.author || 'Unknown'}</span> ({activity.postDetails?.source || 'Unknown'}) on{' '}
                    {new Date(activity.timestamp).toLocaleString()}.
                  </p>
                  {activity.postDetails?.content && (
                    <p className="text-gray-600 italic">{activity.postDetails.content.substring(0, 50)}...</p>
                  )}
                  {activity.postDetails?.link && (
                    <a href={activity.postDetails.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">View Post</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {user.email !== adminEmail && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Reward Points History</h2>
            {rewardData.filter(item => item.email === user.email).length > 0 ? (
              <ul className="space-y-3">
                {rewardData.filter(item => item.email === user.email).map((item, index) => (
                  <li key={index} className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center justify-between">
                    <span className="text-gray-700">Timestamp: {new Date(item.timestamp).toLocaleString()}</span>
                    <span className="font-semibold text-green-600">+ {item.points}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No reward points history found for your account.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTasks;