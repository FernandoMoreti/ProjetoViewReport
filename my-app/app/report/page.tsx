'use client'

import { useState } from "react"
import axios from "axios"
import { FileUp, FileText, CheckCircle, Info, Hash, Building2 } from "lucide-react"

// Interface baseada na resposta que você descreveu
interface ReportData {
    archive: {
        ID: number;
        Importação: string;
        Banco: string;
        Arquivo: string;
        Tipo: string;
    };
    expectReceived: number;
    nameReport: string;
    timesReceived: number;
}

export default function Report() {
    const [file, setFile] = useState<File | null>(null)
    const [results, setResults] = useState<ReportData[] | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleFile(e: React.FormEvent) {
        e.preventDefault()
        if (!file) return

        setLoading(true)
        const form = new FormData()
        form.append("file", file)

        try {
            const response = await axios.post(
                "http://localhost:3003/reports/validation",
                form,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            )

            console.log(response.data)
            setResults(Array.isArray(response.data) ? response.data : [response.data])
        } catch (e) {
            console.error("Erro no upload:", e)
            alert("Erro ao validar arquivo")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Seção de Upload */}
            <div className="bg-[#1e132f] p-8 rounded-3xl border border-purple-500/20 shadow-xl">
                <form onSubmit={handleFile} className="flex flex-col gap-6">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-500/30 rounded-2xl p-10 hover:border-purple-500/60 transition-all bg-[#0f081a]/50 group">
                        <FileUp size={48} className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                        <label className="cursor-pointer text-center">
                            <span className="text-gray-300 font-medium">Clique para selecionar ou arraste o arquivo</span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            {file && <p className="mt-2 text-purple-400 font-bold">{file.name}</p>}
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!file || loading}
                        className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
                    >
                        {loading ? "Validando..." : "Validar Relatório"}
                    </button>
                </form>
            </div>

            {/* Exibição Dinâmica dos Resultados */}
            {results && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {results.map((item, index) => (
                        <div key={index} className="bg-[#1e132f] border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="bg-purple-600/10 p-4 border-b border-purple-500/20 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Building2 size={18} className="text-purple-400" />
                                    <span className="font-bold text-purple-100">{item.nameReport}</span>
                                </div>
                                <div className="bg-purple-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-purple-300 uppercase">
                                    {item.archive.Tipo}
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Grid de Stats Rápidos */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#0f081a] p-3 rounded-xl border border-gray-800">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Esperado</p>
                                        <p className="text-xl font-bold text-white">{item.expectReceived}</p>
                                    </div>
                                    <div className="bg-[#0f081a] p-3 rounded-xl border border-gray-800">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Recebido</p>
                                        <p className="text-xl font-bold text-orange-500">{item.timesReceived}</p>
                                    </div>
                                </div>

                                {/* Detalhes do Arquivo */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Hash size={16} className="text-gray-500" />
                                        <span className="text-gray-400">ID:</span>
                                        <span className="text-gray-200">{item.archive.ID}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <FileText size={16} className="text-gray-500" />
                                        <span className="text-gray-400">Arquivo:</span>
                                        <span className="text-gray-200 truncate flex-1">{item.archive.Arquivo}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span className="text-gray-400">Importação:</span>
                                        <span className="text-gray-200">{item.archive.Importação}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer do Card */}
                            <div className="px-6 py-4 bg-[#160d25] border-t border-purple-500/10 flex items-center gap-2">
                                <Info size={14} className="text-purple-500" />
                                <p className="text-[11px] text-purple-300/60 italic">
                                    Processado via motor de validação v1.0
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}