'use client';

export default function RightSidebar() {
  return (
    <aside className="col-span-3">
      <div className="sticky top-6 space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="text-sm font-semibold">Tendências</div>
          <div className="mt-3 flex flex-col gap-2">
            {['#arcnet', '#web3', '#ipfs', '#nostr-like'].map((trend) => (
              <div
                key={trend}
                className="text-xs px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
              >
                {trend}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <div className="text-sm font-semibold">Sobre</div>
          <div className="text-xs text-slate-500 mt-2">
            Cliente minimalista inspirado no Nostr. Publicações são assinadas e podem ser
            armazenadas em IPFS, com metadados opcionalmente registrados on-chain na Arcnet
            testnet.
          </div>
        </div>
      </div>
    </aside>
  );
}










