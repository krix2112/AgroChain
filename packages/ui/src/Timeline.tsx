import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface TimelineProps {
  currentState: string
  dates?: Record<string, string>
}

const Timeline: React.FC<TimelineProps> = ({ currentState, dates }) => {
  const steps = ['Created', 'Agreed', 'In Delivery', 'Delivered', 'Completed']
  const currentIndex = steps.findIndex(step => step.toLowerCase().replace(' ', '_') === currentState.toLowerCase())

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const stepKey = step.toLowerCase().replace(' ', '_')
        const date = dates?.[stepKey]
        return (
          <View key={step} style={styles.step}>
            <View style={[
              styles.circle,
              { backgroundColor: index <= currentIndex ? '#008000' : '#ccc' }
            ]} />
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{step}</Text>
              {date && <Text style={styles.date}>{date}</Text>}
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12
  },
  labelContainer: {
    flex: 1
  },
  label: {
    fontSize: 14,
    color: '#333'
  },
  date: {
    fontSize: 11,
    color: '#999',
    marginTop: 2
  }
})

export default Timeline