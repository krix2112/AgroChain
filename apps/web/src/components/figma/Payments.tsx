'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Clock, DollarSign, X, Package, Truck, FileCheck, Shield, Calendar, CreditCard, Hash, PartyPopper } from 'lucide-react';

interface Payment {
  id: string; tradeId: string; buyer: string; amount: string; amountRaw: number;
  status: 'Pending' | 'Completed' | 'Overdue'; dueDate: string;
  quantity: string; crop: string; paymentMethod?: string;
  transactionId?: string; paymentDate?: string;
}

const initialPayments: Payment[] = [
  { id: '1', tradeId: 'TRD-2024-001', buyer: 'Agro Enterprises Ltd', amount: '₹1,29,000', amountRaw: 129000, status: 'Pending', dueDate: '2026-04-28', quantity: '50 qtl', crop: 'Wheat', paymentMethod: 'Bank Transfer', transactionId: 'TXN2024041234567', paymentDate: '2026-04-25' },
  { id: '2', tradeId: 'TRD-2024-002', buyer: 'Green Valley Traders', amount: '₹3,80,000', amountRaw: 380000, status: 'Completed', dueDate: '2026-04-25', quantity: '100 qtl', crop: 'Basmati Rice', paymentMethod: 'NEFT', transactionId: 'TXN2024041298765', paymentDate: '2026-04-23' },
  { id: '3', tradeId: 'TRD-2024-003', buyer: 'National Grain Co.', amount: '₹1,56,000', amountRaw: 156000, status: 'Pending', dueDate: '2026-04-30', quantity: '30 qtl', crop: 'Mustard', paymentMethod: 'UPI', transactionId: 'TXN2024041345678', paymentDate: '2026-04-26' },
  { id: '4', tradeId: 'TRD-2024-004', buyer: 'Farm Fresh Ltd', amount: '₹92,000', amountRaw: 92000, status: 'Overdue', dueDate: '2026-04-20', quantity: '20 qtl', crop: 'Chickpea', paymentMethod: 'Bank Transfer', transactionId: 'TXN2024040987654', paymentDate: '2026-04-18' },
];

function formatAmount(raw: number) {
  return '₹' + raw.toLocaleString('en-IN');
}

function formatAmountShort(raw: number) {
  if (raw >= 100000) return `₹${(raw / 100000).toFixed(2)}L`;
  if (raw >= 1000) return `₹${(raw / 1000).toFixed(0)}K`;
  return `₹${raw}`;
}

