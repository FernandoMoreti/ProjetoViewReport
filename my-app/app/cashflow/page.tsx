'use client'
import { useEffect, useState } from "react";
import { FileText } from 'lucide-react';
import axios from "axios";

interface LiberationAttributes {
  id?: number
  agent: number;
  obs: string;
  resolved: boolean;
}

export default function ViewLiberation() {
  const [liberations, setLiberations] = useState<LiberationAttributes[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const getReports = async () => {
    setLiberations([]);
    try {
      const response = await axios.get("http://192.168.1.90:30002/liberation");
      const data = response.data;
      setLiberations(Array.isArray(data) ? data : (data ? [data] : []));
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
      setLiberations([]);
    }
  };

  useEffect(() => {
    getReports();
  }, [])

  const handleSendFeedback = async (e: React.FormEvent, liberation: LiberationAttributes) => {
    e.preventDefault();

    if (!liberation.id) return;

    setLoadingId(liberation.id);

    try {
      await axios.put("http://192.168.1.90:30002/liberation", { liberation });

      await getReports();

      alert("Dados enviados com sucesso!");

    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Falha ao enviar. Tente novamente.");
    } finally {
      setLoadingId(null);
    }
  };

  const updateField = (liberationToUpdate: LiberationAttributes, field: keyof LiberationAttributes, value: string | number | boolean) => {
    const index = liberations.findIndex(t =>
      t.id === liberationToUpdate.id
    );

    if (index !== -1) {
      const updated = [...liberations];
      updated[index] = { ...updated[index], [field]: value };
      setLiberations(updated);
    }
  };

  return (
    <section className="flex flex-col bg-[#1a0b2e] min-h-screen p-6 text-white">
      <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
            Solicitações de Liberação
          </h2>
          <p className="text-purple-400/60 text-sm mt-1">Gerencie e envie retornos aos parceiros</p>
        </div>

        <div className="bg-[#1a0b2e]/60 backdrop-blur-xl border border-purple-900/30 rounded-3xl p-1 shadow-2xl">
          <div className="overflow-x-auto rounded-[22px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-900/20 border-b border-purple-900/10">
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Cód Agente</th>
                  <th className="px-4 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Observações</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Ação</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-purple-900/10 bg-[#1a0b2e]/40">
                {liberations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-purple-500/50 italic text-sm">
                      Nenhum relatório encontrado nessa data.
                    </td>
                  </tr>
                ) : (
                  liberations.map((liberation, index) => (
                    <tr key={index} className="hover:bg-purple-900/5 transition-colors animate-in fade-in duration-300">
                      <td className="px-4 py-4">
                        <div className="flex justify-center items-center gap-2 text-sm">
                          <FileText className="text-purple-500" size={18} />
                          {liberation.agent}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <select value={liberation.obs} onChange={(e) => updateField(liberation, 'obs', e.target.value)} className="w-full bg-[#0f081a] border border-purple-500/20 py-2 px-3 rounded-xl text-xs text-purple-200 focus:border-purple-400 focus:outline-none transition-all">
                          <option value="" disabled selected>Selecione uma observação...</option>
                          <option value="aprovado">Aprovado</option>
                          <option value="pendente">Pendente de Documentação</option>
                          <option value="recusado">Recusado</option>
                        </select>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-[9px] font-bold uppercase ${liberation.resolved ? 'text-green-400' : 'text-red-400'}`}>
                            {liberation.resolved ? 'Resolvido' : 'Não Resolvido'}
                          </span>
                          <input
                            type="checkbox"
                            checked={liberation.resolved}
                            onChange={(e) => updateField(liberation, 'resolved', e.target.checked)}
                            className="w-8 h-4 rounded border-purple-500/20 bg-[#0f081a] accent-purple-500"
                          />
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          disabled={loadingId === liberation.id}
                          onClick={(e) => handleSendFeedback(e, liberation)}
                          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-lg
                            ${loadingId === liberation.id
                              ? 'bg-purple-800 cursor-not-allowed opacity-70'
                              : 'bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
                            } text-white`}
                        >
                          {loadingId === liberation.id ? 'ENVIANDO...' : 'ENVIAR'}
                        </button>
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
  )
}