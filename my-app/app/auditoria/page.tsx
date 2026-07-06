'use client'

import { useState, useEffect, useMemo } from 'react'
import { StatCard } from '../components/ui/StatCard'
import axios from 'axios'
import { 
  Calendar, CheckCircle2, DollarSign, Activity, 
  TrendingUp, Search, Filter, Building2, FileText 
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from 'recharts'

interface CommissionData {
  id: number;
  bank: string;
  proposal: string;
  typeCommission: string;
  pclCommission: number;
  valBase: number;
  valCommission: number;
  date: string;
  duplicate: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [data, setData] = useState<CommissionData[]>([])
  const [loading, setLoading] = useState(true)
  const [initialDate, setInitialDate] = useState(todayStr)
  const [finalDate, setFinalDate] = useState(todayStr)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBank, setSelectedBank] = useState('TODOS')
  const [selectedType, setSelectedType] = useState('TODOS')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const response = await axios.get("http://192.168.1.90:30000/proposal", {
          params: { startDate: initialDate, finalDate: finalDate }
        })
        const mockData = response.data.length > 0 ? response.data : [
          { id: 1, bank: "FALHOU", proposal: "FALHOU", typeCommission: "FALHOU", pclCommission: 0, valBase: 0, valCommission: 0, date: "2026-06-05T00:00:00.000Z" },
        ];
        setData(mockData)
      } catch (e) {
        console.error("Erro ao buscar dados do painel:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [initialDate, finalDate])

  const banks = useMemo(() => ['TODOS', ...Array.from(new Set(data.map(item => item.bank)))], [data])
  const commissionTypes = useMemo(() => ['TODOS', ...Array.from(new Set(data.map(item => item.typeCommission)))], [data])

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = item.proposal.toLowerCase().includes(searchTerm.toLowerCase())
      const matchBank = selectedBank === 'TODOS' || item.bank === selectedBank
      const matchType = selectedType === 'TODOS' || item.typeCommission === selectedType
      return matchSearch && matchBank && matchType
    })
  }, [data, searchTerm, selectedBank, selectedType])

  const stats = useMemo(() => {
    const totalBase = filteredData.reduce((acc, curr) => acc + curr.valBase, 0)
    const totalCommission = filteredData.reduce((acc, curr) => acc + curr.valCommission, 0)
    return {
      count: filteredData.length,
      totalBase,
      totalCommission,
      avgCommission: filteredData.length > 0 ? (totalCommission / filteredData.length) : 0
    }
  }, [filteredData])

  const duplicateData = useMemo(() => {
    const proposalCounts = data.reduce((acc, curr) => {
      const key = `${curr.proposal}|${curr.typeCommission}`;
      acc[key] = (acc[key] || 0) + 1;

      return acc;
    }, {} as Record<string, number>);

    const seenProposal = new Set();

    return data.filter(item => {
      const key = `${item.proposal}|${item.typeCommission}`;

      if (proposalCounts[key] > 1) {
        if (!seenProposal.has(item.proposal)) {
          seenProposal.add(item.proposal)
          return true
        }
      }
      return false;
    });
  }, [data]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const chartDataBank = useMemo(() => {
    const grouped = filteredData.reduce((acc, curr) => {
      acc[curr.bank] = (acc[curr.bank] || 0) + curr.valCommission
      return acc
    }, {} as Record<string, number>)
    return Object.keys(grouped).map(key => ({ name: key, total: grouped[key] }))
  }, [filteredData])

  return (
    <section className="bg-[#1a0b2e] min-h-screen p-6 md:p-10 text-white font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-purple-500/10 pb-6">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#ff6b3d] flex items-center gap-3">
              <Activity className="text-purple-400" />
              Painel de Comissões
            </h1>
            <p className="text-purple-300/50 mt-1 flex items-center gap-2">
              <Calendar size={14} /> Auditoria e resultados de arquivos bancários
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10'>
            <div>
              <label className="text-purple-300/50 text-xs block mb-1">Data Inicial</label>
              <input
                className="bg-[#130822] text-sm text-white border border-purple-500/20 rounded-lg px-3 py-2 outline-none focus:border-purple-400 transition-colors"
                value={initialDate} type='date' onChange={(e) => setInitialDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-purple-300/50 text-xs block mb-1">Data Final</label>
              <input
                className="bg-[#130822] text-sm text-white border border-purple-500/20 rounded-lg px-3 py-2 outline-none focus:border-purple-400 transition-colors"
                value={finalDate} type='date' onChange={(e) => setFinalDate(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/50" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por Proposta..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-400"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/50" size={18} />
              <select 
                value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-[#1a0b2e] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-purple-400"
              >
                {banks.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="relative w-full md:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/50" size={18} />
              <select 
                value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-[#1a0b2e] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-purple-400"
              >
                {commissionTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-purple-300">Carregando dados...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Linhas Processadas"
                value={stats.count}
                subtitle="no período selecionado"
                icon={FileText}
                colorClass="text-blue-400"
                shadowColor="hover:shadow-blue-500/10"
              />
              <StatCard
                title="Volume Base"
                value={formatCurrency(stats.totalBase)}
                subtitle="Soma de valores base"
                icon={TrendingUp}
                colorClass="text-[#9823ff]"
                shadowColor="hover:shadow-[#9823ff]/10"
              />
              <StatCard
                title="Total de Comissões"
                value={formatCurrency(stats.totalCommission)}
                subtitle="Receita gerada"
                icon={CheckCircle2}
                colorClass="text-green-400"
                shadowColor="hover:shadow-green-500/10"
              />
              <StatCard
                title="Ticket Médio (Comissão)"
                value={formatCurrency(stats.avgCommission)}
                subtitle="Por proposta"
                icon={DollarSign}
                colorClass="text-[#ff6b3d]"
                shadowColor="hover:shadow-[#ff6b3d]/10"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                <h3 className="text-lg font-bold mb-4 text-white/90">Comissões por Banco</h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataBank}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$ ${val}`} />
                      <RechartsTooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#130822', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                      <Bar dataKey="total" fill="#9823ff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col overflow-hidden">
                <h3 className="text-lg font-bold mb-4 text-white/90">Últimos Registros</h3>
                <div className="overflow-auto flex-1 custom-scrollbar">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-purple-300/50 uppercase sticky top-0 bg-[#1e1034] z-10">
                      <tr>
                        <th className="px-4 py-3 font-medium">Banco</th>
                        <th className="px-4 py-3 font-medium">Proposta</th>
                        <th className="px-4 py-3 font-medium">Tipo</th>
                        <th className="px-4 py-3 font-medium text-right">Comissão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.slice(0, 50).map((row) => (
                        <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 font-medium text-white">{row.bank}</td>
                          <td className="px-4 py-3 text-purple-200">{row.proposal}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-500/20 text-purple-300">
                              {row.typeCommission}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-green-400 font-semibold">
                            {formatCurrency(row.valCommission)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredData.length === 0 && (
                    <div className="text-center py-8 text-purple-300/50">Nenhum dado encontrado.</div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col overflow-hidden">
              <h3 className="text-lg font-bold mb-4 text-white/90">Registros Duplicados</h3>
              <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-purple-300/50 uppercase sticky top-0 bg-[#1e1034] z-10">
                    <tr>
                      <th className="px-4 py-3 font-medium">Banco</th>
                      <th className="px-4 py-3 font-medium">Proposta</th>
                      <th className="px-4 py-3 font-medium">Tipo</th>
                      <th className="px-4 py-3 font-medium text-right">Comissão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {duplicateData.length > 0 ? (
                      duplicateData.map((row) => (
                        <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 font-medium text-white">{row.bank}</td>
                          <td className="px-4 py-3 text-purple-200">{row.proposal}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-500/20 text-purple-300">
                              {row.typeCommission}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-right ${row.valCommission > 0 ? "text-green-400" : "text-red-400" } font-semibold`}>
                            {formatCurrency(row.valCommission)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-purple-300/50">
                          Nenhum registro duplicado encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffffff20; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ffffff40; }
      `}} />
    </section>
  )
}