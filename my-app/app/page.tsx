'use client'
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react"; // Importamos o Suspense
import AddReport from "./report/addReport";
import EditReport from "./report/editReport";
import ViewReport from "./report/viewReport";
import AddBank from "./bank/addBank";
import EditBank from "./bank/editBank";
import { LayoutGrid } from 'lucide-react'
import HomeBank from "./bank/homeBank";
import { TabButton } from "./components/ui/TabButton";

// 1. Criamos um componente interno para gerenciar a lógica dos parâmetros
function BankContent() {
  const searchParams = useSearchParams();
  const bank: string = searchParams.get('bank') || '';
  const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view');

  const handleSuccess = () => {
    setActiveTab('view');
    return;
  };

  if (!bank) {
    return (
      <div className="flex w-full bg-[#1a0b2e] flex-col items-center justify-center h-full mx-auto text-center animate-in fade-in zoom-in duration-1000">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#9823ff] blur-[100px] opacity-20 rounded-full"></div>
          <div className="relative bg-[#1a0b2e] border border-purple-500/20 p-8 rounded-full shadow-2xl">
            <LayoutGrid size={60} className="text-[#9823ff] animate-pulse" />
          </div>
        </div>

        <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
          Bem-vindo ao <span className="text-transparent bg-clip-text bg-linear-to-r from-[#9823ff] to-[#ff6b3d]">Portal dos Relatorios</span>
        </h2>

        <p className="text-purple-300/60 text-lg max-w-md mb-10 leading-relaxed">
          Selecione uma unidade bancária na barra lateral para gerenciar os relatórios processados...
        </p>
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
            {bank != 'Todos os Bancos' && (
              <TabButton
                label="Adicionar"
                active={activeTab === 'add'}
                onClick={() => setActiveTab('add')}
              />
            )}
            {bank != 'Adicionar Banco' && (
              <TabButton
                label="Visualizar"
                active={activeTab === 'view'}
                onClick={() => setActiveTab('view')}
              />
            )}
            <TabButton
              label="Editar"
              active={activeTab === 'edit'}
              onClick={() => setActiveTab('edit')}
            />
          </nav>
        </header>
      </div>

      <main className="flex-1">
        <div className="animate-in fade-in duration-500">
          {bank === 'Adicionar Banco' ? (
            <>
              {activeTab === 'add' && <AddBank />}
              {activeTab === 'view' && <HomeBank />}
              {activeTab === 'edit' && <EditBank />}
            </>
          ) : bank === 'Todos os Bancos' ? (
            <>
              {activeTab === 'add' && (handleSuccess(), null)}
              {activeTab === 'view' && <ViewReport bank={bank} />}
              {activeTab === 'edit' && <EditReport bank={bank} />}
            </>
          ) : (
            <>
              {activeTab === 'add' && <AddReport bank={bank} />}
              {activeTab === 'view' && <ViewReport bank={bank} />}
              {activeTab === 'edit' && <EditReport bank={bank} />}
            </>
          )}
        </div>
      </main>
    </section>
  );
}

// 2. A página principal apenas envolve o conteúdo em um Suspense
export default function BankPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center text-white">Carregando portal...</div>}>
      <BankContent />
    </Suspense>
  );
}