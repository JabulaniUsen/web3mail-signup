import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import Navbar from '../Components/Navbar';

// Mock data to replace the API response
const mockData = [
  {
    _id: '1',
    firstName: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: new Date().toISOString(),
    expiryDate: new Date().getTime() / 1000 + 365 * 24 * 60 * 60, // 1 year from now
    walletAddress: '0x123456789abcdef123456789abcdef123456789a',
  },
  {
    _id: '2',
    firstName: 'Jane Smith',
    email: 'jane.smith@example.com',
    createdAt: new Date().toISOString(),
    expiryDate: new Date().getTime() / 1000 + 2 * 365 * 24 * 60 * 60, // 2 years from now
    walletAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdef',
  },
];

const NamesList = () => {
  const { address } = useAccount();
  const [notification, setNotification] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [expiryFilter, setExpiryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [nameList, setNameList] = useState([]);

  const registerSecret = "thisisgonnabetheextralayerofsecurity";

  const stripEmailDomain = (email) => {
    return email.split('@')[0];
  };

  useEffect(() => {
    // Mocked fetch function to replace API call
    const fetchNames = () => {
      try {
        const filteredData = mockData.filter(item => {
          const yearsBetween = calculateYearsBetweenDates(item.createdAt, item.expiryDate);
          localStorage.setItem(item._id, yearsBetween); // Store the years in local storage
          return expiryFilter ? yearsBetween === parseInt(expiryFilter) : true;
        });

        const processedNames = filteredData.map(item => ({
          ...item,
          email: stripEmailDomain(item.email),
        }));

        setNameList(processedNames);
      } catch (error) {
        console.error('Error fetching names:', error);
        setNotification({ type: 'error', message: 'Failed to fetch names' });
      }
    };

    fetchNames();
  }, [expiryFilter]);

  const calculateYearsBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate * 1000);
    const years = end.getFullYear() - start.getFullYear();
    return years;
  };

  const handleClickName = (name) => {
    setSelectedName(name);
  };

  const handleCloseModal = () => {
    setSelectedName(null);
  };

  const filteredNames = nameList.filter((item) => {
    const matchesSearch = item.firstName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatExpiryDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="lg:px-20 px-5 bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter min-h-[100vh]">
      <img src={bg1} alt="" className="lg:block hidden absolute top-0 right-0" />
      <img src={bg2} alt="" className="lg:block absolute hidden bottom-0 left-0" />
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
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4 years</option>
              <option value="5">5 years</option>
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
  const walletAddress = name.walletAddress || '';
  const formattedAddress = walletAddress ? `${walletAddress.slice(0, 5)}...${walletAddress.slice(-5)}` : 'N/A';

  const formatExpiryDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toISOString().split('T')[0];
  };

  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
        .then(() => {
          setNotification({ message: 'Copied to clipboard', type: 'success' });
        })
        .catch((err) => {
          console.error('Failed to copy: ', err);
        });
    } else {
      setNotification({ message: 'No wallet address to copy', type: 'error' });
    }
  };

  const handleExtendSubscription = () => {
    navigate('/extend-subscription', {
      state: {
        username: name.email,
        years: parseInt(name.expiryDate, 10),
        name: name.firstName,
        id: name._id
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
