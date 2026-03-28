import React from 'react'

interface TimelineProps {
  state: string
  dates?: Record<string, string>
}

const Timeline: React.FC<TimelineProps> = ({ state, dates }) => {
  const steps = ['Created', 'Agreed', 'In Delivery', 'Delivered', 'Completed']
  const currentIndex = steps.findIndex(step => step.toLowerCase().replace(' ', '_') === state.toLowerCase())

  return (
    <div style={{ padding: '16px 0' }}>
      {steps.map((step, index) => {
        const stepKey = step.toLowerCase().replace(' ', '_')
        const date = dates?.[stepKey]
        const isComplete = index <= currentIndex
        return (
          <div key={step} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              marginRight: '12px',
              backgroundColor: isComplete ? '#008000' : '#ccc'
            }} />
            <div style={{ flex: 1 }}>
              <span style={{
                fontSize: '14px',
                color: isComplete ? '#333' : '#999'
              }}>{step}</span>
              {date && (
                <span style={{
                  fontSize: '11px',
                  color: '#999',
                  display: 'block',
                  marginTop: '2px'
                }}>{date}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Timeline