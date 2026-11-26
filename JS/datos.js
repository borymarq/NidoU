export const SERVICIOS = ['Internet', 'Agua', 'Luz', 'Cocina', 'Lavandería', 'Seguridad', 'Parqueo', 'Aire acondicionado', 'Otro'];
export const UNIDADES = [
  { id: 'A1', vivienda: 'A', nombre: 'Habitación A1', modalidad: 'habitacion', precio: 235, capacidad: 1, habitaciones: 1, servicios: ['Internet', 'Lavandería'], reglas: ['Sin mascotas'], calificacion: 4.5, zona: 'Zona ficticia Norte', ruta: true },
  { id: 'A2', vivienda: 'A', nombre: 'Habitación A2', modalidad: 'habitacion', precio: 250, capacidad: 1, habitaciones: 1, servicios: ['Internet', 'Lavandería'], reglas: ['Sin mascotas'], calificacion: 4.5, zona: 'Zona ficticia Norte', ruta: true },
  { id: 'A', vivienda: 'A', nombre: 'Vivienda completa A', modalidad: 'completa', precio: 470, capacidad: 3, habitaciones: 2, servicios: ['Internet', 'Lavandería'], reglas: ['Sin mascotas'], calificacion: 4.5, zona: 'Zona ficticia Norte', ruta: true },
  { id: 'B', vivienda: 'B', nombre: 'Vivienda completa B', modalidad: 'completa', precio: 680, capacidad: 4, habitaciones: 3, servicios: ['Internet'], reglas: ['Se admiten mascotas'], calificacion: null, zona: 'Zona ficticia Sur', ruta: false }
];
export const FECHAS = { inicio: '2027-04-01', fin: '2027-08-31' };
export const ACTORES = { visitante: 'Visitante', arrendatario: 'Arrendatario', arrendador: 'Arrendador', principal: 'Arrendatario principal', candidato: 'Candidato a compañero', soporte: 'Atención al cliente' };
export const nombres = { A: 'Vivienda A', B: 'Vivienda B', A1: 'Habitación A1', A2: 'Habitación A2' };
export const dinero = n => `$${Number(n || 0).toFixed(0)}`;
export const fecha = s => s ? new Date(`${s}T12:00:00`).toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
