import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import successImg from '../assets/success.svg';
import { useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const CreateMail = () => {
  const [years, setYears] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successPop, setSuccessPop] = useState(false);
  const location = useLocation();
  const { username } = location.state || {}; // Get the username from state

  const handleIncrement = () => {
    setYears(prevYears => prevYears + 1);
  };

  const handleDecrement = () => {
    if (years > 1) {
      setYears(prevYears => prevYears - 1);
    }
  };

  const handleSuccess = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessPop(true);
    }, 3000);
  };

  return (
      <div className="flex items-center justify-center bg-[#050122] lg:py-40 py-20 px-2 relative inter h-[120vh]">
        {/*<button*/}
        {/*    className='absolute top-10 right-10 z-20 p-2 px-8 bg-blue-500 float-end text-white rounded-full hover:bg-blue-800 transition-all text-lg'>*/}
        {/*  Connect Wallet*/}
        {/*</button>*/}

        <div className="absolute top-10 right-10 z-20 float-end transition-all">
          <ConnectButton  />
        </div>

        <img src={bg1} alt="" className="absolute top-0 right-0"/>
        <img src={bg2} alt="" className="absolute bottom-0 left-0"/>

        {!successPop && (
            <div
                className="bg-[#0c072c] lg:p-8 relative py-8 px-5 rounded-2xl w-full max-w-[35rem] border-[0.1px] border-[#453995]">
              <div className="mb-14">
                <img src={bg1} alt="" className="lg:block hidden absolute top-0 right-0 w-[200px]"/>
                <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white">Create Mail Username</h2>
                <p className="text-sm text-white font-thin">{username}</p>
              </div>

              <div className="bg-[#161134] rounded-xl flex items-center justify-between p-5 relative">
                <button onClick={handleDecrement}>
                  <FontAwesomeIcon icon={faMinus}
                                   className='py-3 px-3 rounded-full text-[#0c072c] font-bold bg-[#dddddd] active:bg-[#142c5f] active:text-[#fff]'/>
                </button>
                <p className='text-white text-2xl font-semibold'><span>{years}</span> Year{years > 1 ? 's' : ''}</p>
                <button onClick={handleIncrement}>
                  <FontAwesomeIcon icon={faPlus}
                                   className='py-3 px-3 rounded-full text-[#0c072c] font-bold bg-[#3C77FB] active:bg-[#142c5f] active:text-[#fff]'/>
                </button>
              </div>

              <div className="amount flex items-center justify-center my-8">
                <p className='lg:text-3xl text-2xl text-white font-bold'>0.001 ETH</p>
              </div>

              <button
                  className='text-[#ffff] bg-[#3C77FB] hover:bg-[#2b5ac0] active:bg-[#142c5f] rounded-3xl w-full p-5 text-xl'
                  onClick={handleSuccess}>
                {loading ? (
                    <div className="loader"></div>
                ) : (
                    'Create Mail'
                )}
              </button>
            </div>
        )}


        {successPop && (
            <div className="p-12 rounded-2xl bg-white lg:w-[500px] w-[350px] flex flex-col justify-center items-center">
              <img src={successImg} alt="" className='lg:w-[330px] w-[200px]'/>
              <p className='text-[#3C77FB] lg:text-2xl text-lg font-semibold text-center'>
                Mail Created Successfully and it's Valid for <span>{years}</span>
                <span>{years < 2 ? 'year' : 'years'}</span>
              </p>
            </div>
        )}
      </div>
  );
};

export default CreateMail;
