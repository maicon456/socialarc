// Event schema for posts
export interface Event {
  id: string;
  author: string;
  body: string;
  ipfsUri: string | null;
  signature: string | null;
  timestamp: string;
  likes?: number;
  replies?: number;
  boosts?: number;
  replyTo?: string; // ID of parent event
  boostOf?: string; // ID of boosted event
  type?: 'note' | 'reply' | 'reaction' | 'boost';
}

export interface EventPayload {
  author: string;
  body: string;
  ipfs: string | null;
  ts: number;
  type?: string;
  replyTo?: string;
  boostOf?: string;
}

/**
 * Generate deterministic event ID from content
 */
export function generateEventId(author: string, body: string, timestamp: number): string {
  const content = `${author}-${body}-${timestamp}`;
  // Simple hash-based ID (in production, use proper hashing)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return 'e-' + Math.abs(hash).toString(36).slice(0, 9);
}

export function makeEvent(
  author: string,
  body: string,
  ipfsUri: string | null,
  signature: string | null,
  type: 'note' | 'reply' | 'reaction' | 'boost' = 'note',
  replyTo?: string,
  boostOf?: string
): Event {
  const timestamp = Date.now();
  return {
    id: generateEventId(author, body, timestamp),
    author,
    body,
    ipfsUri,
    signature,
    timestamp: new Date(timestamp).toISOString(),
    type,
    replyTo,
    boostOf,
    likes: 0,
    replies: 0,
    boosts: 0,
  };
}

export function makeReactionEvent(
  author: string,
  targetEventId: string,
  signature: string | null
): Event {
  return {
    id: generateEventId(author, `reaction-${targetEventId}`, Date.now()),
    author,
    body: '+',
    ipfsUri: null,
    signature,
    timestamp: new Date().toISOString(),
    type: 'reaction',
    likes: 0,
  };
}

export function makeBoostEvent(
  author: string,
  boostedEventId: string,
  signature: string | null
): Event {
  return {
    id: generateEventId(author, `boost-${boostedEventId}`, Date.now()),
    author,
    body: '',
    ipfsUri: null,
    signature,
    timestamp: new Date().toISOString(),
    type: 'boost',
    boostOf: boostedEventId,
    boosts: 0,
  };
}

export function sampleRemoteText(): string {
  const samples = [
    'Testando contratos na Arcnet — deploy ok!',
    'Pinning IPFS automático com Pinata — recomendo.',
    'Alguém quer colaborar num SDK para Arcnet?',
    'Boost: use small gas optimization para loops.',
    'Novo protocolo de assinatura testado com sucesso!',
    'Integração com IPFS funcionando perfeitamente.',
    'Arcnet testnet está estável — pronto para testes!',
    'Novo recurso: assinaturas EIP-712 implementadas.',
    'Comunidade crescendo! Bem-vindos novos devs!',
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}










