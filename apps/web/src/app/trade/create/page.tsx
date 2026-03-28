"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateTrade() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>("");
  
  // Form State
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [traderPhone, setTraderPhone] = useState("");
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ tradeId: string, txHash: string } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("agrochain_user");

    if (!storedToken || !storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "farmer") {
        router.push("/login");
        return;
      }
      setUser(parsedUser);
      setToken(storedToken);
    } catch (e) {
      router.push("/login");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !quantity || !price || !traderPhone) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessData(null);

    try {
      const res = await fetch("http://localhost:5000/api/trade/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cropName,
          quantity: Number(quantity),
          price: Number(price),
          traderPhone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessData({
          tradeId: data.trade?._id || data._id || "unknown", // Depending on API response structure
          txHash: data.txHash || "pending...",
        });
      } else {
        setError(data.error || "Failed to create trade");
      }
    } catch (err) {
      console.error(err);
      setError("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-green-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/dashboard/farmer"
            className="text-green-700 hover:text-green-900 flex items-center gap-2 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
          <div className="bg-green-700 text-white p-6">
            <h1 className="text-2xl font-bold">Create New Trade</h1>
            <p className="text-green-100 text-sm mt-1">Initiate a secure trade agreement on Shardeum</p>
          </div>

          <div className="p-6 md:p-8">
            {successData ? (
              <div className="text-center space-y-6 py-8">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-green-800">Trade Created Successfully!</h2>
                  <p className="text-gray-600 mt-2 font-medium">Trade #{successData.tradeId}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg break-all border border-gray-100 text-left">
                  <p className="text-sm text-gray-500 mb-1">Transaction Hash:</p>
                  <p className="font-mono text-sm text-green-800">{successData.txHash}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Link 
                    href={`/trade/${successData.tradeId}`}
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition"
                  >
                    View Trade
                  </Link>
                  <Link 
                    href="/dashboard/farmer"
                    className="px-6 py-3 bg-white text-green-700 border-2 border-green-600 font-medium rounded-xl hover:bg-green-50 transition"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Crop Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="e.g. Organic Wheat"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity (KG) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Amount to sell"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Total expected price"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Trader's Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={traderPhone}
                    onChange={(e) => setTraderPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="+91..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter the phone number of the trader you want to sell to
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl text-lg font-bold transition-all shadow-md ${
                      loading 
                        ? 'bg-green-400 text-white cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating trade on Shardeum blockchain...
                      </span>
                    ) : (
                      "Create Trade Agreement"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
