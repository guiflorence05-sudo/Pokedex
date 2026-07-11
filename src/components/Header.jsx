import Pokedex from "../assets/logo-pokedex.png";
import Ash from "../assets/ash.png";
import SearchBar from "./SearchBar";

function Header({ busca, setBusca }) {
  return (
    <header className="relative w-full max-w-[1760px] mx-auto rounded-[24px] md:rounded-[50px] border border-white/50 dark:border-gray-700/50 bg-[#F8F8F8]/50 dark:bg-gray-900/80 backdrop-blur-md shadow-md p-6 md:p-12 flex flex-col justify-center transition-colors duration-300">

      <div className="flex flex-col md:flex-row justify-between items-center md:items-start w-full">
        
        <div className="flex flex-col items-center md:items-start w-full max-w-[817px] md:mt-6">
          
          <img 
            src={Pokedex} 
            alt="Pokedex" 
            className="w-full md:max-w-[772px] h-auto object-contain" 
          />
          
          <h2 className="font-['Inter'] font-extrabold text-[4.6vw] min-[450px]:text-[20px] md:text-[32px] whitespace-nowrap leading-snug w-full text-center md:text-left bg-gradient-to-r from-[#DBAD01] to-[#3D7DCA] dark:from-yellow-400 dark:to-blue-400 bg-clip-text text-transparent transition-colors duration-300 mt-4 md:mt-[40px] mb-8 md:mb-0">
            Descubra e explore seus Pokémons favoritos!
          </h2>
          
        </div>

        <div className="hidden md:flex w-full md:w-1/2 justify-end self-start md:pr-12 lg:pr-20">
           <img 
             src={Ash} 
             alt="Ash e Pokemons" 
             className="w-full max-w-[458px] h-auto object-contain" 
           />
        </div>
      </div>

      <div className="w-full">
        <SearchBar value={busca} onChange={setBusca} />
      </div>
      
    </header>
  );
}

export default Header;