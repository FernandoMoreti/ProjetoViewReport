'use client'
import { useState } from "react";
import { FileText, Calendar, Plus, Trash2 } from 'lucide-react';
import { generateLast30Days } from "../utils/utils";
import axios from "axios";

interface ReportAttributes {
  dateOfReport: string;
  bankId: number;
  filename: string;
  received: boolean;
  processed: boolean;
  processedAt: string | null;
}

interface PropsAdd {
    bank: string
}

export default function AddReport({ bank }: PropsAdd) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [reports, setReports] = useState<ReportAttributes[]>([]);

  const last30Days = generateLast30Days();

  const handleAddReport = () => {
    const newRow: ReportAttributes = {
      dateOfReport: selectedDate,
      bankId: 0,
      filename: '',
      received: false,
      processed: false,
      processedAt: null,
    };
    setReports([...reports, newRow]);
  };

  const handleRemoveRow = (index: number) => {
    const updated = reports.filter((_, i) => i !== index);
    setReports(updated);
  };

  const updateField = (index: number, field: keyof ReportAttributes, value: string | number | boolean) => {
    const updated = [...reports];
    updated[index] = { ...updated[index], [field]: value };
    setReports(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reports.length === 0) return alert("Adicione ao menos um relatório.");
    setLoading(true);
    try {
      console.log(reports)

      await axios.post("http://localhost:3003/reports", { bank, reports });

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
    <section className="flex flex-col bg-[#1a0b2e] min-h-screen p-6 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="pb-4 flex justify-between">
          <div className="pb-4 flex justify-between">
            <div className="flex flex-col">
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
              ADICIONAR RELATÓRIO
            </button>
          </div>
        </div>

        <div className="bg-[#1a0b2e]/60 backdrop-blur-xl border border-purple-900/30 rounded-3xl p-1 shadow-2xl">
          <div className="overflow-hidden rounded-[22px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-900/20 border-b border-purple-900/10">
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Data Relatório</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Nome do Relatório</th>
                  <th className="px-4 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Data de Proc.</th>
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
                          {report.dateOfReport.split('-').reverse().join('/')}
                        </div>
                      </td>

                      <td className="px-4">
                        <div className="relative group">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/50" size={18} />
                          <input
                            type="text"
                            required
                            value={report.filename}
                            onChange={(e) => updateField(index, 'filename', e.target.value)}
                            placeholder="Ex: Extrato Mensal"
                            className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-[#9823ff] outline-none transition-all"
                          />
                        </div>
                      </td>

                      <td className="px-4 py-8">
                        <div className="flex items-center justify-center gap-6">
                          <label className="flex flex-col items-center gap-2 cursor-pointer">
                            <span className="text-[10px] font-bold text-purple-400/50 uppercase">Recebido</span>
                            <input
                              type="checkbox"
                              checked={report.received || false}
                              onChange={(e) => updateField(index, 'received', e.target.checked)}
                              className="w-6 h-6 rounded border-purple-500/20 bg-[#0f081a] accent-[#9823ff]"
                            />
                          </label>
                          <label className="flex flex-col items-center gap-2 cursor-pointer">
                            <span className="text-[10px] font-bold text-purple-400/50 uppercase">Processado</span>
                            <input
                              type="checkbox"
                              checked={report.processed || false}
                              onChange={(e) => updateField(index, 'processed', e.target.checked)}
                              className="w-6 h-6 rounded border-purple-500/20 bg-[#0f081a] accent-[#ff6b3d]"
                            />
                          </label>
                        </div>
                      </td>

                      <td className="px-6 py-8">
                        <input
                          type="date"
                          value={report.processedAt || ""}
                          onChange={(e) => updateField(index, 'processedAt', e.target.value)}
                          className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-[#9823ff]"
                        />
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
            Salvar Novos Relatorios
          </button>
        </div>
      </form>
    </section>
  );
}
