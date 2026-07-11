import { useState, useEffect } from 'react';
import Header from '../components/Header';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';
// 1. IMPORTAÇÃO DA ESTRELA
import { Star } from 'lucide-react';

function Home() {
  // 1. ESTADOS DE DADOS
  const [dicionario, setDicionario] = useState([]);
  const [pokemonsNaTela, setPokemonsNaTela] = useState([]);
  const [favoritos, setFavoritos] = useState([]); // <-- NOVO ESTADO PARA OS FAVORITOS
  const [busca, setBusca] = useState("");
  
  // 2. ESTADOS DE INTERFACE
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [quantidadeVisivel, setQuantidadeVisivel] = useState(20);

  const dicionarioFiltrado = dicionario.filter((poke) => {
    const termoDigitado = busca.toLowerCase();
    return (
      poke.name.toLowerCase().includes(termoDigitado) || 
      poke.id.includes(termoDigitado) 
    );
  });

  const lidarComBusca = (texto) => {
    setBusca(texto);
    setQuantidadeVisivel(20);
  };

  // CICLO 1: Baixar a prancheta leve (Uma única vez)
  useEffect(() => {
    const baixarDicionario = async () => {
      try {
        const resposta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const dados = await resposta.json();
        
        const dictNomeID = dados.results.map((poke) => {
          return {
            name: poke.name,
            url: poke.url,
            id: poke.url.split('/')[6]
          };
        });

        setDicionario(dictNomeID);
        
      } catch (erro) {
        console.error("Erro ao baixar dicionário", erro);
      }
    };
    baixarDicionario();
  }, []);

  // CICLO 1.5: CARREGAR OS FAVORITOS (Novo!)
  useEffect(() => {
    // Só tenta buscar os favoritos DEPOIS que o dicionário terminar de baixar
    if (dicionario.length === 0) return;

    const carregarFavoritos = async () => {
      try {
        const salvos = JSON.parse(localStorage.getItem('favoritosPokemons')) || [];
        
        if (salvos.length === 0) {
          setFavoritos([]);
          return;
        }

        // O localStorage guarda "#001". Precisamos transformar isso no ID "1" para achar no dicionário
        const idsFavoritos = salvos.map(num => parseInt(num.replace('#', ''), 10).toString());

        // Filtra o dicionário para pegar apenas as URLs dos favoritos
        const recorteFavoritos = dicionario.filter(poke => idsFavoritos.includes(poke.id));

        // Baixa os detalhes completos APENAS dos favoritos
        const promessas = recorteFavoritos.map(async (poke) => {
          const res = await fetch(poke.url);
          return await res.json();
        });

        const detalhesCompletos = await Promise.all(promessas);

        const formatados = detalhesCompletos.map((poke) => ({
          id: poke.id,
          numero: `#${poke.id.toString().padStart(3, '0')}`,
          nome: poke.name.charAt(0).toUpperCase() + poke.name.slice(1),
          tipos: poke.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)),
          imagem: poke.sprites.other['official-artwork'].front_default
        }));

        setFavoritos(formatados);
      } catch (erro) {
        console.error("Erro ao carregar favoritos", erro);
      }
    };

    carregarFavoritos();
  }, [dicionario]); // Roda sempre que o dicionário estiver pronto

  // CICLO 2: O Motor de Renderização (Reage à Busca e ao Scroll)
  useEffect(() => {
    if (dicionario.length === 0) return;

    const atualizarTela = async () => {
      try {
        const recorte = dicionarioFiltrado.slice(0, quantidadeVisivel);

        const promessas = recorte.map(async (poke) => {
          const res = await fetch(poke.url);
          return await res.json();
        });

        const detalhesCompletos = await Promise.all(promessas);

        const pokemonsFormatados = detalhesCompletos.map((poke) => ({
          id: poke.id,
          numero: `#${poke.id.toString().padStart(3, '0')}`,
          nome: poke.name.charAt(0).toUpperCase() + poke.name.slice(1),
          tipos: poke.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)),
          imagem: poke.sprites.other['official-artwork'].front_default
        }));

        setPokemonsNaTela(pokemonsFormatados);
        
      } catch (erro) {
        console.error("Erro ao carregar detalhes", erro);
      } finally {
        setCarregando(false);
        setCarregandoMais(false);
      }
    };

    atualizarTela();
  }, [dicionario, busca, quantidadeVisivel]); 

  // CICLO 3: O Sensor de Scroll Infinito
  useEffect(() => {
    const scrollInfinito = () => {
      const alturaTotal = document.documentElement.scrollHeight;
      const alturaAtual = window.innerHeight + document.documentElement.scrollTop;

      if (alturaAtual >= alturaTotal - 100 && !carregandoMais && !carregando) {
        if (quantidadeVisivel < dicionarioFiltrado.length) {
          setCarregandoMais(true);
          setQuantidadeVisivel(prev => prev + 20); 
        }
      }
    };

    window.addEventListener('scroll', scrollInfinito);
    return () => window.removeEventListener('scroll', scrollInfinito);
  }, [carregandoMais, carregando, quantidadeVisivel, dicionarioFiltrado.length]);

  // ==========================================
  // RENDERIZAÇÃO
  // ==========================================
  return (
    <div className="w-full">
      <Header busca={busca} setBusca={lidarComBusca} />
      
      <main className="w-full max-w-[1760px] mx-auto mt-[80px] mb-12 flex flex-col items-center">
        
        {busca === "" && favoritos.length > 0 && (
          <div className="w-full flex flex-col mb-16 px-4 md:px-0">
            <h2 className="font-['Inter'] text-[24px] font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
              <Star className="fill-yellow-400 text-yellow-400" size={32} /> 
              Meus Favoritos
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px] md:gap-[20px] w-full">
              {favoritos.map((pokemon) => (
                <PokemonCard 
                  key={`fav-${pokemon.id}`}
                  id={pokemon.id}
                  numero={pokemon.numero}
                  nome={pokemon.nome}
                  tipos={pokemon.tipos}
                  imagem={pokemon.imagem}
                />
              ))}
            </div>
            
            <div className="w-full h-px bg-gray-300 dark:bg-gray-700 mt-12"></div>
          </div>
        )}

        {carregando && pokemonsNaTela.length === 0 ? (
          <Loader />

        ) : pokemonsNaTela.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full mt-20 mb-32 space-y-4">
            <span className="text-[64px]">🔍</span>
            <h3 className="font-['Inter'] font-bold text-2xl text-gray-700 dark:text-gray-200 text-center">
              Nenhum Pokémon encontrado.
            </h3>
            <p className="font-['Inter'] text-gray-500 dark:text-gray-400 text-center">
              Tente pesquisar por outro nome ou número.
            </p>
          </div>

        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[15px] md:gap-[20px] w-full">
              {pokemonsNaTela.map((pokemon) => (
              <PokemonCard 
                key={`main-${pokemon.id}`}
                id={pokemon.id}
                numero={pokemon.numero}
                nome={pokemon.nome}
                tipos={pokemon.tipos}
                imagem={pokemon.imagem}
              />
            ))}
          </div>
        )}

        {carregandoMais && (
          <div className="mt-10 mb-10">
            <Loader />
          </div>
        )}
        
      </main>
    </div>
  )
}

export default Home;