'use client'
import { useEffect, useState } from "react";
import { FileText, Calendar, Loader, Trash2 } from 'lucide-react';
import axios from "axios";

interface TicketAttributes {
  id: number;
  bank: string;
  dateOfTicket: string;
  about: string;
  numTicket: string;
  resolved: boolean;
}

export default function EditTicket() {

  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<TicketAttributes[]>([]);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    async function getTickets() {
      setTickets([]);
      try {
        const response = await axios.get("http://192.168.1.90:30000/tickets")

        const data = response.data;

        if (Array.isArray(data)) {
          setTickets(data);
        } else if (data && typeof data === 'object') {
          setTickets([data]);
        } else {
          setTickets([]);
        }
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
        setTickets([])
      }
    }

    getTickets()
  }, [refreshCount])

  const updateField = (index: number, field: keyof TicketAttributes, value: string | number | boolean) => {
    const updated = [...tickets];
    updated[index] = { ...updated[index], [field]: value };
    setTickets(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tickets.length === 0) return alert("Adicione ao menos um relatório.");
    if (loading) return;
    setLoading(true);
    try {
      console.log(tickets)
      await axios.put("http://192.168.1.90:30000/tickets", { tickets });

      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Dados salvos com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
      setRefreshCount(prev => prev + 1);
    }
  };

  return (
    <section className="flex flex-col bg-[#1a0b2e] min-h-screen p-6 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="bg-[#1a0b2e]/60 backdrop-blur-xl border border-purple-900/30 rounded-3xl p-1 shadow-2xl">
          <div className="overflow-x-auto rounded-[22px]">
            <table className="text-left border-collapse w-full">
              <thead>
                <tr className="bg-purple-900/20 border-b border-purple-900/10">
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Data Ticket</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Banco</th>
                  <th className="px-4 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Motivo</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Ticket</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Resolvido</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-purple-900/10 bg-[#1a0b2e]/40">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-purple-500/50 italic text-sm">
                      Nenhum relatório encontrado nessa data.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket, index) => (
                    <tr key={index} className="animate-in fade-in duration-300">

                      <td className="px-6 py-8">
                        <div className="flex items-center justify-center gap-2 text-sm text-white">
                          <Calendar size={14} className="text-purple-500" />
                          {ticket.dateOfTicket.split('-').reverse().join('/')}
                        </div>
                      </td>

                      <td className="px-6 py-8">
                        <div className="flex items-center justify-center gap-2 text-xs text-white">
                          {ticket.bank}
                        </div>
                      </td>

                      <td className="px-4">
                        <div className="relative group">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/50" size={18} />
                          <input
                            type="text"
                            required
                            value={ticket.about}
                            onChange={(e) => updateField(index, 'about', e.target.value)}
                            placeholder="Ex: Não recebemos"
                            className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-[#9823ff] outline-none transition-all"
                          />
                        </div>
                      </td>

                      <td className="px-4">
                        <div className="relative group">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/50" size={18} />
                          <input
                            type="text"
                            required
                            value={ticket.numTicket}
                            onChange={(e) => updateField(index, 'numTicket', e.target.value)}
                            className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-[#9823ff] outline-none transition-all"
                          />
                        </div>
                      </td>

                      <td className="px-4 py-8">
                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ticket.resolved || false}
                            onChange={(e) => updateField(index, 'resolved', e.target.checked)}
                            className="w-20 h-6 rounded border-purple-500/20 bg-[#0f081a] accent-[#ff0000]"
                          />
                        </label>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center pt-6">
          <button
            className="flex w-60 items-center justify-center gap-3 p-4 px-10 rounded-xl transition-all duration-200 bg-linear-to-r from-[#9823ff] to-[#7022ff] text-white shadow-[0_4px_20px_rgba(152,35,255,0.3)] hover:-translate-y-1 font-bold"
          >
            {
              loading
              ? (
                  <>
                    <Loader className="animate-spin"/>
                    <p>Salvando...</p>
                  </>
                )
              : "Salvar Alterações"
            }
          </button>
        </div>
      </form>
    </section>
  );
}
