import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthC } from '../../Auth/AuthProviderx';
import UseAxiosPublic from '../../Auth/UseAxiosPublic';
import { Card, Button, Tabs } from 'flowbite-react';
import { FaSave, FaExclamationTriangle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import SocialShareButton from '../../SocialShareButton';

const AllPosts = () => {
  const { user, updateUserCreditPoints } = useContext(AuthC);
  const [feedPosts, setFeedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const axiosPublic = UseAxiosPublic();

  const generateFakePosts = (count) => {
    const posts = [];
    const sources = ['Twitter', 'Reddit', 'LinkedIn'];
    const users = ['@TechGuru', 'r/WebDev', 'Software Innovations'];
    const contents = [
      'Just launched a new open-source project on GitHub! Check it out: [link]',
      'Ask me anything about React best practices!',
      'Interesting article on the future of AI in web development. [link]',
      'Sharing a code snippet that helped me solve a tricky bug.',
      'Looking for feedback on my latest portfolio design. [link]',
    ];

    for (let i = 0; i < count; i++) {
      const sourceIndex = Math.floor(Math.random() * sources.length);
      posts.push({
        id: `fake-${i}`,
        source: sources[sourceIndex],
        author: users[sourceIndex],
        content: contents[Math.floor(Math.random() * contents.length)],
        link: `https://fakeurl.com/post/${i}`,
        isSaved: false,
        isReported: false,
      });
    }
    return posts;
  };

  useEffect(() => {
    // Simulate fetching posts
    const fakeTwitterPosts = generateFakePosts(3).map(post => ({ ...post, source: 'Twitter', author: `@${post.author.split(' ')[0]}` }));
    const fakeRedditPosts = generateFakePosts(3).map(post => ({ ...post, source: 'Reddit', author: `u/${post.author.split('/')[1]}` }));
    const fakeLinkedInPosts = generateFakePosts(4).map(post => ({ ...post, source: 'LinkedIn', author: post.author }));
    const initialPosts = [...fakeTwitterPosts, ...fakeRedditPosts, ...fakeLinkedInPosts].sort(() => Math.random() - 0.5);
    setFeedPosts(initialPosts);

    // Load saved posts from local storage
    const storedSavedPosts = localStorage.getItem('savedPosts');
    if (storedSavedPosts) {
      setSavedPosts(JSON.parse(storedSavedPosts));
    }

    // Load reported posts from local storage
    const storedReportedPosts = localStorage.getItem('reportedPosts');
    if (storedReportedPosts) {
      setReportedPosts(JSON.parse(storedReportedPosts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
  }, [savedPosts]);

  useEffect(() => {
    localStorage.setItem('reportedPosts', JSON.stringify(reportedPosts));
  }, [reportedPosts]);

  const handleSavePost = useCallback(async (post) => {
    if (!user?.email) {
      Swal.fire({ icon: 'error', title: 'Authentication Required', text: 'Please log in to save posts.' });
      return;
    }
    if (savedPosts.some(saved => saved.id === post.id)) {
      Swal.fire({ icon: 'info', title: 'Already Saved', text: 'This post is already saved.' });
      return;
    }

    const updatedPosts = feedPosts.map(p => p.id === post.id ? { ...p, isSaved: true } : p);
    setFeedPosts(updatedPosts);
    const newSavedPosts = [...savedPosts, post];
    setSavedPosts(newSavedPosts);

    try {
      const pointsToAdd = 10;
      await updateUserCreditPoints(user.email, pointsToAdd);
      Swal.fire({ icon: 'success', title: 'Post Saved!', text: `+${pointsToAdd} points awarded.`, timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error('Error updating credit points:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update your points.' });
    }
  }, [user, updateUserCreditPoints, savedPosts, feedPosts, setFeedPosts, setSavedPosts]);

  const handleSharePost = useCallback(async (post) => {
    if (!user?.email) {
      Swal.fire({ icon: 'error', title: 'Authentication Required', text: 'Please log in to earn points for sharing.' });
      return;
    }
    try {
      navigator.clipboard.writeText(post.link);
      Swal.fire({ icon: 'success', title: 'Link Copied!', text: 'Post link copied to clipboard.', timer: 1500, showConfirmButton: false });
      const pointsToAdd = 20;
      await updateUserCreditPoints(user.email, pointsToAdd);
      Swal.fire({ icon: 'success', title: 'Shared!', text: `+${pointsToAdd} points awarded.`, timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error('Error during share:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to perform share action or update points.' });
    }
  }, [user, updateUserCreditPoints]);

  const handleSocialShare = useCallback(async () => {
    if (!user?.email) {
      Swal.fire({ icon: 'error', title: 'Authentication Required', text: 'Please log in to earn points for sharing.' });
      return;
    }
    try {
      const pointsToAdd = 20;
      Swal.fire({ icon: 'success', title: 'Shared!', text: `+${pointsToAdd} points awarded.`, timer: 1500, showConfirmButton: false });
      await updateUserCreditPoints(user.email, pointsToAdd);
    } catch (error) {
      console.error('Error updating credit points:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update your points.' });
    }
  }, [user, updateUserCreditPoints]);

  const handleReportPost = useCallback(async (post) => {
    if (!user?.email) {
      Swal.fire({ icon: 'error', title: 'Authentication Required', text: 'Please log in to report posts.' });
      return;
    }
    Swal.fire({
      title: 'Report Post?',
      text: `Are you sure you want to report this post from ${post.source}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, report it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(`Post reported: ${post.id} from ${post.source}`);
        Swal.fire('Reported!', 'The post has been reported for review.', 'success');
        try {
          const pointsToAdd = 15;
          await updateUserCreditPoints(user.email, pointsToAdd);
          Swal.fire({ icon: 'success', title: 'Reported!', text: `+${pointsToAdd} points awarded for reporting.`, timer: 1500, showConfirmButton: false });

          const updatedPosts = feedPosts.map(p => p.id === post.id ? { ...p, isReported: true } : p);
          setFeedPosts(updatedPosts);
          setReportedPosts(prevReportedPosts => [...prevReportedPosts, post]);
        } catch (error) {
          console.error('Error updating credit points:', error);
          Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update your points.' });
        }
      }
    });
  }, [user, updateUserCreditPoints, feedPosts, setFeedPosts, setReportedPosts]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">All Posts</h1>
        <Tabs aria-label="Default tabs">
          <Tabs.Item active title="Feed">
            <div className="overflow-y-auto max-h-[600px] space-y-4 mt-4">
              {feedPosts.map((post) => (
                <Card key={post.id}>
                  <div className="mb-4">
                    <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {post.author} <span className="text-sm text-gray-500">({post.source})</span>
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{post.content}</p>
                    <a href={post.link} className="font-medium text-blue-600 hover:underline dark:text-blue-500" target="_blank" rel="noopener noreferrer">
                      View Post
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button color={post.isSaved ? 'green' : 'gray'} onClick={() => handleSavePost(post)}>
                      <FaSave className="mr-2" /> {post.isSaved ? 'Saved' : 'Save'}
                    </Button>
                    <SocialShareButton
                      url={post.link}
                      title={post.content}
                      text={`Check out this post from ${post.author} on ${post.source}!`}
                      onShare={handleSocialShare}
                    />
                    <Button color="red" onClick={() => handleReportPost(post)}>
                      <FaExclamationTriangle className="mr-2" /> Report
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Tabs.Item>
          <Tabs.Item title="Saved">
            {savedPosts.length > 0 ? (
              <div className="overflow-y-auto max-h-[600px] space-y-2 mt-4">
                {savedPosts.map((post) => (
                  <div key={`saved-${post.id}`} className="bg-gray-50 p-3 rounded-md shadow-sm">
                    <p className="text-gray-700">{post.content} ({post.source} - {post.author})</p>
                    <a href={post.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">View</a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-600">No posts saved yet.</p>
            )}
          </Tabs.Item>
          <Tabs.Item title="Reported">
            {reportedPosts.length > 0 ? (
              <div className="overflow-y-auto max-h-[600px] space-y-2 mt-4">
                {reportedPosts.map((post) => (
                  <div key={`reported-${post.id}`} className="bg-red-50 p-3 rounded-md shadow-sm border border-red-200">
                    <p className="text-gray-700">{post.content} ({post.source} - {post.author})</p>
                    <a href={post.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">View</a>
                    <span className="ml-2 text-red-500 font-semibold">(Reported)</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-600">No posts reported yet.</p>
            )}
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
};

export default AllPosts;