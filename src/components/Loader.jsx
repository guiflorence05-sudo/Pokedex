import { Loader2 } from 'lucide-react';

function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-[50vh] w-full gap-4">
      <Loader2 className="w-16 h-16 text-[#3D7DCA] animate-spin" />
      <p className="text-[24px] font-bold bg-gradient-to-r from-[#DBAD01] to-[#3D7DCA] bg-clip-text text-transparent">
        Capturando Pokémons...
      </p>
    </div>
  );
}

export default Loader;