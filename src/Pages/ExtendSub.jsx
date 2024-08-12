import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import bg2 from '../assets/leftdown.svg';
import bg1 from '../assets/topright.svg';
import ConfirmExtend from './ConfirmExtend';
import Notification from '../Components/Notification';
import Navbar from '../Components/Navbar';

const ExtendSub = () => {
  const [years, setYears] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmExt, setConfirmExt] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { username, name, id, years: initialYears } = location.state || {};
  const [amountInEth, setAmountInEth] = useState(0.0011); // Hardcoded ETH value
  const [notification, setNotification] = useState(null);
  const [extSubs, setExtSubs] = useState(true);

  useEffect(() => {
    // Example: Adjust the amount based on the number of years
    setAmountInEth((prevAmount) => (0.0011 * years).toFixed(4));
  }, [years]);

  const handleIncrement = () => {
    setYears((prevYears) => prevYears + 1);
  };

  const handleDecrement = () => {
    if (years > 1) {
      setYears((prevYears) => prevYears - 1);
    }
  };

  const handleExtend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccessModal(true);
      setNotification({
        message: 'Subscription extended successfully',
        type: 'success'
      });
      setTimeout(() => {
        navigate('/registered-names');
      }, 2000);
    }, 1500); // Simulate processing time
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const goBack = () => {
    setConfirmExt(false);
    setExtSubs(true);
  }

  return (
    <>
      <div className='lg:px-20 px-5 bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter'>
        <img src={bg1} alt="" className="absolute top-0 right-0" />
        <img src={bg2} alt="" className="absolute bottom-0 left-0" />

        {extSubs && 
          <div className="bg-[#0c072c] m-auto mt-40 relative py-8 rounded-lg w-full max-w-[35rem] border-[0.1px] border-[#453995]">
          <div className="px-5 border-b border-[#453995]">
            <div className="mb-14">
              <img src={bg1} alt="" className="lg:block hidden absolute top-0 right-0 w-[200px]" />
              <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white text-center">
                Extend Subscription
              </h2>
            </div>

            <div className="bg-[#161134] rounded-lg flex items-center justify-between p-5 relative">
              <button onClick={handleDecrement}>
                <FontAwesomeIcon
                  icon={faMinus}
                  className="py-3 px-3 rounded-full text-[#0c072c] font-bold bg-[#dddddd] active:bg-[#142c5f] active:text-[#fff]"
                />
              </button>
              <p className="text-[#3C77FB] text-2xl font-semibold">
                <span>{years}</span> Year{years > 1 ? 's' : ''}
              </p>
              <button onClick={handleIncrement}>
                <FontAwesomeIcon
                  icon={faPlus}
                  className="py-3 px-3 rounded-full text-[#0c072c] font-bold bg-[#3C77FB] active:bg-[#142c5f] active:text-[#fff]"
                />
              </button>
            </div>
            <p className='text-white text-center text-sm my-5'>
              <span>{years}</span> Year{years > 1 ? 's' : ''} extension for {username}
            </p>
          </div>

          <div className="px-5">
            <div className="px-1">
              <div className="flex items-center justify-between relative">
                <p className='text-white flex items-center my-3 gap-2'>
                  <FontAwesomeIcon icon={faGasPump} />
                  9.96 Gwei
                </p>
              </div>
            </div>
            <div className="bg-[#161134] rounded-lg flex items-center justify-between px-7 relative py-2">
              <p className='text-white'>
                <span>{years}</span> Year{years > 1 ? 's' : ''} extension
              </p>
              <div className="amount flex items-center justify-center my-2">
                <p className="text-white ">
                  {amountInEth} ETH
                </p>
              </div>
            </div>
            <div className="flex gap-10 items-center justify-between">
              <button
                className='w-full py-3 mt-6 text-lg font-semibold bg-white rounded-xl hover:text-white transition-all hover:bg-blue-900 text-[#3C77FB]'
                onClick={() => navigate('/registered-names')}
              >
                Back
              </button>
              <button
                className='w-full py-3 mt-6 text-lg font-semibold text-white bg-blue-500 rounded-xl transition-all hover:bg-blue-900 bg-[#3C77FB]'
                onClick={() => setConfirmExt(true) || setExtSubs(false)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Extend'}
              </button>
            </div>
          </div>
        </div>
        }

        {confirmExt && <ConfirmExtend name={name} id={id} username={username} years={years} amountInEth={amountInEth} onConfirm={handleExtend} goBack={goBack} loading={loading} />}
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full transform transition-transform duration-300">
              <h2 className="text-xl font-bold mb-4">Success</h2>
              <p>Your subscription for {username} has been extended successfully!</p>
              <button
                className="mt-5 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                onClick={() => navigate('/registered-names')}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={handleCloseNotification}
          />
        )}
      </div>
    </>
  );
};

export default ExtendSub;
