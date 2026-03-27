import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface RoleSelectorProps {
  selected: string
  onSelect: (role: string) => void
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selected, onSelect }) => {
  const roles = [
    { key: 'farmer', label: '🌾 Farmer' },
    { key: 'trader', label: '🤝 Trader' },
    { key: 'transporter', label: '🚛 Transporter' }
  ]

  return (
    <View style={styles.container}>
      {roles.map(role => (
        <TouchableOpacity
          key={role.key}
          style={[
            styles.card,
            selected === role.key && styles.selected
          ]}
          onPress={() => onSelect(role.key)}
        >
          <Text style={styles.label}>{role.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16
  },
  card: {
    flex: 1,
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: 'white',
    alignItems: 'center'
  },
  selected: {
    borderColor: '#008000',
    backgroundColor: '#e6f7e6'
  },
  label: {
    fontSize: 14,
    color: '#333'
  }
})

export default RoleSelector