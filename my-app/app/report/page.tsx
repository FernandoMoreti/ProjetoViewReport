'use client'

import { useState } from "react"
import axios from "axios"
import { FileUp, Loader, ChevronDown, FileText, Building2 } from "lucide-react"

interface ReportData {
    archive: [{
        ID: number;
        Importação: string;
        Banco: string;
        Arquivo: string;
        Lidos: number,
        Novos: number,
        Alterados: number,
        Tipo: string;
        Usuário: string;
        Processo: string;
    }];
    expectReceived: number;
    nameReport: string;
    timesReceived: number;
}

export default function Report() {
    const [file, setFile] = useState<File | null>(null)
    const [results, setResults] = useState<ReportData[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    async function handleFile(e: React.FormEvent) {
        e.preventDefault()
        if (!file) return

        setLoading(true)
        const form = new FormData()
        form.append("file", file)

        try {
            const response = await axios.post(
                "http://192.168.1.90:30000/reports/validation",
                form,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            )

            setResults(Array.isArray(response.data) ? response.data : [response.data])
        } catch (e) {
            console.error("Erro no upload:", e)
            alert("Erro ao validar arquivo")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col bg-[#1e132f]/80 gap-6 w-full mx-auto h-auto min-h-full p-10">
            <div className="p-6 rounded-3xl border border-purple-500/20 shadow-xl backdrop-blur-sm">
                <form onSubmit={handleFile} className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                        <label className="flex items-center gap-4 cursor-pointer bg-[#0f081a]/50 border-2 border-dashed border-purple-500/30 p-4 rounded-2xl hover:border-purple-500/60 transition-all group">
                            <div className="bg-purple-600/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                <FileUp size={24} className="text-purple-400" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-gray-300 text-sm font-medium">
                                    {file ? file.name : "Clique ou arraste o arquivo de validação"}
                                </span>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Excel ou CSV (Máx 50MB)</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!file || loading}
                        className="w-full md:w-48 h-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader className="animate-spin" size={18} /> : "Validar"}
                    </button>
                </form>
            </div>
            {results && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
                    <div className="bg-[#1a0b2e] p-4 rounded-2xl border border-purple-500/10">
                        <p className="text-[10px] text-purple-400 font-bold uppercase">Total Bancos</p>
                        <p className="text-2xl font-black">{results.length}</p>
                    </div>
                    <div className="bg-[#1a0b2e] p-4 rounded-2xl border border-purple-500/10">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Esperados</p>
                        <p className="text-2xl font-black text-gray-200">{results.reduce((acc, i) => acc + i.expectReceived, 0)}</p>
                    </div>
                    <div className="bg-[#1a0b2e] p-4 rounded-2xl border border-purple-500/10 border-l-orange-500/50 border-l-4">
                        <p className="text-[10px] text-orange-400 font-bold uppercase">Processados</p>
                        <p className="text-2xl font-black text-orange-500">{results.reduce((acc, i) => acc + i.timesReceived, 0)}</p>
                    </div>
                    <div className="bg-[#1a0b2e] p-4 rounded-2xl border border-purple-500/10 border-l-green-500/50 border-l-4">
                        <p className="text-[10px] text-green-400 font-bold uppercase">Eficiência</p>
                        <p className="text-2xl font-black text-green-500">
                            {Math.round((results.reduce((acc, i) => acc + i.timesReceived, 0) / results.reduce((acc, i) => acc + i.expectReceived, 1)) * 100)}%
                        </p>
                    </div>
                </div>
            )}
            {results?.map((item, index) => (
                <div key={index} className="flex flex-col gap-1">
                    <div
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        className={`bg-[#1e132f]/60 hover:bg-[#1e132f] border ${expandedIndex === index ? 'border-purple-500' : 'border-purple-500/10'} rounded-2xl overflow-hidden shadow-lg transition-all cursor-pointer flex flex-col md:flex-row md:items-center p-4 gap-4`}
                    >
                        <div className="flex items-center gap-4 md:w-1/4">
                            <div className={`p-3 rounded-xl transition-colors ${expandedIndex === index ? 'bg-purple-600' : 'bg-purple-600/20'}`}>
                                <Building2 size={20} className={expandedIndex === index ? 'text-white' : 'text-purple-400'} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-bold text-sm text-white truncate">{item.nameReport}</span>
                                <span className="text-[9px] text-purple-400 font-black uppercase tracking-widest">COMISSAO</span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-2 px-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                                <span className="text-gray-500">Arquivos Recebidos</span>
                                <span className={item.timesReceived >= item.expectReceived ? "text-green-400" : "text-orange-400"}>
                                    {item.timesReceived} de {item.expectReceived}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-[#0f081a] rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-700 ${item.timesReceived >= item.expectReceived ? 'bg-green-500' : 'bg-orange-500'}`}
                                    style={{ width: `${Math.min((item.timesReceived / item.expectReceived) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end md:px-4">
                            <ChevronDown
                                size={20}
                                className={`text-gray-500 transition-transform duration-300 ${expandedIndex === index ? 'rotate-180 text-purple-500' : ''}`}
                            />
                        </div>
                    </div>

                    {expandedIndex === index && (
                        <div className="mx-4 bg-[#0f081a]/40 border-x border-b border-purple-500/20 rounded-b-2xl p-4 animate-in slide-in-from-top-2 duration-300">
                            <p className="text-[10px] font-bold text-purple-400 uppercase mb-3 tracking-widest">Arquivos na lista:</p>
                            {
                                item.archive.map((arquivo, index) => (
                                    <div key={index} className="grid grid-cols-1 gap-2 mt-2">
                                        <div className="flex items-center gap-3 bg-[#1e132f]/40 p-3 rounded-xl border border-white/5">
                                            <FileText size={14} className="text-gray-500" />
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-200 font-medium">{arquivo.Arquivo}</span>
                                                <span className="text-[10px] text-gray-600">ID Processo: {arquivo.ID}</span>
                                            </div>
                                            <div className="ml-auto flex gap-5 items-center justify-center">
                                                <div>
                                                    <div className="text-[9px] px-2 rounded-md font-bold">
                                                        Lidos: {arquivo.Lidos}
                                                    </div>
                                                    <div className="text-[9px] px-2 rounded-md font-bold">
                                                        Novos: {arquivo.Novos}
                                                    </div>
                                                    <div className="text-[9px] px-2 rounded-md font-bold">
                                                        Alterados: {arquivo.Alterados}
                                                    </div>
                                                </div>
                                                <div className="bg-orange-500/10 text-orange-500 text-[9px] px-2 py-1 rounded-md font-bold">
                                                    Usuario: {arquivo.Usuário}
                                                </div>
                                                <div className="bg-green-500/10 text-green-500 text-[9px] px-2 py-1 rounded-md font-bold">
                                                    PROCESSADO
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>
                ))}
        </div>
    )
}