'use client'
import { useEffect, useState } from "react";
import { Calendar } from 'lucide-react';
import axios from "axios";

interface TicketAttributes {
  bank: string;
  dateOfTicket: string;
  about: string;
  numTicket: string;
  resolved: boolean;
}


export default function ViewTicket() {

  const [tickets, setTickets] = useState<TicketAttributes[]>([]);

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
  }, [])

  const handleResolved = async (type: string) => {
    setTickets([]);
    try {
      let response
      if (type == "resolved") {
        response = await axios.get("http://192.168.1.90:30000/tickets/resolved")
      } else {
        response = await axios.get("http://192.168.1.90:30000/tickets")
      }

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

  return (
    <section className="flex flex-col bg-[#1a0b2e] min-h-screen p-6 text-white">
      <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="pb-4 flex justify-start gap-5">
          <div className="flex flex-col justify-end">
            <button
              onClick={() => handleResolved("Notresolved")}
              className="bg-[#1a0b2e] h-10 w-40 text-purple-300 border border-purple-900/50 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer hover:bg-[#9823ff]/50 hover:-translate-y-0.5"
            >
              Não Finalizados
            </button>
          </div>
          <div className="flex flex-col justify-end">
            <button
              onClick={() => handleResolved("resolved")}
              className="bg-[#1a0b2e] h-10 w-40 text-purple-300 border border-purple-900/50 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer hover:bg-[#9823ff]/50 hover:-translate-y-0.5"
            >
              Finalizados
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
                        <div className="flex justify-center gap-2 text-sm text-white">
                          <Calendar size={18} className="text-purple-500" />
                          <p className="text-sm">{ticket.dateOfTicket.split('-').reverse().join('/')}</p>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex items-center justify-center gap-2 text-sm font-bold text-white">
                          {ticket.bank}
                        </div>
                      </td>

                      <td className="px-4">
                        <div className="flex justify-center gap-2 text-sm text-white">
                          <p className="text-sm">{ticket.about}</p>
                        </div>
                      </td>

                      <td className="px-4 py-8">
                        <div className="flex justify-center gap-6">
                          <p className="text-sm">{ticket.numTicket}</p>
                        </div>
                      </td>

                      <td className="px-6 py-8">
                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            readOnly
                            checked={ticket.resolved || false}
                            className="w-6 h-6 rounded border-purple-500/20 bg-[#0f081a] accent-[#ff6b3d]"
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
      </div>
    </section>
  );
}
