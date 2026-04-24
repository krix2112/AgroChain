  import {
  Search,
  ChevronDown,
  ArrowUp,
  MapPin,
  Truck,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MyOrdersProps {
  language: 'en' | 'hi';
  onBack?: () => void;
  onMarkAsPaid?: () => void;
  onTrackOrder?: () => void;
}

interface OrderData {
  id: string;
  cropName: string;
  cropNameHi: string;
  quantity: string;
  price: string;
  status: 'in-transit' | 'packed' | 'completed' | 'cancelled';
  statusLabel: string;
  statusLabelHi: string;
  statusColor: string;
  statusBgColor: string;
  orderedDate: string;
  buyerName: string;
  buyerLocation: string;
  buyerDistance: string;
  transportInfo?: string;
  transportDistance?: string;
  cropImage: string;
  progressSteps: {
    id: string;
    labelEn: string;
    labelHi: string;
    completed: boolean;
    current: boolean;
  }[];
  actionLabel: string;
  actionLabelHi: string;
  secondaryAction?: string;
  secondaryActionHi?: string;
}

const ORDERS: OrderData[] = [
  {
    id: '1',
    cropName: 'Wheat',
    cropNameHi: 'गेहूँ',
    quantity: '10 Quintals',
    price: '₹23,000',
    status: 'in-transit',
    statusLabel: 'In Transit',
    statusLabelHi: 'ट्रांज़िट में',
    statusColor: '#E65100',
    statusBgColor: '#FFF3E0',
    orderedDate: '22 Apr 2024',
    buyerName: 'Raj Traders',
    buyerLocation: 'Indore',
    buyerDistance: '12 km',
    transportInfo: 'MP14 ·· 1234',
    transportDistance: '12 km away',
    cropImage:
      'https://images.unsplash.com/photo-1713272195609-93ca51c20062?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGdyYWlucyUyMGNsb3NlJTIwdXAlMjBnb2xkZW58ZW58MXx8fHwxNzc0NTA0MjEzfDA&ixlib=rb-4.1.0&q=80&w=400',
    progressSteps: [
      {
        id: 'harvested',
        labelEn: 'Harvested',
        labelHi: 'काटा गया',
        completed: true,
        current: false,
      },
      {
        id: 'packed',
        labelEn: 'Packed',
        labelHi: 'पैक किया',
        completed: true,
        current: false,
      },
      {
        id: 'transit',
        labelEn: 'In Transit',
        labelHi: 'ट्रांज़िट में',
        completed: true,
        current: true,
      },
      {
        id: 'delivered',
        labelEn: 'Delivered',
        labelHi: 'डिलीवर',
        completed: false,
        current: false,
      },
    ],
    actionLabel: 'Track Order',
    actionLabelHi: 'ऑर्डर ट्रैक करें',
    secondaryAction: 'Contact',
    secondaryActionHi: 'संपर्क करें',
  },
  {
    id: '2',
    cropName: 'Tomato',
    cropNameHi: 'टमाटर',
    quantity: '50 Quintals',
    price: '₹75,000',
    status: 'packed',
    statusLabel: 'Packed',
    statusLabelHi: 'पैक किया',
    statusColor: '#2D6A2F',
    statusBgColor: '#E8F5E9',
    orderedDate: '20 Apr 2024',
    buyerName: 'Goyal Fresh',
    buyerLocation: 'Ujjain',
    buyerDistance: '35 km',
    transportInfo: 'MP14 ·· 5678',
    transportDistance: '1 km away',
    cropImage:
      'https://images.unsplash.com/photo-1700064165267-8fa68ef07167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0b21hdG9lcyUyMGZyZXNoJTIwcHJvZHVjZXxlbnwxfHx8fDE3NzQ1MDQyMTN8MA&ixlib=rb-4.1.0&q=80&w=400',
    progressSteps: [
      {
        id: 'harvested',
        labelEn: 'Harvested',
        labelHi: 'काटा गया',
        completed: true,
        current: false,
      },
      {
        id: 'packed',
        labelEn: 'Packed',
        labelHi: 'पैक किया',
        completed: true,
        current: true,
      },
      {
        id: 'transit',
        labelEn: 'In Transit',
        labelHi: 'ट्रांज़िट में',
        completed: false,
        current: false,
      },
      {
        id: 'delivered',
        labelEn: 'Delivered',
        labelHi: 'डिलीवर',
        completed: false,
        current: false,
      },
    ],
    actionLabel: 'Mark as Paid',
    actionLabelHi: 'भुगतान चिह्नित करें',
    secondaryAction: 'Contact',
    secondaryActionHi: 'संपर्क करें',
  },
];

function ProgressTracker({
  steps,
  language,
}: {
  steps: OrderData['progressSteps'];
  language: 'en' | 'hi';
}) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '20px 0' }}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          {/* Step Circle & Label */}
          <div className="flex flex-col items-center" style={{ minWidth: 80 }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                marginBottom: 8,
              }}
            >
              {step.completed ? (
                <CheckCircle2
                  className="w-6 h-6"
                  style={{
                    color: '#2D6A2F',
                    fill: '#2D6A2F',
                  }}
                />
              ) : (
                <Circle
                  className="w-6 h-6"
                  style={{
                    color: '#AAA',
                    fill: 'none',
                  }}
                />
              )}
            </div>
            <div
              style={{
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                fontSize: 13,
                fontWeight: step.current ? 600 : 400,
                color: step.completed ? '#2D6A2F' : '#AAA',
                textAlign: 'center',
              }}
            >
              {language === 'en' ? step.labelEn : step.labelHi}
            </div>
          </div>

          {/* Connecting Line */}
          {index < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 2,
                background: step.completed ? '#2D6A2F' : '#DDD',
                marginLeft: 8,
                marginRight: 8,
                marginTop: -30,
                borderStyle: step.completed ? 'solid' : 'dashed',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function OrderCard({
  order,
  language,
  onMarkAsPaid,
  onTrackOrder,
}: {
  order: OrderData;
  language: 'en' | 'hi';
  onMarkAsPaid?: () => void;
  onTrackOrder?: () => void;
}) {
  const text = {
    orderedOn: language === 'en' ? 'Ordered on' : 'ऑर्डर दिनांक',
    delivering: language === 'en' ? 'Delivering' : 'डिलीवरी में',
    findingTransporter: language === 'en' ? 'Finding Transporter...' : 'ट्रांसपोर्टर खोज रहे हैं...',
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.60)',
        border: '1px solid rgba(255,255,255,0.50)',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Top Row */}
      <div className="flex items-start gap-4 mb-4">
        {/* Crop Thumbnail */}
        <ImageWithFallback
          src={order.cropImage}
          alt={order.cropName}
          style={{
            width: 80,
            height: 80,
            borderRadius: 10,
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />

        {/* Crop Info */}
        <div style={{ flex: 1 }}>
          <div className="flex items-baseline gap-2 mb-2">
            <span
              style={{
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: '#1A1A1A',
              }}
            >
              {language === 'en' ? order.cropName : order.cropNameHi}
            </span>
            <span
              style={{
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                fontSize: 15,
                color: '#666',
              }}
            >
              | {order.quantity}
            </span>
          </div>

          {/* Status Badge */}
          <div
            className="inline-flex items-center gap-1.5"
            style={{
              background: order.statusBgColor,
              color: order.statusColor,
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: order.statusColor,
              }}
            />
            {language === 'en' ? order.statusLabel : order.statusLabelHi}
          </div>
        </div>

        {/* Price */}
        <div
          style={{
            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: '#1A1A1A',
          }}
        >
          {order.price}
        </div>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker steps={order.progressSteps} language={language} />

      {/* Bottom Row */}
      <div
        className="flex items-center justify-between"
        style={{
          borderTop: '1px solid rgba(0,0,0,0.07)',
          paddingTop: 14,
        }}
      >
        {/* Left Side Info */}
        <div className="flex items-center gap-6">
          <span
            style={{
              fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
              fontSize: 13,
              color: '#888',
            }}
          >
            {text.orderedOn}: {order.orderedDate}
          </span>
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                background: '#8B4513',
              }}
            />
            <span
              style={{
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: '#1A1A1A',
              }}
            >
              {order.buyerName}
            </span>
          </div>
          <div
            className="flex items-center gap-1"
            style={{
              fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
              fontSize: 13,
              color: '#888',
            }}
          >
            <MapPin className="w-3.5 h-3.5" />
            {order.buyerLocation}, {order.buyerDistance}
          </div>
          {order.transportInfo && (
            <div
              className="flex items-center gap-1"
              style={{
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                fontSize: 13,
                color: '#888',
              }}
            >
              <Truck className="w-3.5 h-3.5" />
              {order.transportInfo} {order.transportDistance}
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <span
            style={{
              fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
              fontSize: 13,
              color: order.status === 'in-transit' ? '#E65100' : '#F57F17',
              fontWeight: 500,
            }}
          >
            {order.status === 'in-transit'
              ? text.delivering
              : text.findingTransporter}
          </span>
          {order.secondaryAction && (
            <button
              style={{
                background: 'transparent',
                color: '#2D6A2F',
                border: '1.5px solid #2D6A2F',
                borderRadius: 8,
                padding: '6px 16px',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                cursor: 'pointer',
              }}
            >
              {language === 'en'
                ? order.secondaryAction
                : order.secondaryActionHi}
            </button>
          )}
          <button
            onClick={
              order.actionLabel === 'Mark as Paid' ? onMarkAsPaid :
              order.actionLabel === 'Track Order' ? onTrackOrder : undefined
            }
            className="flex items-center gap-2"
            style={{
              background: '#2D6A2F',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(45,106,47,0.25)',
            }}
          >
            {order.status === 'in-transit' && <Truck className="w-4 h-4" />}
            {order.actionLabel === 'Mark as Paid' && <CheckCircle2 className="w-4 h-4" />}
            {language === 'en' ? order.actionLabel : order.actionLabelHi}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MyOrders({ language, onMarkAsPaid, onTrackOrder }: MyOrdersProps) {
  const text = {
    title: language === 'en' ? 'My Orders' : 'मेरे ऑर्डर',
    subtitle:
      language === 'en'
        ? 'Track your produce from farm to delivery.'
        : 'खेत से डिलीवरी तक अपनी उपज को ट्रैक करें।',
    all: language === 'en' ? 'All' : 'सभी',
    inProgress: language === 'en' ? 'In Progress' : 'प्रगति में',
    completed: language === 'en' ? 'Completed' : 'पूर्ण',
    cancelled: language === 'en' ? 'Cancelled' : 'रद्द',
    sortBy: language === 'en' ? 'Sort by: Latest' : 'क्रमबद्ध: नवीनतम',
  };

  return (
    <div className="at-page-wrap pt-[80px] pb-10 px-8">
      {/* Page Header */}
      <div className="mb-6 at-page-header" style={{ paddingLeft: 80 }}>
        <h1
          style={{
            fontFamily: "'Noto Serif', serif",
            fontSize: 32,
            fontWeight: 700,
            color: '#1A1A1A',
            marginBottom: 6,
            letterSpacing: '-0.01em',
          }}
        >
          {text.title}
        </h1>
        <p
          style={{
            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
            fontSize: 15,
            color: '#555',
            lineHeight: 1.5,
          }}
        >
          {text.subtitle}
        </p>
      </div>

      {/* Filter Tab Strip */}
      <div className="flex justify-center mb-6 at-order-filter-row">
        <div
          className="flex items-center justify-between at-order-filter-row"
          style={{
            width: 860,
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.45)',
            borderRadius: 12,
            padding: '10px 20px',
          }}
        >
          {/* Left Side - Filter Tabs */}
          <div className="flex items-center gap-2">
            <button
              style={{
                background: 'transparent',
                color: '#888',
                border: 'none',
                padding: '6px 16px',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                cursor: 'pointer',
              }}
            >
              {text.all}
            </button>
            <button
              className="flex items-center gap-1.5"
              style={{
                background: '#2D6A2F',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '6px 16px',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                cursor: 'pointer',
              }}
            >
              <ArrowUp className="w-3.5 h-3.5" />
              {text.inProgress}
            </button>
            <button
              style={{
                background: 'transparent',
                color: '#888',
                border: 'none',
                padding: '6px 16px',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                cursor: 'pointer',
              }}
            >
              {text.completed}
            </button>
            <button
              style={{
                background: 'transparent',
                color: '#888',
                border: 'none',
                padding: '6px 16px',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                cursor: 'pointer',
              }}
            >
              {text.cancelled}
            </button>
          </div>

          {/* Right Side - Sort & Search */}
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.70)',
                border: '1px solid #DDD',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 13,
                color: '#555',
                fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                cursor: 'pointer',
              }}
            >
              {text.sortBy}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              style={{
                background: 'rgba(255,255,255,0.70)',
                border: '1px solid #DDD',
                borderRadius: 8,
                padding: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Panel */}
      <div
        className="mx-auto"
        style={{
          maxWidth: 860,
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1.5px solid rgba(255,255,255,0.50)',
          borderRadius: 24,
          boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
          padding: '24px 32px',
        }}
      >
        {/* Order Cards */}
        <div className="space-y-4">
          {ORDERS.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              language={language}
              onMarkAsPaid={onMarkAsPaid}
              onTrackOrder={onTrackOrder}
            />
          ))}
        </div>
      </div>
    </div>
  );
}