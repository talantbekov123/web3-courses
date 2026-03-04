import { useState } from 'react';
import { useChainId, useSwitchChain } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
const kasplex = {
  id: 8786,
  name: 'Kasplex',
  nativeCurrency: { name: 'Kasplex', symbol: 'KAS', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.kasplex.com'],
    },
  },
}
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
};

const rowStyle = {
  display: 'flex',
  gap: '10px',
};

const buttonStyle = {
  padding: '10px 18px',
  fontSize: '13px',
  fontWeight: 600,
  background: '#ffffff',
  color: '#282c34',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit',
};

const activeStyle = {
  ...buttonStyle,
  background: 'transparent',
  color: '#61dafb',
  border: '1px solid #61dafb',
  cursor: 'default',
  opacity: 0.7,
};

const labelStyle = {
  fontSize: '13px',
  color: 'rgba(255, 255, 255, 0.6)',
};

const errorStyle = {
  color: '#ff6b6b',
  fontSize: '12px',
  maxWidth: '280px',
  textAlign: 'center',
};

export default function SwitchChainButton() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [error, setError] = useState(null);

  const chains = [mainnet, sepolia];
  const currentChain = chains.find((c) => c.id === chainId);

  const handleSwitch = (id) => {
    setError(null);
    switchChain(
      { chainId: id },
      {
        onError: (err) => setError(err.shortMessage || err.message),
      },
    );
  };

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>
        Current: <strong style={{ color: '#61dafb' }}>{currentChain?.name || `Chain ${chainId}`}</strong>
      </span>

      <div style={rowStyle}>
        {chains.map((chain) => {
          const isActive = chain.id === chainId;
          return (
            <button
              key={chain.id}
              style={isActive ? activeStyle : buttonStyle}
              disabled={isActive || isPending}
              onClick={() => handleSwitch(chain.id)}
              onMouseEnter={(e) => {
                if (!isActive) e.target.style.background = '#e0e0e0';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.target.style.background = '#ffffff';
              }}
            >
              {isPending && !isActive ? 'Switching...' : chain.name}
            </button>
          );
        })}
      </div>

      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}
