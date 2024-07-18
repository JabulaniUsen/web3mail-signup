import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import Notification from '../Components/Notification';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import logo from '../assets/logo.svg';
import grid from '../assets/grid.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faSearch, faX } from '@fortawesome/free-solid-svg-icons';
import EmailChecker from '../Components/EmailChecker';
import ethLogo from '../assets/logos_ethereum.svg';
import avatar from '../assets/ava.png';

const NamesList = () => {
  const { address } = useAccount();
  const [notification, setNotification] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [expiryFilter, setExpiryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [nameList, setNameList] = useState([]);

  const registerSecret = "thisisgonnabetheextralayerofsecurity";

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const response = await axiosInstance.get(`/getAllMails/${address}`, {
          secret: registerSecret
        });
        console.log(response);
        setNameList(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error('Error fetching names:', error);
        setNotification({ type: 'error', message: 'Something went wrong. Try again later' });
      }
    };

    fetchNames();
  }, [address]);

  const handleClickName = (name) => {
    setSelectedName(name);
  };

  const handleCloseModal = () => {
    setSelectedName(null);
  };

  const filteredNames = nameList.filter((item) => {
    const matchesExpiry = expiryFilter ? item.expiryDate === parseInt(expiryFilter, 10) : true;
    const matchesSearch = item.firstName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesExpiry && matchesSearch;
  });

  const formatExpiryDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="lg:px-20 px-5 bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter">
      <img src={bg1} alt="" className="lg:block hidden absolute top-0 right-0" />
      <img src={bg2} alt="" className="lg:block absolute hidden bottom-0 left-0" />
      <div className="flex justify-between">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className="z-20 transition-all flex items-center gap-5">
            <Link to='/registered-names'>
              <div className="flex item-center gap-1 cursor-pointer">
                <img src={grid} alt="" />
                <p className='text-[#3C77FB] text-lg font-semibold'>My Names</p>
              </div>
            </Link>
            <ConnectButton />
          </div>
      </div>
      <div className="lg:w-[35rem] w-[90%] mt-10 m-auto">
        <EmailChecker formData={{}} registerSecret={registerSecret} />
      </div>
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full lg:w-[35rem] w-[90%] bg-[#0c072c] mt-5 m-auto border-[0.1px] border-[#453995]">
        <div className="top flex justify-between items-center flex-wrap gap-2">
          <div className="bg-[#110c30] px-3 py-2 rounded-lg">
            <select
              name=""
              id=""
              className="text-[#808080] outline-none w-[120px] bg-transparent"
              value={expiryFilter}
              onChange={(e) => setExpiryFilter(e.target.value)}
            >
              <option value="">Expiry Date</option>
              <option value="1752421332">1 year</option>
              <option value="1752421332">2 years</option>
              <option value="1752421332">3 years</option>
              <option value="1752421332">4 years</option>
              <option value="1752421332">5 years</option>
            </select>
          </div>
          <div className="bg-[#110c30] px-3 py-2 rounded-lg text-[#808080] flex items-center gap-2">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              className="w-[150px] bg-transparent outline-none"
              placeholder="Search for name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="names mt-10 flex flex-col cursor-pointer">
          {filteredNames.map((item, index) => (
            <div
              className="flex justify-between items-center py-4 border-t border-[#15131f]"
              key={index}
              onClick={() => handleClickName(item)}
            >
              <div className="flex items-start gap-2">
                <img src={avatar} alt="" />
                <div className="">
                  <p className="text-white">{item.firstName}</p>
                  <small className="text-[#808080]">Expires on {formatExpiryDate(item.expiryDate)}</small>
                </div>
              </div>
              <p className="text-[#3C77FB] bg-[#b2c8fa] rounded-full px-3 py-1 font-semibold">Owner</p>
            </div>
          ))}
        </div>
      </div>
      {selectedName && <NameDetailsModal name={selectedName} onClose={handleCloseModal} />}
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

const NameDetailsModal = ({ name, onClose }) => {
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const formattedAddress = `${name.walletAddress.slice(0, 5)}...${name.walletAddress.slice(-5)}`;

  const formatExpiryDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toISOString().split('T')[0];
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(name.walletAddress)
      .then(() => {
        setNotification({ message: 'Copied to clipboard', type: 'success' });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

const handleExtendSubscription = () => {
  navigate('/extend-subscription', {
    state: {
      username: name.email,
      years: parseInt(name.expiryDate, 10),
      name: name.firstName,
      id: name.id
    }
  });
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full lg:w-[40rem] w-[90%] bg-[#0c072c] m-auto border-[0.1px] border-[#453995] transform transition-transform duration-300 ">
        <div className="flex items-center justify-between">
          <p className='text-[#808080]'>Profile</p>
          <FontAwesomeIcon icon={faX} className='text-[#808080] hover:text-[#ffff] transition-all hover:scale-[1.2]' onClick={onClose} />
        </div>
        <div className="border-b border-[#15131f] py-5 mb-5">
          <div className="flex justify-between items-center flex-wrap">
            <div className="flex items-start gap-2">
              <img src={avatar} alt="" />
              <div className="">
                <p className="text-white">{name.email}</p>
                <small className="text-[#808080]">Expires on {formatExpiryDate(name.expiryDate)}</small>
              </div>
            </div>
            <button onClick={handleExtendSubscription} className="text-[#3C77FB] bg-[#b2c8fa] my-2 rounded-full px-3 py-1 font-semibold transition-all hover:text-blue-700 hover:shadow-xl lg:text-base text-xs">Extend Subscription</button>
          </div>
          <div onClick={copyToClipboard} className="flex items-center cursor-pointer gap-2 px-4 py-1 mt-1 lg:text-sm text-xs rounded-lg bg-[#151034] w-[175px] text-[#808080] hover:text-[#ffff] transition-all">
            <img src={ethLogo} alt="" />
            <p style={{ cursor: 'pointer' }}>{formattedAddress}</p>
            <FontAwesomeIcon icon={faCopy} />
          </div>
        </div>
        <p className='text-[#808080]'>Ownership</p>
        <div className="flex justify-between items-center flex-wrap">
          <p className='px-4 py-2 text-xs rounded-lg bg-[#151034] text-[#808080]'>owner: <span className='text-[#fff]'>{formattedAddress}</span></p>
          <p className='px-4 py-2 text-xs rounded-lg bg-[#151034] text-[#808080]'>Created On: <span className='text-[#fff]'>{new Date(name.createdAt).toISOString().split('T')[0]}</span></p>
          <p className='px-4 py-2 text-xs rounded-lg bg-[#151034] text-[#808080]'>Expiry: <span className='text-[#fff]'>{formatExpiryDate(name.expiryDate)}</span></p>
        </div>
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

export default NamesList;
