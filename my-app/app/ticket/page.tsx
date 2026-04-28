'use client'
import { useState } from "react";
import { TabButton } from "../components/ui/TabButton";
import ViewTicket from "../components/viewTicket";
import AddTicket from "../components/addTicket";
import EditTicket from "../components/editTicket";

export default function Ticket() {
  const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view');

  return (
    <section className="flex flex-col bg-[#1a0b2e] min-h-full p-5 text-white">
      <div className="w-full max-w-5xl mx-auto">
        <header className="flex justify-between items-end border-b border-purple-900/30 pb-4">
          <div>
            <span className="text-xs font-bold text-purple-500 uppercase tracking-tighter">Gerenciamento</span>
            <h1 className="text-4xl font-bold text-white">Ticket</h1>
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
        <div className="animate-in fade-in duration-500">
            {activeTab === 'add' && <AddTicket />}
            {activeTab === 'view' && <ViewTicket />}
            {activeTab === 'edit' && <EditTicket />}
        </div>
      </main>
    </section>
  );
}
