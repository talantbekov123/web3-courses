import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';

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

const resultStyle = {
  fontSize: '14px',
  color: '#61dafb',
  fontFamily: 'monospace',
};

export default function GetBalanceButton() {
  const { address, isConnected } = useAccount();
  const [fetchEnabled, setFetchEnabled] = useState(false);

  useEffect(() => {
    if (!isConnected) setFetchEnabled(false);
  }, [isConnected]);

  const { data: balance, isFetching, isError } = useBalance({
    address,
    query: { enabled: fetchEnabled && isConnected },
  });

  return (
    <div style={containerStyle}>
      <button
        style={isConnected ? buttonStyle : disabledStyle}
        disabled={!isConnected || isFetching}
        title={!isConnected ? 'Connect wallet first' : undefined}
        onClick={() => setFetchEnabled(true)}
        onMouseEnter={(e) => {
          if (isConnected) e.target.style.background = '#e0e0e0';
        }}
        onMouseLeave={(e) => {
          if (isConnected) e.target.style.background = '#ffffff';
        }}
      >
        {isFetching ? 'Fetching...' : 'Get Balance'}
      </button>

      {isError && <span style={{ color: '#ff6b6b', fontSize: '13px' }}>Failed to fetch balance</span>}

      {balance && (
        <span style={resultStyle}>
          {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} {balance.symbol}
        </span>
      )}
    </div>
  );
}
