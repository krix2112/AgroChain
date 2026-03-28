'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-emerald-900 text-white font-sans overflow-x-hidden">

      {/* Subtle background texture */}
      <div className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #4ade80 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #86efac 0%, transparent 40%),
                            radial-gradient(circle at 60% 80%, #166534 0%, transparent 50%)`
        }}
      />

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 border-b border-green-800/50 backdrop-blur-sm bg-green-950/30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <span className="text-xl font-bold tracking-tight text-green-300">AgroChain</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-green-300 hover:text-green-100 hover:bg-green-800/50">Login</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-green-500 hover:bg-green-400 text-green-950 font-semibold shadow-lg shadow-green-500/25">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-36">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Powered by Shardeum Blockchain
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Direct{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            Farm to Buyer
          </span>{" "}
          Trade
        </h1>

        <p className="text-lg md:text-xl text-green-200/70 max-w-2xl mb-10 leading-relaxed">
          No middlemen. Transparent prices.<br className="hidden md:block" />
          Every transaction stored on Shardeum Blockchain — forever.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register">
            <Button size="lg" className="px-8 h-12 rounded-xl bg-green-500 hover:bg-green-400 text-green-950 font-bold text-base transition-all duration-200 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5">
              Create Account
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="px-8 h-12 rounded-xl border-green-600 hover:border-green-400 text-green-300 hover:text-green-200 font-semibold text-base transition-all duration-200 hover:-translate-y-0.5">
              Login Now
            </Button>
          </Link>
        </div>
      </section>

      {/* ROLE CARDS */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <h2 className="text-center text-2xl font-bold text-green-200 mb-10">
          Who are you?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          {/* Farmer Card */}
          <div className="group relative rounded-2xl border border-green-700/50 bg-green-900/40 backdrop-blur-sm p-8 hover:border-green-500/70 hover:bg-green-800/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/50">
            <div className="text-4xl mb-4">🌾</div>
            <h3 className="text-xl font-bold text-green-100 mb-2">Farmer</h3>
            <p className="text-green-300/70 text-sm leading-relaxed mb-6">
              List your crops and get fair prices directly from traders — no middlemen cutting your earnings.
            </p>
            <Link href="/register?role=farmer">
              <Button variant="secondary" className="bg-green-600 hover:bg-green-500 text-white border-none">
                Join as Farmer →
              </Button>
            </Link>
          </div>

          {/* Trader Card */}
          <div className="group relative rounded-2xl border border-green-700/50 bg-green-900/40 backdrop-blur-sm p-8 hover:border-emerald-500/70 hover:bg-green-800/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/50">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-green-100 mb-2">Trader</h3>
            <p className="text-green-300/70 text-sm leading-relaxed mb-6">
              Browse verified crop listings and negotiate directly with farmers at transparent prices.
            </p>
            <Link href="/register?role=trader">
              <Button variant="secondary" className="bg-green-600 hover:bg-green-500 text-white border-none">
                Join as Trader →
              </Button>
            </Link>
          </div>

          {/* Transporter Card */}
          <div className="group relative rounded-2xl border border-green-700/50 bg-green-900/40 backdrop-blur-sm p-8 hover:border-teal-500/70 hover:bg-green-800/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/50">
            <div className="text-4xl mb-4">🚛</div>
            <h3 className="text-xl font-bold text-green-100 mb-2">Transporter</h3>
            <p className="text-green-300/70 text-sm leading-relaxed mb-6">
              Find delivery jobs near you and get paid automatically on successful completion.
            </p>
            <Link href="/register?role=transporter">
              <Button variant="secondary" className="bg-green-600 hover:bg-green-500 text-white border-none">
                Join as Transporter →
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-green-200 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {[
              {
                step: "01",
                icon: "🌾",
                title: "Farmer Lists Crop",
                desc: "Farmer creates a trade listing with crop details, quantity, and price.",
              },
              {
                step: "02",
                icon: "💳",
                title: "Trader Agrees & Pays",
                desc: "Trader reviews the listing, agrees to the deal, and pays via UPI.",
              },
              {
                step: "03",
                icon: "⛓️",
                title: "Proof on Blockchain",
                desc: "Every step is recorded on Shardeum blockchain — transparent and permanent.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-green-800/60 border border-green-600/50 flex items-center justify-center text-3xl">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 text-xs font-bold text-green-500 bg-green-950 border border-green-700 rounded-full w-6 h-6 flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-green-100 mb-2">{item.title}</h3>
                <p className="text-green-400/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}

          </div>

          {/* Connector line (desktop only) */}
          <div className="hidden md:flex items-center justify-between px-20 -mt-28 mb-20 pointer-events-none">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-green-600/40 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-green-800/50 py-6 text-center text-green-500/60 text-sm">
        Built on Shardeum Blockchain · Hackcraft 3.0
      </footer>

    </div>
  );
}
