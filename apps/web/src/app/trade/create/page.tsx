'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2Icon, 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  MicIcon, 
  CoinsIcon, 
  ShieldCheckIcon,
  PackageIcon
} from 'lucide-react';
import { createTrade } from '@/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TradeResult {
  tradeId: string;
  txHash?: string;
}

type Step = 1 | 2 | 3 | 4;

// ─── Crop data ────────────────────────────────────────────────────────────────

const CROPS = [
  {
    name: 'Wheat',
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
    gradient: 'from-[#1B4332]/85 via-[#1B4332]/40 to-transparent',
  },
  {
    name: 'Tomato',
    emoji: '🍅',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80',
    gradient: 'from-[#7F1D1D]/85 via-[#7F1D1D]/40 to-transparent',
  },
  {
    name: 'Rice',
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80',
    gradient: 'from-[#713F12]/85 via-[#713F12]/40 to-transparent',
  },
  {
    name: 'Onion',
    emoji: '🧅',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80',
    gradient: 'from-[#4C1D95]/85 via-[#4C1D95]/40 to-transparent',
  },
  {
    name: 'Potato',
    emoji: '🥔',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80',
    gradient: 'from-[#78350F]/85 via-[#78350F]/40 to-transparent',
  },
  {
    name: 'Corn',
    emoji: '🌽',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80',
    gradient: 'from-[#7C2D12]/85 via-[#7C2D12]/40 to-transparent',
  },
  {
    name: 'Chilli',
    emoji: '🌶️',
    image: 'https://images.unsplash.com/photo-1526346698789-22fd84314424?w=600&q=80',
    gradient: 'from-[#881337]/85 via-[#881337]/40 to-transparent',
  },
  {
    name: '__custom__',
    emoji: '✏️',
    image: '',
    gradient: '',
  },
];

