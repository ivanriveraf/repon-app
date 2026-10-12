const TABS = [
  { id: 'inventario', label: 'Inventario', emoji: '🏠' },
  { id: 'super',      label: 'Lista super', emoji: '🛒' },
  { id: 'premium',    label: 'Premium',     emoji: '⭐' },
]

function Tabs({ activa, onChange, contadorSuper }) {
  return (
    <div style={{
      display: 'flex',
      background: '#ffffff',
      borderBottom: '2px solid #e080a8',
      marginBottom: '20px',
    }}>
      {TABS.map(tab => {
        const estaActiva = activa === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              padding: '13px 4px 11px',
              fontSize: '12px',
              fontWeight: '700',
              color: estaActiva ? '#b0003a' : '#6b2040',
              background: 'none',
              border: 'none',
              borderBottom: `3px solid ${estaActiva ? '#b0003a' : 'transparent'}`,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'all 0.15s',
              position: 'relative',
            }}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
            {/* Contador rojo en el tab del super */}
            {tab.id === 'super' && contadorSuper > 0 && (
              <span style={{
                background: '#b0003a',
                color: 'white',
                fontSize: '10px',
                fontWeight: '800',
                padding: '1px 5px',
                borderRadius: '10px',
                marginLeft: '2px',
              }}>
                {contadorSuper}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs