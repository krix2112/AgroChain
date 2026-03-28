'use client';

import { useState } from 'react';
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
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, MapPinIcon, StarIcon, PhoneIcon, CheckCircle2Icon } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Listing {
  id: string;
  cropName: string;
  emoji: string;
  farmerName: string;
  farmerLocation: string;
  farmerRating: number;
  farmerTrades: number;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  quality: 'Premium' | 'Medium' | 'Standard';
  moisture: string;
  foreignMatter: string;
  dispatchDays: number;
  postedAt: string;
  image: string;
  gradient: string;
  verified: boolean;
  description: string;
}

// ─── Hardcoded listings ───────────────────────────────────────────────────────

const ALL_LISTINGS: Listing[] = [
  {
    id: 'L001',
    cropName: 'Wheat',
    emoji: '🌾',
    farmerName: 'Ramesh Kumar',
    farmerLocation: 'Mathura, UP',
    farmerRating: 4.8,
    farmerTrades: 24,
    quantity: 500,
    unit: 'kg',
    pricePerUnit: 28,
    quality: 'Premium',
    moisture: '10–12%',
    foreignMatter: '< 1%',
    dispatchDays: 2,
    postedAt: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
    gradient: 'from-[#1B4332]/80 to-[#1B4332]/20',
    verified: true,
    description: 'Well-cleaned wheat with uniform grain size. No pesticides used. Direct from farm.',
  },
  {
    id: 'L002',
    cropName: 'Tomato',
    emoji: '🍅',
    farmerName: 'Suresh Patel',
    farmerLocation: 'Nashik, Maharashtra',
    farmerRating: 4.6,
    farmerTrades: 18,
    quantity: 2000,
    unit: 'kg',
    pricePerUnit: 22,
    quality: 'Premium',
    moisture: 'Fresh',
    foreignMatter: 'None',
    dispatchDays: 1,
    postedAt: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80',
    gradient: 'from-[#7F1D1D]/80 to-[#7F1D1D]/20',
    verified: true,
    description: 'Grade A tomatoes, uniform red color, firm texture. Packed and ready for transport.',
  },
  {
    id: 'L003',
    cropName: 'Onion',
    emoji: '🧅',
    farmerName: 'Mohan Singh',
    farmerLocation: 'Lasalgaon, Maharashtra',
    farmerRating: 4.5,
    farmerTrades: 31,
    quantity: 1000,
    unit: 'kg',
    pricePerUnit: 18,
    quality: 'Medium',
    moisture: '12–14%',
    foreignMatter: '< 2%',
    dispatchDays: 3,
    postedAt: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80',
    gradient: 'from-[#4C1D95]/80 to-[#4C1D95]/20',
    verified: true,
    description: 'Red onions, medium to large size. Stored in dry conditions. Bulk quantity available.',
  },
  {
    id: 'L004',
    cropName: 'Rice',
    emoji: '🌾',
    farmerName: 'Vijay Reddy',
    farmerLocation: 'Warangal, Telangana',
    farmerRating: 4.9,
    farmerTrades: 42,
    quantity: 800,
    unit: 'kg',
    pricePerUnit: 55,
    quality: 'Premium',
    moisture: '< 10%',
    foreignMatter: '< 1%',
    dispatchDays: 2,
    postedAt: '1 day ago',
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80',
    gradient: 'from-[#713F12]/80 to-[#713F12]/20',
    verified: true,
    description: 'Sona Masuri variety. Machine cleaned, no broken grains. Excellent taste and aroma.',
  },
  {
    id: 'L005',
    cropName: 'Potato',
    emoji: '🥔',
    farmerName: 'Raju Verma',
    farmerLocation: 'Agra, UP',
    farmerRating: 4.3,
    farmerTrades: 15,
    quantity: 3000,
    unit: 'kg',
    pricePerUnit: 15,
    quality: 'Standard',
    moisture: '12–14%',
    foreignMatter: '1–2%',
    dispatchDays: 4,
    postedAt: '1 day ago',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80',
    gradient: 'from-[#78350F]/80 to-[#78350F]/20',
    verified: false,
    description: 'Kufri Jyoti variety. Large size, suitable for chips and processing industry.',
  },
  {
    id: 'L006',
    cropName: 'Corn',
    emoji: '🌽',
    farmerName: 'Dilip Sharma',
    farmerLocation: 'Rajkot, Gujarat',
    farmerRating: 4.7,
    farmerTrades: 28,
    quantity: 600,
    unit: 'kg',
    pricePerUnit: 20,
    quality: 'Medium',
    moisture: '10–12%',
    foreignMatter: '< 1%',
    dispatchDays: 2,
    postedAt: '2 days ago',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80',
    gradient: 'from-[#7C2D12]/80 to-[#7C2D12]/20',
    verified: true,
    description: 'Sweet corn, freshly harvested. Good for retail and wholesale markets.',
  },
  {
    id: 'L007',
    cropName: 'Chilli',
    emoji: '🌶️',
    farmerName: 'Narasimha Rao',
    farmerLocation: 'Guntur, Andhra Pradesh',
    farmerRating: 4.9,
    farmerTrades: 56,
    quantity: 200,
    unit: 'kg',
    pricePerUnit: 120,
    quality: 'Premium',
    moisture: '< 10%',
    foreignMatter: '< 1%',
    dispatchDays: 1,
    postedAt: '3 days ago',
    image: 'https://images.unsplash.com/photo-1526346698789-22fd84314424?w=600&q=80',
    gradient: 'from-[#881337]/80 to-[#881337]/20',
    verified: true,
    description: 'Guntur red chilli, high capsaicin content. Dry and well sorted. Export quality.',
  },
  {
    id: 'L008',
    cropName: 'Wheat',
    emoji: '🌾',
    farmerName: 'Harpal Singh',
    farmerLocation: 'Ludhiana, Punjab',
    farmerRating: 4.7,
    farmerTrades: 33,
    quantity: 1200,
    unit: 'kg',
    pricePerUnit: 30,
    quality: 'Premium',
    moisture: '10–12%',
    foreignMatter: '< 1%',
    dispatchDays: 1,
    postedAt: '3 days ago',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
    gradient: 'from-[#1B4332]/80 to-[#1B4332]/20',
    verified: true,
    description: 'HD 2967 variety wheat. Machine harvested, cleaned and stored. Ready for flour mills.',
  },
];

