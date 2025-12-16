// Event schema for posts
export interface Event {
  id: string;
  author: string;
  body: string;
  ipfsUri: string | null;
  signature: string | null;
  timestamp: string;
  likes?: number;
}

export function makeEvent(
  author: string,
  body: string,
  ipfsUri: string | null,
  signature: string | null
): Event {
  return {
    id: 'e-' + Math.random().toString(36).slice(2, 9),
    author,
    body,
    ipfsUri,
    signature,
    timestamp: new Date().toISOString(),
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
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}










