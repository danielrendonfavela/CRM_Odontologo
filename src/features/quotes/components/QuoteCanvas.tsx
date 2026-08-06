import { FC } from 'react';
import { QuoteItem } from '../../../types/tenant';
import { formatMXN } from '../../../utils/formatCurrency';

export interface QuoteCanvasProps {
  doctorName?: string;
  professionalId?: string;
  phone?: string;
  email?: string;
  date?: string;
  accentColor?: string;
  fontFamily?: string;
  logoUrl?: string;
  items: QuoteItem[];
  patientName?: string;
  notes?: string;
}

export const QuoteCanvas: FC<QuoteCanvasProps> = ({
  doctorName = "Dra. Daniela Cázares",
  professionalId = "Céd. Prof. 12345678",
  phone = "667 123 4567",
  email = "contacto@dradanielacazares.com",
  date = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" }),
  accentColor = "#D8C593",
  items = [],
  patientName,
  notes,
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discountTotal = items.reduce((acc, item) => acc + (item.discount || 0), 0);
  const grandTotal = items.reduce((acc, item) => acc + item.total, 0);

  return (
    <div
      data-testid="quote-canvas-container"
      className="w-full max-w-[210mm] min-h-[297mm] bg-white text-stone-900 shadow-2xl mx-auto p-10 flex flex-col justify-between box-border font-sans border border-stone-200"
    >
      {/* Encabezado con datos del médico y Monograma */}
      <div>
        <div className="flex items-center justify-between pb-6 border-b-2 border-stone-800">
          <div className="flex items-center gap-4">
            <div
              aria-label="Monograma DC"
              className="w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-sm shrink-0"
              style={{ backgroundColor: accentColor, borderColor: "#B89B5E" }}
            >
              <span className="text-stone-900 font-serif font-bold text-2xl tracking-tighter">DC</span>
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-wide">{doctorName}</h1>
              <p className="text-xs uppercase tracking-widest text-stone-600 font-medium">Prostodoncia Avanzada</p>
              <p className="text-xs text-stone-500 mt-0.5">{professionalId}</p>
            </div>
          </div>
          <div className="text-right text-xs text-stone-600 space-y-1">
            <p className="font-semibold text-stone-800">COTIZACIÓN ODONTOLÓGICA</p>
            <p>Fecha: <span className="text-stone-900 font-medium">{date}</span></p>
            <p>{phone}</p>
            <p>{email}</p>
          </div>
        </div>

        {patientName && (
          <div className="my-6 p-4 rounded-md bg-stone-50 border border-stone-200 flex justify-between items-center text-xs">
            <div>
              <span className="text-stone-500 uppercase font-bold tracking-wider block text-[10px]">Paciente</span>
              <span className="text-stone-900 font-semibold text-sm">{patientName}</span>
            </div>
          </div>
        )}

        {/* Tabla Champagne */}
        <table className="w-full border-collapse mt-6 text-xs border border-stone-800">
          <thead>
            <tr style={{ backgroundColor: accentColor }} className="text-stone-900 border-b border-stone-800">
              <th className="py-3 px-3 text-left font-bold border-r border-stone-800">Tratamiento</th>
              <th className="py-3 px-2 text-center font-bold border-r border-stone-800 w-16">Diente</th>
              <th className="py-3 px-3 text-right font-bold border-r border-stone-800 w-24">Precio Unit.</th>
              <th className="py-3 px-2 text-center font-bold border-r border-stone-800 w-14">Cant.</th>
              <th className="py-3 px-3 text-right font-bold border-r border-stone-800 w-20">Desc.</th>
              <th className="py-3 px-3 text-right font-bold w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-stone-400 italic">
                  No hay tratamientos registrados en esta cotización.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-stone-800 hover:bg-stone-50 transition-colors">
                  <td className="py-2.5 px-3 border-r border-stone-800">
                    <span className="font-semibold text-stone-900 block">{item.treatmentName}</span>
                    {item.description && <span className="text-[11px] text-stone-500 block">{item.description}</span>}
                  </td>
                  <td className="py-2.5 px-2 text-center border-r border-stone-800">{item.toothNumber ?? '-'}</td>
                  <td className="py-2.5 px-3 text-right border-r border-stone-800">{formatMXN(item.unitPrice, true)}</td>
                  <td className="py-2.5 px-2 text-center border-r border-stone-800">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right border-r border-stone-800">{formatMXN(item.discount || 0, true)}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-stone-900">{formatMXN(item.total, true)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Resumen Totales */}
        <div className="flex justify-end mt-4">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-600">Subtotal:</span>
              <span className="font-medium text-stone-900">{formatMXN(subtotal, true)}</span>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between py-1 border-b border-stone-200 text-amber-800">
                <span>Descuentos:</span>
                <span className="font-medium">-{formatMXN(discountTotal, true)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b-2 border-stone-800 text-sm font-bold text-stone-900">
              <span>Total:</span>
              <span className="text-base">{formatMXN(grandTotal, true)}</span>
            </div>
          </div>
        </div>

        {notes && (
          <div className="mt-6 text-xs text-stone-600 bg-stone-50 p-3 rounded border border-stone-200">
            <span className="font-bold text-stone-800 block mb-1">Notas y Condiciones:</span>
            <p className="whitespace-pre-line">{notes}</p>
          </div>
        )}
      </div>

      {/* Pie Decorativo */}
      <div className="mt-12 pt-4 border-t-4" style={{ borderColor: accentColor }}>
        <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium tracking-wide">
          <p>Dra. Daniela Cázares • Prostodoncia Avanzada</p>
          <p>Cotización válida por 30 días</p>
        </div>
      </div>
    </div>
  );
};
