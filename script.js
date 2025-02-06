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
  const tasaInfo = document.getElementById("tasaInfo");
  const limpiarSimulacionBtn = document.getElementById("limpiarSimulacion");

  // Variables para instancias de Chart.js
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

  /* Información de bancos:
     - INFONAVIT: 8.00%
     - FOVISSSTE: 9.55%
     - BBVA: 8.85%
     - Scotiabank: 9.50%
     - HSBC: 11.40%
  */
  const tasasBancos = {
    "INFONAVIT": "8.00%",
    "FOVISSSTE": "9.55%",
    "BBVA": "8.85%",
    "Scotiabank": "9.50%",
    "HSBC": "11.40%"
  };
  const bancos = {
    "INFONAVIT": 8.00,
    "FOVISSSTE": 9.55,
    "BBVA": 8.85,
    "Scotiabank": 9.50,
    "HSBC": 11.40
  };

  // Actualiza la información de la tasa al cambiar la selección del banco
  bancoSelect.addEventListener("change", function () {
    const banco = this.value;
    if (tasasBancos[banco]) {
      tasaInfo.textContent = "Tasa de interés: " + tasasBancos[banco];
    } else {
      tasaInfo.textContent = "";
    }
  });

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
    let tableHTML = `<table id="amortTable">
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

    // Limpiar mensajes y secciones
    errorDiv.textContent = "";
    errorDiv.style.display = "none";
    resultadosDiv.innerHTML = "";
    amortizationTableDiv.innerHTML = "";
    extrasDiv.style.display = "none";
    amortizationSection.style.display = "none";
    simulacionCompletaDiv.style.display = "none";

    // Capturar valores
    const desarrollo = desarrolloSelect.value;
    const modelo = modeloSelect.value;
    const mes = mesSelect.value;
    const banco = bancoSelect.value;
    const plazo = parseInt(plazoInput.value);
    const pagoInicial = parseFloat(pagoInicialInput.value);

    // Validaciones
    if (!desarrollo || !modelo || !mes || !banco || !plazo || isNaN(pagoInicial)) {
      errorDiv.textContent = "Por favor, complete todos los campos.";
      errorDiv.style.display = "block";
      return;
    }
    const precioVivienda = desarrollos[desarrollo][modelo][mes];
    if (pagoInicial > precioVivienda) {
      errorDiv.textContent = "El pago inicial no puede superar el precio de la vivienda.";
      errorDiv.style.display = "block";
      return;
    }

    // Calcular valores
    const montoCredito = precioVivienda - pagoInicial;
    const tasaAnual = bancos[banco];
    const r = tasaAnual / 100;
    const annualPayment = (montoCredito * r) / (1 - Math.pow(1 + r, -plazo));
    const seguroAnual = montoCredito * 0.005;
    const totalAnnualPayment = annualPayment + seguroAnual;
    const totalAPagar = totalAnnualPayment * plazo;
    const interesesTotales = (annualPayment * plazo) - montoCredito;
    const comision = montoCredito * 0.01;
    const catAproximado = tasaAnual + 1.5;

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

    // Mostrar la simulación completa para incluir en el PDF
    simulacionCompletaDiv.style.display = "block";
    amortizationSection.style.display = "block";
    extrasDiv.style.display = "flex";
  });

  // Botón para limpiar la simulación
  limpiarSimulacionBtn.addEventListener("click", function () {
    creditForm.reset();
    resultadosDiv.innerHTML = "";
    amortizationTableDiv.innerHTML = "";
    simulacionCompletaDiv.style.display = "none";
    amortizationSection.style.display = "none";
    extrasDiv.style.display = "none";
    tasaInfo.textContent = "";
  });

  // Funcionalidad para descargar el PDF usando jsPDF, autoTable y agregando las gráficas
  document.getElementById("descargarPDF").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    let yPos = 10;

    // Obtener el desarrollo seleccionado para el título
    const desarrolloSeleccionado = desarrolloSelect.value || "Simulación";
    doc.setFontSize(16);
    doc.text(`Simulador de ${desarrolloSeleccionado}`, 14, yPos);
    yPos += 8;

    // Extraer datos de los resultados
    const resultItems = resultadosDiv.querySelectorAll(".result-item");
    let resultsBody = [];
    resultItems.forEach(item => {
      const cells = item.querySelectorAll("span");
      resultsBody.push([cells[0].innerText.replace(":", ""), cells[1].innerText]);
    });
    doc.autoTable({
      startY: yPos,
      head: [["Concepto", "Valor"]],
      body: resultsBody,
      styles: { fontSize: 12 },
      headStyles: { fillColor: [52, 152, 219] }
    });
    yPos = doc.lastAutoTable.finalY + 8;

    // Insertar tabla de amortización a partir del HTML generado
    doc.text("Tabla de Amortización (por año)", 14, yPos);
    yPos += 5;
    doc.autoTable({
      html: '#amortTable',
      startY: yPos,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [44, 62, 80] }
    });
    yPos = doc.lastAutoTable.finalY + 8;

    // Agregar las gráficas:
    // Gráfica de Capital Restante
    const capitalCanvas = document.getElementById("capitalChart");
    const capitalImgData = capitalCanvas.toDataURL("image/png");
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;
    const capitalImgWidth = pageWidth - 2 * margin;
    const capitalImgHeight = capitalCanvas.height * capitalImgWidth / capitalCanvas.width;
    if (yPos + capitalImgHeight > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
    doc.text("Gráfica de Capital Restante", 14, yPos);
    yPos += 5;
    doc.addImage(capitalImgData, 'PNG', margin, yPos, capitalImgWidth, capitalImgHeight);
    yPos += capitalImgHeight + 8;

    // Gráfica de Pago Anual
    const pagoCanvas = document.getElementById("pagoAnualChart");
    const pagoImgData = pagoCanvas.toDataURL("image/png");
    const pagoImgWidth = pageWidth - 2 * margin;
    const pagoImgHeight = pagoCanvas.height * pagoImgWidth / pagoCanvas.width;
    if (yPos + pagoImgHeight > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
    doc.text("Gráfica de Pago Anual", 14, yPos);
    yPos += 5;
    doc.addImage(pagoImgData, 'PNG', margin, yPos, pagoImgWidth, pagoImgHeight);

    doc.save("simulacion.pdf");
  });
});
