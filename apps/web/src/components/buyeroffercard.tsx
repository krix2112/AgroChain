import { Phone, MapPin, Star, Package } from 'lucide-react';

interface BuyerOffer {
    id: number;
    buyerName: string;
    buyerNameHi: string;
    location: string;
    locationHi: string;
    distance: string;
    price: number;
    rating: number;
    quantity: string;
    quantityHi: string;
}

interface BuyerOfferCardProps {
    offer: BuyerOffer;
    language: 'en' | 'hi';
}

export function BuyerOfferCard({ offer, language }: BuyerOfferCardProps) {
    return (
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 hover:bg-white/30 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                {/* Buyer Info */}
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {language === 'en' ? offer.buyerName : offer.buyerNameHi}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                        <MapPin className="w-5 h-5 text-green-700" />
                        <span className="font-medium">
                            {language === 'en' ? offer.location : offer.locationHi}
                        </span>
                        <span className="text-sm text-gray-600">• {offer.distance}</span>
                    </div>
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${i < offer.rating
                                        ? 'fill-amber-500 text-amber-500'
                                        : 'text-gray-300'
                                    }`}
                            />
                        ))}
                        <span className="ml-2 text-sm text-gray-700 font-semibold">
                            {offer.rating}.0
                        </span>
                    </div>
                </div>

                {/* Price Badge */}
                <div className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg">
                    <div className="text-sm font-medium opacity-90">
                        {language === 'en' ? 'Price' : 'मूल्य'}
                    </div>
                    <div className="text-2xl font-bold">₹{offer.price.toLocaleString()}</div>
                    <div className="text-xs opacity-90">
                        {language === 'en' ? 'per quintal' : 'प्रति क्विंटल'}
                    </div>
                </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2 mb-5 text-gray-800">
                <Package className="w-5 h-5 text-green-700" />
                <span className="font-semibold">
                    {language === 'en' ? 'Quantity needed:' : 'आवश्यक मात्रा:'}
                </span>
                <span className="font-bold text-gray-900">
                    {language === 'en' ? offer.quantity : offer.quantityHi}
                </span>
            </div>

            {/* Call Button */}
            <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3">
                <Phone className="w-6 h-6" />
                <span>{language === 'en' ? 'Call Buyer' : 'खरीदार को कॉल करें'}</span>
            </button>
        </div>
    );
}
