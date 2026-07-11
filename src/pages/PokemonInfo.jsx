import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { ArrowLeft, Star } from 'lucide-react';
import { typeColors } from '../Utils/PokemonColors';

function PokemonInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [pokemon, setPokemon] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [isFavorito, setIsFavorito] = useState(false);

  useEffect(() => {
    const buscarDetalhes = async () => {
      try {
        setCarregando(true);
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!resposta.ok) throw new Error("Pokémon não encontrado");
        
        const dados = await resposta.json();
        const formatado = {
          id: dados.id,
          numero: `#${dados.id.toString().padStart(3, '0')}`,
          nome: dados.name.charAt(0).toUpperCase() + dados.name.slice(1),
          tipos: dados.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)),
          imagem: dados.sprites.other['official-artwork'].front_default,
          altura: (dados.height / 10).toFixed(1), 
          peso: (dados.weight / 10).toFixed(1),
          habilidades: dados.abilities.map(a => 
            a.ability.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
          ),
          stats: dados.stats.map(s => ({
            nomeOriginal: s.stat.name,
            valor: s.base_stat,
            nomeTraduzido: traduzirStat(s.stat.name),
            cor: s.stat.name.includes('special') ? 'bg-blue-500' : 'bg-red-500'
          }))
        };

        formatado.totalStats = formatado.stats.reduce((acc, stat) => acc + stat.valor, 0);
        setPokemon(formatado);
      } catch (err) {
        console.error(err);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    };

    buscarDetalhes();
  }, [id]);

  useEffect(() => {
    if (pokemon) {
      const favoritosSalvos = JSON.parse(localStorage.getItem('favoritosPokemons')) || [];
      if (favoritosSalvos.includes(pokemon.numero)) {
        setIsFavorito(true);
      } else {
        setIsFavorito(false);
      }
    }
  }, [pokemon]);

  const alternarFavorito = () => {
    const favoritosSalvos = JSON.parse(localStorage.getItem('favoritosPokemons')) || [];
    let novaLista;

    if (isFavorito) {
      novaLista = favoritosSalvos.filter(num => num !== pokemon.numero);
    } else {
      novaLista = [...favoritosSalvos, pokemon.numero];
    }

    localStorage.setItem('favoritosPokemons', JSON.stringify(novaLista));
    setIsFavorito(!isFavorito);
  };

  const traduzirStat = (nome) => {
    const dicionario = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defesa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defesa Especial',
      'speed': 'Velocidade'
    };
    return dicionario[nome] || nome;
  };

  if (carregando) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (erro || !pokemon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
         <p>Erro ao carregar o Pokémon</p>
      </div>
    );
  }

  const tipoPrincipal = pokemon.tipos[0];
  const coresAtuais = typeColors[tipoPrincipal] || typeColors.Normal;

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-6 md:py-10 px-4">
      
      <div className="w-full max-w-[1198px] flex justify-start mb-4 md:mb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-[#D6E9FF] to-[#FFE892] dark:bg-none dark:bg-[#1F2937] border-2 border-[#5D5D5D] dark:border-[#374151] rounded-full text-sm font-['Inter'] font-medium text-[#373737] dark:text-white transition outline-none"
        >
          <ArrowLeft size={16} />
          Voltar para Galeria
        </button>
      </div>

      <div 
        className="w-full max-w-[1198px] rounded-[24px] md:rounded-[40px] shadow-2xl p-[8px] md:p-[12px]"
        style={{ background: coresAtuais.gradienteBorda }}
      >
        <div 
          className="w-full h-full backdrop-blur-2xl rounded-[18px] md:rounded-[28px] overflow-hidden relative"
          style={{ background: `radial-gradient(circle at center, ${coresAtuais.corFundo}CC 40%, rgba(255, 255, 255, 0.4) 100%)` }}
        >
          
          <div className="w-full flex flex-col pt-6 md:pt-[48px] px-6 md:px-[64px] pb-4 md:pb-[32px] min-h-[300px] md:min-h-[528px] relative">
            <div className="flex justify-between items-start w-full relative z-10">
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="font-['Inter'] font-bold text-[18px] md:text-[32px] leading-[1.2] text-[#373737]/60">
                    {pokemon.numero}
                  </span>

                  <button 
                    onClick={alternarFavorito}
                    className="p-1 md:p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors outline-none cursor-pointer"
                    title={isFavorito ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                  >
                    <Star 
                      className={`w-6 h-6 md:w-8 md:h-8 transition-all duration-300 ${
                        isFavorito 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "fill-transparent text-[#373737]/60 hover:text-yellow-400"
                      }`} 
                    />
                  </button>
                </div>

                <h1 className="font-extrabold text-[28px] md:text-[48px] text-gray-900 leading-none mt-1">
                  {pokemon.nome}
                </h1>
              </div>
              
              <div className="flex gap-2 md:gap-[16px] mt-1 md:mt-2">
                {pokemon.tipos.map((tipo, index) => (
                  <span 
                    key={index} 
                    className="flex items-center justify-center rounded-full px-4 py-1.5 md:px-[40px] md:py-[16px] text-white text-[12px] md:text-[16px] font-bold shadow-sm"
                    style={{ backgroundColor: typeColors[tipo] ? typeColors[tipo].corPilula : "#5D5D5D" }}
                  >
                    {tipo}
                  </span>
                ))}
              </div> 
              
            </div>
            
            <div className="w-full flex-grow flex justify-center items-center mt-4 md:mt-8 z-10 relative">
              <img 
                src={pokemon.imagem} 
                alt={pokemon.nome} 
                className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[420px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300 relative z-10" 
              />
            </div>
          </div>

          <div className="w-full bg-white dark:bg-[#D1D1D1] rounded-[24px] md:rounded-[32px] p-6 md:p-12 flex flex-col gap-6 md:gap-10 transition-colors duration-300 shadow-sm dark:shadow-gray-900/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-gray-800 dark:text-gray-900 text-base md:text-lg">Informações Físicas</h3>
                
                <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-300/60 rounded-xl px-4 py-3 transition-colors">
                  <span className="text-gray-500 dark:text-gray-600 font-medium text-sm md:text-base">Altura</span>
                  <span className="font-bold text-gray-800 dark:text-gray-900 text-sm md:text-base">{pokemon.altura} m</span>
                </div>
                <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-300/60 rounded-xl px-4 py-3 transition-colors">
                  <span className="text-gray-500 dark:text-gray-600 font-medium text-sm md:text-base">Peso</span>
                  <span className="font-bold text-gray-800 dark:text-gray-900 text-sm md:text-base">{pokemon.peso} kg</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-gray-800 dark:text-gray-900 text-base md:text-lg">Habilidades</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.habilidades.map((hab, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 dark:bg-gray-300/60 border border-gray-200 dark:border-gray-400/50 text-gray-700 dark:text-gray-900 px-3 md:px-4 py-1.5 md:py-2 rounded-xl font-['Inter'] text-sm md:text-base font-medium transition-colors"
                    >
                      {hab}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-900 text-base md:text-lg mb-0 md:mb-2">Estatísticas de Batalha</h3>
              
              {pokemon.stats.map((stat, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-600 font-medium text-xs md:text-sm">{stat.nomeTraduzido}</span>
                    <span className="font-bold text-gray-800 dark:text-gray-900 text-xs md:text-sm">{stat.valor}</span>
                  </div>
                  <div className="w-full h-2 md:h-2.5 bg-gray-200 dark:bg-gray-400 rounded-full overflow-hidden transition-colors">
                    <div 
                      className={`h-full ${stat.cor} rounded-full`} 
                      style={{ width: `${(stat.valor / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-400/60 rounded-xl px-5 md:px-6 py-3 md:py-4 mt-2 md:mt-4 transition-colors">
                <span className="text-gray-600 dark:text-gray-800 font-bold text-sm md:text-base">Total</span>
                <span className="font-black text-lg md:text-xl text-gray-800 dark:text-gray-900">{pokemon.totalStats}</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PokemonInfo;