const STEP_LABELS = [
  'Select Crop',
  'Set Quantity',
  'Quality Specs',
  'Final Confirm',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateTradePage() {
  const router = useRouter();

  // ── Form state ───────────────────────────────────────────────────────────
  const [step,          setStep]          = useState<Step>(1);
  const [selectedCrop,  setSelectedCrop]  = useState('');
  const [customCrop,    setCustomCrop]    = useState('');
  const [quantity,      setQuantity]      = useState('');
  const [price,         setPrice]         = useState('');
  const [traderPhone,   setTraderPhone]   = useState('');
  const [quality,       setQuality]       = useState<'Low'|'Medium'|'High'>('Medium');
  const [moisture,      setMoisture]      = useState<'<10%'|'10-12%'|'12-14%'>('10-12%');
  const [foreignMatter, setForeignMatter] = useState<'<1%'|'1-2%'|'>2%'>('<1%');
  const [comments,      setComments]      = useState('');
  const [fromCity,      setFromCity]      = useState('');
  const [toCity,        setToCity]        = useState('');
  const [deliveryDate,  setDeliveryDate]  = useState('');

  // ── Submit state ─────────────────────────────────────────────────────────
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState<TradeResult | null>(null);

  // ── Auth ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem('agrochain_token')) router.push('/login');
  }, [router]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const cropName = selectedCrop === '__custom__' ? customCrop : selectedCrop;
  const totalPrice = quantity && price
    ? (Number(quantity) * Number(price)).toLocaleString('en-IN')
    : null;

  function nextStep() {
    if (step === 1 && !cropName.trim()) { setError('Please select or type a crop.'); return; }
    if (step === 2) {
      if (!quantity || Number(quantity) <= 0) { setError('Enter a valid quantity.'); return; }
      if (!price    || Number(price)    <= 0) { setError('Enter a valid price.'); return; }
      if (!traderPhone.trim() || traderPhone.length < 10) { setError("Enter trader's 10-digit phone number."); return; }
    }
    setError('');
    setStep(s => (s + 1) as Step);
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');

    try {
      const data = await createTrade({
        traderPhone: traderPhone.trim(),
        cropName:    cropName.trim(),
        quantity:    Number(quantity),
        price:       Number(price),
        fromCity:    fromCity.trim(),
        toCity:      toCity.trim(),
        deliveryDate: deliveryDate
      });
      setSuccess({ tradeId: data.tradeId ?? data.id ?? 'N/A', txHash: data.txHash });
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Failed to create trade.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('agrochain_token');
    localStorage.removeItem('agrochain_user');
    router.push('/');
  }

  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('agrochain_user') : null;
  const user    = userRaw ? JSON.parse(userRaw) : null;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="border-b bg-card px-6 md:px-10 h-16 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button onClick={() => router.push('/dashboard/farmer')} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-lg">🌱</div>
          <span className="font-bold text-lg tracking-tight">AgroChain</span>
        </button>

        <div className="hidden md:block">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/farmer">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Sell Harvest</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-muted-foreground text-sm font-medium">
            {user?.name ?? 'Farmer'}
          </span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-10">
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create Sell Listing</h1>
          <p className="text-muted-foreground mt-2">Complete the steps below to list your produce for traders.</p>
        </div>

        {/* ── Progress Section ────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold uppercase tracking-wider text-primary">
              Step {step} of 4: {STEP_LABELS[step - 1]}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round((step / 4) * 100)}% Complete
            </span>
          </div>
          <Progress value={(step / 4) * 100} className="h-2" />
        </div>

        <Card className="shadow-xl border-border/50 overflow-hidden">
          {/* ── STEP 1 — Select Crop ──────────────────────────────────── */}
          {step === 1 && (
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-1">Select your harvest crop</h2>
                <p className="text-muted-foreground">Choose from our pre-listed crops or type your own.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                {CROPS.map(crop => {
                  if (crop.name === '__custom__') {
                    const isSelected = selectedCrop === '__custom__';
                    return (
                      <Card 
                        key="custom"
                        onClick={() => setSelectedCrop('__custom__')}
                        className={`cursor-pointer transition-all border-2 overflow-hidden ${
                          isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-dashed hover:border-primary/50'
                        }`}
                      >
                        <div className="p-4 flex flex-col items-center justify-center text-center h-full min-h-[120px]">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-xl mb-3 shadow-inner">✏️</div>
                          <span className="font-bold text-sm">Other Crop</span>
                          {isSelected && (
                            <Input
                              autoFocus
                              value={customCrop}
                              onChange={(e: any) => setCustomCrop(e.target.value)}
                              onClick={(e: any) => e.stopPropagation()}
                              placeholder="Type name..."
                              className="mt-3 h-8 text-xs text-center font-medium"
                            />
                          )}
                        </div>
                      </Card>
                    );
                  }

                  const isSelected = selectedCrop === crop.name;
                  return (
                    <Card
                      key={crop.name}
                      onClick={() => setSelectedCrop(crop.name)}
                      className={`relative cursor-pointer transition-all border-2 overflow-hidden group ${
                        isSelected ? 'border-primary ring-1 ring-primary' : 'hover:border-primary/50'
                      }`}
                    >
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                        style={{ backgroundImage: `url('${crop.image}')` }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${crop.gradient} ${isSelected ? 'opacity-100' : 'opacity-80'}`} />
                      
                      <div className="relative p-4 flex flex-col items-center justify-center text-center h-full min-h-[120px] text-white">
                        <div className="text-3xl mb-2 drop-shadow-md">{crop.emoji}</div>
                        <span className="font-black text-sm uppercase tracking-wider drop-shadow-md">{crop.name}</span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-white text-primary rounded-full p-0.5 shadow-lg">
                            <CheckCircle2Icon className="size-4" />
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="bg-muted/50 p-4 rounded-xl border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <MicIcon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Voice Selection</h4>
                    <p className="text-xs text-muted-foreground">Still can't find your crop? Just say it!</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="font-bold">
                  Start Listening
                </Button>
              </div>
            </CardContent>
          )}

          {/* ── STEP 2 — Set Quantity ─────────────────────────────────── */}
          {step === 2 && (
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-1">Quantity & Pricing</h2>
                <p className="text-muted-foreground">Set the weight, expected price, and trader details.</p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 flex items-center gap-6">
                <div className="text-5xl">{CROPS.find(c => c.name === selectedCrop)?.emoji ?? '🌱'}</div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-1 px-2 border-primary/30 text-primary font-bold">Selected Crop</Badge>
                  <h3 className="text-2xl font-black">{cropName}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">Market Trend</div>
                  <div className="text-lg font-black text-green-600">₹25/kg</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <Label className="text-lg font-bold">Quantity (kg)</Label>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      className="size-14 rounded-xl text-xl"
                      onClick={() => setQuantity(q => String(Math.max(1, Number(q) - 50)))}
                    >−</Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e: any) => setQuantity(e.target.value)}
                      className="h-14 text-2xl font-black text-center rounded-xl"
                      placeholder="0"
                    />
                    <Button 
                      variant="outline"
                      className="size-14 rounded-xl text-xl"
                      onClick={() => setQuantity(q => String(Number(q || 0) + 50))}
                    >+</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-bold">Expected Price per kg</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">₹</span>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e: any) => setPrice(e.target.value)}
                      className="h-14 pl-10 text-2xl font-black rounded-xl"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {totalPrice && (
                <div className="bg-foreground text-background rounded-2xl p-6 mb-8 flex items-center justify-between shadow-lg">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-1">Calculated Total Valuation</h4>
                    <span className="text-3xl font-black tracking-tighter">₹ {totalPrice}</span>
                  </div>
                  <CoinsIcon className="size-10 opacity-20" />
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-bold">Trader's Phone Number (for direct offer)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">+91</span>
                    <Input
                      type="tel"
                      value={traderPhone}
                      onChange={(e: any) => setTraderPhone(e.target.value)}
                      className="pl-14 h-12 font-bold tracking-widest text-lg"
                      placeholder="00000 00000"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">The trader will receive a notification about your produce automatically.</p>
                </div>
              </div>
            </CardContent>
          )}

          {/* ── STEP 3 — Set Quality ──────────────────────────────────── */}
          {step === 3 && (
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-1">Harvest Logistics & Quality</h2>
                <p className="text-muted-foreground">Specify the detailed particulars of your harvest.</p>
              </div>

              <div className="flex items-center gap-4 py-4 px-6 bg-muted/40 rounded-xl border mb-8 font-bold">
                <PackageIcon className="size-5 text-primary" />
                <span>{quantity} kg of {cropName} @ ₹{price}/kg</span>
              </div>

              <div className="space-y-10">
                <QualitySelector 
                  label="Moisture Content" 
                  options={['<10%', '10-12%', '12-14%']} 
                  value={moisture} 
                  onChange={(v: any) => setMoisture(v)} 
                />
                <QualitySelector 
                  label="Grade / Quality" 
                  options={['Low', 'Medium', 'High']} 
                  value={quality} 
                  onChange={(v: any) => setQuality(v)} 
                  help="Medium: Standard wholesale quality with minimal variations."
                />
                <QualitySelector 
                  label="Foreign Matter" 
                  options={['<1%', '1-2%', '>2%']} 
                  value={foreignMatter} 
                  onChange={(v: any) => setForeignMatter(v)} 
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-lg font-bold">Source City (Farmer)</Label>
                    <Input 
                      placeholder="e.g., Sangrur, Punjab"
                      value={fromCity}
                      onChange={(e: any) => setFromCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-lg font-bold">Destination City (Trader)</Label>
                    <Input 
                      placeholder="e.g., Mumbai, Maharashtra"
                      value={toCity}
                      onChange={(e: any) => setToCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-bold">Target Delivery Date</Label>
                  <Input 
                    type="date"
                    value={deliveryDate}
                    onChange={(e: any) => setDeliveryDate(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground italic">Required for logistics bundling suggestions.</p>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-bold">Farmer's Remarks (Optional)</Label>
                  <Input 
                    placeholder="e.g., Organic grown, machine cleaned, ready for pickup..." 
                    className="h-20"
                    value={comments}
                    onChange={(e: any) => setComments(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          )}

          {/* ── STEP 4 — Confirm / Success ────────────────────────────── */}
          {step === 4 && (
            <CardContent className="p-8">
              {success ? (
                <div className="py-10 text-center flex flex-col items-center">
                  <div className="size-24 bg-green-100 rounded-full flex items-center justify-center text-5xl mb-6 shadow-xl shadow-green-100/50 animate-bounce">
                    🎉
                  </div>
                  <h2 className="text-4xl font-black tracking-tight mb-2">Listing Alive!</h2>
                  <p className="text-xl text-muted-foreground mb-10 max-w-md mx-auto">
                    Successfully posted your <span className="font-bold text-foreground">{cropName}</span> harvest on the AgroChain blockchain.
                  </p>

                  <Card className="w-full max-w-md bg-muted/30 border-2 border-dashed mb-10 text-left overflow-hidden">
                    <div className="p-6 space-y-4 font-mono text-sm">
                      <div className="flex justify-between border-b border-muted pb-1">
                        <span className="opacity-50">TRADE ID</span>
                        <span className="font-bold">#{success.tradeId}</span>
                      </div>
                      <div className="flex justify-between border-b border-muted pb-1">
                        <span className="opacity-50">QTY / PRICE</span>
                        <span className="font-bold">{quantity}kg @ ₹{price}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg text-primary pt-1">
                        <span>TOTAL</span>
                        <span>₹{totalPrice}</span>
                      </div>
                      {success.txHash && (
                        <div className="pt-4 overflow-hidden">
                          <span className="opacity-50 block mb-1">TX HASH</span>
                          <div className="bg-card p-2 rounded border break-all text-[10px] leading-relaxed">
                            {success.txHash}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <Button size="lg" className="h-14 font-bold text-lg" onClick={() => router.push(`/trade/${success.tradeId}`)}>
                      Explore Trade Details
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 font-bold text-lg" onClick={() => router.push('/dashboard/farmer')}>
                      Return to Dashboard
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-1">Final Confirmation</h2>
                    <p className="text-muted-foreground">Review your harvest details before pushing to the blockchain.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="rounded-2xl border-2 overflow-hidden">
                      <div 
                        className="h-32 bg-cover bg-center" 
                        style={{ backgroundImage: `url('${CROPS.find(c=>c.name===selectedCrop)?.image ?? ''}')` }}
                      >
                        <div className="h-full w-full bg-black/40 flex items-center justify-center">
                          <span className="text-5xl drop-shadow-lg">{CROPS.find(c=>c.name===selectedCrop)?.emoji ?? '🌱'}</span>
                        </div>
                      </div>
                      <div className="p-6 bg-card">
                        <h3 className="text-2xl font-black mb-1">{cropName}</h3>
                        <Badge className="font-bold">{quality} Grade</Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <SummaryItem label="Quantity" value={`${quantity} kg`} />
                      <SummaryItem label="Price" value={`₹${price} / kg`} />
                      <SummaryItem label="Total Pay" value={`₹ ${totalPrice}`} highlight />
                      <SummaryItem label="Moisture" value={moisture} />
                      <SummaryItem label="Foreign Matter" value={foreignMatter} />
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-200 mb-10 text-amber-900 flex items-start gap-4">
                    <ShieldCheckIcon className="size-6 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <span className="font-bold underline block mb-1">Blockchain Verification</span>
                      By clicking the button below, your listing will be permanently hashed onto the Shardeum testnet. This action cannot be undone once confirmed.
                    </div>
                  </div>

                  {error && (
                    <div className="mb-8 p-4 bg-destructive/10 border border-destructive/50 text-destructive rounded-xl font-bold text-sm">
                      ⚠️ ERROR: {error}
                    </div>
                  )}

                  <Button 
                    size="lg" 
                    className="w-full h-20 text-2xl font-black rounded-2xl shadow-2xl shadow-primary/30 animate-pulse hover:animate-none"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        Mining Transaction...
                      </div>
                    ) : (
                      '🚀 BROADCAST PRODUCE'
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          )}

          {/* ── Footer Navigation ────────────────────────────────────── */}
          {step < 4 && (
            <CardFooter className="bg-muted/50 p-6 flex justify-between items-center border-t">
              <Button 
                variant="ghost" 
                className="font-bold gap-2"
                onClick={() => step > 1 ? setStep(s => (s - 1) as Step) : router.push('/dashboard/farmer')}
              >
                <ChevronLeftIcon className="size-4" /> Back
              </Button>
              <Button 
                className="font-bold px-10 gap-2 h-12 shadow-md"
                onClick={nextStep}
              >
                {step === 3 ? 'Review Summary' : 'Next Step'} <ChevronRightIcon className="size-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  );
}

// ─── Small UI Helpers ──────────────────────────────────────────────────────────

function QualitySelector({ label, options, value, onChange, help }: any) {
  return (
    <div className="space-y-4">
      <Label className="text-lg font-bold">{label}</Label>
      <div className="flex gap-3 flex-wrap">
        {options.map((opt: string) => (
          <Button
            key={opt}
            variant={value === opt ? "default" : "outline"}
            className={`rounded-full px-6 py-2 h-auto text-sm font-bold transition-all ${value === opt ? 'shadow-lg scale-105' : ''}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </Button>
        ))}
      </div>
      {help && <p className="text-xs text-muted-foreground italic">💡 {help}</p>}
    </div>
  );
}

function SummaryItem({ label, value, highlight }: any) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${highlight ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'}`}>
      <span className="text-sm font-bold opacity-60 uppercase tracking-widest">{label}</span>
      <span className={`font-black ${highlight ? 'text-lg text-primary' : 'text-base'}`}>{value}</span>
    </div>
  );
}
