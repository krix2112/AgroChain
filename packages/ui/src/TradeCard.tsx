import StatusBadge from './StatusBadge'

interface TradeCardProps {
  trade?: any
  highlight?: boolean
}

const TradeCard: React.FC<TradeCardProps> = ({ trade, highlight }) => {
  if (!trade) return null

  const cropName = trade.cropName || 'Unknown Crop'
  const quantity = trade.quantity || 0
  const price = trade.price || 0
  const state = trade.state || 'UNKNOWN'
  const farmerName = trade.farmer?.name || trade.farmer || 'Unknown'
  const traderName = trade.trader?.name || trade.trader || 'Unknown'

  return (
    <div style={{
      padding: '16px',
      margin: '8px',
      borderRadius: '8px',
      backgroundColor: highlight ? '#1a1a1a' : 'white',
      border: highlight ? '1px solid #008000' : 'none',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: highlight ? 'white' : '#333'
        }}>{cropName}</span>
        <StatusBadge state={state} />
      </div>
      <div style={{
        fontSize: '14px',
        color: highlight ? '#999' : '#666',
        marginBottom: '8px'
      }}>{`${quantity}kg · ₹${price}`}</div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          fontSize: '12px',
          color: highlight ? '#999' : '#666'
        }}>{`Farmer: ${farmerName} → Trader: ${traderName}`}</span>
      </div>
    </div>
  )
}

export default TradeCard