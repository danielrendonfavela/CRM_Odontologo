import { useState } from "react";
import {
  Users,
  FileText,
  DollarSign,
  Clock,
  CreditCard,
  Plus,
  TrendingUp,
  Search,
  ExternalLink,
  Calendar,
  Settings,
  CheckCircle2,
} from "lucide-react";
import type { Patient, Quote, AccountingRecord, UserRole } from "./types/tenant";
import { LoginView } from "./features/auth/components/LoginView";
import { QuoteCanvas } from "./features/quotes/components/QuoteCanvas";
import { HeaderNav } from "./components/HeaderNav";
import { SidebarNav } from "./components/SidebarNav";
import { IncognitoBanner } from "./components/IncognitoBanner";

export default function App() {
  const [viewMode, setViewMode] = useState<"app" | "login" | "canvas">("app");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const currentClinic = {
    id: "clinic-dental-01",
    name: "Consultorio Odontológico DentalCare Pro",
    taxId: "RFC-ODO-892011-9A2",
    phone: "+52 55 9876 5432",
    email: "contacto@dentalcarepro.com",
    status: "active" as const,
  };

  const currentUser = {
    displayName: "Dra. Daniela Cázares",
    email: "dra.daniela@cazaresdental.com",
    role: "admin" as UserRole,
    clinicId: currentClinic.id,
  };

  const samplePatients: Patient[] = [
    {
      id: "pat-101",
      clinicId: currentClinic.id,
      fullName: "Ana María Lucero",
      documentId: "CURP-LUA920312",
      phone: "+52 55 1234 5678",
      email: "ana.lucero@email.com",
      gender: "female",
      createdAt: "2026-08-01T10:00:00Z",
      updatedAt: "2026-08-01T10:00:00Z",
    },
    {
      id: "pat-102",
      clinicId: currentClinic.id,
      fullName: "Carlos Eduardo Silva",
      documentId: "CURP-SIL880519",
      phone: "+52 55 8765 4321",
      email: "carlos.silva@email.com",
      gender: "male",
      createdAt: "2026-08-03T14:30:00Z",
      updatedAt: "2026-08-03T14:30:00Z",
    },
  ];

  const sampleQuotes: Quote[] = [
    {
      id: "quot-301",
      clinicId: currentClinic.id,
      patientId: "pat-101",
      patientName: "Ana María Lucero",
      createdByUid: "usr-01",
      createdByName: "Dra. Daniela Cázares",
      items: [
        {
          id: "item-1",
          treatmentName: "Diseño de Sonrisa & Carillas de Porcelana",
          toothNumber: 11,
          unitPrice: 4500,
          quantity: 6,
          discount: 10,
          total: 24300,
        },
        {
          id: "item-2",
          treatmentName: "Limpieza Profunda e Higiene Ultrasonido",
          unitPrice: 1200,
          quantity: 1,
          discount: 0,
          total: 1200,
        },
      ],
      subtotal: 28200,
      tax: 0,
      discountTotal: 2700,
      totalAmount: 25500,
      status: "approved",
      validUntil: "2026-08-30",
      createdAt: "2026-08-02T11:00:00Z",
      updatedAt: "2026-08-04T16:00:00Z",
    },
  ];

  const sampleAccounting: AccountingRecord[] = [
    {
      id: "acc-501",
      clinicId: currentClinic.id,
      type: "income",
      category: "Tratamiento Odontológico",
      amount: 25500,
      description: "Pago Inicial Carillas Porcelana - Ana Lucero",
      date: "2026-08-04",
      patientId: "pat-101",
      quoteId: "quot-301",
      createdByUid: "usr-01",
      paymentMethod: "card",
      createdAt: "2026-08-04T16:30:00Z",
      updatedAt: "2026-08-04T16:30:00Z",
    },
  ];

  if (viewMode === "login") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center relative">
        <button
          onClick={() => setViewMode("app")}
          className="absolute top-6 right-6 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
        >
          ← Volver al Dashboard
        </button>
        <LoginView
          onGoogleSignIn={() => {
            alert("Inicio de sesión con Google exitoso (Demo)");
            setViewMode("app");
          }}
        />
        <IncognitoBanner />
      </div>
    );
  }

  if (viewMode === "canvas") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-4xl flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Previsualización Canvas de Cotización (Canva Template)</h2>
          <button
            onClick={() => setViewMode("app")}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-semibold transition-colors"
          >
            ← Volver al Dashboard
          </button>
        </div>
        <QuoteCanvas
          doctorName="Dra. Daniela Cázares"
          professionalId="Céd. Prof. 129084"
          phone="+52 55 9876 5432"
          email="dra.daniela@cazaresdental.com"
          date="06 de Agosto, 2026"
          items={[
            { id: "1", quantity: 6, treatmentName: "Carillas de Porcelana Pro - Diseño de Sonrisa", unitPrice: 4500, discount: 0, total: 27000 },
            { id: "2", quantity: 1, treatmentName: "Limpieza Profunda e Higiene Ultrasonido", unitPrice: 1200, discount: 0, total: 1200 },
            { id: "3", quantity: 1, treatmentName: "Blanqueamiento Dental Láser LED", unitPrice: 3500, discount: 0, total: 3500 },
          ]}
        />
        <IncognitoBanner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <HeaderNav
        clinicName={currentClinic.name}
        doctorName={currentUser.displayName}
        doctorRole="Administrador"
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onViewLogin={() => setViewMode("login")}
        onViewCanvas={() => setViewMode("canvas")}
      />

      <div className="flex-1 flex overflow-hidden">
        <SidebarNav
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white capitalize">
                {activeTab === "dashboard" && "Resumen del Consultorio"}
                {activeTab === "patients" && "Pacientes & Expedientes"}
                {activeTab === "quotes" && "Cotizaciones & Presupuestos"}
                {activeTab === "schedule" && "Agenda de Citas"}
                {activeTab === "accounting" && "Contabilidad & Finanzas"}
                {activeTab === "settings" && "Configuración del Consultorio"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Bienvenida de nuevo, Dra. Daniela Cázares
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar pacientes, cotizaciones..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <button className="min-h-[44px] px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Nuevo Registro</span>
              </button>
            </div>
          </div>

          {(activeTab === "dashboard" || activeTab === "patients") && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Total Pacientes</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mt-3">{samplePatients.length}</p>
                <div className="flex items-center space-x-1 text-emerald-400 text-xs mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+12% este mes</span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Cotizaciones Creadas</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mt-3">{sampleQuotes.length}</p>
                <div className="flex items-center space-x-1 text-slate-400 text-xs mt-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>1 Aprobada · 1 Enviada</span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Ingresos Mensuales</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mt-3">$25,500.00 MXN</p>
                <div className="flex items-center space-x-1 text-emerald-400 text-xs mt-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Tarjeta & Transferencia</span>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Citas de Hoy</span>
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mt-3">4 Consultas</p>
                <div className="flex items-center space-x-1 text-cyan-400 text-xs mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>2 Confirmadas</span>
                </div>
              </div>
            </section>
          )}

          {activeTab === "patients" && (
            <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-white">Directorio de Pacientes del Consultorio</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Listado completo de pacientes registrados</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">Total: {samplePatients.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-semibold">
                    <tr>
                      <th className="p-4">Nombre Completo</th>
                      <th className="p-4">Identificación</th>
                      <th className="p-4">Teléfono</th>
                      <th className="p-4">Correo Electrónico</th>
                      <th className="p-4">Fecha de Registro</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {samplePatients.map((pat) => (
                      <tr key={pat.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-medium text-slate-200 flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xs">
                            {pat.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{pat.fullName}</span>
                        </td>
                        <td className="p-4 font-mono text-slate-400">{pat.documentId}</td>
                        <td className="p-4 text-slate-300">{pat.phone}</td>
                        <td className="p-4 text-slate-400">{pat.email}</td>
                        <td className="p-4 text-slate-400">
                          {new Date(pat.createdAt).toLocaleDateString("es-MX")}
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs flex items-center space-x-1 ml-auto cursor-pointer">
                            <span>Ver Historial</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "quotes" && (
            <div className="space-y-4">
              {sampleQuotes.map((quote) => (
                <div key={quote.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h4 className="font-bold text-base text-white">Cotización {quote.id}</h4>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            quote.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {quote.status === "approved" ? "Aprobado" : "Enviado"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Paciente: <strong className="text-slate-200">{quote.patientName}</strong> · Atendido por: {quote.createdByName}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-400">Total Presupuestado</p>
                      <p className="text-xl font-bold text-cyan-400">${quote.totalAmount.toLocaleString("es-MX")} MXN</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/60">
                    <h5 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Tratamientos Incluidos</h5>
                    <div className="space-y-2">
                      {quote.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800/40 last:border-0">
                          <div>
                            <span className="font-medium text-slate-200">{item.treatmentName}</span>
                            {item.toothNumber && (
                              <span className="ml-2 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300">
                                Pieza dental #{item.toothNumber}
                              </span>
                            )}
                          </div>
                          <div className="text-right font-mono">
                            <span className="text-slate-400">{item.quantity} x ${item.unitPrice.toLocaleString()}</span>
                            <span className="ml-3 font-semibold text-slate-200">${item.total.toLocaleString()} MXN</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "accounting" && (
            <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-semibold text-sm text-white">Registro de Ingresos & Egresos</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Control contable y reporte de utilidades del consultorio</p>
                </div>
              </div>

              <div className="space-y-3">
                {sampleAccounting.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          rec.type === "income"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{rec.description}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Categoría: <span className="text-slate-300">{rec.category}</span> · Método: <span className="capitalize">{rec.paymentMethod}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-bold font-mono ${
                          rec.type === "income" ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {rec.type === "income" ? "+" : "-"}${rec.amount.toLocaleString("es-MX")} MXN
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{rec.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "dashboard" || activeTab === "schedule") && (
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Próximas Citas Médicas</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Ana María Lucero - Limpieza & Carillas</p>
                    <p className="text-[11px] text-slate-400">Hoy · 16:00 hrs</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Confirmada
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Carlos Eduardo Silva - Valoración Ortodoncia</p>
                    <p className="text-[11px] text-slate-400">Mañana · 10:30 hrs</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Pendiente
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span>Configuración de Marca & Consultorio</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Personalice los datos que se muestran en sus cotizaciones y expedientes
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Nombre del Consultorio</label>
                  <input
                    type="text"
                    defaultValue={currentClinic.name}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Teléfono de Contacto</label>
                  <input
                    type="text"
                    defaultValue={currentClinic.phone}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    defaultValue={currentClinic.email}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Cédula Profesional</label>
                  <input
                    type="text"
                    defaultValue="Céd. Prof. 129084"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>© 2026 CRM Odontológico · Dra. Daniela Cázares</p>
      </footer>
      <IncognitoBanner />
    </div>
  );
}
