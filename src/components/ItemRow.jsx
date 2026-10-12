import { useState, useEffect } from 'react'

const CATEGORIAS = {
  food:   { label: 'Alimentos', color: '#8c0030', bg: '#fce8f0' },
  clean:  { label: 'Limpieza',  color: '#1a2890', bg: '#e8eeff' },
  baño:   { label: 'Baño',      color: '#4a1a90', bg: '#efe8ff' },
  cocina: { label: 'Cocina',    color: '#8c4a00', bg: '#fff3e8' },
  otros:  { label: 'Otros',     color: '#4a4a6a', bg: '#f0f0ff' },
}

const EMOJIS = {
  arroz: '🌾', leche: '🥛', aceite: '🫙', pan: '🍞', huevos: '🥚',
  azúcar: '🍬', azucar: '🍬', sal: '🧂', harina: '🌾', café: '☕',
  pasta: '🍝', mantequilla: '🧈', queso: '🧀', yogurt: '🥛',
  jugo: '🧃', agua: '💧', pollo: '🍗', carne: '🥩', atún: '🐟',
  tomate: '🍅', lechuga: '🥬', zanahoria: '🥕', cebolla: '🧅',
  ajo: '🧄', papa: '🥔', manzana: '🍎', plátano: '🍌', naranja: '🍊',
  detergente: '🫧', cloro: '🫙', esponjas: '🧽', esponja: '🧽',
  escoba: '🧹', suavizante: '🌸', guantes: '🧤',
  shampoo: '🧴', acondicionador: '🧴',
  'papel higiénico': '🧻', 'papel higienico': '🧻',
  jabón: '🧼', jabon: '🧼', 'jabón platos': '🧼',
  'cepillo dientes': '🪥', 'pasta dientes': '🪥',
  desodorante: '🧴', crema: '🧴',
  'bolsas basura': '🗑️', servilletas: '🧻',
  velas: '🕯️', fósforos: '🔥', pilas: '🔋', ampolleta: '💡',
  'pilas aa': '🔋',
}

function getEmoji(name) {
  const key = name.toLowerCase().trim()
  if (EMOJIS[key]) return EMOJIS[key]
  for (const k of Object.keys(EMOJIS)) {
    if (key.includes(k) || k.includes(key)) return EMOJIS[k]
  }
  return '📦'
}

function formatPrecio(precio) {
  if (!precio) return ''
  const num = parseInt(String(precio).replace(/\D/g, ''), 10)
  if (isNaN(num)) return ''
  return '$' + num.toLocaleString('es-CL')
}

