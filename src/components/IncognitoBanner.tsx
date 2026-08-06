import { useEffect, useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { storageService } from '../services/storageService';

export function IncognitoBanner() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    storageService.isPrivateMode().then((privateMode) => {
      setIsPrivate(privateMode);
    });
  }, []);

  if (!isPrivate || dismissed) return null;

  return (
    <div
      role='alert'
      className='fixed bottom-4 right-4 z-50 max-w-md bg-amber-950/90 backdrop-blur-md border border-amber-500/30 text-amber-200 p-4 rounded-xl shadow-lg flex items-start gap-3 transition-all duration-300'
    >
      <ShieldAlert className='w-5 h-5 text-amber-400 shrink-0 mt-0.5' />
      <div className='flex-1 text-xs'>
        <p className='font-semibold text-amber-300'>Modo de navegación privada detectado</p>
        <p className='text-amber-200/80 mt-0.5'>
          Los borradores y presupuestos temporales se guardarán en memoria RAM y no persistirán al cerrar la ventana.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className='text-amber-400 hover:text-amber-200 transition-colors p-0.5 rounded-md hover:bg-amber-900/50'
        aria-label='Cerrar aviso'
      >
        <X className='w-4 h-4' />
      </button>
    </div>
  );
}
