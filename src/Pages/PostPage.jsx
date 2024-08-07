import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Notification from '../Components/Notification';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axiosInstance from '../config/axios';
import { format } from 'date-fns';
import user1 from '../assets/user1.png';
import user2 from '../assets/user2.png';
import user3 from '../assets/user3.png';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const writerImages = [
    user1,
    user2,
    user3,
  ];

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        console.log('Fetching post with ID:', id);
        const response = await axiosInstance.get(`/getNewsletter/${id}`);
        console.log('Post data:', response.data);
        setPost({
          ...response.data,
          writersImage: writerImages[Math.floor(Math.random() * writerImages.length)] // Assign a random image
        });
      } catch (error) {
        console.error('Error fetching post details:', error);
        setNotification({ message: 'Error fetching post details', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    } else {
      console.error('No id provided');
      setNotification({ message: 'Post ID is missing', type: 'error' });
      setLoading(false);
    }
  }, [id]);

  const handleUnsubscribe = async () => {
    try {
      const response = await axiosInstance.patch(`/removeSubscribers/${id}`);
      console.log('Unsubscribe response:', response.data);
      setNotification({ message: 'Successfully unsubscribed', type: 'success' });
    } catch (error) {
      console.error('Error unsubscribing:', error);
      setNotification({ message: error.response.data.message, type: 'error' });
    }
  };

  return (
    <div className="lg:px-20 px-5 bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter">
      <img
        src={bg1}
        alt="Background top right"
        className="lg:block hidden absolute top-0 right-0"
      />
      <img
        src={bg2}
        alt="Background bottom left"
        className="lg:block absolute hidden bottom-0 left-0"
      />
      <div className="lg:p-8 py-8 lg:px-5 rounded-2xl w-full max-w-[58rem] mt-10 m-auto">
        {loading ? (
          <div className="skeleton-wrapper">
            <Skeleton height={300} />
            <Skeleton width={200} height={30} className='my-5' />
            <div className="flex gap-2 items-center mt-5">
              <Skeleton circle height={50} width={50} />
              <Skeleton height={20} width={200} />
            </div>
            <Skeleton className='my-5' />
            <Skeleton height={250} className='mt-10' />
          </div>
        ) : post ? (
          <>
            <div className="relative">
              <img
                src={post.coverImageUrl || 'default-image-url.jpg'}
                alt={post.title || 'Default title'}
                className="w-full object-cover rounded-t-lg"
              />
            </div>
            <div className="p-5">
              <p className="text-[#808080] text-xs">{format(new Date(post.date), 'MMMM dd, yyyy h:mm a') || 'Date not available'}</p>
              <h3 className="text-3xl text-white font-semibold mt-5">{post.maillistName || 'Newsletter Title'}</h3>
              <p className="mt-2 text-[#808080]">{post.subtitle || 'Subtitle not available'}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 mt-5">
                  <img
                    src={post.writersImage}
                    alt={post.writersName || 'Unknown writer'}
                    className="w-10 h-10 object-cover rounded-full border p-1"
                  />
                  <p className="text-md text-[#808080]">{post.writersName || 'Writer Name'}</p>
                </div>
                <button
                  className='bg-[#B2C8FA] lg:px-10 lg:py-2 px-3 py-1 lg:text-base text-sm rounded-3xl text-white hover:bg-blue-600 transition-all'
                  onClick={handleUnsubscribe}
                >
                  Unsubscribe to Newsletter
                </button>
              </div>
              <div
                className="mt-20 text-[#808080]"
                dangerouslySetInnerHTML={{ __html: post.summary || 'Content not available' }}
              />
            </div>
          </>
        ) : (
          <p className="text-white">Post not found</p>
        )}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PostPage;
