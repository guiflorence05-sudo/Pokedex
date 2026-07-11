import { Search } from 'lucide-react'; 

function SearchBar({ value, onChange }) {
  return (
    <div className="w-full max-w-[1590px] bg-[#FFFEF7] rounded-[50px] h-[78px] flex items-center px-[32px] gap-[24px] border border-[#CDCDCD]">
      
      <Search className="text-[#CDCDCD]" size={24} />
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pesquise seu Pokémon aqui..."
        className="w-full bg-transparent outline-none text-slate-700 text-[16px] font-medium placeholder-[#CDCDCD]"
      />
      
    </div>
  );
}

export default SearchBar;