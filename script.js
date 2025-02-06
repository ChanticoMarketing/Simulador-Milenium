// script.js

document.addEventListener('DOMContentLoaded', function () {
  // Cacheamos referencias a elementos del DOM
  const creditForm = document.getElementById("creditForm");
  const desarrolloSelect = document.getElementById("desarrollo");
  const modeloSelect = document.getElementById("modelo");
  const mesSelect = document.getElementById("mes");
  const bancoSelect = document.getElementById("banco");
  const plazoInput = document.getElementById("plazo");
  const pagoInicialInput = document.getElementById("pagoInicial");
  const errorDiv = document.getElementById("error");
  const resultadosDiv = document.getElementById("resultados");
  const amortizationTableDiv = document.getElementById("amortizationTable");
  const extrasDiv = document.getElementById("extras");
  const simulacionCompletaDiv = document.getElementById("simulacionCompleta");
  const amortizationSection = document.getElementById("amortizationSection");

  // Variables para las instancias de Chart.js
  let capitalChartInstance = null;
  let pagoAnualChartInstance = null;

  // Datos de desarrollos, modelos y precios
  const desarrollos = {
    "Vista California": {
      "Ventura PA": { "Feb-25": 750000, "Mar-25": 775000 },
      "Ventura PB": { "Feb-25": 870000, "Mar-25": 890000 },
      "Cambria": { "Feb-25": 1300000, "Mar-25": 1320000 },
      "Catalina": { "Feb-25": 1580000, "Mar-25": 1600000 }
    },
    "Alta California": {
      "Santa Clara": { "Feb-25": 1650000, "Mar-25": 1700000 },
      "Santa Lucia": { "Feb-25": 1950000, "Mar-25": 2000000 },
      "Santa Barbara": { "Feb-25": 2500000, "Mar-25": 2600000 }
    },
    "Bosques California": {
      "Roble": { "Feb-25": 4850000, "Mar-25": 4900000 },
      "Secuoya": { "Feb-25": 5925000, "Mar-25": 6050000 }
    }
  };

  // Datos de bancos y sus tasas de interés (valores numéricos sin '%')
  const bancos = {
    "Banco A": {
      "Tasa 10 años": 8.5,
      "Tasa 15 años": 9.0,
      "Tasa 20 años": 9.5
    },
    "Banco B": {
      "Tasa 10 años": 9.2,
      "Tasa 15 años": 9.7,
      "Tasa 20 años": 10.1
    },
    "Banco C": {
      "Tasa 10 años": 7.8,
      "Tasa 15 años": 8.3,
      "Tasa 20 años": 8.9
    }
  };

  // Función para formatear números como moneda
  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0
    }).format(value);
  }

  // Actualiza el selector de modelos según el desarrollo seleccionado
  desarrolloSelect.addEventListener("change", function () {
    const desarrolloSeleccionado = this.value;
    modeloSelect.innerHTML = '<option value="">-- Seleccione Modelo --</option>';
    if (desarrolloSeleccionado && desarrollos[desarrolloSeleccionado]) {
      Object.keys(desarrollos[desarrolloSeleccionado]).forEach(modelo => {
        const option = document.createElement("option");
        option.value = modelo;
        option.textContent = modelo;
        modeloSelect.appendChild(option);
      });
    }
  });

  // Función para generar la tabla de amortización (por año)
  function generarTablaAmortizacion(schedule) {
    let tableHTML = `<table>
      <thead>
        <tr>
          <th>Año</th>
          <th>Pago anual</th>
          <th>Interés</th>
          <th>Amortización</th>
          <th>Saldo</th>
        </tr>
      </thead>
      <tbody>`;
    schedule.forEach(row => {
      tableHTML += `<tr>
        <td>${row.year}</td>
        <td>${formatCurrency(row.annualPayment)}</td>
        <td>${formatCurrency(row.interest)}</td>
        <td>${formatCurrency(row.principal)}</td>
        <td>${formatCurrency(row.balance)}</td>
      </tr>`;
    });
    tableHTML += `</tbody></table>`;
    amortizationTableDiv.innerHTML = tableHTML;
  }

  // Función para generar las gráficas; destruye instancias previas si existen
  function generarGraficas(schedule) {
    const chartLabels = schedule.map(row => row.year + " años");
    const chartCapital = schedule.map(row => row.balance);
    const chartPagoAnual = schedule.map(row => row.annualPayment);

    // Destruir instancias anteriores si existen
    if (capitalChartInstance) {
      capitalChartInstance.destroy();
    }
    if (pagoAnualChartInstance) {
      pagoAnualChartInstance.destroy();
    }

    const ctxCapital = document.getElementById('capitalChart').getContext('2d');
    capitalChartInstance = new Chart(ctxCapital, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Capital Restante',
          data: chartCapital,
          backgroundColor: 'rgba(52,152,219,0.2)',
          borderColor: 'rgba(52,152,219,1)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return formatCurrency(value);
              }
            }
          }
        }
      }
    });

    const ctxPago = document.getElementById('pagoAnualChart').getContext('2d');
    pagoAnualChartInstance = new Chart(ctxPago, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Pago Anual',
          data: chartPagoAnual,
          backgroundColor: 'rgba(46,204,113,0.2)',
          borderColor: 'rgba(46,204,113,1)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return formatCurrency(value);
              }
            }
          }
        }
      }
    });
  }

  // Manejo del envío del formulario
  creditForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Limpiar mensajes y secciones de resultados
    errorDiv.textContent = "";
    errorDiv.style.display = "none";
    resultadosDiv.innerHTML = "";
    amortizationTableDiv.innerHTML = "";
    extrasDiv.style.display = "none";
    amortizationSection.style.display = "none";
    simulacionCompletaDiv.style.display = "none";

    // Captura de valores
    const desarrollo = desarrolloSelect.value;
    const modelo = modeloSelect.value;
    const mes = mesSelect.value;
    const banco = bancoSelect.value;
    const plazo = parseInt(plazoInput.value); // plazo en años
    const pagoInicial = parseFloat(pagoInicialInput.value);

    // Validaciones básicas
    if (!desarrollo || !modelo || !mes || !banco || !plazo || isNaN(pagoInicial)) {
      errorDiv.textContent = "Por favor, complete todos los campos.";
      errorDiv.style.display = "block";
      return;
    }

    // Obtener precio de la vivienda
    const precioVivienda = desarrollos[desarrollo][modelo][mes];

    // Validación: El pago inicial no debe superar el precio de la vivienda
    if (pagoInicial > precioVivienda) {
      errorDiv.textContent = "El pago inicial no puede superar el precio de la vivienda.";
      errorDiv.style.display = "block";
      return;
    }

    // Calcular el monto a financiar
    const montoCredito = precioVivienda - pagoInicial;

    // Determinar la tasa anual (interpolación si es necesario)
    let tasaAnual;
    if (plazo <= 10) {
      tasaAnual = bancos[banco]["Tasa 10 años"];
    } else if (plazo >= 20) {
      tasaAnual = bancos[banco]["Tasa 20 años"];
    } else if (plazo > 10 && plazo < 15) {
      const rate10 = bancos[banco]["Tasa 10 años"];
      const rate15 = bancos[banco]["Tasa 15 años"];
      tasaAnual = rate10 + ((rate15 - rate10) * ((plazo - 10) / 5));
    } else if (plazo >= 15 && plazo < 20) {
      const rate15 = bancos[banco]["Tasa 15 años"];
      const rate20 = bancos[banco]["Tasa 20 años"];
      tasaAnual = rate15 + ((rate20 - rate15) * ((plazo - 15) / 5));
    }
    const r = tasaAnual / 100; // tasa anual en decimal

    // Cálculo del pago anual (sin seguro) usando fórmula de anualidad
    const annualPayment = (montoCredito * r) / (1 - Math.pow(1 + r, -plazo));
    const seguroAnual = montoCredito * 0.005; // seguro anual (0.5%)
    const totalAnnualPayment = annualPayment + seguroAnual;
    const totalAPagar = totalAnnualPayment * plazo;
    const interesesTotales = (annualPayment * plazo) - montoCredito;
    const comision = montoCredito * 0.01; // comisión del 1%
    const catAproximado = tasaAnual + 1.5; // aproximación del CAT

    // Mostrar resultados generales
    resultadosDiv.innerHTML = `
      <h2>Resultados de la Simulación</h2>
      <div class="result-item"><span>Precio de la vivienda:</span><span>${formatCurrency(precioVivienda)}</span></div>
      <div class="result-item"><span>Monto a financiar:</span><span>${formatCurrency(montoCredito)}</span></div>
      <div class="result-item"><span>Pago anual estimado (sin seguro):</span><span>${formatCurrency(annualPayment)}</span></div>
      <div class="result-item"><span>Seguro anual:</span><span>${formatCurrency(seguroAnual)}</span></div>
      <div class="result-item"><span>Total a pagar por año:</span><span>${formatCurrency(totalAnnualPayment)}</span></div>
      <div class="result-item"><span>Total a pagar al final:</span><span>${formatCurrency(totalAPagar)}</span></div>
      <div class="result-item"><span>Intereses totales:</span><span>${formatCurrency(interesesTotales)}</span></div>
      <div class="result-item"><span>Comisión por apertura:</span><span>${formatCurrency(comision)}</span></div>
      <div class="result-item"><span>CAT aplicado:</span><span>${catAproximado.toFixed(2)}%</span></div>
    `;

    // Generar la tabla de amortización y calcular la evolución anual
    let schedule = [];
    let balance = montoCredito;
    for (let year = 1; year <= plazo; year++) {
      let interestPayment = balance * r;
      let principalPayment = annualPayment - interestPayment;
      if (year === plazo && balance < annualPayment) {
        principalPayment = balance;
      }
      balance = balance - principalPayment;
      if (balance < 0) balance = 0;
      schedule.push({
        year: year,
        annualPayment: annualPayment,
        interest: interestPayment,
        principal: principalPayment,
        balance: balance
      });
    }
    generarTablaAmortizacion(schedule);
    generarGraficas(schedule);

    // Mostrar la sección completa de la simulación (resultados y amortización) para el PDF
    simulacionCompletaDiv.style.display = "block";
    amortizationSection.style.display = "block";
    extrasDiv.style.display = "flex";
  });

  // Funcionalidad para descargar el PDF que capture la simulación completa
  document.getElementById("descargarPDF").addEventListener("click", function () {
    html2canvas(document.getElementById("simulacionCompleta")).then(function (canvas) {
      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // Ancho A4 en mm
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      // Nota: Si el contenido es muy extenso, habría que dividirlo en varias páginas.
      pdf.save("simulacion.pdf");
    });
  });
});