export default function Payments() {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Completed' | 'Overdue'>('Pending');
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; tradeId: string; amount: string } | null>(null);

  const filteredPayments = payments.filter(p => p.status === activeTab);

  const pendingTotal = payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amountRaw, 0);
  const completedTotal = payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amountRaw, 0);
  const overdueTotal = payments.filter(p => p.status === 'Overdue').reduce((s, p) => s + p.amountRaw, 0);

  const markAsPaid = (id: string) => {
    setMarkingId(id);
    // Brief loading delay for realism
    setTimeout(() => {
      const target = payments.find(p => p.id === id);
      setPayments(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, status: 'Completed', paymentDate: new Date().toISOString().split('T')[0] }
            : p
        )
      );
      setMarkingId(null);
      if (target) {
        setToast({ show: true, tradeId: target.tradeId, amount: target.amount });
      }
      // If viewing details for this payment, update it and close modal
      if (selectedPayment?.id === id) {
        setSelectedPayment(prev => prev ? { ...prev, status: 'Completed' } : null);
        setShowDetails(false);
      }
      // Switch to completed tab to show result removed to avoid confusion
    }, 900);
  };

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (toast?.show) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="space-y-8 relative">

      {/* ── Success Toast ── */}
      {toast?.show && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="flex items-center gap-4 bg-white rounded-2xl shadow-2xl border-2 border-green-200 p-5 min-w-[340px]">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <PartyPopper size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 text-lg">Payment Received! 🎉</div>
              <div className="text-sm text-gray-600">{toast.tradeId} marked as <span className="font-semibold text-green-600">Paid</span></div>
              <div className="text-xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">{toast.amount}</div>
            </div>
            <button onClick={() => setToast(null)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
              <X size={18} className="text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Payments</h1>
        <p className="text-sm" style={{ color: '#666' }}>Manage invoices and payment settlements</p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-sm transition-all">
          <div className="flex items-center gap-3 mb-3"><Clock size={24} className="text-amber-600" /><span className="text-sm font-medium text-amber-900">Pending</span></div>
          <div className="text-3xl font-bold text-amber-900">{formatAmountShort(pendingTotal)}</div>
          <div className="text-xs text-amber-700 mt-1">{payments.filter(p => p.status === 'Pending').length} invoice(s)</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-sm transition-all">
          <div className="flex items-center gap-3 mb-3"><CheckCircle size={24} className="text-green-600" /><span className="text-sm font-medium text-green-900">Completed</span></div>
          <div className="text-3xl font-bold text-green-900">{formatAmountShort(completedTotal)}</div>
          <div className="text-xs text-green-700 mt-1">{payments.filter(p => p.status === 'Completed').length} invoice(s)</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200 shadow-sm transition-all">
          <div className="flex items-center gap-3 mb-3"><AlertTriangle size={24} className="text-red-600" /><span className="text-sm font-medium text-red-900">Overdue</span></div>
          <div className="text-3xl font-bold text-red-900">{formatAmountShort(overdueTotal)}</div>
          <div className="text-xs text-red-700 mt-1">{payments.filter(p => p.status === 'Overdue').length} invoice(s)</div>
        </div>
      </div>

      {/* ── Tab Filters ── */}
      <div className="flex gap-3">
        {(['Pending', 'Completed', 'Overdue'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${activeTab === tab ? 'bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white shadow-lg shadow-[#2E7D32]/30' : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#2E7D32]'}`}
          >
            {tab}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {payments.filter(p => p.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Payment List ── */}
      {filteredPayments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredPayments.map((payment) => {
            const isMarking = markingId === payment.id;
            return (
              <div
                key={payment.id}
                className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${payment.status === 'Completed' ? 'border-green-200 bg-gradient-to-r from-green-50/50 to-white' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Trade ID</div>
                      <div className="font-bold text-lg" style={{ color: '#1a1a1a' }}>{payment.tradeId}</div>
                      <div className="text-sm text-gray-600">{payment.buyer}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Amount</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">{payment.amount}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Due Date</div>
                      <div className="font-semibold" style={{ color: '#1a1a1a' }}>
                        {new Date(payment.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${payment.status === 'Completed' ? 'bg-green-100 text-green-700 border border-green-300' : payment.status === 'Pending' ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                        {payment.status === 'Completed' && <CheckCircle size={14} />}
                        {payment.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => { setSelectedPayment(payment); setShowDetails(true); }}
                      className="px-4 py-2 border-2 border-[#2E7D32] text-[#2E7D32] rounded-xl font-semibold hover:bg-green-50 transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      <FileCheck size={16} />View Details
                    </button>

                    {payment.status === 'Pending' && (
                      <button
                        onClick={() => markAsPaid(payment.id)}
                        disabled={isMarking}
                        className="px-4 py-2 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isMarking ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>✓ Mark as Paid</>
                        )}
                      </button>
                    )}

                    {payment.status === 'Overdue' && (
                      <button
                        onClick={() => markAsPaid(payment.id)}
                        disabled={isMarking}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-70"
                      >
                        {isMarking ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>✓ Mark as Paid</>
                        )}
                      </button>
                    )}

                    {payment.status === 'Completed' && (
                      <div className="px-4 py-2 bg-green-100 text-green-700 border border-green-300 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap">
                        <CheckCircle size={16} />Paid
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
          <DollarSign size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900">No {activeTab.toLowerCase()} payments</h3>
          <p className="text-gray-600">
            {activeTab === 'Pending' ? 'All payments are up to date 🎉' : activeTab === 'Completed' ? 'No completed payments yet' : 'No overdue payments'}
          </p>
        </div>
      )}

      {/* ── Details Modal ── */}
      {showDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl w-full max-w-5xl border-2 border-white/50 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200 rounded-t-3xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Trade #{selectedPayment.tradeId}</h2>
                  <span className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 ${selectedPayment.status === 'Completed' ? 'bg-green-500/20 text-green-700 border border-green-500/30' : selectedPayment.status === 'Pending' ? 'bg-amber-500/20 text-amber-700 border border-amber-500/30' : 'bg-red-500/20 text-red-700 border border-red-500/30'}`}>
                    {selectedPayment.status === 'Completed' && <CheckCircle size={14} />}
                    {selectedPayment.status}
                  </span>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">{selectedPayment.amount}</div>
              </div>
              <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-gray-200 rounded-xl transition-colors"><X size={24} /></button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2"><Truck size={24} className="text-blue-600" /><span className="font-semibold text-blue-900">Out for Delivery</span></div>
                  <p className="text-sm text-blue-700">In transit to destination</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
                  <div className="flex items-center gap-3 mb-2"><Package size={24} className="text-green-600" /><span className="font-semibold text-green-900">On Product</span></div>
                  <p className="text-sm text-green-700">{selectedPayment.quantity} {selectedPayment.crop}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2"><Shield size={24} className="text-purple-600" /><span className="font-semibold text-purple-900">Invoice on Blockchain</span></div>
                  <p className="text-sm text-purple-700">Verified &amp; secured</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1a1a1a' }}>
                  <DollarSign size={24} className="text-[#2E7D32]" />Payment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <CreditCard size={20} className="text-gray-600" />
                      <div><div className="text-xs text-gray-500">Payment Method</div><div className="font-semibold text-gray-900">{selectedPayment.paymentMethod}</div></div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Hash size={20} className="text-gray-600" />
                      <div><div className="text-xs text-gray-500">Transaction ID</div><div className="font-semibold text-gray-900 font-mono text-sm">{selectedPayment.transactionId}</div></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <DollarSign size={20} className="text-gray-600" />
                      <div><div className="text-xs text-gray-500">Payment Amount</div><div className="font-semibold text-2xl bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">{selectedPayment.amount}</div></div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Calendar size={20} className="text-gray-600" />
                      <div><div className="text-xs text-gray-500">Payment Date</div><div className="font-semibold text-gray-900">{selectedPayment.paymentDate}</div></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-4 border-2 border-gray-300 rounded-2xl font-bold hover:border-[#2E7D32] hover:bg-gray-50 transition-all">
                  Download Invoice
                </button>
                {selectedPayment.status !== 'Completed' ? (
                  <button
                    onClick={() => markAsPaid(selectedPayment.id)}
                    disabled={markingId === selectedPayment.id}
                    className="flex-1 py-4 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {markingId === selectedPayment.id ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>✓ Mark as Paid</>
                    )}
                  </button>
                ) : (
                  <div className="flex-1 py-4 bg-green-100 text-green-700 border-2 border-green-300 rounded-2xl font-bold flex items-center justify-center gap-2">
                    <CheckCircle size={20} />Payment Completed
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
