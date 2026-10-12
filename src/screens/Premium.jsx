const FEATURES = [
  { emoji: '📊', texto: 'Estadísticas de consumo mensual',   free: false },
  { emoji: '📂', texto: 'Listas múltiples (cocina, bodega…)', free: false },
  { emoji: '👨‍👩‍👧', texto: 'Lista compartida con la familia',  free: false },
  { emoji: '🔔', texto: 'Recordatorios automáticos',          free: false },
  { emoji: '📤', texto: 'Exportar lista por WhatsApp',        free: true  },
  { emoji: '🎨', texto: 'Temas y colores personalizados',     free: false },
  { emoji: '☁️', texto: 'Respaldo en la nube',               free: false },
  { emoji: '📦', texto: 'Inventario ilimitado',               free: true  },
]

const PLANES = [
  {
    nombre: 'Mensual',
    precio: '$2.990',
    periodo: '/mes',
    badge: null,
    bgBtn: 'linear-gradient(135deg, #b0003a, #e0006a)',
  },
  {
    nombre: 'Anual',
    precio: '$19.990',
    periodo: '/año',
    badge: '🔥 Ahorra 44%',
    bgBtn: 'linear-gradient(135deg, #6a00b0, #a000e0)',
  },
]

function Premium({ items }) {
  const total      = items.length
  const porComprar = items.filter(i => i.agotado).length
  const enCasa     = total - porComprar

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {[
          { num: total,      label: 'productos registrados', icon: '📦' },
          { num: porComprar, label: 'por comprar',           icon: '🛒' },
          { num: enCasa,     label: 'en casa',               icon: '✅' },
          { num: '∞',        label: 'listas en Pro',         icon: '📂' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: '#ffffff', borderRadius: '16px',
            border: '1.5px solid #e080a8', padding: '14px 12px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '24px' }}>{stat.icon}</span>
            <div>
              <div style={{
                fontFamily: 'Georgia, serif', fontSize: '26px',
                color: '#b0003a', lineHeight: 1,
              }}>
                {stat.num}
              </div>
              <div style={{ fontSize: '11px', color: '#5a1030', fontWeight: '700', marginTop: '3px' }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparación Free vs Pro */}
      <div style={{
        borderRadius: '18px', border: '2px solid #d06080',
        background: '#ffffff', padding: '18px', marginBottom: '16px',
      }}>
        <div style={{
          fontFamily: 'Georgia, serif', fontStyle: 'italic',
          fontSize: '20px', color: '#3d1a28', marginBottom: '4px',
        }}>
          Desbloquea <em style={{ color: '#b0003a' }}>Repón Pro</em> ✨
        </div>
        <p style={{ fontSize: '12px', color: '#7a3050', fontWeight: '600', margin: '0 0 14px' }}>
          Tu hogar siempre listo, en familia y sin esfuerzo.
        </p>

        {/* Tabla de features */}
        <div style={{
          borderRadius: '12px', overflow: 'hidden',
          border: '1.5px solid #fce8f0', marginBottom: '16px',
        }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 60px 60px',
            background: 'linear-gradient(135deg, #b0003a, #e0006a)',
            padding: '8px 12px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'white' }}>Función</div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>Free</div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: 'white', textAlign: 'center' }}>Pro</div>
          </div>

          {FEATURES.map((f, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 60px 60px',
              padding: '9px 12px', alignItems: 'center',
              background: i % 2 === 0 ? '#ffffff' : '#fffafc',
              borderBottom: i < FEATURES.length - 1 ? '1px solid #fce8f0' : 'none',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#4a1028', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{f.emoji}</span>
                <span>{f.texto}</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: '14px' }}>
                {f.free ? '✅' : <span style={{ color: '#d0a0b0', fontSize: '16px' }}>—</span>}
              </div>
              <div style={{ textAlign: 'center', fontSize: '14px' }}>✅</div>
            </div>
          ))}
        </div>

        {/* Planes de precio */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          {PLANES.map((plan, i) => (
            <div key={i} style={{ position: 'relative' }}>
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #6a00b0, #a000e0)',
                  color: 'white', fontSize: '10px', fontWeight: '800',
                  padding: '3px 8px', borderRadius: '10px', whiteSpace: 'nowrap',
                  zIndex: 1,
                }}>
                  {plan.badge}
                </div>
              )}
              <button style={{
                width: '100%',
                background: plan.bgBtn,
                color: 'white', border: 'none',
                borderRadius: '14px', padding: '14px 10px',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 15px rgba(176,0,58,0.25)',
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', opacity: 0.9, marginBottom: '2px' }}>
                  {plan.nombre}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>
                  {plan.precio}
                </div>
                <div style={{ fontSize: '10px', fontWeight: '700', opacity: 0.85 }}>
                  {plan.periodo}
                </div>
              </button>
            </div>
          ))}
        </div>

        <p style={{
          fontSize: '11px', color: '#a06080', textAlign: 'center',
          margin: '0', fontWeight: '600',
        }}>
          Cancela cuando quieras • Sin compromisos
        </p>
      </div>

      {/* Testimonios */}
      <div style={{
        borderRadius: '16px', border: '1.5px solid #e8c0d4',
        background: '#fffafc', padding: '14px',
      }}>
        <div style={{ fontSize: '13px', fontWeight: '800', color: '#3d1a28', marginBottom: '10px' }}>
          💬 Lo que dicen nuestros usuarios
        </div>
        {[
          { texto: '"¡Por fin nunca me quedo sin shampoo! La función de recordatorio es genial 🙌"', autor: 'María G.' },
          { texto: '"La comparto con mi pareja y el super se volvió mucho más fácil"', autor: 'Carlos R.' },
        ].map((t, i) => (
          <div key={i} style={{
            padding: '10px', borderRadius: '12px',
            background: '#ffffff', border: '1px solid #f0d0e0',
            marginBottom: i < 1 ? '8px' : 0,
          }}>
            <p style={{ fontSize: '12px', color: '#4a1028', fontWeight: '600', margin: '0 0 4px', fontStyle: 'italic' }}>
              {t.texto}
            </p>
            <p style={{ fontSize: '11px', color: '#b0003a', fontWeight: '800', margin: 0 }}>
              — {t.autor}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Premium
