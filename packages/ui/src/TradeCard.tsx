import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import StatusBadge from './StatusBadge'

interface TradeCardProps {
  id: number
  cropName: string
  quantity: number
  price: number
  state: string
  farmerName: string
  traderName: string
  onPress: () => void
}

const TradeCard: React.FC<TradeCardProps> = ({
  cropName,
  quantity,
  price,
  state,
  farmerName,
  traderName,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.cropName}>{cropName}</Text>
        <StatusBadge state={state} />
      </View>
      <Text style={styles.middle}>{`${quantity}kg · ₹${price}`}</Text>
      <View style={styles.bottomRow}>
        <Text style={styles.names}>{`Farmer: ${farmerName} → Trader: ${traderName}`}</Text>
        <TouchableOpacity style={styles.arrowButton} onPress={onPress}>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    margin: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  middle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  names: {
    fontSize: 12,
    color: '#666',
    flex: 1
  },
  arrowButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4
  },
  arrow: {
    fontSize: 16,
    color: '#333'
  }
})

export default TradeCard