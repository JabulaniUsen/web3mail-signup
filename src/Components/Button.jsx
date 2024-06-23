import PropTypes from 'prop-types';

const Button = ({
  onClick,
  disabled,
  className,
  children,
  walletConnected
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-3 lg:py-5 mt-6 text-lg font-semibold text-white bg-blue-500 rounded-xl  transition-all ${
        !walletConnected || disabled
          ? 'cursor-not-allowed'
          : 'hover:bg-blue-800'
      } ${className}`}
      disabled={walletConnected && disabled}
    >
      {walletConnected ? children : 'Connect Wallet'}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  className: PropTypes.string,
  children: PropTypes.string.isRequired,
  walletConnected: PropTypes.bool.isRequired
};

export default Button;
