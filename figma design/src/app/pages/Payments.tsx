import { useState } from 'react';
import { CheckCircle, AlertTriangle, Clock, DollarSign, X, Package, Truck, FileCheck, Shield, QrCode, Calendar, CreditCard, Hash } from 'lucide-react';

interface Payment {
  id: string;
  tradeId: string;
  buyer: string;
  amount: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  dueDate: string;
  quantity: string;
  crop: string;
  paymentMethod?: string;
  transactionId?: string;
  paymentDate?: string;
}

export default function Payments() {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Completed' | 'Overdue'>('Pending');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const payments: Payment[] = [
    {
      id: '1',
      tradeId: 'TRD-2024-001',
      buyer: 'Agro Enterprises Ltd',
      amount: '₹1,29,000',
      status: 'Pending',
      dueDate: '2026-04-28',
      quantity: '50 qtl',
      crop: 'Wheat',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN2024041234567',
      paymentDate: '2026-04-25'
    },
    {
      id: '2',
      tradeId: 'TRD-2024-002',
      buyer: 'Green Valley Traders',
      amount: '₹3,80,000',
      status: 'Completed',
      dueDate: '2026-04-25',
      quantity: '100 qtl',
      crop: 'Basmati Rice',
      paymentMethod: 'NEFT',
      transactionId: 'TXN2024041298765',
      paymentDate: '2026-04-23'
    },
    {
      id: '3',
      tradeId: 'TRD-2024-003',
      buyer: 'National Grain Co.',
      amount: '₹1,56,000',
      status: 'Pending',
      dueDate: '2026-04-30',
      quantity: '30 qtl',
      crop: 'Mustard',
      paymentMethod: 'UPI',
      transactionId: 'TXN2024041345678',
      paymentDate: '2026-04-26'
    },
    {
      id: '4',
      tradeId: 'TRD-2024-004',
      buyer: 'Farm Fresh Ltd',
      amount: '₹92,000',
      status: 'Overdue',
      dueDate: '2026-04-20',
      quantity: '20 qtl',
      crop: 'Chickpea',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN2024040987654',
      paymentDate: '2026-04-18'
    },
  ];

  const filteredPayments = payments.filter(p => p.status === activeTab);

  const timeline = [
    { label: 'Order Created', date: 'April 22', completed: true },
    { label: 'Order Accepted', date: 'April 23', completed: true },
    { label: 'Order Packed', date: 'April 24', completed: true },
    { label: 'Delivery In Progress', date: 'April 25', completed: false, active: true },
  ];

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetails(true);
  };

  return (
    <div className="space-y-8">
      {/* Clean Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>
          Payments
        </h1>
        <p className="text-sm" style={{ color: '#666' }}>
          Manage invoices and payment settlements
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Clock size={24} className="text-amber-600" />
            <span className="text-sm font-medium text-amber-900">Pending</span>
          </div>
          <div className="text-3xl font-bold text-amber-900">₹2.85L</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle size={24} className="text-green-600" />
            <span className="text-sm font-medium text-green-900">Completed</span>
          </div>
          <div className="text-3xl font-bold text-green-900">₹3.80L</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle size={24} className="text-red-600" />
            <span className="text-sm font-medium text-red-900">Overdue</span>
          </div>
          <div className="text-3xl font-bold text-red-900">₹92K</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3">
        {(['Pending', 'Completed', 'Overdue'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white shadow-lg shadow-[#2E7D32]/30'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#2E7D32]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Payment Cards */}
      {filteredPayments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  {/* Trade ID */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Trade ID</div>
                    <div className="font-bold text-lg" style={{ color: '#1a1a1a' }}>
                      {payment.tradeId}
                    </div>
                    <div className="text-sm text-gray-600">{payment.buyer}</div>
                  </div>

                  {/* Amount */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Amount</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">
                      {payment.amount}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Due Date</div>
                    <div className="font-semibold" style={{ color: '#1a1a1a' }}>
                      {new Date(payment.dueDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                        payment.status === 'Completed'
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : payment.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : 'bg-red-100 text-red-700 border border-red-300'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-6">
                  <button
                    onClick={() => handleViewDetails(payment)}
                    className="px-4 py-2 border-2 border-[#2E7D32] text-[#2E7D32] rounded-xl font-semibold hover:bg-green-50 transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    <FileCheck size={16} />
                    View Details
                  </button>
                  {payment.status === 'Pending' && (
                    <button className="px-4 py-2 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap">
                      Mark as Paid
                    </button>
                  )}
                  {payment.status === 'Overdue' && (
                    <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap">
                      <AlertTriangle size={16} />
                      Raise Dispute
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
          <DollarSign size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            No {activeTab.toLowerCase()} payments
          </h3>
          <p className="text-gray-600">
            {activeTab === 'Pending' && "All payments are up to date"}
            {activeTab === 'Completed' && "No completed payments yet"}
            {activeTab === 'Overdue' && "No overdue payments"}
          </p>
        </div>
      )}

      {/* Payment Details Panel */}
      {showDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl w-full max-w-5xl border-2 border-white/50 transform transition-all max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200 rounded-t-3xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                    Trade #{selectedPayment.tradeId}
                  </h2>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-bold ${
                      selectedPayment.status === 'Completed'
                        ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                        : selectedPayment.status === 'Pending'
                        ? 'bg-amber-500/20 text-amber-700 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-700 border border-red-500/30'
                    }`}
                  >
                    {selectedPayment.status}
                  </span>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">
                  {selectedPayment.amount}
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Truck size={24} className="text-blue-600" />
                    <span className="font-semibold text-blue-900">Out for Delivery</span>
                  </div>
                  <p className="text-sm text-blue-700">In transit to destination</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Package size={24} className="text-green-600" />
                    <span className="font-semibold text-green-900">On Product</span>
                  </div>
                  <p className="text-sm text-green-700">{selectedPayment.quantity} {selectedPayment.crop}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield size={24} className="text-purple-600" />
                    <span className="font-semibold text-purple-900">Invoice on Blockchain</span>
                  </div>
                  <p className="text-sm text-purple-700">Verified & secured</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trade Timeline */}
                <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1a1a1a' }}>
                    <Clock size={24} className="text-[#2E7D32]" />
                    Trade Timeline
                  </h3>

                  <div className="space-y-4">
                    {timeline.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.completed
                            ? 'bg-gradient-to-br from-[#2E7D32] to-[#388E3C]'
                            : step.active
                            ? 'bg-blue-500 animate-pulse'
                            : 'bg-gray-300'
                        }`}>
                          <CheckCircle size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className={`font-semibold ${step.completed || step.active ? 'text-gray-900' : 'text-gray-500'}`}>
                              {step.label}
                            </div>
                            <div className="text-sm text-gray-600">{step.date}</div>
                          </div>
                          {index < timeline.length - 1 && (
                            <div className={`w-1 h-8 ml-4 mt-2 ${step.completed ? 'bg-[#2E7D32]' : 'bg-gray-300'}`} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR Code & Blockchain */}
                <div className="space-y-4">
                  {/* QR Code */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#1a1a1a' }}>
                      <QrCode size={20} className="text-[#2E7D32]" />
                      Track QR
                    </h3>
                    <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center">
                      <div className="w-40 h-40 bg-white rounded-lg p-3 border-2 border-gray-300">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <rect width="100" height="100" fill="white"/>
                          <rect x="5" y="5" width="20" height="20" fill="black"/>
                          <rect x="75" y="5" width="20" height="20" fill="black"/>
                          <rect x="5" y="75" width="20" height="20" fill="black"/>
                          <rect x="35" y="15" width="5" height="5" fill="black"/>
                          <rect x="45" y="15" width="5" height="5" fill="black"/>
                          <rect x="55" y="15" width="5" height="5" fill="black"/>
                          <rect x="35" y="35" width="30" height="30" fill="black"/>
                          <rect x="40" y="40" width="20" height="20" fill="white"/>
                          <rect x="15" y="35" width="5" height="5" fill="black"/>
                          <rect x="75" y="35" width="5" height="5" fill="black"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Record */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-purple-900">
                      <Shield size={20} />
                      Blockchain Record
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Hash size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="break-all text-purple-700 font-mono text-xs">
                          0x4f7a3b2c...9d8e1f6a
                        </div>
                      </div>
                      <p className="text-xs text-purple-600">
                        Verified on Ethereum
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1a1a1a' }}>
                  <DollarSign size={24} className="text-[#2E7D32]" />
                  Payment Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <CreditCard size={20} className="text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">Payment Method</div>
                        <div className="font-semibold text-gray-900">{selectedPayment.paymentMethod}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Hash size={20} className="text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">Transaction ID</div>
                        <div className="font-semibold text-gray-900 font-mono text-sm">{selectedPayment.transactionId}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <DollarSign size={20} className="text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">Payment Amount</div>
                        <div className="font-semibold text-2xl bg-gradient-to-r from-[#2E7D32] to-[#388E3C] bg-clip-text text-transparent">
                          {selectedPayment.amount}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Calendar size={20} className="text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">Payment Date</div>
                        <div className="font-semibold text-gray-900">{selectedPayment.paymentDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 py-4 border-2 border-gray-300 rounded-2xl font-bold hover:border-[#2E7D32] hover:bg-gray-50 transition-all">
                  Download Invoice
                </button>
                <button className="flex-1 py-4 bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">
                  Mark as Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
