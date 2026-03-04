import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

const USDT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7';

const usdtAbi = [
  {
    type: 'function',
    name: 'name',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string', name: '' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string', name: '' }],
  },
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256', name: '' }],
  },
];

const contractConfig = { address: USDT_ADDRESS, abi: usdtAbi };

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

const resultBoxStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '10px',
  padding: '12px 20px',
  fontSize: '13px',
  fontFamily: 'monospace',
  color: '#e0e0e0',
  lineHeight: 1.8,
  textAlign: 'left',
};

const valueStyle = { color: '#61dafb' };

const spinnerStyle = {
  display: 'inline-block',
  width: '14px',
  height: '14px',
  border: '2px solid rgba(255,255,255,0.3)',
  borderTop: '2px solid #61dafb',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

export default function ContractReadButton() {
  const [enabled, setEnabled] = useState(false);

  const { data: name, isLoading: nameLoading } = useReadContract({
    ...contractConfig,
    functionName: 'name',
    query: { enabled },
  });

  const { data: symbol, isLoading: symbolLoading } = useReadContract({
    ...contractConfig,
    functionName: 'symbol',
    query: { enabled },
  });

  const { data: totalSupply, isLoading: supplyLoading } = useReadContract({
    ...contractConfig,
    functionName: 'totalSupply',
    query: { enabled },
  });

  const isLoading = nameLoading || symbolLoading || supplyLoading;
  const hasData = name && symbol && totalSupply;

  return (
    <div style={containerStyle}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <button
        style={buttonStyle}
        disabled={isLoading}
        onClick={() => setEnabled(true)}
        onMouseEnter={(e) => { e.target.style.background = '#e0e0e0'; }}
        onMouseLeave={(e) => { e.target.style.background = '#ffffff'; }}
      >
        {isLoading ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={spinnerStyle} /> Reading...
          </span>
        ) : (
          'Read Contract'
        )}
      </button>

      {hasData && (
        <div style={resultBoxStyle}>
          <div>Name: <span style={valueStyle}>{name}</span></div>
          <div>Symbol: <span style={valueStyle}>{symbol}</span></div>
          <div>
            Total Supply:{' '}
            <span style={valueStyle}>
              {parseFloat(formatUnits(totalSupply, 6)).toLocaleString(undefined, {
                minimumFractionDigits: 6,
                maximumFractionDigits: 6,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
