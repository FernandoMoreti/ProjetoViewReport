'use client'
import { useEffect, useState } from "react";
import { FileText, Loader, Save } from 'lucide-react';
import axios from "axios";

interface BankAttributes {
  id: number
  name: string
}


export default function EditBank() {

  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState<BankAttributes[]>([]);


  useEffect(() => {
    async function getBanks() {
      setBanks([]);
      try {
        const response = await axios.get("http://localhost:3003/banks")

        const data = response.data;

        if (Array.isArray(data)) {
          setBanks(data);
        } else if (data && typeof data === 'object') {
          setBanks([data]);
        } else {
          setBanks([]);
        }
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
        setBanks([])
      }
    }

    getBanks()
  }, [])

  const updateField = (index: number, field: keyof BankAttributes, value: string | number | boolean) => {
    const updated = [...banks];
    updated[index] = { ...updated[index], [field]: value };
    setBanks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (banks.length === 0) return alert("Adicione ao menos um relatório.");
    if (loading) return;
    setLoading(true);
    try {

      await axios.put("http://localhost:3003/banks", { banks });

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
    <section className="flex flex-col bg-[#1a0b2e] min-h-screen p-6 text-white items-center justify-start">
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-[#1a0b2e]/60 backdrop-blur-xl border border-purple-900/30 rounded-3xl p-1 shadow-2xl w-full">
                <div className="overflow-hidden rounded-[22px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-purple-900/20 border-b border-purple-900/10">
                                <th className="px-6 py-5 text-xs font-bold text-purple-300 uppercase tracking-[0.2em]">
                                    Nome da Unidade / Banco
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-purple-900/10 bg-[#1a0b2e]/40">
                            {banks.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="py-20 text-center text-purple-500/50 italic text-sm">
                                Nenhum banco adicionado à lista.
                                </td>
                            </tr>
                            ) : (
                            banks.map((report, index) => (
                                <tr key={index} className="group animate-in fade-in duration-300">
                                    <td className="px-6 py-6">
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/50 group-focus-within:text-[#9823ff] transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                value={report.name}
                                                onChange={(e) => updateField(index, 'name', e.target.value)}
                                                placeholder="Ex: Santander, C6 Bank..."
                                                className="w-full bg-[#0f081a]/80 border border-purple-500/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-[#9823ff] outline-none transition-all"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-6 pb-6 flex justify-center">
                <button
                    type="submit"
                    className="flex items-center gap-3 p-3 px-8 rounded-xl transition-all duration-200 bg-linear-to-r from-[#9823ff] to-[#7022ff] text-white shadow-[0_4px_20px_rgba(152,35,255,0.3)] hover:-translate-y-1 font-bold text-sm"
                >
                    {
                        loading
                        ? (
                            <>
                                <Loader className="animate-spin"/>
                                <p>Salvando...</p>
                            </>
                            )
                        : (
                            <>
                                <Save size={18} />
                                <p>SALVAR BANCOS</p>
                            </>
                        )
                    }
                </button>
            </div>
        </form>
    </section>
  );
}