function ItemRow({ item, onToggle, onEliminar, onEditarQty, onEditarItem }) {
  const cat   = CATEGORIAS[item.cat] || CATEGORIAS.otros
  const emoji = getEmoji(item.name)

  const [editandoQty,    setEditandoQty]    = useState(false)
  const [qtyTemp,        setQtyTemp]        = useState(item.qty)
  const [editandoNombre, setEditandoNombre] = useState(false)
  const [nombreTemp,     setNombreTemp]     = useState(item.name)
  const [editandoPrecio, setEditandoPrecio] = useState(false)
  const [precioTemp,     setPrecioTemp]     = useState(item.precio || '')
  const [editandoNotas,  setEditandoNotas]  = useState(false)
  const [notasTemp,      setNotasTemp]      = useState(item.notas || '')
  const [mostrarNotas,   setMostrarNotas]   = useState(false)
  const [animando,       setAnimando]       = useState(false)

  // ── FIX: sincronizar estado local cuando el item cambia desde el padre ──
  useEffect(() => { if (!editandoQty)    setQtyTemp(item.qty)          }, [item.qty,    editandoQty])
  useEffect(() => { if (!editandoNombre) setNombreTemp(item.name)      }, [item.name,   editandoNombre])
  useEffect(() => { if (!editandoPrecio) setPrecioTemp(item.precio || '') }, [item.precio, editandoPrecio])
  useEffect(() => { if (!editandoNotas)  setNotasTemp(item.notas || '') }, [item.notas,  editandoNotas])

  function handleToggle() {
    setAnimando(true)
    setTimeout(() => setAnimando(false), 300)
    onToggle(item.id)
  }

  function guardarQty() {
    onEditarQty(item.id, qtyTemp.trim() || '1 un')
    setEditandoQty(false)
  }

  function guardarNombre() {
    if (nombreTemp.trim()) {
      onEditarItem(item.id, { name: nombreTemp.trim() })
    } else {
      setNombreTemp(item.name)
    }
    setEditandoNombre(false)
  }

  function guardarPrecio() {
    onEditarItem(item.id, { precio: precioTemp.replace(/\D/g, '') })
    setEditandoPrecio(false)
  }

  function guardarNotas() {
    onEditarItem(item.id, { notas: notasTemp.trim() })
    setEditandoNotas(false)
    if (notasTemp.trim()) setMostrarNotas(true)
  }

  const precioFormateado = formatPrecio(item.precio)

  return (
    <div style={{
      borderRadius: '16px',
      marginBottom: '6px',
      background: item.agotado ? '#fff8fb' : '#ffffff',
      border: `1.5px solid ${item.agotado ? '#f0b0cc' : '#e8a0c0'}`,
      transform: animando ? 'scale(0.98)' : 'scale(1)',
      transition: 'transform 0.15s ease, background 0.2s ease, border-color 0.2s ease',
      overflow: 'hidden',
    }}>
      {/* Fila principal */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '9px 10px',
      }}>
        {/* Emoji */}
        <div
          onClick={handleToggle}
          style={{
            width: '44px', height: '44px', borderRadius: '14px',
            background: item.agotado ? '#fde8f0' : '#f0faf4',
            border: `1.5px solid ${item.agotado ? '#e8a0c0' : '#a0d8b8'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', flexShrink: 0, cursor: 'pointer',
            transition: 'background 0.2s ease, border-color 0.2s ease',
          }}
        >
          {emoji}
        </div>

        {/* Check */}
        <div
          onClick={handleToggle}
          style={{
            width: '24px', height: '24px', borderRadius: '50%',
            border: `2.5px solid ${item.agotado ? '#b0003a' : '#22a060'}`,
            background: item.agotado ? '#b0003a' : '#22a060',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: '13px', color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            transform: animando ? 'scale(1.3)' : 'scale(1)',
          }}
        >
          {item.agotado ? '🛒' : '✓'}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Nombre editable */}
          {editandoNombre ? (
            <input
              autoFocus
              value={nombreTemp}
              onChange={e => setNombreTemp(e.target.value)}
              onBlur={guardarNombre}
              onKeyDown={e => {
                if (e.key === 'Enter')  guardarNombre()
                if (e.key === 'Escape') { setNombreTemp(item.name); setEditandoNombre(false) }
              }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', fontSize: '14px', fontWeight: '700',
                border: '1.5px solid #b0003a', borderRadius: '8px',
                padding: '2px 6px', fontFamily: 'inherit',
                color: '#2d0a18', outline: 'none', boxSizing: 'border-box',
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div
                onClick={handleToggle}
                style={{
                  fontSize: '14px', fontWeight: '700', color: '#2d0a18',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  flex: 1, minWidth: 0,
                }}
              >
                {item.name}
              </div>
              {/* Botón lápiz — funciona en mobile y desktop */}
              <button
                onClick={e => { e.stopPropagation(); setEditandoNombre(true) }}
                title="Editar nombre"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '12px', color: '#c0a0b8', padding: '2px',
                  lineHeight: 1, flexShrink: 0,
                }}
              >
                ✏️
              </button>
            </div>
          )}

          {/* Badges: categoría + cantidad + precio */}
          <div style={{ display: 'flex', gap: '5px', marginTop: '3px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '10px', fontWeight: '800', padding: '2px 7px',
              borderRadius: '6px', background: cat.bg, color: cat.color,
            }}>
              {cat.label}
            </span>

            {/* Cantidad editable */}
            {editandoQty ? (
              <input
                autoFocus
                value={qtyTemp}
                onChange={e => setQtyTemp(e.target.value)}
                onBlur={guardarQty}
                onKeyDown={e => {
                  if (e.key === 'Enter')  guardarQty()
                  if (e.key === 'Escape') { setQtyTemp(item.qty); setEditandoQty(false) }
                }}
                onClick={e => e.stopPropagation()}
                style={{
                  width: '70px', fontSize: '11px', fontWeight: '600',
                  border: '1.5px solid #b0003a', borderRadius: '6px',
                  padding: '1px 5px', fontFamily: 'inherit',
                  color: '#2d0a18', outline: 'none',
                }}
              />
            ) : (
              <span
                onClick={e => { e.stopPropagation(); setEditandoQty(true); setQtyTemp(item.qty) }}
                title="Toca para editar cantidad"
                style={{
                  fontSize: '11px', color: '#7a3050', fontWeight: '600',
                  cursor: 'text', borderBottom: '1px dashed #d06080',
                }}
              >
                {item.qty}
              </span>
            )}

            {/* Precio editable inline */}
            {editandoPrecio ? (
              <input
                autoFocus
                type="number"
                min="0"
                value={precioTemp}
                onChange={e => setPrecioTemp(e.target.value)}
                onBlur={guardarPrecio}
                onKeyDown={e => {
                  if (e.key === 'Enter')  guardarPrecio()
                  if (e.key === 'Escape') { setPrecioTemp(item.precio || ''); setEditandoPrecio(false) }
                }}
                onClick={e => e.stopPropagation()}
                placeholder="precio"
                style={{
                  width: '70px', fontSize: '11px', fontWeight: '600',
                  border: '1.5px solid #1a6a3a', borderRadius: '6px',
                  padding: '1px 5px', fontFamily: 'inherit',
                  color: '#1a6a3a', outline: 'none',
                }}
              />
            ) : (
              <span
                onClick={e => { e.stopPropagation(); setEditandoPrecio(true); setPrecioTemp(item.precio || '') }}
                title="Toca para editar precio"
                style={{
                  fontSize: '10px', fontWeight: '800', padding: '2px 7px',
                  borderRadius: '6px', cursor: 'pointer',
                  ...(precioFormateado
                    ? { background: '#e8fff0', color: '#1a6a3a', border: '1px solid #b0e8c8' }
                    : { background: '#f5f5f5', color: '#b0a0b0', border: '1px dashed #d0c0d0' }
                  ),
                }}
              >
                {precioFormateado || '+ precio'}
              </span>
            )}

            {/* Indicador de notas */}
            {item.notas && (
              <span
                onClick={e => { e.stopPropagation(); setMostrarNotas(v => !v) }}
                title="Ver notas"
                style={{ fontSize: '10px', color: '#7a3050', cursor: 'pointer', opacity: 0.7 }}
              >
                📝
              </span>
            )}
          </div>
        </div>

        {/* Acciones: notas + eliminar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button
            onClick={e => {
              e.stopPropagation()
              setNotasTemp(item.notas || '')
              setMostrarNotas(v => !v)
              if (!item.notas && !mostrarNotas) setEditandoNotas(true)
            }}
            title="Agregar / ver notas"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '15px', color: item.notas ? '#b0003a' : '#c090a8',
              padding: '4px',
            }}
          >
            📝
          </button>
          <button
            onClick={e => { e.stopPropagation(); onEliminar(item.id) }}
            title="Eliminar"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '16px', color: '#c090a8', padding: '4px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#b0003a'}
            onMouseLeave={e => e.currentTarget.style.color = '#c090a8'}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Panel de notas expandible */}
      {mostrarNotas && (
        <div style={{
          borderTop: '1px solid #fce8f0',
          padding: '8px 12px 10px',
          background: '#fffafc',
        }}>
          {editandoNotas ? (
            <div>
              <textarea
                autoFocus
                value={notasTemp}
                onChange={e => setNotasTemp(e.target.value)}
                placeholder="Escribe una nota (marca, tienda, urgencia...)..."
                rows={2}
                style={{
                  width: '100%', fontSize: '12px', fontWeight: '600',
                  border: '1.5px solid #b0003a', borderRadius: '10px',
                  padding: '6px 10px', fontFamily: 'inherit',
                  color: '#2d0a18', outline: 'none',
                  resize: 'none', boxSizing: 'border-box',
                  background: '#fff',
                }}
              />
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <button
                  onClick={guardarNotas}
                  style={{
                    flex: 1, background: '#b0003a', color: 'white',
                    border: 'none', borderRadius: '10px', padding: '6px',
                    fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Guardar
                </button>
                <button
                  onClick={() => { setEditandoNotas(false); if (!item.notas) setMostrarNotas(false) }}
                  style={{
                    background: '#f0d0e0', color: '#8c1a4a',
                    border: 'none', borderRadius: '10px', padding: '6px 12px',
                    fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => { setNotasTemp(item.notas || ''); setEditandoNotas(true) }}
              style={{
                fontSize: '12px', color: '#5a1030', fontWeight: '600',
                cursor: 'text', fontStyle: 'italic',
              }}
            >
              {item.notas || <span style={{ opacity: 0.5 }}>Toca para agregar nota...</span>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ItemRow
