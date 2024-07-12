// /src/pages/ConfirmExtend.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGasPump } from '@fortawesome/free-solid-svg-icons';
import bg1 from '../assets/topright.svg';
import wallet from '../assets/wallet.svg';
import avatar from '../assets/ava.png';

const ConfirmExtend = ({ username, years, amountInEth, onConfirm, goBack }) => {
  return (
    <div className="bg-[#0c072c] m-auto mt-40 relative py-8 rounded-lg w-full max-w-[35rem] border-[0.1px] border-[#453995]">
      <img src={bg1} alt="" className="lg:block hidden absolute top-0 right-0 w-[200px]" />
      <div className="text-[#3C77FB] flex items-center gap-2 mx-7 mb-2 cursor-pointer" onClick={goBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
        <p className='font-semibold'>Back</p>
      </div>
      <div className="flex justify-center items-center flex-col gap-4">
        <h2 className='text-white font-semibold lg:text-2xl text-xl'>Confirm Details</h2>
        <img src={wallet} alt="" />
        <p className='text-white text-center lg:text-base text-xs'>Double check these details before confirming in your wallet</p>
      </div>

      <div className="mt-5 mx-5 flex flex-col gap-2 justify-between items-center">
        <div className="flex justify-between items-center bg-[#161134] py-4 px-6 rounded-xl w-full">
          <p className='text-[#808080] lg:text-base text-xs'>Name</p>
          <div className="flex items-center gap-2">
            <p className='text-white font-semibold lg:text-base text-sm'>{username}</p>
            <img src={avatar} alt="" />
          </div>
        </div>
        <div className="flex justify-between items-center bg-[#161134] py-4 px-6 rounded-xl w-full">
          <p className='text-[#808080] lg:text-base text-xs'>Action</p>
          <p className='text-white font-semibold lg:text-base text-sm'>Extended registration</p>
        </div>
        <div className="flex justify-between items-center bg-[#161134] py-4 px-6 rounded-xl w-full">
          <p className='text-[#808080] lg:text-base text-xs'>Duration</p>
          <p className='text-white font-semibold lg:text-base text-sm'>{years} year{years > 1 ? 's' : ''}</p>
        </div>
        <div className="flex justify-between items-center bg-[#161134] py-4 px-6 rounded-xl w-full">
          <p className='text-[#808080] lg:text-base text-xs'>Cost</p>
          <p className='text-white font-semibold lg:text-base text-sm'>{amountInEth} ETH + fees</p>
        </div>

        <button className='text-white bg-[#3C77FB] hover:scale-[1.1] transition-all w-full rounded-2xl py-4 mt-5 w-[90%]' onClick={onConfirm}>Open Wallet</button>
      </div>
    </div>
  );
};

export default ConfirmExtend;
