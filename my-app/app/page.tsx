'use client'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Calendar, Save, CheckCircle, Loader } from 'lucide-react';
import { generateLast30Days } from "./utils/utils";

export default function Home() {
  const searchParams = useSearchParams()
  const bank = searchParams.get('bank')
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomeRelatorio: '',
    recebido: false,
    processado: false,
    dataInicio: '',
    dataFinal: '',
  });

  const last30Days = generateLast30Days();


  useEffect(() => {
    try {
      // Acessar o backend
    } catch (error) {
      throw error
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Enviando para o banco de dados:", formData);

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay da API
    setLoading(false);
    alert("Dados salvos com sucesso no banco!");
  };

  return (
    <section className="bg-[#1a0b2e] h-full p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex justify-between items-center mb-2 pb-6 border-b border-[#443459]">
          <h1 className="font-bold text-4xl">{bank}</h1>
          <button type="submit" disabled={loading} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group bg-linear-to-r from-[#9823ff] to-[#7022ff] text-white shadow-[0_4px_20px_rgba(152,35,255,0.3)] cursor-pointer hover:-translate-y-0.5">
            {loading ? <Loader className="animate-spin" size={18} /> : <FileText size={18} />}
            {loading ? "SALVANDO..." : "SALVAR ALTERAÇOES"}
          </button>
        </header>

        <div className="pb-2">
          <select
            id="date"
            value={formData.dataInicio}
            onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
            className="bg-[#1a0b2e] text-purple-300 border border-purple-900/50 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-[#9823ff]"
          >
            {last30Days.map((date) => (
              <option key={date} value={date} className="bg-[#1a0b2e]">
                {date.split('-').reverse().join('/')}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-[#1a0b2e]/60 backdrop-blur-xl border border-purple-900/30 rounded-3xl p-1 shadow-2xl">
          <div className="overflow-hidden rounded-[22px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-900/20 border-b border-purple-900/10">
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Data De hoje</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Relatório</th>
                  <th className="px-4 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Data de Processamento</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-purple-900/10 bg-[#1a0b2e]/40">
                <tr>
                  <td className="px-6 py-8 w-1/4">
                      <div className="relative flex-1">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/50" size={14} />
                        <p
                          className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white color-scheme-dark focus:border-[#9823ff] outline-none transition-all"
                        >
                          {formData.dataInicio}
                        </p>
                      </div>
                  </td>
                  <td>
                     <div className="group relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/50 group-focus-within:text-[#9823ff] transition-colors" size={18} />
                      <input
                        type="text"
                        required
                        value={formData.nomeRelatorio}
                        onChange={(e) => setFormData({...formData, nomeRelatorio: e.target.value})}
                        placeholder="Ex: Extrato C6 Mensal"
                        className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9823ff]/50 focus:border-[#9823ff] transition-all"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-8">
                    <div className="flex items-center justify-center gap-6">
                      <label className="flex flex-col items-center gap-2 cursor-pointer group">
                        <span className="text-[10px] font-bold text-purple-400/50 uppercase tracking-tighter group-hover:text-purple-300">Recebido</span>
                        <input
                          type="checkbox"
                          checked={formData.recebido}
                          onChange={(e) => setFormData({...formData, recebido: e.target.checked})}
                          className="w-6 h-6 rounded-lg border-purple-500/20 bg-[#0f081a] text-[#9823ff] focus:ring-offset-0 focus:ring-0 cursor-pointer accent-[#9823ff]"
                        />
                      </label>
                      <label className="flex flex-col items-center gap-2 cursor-pointer group">
                        <span className="text-[10px] font-bold text-purple-400/50 uppercase tracking-tighter group-hover:text-purple-300">Processado</span>
                        <input
                          type="checkbox"
                          checked={formData.processado}
                          onChange={(e) => setFormData({...formData, processado: e.target.checked})}
                          className="w-6 h-6 rounded-lg border-purple-500/20 bg-[#0f081a] text-[#ff6b3d] focus:ring-offset-0 focus:ring-0 cursor-pointer accent-[#ff6b3d]"
                        />
                      </label>
                    </div>
                  </td>

                  <td className="px-6 py-8">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/50" size={14} />
                        <input
                          type="date"
                          required
                          value={formData.dataInicio}
                          onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                          className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white color-scheme-dark focus:border-[#9823ff] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </section>
  );
}
