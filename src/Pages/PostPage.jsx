import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import axiosInstance from '../config/axios';
import Notification from '../Components/Notification';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import baseHelper from '../utils/helper';
import logo from '../assets/logo.svg';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import grid from '../assets/grid.svg';
import Navbar from '../Components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const PostPage = () => {
  const { isConnected } = useAccount();
  const [username, setUsername] = useState('');
  const [usernameAvailability, setUsernameAvailability] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
 
  return (
    <div className="lg:px-20 px-5 bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter ">
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
      <Navbar/>
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[58rem] mt-10 m-auto">
        <div className=" text-white">
            <h1 className='lg:text-3xl text-xl font-bold lg:w-[60%]'>Bringing the Consumer to Cryto: The story of ExCoin</h1>
            <p className='text-[#808080] my-5'>In recent years, the world of cryptocurrency has seen a remarkable surge in interest and innovation. Yet, for many consumers, the complexity....</p>
        </div>

        <div className="flex justify-between items-center">
            <div className="flex items-center gap-5 text-[#808080] my-5">
                <div className="flex items-center gap-3">
                    <img src="" alt="" className='p-3 rounded-full border' />
                    <p>By Donald Dons</p>
                </div>
                <p>Web3mail - <span>Sep 18, 2023</span></p>
            </div>

            <button className='bg-[#B2C8FA] text-white rounded-2xl hover:shadow-xl transition-all hover:scale-[1.1] py-2 px-10'>Unsubscribe to Newsletter</button>
        </div>

        <div className="postBody mt-12">
            <p className='text-[#808080]'>
                In recent years, the world of cryptocurrency has seen a remarkable 
                surge in interest and innovation. Yet, for many consumers, the 
                complexity and technical jargon surrounding digital currencies 
                have been a barrier to entry. ExCoin emerged with a mission to 
                change that narrative, making cryptocurrency accessible and 
                user-friendly for everyone.
            </p>

            <img src="" alt="" />

            <p className='text-[#808080] mt-12'>
                Founded by a team of visionary tech enthusiasts, ExCoin was born out 
                of the belief that the benefits of blockchain technology should be 
                available to all, not just tech-savvy investors. The company's primary 
                goal was to create a platform that simplifies the process of buying, 
                selling, and using cryptocurrencies. By focusing on user experience 
                and education, ExCoin has become a gateway for newcomers to enter 
                the world of digital assets.
            </p>
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default PostPage;
