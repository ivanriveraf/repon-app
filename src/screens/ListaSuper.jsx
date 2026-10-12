const CATEGORIAS = {
  food:   'Alimentos',
  clean:  'Limpieza',
  baño:   'Baño',
  cocina: 'Cocina',
  otros:  'Otros',
}

function formatPrecio(precio) {
  if (!precio) return null
  const num = parseInt(String(precio).replace(/\D/g, ''), 10)
  if (isNaN(num) || num === 0) return null
  return num
}

// comprados y setComprados vienen del padre (App) para persistir entre tabs
function ListaSuper({ items, comprados, setComprados }) {
  const porComprar = items.filter(i => i.agotado)

  function toggleComprado(id) {
    setComprados(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function marcarTodos() {
    const todos = {}
    porComprar.forEach(i => { todos[i.id] = true })
    setComprados(todos)
  }

  function desmarcarTodos() {
    setComprados({})
  }

  const totalComprados = porComprar.filter(i => comprados[i.id]).length
  const total          = porComprar.length
  const porcentaje     = total > 0 ? Math.round((totalComprados / total) * 100) : 0

  // Calcular total estimado si hay precios
  const itemsConPrecio = porComprar.filter(i => formatPrecio(i.precio) !== null)
  const totalEstimado  = itemsConPrecio.reduce((acc, i) => acc + (formatPrecio(i.precio) || 0), 0)

  // Total de lo que ya puse en el carrito
  const totalCarrito = porComprar
    .filter(i => comprados[i.id] && formatPrecio(i.precio))
    .reduce((acc, i) => acc + (formatPrecio(i.precio) || 0), 0)

  // Agrupar por categoría
  const porCategoria = {}
  porComprar.forEach(item => {
    if (!porCategoria[item.cat]) porCategoria[item.cat] = []
    porCategoria[item.cat].push(item)
  })

  // Compartir lista por WhatsApp / Web Share API
  function compartirLista() {
    const lineas = Object.entries(porCategoria).map(([cat, catItems]) => {
      const header = `📦 ${CATEGORIAS[cat] || cat}`
      const filas = catItems.map(i =>
        `  • ${i.name} (${i.qty})${formatPrecio(i.precio) ? ` ~$${formatPrecio(i.precio).toLocaleString('es-CL')}` : ''}`
      ).join('\n')
      return `${header}\n${filas}`
    })

    const texto = [
      '🛒 *Mi lista del super — Repón*',
      '',
      ...lineas,
      '',
      totalEstimado > 0 ? `💰 Total estimado: $${totalEstimado.toLocaleString('es-CL')}` : '',
    ].filter(Boolean).join('\n')

    if (navigator.share) {
      navigator.share({ title: 'Lista del super', text: texto }).catch(() => {})
    } else {
      navigator.clipboard.writeText(texto).then(() => {
        alert('✅ Lista copiada al portapapeles')
      }).catch(() => {
        alert('No se pudo compartir. Intenta desde el celular.')
      })
    }
  }

  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎉</div>
        <div style={{ fontSize: '18px', fontWeight: '800', color: '#3d1a28', marginBottom: '6px' }}>
          ¡Todo en stock!
        </div>
        <div style={{ fontSize: '13px', color: '#7a3050', fontWeight: '600' }}>
          No necesitas ir al super por ahora ☁️
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Card de progreso */}
      <div style={{
        background: '#ffffff', borderRadius: '18px',
        border: '1.5px solid #e080a8', padding: '16px', marginBottom: '12px',
      }}>
        <div style={{
          fontSize: '14px', fontWeight: '800', color: '#2d0a18',
          marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          🛒 Modo supermercado
        </div>
        <div style={{ fontSize: '12px', color: '#6b2040', fontWeight: '600', marginBottom: '12px' }}>
          Toca cada producto cuando lo pongas en el carrito
        </div>

        {/* Barra de progreso */}
        <div style={{
          background: '#f0c0d8', height: '10px',
          borderRadius: '5px', overflow: 'hidden', marginBottom: '6px',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #b0003a, #e0006a)',
            borderRadius: '5px',
            width: `${porcentaje}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
        <div style={{ fontSize: '12px', color: '#6b2040', fontWeight: '700', marginBottom: '12px' }}>
          {totalComprados} de {total} productos • {porcentaje}%
        </div>

        {/* Totales estimados */}
        {totalEstimado > 0 && (
          <div style={{
            background: '#e8fff0', borderRadius: '12px', padding: '8px 12px',
            marginBottom: '10px', border: '1px solid #b0e8c8',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#1a6a3a' }}>
                🛒 En carrito
              </span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#1a6a3a' }}>
                ${totalCarrito.toLocaleString('es-CL')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#4a8a6a' }}>
                Total estimado
              </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#4a8a6a' }}>
                ${totalEstimado.toLocaleString('es-CL')}
              </span>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={totalComprados === total ? desmarcarTodos : marcarTodos}
            style={{
              flex: 1, background: 'none', border: '1.5px solid #b0003a',
              borderRadius: '10px', color: '#b0003a', fontSize: '12px',
              fontWeight: '700', padding: '7px 10px', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {totalComprados === total ? '🔄 Reiniciar' : '✅ Marcar todos'}
          </button>
          <button
            onClick={compartirLista}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              border: 'none', borderRadius: '10px',
              color: 'white', fontSize: '12px',
              fontWeight: '700', padding: '7px 10px', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            📤 Compartir
          </button>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {totalComprados === total && total > 0 && (
        <div style={{
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #b0003a, #e0006a)',
          borderRadius: '14px', padding: '12px 16px',
          color: 'white', fontSize: '13px', fontWeight: '700',
          textAlign: 'center',
        }}>
          🎉 ¡Compraste todo! Vuelve al inventario y márcalos como "en casa"
        </div>
      )}

      {/* Lista por categoría */}
      {Object.entries(porCategoria).map(([cat, catItems]) => (
        <div key={cat}>
          <div style={{
            fontSize: '11px', fontWeight: '800', letterSpacing: '1px',
            textTransform: 'uppercase', color: '#8c1a4a', margin: '16px 0 8px',
          }}>
            {CATEGORIAS[cat] || cat}
          </div>
          {catItems.map(item => {
            const precioNum = formatPrecio(item.precio)
            const yaEnCarrito = comprados[item.id]
            return (
              <div
                key={item.id}
                onClick={() => toggleComprado(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '16px', marginBottom: '4px',
                  background: yaEnCarrito ? '#fce8f0' : '#ffffff',
                  border: `1.5px solid ${yaEnCarrito ? '#b0003a' : '#e8a0c0'}`,
                  cursor: 'pointer',
                  opacity: yaEnCarrito ? 0.55 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  border: `2.5px solid ${yaEnCarrito ? '#b0003a' : '#d06080'}`,
                  background: yaEnCarrito ? '#b0003a' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '13px', color: 'white',
                  transition: 'all 0.2s',
                }}>
                  {yaEnCarrito ? '✓' : ''}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px', fontWeight: '700', color: '#2d0a18',
                    textDecoration: yaEnCarrito ? 'line-through' : 'none',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.name}
                  </div>
                  {item.notas ? (
                    <div style={{ fontSize: '11px', color: '#7a3050', fontWeight: '600', marginTop: '1px' }}>
                      📝 {item.notas}
                    </div>
                  ) : null}
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '12px', color: '#7a3050', fontWeight: '700' }}>
                    {item.qty}
                  </div>
                  {precioNum ? (
                    <div style={{ fontSize: '11px', color: '#1a6a3a', fontWeight: '800' }}>
                      ${precioNum.toLocaleString('es-CL')}
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default ListaSuper
