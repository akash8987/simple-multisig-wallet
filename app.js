const contractAddress = "0xYOUR_MULTISIG_ADDRESS";
const abi = [
    "function submitTransaction(address _to, uint256 _value) public",
    "function confirmTransaction(uint256 _txIndex) public",
    "function executeTransaction(uint256 _txIndex) public",
    "function getTransactionCount() public view returns (uint256)",
    "function transactions(uint256) public view returns (address to, uint256 value, bool executed, uint256 numConfirmations)"
];

let provider, signer, contract;

document.getElementById('connectBtn').addEventListener('click', async () => {
    if(window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
        
        document.getElementById('connectBtn').innerText = "Connected";
        updateUI();
    }
});

async function updateUI() {
    const balance = await provider.getBalance(contractAddress);
    document.getElementById('balance').innerText = ethers.utils.formatEther(balance);
    
    const txCount = await contract.getTransactionCount();
    const list = document.getElementById('txList');
    list.innerHTML = "";

    for(let i = 0; i < txCount; i++) {
        const tx = await contract.transactions(i);
        if(!tx.executed) {
            const div = document.createElement('div');
            div.className = 'tx-item';
            div.innerHTML = `
                <div>
                    <strong>ID: ${i}</strong> | To: ${tx.to.slice(0,6)}... | Val: ${ethers.utils.formatEther(tx.value)} ETH
                    <br> Confirmations: ${tx.numConfirmations}
                </div>
                <div class="tx-actions">
                    <button class="confirm-btn" onclick="confirmTx(${i})">Confirm</button>
                    <button class="exec-btn" onclick="executeTx(${i})">Execute</button>
                </div>
            `;
            list.appendChild(div);
        }
    }
}

document.getElementById('submitBtn').addEventListener('click', async () => {
    const to = document.getElementById('toAddress').value;
    const val = ethers.utils.parseEther(document.getElementById('amount').value);
    const tx = await contract.submitTransaction(to, val);
    document.getElementById('status').innerText = "Submitting...";
    await tx.wait();
    updateUI();
});

async function confirmTx(id) {
    try {
        const tx = await contract.confirmTransaction(id);
        document.getElementById('status').innerText = "Confirming...";
        await tx.wait();
        updateUI();
    } catch(e) { console.error(e); alert("Error or already confirmed"); }
}

async function executeTx(id) {
    try {
        const tx = await contract.executeTransaction(id);
        document.getElementById('status').innerText = "Executing...";
        await tx.wait();
        updateUI();
        document.getElementById('status').innerText = "Executed!";
    } catch(e) { console.error(e); alert("Not enough confirmations or error"); }
}
