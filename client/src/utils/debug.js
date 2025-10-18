// Debug utility functions for DressCrypto

export const logWalletInfo = () => {
  console.group('🔍 Wallet Debug Info');
  
  console.log('Window ethereum:', !!window.ethereum);
  console.log('MetaMask installed:', window.ethereum?.isMetaMask);
  console.log('Selected address:', window.ethereum?.selectedAddress);
  console.log('Network version:', window.ethereum?.networkVersion);
  console.log('Chain ID:', window.ethereum?.chainId);
  
  if (window.ethereum) {
    console.log('Ethereum provider:', window.ethereum);
    console.log('Is connected:', window.ethereum.isConnected?.());
  }
  
  console.groupEnd();
};

export const logContractInfo = (contractAddress, chainId) => {
  console.group('📜 Contract Debug Info');
  
  console.log('Contract address:', contractAddress);
  console.log('Current chain ID:', chainId);
  console.log('Expected networks:', {
    mainnet: 1,
    goerli: 5,
    sepolia: 11155111,
    localhost: 31337,
    hardhat: 31337
  });
  
  console.groupEnd();
};

export const logError = (context, error) => {
  console.group(`❌ Error in ${context}`);
  
  console.error('Error object:', error);
  console.error('Error message:', error.message);
  console.error('Error code:', error.code);
  console.error('Error stack:', error.stack);
  
  if (error.reason) {
    console.error('Error reason:', error.reason);
  }
  
  if (error.data) {
    console.error('Error data:', error.data);
  }
  
  console.groupEnd();
};

export const checkMetaMaskSetup = async () => {
  console.group('🦊 MetaMask Setup Check');
  
  if (!window.ethereum) {
    console.error('❌ window.ethereum not found - MetaMask not installed');
    console.groupEnd();
    return false;
  }
  
  if (!window.ethereum.isMetaMask) {
    console.warn('⚠️ window.ethereum found but not MetaMask');
    console.groupEnd();
    return false;
  }
  
  console.log('✅ MetaMask is installed');
  console.log('Version:', window.ethereum._metamask?.version);
  
  try {
    const isUnlocked = await window.ethereum._metamask.isUnlocked();
    console.log('Is unlocked:', isUnlocked);
    
    if (!isUnlocked) {
      console.warn('⚠️ MetaMask is locked - user needs to unlock it');
      console.groupEnd();
      return false;
    }
  } catch (err) {
    console.warn('⚠️ Could not check MetaMask lock status:', err);
  }
  
  console.groupEnd();
  return true;
};