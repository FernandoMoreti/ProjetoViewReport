'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Calendar, CheckCircle2, Loader, Clock, FileUp, Activity, TrendingUp, ShieldAlert, FileText } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../components/ui/card'
import { times_for_day } from '../utils/utils'

export interface Bank {
  id: number;
  name: string;
}

export interface BankReport {
  id: number;
  bankId: number;
  bank: Bank;
  dateOfReport: string;
  filename: string;
  notreceived: boolean;
  processed: boolean;
  processedAt: string | null;
  received: boolean;
}

export default function Dashboard() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [reportsProcessed, setReportsProcessed] = useState<BankReport[]>([])
  const [reportsNotProcessed, setReportsNotProcessed] = useState<BankReport[]>([])
  const [reportsReceived, setReportsReceived] = useState<BankReport[]>([])
  const [recentActivity, setRecentActivity] = useState<BankReport[]>([])
  const [expectedCountMin, setExpectedCountMin] = useState(0)
  const [expectedCountMax, setExpectedCountMax] = useState(0)
  const [initialDate, setInitialDate] = useState(todayStr)
  const [finalDate, setFinalDate] = useState(todayStr)
  const [isReport, setIsReport] = useState(true)
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const COLORS = {
    processed: '#ff6b3d',
    received: '#9823ff',
    notReceived: '#ef4444',
    background: '#1a0b2e'
  }

  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  useEffect(() => {
    async function fetchData() {
      setReportsNotProcessed([])
      setReportsProcessed([])
      setReportsReceived([])
      try {

        const response = await axios.post("http://192.168.1.90:30000/reports/date", {
          bank: "Todos os Bancos", date: initialDate, dateFinal: initialDate
        })

        let reports = response.data || [];

        if (!isReport) {
          const mapBancosUnicos = new Map();
          reports.forEach((report: BankReport) => {
            if (!mapBancosUnicos.has(report.bankId)) {
              mapBancosUnicos.set(report.bankId, report);
            }
          });

          reports = Array.from(mapBancosUnicos.values());

          const bankByDay = await axios.get('http://192.168.1.90:30000/dayOfWeek')
          const dayOfWeek = days[new Date(initialDate).getDay() + 1];
          const filteredBanks = bankByDay.data.filter((b: { dayOfWeek: string }) => b.dayOfWeek === dayOfWeek)
          
          setExpectedCountMin(filteredBanks.length)
        } else {
          
        }

        const listOfNotProcessed = reports.filter((r: BankReport) => r.notreceived);
        const listOfProcessed = reports.filter((r: BankReport) => r.processed);
        const listOfReceived = reports.filter((r: BankReport) => r.received && !r.processed);

        setReportsProcessed(listOfProcessed);
        setReportsNotProcessed(listOfNotProcessed);
        setReportsReceived(listOfReceived);

        setRecentActivity(reports.slice(-5).reverse());

      } catch (e) {
        console.error("Erro ao buscar dados do painel:", e)
      }
    }
    fetchData()
  }, [initialDate, isReport])

  async function handleFile(e: React.FormEvent) {
    e.preventDefault()
    
    const countReportsMin: number = 0;
    const countReportsMax: number = 0;


    const form = new FormData()
    form.append("file", file!)
    form.append("initialDate", initialDate)
    form.append("finalDate", finalDate)

    try {
      const response = await axios.post(
        "http://localhost:3010/valid",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

      const data = response.data
      
      for (const bank of Object.keys(data.expected)) {
        let min: number = 0
        let max: number = 0
        for (const value of data.expected[bank]) {
          min += value.min
          max += value.max
        }

        data.expected[bank] = {
          min: min,
          max: max,
        }
      }

      console.log(data.expected)

      for (const bank of Object.keys(data.reportsByBank)) {
        // console.log(data.reportsByBank[bank])
      }

      setExpectedCountMin(data.min)
      setExpectedCountMax(data.max)

    } catch (e) {
      console.error(e)
    }


    setShow(true)
    
  }

  const pieData = [
    { name: 'Processados', value: reportsProcessed.length, color: COLORS.processed },
    { name: 'Aguardando Processamento', value: reportsReceived.length, color: COLORS.received },
    { name: 'Não Recebidos', value: reportsNotProcessed.length, color: COLORS.notReceived },
  ];

  const barData = [
    { name: 'Processados', quantidade: reportsProcessed.length, fill: COLORS.processed },
    { name: 'Aguardando', quantidade: reportsReceived.length, fill: COLORS.received },
    { name: 'Pendentes', quantidade: reportsNotProcessed.length, fill: COLORS.notReceived },
  ];

  const totalConcluded = reportsProcessed.length + reportsNotProcessed.length;
  const progressPercentage = expectedCountMin > 0 ? Math.round((totalConcluded / expectedCountMin) * 100) : 0;

  return (
    <section className="bg-[#1a0b2e] min-h-screen p-6 md:p-10 text-white font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-purple-500/10 pb-6">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#ff6b3d] flex items-center gap-3">
              <Activity className="text-purple-400" />
              Painel de Operações
            </h1>
            <p className="text-purple-300/50 mt-1 flex items-center gap-2">
              <Calendar size={14} /> Resumo diário de arquivos bancários
            </p>
          </div>
          <div>
            <button 
              onClick={() => setIsReport(true)}

            >
              <p>Relatorio</p>
            </button>
            <button 
              onClick={() => setIsReport(false)}

            >
              <p>Banco</p>
            </button>
          </div>
          <div className='pl-60'>
            <p className="text-purple-300/50 text-sm mt-1 flex items-center gap-2">
              Data Inicial
            </p>
            <input
              className="text-l font-black text-white flex items-center gap-3"
              value={initialDate}
              type='date'
              onChange={(e) => setInitialDate(e.target.value)}
            />
            <p className="text-purple-300/50 text-sm mt-1 flex items-center gap-2">
              Data Final
            </p>
            <input
              className="text-l font-black text-white flex items-center gap-3"
              value={finalDate}
              type='date'
              onChange={(e) => setFinalDate(e.target.value)}
            />
          </div>
          <div className="bg-[#0f081a]/50 border border-purple-500/20 px-6 py-3 rounded-2xl flex-col items-center gap-4">
            <div className="text-left">
              <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">Progresso do Dia</p>
              <p className="text-xl font-bold text-white">{progressPercentage}%</p>
            </div>
            <div className="w-24 h-2 bg-purple-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#9823ff] to-[#ff6b3d]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </header>

        {isReport ? (
          <>
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

            {show && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  <StatCard
                    title="Total Esperado"
                    value={expectedCountMin}
                    subtitle="Relatorios hoje"
                    icon={TrendingUp}
                    colorClass="text-blue-400"
                    shadowColor="hover:shadow-blue-500/10"
                  />
                  <StatCard
                    title="Processados"
                    value={pieData[0].value}
                    subtitle="concluídos"
                    icon={CheckCircle2}
                    colorClass="text-[#ff6b3d]"
                    shadowColor="hover:shadow-[#ff6b3d]/10"
                  />
                  <StatCard
                    title="Apenas Recebidos"
                    value={pieData[1].value}
                    subtitle="na fila"
                    icon={Clock}
                    colorClass="text-[#9823ff]"
                    shadowColor="hover:shadow-[#9823ff]/10"
                  />
                  <StatCard
                    title="Não Recebidos"
                    value={pieData[2].value}
                    subtitle="pendências"
                    icon={ShieldAlert}
                    colorClass="text-red-400"
                    shadowColor="hover:shadow-red-500/10"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  
                  <div className="bg-white/2 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:col-span-1 flex flex-col">
                    <h2 className="text-sm font-bold text-purple-300 uppercase tracking-widest mb-6">Distribuição de Status</h2>
                    <div className="flex-1 min-h-62.5">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f081a', borderColor: '#3b0764', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-3 mt-4">
                      {pieData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-purple-200/70">{item.name}</span>
                          </div>
                          <span className="font-bold text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/2 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:col-span-1 flex flex-col">
                    <h2 className="text-sm font-bold text-purple-300 uppercase tracking-widest mb-6">Volume do Dia</h2>
                    <div className="flex-1 min-h-62.5 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="#6b21a8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#6b21a8" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip
                            cursor={{ fill: '#ffffff05' }}
                            contentStyle={{ backgroundColor: '#0f081a', borderColor: '#3b0764', borderRadius: '12px' }}
                          />
                          <Bar dataKey="quantidade" radius={[6, 6, 0, 0]}>
                            {barData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white/2 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:col-span-1 flex flex-col">
                    <h2 className="text-sm font-bold text-purple-300 uppercase tracking-widest mb-6">Atividade Recente</h2>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                      {recentActivity.length === 0 ? (
                        <p className="text-purple-500/50 text-sm text-center italic mt-10">Nenhuma atividade recente.</p>
                      ) : (
                        recentActivity.map((report, i) => (
                          <div key={i} className="flex items-start gap-4 p-3 rounded-2xl bg-white/2 border border-white/3 hover:bg-white/4 transition-colors">
                            <div className={`p-2 rounded-xl mt-1 ${report.processed ? 'bg-[#ff6b3d]/20 text-[#ff6b3d]' : report.received ? 'bg-[#9823ff]/20 text-[#9823ff]' : 'bg-red-500/20 text-red-500'}`}>
                              <FileText size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-white truncate max-w-45">
                                {report.bank?.name || 'Banco Desconhecido'}
                              </p>
                              <p className="text-xs text-purple-300/50 mt-1 truncate max-w-45">{report.filename}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Esperado"
                value={expectedCountMin}
                subtitle="bancos hoje"
                icon={TrendingUp}
                colorClass="text-blue-400"
                shadowColor="hover:shadow-blue-500/10"
              />
              <StatCard
                title="Processados"
                value={pieData[0].value}
                subtitle="concluídos"
                icon={CheckCircle2}
                colorClass="text-[#ff6b3d]"
                shadowColor="hover:shadow-[#ff6b3d]/10"
              />
              <StatCard
                title="Apenas Recebidos"
                value={pieData[1].value}
                subtitle="na fila"
                icon={Clock}
                colorClass="text-[#9823ff]"
                shadowColor="hover:shadow-[#9823ff]/10"
              />
              <StatCard
                title="Não Recebidos"
                value={pieData[2].value}
                subtitle="pendências"
                icon={ShieldAlert}
                colorClass="text-red-400"
                shadowColor="hover:shadow-red-500/10"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="bg-white/2 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:col-span-1 flex flex-col">
                <h2 className="text-sm font-bold text-purple-300 uppercase tracking-widest mb-6">Distribuição de Status</h2>
                <div className="flex-1 min-h-62.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f081a', borderColor: '#3b0764', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/2 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:col-span-1 flex flex-col">
                <h2 className="text-sm font-bold text-purple-300 uppercase tracking-widest mb-6">Volume do Dia</h2>
                <div className="flex-1 min-h-62.5 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#6b21a8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6b21a8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0f081a', borderColor: '#3b0764', borderRadius: '12px' }} />
                      <Bar dataKey="quantidade" radius={[6, 6, 0, 0]}>
                        {barData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/2 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:col-span-1 flex flex-col">
                <h2 className="text-sm font-bold text-purple-300 uppercase tracking-widest mb-6">Atividade Recente</h2>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {recentActivity.length === 0 ? (
                    <p className="text-purple-500/50 text-sm text-center italic mt-10">Nenhuma atividade recente.</p>
                  ) : (
                    recentActivity.map((report, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 rounded-2xl bg-white/2 border border-white/3 hover:bg-white/4 transition-colors">
                        <div className={`p-2 rounded-xl mt-1 ${report.processed ? 'bg-[#ff6b3d]/20 text-[#ff6b3d]' : report.received ? 'bg-[#9823ff]/20 text-[#9823ff]' : 'bg-red-500/20 text-red-500'}`}>
                          <FileText size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white truncate max-w-45">{report.bank?.name || 'Banco Desconhecido'}</p>
                          <p className="text-xs text-purple-300/50 mt-1 truncate max-w-45">{report.filename}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}