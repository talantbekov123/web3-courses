import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: 600,
  background: '#ffffff',
  color: '#282c34',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit',
};

const disabledStyle = {
  ...buttonStyle,
  opacity: 0.4,
  cursor: 'not-allowed',
};

const statusStyle = {
  fontSize: '13px',
  color: 'rgba(255, 255, 255, 0.7)',
};

const linkStyle = {
  fontSize: '13px',
  color: '#61dafb',
  wordBreak: 'break-all',
};

const errorStyle = {
  color: '#ff6b6b',
  fontSize: '12px',
  maxWidth: '300px',
  textAlign: 'center',
};

function statusLabel(isPending, isSuccess, isError) {
  if (isPending) return 'Confirm in wallet…';
  if (isSuccess) return 'Success!';
  if (isError) return 'Error';
  return null;
}

export default function SendTransactionButton() {
  const { isConnected } = useAccount();
  const { sendTransaction, data: hash, error, isPending, isSuccess, isError } =
    useSendTransaction();

  const handleSend = () => {
    sendTransaction({
      to: BURN_ADDRESS,
      value: parseEther('0.01'),
    });
  };

  const canSend = isConnected && !isPending;
  const label = statusLabel(isPending, isSuccess, isError);

  return (
    <div style={containerStyle}>
      <button
        style={canSend ? buttonStyle : disabledStyle}
        disabled={!canSend}
        title={!isConnected ? 'Connect wallet first' : undefined}
        onClick={handleSend}
        onMouseEnter={(e) => {
          if (canSend) e.target.style.background = '#e0e0e0';
        }}
        onMouseLeave={(e) => {
          if (canSend) e.target.style.background = '#ffffff';
        }}
      >
        {isPending ? 'Sending…' : 'Send 0.1 Sepolia ETH'}
      </button>

      {label && <span style={statusStyle}>{label}</span>}

      {isSuccess && hash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          View on Etherscan
        </a>
      )}

      {isError && (
        <span style={errorStyle}>
          {error?.shortMessage || error?.message || 'Transaction failed'}
        </span>
      )}
    </div>
  );
}
