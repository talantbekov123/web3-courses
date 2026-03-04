import logo from './logo.svg';
import './App.css';
import WalletConnectButton from './components/WalletConnectButton';
import GetBalanceButton from './components/GetBalanceButton';
import SwitchChainButton from './components/SwitchChainButton';
import ContractReadButton from './components/ContractReadButton';
import SendTransactionButton from './components/SendTransactionButton';

const sectionStyle = {
  width: '100%',
  maxWidth: '400px',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  paddingTop: '16px',
  marginTop: '8px',
};

const headingStyle = {
  fontSize: '13px',
  fontWeight: 400,
  color: 'rgba(255, 255, 255, 0.45)',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  marginBottom: '10px',
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <WalletConnectButton />

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Balance</h3>
          <GetBalanceButton />
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Switch Chain</h3>
          <SwitchChainButton />
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Contract Read</h3>
          <ContractReadButton />
        </div>

        <div style={sectionStyle}>
          <h3 style={headingStyle}>Send Transaction</h3>
          <SendTransactionButton />
        </div>
        <br/>
        <br/>
        <br/>

      </header>
    </div>
  );
}

export default App;
