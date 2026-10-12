import { useState, useRef } from 'react'
import { useItems } from './hooks/useItems'
import Tabs from './components/Tabs'
import FilterChips from './components/FilterChips'
import ItemRow from './components/ItemRow'
import AddItem from './components/AddItem'
import ListaSuper from './screens/ListaSuper'
import Premium from './screens/Premium'

function App() {
  const { items, toggleAgotado, agregarItem, eliminarItem, restaurarItem, editarQty, editarItem } = useItems()
  const [tab, setTab]         = useState('inventario')
  const [filtro, setFiltro]   = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden]     = useState('original')
  const [toast, setToast]     = useState(null)
  const toastTimerRef         = useRef(null)

  // Estado comprados elevado aquí para que persista al cambiar de tab
  const [comprados, setComprados] = useState({})

  // Limpiar comprados de items que ya no están por comprar
  // (ej: el usuario los marcó como "en casa" desde inventario)
  const idsPorComprar = new Set(items.filter(i => i.agotado).map(i => i.id))
  const compradosFiltrados = Object.fromEntries(
    Object.entries(comprados).filter(([id]) => idsPorComprar.has(Number(id)))
  )

  // ── Eliminar con soporte undo ──────────────────────────────────────────────
  function handleEliminar(id) {
    const item = items.find(i => i.id === id)
    eliminarItem(id)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ item })
    toastTimerRef.current = setTimeout(() => setToast(null), 5000)
  }

  function handleUndo() {
    if (!toast) return
    clearTimeout(toastTimerRef.current)
    restaurarItem(toast.item)
    setToast(null)
  }

  // ── Filtrado y ordenamiento ────────────────────────────────────────────────
  let itemsFiltrados = items

  if (busqueda.trim()) {
    const q = busqueda.toLowerCase().trim()
    itemsFiltrados = itemsFiltrados.filter(i => i.name.toLowerCase().includes(q))
  }

  if (filtro !== 'todos') {
    itemsFiltrados = itemsFiltrados.filter(i => i.cat === filtro)
  }

  if (orden === 'nombre') {
    itemsFiltrados = [...itemsFiltrados].sort((a, b) => a.name.localeCompare(b.name, 'es'))
  } else if (orden === 'cat') {
    itemsFiltrados = [...itemsFiltrados].sort((a, b) => a.cat.localeCompare(b.cat))
  } else if (orden === 'reciente') {
    itemsFiltrados = [...itemsFiltrados].sort((a, b) => b.id - a.id)
  }

  const enCasa     = itemsFiltrados.filter(i => !i.agotado)
  const porComprar = itemsFiltrados.filter(i =>  i.agotado)

  // ── Contadores por categoría (sobre todos los items sin filtrar) ──────────
  const contadoresCat = {}
  items.forEach(i => {
    contadoresCat[i.cat] = (contadoresCat[i.cat] || 0) + 1
  })

  return (
    <div style={{
      maxWidth: '430px',
      margin: '0 auto',
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #fff0f5 0%, #fce8f0 60%, #f8d0e8 100%)',
      fontFamily: "'Nunito', sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: '28px 22px 18px',
        background: 'linear-gradient(135deg, #b0003a 0%, #e0006a 100%)',
        borderRadius: '0 0 28px 28px',
        boxShadow: '0 4px 20px rgba(176,0,58,0.3)',
        marginBottom: '4px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: '38px',
              color: '#ffffff',
              margin: 0,
              textShadow: '0 2px 8px rgba(0,0,0,0.15)',
              letterSpacing: '-0.5px',
            }}>
              Repón
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontWeight: '600',
              margin: '4px 0 0',
              fontSize: '13px',
            }}>
              tu hogar, siempre listo ☁️
            </p>
          </div>
          <span style={{
            background: 'rgba(255,255,255,0.2)',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: '700',
            padding: '5px 12px',
            borderRadius: '20px',
            border: '1.5px solid rgba(255,255,255,0.4)',
            marginTop: '6px',
            backdropFilter: 'blur(4px)',
          }}>
            ✦ FREE
          </span>
        </div>

        {/* Mini stats */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          {[
            { num: items.filter(i => !i.agotado).length, label: 'en casa',     icon: '✅' },
            { num: items.filter(i =>  i.agotado).length, label: 'por comprar', icon: '🛒' },
            { num: items.length,                          label: 'total',       icon: '📦' },
          ].map((s, idx) => (
            <div key={idx} style={{
              flex: 1,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '8px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.25)',
            }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>{s.num}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs
        activa={tab}
        onChange={t => { setTab(t); setBusqueda('') }}
        contadorSuper={items.filter(i => i.agotado).length}
      />

      {/* ── Contenido ── */}
      <div style={{ padding: '0 18px 80px' }}>

        {/* ── INVENTARIO ── */}
        {tab === 'inventario' && (
          <>
            {/* Búsqueda + Orden */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '11px', top: '50%',
                  transform: 'translateY(-50%)', fontSize: '14px', pointerEvents: 'none',
                }}>
                  🔍
                </span>
                <input
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar producto..."
                  style={{
                    width: '100%', padding: '9px 12px 9px 34px',
                    borderRadius: '14px', border: '2px solid #d06080',
                    background: '#ffffff', color: '#2d0a18',
                    fontSize: '13px', fontWeight: '600',
                    fontFamily: 'inherit', outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#b0003a'}
                  onBlur={e => e.target.style.borderColor = '#d06080'}
                />
                {busqueda && (
                  <button
                    onClick={() => setBusqueda('')}
                    style={{
                      position: 'absolute', right: '10px', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', cursor: 'pointer', fontSize: '14px',
                      color: '#a06080', padding: '2px',
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
              <select
                value={orden}
                onChange={e => setOrden(e.target.value)}
                style={{
                  padding: '9px 8px', borderRadius: '14px',
                  border: '2px solid #d06080', background: '#ffffff',
                  color: '#2d0a18', fontSize: '12px', fontWeight: '700',
                  fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
                }}
              >
                <option value="original">📌 Orden</option>
                <option value="nombre">🔤 A–Z</option>
                <option value="cat">📂 Categ.</option>
                <option value="reciente">🆕 Reciente</option>
              </select>
            </div>

            <FilterChips
              activo={filtro}
              onChange={setFiltro}
              contadores={contadoresCat}
              total={items.length}
            />

            {/* Sección En casa */}
            {enCasa.length > 0 && (
              <>
                <SectionHeader icon="✅" label="En casa" count={enCasa.length} />
                {enCasa.map(item => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onToggle={toggleAgotado}
                    onEliminar={handleEliminar}
                    onEditarQty={editarQty}
                    onEditarItem={editarItem}
                  />
                ))}
              </>
            )}

            {/* Sección Por comprar */}
            {porComprar.length > 0 && (
              <>
                <SectionHeader icon="🛒" label="Por comprar" count={porComprar.length} margin="16px 0 8px" />
                {porComprar.map(item => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onToggle={toggleAgotado}
                    onEliminar={handleEliminar}
                    onEditarQty={editarQty}
                    onEditarItem={editarItem}
                  />
                ))}
              </>
            )}

            {/* Empty state */}
            {itemsFiltrados.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '50px 20px',
                color: '#8c4060', fontWeight: '700',
              }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>
                  {busqueda ? '🔍' : '📭'}
                </div>
                <div style={{ fontSize: '16px', marginBottom: '6px' }}>
                  {busqueda
                    ? <>Sin resultados para <em>"{busqueda}"</em></>
                    : 'No hay productos en esta categoría'
                  }
                </div>
                {busqueda && (
                  <button
                    onClick={() => setBusqueda('')}
                    style={{
                      background: '#b0003a', color: 'white', border: 'none',
                      borderRadius: '12px', padding: '8px 18px',
                      fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}

            <AddItem onAgregar={agregarItem} />
          </>
        )}

        {tab === 'super' && (
          <ListaSuper
            items={items}
            comprados={compradosFiltrados}
            setComprados={setComprados}
          />
        )}
        {tab === 'premium' && <Premium items={items} />}
      </div>

      {/* ── Toast Undo ── */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1a0810',
          color: 'white',
          borderRadius: '18px',
          padding: '12px 14px 12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
          zIndex: 9999,
          fontSize: '13px',
          fontWeight: '600',
          maxWidth: '340px',
          width: 'calc(100% - 36px)',
          animation: 'toastSlide 0.25s ease',
        }}>
          <span style={{ flex: 1 }}>
            🗑️ <strong style={{ color: '#ffb0c8' }}>{toast.item.name}</strong> eliminado
          </span>
          <button
            onClick={handleUndo}
            style={{
              background: 'linear-gradient(135deg, #b0003a, #e0006a)',
              color: 'white', border: 'none', borderRadius: '12px',
              padding: '7px 14px', fontSize: '12px', fontWeight: '800',
              cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
            }}
          >
            Deshacer
          </button>
        </div>
      )}

      <style>{`
        @keyframes toastSlide {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}

// Componente helper para headers de sección
function SectionHeader({ icon, label, count, margin = '4px 0 8px' }) {
  return (
    <div style={{
      fontSize: '11px', fontWeight: '800', letterSpacing: '1.2px',
      textTransform: 'uppercase', color: '#8c1a4a', margin,
      display: 'flex', alignItems: 'center', gap: '6px',
    }}>
      {icon} {label}
      <span style={{
        background: '#fce8f0', color: '#b0003a',
        fontSize: '10px', fontWeight: '800',
        padding: '1px 6px', borderRadius: '8px',
      }}>
        {count}
      </span>
    </div>
  )
}

export default App
