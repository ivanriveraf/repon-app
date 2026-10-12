import { useState, useEffect } from 'react'

const ITEMS_INICIALES = [
  { id: 1,  name: 'Arroz',           qty: '1 kg',     cat: 'food',   agotado: true,  precio: '', notas: '' },
  { id: 2,  name: 'Aceite',          qty: '1 L',      cat: 'food',   agotado: false, precio: '', notas: '' },
  { id: 3,  name: 'Leche',           qty: '6 un',     cat: 'food',   agotado: true,  precio: '', notas: '' },
  { id: 4,  name: 'Huevos',          qty: '12 un',    cat: 'food',   agotado: false, precio: '', notas: '' },
  { id: 5,  name: 'Pan',             qty: '1 un',     cat: 'food',   agotado: true,  precio: '', notas: '' },
  { id: 6,  name: 'Detergente',      qty: '1 bolsa',  cat: 'clean',  agotado: false, precio: '', notas: '' },
  { id: 7,  name: 'Esponjas',        qty: '3 un',     cat: 'clean',  agotado: true,  precio: '', notas: '' },
  { id: 8,  name: 'Cloro',           qty: '1 L',      cat: 'clean',  agotado: true,  precio: '', notas: '' },
  { id: 9,  name: 'Shampoo',         qty: '1 frasco', cat: 'baño',   agotado: true,  precio: '', notas: '' },
  { id: 10, name: 'Papel higiénico', qty: '6 un',     cat: 'baño',   agotado: false, precio: '', notas: '' },
  { id: 11, name: 'Jabón',           qty: '2 un',     cat: 'baño',   agotado: true,  precio: '', notas: '' },
  { id: 12, name: 'Jabón platos',    qty: '500 ml',   cat: 'cocina', agotado: true,  precio: '', notas: '' },
  { id: 13, name: 'Bolsas basura',   qty: '1 rollo',  cat: 'cocina', agotado: false, precio: '', notas: '' },
]

export function useItems() {
  const [items, setItems] = useState(() => {
    try {
      const guardados = localStorage.getItem('repon-items')
      if (guardados) {
        const parsed = JSON.parse(guardados)
        // Migrar items antiguos que no tengan precio/notas
        return parsed.map(item => ({
          precio: '',
          notas: '',
          ...item,
        }))
      }
    } catch (e) {
      console.warn('Error leyendo datos guardados:', e)
    }
    return ITEMS_INICIALES
  })

  useEffect(() => {
    localStorage.setItem('repon-items', JSON.stringify(items))
  }, [items])

  function getNextId(prev) {
    return prev.length > 0 ? Math.max(...prev.map(i => i.id)) + 1 : 1
  }

  function toggleAgotado(id) {
    setItems(prev =>
      prev.map(item => item.id === id ? { ...item, agotado: !item.agotado } : item)
    )
  }

  function agregarItem(name, cat, qty = '1 un', precio = '', notas = '', agotado = true) {
    setItems(prev => [
      ...prev,
      {
        id: getNextId(prev),
        name,
        qty: qty || '1 un',
        cat,
        agotado,
        precio,
        notas,
      }
    ])
  }

  function eliminarItem(id) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  function restaurarItem(item) {
    // Reinsertar item eliminado (al final, conservando todos sus datos)
    setItems(prev => {
      // Evitar duplicados si el usuario presiona Deshacer dos veces
      if (prev.find(i => i.id === item.id)) return prev
      return [...prev, item]
    })
  }

  function editarQty(id, nuevaQty) {
    setItems(prev =>
      prev.map(item => item.id === id ? { ...item, qty: nuevaQty } : item)
    )
  }

  function editarItem(id, campos) {
    setItems(prev =>
      prev.map(item => item.id === id ? { ...item, ...campos } : item)
    )
  }

  return { items, toggleAgotado, agregarItem, eliminarItem, restaurarItem, editarQty, editarItem }
}
