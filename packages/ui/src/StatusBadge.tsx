import { View, Text, StyleSheet } from 'react-native'

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
    <View style={[styles.badge, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.text}>{state}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start'
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  }
})

export default StatusBadge