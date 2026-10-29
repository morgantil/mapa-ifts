# Mapa de IFTS — CABA

Página única: un mapa de la Ciudad con las sedes de los IFTS y las carreras que dicta cada una.
Estética: la del IFTS 16 (`../estetica/`).

---

## Cómo abrirla

**Doble clic en `index.html`.** No necesita servidor, ni instalación, ni build: los datos están en un archivo `.js` justamente para que funcione así.

> Necesita internet: el mapa (Leaflet) y las imágenes del mapa base vienen de CDN.

Si preferís servirla (recomendado para publicar):

```bash
python -m http.server 8000
# http://localhost:8000
```

---

## Cómo editar los datos

Todo vive en **`datos/ifts.js`**. Se edita con cualquier editor de texto y se recarga la página.

### Agregar una carrera

En `carreras`, agregá una entrada con un `id` nuevo:

```js
{ id: 'enfermeria', nombre: 'Tecnicatura Superior en Enfermería', area: 'salud' }
```

Después sumala a la sede que la dicta:

```js
carreras: [{ id: 'enfermeria', duracion: 3, turnos: ['mañana', 'tarde'], modalidad: ['hibrida'] }]
```

- `duracion` en años: `1.5`, `2`, `2.5`, `3`.
- `turnos`: `'mañana'`, `'tarde'`, `'noche'`.
- `modalidad`: `'presencial'`, `'hibrida'`, `'distancia'`.
- Si un dato no se conoce, **se omite**. La ficha muestra "Sin datos de duración ni turno" en vez de inventarlo.

### Agregar una sede

```js
{
  id: 'ifts-40', numero: 40, comparteCon: [],
  direccion: 'Av. Ejemplo 123', piso: '',          // piso es opcional
  barrio: 'Palermo', comuna: 14,
  lat: -34.58, lng: -58.42,
  sitio: 'https://ejemplo.edu.ar',
  carreras: [{ id: 'diseno-grafico', duracion: 3, turnos: ['noche'], modalidad: ['hibrida'] }]
}
```

`comparteCon: [19]` fusiona dos IFTS en un solo pin, rotulado `9 · 19`.

### Áreas

Están en `areas` con su color. El color solo se usa en el punto chico del chip de filtro; los pines son siempre esmeralda.

---

## Fuentes de los datos

| Dato | Fuente |
|---|---|
| Carreras, duración, modalidad y horario 2026 | Catálogo oficial de la Agencia de Habilidades para el Futuro (`formacionesagencia.bue.edu.ar`) |
| Confirmación de oferta por sede | Campus virtual oficial (`aulasvirtuales.bue.edu.ar`, categorías `2026_IFTS NN`) |
| Direcciones y particularidades | Sitios de cada instituto (ifts4, ifts7, ifts9, ifts12, ifts13, ifts16, ifts18, ifts19, ifts21, ifts24) |
| Coordenadas | Geocodificación sobre OpenStreetMap (Nominatim) |

El sitio del GCBA (`buenosaires.gob.ar`) estaba en mantenimiento durante el relevamiento (29/10/2026).

---

## Archivos

```
mapa/
├─ index.html          estructura
├─ assets/
│  ├─ tokens.css       estética IFTS 16 (colores, tipos, radios)
│  ├─ estilos.css      estilos de la aplicación
│  └─ app.js           mapa, filtros, ficha, lista, modo oscuro
└─ datos/
   └─ ifts.js          los datos (window.IFTS_DATA)
```

---

## Qué hace

- **18 pines**, uno por sede. El 9 y el 19 hoy están **separados** (ver "Pendientes").
- **Ficha al tocar un pin**: dirección primero, barrio y comuna, carreras con duración/turno/modalidad, y dos botones (Mapa de la Ciudad / Cómo llegar).
- **Buscador** por carrera, IFTS, barrio o dirección.
- **Filtros**: área, duración, turno, modalidad, barrio. Combinables.
- **Cerca de mí**: geolocalización, ordena por distancia y muestra los metros.
- **Lista**: la misma información sin usar el mapa (accesible, y cómoda en el teléfono).
- **Modo claro/oscuro** y **filtros en la URL** (compartir un link reproduce la búsqueda).
- Tecla **`/`** enfoca el buscador; **`Esc`** cierra la lista.

---

## Publicar

Es un sitio estático: se sube la carpeta tal cual a Netlify, Vercel, GitHub Pages o cualquier hosting con archivos estáticos. No hay backend ni variables de entorno.

---

## Pendientes y dudas de datos

1. **IFTS 9 y 19**: la tabla original decía que comparten Rivadavia 3846, pero el sitio del 9 da **Rodríguez Peña 747** (San Nicolás) y el del 19 **Catamarca 143** (Balvanera), y el catálogo oficial les asigna barrios distintos. Quedaron separados. Si hay que volver a juntarlos: `comparteCon: [19]` en la sede 9 y borrar la 19.
2. **IFTS 30**: en 2026 no dicta tecnicaturas, solo dos Trayectos de 1 año. Aparece en el mapa con una nota y sin carreras.
3. **IFTS 22**: el sitio está caído y hay notas que lo dan por desactivado; se mantiene con Gestión Ambiental y la dirección de la tabla original (sin confirmar).
4. **IFTS 32**: la dirección de la tabla (Humberto Primo 1573) no coincide con la de un directorio oficial (Humberto I° 102). Se usó la de la tabla.
5. **Faltan IFTS**: existen además los 3, 5, 6, 10, 14, 17, 23, 26, 27, 28, 29, 31, 33, 34, 87, 89 y 90. No están en el mapa porque la lista de partida tenía 18. Agregarlos es sumar entradas a `sedes`.
6. **Direcciones de 15 y 20**: no tienen sitio propio activo; se usaron las direcciones de la tabla original.
