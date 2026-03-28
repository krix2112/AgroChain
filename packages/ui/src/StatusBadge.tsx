interface StatusBadgeProps {
  state: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ state }) => {
  const getBackgroundColor = () => {
    switch (state.toUpperCase()) {
      case 'CREATED': return '#808080'
      case 'AGREED': return '#0000FF'
      case 'IN_DELIVERY': return '#FFFF00'
      case 'DELIVERED': return '#FFA500'
      case 'COMPLETED': return '#008000'
      default: return '#808080'
    }
  }

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor: getBackgroundColor(),
      color: 'white',
      fontSize: '12px',
      fontWeight: 'bold'
    }}>
      {state}
    </span>
  )
}

export default StatusBadge