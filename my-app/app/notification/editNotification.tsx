'use client'
import { useEffect, useState, useMemo } from "react";
import { Loader } from 'lucide-react';
import axios from "axios";

interface notificationAttributes {
  bank: string;
  date: string;
  notificated: boolean;
  received: boolean;
  obs: string;
  automatication: boolean;
}

export default function EditTicket() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<notificationAttributes[]>([]);
  const [refreshCount, setRefreshCount] = useState(0);
  const [bankFilter, setBankFilter] = useState("");
  const [receivedFilter, setReceivedFilter] = useState<boolean | null>(null);
  const [notificatedFilter, setNotificatedFilter] = useState<boolean | null>(null);
  const [autoFilter, setAutoFilter] = useState<boolean | null>(null);
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    async function getNotifications() {
      try {
        const response = await axios.get("http://192.168.1.90:30000/notification");
        const data = response.data;
        setNotifications(Array.isArray(data) ? data : (data ? [data] : []));
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
      }
    }
    getNotifications();
  }, [refreshCount]);

  const updateField = (index: number, field: keyof notificationAttributes, value: string | number | boolean) => {
    const updated = [...notifications];
    updated[index] = { ...updated[index], [field]: value };
    setNotifications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await axios.put("http://192.168.1.90:30000/notification", { notifications });
      alert("Dados salvos com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
      setRefreshCount(prev => prev + 1);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesBank = bankFilter === "" || item.bank.toLowerCase().includes(bankFilter.toLowerCase());
      const matchesReceived = receivedFilter === null || item.received === receivedFilter;
      const matchesNotificated = notificatedFilter === null || item.notificated === notificatedFilter;
      const matchesAuto = autoFilter === null || item.automatication === autoFilter;
      const matchesDate = dateFilter === "" || item.date === dateFilter;

      return matchesBank && matchesReceived && matchesNotificated && matchesAuto && matchesDate;
    });
  }, [notifications, bankFilter, receivedFilter, notificatedFilter, autoFilter, dateFilter]);


  return (
    <section className="flex flex-col bg-[#1a0b2e] min-h-screen p-6 text-white">
      <div className="w-full max-w-5xl mx-auto mb-6 flex gap-4 flex-wrap">
        <input
          type="date"
          className="bg-purple-900/30 text-white p-2 rounded-lg border border-purple-500/30 text-sm"
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <input
          placeholder="Filtrar por banco..."
          className="bg-purple-900/20 border border-purple-500/30 p-2 rounded-lg text-sm"
          onChange={(e) => setBankFilter(e.target.value)}
        />
        <button
          onClick={() => setNotificatedFilter(prev => prev === null ? true : prev === true ? false : null)}
          className="bg-purple-900/30 px-4 py-2 rounded-lg text-xs border border-purple-500/30"
        >
          Notificado: {notificatedFilter === null ? "Todos" : notificatedFilter ? "Sim" : "Não"}
        </button>
        <button
          onClick={() => setReceivedFilter(prev => prev === null ? true : prev === true ? false : null)}
          className="bg-purple-900/30 px-4 py-2 rounded-lg text-xs border border-purple-500/30"
        >
          Recebido: {receivedFilter === null ? "Todos" : receivedFilter ? "Sim" : "Não"}
        </button>
        <button
          onClick={() => setAutoFilter(prev => prev === null ? true : prev === true ? false : null)}
          className="bg-purple-900/30 px-4 py-2 rounded-lg text-xs border border-purple-500/30"
        >
          Automatizado: {autoFilter === null ? "Todos" : autoFilter ? "Sim" : "Não"}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-[#1a0b2e]/60 backdrop-blur-xl border border-purple-900/30 rounded-3xl p-1 shadow-2xl">
          <div className="overflow-hidden rounded-[22px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-900/20 border-b border-purple-900/10">
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Data</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Banco</th>
                  <th className="px-4 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Notificado</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Recebido</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Obs</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Automatizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/10 bg-[#1a0b2e]/40">
                {filteredNotifications.map((ticket, index) => (
                  <tr key={index} className="animate-in fade-in duration-300">
                    <td className="px-6 py-8 text-center text-sm">{ticket.date?.split('-').reverse().join('/')}</td>
                    <td className="px-6 py-8 text-center text-sm font-bold">{ticket.bank}</td>
                    <td className="px-6 py-8 text-center">
                      <input
                        type="checkbox"
                        checked={ticket.notificated}
                        onChange={(e) => updateField(index, 'notificated', e.target.checked)}
                        className="w-6 h-6 rounded border-purple-500/20 bg-[#0f081a] accent-[#ff6b3d] cursor-pointer"
                      />
                    </td>

                    <td className="px-6 py-8 text-center">
                      <input
                        type="checkbox"
                        checked={ticket.received}
                        onChange={(e) => updateField(index, 'received', e.target.checked)}
                        className="w-6 h-6 rounded border-purple-500/20 bg-[#0f081a] accent-[#ff6b3d] cursor-pointer"
                      />
                    </td>

                    <td className="px-4 py-8 text-center text-sm">
                      <input
                        type="text"
                        value={ticket.obs}
                        onChange={(e) => updateField(index, 'obs', e.target.value)}
                        className="w-auto p-1 rounded border-purple-500/20 bg-[#0f081a] accent-[#ff6b3d]"
                      />
                    </td>

                    <td className="px-6 py-8 text-center">
                      <input
                        type="checkbox"
                        checked={ticket.automatication}
                        onChange={(e) => updateField(index, 'automatication', e.target.checked)}
                        className="w-6 h-6 rounded border-purple-500/20 bg-[#0f081a] accent-[#ff6b3d] cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex w-60 items-center justify-center gap-3 p-4 rounded-xl transition-all bg-linear-to-r from-[#9823ff] to-[#7022ff] text-white hover:-translate-y-1 font-bold disabled:opacity-50"
          >
            {loading ? <Loader className="animate-spin" /> : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </section>
  );
}