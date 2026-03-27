import { View } from 'react-native'

interface QRDisplayProps {
  value: string
  size?: number
}

const QRDisplay: React.FC<QRDisplayProps> = ({ value, size = 200 }) => {
  const isWeb = typeof window !== 'undefined'

  if (isWeb) {
    const { QRCodeSVG } = require('qrcode.react')
    return <QRCodeSVG value={value} size={size} />
  } else {
    const QRCode = require('react-native-qrcode-svg')
    return <QRCode value={value} size={size} />
  }
}

export default QRDisplay