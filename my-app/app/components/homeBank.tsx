import { Settings } from "lucide-react";

export default function HomeBank() {
  return (
    <section className="flex flex-col bg-[#1a0b2e] h-full p-6 text-white items-center justify-start">
        <div className="mb-8">
            <div className="bg-[#9823ff]/20 blur-2xl rounded-full animate-pulse"></div>
                <div className="bg-[#1a0b2e] border border-purple-500/20 p-6 rounded-3xl shadow-2xl">
                    <Settings size={48} className="text-[#9823ff] transition-transform duration-700 hover:rotate-90" />
                </div>
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl font-black mb-6 tracking-tighter">
            BEM-VINDO
        </h1>

        {/* Mensagem de Orientação */}
        <p className="text-purple-300/60 text-lg leading-relaxed w-160 text-center">
            Este é o espaço dedicado à configuração da sua infraestrutura de monitoramento.
            Para prosseguir com o cadastro ou edição das suas unidades bancárias,
            <span className="text-white font-semibold"> selecione uma opção no menu acima.</span>
        </p>
    </section>
  );
}
