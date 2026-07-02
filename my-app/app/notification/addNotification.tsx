'use client'
import { useEffect, useState } from "react";
import { Calendar, Plus, Trash2, Loader } from 'lucide-react';
import axios from "axios";

interface NotificationAtt {
  bank: string;
  date: string;
  notificated: boolean;
  received: boolean;
  notReceived: boolean;
  obs: string;
  automatication: boolean;
}

interface BankData {
  id: number;
  name: string;
}

export default function AddNotification() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [banks, setBanks] = useState<BankData[]>([]);
  const [notifications, setNotifications] = useState<NotificationAtt[]>([]);

  useEffect(() => {
    async function fetchBanks() {
      try {
        const response = await axios.get("http://192.168.1.90:30000/banks/notification")

        const banks = response.data || [];

        setBanks(banks)
      } catch(error) {
        console.error(error)
      }
    }

    fetchBanks()
  }, [])

  const handleAddReport = () => {
    const newRow: NotificationAtt = {
      bank: '',
      date: selectedDate,
      notificated: false,
      received: false,
      notReceived: false,
      obs: '',
      automatication: false,
    };
    setNotifications([...notifications, newRow]);
  };

  const handleRemoveRow = (index: number) => {
    const updated = notifications.filter((_, i) => i !== index);
    setNotifications(updated);
  };

  const updateField = (index: number, field: keyof NotificationAtt, value: string | boolean) => {
    const updated = [...notifications];
    updated[index] = { ...updated[index], [field]: value };
    setNotifications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notifications.length === 0) return alert("Adicione ao menos um relatório.");
    if (loading) return;

    setLoading(true);
    try {
      await axios.post("http://192.168.1.90:30000/notification", { notifications });

      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("Dados salvos com sucesso!");
      setNotifications([]);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col bg-[#1a0b2e] min-h-full px-6 text-white">
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
              ADICIONAR NOTIFICAÇÃO
            </button>
          </div>
        </div>

        <div className="bg-[#1a0b2e]/60 backdrop-blur-xl border border-purple-900/30 rounded-3xl p-1 shadow-2xl mt-4">
          <div className="overflow-hidden rounded-[22px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-900/20 border-b border-purple-900/10">
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Data Notificação</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Banco</th>
                  <th className="px-4 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Notificado</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Recebido</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Não Recebido</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">OBS</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Automatizado</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-purple-900/10 bg-[#1a0b2e]/40">
                {notifications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-purple-500/50 italic text-sm">
                      Nenhum relatório adicionado. Clique no botão acima para começar.
                    </td>
                  </tr>
                ) : (
                  notifications.map((notification, index) => (
                    <tr key={index} className="animate-in fade-in duration-300">
                      <td className="px-6 py-8">
                        <div className="flex items-center justify-center gap-2 text-sm text-white">
                          <Calendar size={14} className="text-purple-500" />
                          {notification.date.split('-').reverse().join('/')}
                        </div>
                      </td>

                      <td className="px-4">
                        <div className="relative group">
                          <select
                            required
                            value={notification.bank}
                            onChange={(e) => updateField(index, 'bank', e.target.value)}
                            className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-3 px-3 text-sm text-white focus:border-[#9823ff] outline-none transition-all appearance-none"
                          >
                            <option className="hidden">Selecione Um Banco</option>
                            {banks.map((bank) => (
                                <option key={bank.id} value={bank.name}>{bank.name}</option>
                            ))}
                          </select>
                        </div>
                      </td>

                      <td className="px-6 py-8">
                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notification.notificated}
                            onChange={(e) => updateField(index, 'notificated', e.target.checked)}
                            className="w-6 h-6 rounded border-purple-500/20 bg-[#0f081a] accent-[#ff6b3d]"
                          />
                        </label>
                      </td>

                      <td className="px-6 py-8">
                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notification.received}
                            onChange={(e) => updateField(index, 'received', e.target.checked)}
                            className="w-6 h-6 rounded border-purple-500/20 bg-[#0f081a] accent-[#ff6b3d]"
                          />
                        </label>
                      </td>

                      <td className="px-6 py-8">
                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notification.notReceived}
                            onChange={(e) => updateField(index, 'notReceived', e.target.checked)}
                            className="w-6 h-6 rounded border-purple-500/20 bg-[#0f081a] accent-[#ff6b3d]"
                          />
                        </label>
                      </td>

                      <td className="px-4 py-8">
                        <div className="relative group">
                          <input
                            type="text"
                            required
                            value={notification.obs}
                            onChange={(e) => updateField(index, 'obs', e.target.value)}
                            placeholder=""
                            className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-[#9823ff] outline-none transition-all"
                          />
                        </div>
                      </td>

                      <td className="px-6 py-8">
                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notification.automatication}
                            onChange={(e) => updateField(index, 'automatication', e.target.checked)}
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
            type="submit"
            disabled={loading || notifications.length === 0}
            className="flex justify-center items-center gap-3 p-4 px-10 rounded-xl transition-all duration-200 bg-linear-to-r from-[#9823ff] to-[#7022ff] text-white shadow-[0_4px_20px_rgba(152,35,255,0.3)] hover:-translate-y-1 font-bold disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
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