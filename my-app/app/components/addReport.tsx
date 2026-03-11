'use client'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Calendar, Save, Plus, Loader, Trash2 } from 'lucide-react';
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

export default function AddReport() {
  const searchParams = useSearchParams()
  const bank = searchParams.get('bank')
  const todayStr = new Date().toISOString().split('T')[0];

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [reports, setReports] = useState<ReportAttributes[]>([]);

  const last30Days = generateLast30Days();

  useEffect(() => {
    async function getReports() {
      setReports([]);
      try {
        const body = {
          bank,
          date: selectedDate
        }
        const response = await axios.post("http://localhost:3003/reports/date", body)

        const data = response.data;

        if (Array.isArray(data)) {
          setReports(data);
        } else if (data && typeof data === 'object') {
          setReports([data]);
        } else {
          setReports([]);
        }
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
        setReports([])
      }
    }

    getReports()
  }, [selectedDate, bank])

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

  const updateField = (index: number, field: keyof ReportAttributes, value: any) => {
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
    }
  };

  return (
    <section className="flex flex-col bg-[#1a0b2e] min-h-screen p-6 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="pb-4 flex justify-between">
          <div>
            <label className="text-purple-400 text-xs font-bold uppercase mb-2 block">Data de Referência</label>
            <select
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#1a0b2e] text-purple-300 border border-purple-900/50 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-[#9823ff]"
            >
              {last30Days.map((date) => (
                <option key={date} value={date} className="bg-[#1a0b2e]">
                  {date.split('-').reverse().join('/')}
                </option>
              ))}
            </select>
          </div>
          <button
            className="flex items-center gap-3 p-4 px-10 rounded-xl transition-all duration-200 bg-linear-to-r from-[#9823ff] to-[#7022ff] text-white shadow-[0_4px_20px_rgba(152,35,255,0.3)] hover:-translate-y-1 font-bold"
          >
            Salvar Novos Relatorios
          </button>
        </div>

        {/* TABELA */}
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
                        <div className="flex items-center justify-center gap-2 text-xs text-white">
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

                      {/* DATA PROCESSAMENTO */}
                      <td className="px-6 py-8">
                        <input
                          type="date"
                          value={report.processedAt || ""}
                          onChange={(e) => updateField(index, 'processedAt', e.target.value)}
                          className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-[#9823ff]"
                        />
                      </td>

                      {/* REMOVER LINHA */}
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
      </form>

      <div className="flex justify-center mt-10">
        <button
          className="flex items-center gap-3 p-4 px-10 rounded-xl transition-all duration-200 bg-linear-to-r from-[#9823ff] to-[#7022ff] text-white shadow-[0_4px_20px_rgba(152,35,255,0.3)] hover:-translate-y-1 font-bold"
          onClick={handleAddReport}
        >
          <Plus size={20} />
          ADICIONAR RELATÓRIO
        </button>
      </div>
    </section>
  );
}
