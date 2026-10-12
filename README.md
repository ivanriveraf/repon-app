# 🛒 Repón — tu hogar, siempre listo

> ⚠️ **Prototipo.** Este repositorio muestra una versión en desarrollo de la app con fines de portafolio. La versión final no forma parte de este repositorio.

**Repón** es una aplicación web en **React** para gestionar el inventario de la casa y armar la lista del supermercado. En vez de anotar lo que falta, marcas lo que se te acabó y la app lo lleva sola a tu lista de compras.

## Funcionalidades

- **Inventario del hogar** organizado por categorías (comida, limpieza, baño y cocina), con cantidad, precio y notas por producto.
- **Búsqueda, filtros por categoría y ordenamiento.**
- **Modo supermercado:** una lista con todo lo que está por comprar, donde vas marcando lo que ya echaste al carro.
- **Edición en línea** de nombre, cantidad, precio y notas, adaptada a pantallas táctiles.
- **Eliminar con opción de deshacer** mediante un *toast* que dura 5 segundos.
- **Guardado automático** en `localStorage`, con migración de datos antiguos.
- **Pantalla Premium** con estadísticas y planes, como maqueta del modelo de negocio.

## Tecnologías

React 19 · JavaScript (ES6+) · Hooks (`useState`, `useEffect`, `useRef` y un *custom hook* `useItems`) · CSS3 · Create React App

## Estructura

```
src/
  App.jsx               estado principal, filtros, deshacer
  hooks/useItems.js     lógica del inventario + persistencia
  components/           AddItem, ItemRow, FilterChips, Tabs
  screens/              ListaSuper, Premium
```

## Cómo ejecutarlo

```bash
npm install
npm start
```

Después abre [http://localhost:3000](http://localhost:3000).

## Créditos

Desarrollo: **Iván Rivera** ([GitHub](https://github.com/ivanriveraf) · [LinkedIn](https://linkedin.com/in/ivan-patricio-rivera-fuentealba))

## Licencia

© 2026 Iván Rivera. Todos los derechos reservados. Ver [LICENSE](LICENSE).
