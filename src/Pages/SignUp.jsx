import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Notification from '../Components/Notification';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import logo from '../assets/logo.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Button from '../Components/Button';
import grid from '../assets/grid.svg'

const SignUp = () => {
  const { isConnected } = useAccount();
  const location = useLocation();
  const initialFormData = location.state?.formData || {};
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    password: '',
    confirmPassword: '',
    ...initialFormData,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [pwError, setPwError] = useState(false);
  const [pwLength, setPwLength] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    formData.password < 8 ? setPwLength(true) : setPwLength(false)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.gender || !formData.password || !formData.confirmPassword) {
      setNotification({ message: 'All fields are required!', type: 'error' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setNotification({ message: 'Passwords do not match!', type: 'error' });
      return;
    }

    if (pwError) {
      setNotification({ message: 'Password must be at least 8 characters', type: 'error' });
      return;
    }

    // Exclude confirmPassword before navigating
    const { confirmPassword, ...dataToSend } = formData;

    console.log('Navigating to /create-mail with formData:', dataToSend);
    navigate('/create-mail', { state: { formData: dataToSend } });
  };


  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };



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
      <div className="flex justify-between">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <Link to='/registered-names'>
          <div className="z-20 transition-all flex items-center gap-5 relative">
            <div className="flex item-center gap-1 cursor-pointer">
              <img src={grid} alt="" />
              <p className='text-[#3C77FB] text-lg font-semibold'>My Names</p>
            </div>
            <ConnectButton />
          </div>
        </Link>
      </div>
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[35rem] bg-[#0c072c] mt-10 m-auto border-[0.1px] border-[#453995]">
        <div className="mb-14">
          <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white ">
            {formData.username}@web3mail.club
          </h2>
          <p className="text-sm text-white font-thin ">
          Glad to have you on board! Complete this process by inputing  the following details below
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium my-2 text-white">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="outline-none bg-transparent w-full"
              required
            >
              <option className='bg-black' value="">Select Gender</option>
              <option className='bg-black' value="male">Male</option>
              <option className='bg-black' value="female">Female</option>
              <option className='bg-black' value="other">Other</option>
            </select>

            </div>
          </div>
          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white outline-none"
                required
              />
              <span
                className="absolute inset-y-0 right-2 text-white pr-3 flex items-center cursor-pointer"
                onClick={handlePasswordToggle}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
              {pwLength && <p className='text-red-600 ml-2'>Password must be up to 8 characters</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white outline-none ${
                  pwError ? 'border-2 border-red-500' : ''
                }`}
                required
              />
              <span
                className="absolute inset-y-0 right-2 text-white pr-3 flex items-center cursor-pointer"
                onClick={handlePasswordToggle}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            {pwError && (
              <p className="text-red-500 text-sm">Passwords do not match!</p>
            )}
          </div>
          <div className="flex gap-10 items-center justify-between">
            <Button walletConnected={isConnected} onClick={handleSubmit}>
              {loading ? <div className="loader"></div> : 'Next'}
            </Button>
          </div>
        </form>
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

export default SignUp;
