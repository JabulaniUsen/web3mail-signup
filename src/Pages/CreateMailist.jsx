import { useState } from 'react';
import Notification from '../Components/Notification';
import bg1 from '../assets/topright.svg';
import bg2 from '../assets/leftdown.svg';
import { useAccount } from 'wagmi';
import Button from '../Components/Button';
import Navbar from '../Components/Navbar';
import axiosInstance from '../config/axios';
import { useNavigate } from 'react-router-dom';


const CreateMailist = () => {
  const { isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const registerSecret = "thisisgonnabetheextralayerofsecurity";
  const [formData, setFormData] = useState({
    maillistName: '',
    subtitle: '',
    writersName: '',
    summary: '',
    coverImageUrl: '',
    groupId: ''
  });

  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Assuming you have an endpoint to upload the image and get back a URL
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axiosInstance.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setFormData((prevFormData) => ({
          ...prevFormData,
          coverImageUrl: response.data.url, // Assuming the response contains the URL of the uploaded image
        }));
        setNotification({ type: 'success', message: error.response.data.message });
        setLoading(false);
        setFormData([])
        navigate('/');
      } catch (error) {
        console.error('Error uploading file:', error);
        setNotification({ type: 'error', message: error.response.data.message });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dataToSend = {
      ...formData,
      registerSecret
    };
    try {
      const response = await axiosInstance.post('/createNewsletter', dataToSend);
      console.log('Response:', response.data);
      setNotification({ message: 'Newsletter created successfully', type: 'success' });
      setLoading(false);
    } catch (error) {
      console.error('Something went wrong, try again', error);
      setNotification({ message: 'Something went wrong, try again', type: 'error' });
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="lg:px-20 px-5 bg-[#050122] lg:pb-40 pb-20 py-10 px-2 relative inter">
      <img src={bg1} alt="" className="lg:block hidden absolute top-0 right-0" />
      <img src={bg2} alt="" className="lg:block absolute hidden bottom-0 left-0" />
      <Navbar />
      <div className="lg:p-8 py-8 px-5 rounded-2xl w-full max-w-[45rem] bg-[#0c072c] mt-10 m-auto border-[0.1px] border-[#453995]">
        <div className="mb-14 text-center">
          <h2 className="lg:text-3xl text-2xl font-bold mb-2 text-white ">
            Create a Mailist
          </h2>
          <p className="text-sm text-white font-thin ">
            Glad to have you on board! Complete this process by inputting the following <br /> details below
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Mailist Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              onChange={handleChange}
              value={formData.maillistName}
              name="maillistName"
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
              onChange={handleChange}
              value={formData.writersName}
              name="writersName"
              placeholder="Enter writer's Name"
              className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Subtitle <span className="text-red-500">*</span>
            </label>
            <textarea
              onChange={handleChange}
              value={formData.subtitle}
              name="subtitle"
              placeholder="Enter Subtitle"
              className="w-full p-4 transition-all py-2 rounded-xl h-[80px] bg-[#161134] text-white outline-none"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Newsletter Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              onChange={handleChange}
              value={formData.summary}
              name="summary"
              placeholder="Enter summary"
              className="w-full p-4 transition-all py-2 rounded-xl h-[150px] bg-[#161134] text-white outline-none"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Email Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              onChange={handleChange}
              value={formData.groupId}
              name="groupId"
              placeholder="Enter Email group name"
              className="w-full p-4 transition-all py-3 lg:py-5 rounded-xl bg-[#161134] text-white outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium my-2 text-white">
              Insert Cover Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full bg-transparent p-2 transition-all py-3 lg:py-5 rounded-xl text-white outline-none"
              required
            />
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

export default CreateMailist;
