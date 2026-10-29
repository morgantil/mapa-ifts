/* =========================================================================
   Mapa de IFTS — lógica de la aplicación
   Datos: datos/ifts.js (window.IFTS_DATA)
   ========================================================================= */
(function () {
  'use strict';

  const DATA = window.IFTS_DATA;
  if (!DATA) { console.error('Falta datos/ifts.js'); return; }

  /* ----------------------------------------------------------- índices */
  const carrerasById = new Map(DATA.carreras.map(c => [c.id, c]));
  const areasById = new Map(DATA.areas.map(a => [a.id, a]));
  const sedes = DATA.sedes.slice();

  const CABA = { lat: -34.6037, lng: -58.3816 };
  const BASEMAP = {
    light: {
      base: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      ref: null
    },
    dark: {
      base: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      ref: null
    }
  };
  const ATTR = 'Tiles &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  /* ------------------------------------------------------------ estado */
  const state = {
    q: '', area: '', dur: '', turno: '', modalidad: '', barrio: '',
    cerca: false, sinDato: false, lista: false
  };
  let userPos = null;

  /* ---------------------------------------------------------- utilidades */
  const $ = (sel) => document.querySelector(sel);
  const norm = (s) => (s || '')
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim();

  const fmtDur = (d) => d === 1.5 ? '1½ años'
    : d === 2 ? '2 años'
    : d === 2.5 ? '2½ años'
    : d === 3 ? '3 años'
    : d === 3.5 ? '3½ años'
    : null;

  const TURNO_LABEL = { 'mañana': 'Mañana', 'tarde': 'Tarde', 'noche': 'Noche' };
  const MOD_LABEL = { presencial: 'Presencial', hibrida: 'Híbrida', distancia: 'A distancia' };

  function metaCarrera(c, sedeCarrera) {
    const partes = [];
    const dur = (sedeCarrera && sedeCarrera.duracion) || c.duracion;
    if (dur) partes.push(fmtDur(dur));
    const turnos = (sedeCarrera && sedeCarrera.turnos) || [];
    if (turnos.length) partes.push(turnos.map(t => TURNO_LABEL[t] || t).join(' y '));
    const mods = (sedeCarrera && sedeCarrera.modalidad) || c.modalidad || [];
    if (mods.length) partes.push(mods.map(m => MOD_LABEL[m] || m).join(' / '));
    if (!partes.length) return 'Sin datos de duración ni turno';
    return partes.join(' · ');
  }

  function distanciaKm(lat, lng) {
    if (!userPos) return null;
    const R = 6371;
    const dLat = (lat - userPos.lat) * Math.PI / 180;
    const dLng = (lng - userPos.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(userPos.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function fmtDist(km) {
    if (km == null) return '';
    return km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(1).replace('.', ',') + ' km';
  }

  /* ------------------------------------------------------ filtro de sedes */
  function carreraPasa(c, sc) {
    // área
    if (state.area && c.area !== state.area) return false;

    // duración
    if (state.dur) {
      const dur = (sc && sc.duracion) || c.duracion;
      if (dur == null) { if (!state.sinDato) return false; }
      else if (String(dur) !== state.dur) return false;
    }

    // turno
    if (state.turno) {
      const turnos = (sc && sc.turnos) || [];
      if (!turnos.length) { if (!state.sinDato) return false; }
      else if (!turnos.includes(state.turno)) return false;
    }

    // modalidad
    if (state.modalidad) {
      const mods = (sc && sc.modalidad) || c.modalidad || [];
      if (!mods.length) { if (!state.sinDato) return false; }
      else if (!mods.includes(state.modalidad)) return false;
    }

    // texto
    if (state.q) {
      const q = norm(state.q);
      if (norm(c.nombre).indexOf(q) === -1) return false;
    }

    return true;
  }

  function sedePasaTexto(s) {
    if (!state.q) return true;
    const blob = norm([s.nombre, s.direccion, s.barrio, 'ifts ' + s.numero, (s.comparteCon || []).join(' ')].join(' '));
    return blob.indexOf(state.q) !== -1;
  }

  function filtrar() {
    const q = norm(state.q);
    const query = q;
    const hayFiltroCarrera = !!(state.area || state.dur || state.turno || state.modalidad);

    const out = [];
    for (const sede of sedes) {
      if (state.barrio && sede.barrio !== state.barrio) continue;

      const propias = (sede.carreras || []).map(sc => {
        const c = carrerasById.get(sc.id);
        return c ? { c, sc } : null;
      }).filter(Boolean);

      let visibles = propias.filter(({ c, sc }) => carreraPasa(c, sc));

      // sedes sin tecnicaturas (ej. IFTS 30 en 2026): se muestran mientras no
      // haya un filtro de carrera activo, con su nota explicativa.
      if (!propias.length) {
        if (!hayFiltroCarrera && (!query || sedePasaTexto(sede))) {
          out.push({ sede, carreras: [], dist: distanciaKm(sede.lat, sede.lng) });
        }
        continue;
      }

      // el texto también puede matchear la sede (número, barrio, dirección)
      const matchSede = query && sedePasaTexto(sede);
      if (!visibles.length && matchSede && !hayFiltroCarrera) {
        visibles = propias;
      }
      if (!visibles.length) continue;

      // si el texto matcheó carreras puntuales, la ficha muestra esas
      if (query) {
        const porCarrera = visibles.filter(({ c }) => norm(c.nombre).indexOf(query) !== -1);
        if (porCarrera.length) visibles = porCarrera;
      }

      out.push({ sede, carreras: visibles, dist: distanciaKm(sede.lat, sede.lng) });
    }

    if (state.cerca && userPos) {
      out.sort((a, b) => (a.dist ?? 1e9) - (b.dist ?? 1e9));
    } else {
      out.sort((a, b) => a.sede.numero - b.sede.numero);
    }
    return out;
  }

  /* --------------------------------------------------------------- mapa */
  const map = L.map('mapa', {
    center: [CABA.lat, CABA.lng],
    zoom: 12,
    zoomControl: false,
    attributionControl: true,
    preferCanvas: false
  });
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  map.attributionControl.setPrefix('');

  let capaBase = null;
  let capaRef = null;

  function ponerTiles(tema) {
    if (capaBase) { map.removeLayer(capaBase); capaBase = null; }
    if (capaRef) { map.removeLayer(capaRef); capaRef = null; }
    const set = tema === 'dark' ? BASEMAP.dark : BASEMAP.light;
    capaBase = L.tileLayer(set.base, { attribution: ATTR, maxZoom: 19, detectRetina: false }).addTo(map);
    capaBase.bringToBack();
  }

  const markers = new Map();     // sede.id -> marker
  let userMarker = null;
  let activo = null;

  function iconoPin(sede, esActivo) {
    const doble = (sede.comparteCon || []).length > 0;
    const numero = doble ? sede.numero + '·' + sede.comparteCon.join('·') : String(sede.numero);
    const clase = 'pin' + (doble ? ' pin--doble' : '') + (esActivo ? ' pin--activo' : '');
    return L.divIcon({
      className: 'pin-wrap',
      html: `<div class="${clase}" role="img" aria-label="IFTS ${numero}"><span>${numero}</span></div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -32]
    });
  }

  function sedeLabel(sede) {
    const extras = sede.comparteCon && sede.comparteCon.length ? ' (también IFTS ' + sede.comparteCon.join(', ') + ')' : '';
    return 'IFTS N° ' + sede.numero + extras;
  }

  function popupHtml(item) {
    const s = item.sede;
    const dist = state.cerca && item.dist != null ? `<span class="ficha__dist">a ${fmtDist(item.dist)}</span>` : '';
    const carreras = item.carreras.length
      ? `<ul class="ficha__lista">${item.carreras.map(({ c, sc }) => `
          <li>
            <span class="carrera__nombre">${esc(c.nombre)}</span>
            <span class="carrera__meta">${esc(metaCarrera(c, sc))}</span>
          </li>`).join('')}</ul>`
      : `<p class="ficha__nota">${esc(s.nota || 'Sin tecnicaturas publicadas para 2026.')}</p>`;

    const pisos = s.piso ? `<b>${esc(s.piso)}</b> · ` : '';
    const gmaps = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(s.direccion + ', ' + s.barrio + ', CABA');
    const gcba = 'https://mapa.buenosaires.gob.ar/comollego/?lat=' + s.lat + '&lng=' + s.lng + '&zl=17';

    return `
      <div class="ficha">
        <div class="ficha__top">
          <span class="ficha__badge">${esc(sedeLabel(s))}</span>
          ${dist}
        </div>
        <p class="ficha__dir">${esc(s.direccion)}</p>
        <p class="ficha__barrio">${pisos}${esc(s.barrio)} · Comuna ${s.comuna}</p>
        ${carreras}
        <div class="ficha__acciones">
          <a class="btn btn--dark" href="${gcba}" target="_blank" rel="noopener">Mapa de la Ciudad</a>
          <a class="btn btn--ghost" href="${gmaps}" target="_blank" rel="noopener">Cómo llegar</a>
        </div>
      </div>`;
  }

  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function abrirSede(sede, item, opts) {
    const marker = markers.get(sede.id);
    if (!marker) return;

    if (activo && activo !== marker) {
      const prev = sedes.find(s => markers.get(s.id) === activo);
      if (prev) activo.setIcon(iconoPin(prev, false));
    }
    marker.setIcon(iconoPin(sede, true));
    activo = marker;

    const popupW = Math.min(300, window.innerWidth - 40);
    marker.bindPopup(popupHtml(item || { sede, carreras: (sede.carreras || []).map(sc => ({ c: carrerasById.get(sc.id), sc })).filter(x => x.c) }), {
      closeButton: true, autoPan: true, maxWidth: popupW + 20, minWidth: popupW, offset: [0, 0]
    });

    if (opts && opts.fly) {
      map.flyTo([sede.lat, sede.lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
      setTimeout(() => marker.openPopup(), 520);
    } else {
      marker.openPopup();
    }
    marcarItemActivo(sede.id);
  }

  /* ------------------------------------------------------------- render */
  let ultimos = [];

  function render() {
    // al cambiar filtros, la ficha abierta deja de tener sentido
    if (activo) {
      map.closePopup();
      const prev = sedes.find(s => markers.get(s.id) === activo);
      if (prev) activo.setIcon(iconoPin(prev, false));
      activo = null;
    }

    const resultados = filtrar();
    ultimos = resultados;
    const ids = new Set(resultados.map(r => r.sede.id));

    // pines visibles
    for (const sede of sedes) {
      const visible = ids.has(sede.id);
      const m = markers.get(sede.id);
      if (visible) {
        const item = resultados.find(r => r.sede.id === sede.id);
        if (!m) {
          const marker = L.marker([sede.lat, sede.lng], {
            icon: iconoPin(sede, false), keyboard: true, title: sedeLabel(sede) + ' — ' + sede.direccion
          }).addTo(map);
          marker.on('click', () => {
            const it = ultimos.find(r => r.sede.id === sede.id);
            abrirSede(sede, it, { fly: false });
          });
          markers.set(sede.id, marker);
        } else {
          if (activo !== m) m.setIcon(iconoPin(sede, false));
          if (!map.hasLayer(m)) m.addTo(map);
        }
        void item;
      } else if (m) {
        map.removeLayer(m);
        if (activo === m) activo = null;
      }
    }

    // contador + limpiar + URL
    const n = resultados.length;
    $('#contador').textContent = n === 0 ? 'Sin resultados' : (n === 1 ? '1 IFTS' : n + ' IFTS');
    const hayFiltros = !!(state.q || state.area || state.dur || state.turno || state.modalidad || state.barrio || state.cerca);
    $('#btnLimpiar').hidden = !hayFiltros;
    $('#vacio').hidden = n !== 0;

    const badge = $('#badgeFiltros');
    const activos = [state.area, state.dur, state.turno, state.modalidad, state.barrio].filter(Boolean).length + (state.cerca ? 1 : 0);
    if (activos) { badge.hidden = false; badge.textContent = activos; } else { badge.hidden = true; }

    $('#wrapSinDato').hidden = !(state.dur || state.turno || state.modalidad);

    renderLista(resultados);
    sincronizarURL();

    // encuadre
    if (hayFiltros && n > 0) {
      const bounds = L.latLngBounds(resultados.map(r => [r.sede.lat, r.sede.lng]));
      map.fitBounds(bounds, { padding: [70, 70], maxZoom: n === 1 ? 15 : 14, animate: true, duration: 0.5 });
    } else if (!hayFiltros) {
      map.setView([CABA.lat, CABA.lng], 12);
    }
  }

  function renderLista(resultados) {
    const cont = $('#listaItems');
    $('#listaTitulo').textContent = resultados.length + (resultados.length === 1 ? ' IFTS' : ' IFTS');
    if (!resultados.length) {
      cont.innerHTML = '<p style="padding:16px;font-size:12px;color:var(--text-body)">No hay resultados con esos filtros.</p>';
      return;
    }
    cont.innerHTML = resultados.map(({ sede, carreras, dist }) => {
      const nombres = carreras.slice(0, 3).map(({ c }) => c.nombre.replace(/^Tecnicatura Superior en /, '')).join(' · ');
      const extra = carreras.length > 3 ? ' · +' + (carreras.length - 3) : '';
      const d = state.cerca && dist != null ? ` · a ${fmtDist(dist)}` : '';
      return `
        <button class="item" type="button" data-sede="${sede.id}">
          <span class="item__top">
            <span class="item__num">${sede.comparteCon && sede.comparteCon.length ? sede.numero + '·' + sede.comparteCon.join('·') : sede.numero}</span>
            <span class="item__dir">${esc(sede.direccion)}</span>
          </span>
          <span class="item__barrio">${esc(sede.barrio)}${d} · ${carreras.length} ${carreras.length === 1 ? 'carrera' : 'carreras'}</span>
          <span class="item__carreras">${esc(nombres + extra)}</span>
        </button>`;
    }).join('');

    cont.querySelectorAll('.item').forEach(btn => {
      btn.addEventListener('click', () => {
        const sede = sedes.find(s => s.id === btn.dataset.sede);
        const it = ultimos.find(r => r.sede.id === sede.id);
        abrirSede(sede, it, { fly: true });
        if (window.innerWidth <= 900) toggleLista(false);
      });
    });
  }

  function marcarItemActivo(id) {
    document.querySelectorAll('.item').forEach(el => el.classList.toggle('item--activo', el.dataset.sede === id));
  }

  /* ----------------------------------------------------------------- URL */
  function sincronizarURL() {
    // con file:// el navegador no permite reescribir la URL: se omite
    if (location.protocol === 'file:') return;
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.area) p.set('area', state.area);
    if (state.dur) p.set('dur', state.dur);
    if (state.turno) p.set('turno', state.turno);
    if (state.modalidad) p.set('mod', state.modalidad);
    if (state.barrio) p.set('barrio', state.barrio);
    if (state.cerca) p.set('cerca', '1');
    const qs = p.toString();
    try {
      history.replaceState(null, '', qs ? '?' + qs : location.pathname);
    } catch (e) { /* file:// o contextos restringidos */ }
  }

  function leerURL() {
    const p = new URLSearchParams(location.search);
    state.q = p.get('q') || '';
    state.area = p.get('area') || '';
    state.dur = p.get('dur') || '';
    state.turno = p.get('turno') || '';
    state.modalidad = p.get('mod') || '';
    state.barrio = p.get('barrio') || '';
    state.cerca = p.get('cerca') === '1';
  }

  /* ------------------------------------------------------------- controles */
  function pintarChips() {
    const cont = $('#chipsAreas');
    const todas = `<button class="chip" type="button" data-area="" aria-pressed="${state.area === ''}">Todas</button>`;
    cont.innerHTML = todas + DATA.areas.map(a => `
      <button class="chip" type="button" data-area="${a.id}" aria-pressed="${state.area === a.id}">
        <span class="dot" style="background:${a.color}"></span>${esc(a.nombre)}
      </button>`).join('');

    cont.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        state.area = chip.dataset.area;
        cont.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.area === state.area)));
        render();
      });
    });
  }

  function pintarBarrios() {
    const barrios = [...new Set(sedes.map(s => s.barrio))].sort((a, b) => a.localeCompare(b, 'es'));
    const sel = $('#barrio');
    sel.innerHTML = '<option value="">Todos</option>' + barrios.map(b => `<option value="${esc(b)}">${esc(b)}</option>`).join('');
  }

  function toggleLista(force) {
    const abrir = typeof force === 'boolean' ? force : !state.lista;
    state.lista = abrir;
    const panel = $('#panelLista');
    panel.classList.toggle('lista--abierta', abrir);
    panel.setAttribute('aria-hidden', String(!abrir));
    $('#btnLista').setAttribute('aria-pressed', String(abrir));
  }

  function limpiar() {
    state.q = ''; state.area = ''; state.dur = ''; state.turno = ''; state.modalidad = ''; state.barrio = ''; state.cerca = false;
    $('#q').value = '';
    $('#dur').value = ''; $('#turno').value = ''; $('#modalidad').value = ''; $('#barrio').value = '';
    $('#btnCerca').setAttribute('aria-pressed', 'false');
    pintarChips();
    render();
  }

  /* ---------------------------------------------------------------- tema */
  function aplicarTema(tema) {
    document.documentElement.dataset.theme = tema;
    localStorage.setItem('ifts-mapa-tema', tema);
    ponerTiles(tema);
  }

  /* ------------------------------------------------------------- arranque */
  function init() {
    pintarBarrios();
    leerURL();
    pintarChips();

    $('#q').value = state.q;
    $('#dur').value = state.dur;
    $('#turno').value = state.turno;
    $('#modalidad').value = state.modalidad;
    $('#barrio').value = state.barrio;
    $('#btnCerca').setAttribute('aria-pressed', String(state.cerca));

    ponerTiles(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

    // datos de actualización
    if (DATA.actualizado) {
      const [y, m, d] = DATA.actualizado.split('-');
      $('#actualizado').textContent = 'Actualizado ' + d + '/' + m + '/' + y;
    }

    // buscador
    let t = null;
    $('#q').addEventListener('input', (e) => {
      clearTimeout(t);
      t = setTimeout(() => { state.q = e.target.value; render(); }, 160);
    });

    // selects
    $('#dur').addEventListener('change', e => { state.dur = e.target.value; render(); });
    $('#turno').addEventListener('change', e => { state.turno = e.target.value; render(); });
    $('#modalidad').addEventListener('change', e => { state.modalidad = e.target.value; render(); });
    $('#barrio').addEventListener('change', e => { state.barrio = e.target.value; render(); });
    $('#sinDato').addEventListener('change', e => { state.sinDato = e.target.checked; render(); });

    // botones
    $('#btnLimpiar').addEventListener('click', limpiar);
    $('#btnResetVacio').addEventListener('click', limpiar);
    $('#btnLista').addEventListener('click', () => toggleLista());
    $('#btnCerrarLista').addEventListener('click', () => toggleLista(false));

    $('#btnFiltros').addEventListener('click', (e) => {
      const abierto = document.querySelector('.filters').classList.toggle('filters--abiertos');
      e.currentTarget.setAttribute('aria-expanded', String(abierto));
    });

    $('#btnCerca').addEventListener('click', () => {
      if (state.cerca) {
        state.cerca = false;
        $('#btnCerca').setAttribute('aria-pressed', 'false');
        if (userMarker) { map.removeLayer(userMarker); userMarker = null; }
        render();
        return;
      }
      if (!navigator.geolocation) { alert('Tu navegador no permite geolocalización.'); return; }
      $('#btnCerca').setAttribute('aria-pressed', 'true');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          state.cerca = true;
          if (userMarker) map.removeLayer(userMarker);
          userMarker = L.circleMarker([userPos.lat, userPos.lng], {
            radius: 6, color: '#fff', weight: 2, fillColor: '#2563eb', fillOpacity: 1
          }).addTo(map).bindTooltip('Estás acá');
          render();
        },
        () => {
          state.cerca = false;
          $('#btnCerca').setAttribute('aria-pressed', 'false');
          alert('No pudimos obtener tu ubicación. Podés buscar por barrio.');
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });

    // tema
    $('#btnTema').addEventListener('click', () => {
      const actual = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      aplicarTema(actual === 'dark' ? 'light' : 'dark');
    });
    const guardado = localStorage.getItem('ifts-mapa-tema');
    if (guardado === 'dark') document.documentElement.dataset.theme = 'dark';

    // teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { toggleLista(false); }
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault(); $('#q').focus();
      }
    });

    render();

    // encuadre inicial: toda la ciudad con todos los pines
    const todas = L.latLngBounds(sedes.map(s => [s.lat, s.lng]));
    map.fitBounds(todas, { padding: [48, 48], maxZoom: 13 });

    // si cambia el tamaño de la ventana (o gira el teléfono), reencuadrar
    let tResize = null;
    window.addEventListener('resize', () => {
      clearTimeout(tResize);
      tResize = setTimeout(() => {
        map.invalidateSize();
        const conFiltros = !!(state.q || state.area || state.dur || state.turno || state.modalidad || state.barrio || state.cerca);
        if (!conFiltros) map.fitBounds(todas, { padding: [40, 40], maxZoom: 13 });
      }, 180);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
