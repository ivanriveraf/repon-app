const FILTROS = [
  { id: 'todos',  label: 'Todos'       },
  { id: 'food',   label: '🥦 Alimentos' },
  { id: 'clean',  label: '🧹 Limpieza'  },
  { id: 'baño',   label: '🚿 Baño'      },
  { id: 'cocina', label: '🍳 Cocina'    },
  { id: 'otros',  label: '📦 Otros'     },
]

// contadores: { food: 3, clean: 2, ... }, total: número total de items
function FilterChips({ activo, onChange, contadores = {}, total = 0 }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
      {FILTROS.map(filtro => {
        const estaActivo = activo === filtro.id
        const count = filtro.id === 'todos' ? total : (contadores[filtro.id] || 0)
        return (
          <button
            key={filtro.id}
            onClick={() => onChange(filtro.id)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              border: '2px solid',
              borderColor: estaActivo ? '#b0003a' : '#d06080',
              background: estaActivo ? '#b0003a' : '#ffffff',
              color: estaActivo ? '#ffffff' : '#5a1030',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span>{filtro.label}</span>
            {count > 0 && (
              <span style={{
                background: estaActivo ? 'rgba(255,255,255,0.3)' : '#fce8f0',
                color: estaActivo ? '#ffffff' : '#b0003a',
                fontSize: '10px',
                fontWeight: '800',
                padding: '1px 5px',
                borderRadius: '8px',
                minWidth: '16px',
                textAlign: 'center',
              }}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default FilterChips
