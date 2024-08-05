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

const PostPage = () => {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        console.log('Fetching post with ID:', id); 
        const response = await axiosInstance.get(`/getNewsletter/${id}`);
        console.log('Post data:', response.data); 
        setPost(response.data);
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

  return (
    <div className="lg:px-20 px-5 bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter ">
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
      <Navbar />
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[58rem] mt-10 m-auto">
        {loading ? (
          <div className="skeleton-wrapper">
            <Skeleton height={40} width={300} />
            <Skeleton count={3} />
            <div className="flex justify-between items-center mt-5">
              <Skeleton circle={true} height={50} width={50} />
              <Skeleton height={30} width={200} />
            </div>
            <Skeleton height={250} />
          </div>
        ) : post ? (
          <>
            <div className="relative">
              <img
                src={post.coverImageUrl || 'default-image-url.jpg'}
                alt={post.title || 'Default title'}
                className="w-full  object-cover rounded-t-lg"
              />
            </div>
            <div className="p-5">
              <p className="text-[#808080] text-xs">{format(new Date(post.date), 'MMMM dd, yyyy h:mm a') || 'Date not available'}</p>
              <h3 className="text-3xl text-white font-semibold mt-5">{post.maillistName || 'Newsletter Title'}</h3>
              <p className="mt-2 text-[#808080]">{post.subtitle || 'Subtitle not available'}</p>
              <div className="flex items-center gap-2 mt-5">
                <img
                  src={post.writerImage || 'default-writer-image.jpg'}
                  alt={post.writersName || 'Unknown writer'}
                  className="w-10 h-10 object-cover rounded-full border"
                />
                <p className='text-md text-[#808080]'>{post.writersName || 'Writer Name'}</p>
              </div>
              <p className="mt-5 text-[#808080]">{post.summary || 'Content not available'}</p>
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
