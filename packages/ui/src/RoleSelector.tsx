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
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: '16px'
    }}>
      {roles.map(role => (
        <button
          key={role.key}
          onClick={() => onSelect(role.key)}
          style={{
            flex: 1,
            padding: '16px',
            margin: '0 4px',
            borderRadius: '8px',
            borderWidth: 2,
            borderColor: selected === role.key ? '#008000' : '#ccc',
            backgroundColor: selected === role.key ? '#e6f7e6' : 'white',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#333'
          }}
        >
          {role.label}
        </button>
      ))}
    </div>
  )
}

export default RoleSelector