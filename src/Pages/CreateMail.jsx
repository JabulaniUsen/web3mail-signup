import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import successImg from '../assets/success.svg';
import { Link, useLocation } from 'react-router-dom';
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
import logo from '../assets/logo.svg';
import grid from '../assets/grid.svg';
import Notification from '../Components/Notification';

const contractAddress = '0x70DE5b654834f10d06d4442E08f76b6f08974443';
const baseBuyAmountInWei = 1100000000000000;

const CreateMail = () => {
  const { isConnected, address } = useAccount();
  const [years, setYears] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const location = useLocation();
  const { username } = location.state || {};
  const [amountInEth, setAmountInEth] = useState(0.0011);
  const [amountInWei, setAmountInWei] = useState(baseBuyAmountInWei);
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

    console.log(formData);

    if (!registerSuccess && registerFailCount < 3) {
      registerFailCount++;
      console.log('register fail count', registerFailCount);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("connected address: ", address);
      console.log('retrying register');
      console.log(formData);
      const response = await axiosInstance.post('/register', {
        ...formData,
        walletAddress: address,
        registerSecret: "thisisgonnabetheextralayerofsecurity"
      });
      console.log('register response', response.data);

      if (response.status !== 200) {
        console.log('Registration failed:', response);
        if (registerFailCount === 3) {
          setNotification({
            message:
              response?.data?.message ||
              'Error Creating Mail, Please reload the page and try again',
            type: 'error'
          });
        }
        }
        registerSuccess = true;
        setNotification({
          message: 'Mail created successfully',
          type: 'success'
        });
        
        setRegisterComplete(true);
        
        setTimeout(() => {
          window.location.href = 'https://box.web3mail.club/mail/';
          baseHelper.deleteFromLocalStorage('formData');
        }, 2000);
        }
        };
        
        useEffect(() => {
          // get form data from local storage
          const formDataFromLocalStorage = baseHelper.getFromLocalStorage('formData');
          console.log('form data local', formDataFromLocalStorage);
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
            // navigate('/');
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
              args: [email, years],
              value: amountInWei,
              overrides: {
                value: amountInWei
              }
            });
        
            // the below hash is for testing
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
            console.log(error.message);
            console.log(error);
            // console.log('error making payment', error);
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
            console.log('Email and year:', email, years);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const res = await axiosInstance.get(
              `/subscriptionAmount/${email}/${years}`
            );
            console.log(res.data.amount);
            if (!res || !res?.data?.amount) {
              console.log('error getting amount', res);
              return;
            }
        
            const amountInWeiFromRes = res?.data?.amount;
            const ethValue = ethers.formatEther(amountInWeiFromRes);
        
            setAmountInEth(ethValue);
            if (amountInWeiFromRes > baseBuyAmountInWei) {
              setAmountInWei(parseInt(amountInWeiFromRes));
            }
          } catch (error) {
            // console.log('error', error);
          }
        };
        
        return (
          <div className='bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter '>
            <div className='flex justify-between px-20 lg:mb-20 mb-10'>
              <div className='logo'>
                <img src={logo} alt='' />
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
        
                <Button walletConnected={isConnected} onClick={handleBuy} disabled={loading}>
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
                        This may take sometime. Don't refresh...
                      </div>
                      <div className='text-red-700 creating-mail'>Creating Mail... This may take sometime. Don't refresh.</div>
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
        