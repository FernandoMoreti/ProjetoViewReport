'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Calendar, CheckCircle2, Loader, Clock, FileUp, Activity, TrendingUp, ShieldAlert, FileText } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../components/ui/card'

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

interface ExpectedValue {
  min: number;
  max: number;
  received?: number;
  reportsReceived?: ExpectedReport[];
  ok?: string;
  valueMore?: number;
  valueLess?: number;
}

interface ExpectedReport {
  ID: number;
  Arquivo: string;
  Importação: string;
  Tipo: string;
}

interface ExpectedData {
  [bankName: string]: ExpectedValue;
}

export default function Dashboard() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [reportsProcessed, setReportsProcessed] = useState<BankReport[]>([])
  const [reportsNotProcessed, setReportsNotProcessed] = useState<BankReport[]>([])
  const [reportsReceived, setReportsReceived] = useState<BankReport[]>([])
  const [recentActivity, setRecentActivity] = useState<BankReport[]>([])
  const [expectedCountMin, setExpectedCountMin] = useState(0)
  const [processed, setProcessed] = useState(0)
  const [more, setMore] = useState(0)
  const [less, setLess] = useState(0)
  const [initialDate, setInitialDate] = useState(todayStr)
  const [finalDate, setFinalDate] = useState(todayStr)
  const [isReport, setIsReport] = useState(true)
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dados, setDados] = useState<ExpectedData>({})
  const [file, setFile] = useState<File | null>(null)
  const [filePaste, setFilePaste] = useState<File | null>(null)
  const [filtroBanco, setFiltroBanco] = useState('TODOS')

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
    setLoading(true)

    const form = new FormData()
    form.append("file", file!)
    form.append("filePaste", filePaste!)
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

      const expectedObj = data.expected as Record<string, { min: number; max: number }[] | ExpectedValue>;
      
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

      
      const acharChaveExpectativa = (nomeBancoRecebido: string, expectedObj: unknown) => {
        let nomeLimpo = nomeBancoRecebido.trim().toLowerCase();
        nomeLimpo = nomeLimpo.replace(" ", "")
        return Object.keys(expectedObj!).find(chave => {
          let chaveLimpa = chave.trim().toLowerCase();
          chaveLimpa = chaveLimpa.replace(" - ", "")
          chaveLimpa = chaveLimpa.replace(" ", "")
          return chaveLimpa.includes(nomeLimpo) || nomeLimpo.includes(chaveLimpa);
        });
      };

      let totalReceived: number = 0
      let totalMore: number = 0
      let totalLess: number = 0

      const reportsByBankObj = data.reportsByBank as Record<string, ExpectedReport[]>;
      data.reportsByBank["WORKBANK"] = []

      for (const bank of Object.keys(data.reportsByBank)) {

        const arquivosVistos = new Set<string>();
        const relatoriosUnicos = reportsByBankObj[bank].filter((report: ExpectedReport) => {
          console.log(report)
          const nomeDoArquivo = report.Arquivo?.trim().toLowerCase();
          if (arquivosVistos.has(nomeDoArquivo)) {
            return false;
          }
          arquivosVistos.add(nomeDoArquivo);
          return true;
        });

        const totalRecebido = relatoriosUnicos.length;
        totalReceived += totalRecebido
        let isOk: string = ""
        let valueLess: number = 0
        let valueMore: number = 0

        const chaveExpectativa = acharChaveExpectativa(bank, expectedObj);

        if (chaveExpectativa) {
          const regrasDoBanco = expectedObj[chaveExpectativa] as { min: number; max: number };

          if (totalRecebido === regrasDoBanco.min) {
            isOk = "OK"
          } else if (totalRecebido > regrasDoBanco.max) {
            valueMore = totalRecebido - regrasDoBanco.max
            totalMore += valueMore
            isOk = "MAIS"
          } else {
            valueLess = regrasDoBanco.min - totalRecebido
            totalLess += valueLess
            isOk = "MENOS"
          }

          expectedObj[chaveExpectativa] = {
            min: regrasDoBanco.min,
            max: regrasDoBanco.max,
            received: totalRecebido,
            reportsReceived: data.reportsByBank[bank],
            ok: isOk,
            valueMore: valueMore,
            valueLess: valueLess
          }

        } else {
          console.log(`\n❌ BANCO: ${bank} -> Não possui nenhuma regra em 'expectedObj'`);
        }
      }

      console.log(dados)

      setDados(data.expected)
      setExpectedCountMin(data.min)
      setProcessed(totalReceived)
      setMore(totalMore)
      setLess(totalLess)

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-purple-500/10 pb-4">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#ff6b3d] flex items-center gap-3">
              <Activity className="text-purple-400" />
              Painel de Operações
            </h1>
            <p className="text-purple-300/50 mt-1 flex items-center gap-2">
              <Calendar size={14} /> Resumo diário de arquivos bancários
            </p>
          </div>
          <div className="flex bg-[#0f081a]/40 border border-purple-900/40 p-1 rounded-xl backdrop-blur-md">
            <button 
              onClick={() => setIsReport(true)}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer ${
                isReport 
                  ? "bg-purple-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/5" 
                  : "text-purple-400/60 hover:text-purple-200 hover:bg-purple-950/30"
              }`}
            >
              Relatório
            </button>
            <button 
              onClick={() => setIsReport(false)}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer ${
                !isReport 
                  ? "bg-[#ff6b3d]/20 text-white border border-[#ff6b3d]/30 shadow-lg shadow-[#ff6b3d]/5" 
                  : "text-purple-400/60 hover:text-purple-200 hover:bg-purple-950/30"
              }`}
            >
              Banco
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
                <p className='text-purple-300/50 text-sm flex items-center gap-2 mb-2'>Arquivo Workbank:</p>
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
              <div className="flex-1 w-full">
                <p className='text-purple-300/50 text-sm flex items-center gap-2 mb-2'>Arquivo Pasta:</p>
                <label className="flex items-center gap-4 cursor-pointer bg-[#0f081a]/50 border-2 border-dashed border-purple-500/30 p-4 rounded-2xl hover:border-purple-500/60 transition-all group">
                  <div className="bg-purple-600/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <FileUp size={24} className="text-purple-400" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-gray-300 text-sm font-medium">
                      {filePaste ? filePaste.name : "Clique ou arraste o arquivo de validação"}
                    </span>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Excel ou CSV (Máx 50MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFilePaste(e.target.files?.[0] || null)}
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
                    title="Apenas Recebidos"
                    value={dados.received}
                    subtitle="na fila"
                    icon={Clock}
                    colorClass="text-[#9823ff]"
                    shadowColor="hover:shadow-[#9823ff]/10"
                  />
                  <StatCard
                    title="Processados"
                    value={processed}
                    subtitle="concluídos"
                    icon={CheckCircle2}
                    colorClass="text-[#ff6b3d]"
                    shadowColor="hover:shadow-[#ff6b3d]/10"
                  />
                  <StatCard
                    title="Não Recebidos"
                    value={less}
                    subtitle="faltantes"
                    icon={ShieldAlert}
                    colorClass="text-red-400"
                    shadowColor="hover:shadow-red-500/10"
                  />
                  <StatCard
                    title="Processados a Mais"
                    value={more}
                    subtitle="extrapolados"
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
                <div className="bg-white/2 backdrop-blur-xl border border-white/5 rounded-3xl p-6 mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-sm font-bold text-purple-300 uppercase tracking-widest">
                        Relatórios por Instituição
                      </h2>
                      <p className="text-xs text-purple-300/50 mt-1">
                        Detalhamento de conformidade e arquivos recebidos por banco
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 bg-black/20 p-1 rounded-2xl border border-white/5 self-start sm:self-center">
                      {[
                        { id: 'TODOS', label: 'Todos' },
                        { id: 'OK', label: 'OKs' },
                        { id: 'FALTANDO', label: 'Faltantes' },
                        { id: 'SOBRANDO', label: 'Sobrando' },
                      ].map((botao) => (
                        <button
                          key={botao.id}
                          onClick={() => setFiltroBanco(botao.id)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                            filtroBanco === botao.id
                              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                              : 'text-purple-300/70 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {botao.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Object.entries(dados)
                      .filter(([_, bancoInfo]) => {
                        if (!bancoInfo || typeof bancoInfo !== 'object') return false;
                        
                        if (filtroBanco === 'OK') {
                          return bancoInfo.ok === 'OK';
                        }
                        if (filtroBanco === 'FALTANDO') {
                          return bancoInfo.ok === 'MENOS' || (bancoInfo.valueLess && bancoInfo.valueLess > 0);
                        }
                        if (filtroBanco === 'SOBRANDO') {
                          return bancoInfo.ok === 'MAIS' || (bancoInfo.valueMore && bancoInfo.valueMore > 0);
                        }
                        return true;
                      })
                      .map(([bancoNome, bancoInfo]) => {
                        let statusConfig = {
                          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                          label: 'OK'
                        };

                        if (bancoInfo.ok === 'MENOS' || bancoInfo.valueLess! > 0) {
                          statusConfig = {
                            bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                            label: `Faltam ${bancoInfo.valueLess || 0}`
                          };
                        } else if (bancoInfo.ok === 'MAIS' || bancoInfo.valueMore! > 0) {
                          statusConfig = {
                            bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                            label: `Extra +${bancoInfo.valueMore || 0}`
                          };
                        } else if (bancoInfo.received === undefined) {
                          statusConfig = {
                            bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                            label: 'Sem Envio'
                          };
                        }

                        return (
                          <div 
                            key={bancoNome} 
                            className="p-5 rounded-2xl bg-white/2 border border-white/5 hover:border-purple-500/30 hover:bg-white/4 transition-all duration-300 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-4">
                                <h3 className="font-bold text-white text-sm tracking-wide truncate max-w-[70%]">
                                  {bancoNome}
                                </h3>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusConfig.bg}`}>
                                  {statusConfig.label}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3 mb-4">
                                <div>
                                  <p className="text-[11px] text-purple-300/50 uppercase tracking-wider">Recebidos</p>
                                  <p className="text-lg font-semibold text-white mt-0.5">
                                    {bancoInfo.received ?? 0}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] text-purple-300/50 uppercase tracking-wider">Esperado (Min/Max)</p>
                                  <p className="text-sm font-medium text-purple-200 mt-1.5">
                                    {bancoInfo.min} a {bancoInfo.max}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-white/5 pt-3">
                              <p className="text-[11px] text-purple-300/50 uppercase tracking-wider mb-2 font-semibold">
                                Arquivos Recebidos ({bancoInfo.reportsReceived?.length || 0})
                              </p>
                              
                              {!bancoInfo.reportsReceived || bancoInfo.reportsReceived.length === 0 ? (
                                <p className="text-xs text-purple-400/30 italic py-1">Nenhum documento processado.</p>
                              ) : (
                                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                                  {bancoInfo.reportsReceived.map((report, idx) => (
                                    <div 
                                      key={report.ID || idx} 
                                      className="p-2 rounded-xl bg-white/2 border border-white/5 text-[11px] flex flex-col gap-1 hover:bg-white/5"
                                    >
                                      <div className="text-purple-200 font-medium truncate" title={report.Arquivo}>
                                        {report.Arquivo}
                                      </div>
                                      
                                      <div className="flex items-center justify-between text-[10px] text-purple-300/40">
                                        <span className="bg-purple-500/10 px-1 rounded text-purple-300 font-mono">
                                          #{report.ID}
                                        </span>
                                        <span>{report.Importação}</span>
                                        <span className="text-[#ff6b3d]/80 uppercase">{report.Tipo}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {Object.entries(dados).filter(([_, info]) => {
                    if (filtroBanco === 'OK') return info?.ok === 'OK';
                    if (filtroBanco === 'FALTANDO') return info?.ok === 'MENOS' || info.valueLess! > 0;
                    if (filtroBanco === 'SOBRANDO') return info?.ok === 'MAIS' || info.valueMore! > 0;
                    return true;
                  }).length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-sm text-purple-400/50 italic">Nenhuma instituição encontrada para este filtro.</p>
                    </div>
                  )}
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