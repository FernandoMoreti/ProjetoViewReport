'use client'
import { useEffect, useState } from "react";
import { FileText, Calendar, Plus, Trash2, Loader, Tickets } from 'lucide-react';
import axios from "axios";
import { TabButton } from "../components/ui/TabButton";

interface TicketAttributes {
  dateOfTicket: string;
  bank: string;
  reason: string;
  ticket: string;
  closed: boolean;
}

interface Bank {
  id: string;
  name: string;
}

export default function Ticket() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [reports, setReports] = useState<TicketAttributes[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view');

  useEffect(() => {
    async function getBanks() {
      try {
        const response = await axios.get('http://localhost:3003/banks')
        setBanks(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    getBanks()
  }, [])

  const handleAddReport = () => {
    const newRow: TicketAttributes = {
      dateOfTicket: selectedDate,
      bank: '',
      reason: '',
      ticket: '',
      closed: false,
    };
    setReports([...reports, newRow]);
  };

  const handleRemoveRow = (index: number) => {
    const updated = reports.filter((_, i) => i !== index);
    setReports(updated);
  };

  const updateField = (index: number, field: keyof TicketAttributes, value: string | number | boolean) => {
    const updated = [...reports];
    updated[index] = { ...updated[index], [field]: value };
    setReports(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reports.length === 0) return alert("Adicione ao menos um relatório.");
    if (loading) return;
    setLoading(true);
    try {
      console.log(reports)

      await axios.post("http://localhost:3003/reports", { reports });

      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Dados salvos com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
      setReports([])
    }
  };

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
            {activeTab === 'add' && <Ticket />}
            {activeTab === 'view' && <h1>Ola view</h1>}
            {activeTab === 'edit' && <h1>Ola edit</h1>}
        </div>
      </main>
      <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="pb-4 flex justify-between">
          <div className="pb-0 flex">
            <div className="flex flex-col justify-end">
              <label className="text-purple-400 text-xs font-bold uppercase mb-2 block tracking-widest">
                Data de Referência
              </label>

              <div className="relative group">
                <Calendar
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/50 group-focus-within:text-[#9823ff] transition-colors pointer-events-none"
                />

                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-[#1a0b2e] w-44 text-purple-300 border border-purple-900/50 rounded-xl py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#9823ff]/50 focus:border-[#9823ff] transition-all appearance-none cursor-pointer scheme-dark"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button
              type="button"
              className="flex items-center gap-3 p-4 px-10 rounded-xl transition-all duration-200 bg-linear-to-r from-[#9823ff] to-[#7022ff] text-white shadow-[0_4px_20px_rgba(152,35,255,0.3)] hover:-translate-y-1 font-bold"
              onClick={handleAddReport}
            >
              <Plus size={20} />
              ADICIONAR TICKET
            </button>
          </div>
        </div>

        <div className="bg-[#1a0b2e]/60 backdrop-blur-xl border border-purple-900/30 rounded-3xl p-1 shadow-2xl">
          <div className="overflow-hidden rounded-[22px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-900/20 border-b border-purple-900/10">
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Data Ticket</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Banco</th>
                  <th className="px-4 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Motivo</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Ticket</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Resolvido</th>
                  <th className="px-4"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-purple-900/10 bg-[#1a0b2e]/40">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-purple-500/50 italic text-sm">
                      Nenhum relatório adicionado. Clique no botão abaixo para começar.
                    </td>
                  </tr>
                ) : (
                  reports.map((report, index) => (
                    <tr key={index} className="animate-in fade-in duration-300">
                      <td className="px-6 py-8">
                        <div className="flex items-center justify-center gap-2 text-sm text-white">
                          <Calendar size={14} className="text-purple-500" />
                          {report.dateOfTicket.split('-').reverse().join('/')}
                        </div>
                      </td>

                      <td className="px-4">
                        <div className="relative group">
                          <select
                            required
                            value={report.bank}
                            onChange={(e) => updateField(index, 'bank', e.target.value)}
                            className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-3 px-3 text-sm text-white focus:border-[#9823ff] outline-none transition-all"
                          >
                            {banks.map((bank) => (
                                <option key={bank.id} value={bank.name}>{bank.name}</option>
                            ))}
                          </select>
                        </div>
                      </td>

                      <td className="px-4">
                        <div className="relative group">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/50" size={18} />
                          <input
                            type="text"
                            required
                            value={report.reason}
                            onChange={(e) => updateField(index, 'reason', e.target.value)}
                            placeholder="Ex: Entramos em contato com o banco"
                            className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-[#9823ff] outline-none transition-all"
                          />
                        </div>
                      </td>

                      <td className="px-4 py-8">
                        <div className="relative group">
                          <Tickets className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/50" size={18} />
                          <input
                            type="text"
                            required
                            value={report.ticket}
                            onChange={(e) => updateField(index, 'ticket', e.target.value)}
                            placeholder="Num do ticket"
                            className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-[#9823ff] outline-none transition-all"
                          />
                        </div>
                      </td>

                      <td className="px-6 py-8">
                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={report.closed || false}
                            onChange={(e) => updateField(index, 'closed', e.target.checked)}
                            className="w-6 h-6 rounded border-purple-500/20 bg-[#0f081a] accent-[#ff6b3d]"
                          />
                        </label>
                      </td>

                      <td className="px-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          className="text-purple-500/30 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex pt-6 w-full justify-center">
          <button
            className="flex justify-center items-center gap-3 p-4 px-10 rounded-xl transition-all duration-200 bg-linear-to-r from-[#9823ff] to-[#7022ff] text-white shadow-[0_4px_20px_rgba(152,35,255,0.3)] hover:-translate-y-1 font-bold"
          >
            {
              loading
              ? (
                  <>
                    <Loader className="animate-spin"/>
                    <p>Salvando...</p>
                  </>
                )
              : "Salvar Novos Tickets"
            }
          </button>
        </div>
      </form>
    </section>
  );
}
