import { IncognitoBanner } from './components/IncognitoBanner';
import { useState, useEffect } from "react";
import {
  Activity,
  Shield,
  Users,
  FileText,
  DollarSign,
  CheckCircle2,
  Building2,
  Server,
  UserCheck,
  Sparkles,
  Clock,
  CreditCard,
  Database,
  Lock,
  Plus,
  TrendingUp,
  Search,
  ExternalLink,
} from "lucide-react";
import { auth, db, storage } from "./config/firebase";
import type { Patient, Quote, AccountingRecord, UserRole } from "./types/tenant";

export default function App() {
  const [activeTab, setActiveTab] = useState<"patients" | "quotes" | "accounting" | "tenant">("patients");
  const [firebaseStatus, setFirebaseStatus] = useState<{
    authReady: boolean;
    dbReady: boolean;
    storageReady: boolean;
  }>({
    authReady: false,
    dbReady: false,
    storageReady: false,
  });

  // Datos mock para demo inicial del Dashboard
  const currentClinic = {
    id: "clinic-dental-01",
    name: "Consultorio Odontol�gico DentalCare Pro",
    taxId: "RFC-ODO-892011-9A2",
    phone: "+52 55 9876 5432",
    email: "contacto@dentalcarepro.com",
    status: "active" as const,
  };

  const currentUser = {
    displayName: "Dr. Roberto G�mez",
    email: "dr.gomez@dentalcarepro.com",
    role: "admin" as UserRole,
    clinicId: currentClinic.id,
  };

  const samplePatients: Patient[] = [
    {
      id: "pat-101",
      clinicId: currentClinic.id,
      fullName: "Ana Mar�a Lucero",
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
    {
      id: "pat-103",
      clinicId: currentClinic.id,
      fullName: "Elena Patricia Ram�rez",
      documentId: "CURP-RAE951104",
      phone: "+52 55 4567 8901",
      email: "elena.ramirez@email.com",
      gender: "female",
      createdAt: "2026-08-05T09:15:00Z",
      updatedAt: "2026-08-05T09:15:00Z",
    },
  ];

  const sampleQuotes: Quote[] = [
    {
      id: "quot-301",
      clinicId: currentClinic.id,
      patientId: "pat-101",
      patientName: "Ana Mar�a Lucero",
      createdByUid: "usr-01",
      createdByName: "Dr. Roberto G�mez",
      items: [
        {
          id: "item-1",
          treatmentName: "Dise�o de Sonrisa & Carillas de Porcelana",
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
    {
      id: "quot-302",
      clinicId: currentClinic.id,
      patientId: "pat-102",
      patientName: "Carlos Eduardo Silva",
      createdByUid: "usr-01",
      createdByName: "Dr. Roberto G�mez",
      items: [
        {
          id: "item-3",
          treatmentName: "Endodoncia Multirradicular & Corona Zirconio",
          toothNumber: 46,
          unitPrice: 6800,
          quantity: 1,
          discount: 0,
          total: 6800,
        },
      ],
      subtotal: 6800,
      tax: 0,
      discountTotal: 0,
      totalAmount: 6800,
      status: "sent",
      validUntil: "2026-08-25",
      createdAt: "2026-08-04T10:00:00Z",
      updatedAt: "2026-08-04T10:00:00Z",
    },
  ];

  const sampleAccounting: AccountingRecord[] = [
    {
      id: "acc-501",
      clinicId: currentClinic.id,
      type: "income",
      category: "Tratamiento Odontol�gico",
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
    {
      id: "acc-502",
      clinicId: currentClinic.id,
      type: "expense",
      category: "Material Quir�rgico & Resinas",
      amount: 4200,
      description: "Compra insumos de resina 3M y anest�sicos",
      date: "2026-08-05",
      createdByUid: "usr-01",
      paymentMethod: "transfer",
      createdAt: "2026-08-05T09:00:00Z",
      updatedAt: "2026-08-05T09:00:00Z",
    },
  ];

  useEffect(() => {
    // Validar estado de la inicializaci�n de Firebase
    setFirebaseStatus({
      authReady: Boolean(auth),
      dbReady: Boolean(db),
      storageReady: Boolean(storage),
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg text-white leading-none">CRM Odontol�gico</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Multi-tenant v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentClinic.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Badge de Tenant Activo */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400">Tenant:</span>
              <span className="font-mono text-cyan-300 font-semibold">{currentClinic.id}</span>
            </div>

            {/* Perfil de Usuario & RBAC Role */}
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                RG
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-200">{currentUser.displayName}</p>
                <div className="flex items-center space-x-1">
                  <UserCheck className="w-3 h-3 text-purple-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner de Verificaci�n de Servicios Firebase */}
        <section className="glass-card rounded-2xl p-5 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  Estado de Infraestructura Cloud & Firebase Multi-Tenant
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Conexi�n directa aislada en path: <code className="text-cyan-400 font-mono">/clinics/{currentClinic.id}</code>
                </p>
              </div>
            </div>

            {/* Indicadores de Estado */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Auth: {firebaseStatus.authReady ? "Conectado" : "Pendiente"}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                <Database className="w-4 h-4" />
                <span>Firestore: {firebaseStatus.dbReady ? "Aislado (Tenant)" : "Pendiente"}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                <Lock className="w-4 h-4" />
                <span>Storage: {firebaseStatus.storageReady ? "Protegido" : "Pendiente"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Metric / KPI Cards */}
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
              <span>1 Aprobada � 1 Enviada</span>
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
              <span className="text-xs font-medium text-slate-400">Seguridad Multi-Tenant</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-3">RBAC Activo</p>
            <div className="flex items-center space-x-1 text-purple-400 text-xs mt-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Reglas de Firestore /clinics</span>
            </div>
          </div>
        </section>

        {/* Tab Navigation & Search */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab("patients")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "patients"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Pacientes</span>
              </button>

              <button
                onClick={() => setActiveTab("quotes")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "quotes"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Cotizaciones</span>
              </button>

              <button
                onClick={() => setActiveTab("accounting")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "accounting"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Contabilidad</span>
              </button>

              <button
                onClick={() => setActiveTab("tenant")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "tenant"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Configuraci�n Tenant</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar en el sistema..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <button className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20">
                <Plus className="w-4 h-4" />
                <span>Nuevo</span>
              </button>
            </div>
          </div>

          {/* Tab Content: Pacientes */}
          {activeTab === "patients" && (
            <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-white">Directorio de Pacientes del Consultorio</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Almacenados bajo la colecci�n tenant aislada</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">Total: {samplePatients.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-semibold">
                    <tr>
                      <th className="p-4">Nombre Completo</th>
                      <th className="p-4">Identificaci�n</th>
                      <th className="p-4">Tel�fono</th>
                      <th className="p-4">Correo Electr�nico</th>
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
                          <button className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs flex items-center space-x-1 ml-auto">
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

          {/* Tab Content: Cotizaciones */}
          {activeTab === "quotes" && (
            <div className="space-y-4">
              {sampleQuotes.map((quote) => (
                <div key={quote.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h4 className="font-bold text-base text-white">Cotizaci�n {quote.id}</h4>
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
                        Paciente: <strong className="text-slate-200">{quote.patientName}</strong> � Atendido por: {quote.createdByName}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-400">Total Presupuestado</p>
                      <p className="text-xl font-bold text-cyan-400">${quote.totalAmount.toLocaleString("es-MX")} MXN</p>
                    </div>
                  </div>

                  {/* Tabla de tratamiento */}
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

          {/* Tab Content: Contabilidad */}
          {activeTab === "accounting" && (
            <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-semibold text-sm text-white">Registro de Ingresos & Egresos del Consultorio</h3>
                  <p className="text-xs text-slate-400 mt-0.5">M�dulo financiero restringido con RBAC para Contadores y Admins</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                    RBAC: Accountant / Admin
                  </span>
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
                          Categor�a: <span className="text-slate-300">{rec.category}</span> � M�todo: <span className="capitalize">{rec.paymentMethod}</span>
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

          {/* Tab Content: Configuraci�n Tenant */}
          {activeTab === "tenant" && (
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-semibold text-sm text-white">Configuraci�n del Consultorio & Multi-Tenancy</h3>
                <p className="text-xs text-slate-400 mt-0.5">Estructura jer�rquica de Firestore y aislamiento de datos</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Datos del Consultorio (Tenant)</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">ID de Cl�nica:</span>
                      <span className="font-mono text-cyan-300 font-semibold">{currentClinic.id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Nombre Oficial:</span>
                      <span className="text-slate-200">{currentClinic.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">RFC / Identificador Fiscal:</span>
                      <span className="text-slate-200">{currentClinic.taxId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Tel�fono:</span>
                      <span className="text-slate-200">{currentClinic.phone}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Estado:</span>
                      <span className="text-emerald-400 font-semibold uppercase">{currentClinic.status}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Reglas de Firestore (Seguridad)</h4>
                  <p className="text-xs text-slate-400">
                    Todas las solicitudes est�n protegidas por reglas que restringen lectura y escritura exclusivamente a:
                  </p>
                  <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside pt-1">
                    <li><code className="text-cyan-300 font-mono">/clinics/{`{clinicId}`}</code> como la ra�z del tenant.</li>
                    <li>Verificaci�n de usuario activo en subcolecci�n <code className="text-cyan-300 font-mono">/users/{`{userId}`}</code>.</li>
                    <li>Roles estritos RBAC: <span className="text-cyan-400 font-semibold">admin</span>, <span className="text-cyan-400 font-semibold">assistant</span>, <span className="text-cyan-400 font-semibold">accountant</span>.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>� 2026 CRM Odontol�gico Multi-Tenant � React 18, Vite & Firebase Cloud Infrastructure</p>
      </footer>
      <IncognitoBanner />
    </div>
  );
}

