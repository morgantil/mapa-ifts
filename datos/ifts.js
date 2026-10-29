/* =========================================================================
   Datos del mapa de IFTS — Ciudad de Buenos Aires (ciclo 2026)
   ---------------------------------------------------------------------
   FUENTE PRINCIPAL: catálogo oficial 2026 de la Agencia de Habilidades para
   el Futuro (formacionesagencia.bue.edu.ar), que publica por carrera la
   duración, la modalidad y el horario. Se cruzó con el campus virtual
   oficial (aulasvirtuales.bue.edu.ar, categorías "2026_IFTS NN") y con el
   sitio de cada instituto.
   Coordenadas: geocodificadas sobre OpenStreetMap (Nominatim).
   El sitio del GCBA estaba en mantenimiento durante el relevamiento
   (29/10/2026).
   Regla: si un dato no está publicado, va null y la interfaz muestra
   "sin datos". No se completa a ojo.
   ========================================================================= */
window.IFTS_DATA = {
  actualizado: '2026-10-29',

  areas: [
    { id: 'tic', nombre: 'Informática y tecnología', color: '#06b6d4' },
    { id: 'gestion', nombre: 'Gestión y administración', color: '#6366f1' },
    { id: 'salud', nombre: 'Salud', color: '#ef4444' },
    { id: 'turismo', nombre: 'Turismo, hotelería y gastronomía', color: '#f59e0b' },
    { id: 'comunicacion', nombre: 'Comunicación y audiovisual', color: '#a855f7' },
    { id: 'social', nombre: 'Social y humanidades', color: '#10b981' },
    { id: 'energia', nombre: 'Energía e industria', color: '#64748b' }
  ],

  carreras: [
    { id: 'analisis-de-sistemas', nombre: 'Tecnicatura Superior en Análisis de Sistemas', area: 'tic' },
    { id: 'desarrollo-de-software', nombre: 'Tecnicatura Superior en Desarrollo de Software', area: 'tic' },
    { id: 'ciencia-de-datos-ia', nombre: 'Tecnicatura Superior en Ciencia de Datos e Inteligencia Artificial', area: 'tic' },
    { id: 'redes-ciberseguridad', nombre: 'Tecnicatura Superior en Redes y Ciberseguridad', area: 'tic' },
    { id: 'telecomunicaciones', nombre: 'Tecnicatura Superior en Telecomunicaciones y Seguridad Electrónica', area: 'tic' },

    { id: 'administracion', nombre: 'Tecnicatura Superior en Administración', area: 'gestion' },
    { id: 'administracion-financiera', nombre: 'Tecnicatura Superior en Administración Financiera', area: 'gestion' },
    { id: 'administracion-publica', nombre: 'Tecnicatura Superior en Administración Pública', area: 'gestion' },
    { id: 'recursos-humanos', nombre: 'Tecnicatura Superior en Recursos Humanos', area: 'gestion' },
    { id: 'comercializacion', nombre: 'Tecnicatura Superior en Comercialización', area: 'gestion' },
    { id: 'comercio-internacional', nombre: 'Tecnicatura Superior en Comercio Internacional', area: 'gestion' },
    { id: 'relaciones-del-trabajo', nombre: 'Tecnicatura Superior en Relaciones del Trabajo', area: 'gestion' },
    { id: 'gestion-parlamentaria', nombre: 'Tecnicatura Superior en Gestión Parlamentaria', area: 'gestion' },
    { id: 'seguros', nombre: 'Tecnicatura Superior en Seguros', area: 'gestion' },

    { id: 'higiene-y-seguridad', nombre: 'Tecnicatura Superior en Higiene y Seguridad en el Trabajo', area: 'salud' },
    { id: 'administracion-servicios-salud', nombre: 'Tecnicatura Superior en Administración de Servicios de Salud', area: 'salud' },

    { id: 'bibliotecologia', nombre: 'Tecnicatura Superior en Bibliotecología', area: 'social' },
    { id: 'politicas-culturales', nombre: 'Tecnicatura Superior en Administración y Gestión de Políticas Culturales', area: 'social' },

    { id: 'gestion-turistica', nombre: 'Tecnicatura Superior en Gestión Turística', area: 'turismo' },
    { id: 'guia-de-turismo', nombre: 'Tecnicatura Superior en Guía de Turismo', area: 'turismo' },
    { id: 'administracion-hotelera', nombre: 'Tecnicatura Superior en Administración Hotelera', area: 'turismo' },
    { id: 'emprendimientos-gastronomicos', nombre: 'Tecnicatura Superior en Emprendimientos Gastronómicos', area: 'turismo' },

    { id: 'realizacion-audiovisual', nombre: 'Tecnicatura Superior en Realización Audiovisual', area: 'comunicacion' },

    { id: 'distribucion-energia', nombre: 'Tecnicatura Superior en Distribución de la Energía Eléctrica', area: 'energia' },
    { id: 'energias-renovables', nombre: 'Tecnicatura Superior en Gestión de Energías Renovables', area: 'energia' },
    { id: 'gestion-ambiental', nombre: 'Tecnicatura Superior en Gestión Ambiental', area: 'energia' }
  ],

  sedes: [
    {
      id: 'ifts-1', numero: 1, comparteCon: [],
      direccion: 'San Martín 665', piso: '4° piso',
      barrio: 'San Nicolás', comuna: 1,
      lat: -34.600225, lng: -58.3738201,
      sitio: '',
      carreras: [{ id: 'seguros', duracion: 3, turnos: ['mañana', 'noche'], modalidad: ['hibrida'] }]
    },
    {
      id: 'ifts-2', numero: 2, comparteCon: [],
      direccion: 'Cañada de Gómez 3850',
      barrio: 'Villa Lugano', comuna: 8,
      lat: -34.6760497, lng: -58.4863879,
      sitio: '',
      carreras: [{ id: 'emprendimientos-gastronomicos', duracion: 3, turnos: ['noche'], modalidad: ['hibrida'] }]
    },
    {
      id: 'ifts-4', numero: 4, comparteCon: [],
      direccion: 'Murguiondo 2105',
      barrio: 'Mataderos', comuna: 9,
      lat: -34.6589004, lng: -58.499731,
      sitio: 'https://ifts4.edu.ar',
      carreras: [
        { id: 'analisis-de-sistemas', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'desarrollo-de-software', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] }
      ]
    },
    {
      id: 'ifts-7', numero: 7, comparteCon: [],
      direccion: 'Av. Gaona 1502',
      barrio: 'Caballito', comuna: 6,
      lat: -34.6099734, lng: -58.4500322,
      sitio: 'https://www.ifts7.com.ar',
      carreras: [
        { id: 'administracion', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'administracion-servicios-salud', duracion: 3, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'guia-de-turismo', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'recursos-humanos', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] }
      ]
    },
    {
      id: 'ifts-9', numero: 9, comparteCon: [],
      direccion: 'Rodríguez Peña 747',
      barrio: 'San Nicolás', comuna: 1,
      lat: -34.6003911, lng: -58.3912858,
      sitio: 'https://www.ifts9.com.ar',
      carreras: [
        { id: 'administracion', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'administracion-financiera', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'analisis-de-sistemas', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'comercializacion', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'comercio-internacional', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'relaciones-del-trabajo', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] }
      ]
    },
    {
      id: 'ifts-11', numero: 11, comparteCon: [],
      direccion: 'Zavaleta 204',
      barrio: 'Parque Patricios', comuna: 4,
      lat: -34.6391, lng: -58.4098,
      sitio: 'https://ifts11.edu.ar',
      carreras: [
        { id: 'analisis-de-sistemas', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'ciencia-de-datos-ia', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'desarrollo-de-software', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] }
      ]
    },
    {
      id: 'ifts-12', numero: 12, comparteCon: [],
      direccion: 'Av. Belgrano 637',
      barrio: 'Monserrat', comuna: 1,
      lat: -34.6125354, lng: -58.3753416,
      sitio: 'https://ifts12online.com.ar',
      carreras: [
        { id: 'administracion-publica', duracion: 3, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'analisis-de-sistemas', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'ciencia-de-datos-ia', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'gestion-parlamentaria', duracion: 3, turnos: ['mañana'], modalidad: ['hibrida'] },
        { id: 'politicas-culturales', duracion: 3, turnos: ['noche'], modalidad: ['hibrida'] }
      ]
    },
    {
      id: 'ifts-13', numero: 13, comparteCon: [],
      direccion: 'Av. Juan Bautista Alberdi 163',
      barrio: 'Caballito', comuna: 6,
      lat: -34.6223236, lng: -58.4302351,
      sitio: 'https://ifts13.blog',
      carreras: [{ id: 'bibliotecologia', duracion: 3, turnos: ['noche'], modalidad: ['hibrida'] }]
    },
    {
      id: 'ifts-15', numero: 15, comparteCon: [],
      direccion: 'Loyola 1500',
      barrio: 'Villa Crespo', comuna: 15,
      lat: -34.5961751, lng: -58.4353225,
      sitio: '',
      carreras: [{ id: 'realizacion-audiovisual', duracion: 3, turnos: ['noche'], modalidad: ['hibrida'] }]
    },
    {
      id: 'ifts-16', numero: 16, comparteCon: [],
      direccion: 'Teodoro García 3899',
      barrio: 'Chacarita', comuna: 15,
      lat: -34.5833322, lng: -58.4547564,
      sitio: 'https://ifts16.com',
      carreras: [
        { id: 'analisis-de-sistemas', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'desarrollo-de-software', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] }
      ]
    },
    {
      id: 'ifts-18', numero: 18, comparteCon: [],
      direccion: 'Gral. Lucio N. Mansilla 3643',
      barrio: 'Palermo', comuna: 14,
      lat: -34.5906965, lng: -58.4148772,
      sitio: 'https://www.ifts18.edu.ar',
      carreras: [
        { id: 'analisis-de-sistemas', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'ciencia-de-datos-ia', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'desarrollo-de-software', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] }
      ]
    },
    {
      id: 'ifts-19', numero: 19, comparteCon: [],
      direccion: 'Catamarca 143',
      barrio: 'Balvanera', comuna: 3,
      lat: -34.6118672, lng: -58.4072679,
      sitio: 'https://ifts19.edu.ar',
      carreras: [
        { id: 'analisis-de-sistemas', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'higiene-y-seguridad', duracion: 3, turnos: ['noche'], modalidad: ['hibrida'] }
      ]
    },
    {
      id: 'ifts-20', numero: 20, comparteCon: [],
      direccion: 'Gurruchaga 739',
      barrio: 'Villa Crespo', comuna: 15,
      lat: -34.5954669, lng: -58.4385844,
      sitio: '',
      carreras: [
        { id: 'administracion', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'administracion-hotelera', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'gestion-turistica', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'guia-de-turismo', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'recursos-humanos', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] }
      ]
    },
    {
      id: 'ifts-21', numero: 21, comparteCon: [],
      direccion: 'Pasaje Carlos Spegazzini 450',
      barrio: 'Almagro', comuna: 5,
      lat: -34.6186669, lng: -58.4263231,
      sitio: 'http://ifts21.edu.ar',
      carreras: [
        { id: 'administracion-publica', duracion: 3, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'analisis-de-sistemas', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] }
      ]
    },
    {
      id: 'ifts-22', numero: 22, comparteCon: [],
      direccion: 'Av. Santa Fe 3727',
      barrio: 'Palermo', comuna: 14,
      lat: -34.5848924, lng: -58.4160987,
      sitio: '',
      carreras: [{ id: 'gestion-ambiental', duracion: 3, turnos: ['noche'], modalidad: ['hibrida'] }]
    },
    {
      id: 'ifts-24', numero: 24, comparteCon: [],
      direccion: 'Av. Entre Ríos 757',
      barrio: 'Balvanera', comuna: 3,
      lat: -34.6175174, lng: -58.3919281,
      sitio: 'https://www.ifts24.edu.ar',
      carreras: [
        { id: 'ciencia-de-datos-ia', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'desarrollo-de-software', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'redes-ciberseguridad', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'telecomunicaciones', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] }
      ]
    },
    {
      id: 'ifts-30', numero: 30, comparteCon: [],
      direccion: 'Hortiguera 420',
      barrio: 'Caballito', comuna: 6,
      lat: -34.6274771, lng: -58.445278,
      sitio: '',
      nota: 'En 2026 no dicta tecnicaturas: ofrece dos Trayectos de Formación Profesional de 1 año (Facilitador Tecnológico Digital y Facilitador de Proyectos Digitales y Audiovisuales).',
      carreras: []
    },
    {
      id: 'ifts-32', numero: 32, comparteCon: [],
      direccion: 'Humberto Primo 1573',
      barrio: 'San Telmo', comuna: 1,
      lat: -34.620541, lng: -58.3675998,
      sitio: '',
      carreras: [
        { id: 'distribucion-energia', duracion: 2.5, turnos: ['noche'], modalidad: ['hibrida'] },
        { id: 'energias-renovables', duracion: 1.5, turnos: ['noche'], modalidad: ['hibrida'] }
      ]
    }
  ]
};
