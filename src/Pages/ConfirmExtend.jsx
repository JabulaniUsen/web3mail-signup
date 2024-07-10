import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGasPump, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import bg2 from '../assets/leftdown.svg';
import bg1 from '../assets/topright.svg';
import wallet from '../assets/wallet.svg';
import avatar from '../assets/ava.png';

const ConfirmExtend = () => {

  return (
    
      <div className="bg-[#0c072c] m-auto mt-40 relative py-8 rounded-lg w-full max-w-[35rem] border-[0.1px] border-[#453995]">
        <img src={bg1} alt="" className="lg:block hidden absolute top-0 right-0 w-[200px]" />
        <div className="text-[#3C77FB] flex items-center gap-2 mx-7 mb-2">
            <FontAwesomeIcon icon={faArrowLeft} />
            <p className='font-semibold'>Back</p>
        </div>
        <div className="flex justify-center items-center flex-col gap-4">
            <h2 className='text-white font-semibold text-2xl'>Confirm Details</h2>
            <img src={wallet} alt="" />
            <p className='text-white'>Double check these details before confirming in your wallet</p>
        </div>

        <div className=" mt-5 mx-5 flex flex-col gap-2 justify-between items-center">
            <div className="flex justify-between items-center bg-[#161134] py-4 px-6 rounded-xl w-full">
                <p className='text-[#808080]'>Name</p>
                <div className="flex items-center gap-2">
                    <p className='text-white font-semibold'>Jabulaniusen@web3mail.club</p>
                    <img src={avatar} alt="" />
                </div>
            </div>
            <div className="flex justify-between items-center bg-[#161134] py-4 px-6 rounded-xl w-full">
                <p className='text-[#808080]'>Action</p>
                <p className='text-white font-semibold'>Extended registration</p>
            </div>
            <div className="flex justify-between items-center bg-[#161134] py-4 px-6 rounded-xl w-full">
                <p className='text-[#808080]'>Duration</p>
                <p className='text-white font-semibold'>1 year</p>
            </div>
            <div className="flex justify-between items-center bg-[#161134] py-4 px-6 rounded-xl w-full">
                <p className='text-[#808080]'>Cost</p>
                <p className='text-white font-semibold'>0.0027ETH + fees</p>
            </div>

            <button className='text-white bg-[#3C77FB] hover:scale-[1.1] transition-all w-full rounded-2xl py-4 mt-5 w-[90%]'>Open Wellet</button>
        </div>

      </div>
  );
};

export default ConfirmExtend;
