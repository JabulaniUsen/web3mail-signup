import { useState } from 'react';
import Notification from '../Components/Notification';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import { useAccount } from 'wagmi';
import Button from '../Components/Button';
import Navbar from '../Components/Navbar';

const CreateMailist = () => {
    const { isConnected } = useAccount();
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

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
      <Navbar/>
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[35rem] bg-[#0c072c] mt-10 m-auto border-[0.1px] border-[#453995]">
        <div className="mb-14 text-center">
          <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white ">
            Create a Mailist
          </h2>
          <p className="text-sm text-white font-thin ">
            Glad to have you on board! Complete this process by inputing  the following details below
          </p>
        </div>
        <form className="space-y-4" >
          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Mailist Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mailistName"
              placeholder="Enter mailist name"
              className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Writer's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="writerName"
              placeholder="Enter writer's Name"
              className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Newsletter Summary <span className="text-red-500">*</span>
            </label>
            <textarea placeholder="Last Name" className="w-full p-4 transition-all py-2 rounded-xl h-[150px] bg-[#161134] text-white outline-none" name="" id=""></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Email Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="emailGroupName"
              placeholder="Enter Email group name"
              className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Insert Cover Image <span className="text-red-500">*</span>
            </label>
            {/* <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white outline-none"
              required
            /> */}
            <input type="file" className="w-full bg-transparent p-2 transition-all py-3 lg:py-5 rounded-xl text-white outline-none" src="" alt="" />
          </div>

          <div className="flex gap-10 items-center justify-between">
            <Button walletConnected={isConnected} >
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

export default CreateMailist;