const CROPS_FILTER = ['All', 'Wheat', 'Tomato', 'Onion', 'Rice', 'Potato', 'Corn', 'Chilli'];
const SORT_OPTIONS = [
  { label: 'Latest', value: 'Latest' },
  { label: 'Price: Low to High', value: 'Price Low to High' },
  { label: 'Price: High to Low', value: 'Price High to Low' },
  { label: 'Quantity', value: 'Quantity' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function BrowseListings() {
  const router = useRouter();

  const [cropFilter,   setCropFilter]   = useState('All');
  const [sortBy,       setSortBy]       = useState('Latest');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [contactShown,    setContactShown]    = useState<string | null>(null);

  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('agrochain_user') : null;
  const user    = userRaw ? JSON.parse(userRaw) : null;

  function handleLogout() {
    localStorage.removeItem('agrochain_token');
    localStorage.removeItem('agrochain_user');
    router.push('/');
  }

  // ── Filter + sort ────────────────────────────────────────────────────────

  let filtered = ALL_LISTINGS.filter(l => {
    const matchesCrop   = cropFilter === 'All' || l.cropName === cropFilter;
    const matchesSearch = l.cropName.toLowerCase().includes(searchQuery.toLowerCase())
                       || l.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
                       || l.farmerLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'Price Low to High')  return a.pricePerUnit - b.pricePerUnit;
    if (sortBy === 'Price High to Low')  return b.pricePerUnit - a.pricePerUnit;
    if (sortBy === 'Quantity')            return b.quantity - a.quantity;
    return 0; // Latest = default order
  });

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="border-b bg-card px-6 md:px-12 h-16 flex items-center justify-between sticky top-0 z-50 shadow-sm">
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
                <BreadcrumbPage>Browse Listings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-muted-foreground text-sm font-medium">
            {user?.name ?? 'Trader'}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* ── Page header ──────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Browse Listings</h1>
            <p className="text-muted-foreground mt-2">
              Explore {filtered.length} available harvests directly from verified farmers across India.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              All Verified Listings
            </Badge>
          </div>
        </div>

        {/* ── Search + Sort bar ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              placeholder="Search by crop, farmer, or location..."
              className="pl-10 h-11 text-base shadow-sm"
            />
          </div>

          {/* Sort */}
          <div className="w-full sm:w-[240px]">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-11 shadow-sm">
                <SelectValue placeholder="Sort listings..." />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Crop filter chips ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CROPS_FILTER.map(crop => (
            <Button
              key={crop}
              variant={cropFilter === crop ? "default" : "outline"}
              onClick={() => setCropFilter(crop)}
              className="rounded-full px-5 py-2 h-auto text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            >
              {crop}
            </Button>
          ))}
        </div>

        {/* ── Listings grid ─────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <Card className="border-dashed py-20 text-center flex flex-col items-center">
            <div className="text-5xl mb-4">🌱</div>
            <CardTitle className="text-2xl">No listings found</CardTitle>
            <CardDescription className="max-w-[300px] mt-2 text-lg">
              Try adjusting your search terms or filters to find more harvests.
            </CardDescription>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onView={() => setSelectedListing(listing)}
                onContact={() => setContactShown(listing.id)}
                contactShown={contactShown === listing.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Detail Modal ─────────────────────────────────────────────────── */}
      {selectedListing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedListing(null)}
        >
          <Card
            className="relative w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e: any) => e.stopPropagation()}
          >
            {/* Hero image placeholder or gradient */}
            <div
              className={`h-48 relative bg-cover bg-center`}
              style={{ backgroundImage: `url('${selectedListing.image}')` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-t ${selectedListing.gradient}`} />
              <div className="absolute bottom-6 left-6 text-white drop-shadow-md">
                <div className="text-4xl mb-1">{selectedListing.emoji}</div>
                <h2 className="text-3xl font-bold">{selectedListing.cropName}</h2>
                <p className="opacity-90 flex items-center gap-1.5 font-medium mt-1">
                  <MapPinIcon className="size-4" /> {selectedListing.farmerLocation}
                </p>
              </div>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setSelectedListing(null)}
                className="absolute top-4 right-4 rounded-full size-10 shadow-lg"
              >
                ✕
              </Button>
            </div>

            <CardContent className="p-8">
              {/* Farmer Info Bar */}
              <div className="flex items-center gap-5 pb-8 mb-8 border-b">
                <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl border border-primary/20">
                  👨‍🌾
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{selectedListing.farmerName}</h3>
                    {selectedListing.verified && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80 border-none font-bold py-0.5">
                        <CheckCircle2Icon className="size-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground flex items-center flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1"><StarIcon className="size-3.5 text-orange-400 fill-orange-400" /> {selectedListing.farmerRating}</span>
                    <span>{selectedListing.farmerTrades} trades completed</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-1.5 font-bold uppercase tracking-wider">
                  {selectedListing.quality}
                </Badge>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <StatTile label="Quantity" value={`${selectedListing.quantity} ${selectedListing.unit}`} />
                <StatTile label="Price per unit" value={`₹${selectedListing.pricePerUnit}`} highlight />
                <StatTile label="Total Value" value={`₹${(selectedListing.quantity * selectedListing.pricePerUnit).toLocaleString('en-IN')}`} highlight large />
                <StatTile label="Dispatch" value={`${selectedListing.dispatchDays} day${selectedListing.dispatchDays > 1 ? 's' : ''}`} />
                <StatTile label="Moisture" value={selectedListing.moisture} />
                <StatTile label="Foreign Matter" value={selectedListing.foreignMatter} />
              </div>

              {/* Description */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">Farmer's Description</h4>
                <p className="text-lg leading-relaxed text-foreground italic bg-muted/30 p-4 rounded-xl border">
                  "{selectedListing.description}"
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 h-14 text-lg font-bold shadow-xl shadow-primary/20"
                  onClick={() => {
                    setSelectedListing(null);
                    router.push(`/trade/create?farmer=${selectedListing.farmerName}&crop=${selectedListing.cropName}&price=${selectedListing.pricePerUnit}`);
                  }}
                >
                  🤝 Create Trade Deal
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 h-14 text-lg font-bold border-2 hover:bg-primary/5"
                  onClick={() => setContactShown(selectedListing.id)}
                >
                  <PhoneIcon className="size-5 mr-2" /> Show Contact
                </Button>
              </div>

              {contactShown === selectedListing.id && (
                <div className="mt-6 p-4 bg-primary/10 rounded-xl border-2 border-primary/20 flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Available Number</span>
                    <div className="text-2xl font-black text-primary tracking-tighter mt-1">+91 98765 43210</div>
                  </div>
                  <Button size="icon" variant="secondary" className="rounded-full size-12 shadow-lg">
                    📱
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ListingCard({
  listing, onView, onContact, contactShown,
}: {
  listing: Listing;
  onView: () => void;
  onContact: () => void;
  contactShown: boolean;
}) {
  const totalValue = (listing.quantity * listing.pricePerUnit).toLocaleString('en-IN');

  const qualityStyles = {
    Premium:  'bg-green-100 text-green-700 hover:bg-green-100/90',
    Medium:   'bg-amber-100 text-amber-700 hover:bg-amber-100/90',
    Standard: 'bg-slate-100 text-slate-700 hover:bg-slate-100/90',
  };

  return (
    <Card className="group overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 border-border/50">
      {/* Photo area */}
      <div className="relative h-44 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url('${listing.image}')` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${listing.gradient} opacity-90`} />
        
        <div className="absolute top-3 left-3 flex gap-2">
          {listing.verified && (
            <Badge className="bg-white/95 text-green-700 border-none font-bold py-1">
              ✓ Verified
            </Badge>
          )}
          <Badge className={`${qualityStyles[listing.quality]} border-none font-bold py-1 shadow-sm`}>
            {listing.quality}
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-black/40 text-white backdrop-blur-md border-none font-medium text-[10px] uppercase tracking-wider">
            {listing.postedAt}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 text-white">
          <div className="text-3xl mb-0.5">{listing.emoji}</div>
          <h3 className="text-2xl font-black drop-shadow-lg tracking-tight">{listing.cropName}</h3>
        </div>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        {/* Farmer summary */}
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-lg border">
            👨‍🌾
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base truncate">{listing.farmerName}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium mt-0.5">
              <MapPinIcon className="size-3" /> {listing.farmerLocation}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-orange-500">
            <StarIcon className="size-3.5 fill-orange-500" /> {listing.farmerRating}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-muted/40 rounded-xl p-3 border">
            <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Quantity</div>
            <div className="font-black text-sm">{listing.quantity} {listing.unit}</div>
          </div>
          <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
            <div className="text-[10px] uppercase font-bold text-primary/70 tracking-widest mb-1 text-center">Price / kg</div>
            <div className="font-black text-base text-primary text-center">₹{listing.pricePerUnit}</div>
          </div>
        </div>

        {/* Total Price Bar */}
        <div className="mb-6 py-3 px-4 bg-muted/20 border-y flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Value</span>
          <span className="text-lg font-black text-foreground">₹{totalValue}</span>
        </div>

        <div className="mt-auto space-y-3">
          <Button onClick={onView} className="w-full font-bold h-11 text-sm shadow-md transition-all active:scale-95 group-hover:scale-[1.02]">
            View Particulars
          </Button>
          <Button onClick={onContact} variant="outline" className="w-full font-bold h-11 text-sm border-2 hover:bg-primary/5">
            <PhoneIcon className="size-4 mr-2" /> Contact Farmer
          </Button>
        </div>
        
        {contactShown && (
          <div className="mt-4 p-3 bg-primary/10 border-t-2 border-primary/20 rounded-b-xl animate-in fade-in slide-in-from-top-2">
            <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Call direct</div>
            <div className="text-lg font-black text-primary tracking-tight">+91 98765 43210</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatTile({ label, value, highlight, large, className }: { 
  label: string; 
  value: string; 
  highlight?: boolean; 
  large?: boolean;
  className?: string;
}) {
  return (
    <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${highlight ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-muted/30'} ${className}`}>
      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 ${highlight ? 'text-primary/70' : 'text-muted-foreground'}`}>{label}</span>
      <span className={`font-black tracking-tight ${large ? 'text-2xl' : 'text-base text-foreground'} ${highlight ? 'text-primary' : ''}`}>{value}</span>
    </div>
  );
}
