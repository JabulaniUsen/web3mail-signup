import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import bg2 from '../assets/leftdown.svg';
import bg1 from '../assets/topright.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Button from '../Components/Button';

const ExtendSub = () => {

    const [years, setYears] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { username } = location.state || {}; 
    const [amountInEth, setAmountInEth] = useState(0.0012);


    const handleIncrement = () => {
        setYears((prevYears) => prevYears + 1);
      };
    
      const handleDecrement = () => {
        if (years > 1) {
          setYears((prevYears) => prevYears - 1);
        }
      };

  return (
    <div className='flex items-center justify-center bg-[#050122] lg:py-40 py-20 px-2 relative inter h-[120vh]'>
      <div className="absolute top-10 right-10 z-20 float-end transition-all">
        <ConnectButton />
      </div>

      <img src={bg1} alt="" className="absolute top-0 right-0" />
      <img src={bg2} alt="" className="absolute bottom-0 left-0" />


      <div className="bg-[#0c072c] relative py-8 rounded-lg w-full max-w-[35rem] border-[0.1px] border-[#453995]">
         <div className="px-5 border-b border-[#453995]">
            <div className="mb-14">
                <img
                src={bg1}
                alt=""
                className="lg:block hidden absolute top-0 right-0 w-[200px]"
                />
                <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white text-center">
                Extend Subscribtion
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
                <span>{years}</span> Year{years > 1 ? 's' : ''} extention
            </p>
         </div>


          <div className="px-5">
            <div className="px-1">
                <div className=" flex items-center justify-between relative">
                    <p className='text-white flex items-center gap-2'>
                        <FontAwesomeIcon icon={faGasPump}/>
                        9.96 Gwei
                    </p>
                    <div className="amount flex items-center justify-center mt-5">
                        <div className="amount flex items-center justify-center my-5 p-2 bg-[#161134]">
                            <p className='text-white p-1 px-2 rounded font-semibold bg-[#3C77FB] text-xs'>ETH</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#161134] rounded-lg flex items-center justify-between px-7 relative py-2">
                <p className='text-white '>
                    <span>{years}</span> Year{years > 1 ? 's' : ''} extention
                </p>
                <div className="amount flex items-center justify-center my-2">
                    <p className="text-white ">
                    {amountInEth} ETH
                    </p>
                </div>
            </div>
            <div className="flex gap-10 items-center justify-between">
            <button className='w-full py-3 mt-6 text-lg font-semibold bg-white rounded-xl hover:text-white transition-all hover:bg-blue-900 text-[#3C77FB]'>Back</button>
            <button className='w-full py-3 mt-6 text-lg font-semibold text-white bg-blue-500 rounded-xl  transition-all hover:bg-blue-900 bg-[#3C77FB]'>Next</button>
          </div>
          </div>


          {/* <Button
            onClick={handleBuy}
            disabled={loading}
          >
            {loading ? <div className="loader"></div> : 'Create Mail'}
          </Button> */}
        </div>
    </div>
  );
};

export default ExtendSub;
