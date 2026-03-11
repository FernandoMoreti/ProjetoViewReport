'use client'
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import MainAdd from "./components/addReport"; // Seu componente atual de formulário
// import MainView from "./components/MainView"; // Crie este para listar
// import MainEdit from "./components/MainEdit"; // Crie este para edição em lote

export default function BankPage() {
  const searchParams = useSearchParams();
  const bank = searchParams.get('bank');

  const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('add');

  if (!bank) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-purple-400/50">
        <h2 className="text-2xl font-bold uppercase tracking-widest">Selecione um banco na sidebar</h2>
      </div>
    );
  }

  return (
    <section className="flex flex-col bg-[#1a0b2e] min-h-screen p-6 text-white">
      <div className="w-full max-w-5xl mx-auto mb-8">
        <header className="flex justify-between items-end border-b border-purple-900/30 pb-4">
          <div>
            <span className="text-xs font-bold text-purple-500 uppercase tracking-tighter">Gerenciamento</span>
            <h1 className="text-4xl font-bold text-white">{bank}</h1>
          </div>

          <nav className="flex gap-6">
            <TabButton
              label="Adicionar"
              active={activeTab === 'add'}
              onClick={() => setActiveTab('add')}
            />
            <TabButton
              label="Visualizar"
              active={activeTab === 'view'}
              onClick={() => setActiveTab('view')}
            />
            <TabButton
              label="Editar"
              active={activeTab === 'edit'}
              onClick={() => setActiveTab('edit')}
            />
          </nav>
        </header>
      </div>

      <main className="flex-1">
        {activeTab === 'add' && <MainAdd bank={bank} />}
        {activeTab === 'view' && <div className="text-center py-20">View de {bank} (Em breve)</div>}
        {activeTab === 'edit' && <div className="text-center py-20">Edição de {bank} (Em breve)</div>}
      </main>

    </section>
  );
}

// Sub-componente para os botões das abas (estilização)
function TabButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 text-sm font-bold uppercase tracking-widest transition-all relative ${
        active ? 'text-[#9823ff]' : 'text-purple-400/40 hover:text-purple-300'
      }`}
    >
      {label}
      {active && (
        <div className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-[#9823ff] shadow-[0_0_10px_#9823ff]" />
      )}
    </button>
  );
}