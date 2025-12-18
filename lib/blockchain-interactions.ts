import { ethers } from 'ethers';
import { getProviderAndSigner } from './transaction';
import { ARCNET_CONFIG, ARC_LINKS } from './web3-config';

/**
 * Send a simple transaction to generate a real transaction hash
 * This creates an on-chain record of the interaction
 * Note: Arc Network doesn't allow data in transactions to internal accounts (self)
 * So we send a simple 0 value transaction to a burn address or contract
 */
export async function createInteractionHash(
  interactionType: 'post' | 'like' | 'comment' | 'share' | 'boost',
  data: string
): Promise<{ hash: string; blockNumber: bigint }> {
  try {
    const { signer, address } = await getProviderAndSigner();

    // Use a burn address (0x0000...0001) or a known contract address that accepts transactions
    // This avoids the "cannot include data to internal accounts" error on Arc Network
    // We'll use a simple burn address that accepts transactions
    const burnAddress = '0x0000000000000000000000000000000000000001';

    // Create a hash of the interaction data to include in the transaction
    // We'll use the nonce and timestamp to make each transaction unique
    const interactionHash = ethers.id(`${interactionType}-${data}-${address}-${Date.now()}`);

    // Estimate gas for a simple transfer (no data to avoid internal account error)
    // We send 0 USDC to burn address - this creates a valid transaction hash
    const gasEstimate = await signer.estimateGas({
      to: burnAddress,
      value: BigInt(0), // 0 USDC transfer
      // No data field - Arc Network doesn't allow data to internal accounts
    });

    // Get fee data
    const feeData = await signer.provider.getFeeData();
    const maxFeePerGas = feeData.maxFeePerGas || ethers.parseUnits('200', 'gwei');
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || ethers.parseUnits('2', 'gwei');
    const minGasPrice = ethers.parseUnits('160', 'gwei');
    const finalMaxFeePerGas = maxFeePerGas < minGasPrice ? minGasPrice : maxFeePerGas;

    console.log(`[Blockchain] Creating ${interactionType} interaction on-chain...`);
    console.log(`[Blockchain] Interaction hash: ${interactionHash}`);

    // Send transaction - simple transfer without data
    // The transaction hash itself serves as the on-chain record
    const tx = await signer.sendTransaction({
      to: burnAddress,
      value: BigInt(0), // 0 USDC transfer
      gasLimit: gasEstimate,
      maxFeePerGas: finalMaxFeePerGas,
      maxPriorityFeePerGas: maxPriorityFeePerGas,
      // Note: We don't include data field to avoid Arc Network internal account error
    });

    console.log(`[Blockchain] Transaction sent! Hash: ${tx.hash}`);
    console.log(`[Blockchain] View on explorer: ${ARC_LINKS.explorer}/tx/${tx.hash}`);
    console.log(`[Blockchain] Interaction type: ${interactionType}`);
    console.log(`[Blockchain] Interaction data hash: ${interactionHash}`);

    // Wait for confirmation
    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error('Transaction receipt not found');
    }

    console.log(`[Blockchain] Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`[Blockchain] Gas used: ${receipt.gasUsed.toString()}`);

    return {
      hash: tx.hash,
      blockNumber: BigInt(receipt.blockNumber),
    };
  } catch (error: any) {
    console.error(`[Blockchain] Error creating ${interactionType} interaction:`, error);
    
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('Transação rejeitada pelo usuário');
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Saldo insuficiente de USDC para pagar a taxa de gas');
    } else if (error.message?.includes('network')) {
      throw new Error('Erro de rede. Verifique sua conexão e tente novamente.');
    } else if (error.message?.includes('internal accounts') || error.message?.includes('cannot include data')) {
      throw new Error('Erro: Arc Network não permite dados em transações para contas internas. Usando transação simples.');
    } else {
      throw new Error(error.message || `Erro ao criar interação ${interactionType}`);
    }
  }
}

/**
 * Create a post interaction hash
 */
export async function createPostHash(
  content: string,
  contentType: string = 'text',
  mediaUrls: string[] = []
): Promise<{ hash: string; blockNumber: bigint }> {
  const postData = JSON.stringify({
    content: content.substring(0, 100), // Limit size
    contentType,
    mediaCount: mediaUrls.length,
    timestamp: Date.now(),
  });

  return createInteractionHash('post', postData);
}

/**
 * Create a like interaction hash
 */
export async function createLikeHash(postId: string): Promise<{ hash: string; blockNumber: bigint }> {
  return createInteractionHash('like', postId);
}

/**
 * Create a comment interaction hash
 */
export async function createCommentHash(postId: string, comment: string): Promise<{ hash: string; blockNumber: bigint }> {
  const commentData = JSON.stringify({
    postId,
    comment: comment.substring(0, 200), // Limit size
    timestamp: Date.now(),
  });

  return createInteractionHash('comment', commentData);
}

/**
 * Create a share interaction hash
 */
export async function createShareHash(postId: string): Promise<{ hash: string; blockNumber: bigint }> {
  return createInteractionHash('share', postId);
}

/**
 * Create a boost interaction hash
 */
export async function createBoostHash(postId: string): Promise<{ hash: string; blockNumber: bigint }> {
  return createInteractionHash('boost', postId);
}

/**
 * Get transaction explorer URL
 */
export function getTransactionExplorerUrl(txHash: string): string {
  return `${ARC_LINKS.explorer}/tx/${txHash}`;
}

/**
 * Format transaction hash for display
 */
export function formatTransactionHash(hash: string): string {
  if (!hash) return '';
  if (hash.startsWith('0x')) {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  }
  return hash;
}

