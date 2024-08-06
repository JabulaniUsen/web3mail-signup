import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Notification from '../Components/Notification';
import Navbar from '../Components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faX } from '@fortawesome/free-solid-svg-icons';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import axiosInstance from '../config/axios';
import { format } from 'date-fns';
import user1 from '../assets/user1.png'
import user2 from '../assets/user2.png'
import user3 from '../assets/user3.png'

const AvailiableNewsletters = () => {
  const { isConnected } = useAccount();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchField, setSearchField] = useState('');
  const navigate = useNavigate();

  const writerImages = [
    user1,
    user2,
    user3,
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/getAllNewsletters');
        const formattedPosts = response.data.map(post => ({
          ...post,
          date: format(new Date(post.date), 'MMMM dd, yyyy h:mm a'),
          writersImage: writerImages[Math.floor(Math.random() * writerImages.length)] // Assign a random image
        }));
        setPosts(formattedPosts);
        console.log('Fetched Posts:', formattedPosts); // Log fetched posts
        formattedPosts.forEach(post => console.log('Post ID:', post._id));
      } catch (error) {
        console.error(error);
        setNotification({ message: 'Error fetching newsletters', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePostClick = (id) => {
    console.log('Navigating to post with ID:', id);
    if (id) {
      navigate(`/post/${id}`); 
    } else {
      console.error('Invalid id:', id);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.maillistName.toLowerCase().includes(searchField.toLowerCase()) ||
    post.summary.toLowerCase().includes(searchField.toLowerCase())
  );

  return (
    <div className="lg:px-20 px-5 bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter">
      <img
        src={bg1}
        alt=""
        className="lg:block hidden absolute top-0 right-0"
      />
      <img
        src={bg2}
        alt=""
        className="lg:block absolute hidden bottom-0 left-0"
      />
      <Navbar />
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full mt-10 m-auto">
        <div className="mb-14 max-w-[35rem] m-auto">
          <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white text-center">
            Web3mail Newsletter
          </h2>
          <p className="text-sm text-white font-thin text-center">
            Join a community of over 10,000 creators, operators, and investors as they explore the cutting edge of consumer crypto and the future of the internet.
          </p>
        </div>
        <form className="space-y-4 max-w-[35rem] m-auto">
          <div>
            <div className="relative">
              <div
                className="flex justify-center gap-3 items-center p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white border-2 border-[#3c77fb]">
                <FontAwesomeIcon icon={faSearch} className='text-gray-400' />
                <input
                  type="text"
                  name="searchField"
                  placeholder="Search posts..."
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="w-full outline-none bg-transparent"
                />
                <FontAwesomeIcon icon={faX} className='text-gray-400 mr-2 cursor-pointer hover:text-white hover:scale-[1.2] transition-all' onClick={() => setSearchField('')} />
              </div>
            </div>
          </div>
        </form>
        <div className="lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[68rem] mt-10 m-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {Array(6).fill().map((_, index) => (
                <div key={index} className="skeleton-wrapper bg-[#0c072c] rounded-xl text-white transition-all hover:shadow-xl hover:bg-[#221b50] ">
                  <Skeleton height={160} className="w-full object-cover rounded-t-lg" />
                  <div className="p-3">
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={20} width="60%" className="mt-2" />
                    <Skeleton height={15} width="40%" className="mt-2" />
                    <div className="flex items-center gap-1 mt-5">
                      <Skeleton circle height={20} width={20} />
                      <Skeleton height={15} width="30%" />
                    </div>
                    <Skeleton height={30} width="100%" className="mt-5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {filteredPosts.map((post, index) => (
                <div
                  key={index}
                  className="bg-[#0c072c] rounded-xl text-white transition-all hover:shadow-xl hover:bg-[#221b50] cursor-pointer border border-[#453995]"
                  onClick={() => handlePostClick(post._id)}
                >
                  <div className="relative">
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-t-lg">
                      <p className="text-center text-white relative">Click to view more details</p>
                    </div>
                  </div>
                  <div className="p-3 flex flex-col justify-between">
                    <div>
                      <p className="text-[#808080] text-xs">Web3Mail - {post.date}</p>
                      <h3 className="text-xl font-semibold mt-5">{post.maillistName}</h3>
                      <p className="mt-2 text-[#808080]">{post.subtitle}</p>
                      <div className="flex items-center gap-1 mt-5">
                        <img
                          src={post.writersImage}
                          alt={post.writersName || 'Unknown writer'}
                          className="w-10 h-10 p-1 object-cover rounded-full border"
                        />
                        <p className="text-xs text-[#808080]">{post.writersName}</p>
                      </div>
                    </div>
                    <button className="py-2 bg-[#3C77FB] text-white mt-5 rounded-3xl w-full mb-1 hover:bg-blue-700">Subscribe to Newsletter</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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

export default AvailiableNewsletters;
