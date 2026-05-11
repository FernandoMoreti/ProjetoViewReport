'use client'

import React, { useState } from 'react'
import logo from "../../public/logo.jpg"
import Image from 'next/image';

function App() {

  const [file, setFile] = useState<File | null>(null)
  const [banco, setBanco] = useState("")
  const [loading, setLoading] = useState(false)
  const [validar, setValidar] = useState(false)
  const [mostrar, setMostrar] = useState(false)
  const [mensagem, setMensagem] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)

    const formData = new FormData();
    formData.append("banco", banco)
    formData.append("arquivo", file!)

    if (!file || banco == "") {
      setMensagem(true)
      return
    }

    try {
      const response = await fetch("https://flask-backend-ipg8.onrender.com/execute", {
        method: "POST",
        body: formData,
      })

      if (response.ok){
        console.log("Deu tudo certo")
        const disposition = response.headers.get("content-disposition");
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition!);
        let filename = "arquivo.xlsx";

        console.log(disposition)
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
          filename = decodeURIComponent(filename);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setValidar(true)
      } else {
        setValidar(false)
      }
    } catch(error) {
      console.log("Erro ao enviar:", error)
      setValidar(false)
    } finally {
      setMostrar(true)
      setLoading(false)

      setTimeout(() => {
        setMensagem(false)
        setMostrar(false)
      }, 2000)
    }
  }

  const bancos = [
    "Aki",
    "Amigoz",
    "BmgCLT",
    "BRB360",
    "BRBInconta Validar",
    "BRBRed",
    "BTW",
    "Bv",
    "C6Auto",
    "C6bankComissao",
    // "C6_BANK",
    "C6Equity",
    "Caixa",
    "CAPITALCONSIGCancelados",
    "CAPITALCONSIGComissao",
    "CAPITALCONSIGSeguro",
    "ComissaoZerada",
    "Digio",
    "EmpresteiCred",
    "Euro",
    "Evol",
    "Facta",
    "Grandino",
    "Happy",
    "Hope",
    "Icred",
    "Jbcred",
    "Kardbank",
    "NBC",
    "NEO",
    "NovoSaque",
    "NovoSaqueCartao",
    "NYC",
    "ParanaBank",
    "PANLAFY",
    "PHtech",
    "Presenca",
    "QualiBank",
    "SafraComissaoZero",
    "SantanderFit",
    "SantanderFVEVI",
    "OLE_FVE",
    "TotalCash",
    "V8",
    "VctexNova",
    "VctexWl",
    "Viacerta",
    "WebCash"
   ]

  return (
      <div className='flex flex-col h-full'>
        <section className='flex flex-col h-full items-center bg-[#1a0b2e] text-gray-100 font-sans'>
          <p className={`absolute z-10 p-3 text-white transition-opacity duration-500 rounded-b-2xl font-bold text-center ${mostrar ? ' opacity-100 ' : ' opacity-0 '}${validar ? 'bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-red-600'}`}>
            {validar ? "Editado com sucesso" : mensagem ? "Faltando credenciais" : "Não foi possivel editar"}
          </p>

          <div className='flex-1 flex justify-center items-center backdrop-blur-sm'>
            <div className='flex flex-col p-10 h-120 w-120 bg-[#1e132f] border border-purple-500/20 shadow-2xl shadow-black/50 rounded-l-4xl'>
              <header className='mb-8 text-center'>
                <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Ferramenta Automática</span>
                <h1 className='text-2xl font-bold bg-linear-to-r from-purple-300 to-purple-600 bg-clip-text text-transparent'>
                    Conversor WORKBANK
                </h1>
                </header>

                <form onSubmit={handleSubmit} className='flex flex-col justify-center h-full gap-5' action="">
                <div>
                  <p className='text-sm font-bold text-gray-400 uppercase tracking-tighter mb-2'>Importe o relatório:</p>
                  <input
                    className="w-full bg-[#0f081a] border border-gray-800 mt-1 rounded-xl p-4 text-sm text-gray-300 shadow-inner cursor-pointer focus:border-purple-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-900/30 file:text-purple-400 hover:file:bg-purple-900/50" 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && setFile(e.target.files[0])}
                    type="file"
                  />
                </div>

                <div>
                  <p className='text-sm font-bold text-gray-400 uppercase tracking-tighter mb-2'>Escolha o banco:</p>
                  <select
                    onChange={(e) => {setBanco(e.target.value)}}
                    className='w-full bg-[#0f081a] border border-gray-800 mt-1 rounded-xl p-4 text-gray-200 shadow-inner cursor-pointer focus:border-purple-500 outline-none appearance-none transition-all' 
                    name="Banco"
                    id=""
                  >
                    <option className='hidden'>Escolha um banco</option>
                      {bancos.map((banco) => (
                        <option key={banco} value={banco} className="bg-[#1e132f]">{banco}</option>
                      ))}
                  </select>
                </div>

                <button
                    className='mt-4 bg-purple-600 text-white font-bold rounded-xl p-5 transition-all duration-300 cursor-pointer hover:bg-purple-500 hover:-translate-y-1 shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-95' 
                    type='submit'
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Carregando...
                    </span>
                  ) : "Criar arquivo"}
                </button>
              </form>
            </div>

            <div className="h-120 flex items-center bg-[#1e132f] rounded-r-4xl border border-l-0 border-purple-500/20 shadow-2xl">
              <Image
                className='logo w-120 rounded-br-4xl rounded-tr-4xl'
                src={logo}
                alt="Logo Workbank"
                width={120}
                height={120}
              />
            </div>
          </div>
        </section>
      </div>
  )
}

export default App
