import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className={`fixed bottom-5 right-5 flex items-center p-4 rounded-md shadow-lg ${
            type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}
        >
          <FontAwesomeIcon
            icon={type === 'success' ? faCheckCircle : faTimesCircle}
            className="mr-2"
          />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
