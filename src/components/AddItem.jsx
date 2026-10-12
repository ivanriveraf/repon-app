import { useState } from 'react'

const CATEGORIAS = [
  { id: 'food',   label: '🥦 Alimentos' },
  { id: 'clean',  label: '🧹 Limpieza'  },
  { id: 'baño',   label: '🚿 Baño'      },
  { id: 'cocina', label: '🍳 Cocina'    },
  { id: 'otros',  label: '📦 Otros'     },
]

const PRODUCTOS_SUGERIDOS = [
  // Alimentos
  { name: 'Arroz',            cat: 'food' },
  { name: 'Leche',            cat: 'food' },
  { name: 'Aceite',           cat: 'food' },
  { name: 'Pan',              cat: 'food' },
  { name: 'Huevos',           cat: 'food' },
  { name: 'Azúcar',           cat: 'food' },
  { name: 'Sal',              cat: 'food' },
  { name: 'Harina',           cat: 'food' },
  { name: 'Café',             cat: 'food' },
  { name: 'Té',               cat: 'food' },
  { name: 'Pasta',            cat: 'food' },
  { name: 'Mantequilla',      cat: 'food' },
  { name: 'Queso',            cat: 'food' },
  { name: 'Yogurt',           cat: 'food' },
  { name: 'Jugo',             cat: 'food' },
  { name: 'Agua mineral',     cat: 'food' },
  { name: 'Pollo',            cat: 'food' },
  { name: 'Carne molida',     cat: 'food' },
  { name: 'Atún',             cat: 'food' },
  { name: 'Tomate',           cat: 'food' },
  { name: 'Lechuga',          cat: 'food' },
  { name: 'Zanahoria',        cat: 'food' },
  { name: 'Cebolla',          cat: 'food' },
  { name: 'Ajo',              cat: 'food' },
  { name: 'Papa',             cat: 'food' },
  { name: 'Manzana',          cat: 'food' },
  { name: 'Plátano',          cat: 'food' },
  { name: 'Naranja',          cat: 'food' },
  // Limpieza
  { name: 'Detergente',       cat: 'clean' },
  { name: 'Cloro',            cat: 'clean' },
  { name: 'Desinfectante',    cat: 'clean' },
  { name: 'Esponjas',         cat: 'clean' },
  { name: 'Escoba',           cat: 'clean' },
  { name: 'Trapeador',        cat: 'clean' },
  { name: 'Suavizante',       cat: 'clean' },
  { name: 'Limpiavidrios',    cat: 'clean' },
  { name: 'Guantes',          cat: 'clean' },
  { name: 'Bolsas basura',    cat: 'clean' },
  { name: 'Multiuso',         cat: 'clean' },
  // Baño
  { name: 'Shampoo',          cat: 'baño' },
  { name: 'Acondicionador',   cat: 'baño' },
  { name: 'Papel higiénico',  cat: 'baño' },
  { name: 'Jabón',            cat: 'baño' },
  { name: 'Cepillo dientes',  cat: 'baño' },
  { name: 'Pasta dientes',    cat: 'baño' },
  { name: 'Desodorante',      cat: 'baño' },
  { name: 'Crema corporal',   cat: 'baño' },
  { name: 'Algodón',          cat: 'baño' },
  { name: 'Toallas',          cat: 'baño' },
  // Cocina
  { name: 'Jabón platos',     cat: 'cocina' },
  { name: 'Bolsas zip',       cat: 'cocina' },
  { name: 'Film plástico',    cat: 'cocina' },
  { name: 'Papel aluminio',   cat: 'cocina' },
  { name: 'Servilletas',      cat: 'cocina' },
  { name: 'Palillos',         cat: 'cocina' },
  // Otros
  { name: 'Velas',            cat: 'otros' },
  { name: 'Fósforos',         cat: 'otros' },
  { name: 'Pilas AA',         cat: 'otros' },
  { name: 'Ampolleta',        cat: 'otros' },
  { name: 'Cinta adhesiva',   cat: 'otros' },
  { name: 'Bombilla',         cat: 'otros' },
  { name: 'Papel carta',      cat: 'otros' },
]

