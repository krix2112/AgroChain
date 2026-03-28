"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TransporterDashboard() {
  const router = useRouter();
  const [trades, setTrades] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("agrochain_user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      router.push("/login");
      return;
    }

    fetchTrades(token);
  }, []);

  const fetchTrades = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/trade/my/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTrades(data);
      }
    } catch (err) {
      console.error("Failed to fetch trades:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("agrochain_user");
    router.push("/");
  };

  const updateTradeState = async (id: string, action: "pickup" | "deliver") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/trade/${id}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        fetchTrades(token);
      } else {
        const err = await res.json();
        alert(err.error || `Failed to mark as ${action}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoadingId(null);
    }
  };

  if (!user) return null;

  const readyForPickup = trades.filter((t) => t.state === "AGREED" && t.transporter?._id === user.id);
  const inDelivery = trades.filter((t) => t.state === "IN_DELIVERY" && t.transporter?._id === user.id);
  const completed = trades.filter((t) => t.state === "COMPLETED" && t.transporter?._id === user.id);

  return (
    <div className="min-h-screen bg-green-50">
      {/* Top Bar */}
      <nav className="bg-green-700 text-white p-4 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">AgroChain</div>
        <div className="text-lg">Welcome, {user.name}</div>
        <div className="flex items-center space-x-4">
          <span className="text-sm bg-green-800 px-3 py-1 rounded-full">
            {user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}
          </span>
          <button
            onClick={handleLogout}
            className="hover:text-green-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="container mx-auto p-6 max-w-5xl space-y-8">
        {/* Section 1: Ready for Pickup */}
        <section>
          <h2 className="text-2xl font-bold text-green-800 mb-4 border-b border-green-200 pb-2">
            Ready for Pickup
          </h2>
          {readyForPickup.length === 0 ? (
            <p className="text-gray-500 italic">No trades ready for pickup.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readyForPickup.map((trade) => (
                <TradeCard 
                  key={trade._id} 
                  trade={trade} 
                  actionLabel="Mark Picked Up"
                  onAction={() => updateTradeState(trade._id, "pickup")}
                  isLoading={loadingId === trade._id}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section 2: In Delivery */}
        <section>
          <h2 className="text-2xl font-bold text-green-800 mb-4 border-b border-green-200 pb-2">
            In Delivery
          </h2>
          {inDelivery.length === 0 ? (
            <p className="text-gray-500 italic">No deliveries currently in progress.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inDelivery.map((trade) => (
                <TradeCard 
                  key={trade._id} 
                  trade={trade} 
                  actionLabel="Mark Delivered"
                  onAction={() => updateTradeState(trade._id, "deliver")}
                  isLoading={loadingId === trade._id}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section 3: Completed Deliveries */}
        <section>
          <h2 className="text-2xl font-bold text-green-800 mb-4 border-b border-green-200 pb-2 flex items-center justify-between">
            <span>Completed Deliveries</span>
            <span className="text-sm bg-green-200 text-green-800 px-3 py-1 rounded-full">
              {completed.length} Deliveries
            </span>
          </h2>
          {completed.length === 0 ? (
            <p className="text-gray-500 italic">No completed deliveries yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completed.map((trade) => (
                <TradeCard key={trade._id} trade={trade} completed />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function TradeCard({ trade, actionLabel, onAction, isLoading, completed }: any) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-green-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-800">{trade.cropName}</h3>
          <span className="text-green-700 font-semibold text-lg">₹{trade.price}</span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex justify-between">
            <span>Quantity:</span>
            <span className="font-medium text-gray-900">{trade.quantity} kg</span>
          </div>
          <div className="flex justify-between">
            <span>Farmer:</span>
            <span className="font-medium text-gray-900">{trade.farmer?.name || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span>Trader:</span>
            <span className="font-medium text-gray-900">{trade.trader?.name || 'Unknown'}</span>
          </div>
        </div>
      </div>

      {!completed && (
        <button
          onClick={onAction}
          disabled={isLoading}
          className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
            isLoading 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : actionLabel}
        </button>
      )}
      
      {completed && (
        <div className="w-full py-2.5 rounded-lg font-medium text-center bg-green-50 text-green-700 border border-green-200">
          Delivery Completed ✓
        </div>
      )}
    </div>
  );
}
