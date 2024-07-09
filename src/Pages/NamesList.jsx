import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../Components/Notification';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import logo from '../assets/logo.svg';
import grid from '../assets/grid.svg';
import ava from '../assets/ava.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const NamesList = () => {
  const [notification, setNotification] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [expiryFilter, setExpiryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const nameList = [
    {
      avater: ava,
      name: 'Jabulani@web3mail.club',
      expiresIn: '1',
      address: '0x58492742983792749839810634',
      createdOn: 'September 25, 2024',
      expiry: 'September 25, 2025',
    },
    {
      avater: ava,
      name: 'Louis@web3mail.club',
      expiresIn: '2',
      address: '0x5455354653353483310634',
      createdOn: 'September 14, 2024',
      expiry: 'September 14, 2026',
    },
  ];

  const handleClickName = (name) => {
    setSelectedName(name);
  };

  const handleCloseModal = () => {
    setSelectedName(null);
  };

  const filteredNames = nameList.filter((item) => {
    const matchesExpiry = expiryFilter
      ? item.expiresIn === expiryFilter
      : true;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesExpiry && matchesSearch;
  });

  return (
    <div className="lg:px-20 px-5 bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter h-[100vh]">
      <img src={bg1} alt="" className="lg:block hidden absolute top-0 right-0" />
      <img src={bg2} alt="" className="lg:block absolute hidden bottom-0 left-0" />
      <div className="flex justify-between">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className="z-20 transition-all flex items-center gap-5">
          <div className="flex item-center gap-1 cursor-pointer">
            <img src={grid} alt="" />
            <p className="text-[#3C77FB] text-lg font-semibold">My Names</p>
          </div>
          <ConnectButton />
        </div>
      </div>
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[35rem] bg-[#0c072c] mt-10 m-auto border-[0.1px] border-[#453995]">
        <div className="top flex justify-between items-center">
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
              <>
                <div className="flex items-start gap-2">
                  <img src={item.avater} alt="" />
                  <div className="">
                    <p className="text-white">{item.name}</p>
                    <small className="text-[#808080]">Expires in {item.expiresIn} year</small>
                  </div>
                </div>
              </>
              <>
                <p className="text-[#3C77FB] bg-[#b2c8fa] rounded-full px-3 py-1 font-semibold">Owner</p>
              </>
            </div>
          ))}
        </div>
      </div>
      {selectedName && <NameDetailsModal name={selectedName} onClose={handleCloseModal} />}
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

const NameDetailsModal = ({ name, onClose }) => {
  const navigate = useNavigate();
  const formattedAddress = `${name.address.slice(0, 5)}...${name.address.slice(-5)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address)
      .then(() => {
        alert('Address copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };


  const handleExtendSubscription = () => {
    navigate('/extend-subscription', { state: { username: name.name } });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[36rem] bg-[#0c072c]  m-auto border-[0.1px] border-[#453995] transform transition-transform duration-300">
      <div
          className="flex justify-between items-center py-4 border-b border-[#15131f]"
      >
        <>
          <div className="flex items-start gap-2">
            <img src={name.avater} alt="" />
            <div className="">
              <p className="text-white">{name.name}</p>
              <small className="text-[#808080]">Expires in {name.expiresIn} year</small>
            </div>
          </div>
        </>
        <>
          <p className="text-[#3C77FB] bg-[#b2c8fa] rounded-full px-3 py-1 font-semibold">Owner</p>
        </>
      </div>
      <p 
        className='text-[#808080] px-3 py-1 rounded-lg bg-[#151034] w-[200px]' 
        onClick={copyToClipboard}
        style={{ cursor: 'pointer' }}
        >
        {formattedAddress}
      </p>
        
        <div className="">
            <p className='text-white'>Created On:{name.createdOn}</p>
            <p className='text-white'>Expiry Date:{name.expiry}</p>
        </div>
        <button
          className="mt-5 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="mt-5 ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200"
          onClick={handleExtendSubscription}
        >
          Extend Subscription
        </button>
      </div>
    </div>
  );
};

export default NamesList;