function AddItem({ onAgregar }) {
  const [nombre,      setNombre]      = useState('')
  const [cat,         setCat]         = useState('food')
  const [qty,         setQty]         = useState('1 un')
  const [agotado,     setAgotado]     = useState(true)   // true = por comprar
  const [sugerencias, setSugerencias] = useState([])
  const [mostrarOpc,  setMostrarOpc]  = useState(false)
  const [precio,      setPrecio]      = useState('')
  const [notas,       setNotas]       = useState('')

  function handleInput(valor) {
    setNombre(valor)
    if (valor.trim().length < 2) { setSugerencias([]); return }
    const coincidencias = PRODUCTOS_SUGERIDOS
      .filter(p => p.name.toLowerCase().includes(valor.toLowerCase()))
      .slice(0, 5)
    setSugerencias(coincidencias)
  }

  function handleSeleccionar(producto) {
    onAgregar(producto.name, producto.cat, qty, precio, notas, agotado)
    resetForm()
  }

  function handleAgregar() {
    if (!nombre.trim()) return
    onAgregar(nombre.trim(), cat, qty, precio, notas, agotado)
    resetForm()
  }

  function resetForm() {
    setNombre('')
    setSugerencias([])
    setQty('1 un')
    setPrecio('')
    setNotas('')
    setMostrarOpc(false)
    // Mantener cat y agotado como estaban para agilizar entradas múltiples
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    borderRadius: '12px', border: '1.5px solid #d06080',
    background: '#ffffff', color: '#2d0a18',
    fontSize: '13px', fontWeight: '600', fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      marginTop: '14px',
      paddingTop: '14px',
      borderTop: '1.5px solid #e080a8',
      position: 'relative',
    }}>

      {/* Fila: categoría + toggle "ya lo tengo" */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
        <select
          value={cat}
          onChange={e => setCat(e.target.value)}
          style={{
            flex: 1, padding: '9px 10px',
            borderRadius: '12px', border: '1.5px solid #d06080',
            background: '#ffffff', color: '#2d0a18',
            fontSize: '12px', fontWeight: '600', fontFamily: 'inherit', outline: 'none',
          }}
        >
          {CATEGORIAS.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        {/* Toggle: por comprar / ya lo tengo */}
        <button
          onClick={() => setAgotado(v => !v)}
          title={agotado ? 'Agregar como "por comprar"' : 'Agregar como "en casa"'}
          style={{
            padding: '9px 12px',
            borderRadius: '12px',
            border: `1.5px solid ${agotado ? '#b0003a' : '#22a060'}`,
            background: agotado ? '#fff0f5' : '#f0faf4',
            color: agotado ? '#b0003a' : '#22a060',
            fontSize: '11px', fontWeight: '800',
            fontFamily: 'inherit', cursor: 'pointer',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          {agotado ? '🛒 Comprar' : '✅ En casa'}
        </button>
      </div>

      {/* Input nombre + botón agregar */}
      <div style={{ display: 'flex', gap: '8px', position: 'relative', marginBottom: '8px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            value={nombre}
            onChange={e => handleInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAgregar()}
            placeholder="Agregar producto..."
            style={{
              ...inputStyle,
              borderColor: '#d06080',
            }}
            onFocus={e => e.target.style.borderColor = '#b0003a'}
            onBlur={e => e.target.style.borderColor = '#d06080'}
          />

          {/* Dropdown sugerencias */}
          {sugerencias.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: '#ffffff', border: '2px solid #d06080',
              borderRadius: '14px', marginTop: '4px',
              zIndex: 100, overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(176,0,58,0.15)',
            }}>
              {sugerencias.map((producto, i) => (
                <div
                  key={i}
                  onMouseDown={e => { e.preventDefault(); handleSeleccionar(producto) }}
                  style={{
                    padding: '10px 14px', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '600', color: '#2d0a18',
                    borderBottom: i < sugerencias.length - 1 ? '1px solid #fce8f0' : 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fce8f0'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span>{producto.name}</span>
                  <span style={{
                    fontSize: '10px', fontWeight: '700', color: '#b0003a',
                    background: '#fce8f0', padding: '2px 7px', borderRadius: '6px',
                  }}>
                    {CATEGORIAS.find(c => c.id === producto.cat)?.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleAgregar}
          style={{
            padding: '10px 18px',
            background: 'linear-gradient(135deg, #b0003a, #e0006a)',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '13px', fontWeight: '700', cursor: 'pointer',
            fontFamily: 'inherit', whiteSpace: 'nowrap',
            boxShadow: '0 2px 10px rgba(176,0,58,0.25)',
          }}
        >
          + Agregar
        </button>
      </div>

      {/* Cantidad (siempre visible) */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: '800', color: '#8c1a4a', flexShrink: 0 }}>
          📦 Cantidad:
        </label>
        <input
          value={qty}
          onChange={e => setQty(e.target.value)}
          placeholder="1 un"
          style={{
            flex: 1, padding: '6px 10px',
            borderRadius: '10px', border: '1.5px solid #d06080',
            background: '#ffffff', color: '#2d0a18',
            fontSize: '12px', fontWeight: '600', fontFamily: 'inherit', outline: 'none',
          }}
          onFocus={e => { e.target.style.borderColor = '#b0003a'; e.target.select() }}
          onBlur={e => e.target.style.borderColor = '#d06080'}
        />
      </div>

      {/* Toggle opciones adicionales */}
      <button
        onClick={() => setMostrarOpc(v => !v)}
        style={{
          marginTop: '4px', background: 'none', border: 'none',
          cursor: 'pointer', fontSize: '12px', fontWeight: '700',
          color: '#b0003a', fontFamily: 'inherit', padding: '4px 0',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}
      >
        {mostrarOpc ? '▾ Ocultar opciones' : '▸ + Precio y notas (opcional)'}
      </button>

      {/* Opciones adicionales: precio + notas */}
      {mostrarOpc && (
        <div style={{
          marginTop: '4px', padding: '12px', borderRadius: '14px',
          background: '#fff0f8', border: '1.5px solid #e8a0c0',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#8c1a4a', display: 'block', marginBottom: '4px' }}>
              💰 Precio estimado
            </label>
            <input
              value={precio}
              onChange={e => setPrecio(e.target.value)}
              placeholder="Ej: 1990"
              type="number"
              min="0"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#8c1a4a', display: 'block', marginBottom: '4px' }}>
              📝 Notas
            </label>
            <input
              value={notas}
              onChange={e => setNotas(e.target.value)}
              placeholder="Marca, tienda, urgencia..."
              style={inputStyle}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AddItem
