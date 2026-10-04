// ===================================================================
// Diario de Estudio - primera versión
// Guardamos las sesiones en localStorage y calculamos la racha.
// ===================================================================

// Nombre con el que guardamos los datos en el navegador.
const CLAVE = "diarioDeEstudio";

// -------------------------------------------------------------------
// Utilidades de fecha (siempre con la hora local del usuario)
// -------------------------------------------------------------------

// Convierte un objeto Date en un texto "YYYY-MM-DD" usando su fecha local.
function aClaveFecha(fecha) {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${año}-${mes}-${dia}`;
}

// Clave de fecha de hoy.
function claveDeHoy() {
  return aClaveFecha(new Date());
}

// -------------------------------------------------------------------
// Datos: leer y escribir en localStorage
// -------------------------------------------------------------------

let sesiones = cargarSesiones();

function cargarSesiones() {
  const datos = localStorage.getItem(CLAVE);
  if (!datos) return [];

  try {
    const lista = JSON.parse(datos);
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    // Si los datos están dañados, empezamos de cero.
    return [];
  }
}

function guardarSesiones() {
  localStorage.setItem(CLAVE, JSON.stringify(sesiones));
}

// -------------------------------------------------------------------
// Racha
// -------------------------------------------------------------------

// Cuenta los días consecutivos con sesión que terminan en hoy.
// Si hoy aún no hay sesión pero ayer sí, la racha sigue viva.
function calcularRacha() {
  if (sesiones.length === 0) return 0;

  // Días (sin repetir) en los que hay al menos una sesión.
  const diasConSesion = new Set(sesiones.map((sesion) => sesion.fecha));

  // Miramos desde qué día empezar a contar, hacia atrás.
  const cursor = new Date();

  if (!diasConSesion.has(aClaveFecha(cursor))) {
    // Hoy no hay sesión: probamos con ayer.
    cursor.setDate(cursor.getDate() - 1);
    if (!diasConSesion.has(aClaveFecha(cursor))) {
      return 0;
    }
  }

  // Contamos mientras los días sean consecutivos.
  let racha = 0;
  while (diasConSesion.has(aClaveFecha(cursor))) {
    racha++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return racha;
}

// Dice si "siguiente" es el día justo después de "anterior".
// Usamos componentes locales (no new Date("AAAA-MM-DD")) para no desviarnos a UTC.
function esDiaSiguiente(anterior, siguiente) {
  const [año, mes, dia] = anterior.split("-").map(Number);
  const cursor = new Date(año, mes - 1, dia);
  cursor.setDate(cursor.getDate() + 1);
  return aClaveFecha(cursor) === siguiente;
}

// Cuenta la racha más larga conseguida nunca.
// Puede coincidir con la racha actual si esta es la mayor.
function calcularMejorRacha() {
  const hoy = claveDeHoy();

  // Días distintos con sesión, sin fechas futuras (las futuras no suman).
  const dias = [...new Set(sesiones.map((sesion) => sesion.fecha))]
    .filter((fecha) => fecha <= hoy)
    .sort(); // "AAAA-MM-DD" ordenado alfabéticamente ya queda en orden cronológico.

  let mejor = 0;
  let tramo = 0;
  let anterior = null;

  for (const dia of dias) {
    // Si es el día siguiente al anterior, el tramo sigue; si no, empieza otro.
    tramo = anterior !== null && esDiaSiguiente(anterior, dia) ? tramo + 1 : 1;
    if (tramo > mejor) mejor = tramo;
    anterior = dia;
  }

  return mejor;
}

// -------------------------------------------------------------------
// Minutos de esta semana
// -------------------------------------------------------------------

// Lunes de la semana actual (la semana empieza en lunes).
function claveDeInicioSemana() {
  const hoy = new Date();
  // getDay(): domingo = 0, lunes = 1... Pasamos a lunes = 0, domingo = 6.
  const diasDesdeLunes = (hoy.getDay() + 6) % 7;
  hoy.setDate(hoy.getDate() - diasDesdeLunes);
  return aClaveFecha(hoy);
}

// Suma los minutos de las sesiones desde el lunes hasta hoy.
// Las fechas futuras no suman, así que paramos en hoy.
function calcularMinutosSemana() {
  const inicio = claveDeInicioSemana();
  const fin = claveDeHoy();

  let total = 0;
  for (const sesion of sesiones) {
    if (sesion.fecha >= inicio && sesion.fecha <= fin) {
      total += Number(sesion.minutos) || 0;
    }
  }
  return total;
}

// Convierte minutos en un texto legible: "45 min", "150 min (2 h 30 min)".
function formatearMinutos(minutos) {
  if (minutos < 60) return `${minutos} min`;

  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  const parteHoras = resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
  return `${minutos} min (${parteHoras})`;
}

// -------------------------------------------------------------------
// Días de este mes
// -------------------------------------------------------------------

// Primer día del mes actual (siempre en fecha local).
function claveDeInicioMes() {
  const hoy = new Date();
  return aClaveFecha(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
}

// Cuenta los días distintos con al menos una sesión entre el día 1 y hoy.
// Usamos un Set para que varias sesiones el mismo día cuenten como uno.
function calcularDiasEstudiadosMes() {
  const inicio = claveDeInicioMes();
  const fin = claveDeHoy();

  const dias = new Set();
  for (const sesion of sesiones) {
    if (sesion.fecha >= inicio && sesion.fecha <= fin) {
      dias.add(sesion.fecha);
    }
  }
  return dias.size;
}

// -------------------------------------------------------------------
// Pintar la interfaz
// -------------------------------------------------------------------

function pintarRacha() {
  const racha = calcularRacha();
  document.getElementById("racha").textContent = racha;
  document.getElementById("racha-texto").textContent = racha === 1 ? "día" : "días";

  const mejor = calcularMejorRacha();
  document.getElementById("mejor-racha").textContent = mejor;
  document.getElementById("mejor-racha-texto").textContent = mejor === 1 ? "día" : "días";
}

function pintarSemana() {
  const total = calcularMinutosSemana();
  document.getElementById("minutos-semana").textContent = formatearMinutos(total);
}

function pintarMes() {
  const dias = calcularDiasEstudiadosMes();
  document.getElementById("dias-mes").textContent = dias === 1 ? "1 día" : `${dias} días`;
}

// Muestra una fecha "YYYY-MM-DD" como "30 de septiembre de 2026".
function formatearFecha(clave) {
  const [año, mes, dia] = clave.split("-").map(Number);
  const fecha = new Date(año, mes - 1, dia);
  return fecha.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function pintarLista() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  document.getElementById("mensaje-vacio").hidden = sesiones.length > 0;

  // Copiamos y ordenamos de la más reciente a la más antigua.
  const ordenadas = [...sesiones].sort((a, b) => b.fecha.localeCompare(a.fecha));

  for (const sesion of ordenadas) {
    const elemento = document.createElement("li");
    elemento.className = "sesion";

    const tema = document.createElement("p");
    tema.className = "sesion-tema";
    tema.textContent = sesion.tema;

    const detalles = document.createElement("p");
    detalles.className = "sesion-detalles";
    detalles.textContent = `${formatearFecha(sesion.fecha)} · ${sesion.minutos} min`;

    elemento.append(tema, detalles);
    lista.append(elemento);
  }
}

function pintarTodo() {
  pintarRacha();
  pintarSemana();
  pintarMes();
  pintarLista();
}

// -------------------------------------------------------------------
// Formulario
// -------------------------------------------------------------------

const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const fecha = document.getElementById("fecha").value;
  const tema = document.getElementById("tema").value.trim();
  const minutos = Number(document.getElementById("minutos").value);

  // Validación: tema obligatorio y minutos mayores que 0.
  if (!fecha || tema === "" || !(minutos > 0)) {
    alert("Revisa los datos: el tema es obligatorio y los minutos deben ser mayores que 0.");
    return;
  }

  // Guardamos la sesión al principio para que la más nueva quede arriba.
  sesiones.unshift({ fecha, tema, minutos });
  guardarSesiones();
  pintarTodo();

  // Limpiamos el formulario y volvemos a poner la fecha de hoy.
  evento.target.reset();
  document.getElementById("fecha").value = claveDeHoy();
});

// -------------------------------------------------------------------
// Arranque
// -------------------------------------------------------------------

// La fecha del formulario empieza en hoy, pero se puede cambiar.
document.getElementById("fecha").value = claveDeHoy();

pintarTodo();
