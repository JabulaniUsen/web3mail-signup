import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Notification from '../Components/Notification';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Dummy data for testing
    const dummyPosts = [
      {
        id: 1,
        coverImage: 'path_to_cover_image_1.jpg',
        title: 'Exploring the Future of Web3',
        datePosted: 'Jan 1, 2024',
        summary: 'Discover the latest trends in Web3 technology...',
        writerImage: 'path_to_writer_image_1.jpg',
        writerName: 'John Doe',
        content: 'In recent years, the world of cryptocurrency has seen a remarkable surge...',
      },
      {
        id: 2,
        coverImage: 'path_to_cover_image_2.jpg',
        title: 'Blockchain Innovations',
        datePosted: 'Feb 15, 2024',
        summary: 'Learn about the newest innovations in blockchain...',
        writerImage: 'path_to_writer_image_2.jpg',
        writerName: 'Jane Smith',
        content: 'Blockchain innovations are revolutionizing industries...',
      },
      {
        id: 3,
        coverImage: 'path_to_cover_image_3.jpg',
        title: 'Crypto Adoption Trends',
        datePosted: 'Mar 10, 2024',
        summary: 'An in-depth look at the latest trends in crypto adoption...',
        writerImage: 'path_to_writer_image_3.jpg',
        writerName: 'Alice Johnson',
        content: 'Crypto adoption trends are on the rise...',
      },
      // Add more dummy posts as needed
    ];

    setTimeout(() => {
      const selectedPost = dummyPosts.find((p) => p.id === parseInt(postId));
      setPost(selectedPost);
      setLoading(false);
    }, 2000); // Simulate a 2-second loading time
  }, [postId]);

  return (
    <div className="lg:px-20 px-5 bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter h-[110vh]">
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
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[58rem] mt-10 m-auto">
        {loading ? (
          <div className="skeleton-wrapper">
            <Skeleton height={40} width={300} />
            <Skeleton count={3} />
            <div className="flex justify-between items-center mt-5">
              <Skeleton circle={true} height={50} width={50} />
              <Skeleton height={30} width={200} />
            </div>
            <Skeleton height={150} />
          </div>
        ) : (
          <div className="text-white">
            <h1 className='lg:text-3xl text-xl font-bold lg:w-[60%]'>{post.title}</h1>
            <p className='text-[#808080] my-5'>{post.summary}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5 text-[#808080] my-5">
                <div className="flex items-center gap-3">
                  <img src={post.writerImage} alt="" className='p-3 rounded-full border' />
                  <p>By {post.writerName}</p>
                </div>
                <p>Web3mail - <span>{post.datePosted}</span></p>
              </div>
              <button className='bg-[#B2C8FA] text-white rounded-2xl hover:shadow-xl transition-all hover:scale-[1.1] py-2 px-10'>Unsubscribe to Newsletter</button>
            </div>
            <div className="postBody mt-12">
              <p className='text-[#808080]'>{post.content}</p>
            </div>
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
  );
};

export default PostPage;
