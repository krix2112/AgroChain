interface QRDisplayProps {
  value: string
  size?: number
}

const QRDisplay: React.FC<QRDisplayProps> = ({ value, size = 200 }) => {
  return (
    <div style={{ width: size, height: size }}>
      {/* Placeholder for QR code - in a full web app, you'd use qrcode.react */}
      <img 
        src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`} 
        alt="QR Code"
        style={{ width: size, height: size }}
      />
    </div>
  )
}

export default QRDisplay