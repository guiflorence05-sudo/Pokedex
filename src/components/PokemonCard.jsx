import { Link } from 'react-router-dom';
import { typeColors } from "../utils/pokemonColors";

function PokemonCard({ id, numero, nome, tipos, imagem }) {

  const tipoPrincipal = tipos[0]; 
  const tema = typeColors[tipoPrincipal];

  return (
      <Link 
          to={`/pokemon/${id}`}
          className="relative w-full md:max-w-[425px] h-[271px] md:h-[500px] rounded-[24px] md:rounded-[32px] p-[4px] md:p-[6px] hover:-translate-y-2 transition-all cursor-pointer mx-auto block"
          style={{ background: tema.gradienteBorda }}
          >
      <div className="relative w-full h-full bg-[#FFFEF7] dark:bg-[#1F2937] rounded-[20px] md:rounded-[26px] flex flex-col p-3 md:p-6 overflow-hidden">
        
        <div className="flex justify-between items-start w-full z-10">
          <span className="font-bold text-gray-500/60 text-[12px] md:text-[16px]">{numero}</span>
          
          <div className="flex gap-1 md:gap-2">
            {tipos.map((tipo, index) => {
              
              const corDesteTipo = typeColors[tipo]?.corPilula || "#A0A0A0";

              return (
                <span 
                  key={index} 
                  className="text-white text-[9px] md:text-[12px] font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase"
                  style={{ backgroundColor: corDesteTipo }} 
                >
                  {tipo}
                </span>
              );
            })}
          </div>
        </div>

        <div className="relative flex justify-center flex-grow items-center z-10">
          
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] md:w-[296px] md:h-[296px] rounded-full blur-[40px] md:blur-[70px] pointer-events-none z-[-1]"
            style={{ backgroundColor: tema.corFundo }}
          ></div>

          <img 
            src={imagem} 
            alt={nome} 
            className="relative w-[100px] sm:w-[120px] md:w-[200px] h-auto object-contain drop-shadow-xl z-10" 
          />
          
        </div>

        <h3 className="text-center text-[#5D5D5D] dark:text-[#D1D1D1] font-extrabold text-[16px] md:text-[24px] mb-1 md:mb-4 z-10">
          {nome}
        </h3>
        
      </div>
    </Link>
  );
}

export default PokemonCard;