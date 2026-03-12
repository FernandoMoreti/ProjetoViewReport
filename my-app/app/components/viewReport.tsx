'use client'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Calendar, Loader } from 'lucide-react';
import { generateLast30Days } from "../utils/utils";
import axios from "axios";

interface ReportAttributes {
  id?: number
  dateOfReport: string;
  bankId: number;
  filename: string;
  received: boolean;
  processed: boolean;
  processedAt: string | null;
}

interface PropsEdit {
    bank: string
}

export default function ViewReport({ bank }: PropsEdit) {
  const todayStr = new Date().toISOString().split('T')[0];

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

  return (
    <section className="flex flex-col bg-[#1a0b2e] min-h-screen p-6 text-white">
      <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="pb-4 flex flex-col justify-between">
            <label className="text-purple-400 text-xs font-bold uppercase mb-2 block">Data de Referência</label>
            <select
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#1a0b2e] w-35 text-purple-300 border border-purple-900/50 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-[#9823ff]"
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
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Id</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Data Relatório</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Nome do Relatório</th>
                  <th className="px-4 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em] text-center">Data de Proc.</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-purple-900/10 bg-[#1a0b2e]/40">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-purple-500/50 italic text-sm">
                      Nenhum relatório encontrado nessa data.
                    </td>
                  </tr>
                ) : (
                  reports.map((report, index) => (
                    <tr key={index} className="animate-in fade-in duration-300">
                      <td className="px-6 py-8">
                        <div className="flex items-center justify-center gap-2 text-sm text-white">
                          {report.id}
                        </div>
                      </td>

                      <td className="px-6 py-8">
                        <div className="flex justify-center gap-2 text-xs text-white">
                          <Calendar size={18} className="text-purple-500" />
                          <p className="text-sm">{report.dateOfReport.split('-').reverse().join('/')}</p>
                        </div>
                      </td>

                      <td className="px-4">
                        <div className="flex justify-center gap-2 text-xs text-white">
                          <FileText className="left-3 text-purple-500" size={18} />
                          <p className="text-sm">{report.filename}</p>
                        </div>
                      </td>

                      <td className="px-4 py-8">
                        <div className="flex justify-center gap-6">
                          <label className="flex flex-col items-center gap-2 cursor-pointer">
                            <span className="text-[10px] font-bold text-purple-400/50 uppercase">Recebido</span>
                            <input
                              type="checkbox"
                              readOnly
                              checked={report.received || false}
                              className="w-6 h-6 rounded border-purple-500/20 bg-[#0f081a] accent-[#9823ff]"
                            />
                          </label>
                          <label className="flex flex-col items-center gap-2 cursor-pointer">
                            <span className="text-[10px] font-bold text-purple-400/50 uppercase">Processado</span>
                            <input
                              type="checkbox"
                              readOnly
                              checked={report.processed || false}
                              className="w-6 h-6 rounded border-purple-500/20 bg-[#0f081a] accent-[#ff6b3d]"
                            />
                          </label>
                        </div>
                      </td>

                      <td className="px-6 py-8">
                        <input
                          type="date"
                          readOnly
                          value={report.processedAt ? report.processedAt.slice(0, 10) : ""}
                          className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-[#9823ff]"
                        />
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
