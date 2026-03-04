import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const buttonStyle = {
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: 600,
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit',
};

const connectStyle = {
  ...buttonStyle,
  background: '#ffffff',
  color: '#282c34',
};

const disconnectStyle = {
  ...buttonStyle,
  background: 'transparent',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  padding: '8px 16px',
  fontSize: '14px',
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  margin: '20px 0',
};

const addressStyle = {
  fontSize: '14px',
  color: '#61dafb',
  fontFamily: 'monospace',
};

function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div style={containerStyle}>
        <span style={addressStyle}>{truncateAddress(address)}</span>
        <button
          style={disconnectStyle}
          onClick={() => disconnect()}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <button
        style={connectStyle}
        disabled={isPending}
        onClick={() => connect({ connector: injected() })}
        onMouseEnter={(e) => {
          e.target.style.background = '#e0e0e0';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#ffffff';
        }}
      >
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  );
}
