import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';


function App() {
  const [temaEscuro, setTemaEscuro] = useState(false);

  useEffect(() => {
    const html = document.documentElement;

    if (temaEscuro) {
      html.classList.add('dark');
      localStorage.setItem('tema', 'escuro');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('tema', 'claro');
    }
  }, [temaEscuro]);

  const alternarTema = () => {
    setTemaEscuro(!temaEscuro);
  };

  return (
      <div 
        className={`w-full min-h-screen p-6 transition-colors duration-300 ${
          temaEscuro ? 'bg-gradient-to-l from-[#1A1A1A] to-[#2D2D2D]' : 'bg-gradient-to-l from-[#D6E9FF] to-[#FFE892]'
        }`}
      >      
        <div className="p-4 flex justify-end">
          <button 
            onClick={alternarTema}
            className={`outline-none flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-md transition border ${
              temaEscuro 
                ? 'bg-gradient-to-l from-[#1A1A1A] to-[#2D2D2D] text-white border-gray-700' 
                : 'bg-gradient-to-l from-[#D6E9FF] to-[#FFE892] text-gray-800 border-gray-400'
            }`}
          >
            
            {temaEscuro ? '🌙' : '☀️'}
          </button>
        </div>

        <Outlet />

      </div>
  );
}

export default App;