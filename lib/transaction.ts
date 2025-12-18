import { ethers } from 'ethers';
import { isArcnetNetwork, switchToArcnet } from './network';
import { ARCNET_CONFIG } from './web3-config';

/**
 * Get ethers provider and signer
 */
export async function getProviderAndSigner(): Promise<{
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
  address: string;
}> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask ou carteira EVM não detectada. Por favor, instale MetaMask.');
  }

  // Ensure we're on Arcnet
  const isArcnet = await isArcnetNetwork();
  if (!isArcnet) {
    console.log('[Transaction] Switching to Arc Network...');
    await switchToArcnet();
    // Wait a bit for network switch
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const provider = new ethers.BrowserProvider(window.ethereum, 'any');
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  // Verify we're on Arcnet after switch (accept both chain IDs)
  const network = await provider.getNetwork();
  const expectedChainId = BigInt(ARCNET_CONFIG.chainId);
  const alternativeChainId = BigInt('0x4cef52');
  if (network.chainId !== expectedChainId && network.chainId !== alternativeChainId) {
    throw new Error(`Por favor, conecte-se à rede Arc Testnet (Chain ID: ${ARCNET_CONFIG.chainId} ou 0x4cef52)`);
  }

  return { provider, signer, address };
}

/**
 * Send a transaction and return the hash
 */
export async function sendTransaction(
  to: string,
  data: string,
  value: bigint = 0n
): Promise<{ hash: string; receipt: ethers.ContractTransactionReceipt }> {
  const { signer, address } = await getProviderAndSigner();

  try {
    // Estimate gas
    const gasEstimate = await signer.estimateGas({
      to,
      data,
      value,
    });

    // Get current gas price (Arc Network uses dynamic gas pricing)
    const feeData = await signer.provider.getFeeData();
    
    // Use maxFeePerGas and maxPriorityFeePerGas for EIP-1559
    // Arc Network minimum base fee is ~160 Gwei
    const maxFeePerGas = feeData.maxFeePerGas || ethers.parseUnits('200', 'gwei');
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || ethers.parseUnits('2', 'gwei');

    // Ensure minimum gas price for Arc Network
    const minGasPrice = ethers.parseUnits('160', 'gwei');
    const finalMaxFeePerGas = maxFeePerGas < minGasPrice ? minGasPrice : maxFeePerGas;

    console.log('[Transaction] Sending transaction...');
    console.log('[Transaction] To:', to);
    console.log('[Transaction] Gas estimate:', gasEstimate.toString());
    console.log('[Transaction] Max fee per gas:', ethers.formatUnits(finalMaxFeePerGas, 'gwei'), 'Gwei');

    // Send transaction
    const tx = await signer.sendTransaction({
      to,
      data,
      value,
      gasLimit: gasEstimate,
      maxFeePerGas: finalMaxFeePerGas,
      maxPriorityFeePerGas: maxPriorityFeePerGas,
    });

    console.log('[Transaction] Transaction sent! Hash:', tx.hash);
    console.log('[Transaction] Waiting for confirmation...');

    // Wait for confirmation
    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error('Transaction receipt not found');
    }

    console.log('[Transaction] Transaction confirmed!');
    console.log('[Transaction] Block number:', receipt.blockNumber);
    console.log('[Transaction] Gas used:', receipt.gasUsed.toString());

    return {
      hash: tx.hash,
      receipt,
    };
  } catch (error: any) {
    console.error('[Transaction] Error sending transaction:', error);
    
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('Transação rejeitada pelo usuário');
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Saldo insuficiente de USDC para pagar a taxa de gas');
    } else if (error.message?.includes('network')) {
      throw new Error('Erro de rede. Verifique sua conexão e tente novamente.');
    } else {
      throw new Error(error.message || 'Erro ao enviar transação');
    }
  }
}

/**
 * Call a contract function and return transaction hash
 */
export async function callContractFunction(
  contractAddress: string,
  abi: ethers.InterfaceAbi,
  functionName: string,
  args: any[],
  value: bigint = 0n
): Promise<{ hash: string; receipt: ethers.ContractTransactionReceipt }> {
  const { signer } = await getProviderAndSigner();

  try {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const contractFunction = contract.getFunction(functionName);

    if (!contractFunction) {
      throw new Error(`Function ${functionName} not found in contract ABI`);
    }

    console.log(`[Transaction] Calling contract function: ${functionName}`);
    console.log(`[Transaction] Contract: ${contractAddress}`);
    console.log(`[Transaction] Args:`, args);

    // Estimate gas for the function call
    const gasEstimate = await contractFunction.estimateGas(...args, { value });

    // Get fee data
    const feeData = await signer.provider.getFeeData();
    const maxFeePerGas = feeData.maxFeePerGas || ethers.parseUnits('200', 'gwei');
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || ethers.parseUnits('2', 'gwei');
    const minGasPrice = ethers.parseUnits('160', 'gwei');
    const finalMaxFeePerGas = maxFeePerGas < minGasPrice ? minGasPrice : maxFeePerGas;

    // Send transaction
    const tx = await contractFunction(...args, {
      value,
      gasLimit: gasEstimate,
      maxFeePerGas: finalMaxFeePerGas,
      maxPriorityFeePerGas: maxPriorityFeePerGas,
    });

    console.log('[Transaction] Transaction sent! Hash:', tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error('Transaction receipt not found');
    }

    console.log('[Transaction] Transaction confirmed!');
    console.log('[Transaction] Block number:', receipt.blockNumber);

    return {
      hash: tx.hash,
      receipt,
    };
  } catch (error: any) {
    console.error('[Transaction] Error calling contract function:', error);
    
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('Transação rejeitada pelo usuário');
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Saldo insuficiente de USDC para pagar a taxa de gas');
    } else {
      throw new Error(error.message || `Erro ao chamar função ${functionName}`);
    }
  }
}

/**
 * Get transaction receipt by hash
 */
export async function getTransactionReceipt(txHash: string): Promise<ethers.TransactionReceipt | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getTransactionReceipt(txHash);
  } catch (error) {
    console.error('[Transaction] Error getting receipt:', error);
    return null;
  }
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: string): string {
  if (!hash) return '';
  if (hash.startsWith('0x')) {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  }
  return hash;
}

/**
 * Get explorer URL for transaction
 */
export function getExplorerUrl(txHash: string): string {
  return `${ARCNET_CONFIG.blockExplorerUrls[0]}/tx/${txHash}`;
}

