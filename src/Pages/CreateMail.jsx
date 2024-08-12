import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import successImg from '../assets/success.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../Components/Button';
import Notification from '../Components/Notification';

const CreateMail = ({ setRegisterComplete, registerComplete }) => {
  const [years, setYears] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};
  const [amountInEth, setAmountInEth] = useState(0.0011);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Close notification
  const handleCloseNotification = () => {
    setNotification(null);
  };

  // Simulate payment success after 5 seconds
  const handlePaymentSuccess = () => {
    setShowSuccessModal(true);

    setTimeout(() => {
      setRegisterComplete(true);
      setNotification({
        message: 'Mail created successfully',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/');
        // Simulate clearing local storage (or perform necessary cleanup)
      }, 2000);
    }, 5000); // 5 seconds delay
  };

  useEffect(() => {
    // Simulate getting form data from local storage
    const formDataFromLocalStorage = {
      firstName: 'John',
      lastName: 'Doe',
      gender: 'Male',
      email: 'johndoe@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };
    setEmail(formDataFromLocalStorage.email);
    setFormData(formDataFromLocalStorage);
  }, []);

  const handleBuy = () => {
    setLoading(true);
    console.log({ email, years, amountInEth });
    
    setTimeout(() => {
      setLoading(false);
      handlePaymentSuccess();
    }, 5000); // Simulate a delay for the payment process
  };

  const handleIncrement = () => {
    setYears((prevYears) => prevYears + 1);
  };

  const handleDecrement = () => {
    if (years > 1) {
      setYears((prevYears) => prevYears - 1);
    }
  };

  return (
    <div className='bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter '>
      <img src={bg1} alt='' className='absolute top-0 right-0' />
      <img src={bg2} alt='' className='absolute bottom-0 left-0' />

      {!showSuccessModal && (
        <div className='bg-[#0c072c] m-auto lg:p-8 py-8 px-5 relative rounded-2xl w-full max-w-[35rem] border-[0.1px] border-[#453995]'>
          <div className='mb-14'>
            <img
              src={bg1}
              alt=''
              className='lg:block hidden absolute top-0 right-0 w-[200px]'
            />
            <h2 className='lg:text-3xl text-2xl font-bold mb-2 text-white'>
              Create Mail Username
            </h2>
            <p className='text-sm text-white font-thin'>{username}</p>
          </div>

          <div className='bg-[#161134] rounded-xl flex items-center justify-between p-5 relative'>
            <button onClick={handleDecrement}>
              <FontAwesomeIcon
                icon={faMinus}
                className='py-3 px-3 rounded-full text-[#0c072c] font-bold bg-[#dddddd] active:bg-[#142c5f] active:text-[#fff]'
              />
            </button>
            <p className='text-white text-2xl font-semibold'>
              <span>{years}</span> Year{years > 1 ? 's' : ''}
            </p>
            <button onClick={handleIncrement}>
              <FontAwesomeIcon
                icon={faPlus}
                className='py-3 px-3 rounded-full text-[#0c072c] font-bold bg-[#3C77FB] active:bg-[#142c5f] active:text-[#fff]'
              />
            </button>
          </div>

          <div className='amount flex items-center justify-center my-8'>
            <p className='lg:text-3xl text-2xl text-white font-bold'>
              {amountInEth} ETH
            </p>
          </div>

          <Button onClick={handleBuy} disabled={loading}>
            {loading ? <div className='loader'></div> : 'Create Mail'}
          </Button>
        </div>
      )}

      {showSuccessModal && (
        <div className='p-12 m-auto rounded-2xl bg-white lg:w-[400px] w-[350px] flex flex-col justify-center items-center'>
          <img src={successImg} alt='' className='lg:w-[200px] w-[180px]' />
          <p className='text-[#3C77FB] text-lg font-semibold text-center'>
            {registerComplete ? (
              <div>
                Mail Created Successfully and it is Valid for <span> {years}</span>
                <span> {years < 2 ? 'year' : 'years'}</span>
              </div>
            ) : (
              <div>
                <div>
                  Payment Successful,
                  <br />
                </div>
                <div className='text-red-700 creating-mail text-sm'>Creating Mail... <br /> This may take some time. Don't refresh.</div>
              </div>
            )}
          </p>
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
  );
};

export default CreateMail;
