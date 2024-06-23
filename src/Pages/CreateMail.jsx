import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import successImg from '../assets/success.svg';
import { useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import axiosInstance from '../config/axios';
import { ethers } from 'ethers';
import { web3mailABI } from '../utils/web3mail/contractABI';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { writeContract } from '@wagmi/core';
import { wagmiConfig } from '../config/wagmi';
import Button from '../Components/Button';
import { useAccount } from 'wagmi';
import baseHelper from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import Notification from '../Components/Notification';

const contractAddress = '0x3c4B67EbE31C492Bc4679F8e1a6A4b37B7D55b6B';
const baseBuyAmountInWei = 1200000000000000;

const CreateMail = () => {
  const { isConnected } = useAccount();
  const [years, setYears] = useState(1);
  const [email, setEmail] = useState('default@web3mail.club');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const location = useLocation();
  const { username } = location.state || {}; // Get the username from state
  const [amountInEth, setAmountInEth] = useState(0.0012);
  const [amountInWei, setAmountInWei] = useState(baseBuyAmountInWei);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [registerComplete, setRegisterComplete] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // close notification
  const handleCloseNotification = () => {
    setNotification(null);
  };

  const handlePaymentSuccess = async () => {
    setShowSuccessModal(true);

    // register user
    let registerFailCount = 0;
    let registerSuccess = false;

    while (!registerSuccess && registerFailCount < 3) {
      registerFailCount++;
      console.log('register fail count', registerFailCount);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('retrying register');
      const response = await axiosInstance.post('/register', formData);
      console.log('register response', response.data);

      if (!response.status === 200) {
        if (registerFailCount === 3) {
          setNotification({
            message:
              response?.data?.message ||
              'Error Creating Mail, Please reload the page and try again',
            type: 'error'
          });
        }
        return;
      }

      registerSuccess = true;
      setNotification({
        message: 'Mail created successfully',
        type: 'success'
      });

      setRegisterComplete(true);

      setTimeout(() => {
        navigate('/login');
        baseHelper.deleteFromLocalStorage('formData');
      }, 2000);
    }
  };

  useEffect(() => {
    // get form data from local storage
    const formDataFromLocalStorage = baseHelper.getFromLocalStorage('formData');

    // validate form data
    const requiredFormDataFields = [
      'firstName',
      'lastName',
      'email',
      'password',
      'gender'
    ];
    if (
      !formDataFromLocalStorage ||
      !requiredFormDataFields.every(
        (field) => formDataFromLocalStorage?.[field]
      )
    ) {
      navigate('/');
    }

    // update email with email from local storage
    if (formDataFromLocalStorage && formDataFromLocalStorage?.email) {
      setEmail(formDataFromLocalStorage.email);
      setFormData(formDataFromLocalStorage);
    }
  }, []);

  const handleBuy = async () => {
    setLoading(true);
    console.log({ email, years, amountInEth, amountInWei });
    try {
      const hash = await writeContract(wagmiConfig, {
        address: contractAddress,
        abi: web3mailABI,
        functionName: 'subscribe',
        args: ['jc', 1],
        value: amountInWei,
        overrides: {
          value: amountInWei
        }
      });

      //the below hash is for testing
      // const hash =
      //   '0xdae91d723c9583abf4f222d410c7800e492fa2fb95791c0974caca13404d6d96';

      if (!hash) {
        throw new Error('Error making payment');
      }

      if (hash) {
        try {
          console.log('confirming hash', hash);
          const confirmationRes = await waitForTransactionReceipt(wagmiConfig, {
            hash
          });
          console.log('confirmationRes', confirmationRes);

          if (confirmationRes?.status !== 'success') {
            throw new Error('Error confirming payment');
          }

          handlePaymentSuccess();
        } catch (error) {
          console.log('error', error);
          throw new Error(error);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log('error making payment', error);
      setNotification({
        message: error?.message || 'Error making payment',
        type: 'error'
      });
    }
  };

  const handleIncrement = () => {
    setYears((prevYears) => prevYears + 1);
  };

  const handleDecrement = () => {
    if (years > 1) {
      setYears((prevYears) => prevYears - 1);
    }
  };

  useEffect(() => {
    getAmountByEmailAndYear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [years]);

  const getAmountByEmailAndYear = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await axiosInstance.get(
        `/subscriptionAmount/${email}/${years}`
      );

      if (!res || !res?.data?.amount) {
        console.log('error getting amount', res);
        return;
      }

      const amountInWeiFromRes = res?.data?.amount;
      const ethValue = ethers.formatEther(amountInWei);

      setAmountInEth(ethValue);
      if (amountInWeiFromRes > baseBuyAmountInWei) {
        setAmountInWei(parseInt(amountInWeiFromRes));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#050122] lg:py-40 py-20 px-2 relative inter h-[120vh]">
      <div className="absolute top-10 right-10 z-20 float-end transition-all">
        <ConnectButton />
      </div>

      <img src={bg1} alt="" className="absolute top-0 right-0" />
      <img src={bg2} alt="" className="absolute bottom-0 left-0" />

      {!showSuccessModal && (
        <div className="bg-[#0c072c] lg:p-8 relative py-8 px-5 rounded-2xl w-full max-w-[35rem] border-[0.1px] border-[#453995]">
          <div className="mb-14">
            <img
              src={bg1}
              alt=""
              className="lg:block hidden absolute top-0 right-0 w-[200px]"
            />
            <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white">
              Create Mail Username
            </h2>
            <p className="text-sm text-white font-thin">{username}</p>
          </div>

          <div className="bg-[#161134] rounded-xl flex items-center justify-between p-5 relative">
            <button onClick={handleDecrement}>
              <FontAwesomeIcon
                icon={faMinus}
                className="py-3 px-3 rounded-full text-[#0c072c] font-bold bg-[#dddddd] active:bg-[#142c5f] active:text-[#fff]"
              />
            </button>
            <p className="text-white text-2xl font-semibold">
              <span>{years}</span> Year{years > 1 ? 's' : ''}
            </p>
            <button onClick={handleIncrement}>
              <FontAwesomeIcon
                icon={faPlus}
                className="py-3 px-3 rounded-full text-[#0c072c] font-bold bg-[#3C77FB] active:bg-[#142c5f] active:text-[#fff]"
              />
            </button>
          </div>

          <div className="amount flex items-center justify-center my-8">
            <p className="lg:text-3xl text-2xl text-white font-bold">
              {amountInEth} ETH
            </p>
          </div>

          {/* <button
            className={`text-[#ffff] bg-[#3C77FB] hover:bg-[#2b5ac0] active:bg-[#142c5f] rounded-3xl w-full p-5 text-xl ${
              loading && 'bg-[#5085f9] cursor-not-allowed'
            }`}
            disabled={loading}
            onClick={handleBuy}
          >
            {loading ? <div className="loader"></div> : 'Create Mail'}
          </button> */}

          <Button
            walletConnected={isConnected}
            onClick={handleBuy}
            disabled={loading}
          >
            {loading ? <div className="loader"></div> : 'Create Mail'}
          </Button>
        </div>
      )}

      {showSuccessModal && (
        <div className="p-12 rounded-2xl bg-white lg:w-[500px] w-[350px] flex flex-col justify-center items-center">
          <img src={successImg} alt="" className="lg:w-[330px] w-[200px]" />
          <p className="text-[#3C77FB] lg:text-2xl text-lg font-semibold text-center">
            {registerComplete ? (
              <div>
                Mail Created Successfully and it is Valid for{' '}
                <span>{years}</span>
                <span>{years < 2 ? 'year' : 'years'}</span>
              </div>
            ) : (
              <div>
                <div>
                  Payment Successful,
                  <br />
                  kindly wait while we create your mail
                </div>
                <div className="text-red-700 creating-mail">
                  Creating Mail...
                </div>
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
