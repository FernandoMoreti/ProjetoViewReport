'use client'
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import AddReport from "./components/addReport";
import EditReport from "./components/editReport";
import ViewReport from "./components/viewReport";
import AddBank from "./components/addBank";
import EditBank from "./components/editBank";
import { LayoutGrid, Plus, Search, FileText, ChevronLeft } from 'lucide-react'
import HomeBank from "./components/homeBank";
import Link from "next/link";

export default function BankPage() {
  const searchParams = useSearchParams();
  const bank: string = searchParams.get('bank') || '';

  const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view');

  const handleSuccess = () => {
    setActiveTab('view');
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
          Selecione uma unidade bancária na barra lateral para gerenciar os relatórios processados, adicionar novos extratos ou auditar o histórico.
        </p>

        <div className="flex gap-4 px-30 opacity-80">
          <Link
            href={"/dayofweek"}
            className="p-4 cursor-pointer w-50 py-10 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center transition-all duration-300 gap-2 hover:-translate-y-0.5 hover:bg-white/10"
          >
            <div className="w-8 h-8 rounded-lg bg-[#9823ff]/20 flex items-center justify-center">
              <Plus size={16} className="text-[#9823ff]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-tighter text-purple-200">Dias da Semana</span>
          </Link>
        </div>
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
            {
              bank != 'Todos os Bancos'
              ? <TabButton
                  label="Adicionar"
                  active={activeTab === 'add'}
                  onClick={() => setActiveTab('add')}
                />
              : <></>
            }
            {
              bank != 'Adicionar Banco'
              ? <TabButton
                  label="Visualizar"
                  active={activeTab === 'view'}
                  onClick={() => setActiveTab('view')}
                />
              : <></>
            }
            <TabButton
              label="Editar"
              active={activeTab === 'edit'}
              onClick={() => setActiveTab('edit')}
            />
          </nav>
        </header>
      </div>

      <main className="flex-1">
        {bank === 'Adicionar Banco' ? (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'add' && <AddBank />}
            {activeTab === 'view' && <HomeBank />}
            {activeTab === 'edit' && <EditBank />}
          </div>
        ) : bank === 'Todos os Bancos' ? (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'add' && handleSuccess()}
            {activeTab === 'view' && <ViewReport bank={bank} />}
            {activeTab === 'edit' && <EditReport bank={bank} />}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {activeTab === 'add' && <AddReport bank={bank} />}
            {activeTab === 'view' && <ViewReport bank={bank} />}
            {activeTab === 'edit' && <EditReport bank={bank} />}
          </div>
        )
      }
      </main>

    </section>
  );
}

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
        <div className="absolute -bottom-4.25 left-0 w-full h-0.5 bg-[#9823ff] shadow-[0_0_10px_#9823ff]" />
      )}
    </button>
  );
}