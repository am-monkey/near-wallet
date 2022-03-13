const widget = document.querySelector('.widget');
const widgetInfo = widget.querySelector('.widget__info');
const loginBtn = widget.querySelector('.sign-in');
const updateBalanceBtn = widget.querySelector('.update');
const copyBtn = widget.querySelector('.copy-address');

// connect to NEAR
const near = new nearApi.Near({
  keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org'
});

const wallet = new nearApi.WalletConnection(near, 'login-app');

async function showBalance() {
  const accountName = wallet._authData.accountId;
  const account = await near.account(accountName);
  const state = await account.state();
  const explorerAddress = 'https://explorer.testnet.near.org/accounts/';

  Object.assign(state, {
    formattedAmount: nearApi.utils.format.formatNearAmount(state.amount),
  });

  document.getElementById('balance').innerHTML = Number(state.formattedAmount).toFixed(5);
  document.querySelector('.widget__account__address').innerHTML = accountName;
  document.querySelector('.explorer-link').href = explorerAddress + accountName;
  return state;
}

if (wallet.isSignedIn()) {
  showBalance();
  loginBtn.textContent = 'Sign out';
} else {
  widgetInfo.style.display = 'none';
}

loginBtn.addEventListener('click', () => {
  if (wallet.isSignedIn()) {
    wallet.signOut();
    loginBtn.textContent = 'Sign In';
    widgetInfo.style.display = 'none';
  } else {
    wallet.requestSignIn({
      contractId: 'app_2.spin_swap.testnet'
    });

  }
})

function copyAddress() {
  const walletAddress = widget.querySelector(".widget__account__address");
  navigator.clipboard.writeText(walletAddress.innerText);
}
copyBtn.addEventListener('click', copyAddress);