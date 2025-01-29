// Definición de los modelos y precios por desarrollo según el mes
const DEVELOPMENTS = {
  alta: [
    { name: "Santa Clara", prices: { 1: 1600000, 2: 1650000, 3: 1700000 } },
    { name: "Santa Lucía", prices: { 1: 1900000, 2: 1950000, 3: 2000000 } },
    { name: "Santa Bárbara", prices: { 1: 2450000, 2: 2500000, 3: 2600000 } },
  ],
  vista: [
    { name: "Ventura PA", prices: { 1: 725000, 2: 750000, 3: 775000 } },
    { name: "Ventura PB", prices: { 1: 855000, 2: 870000, 3: 890000 } },
    { name: "Cambria", prices: { 1: 1275000, 2: 1300000, 3: 1320000 } },
    { name: "Catalina", prices: { 1: 1560000, 2: 1580000, 3: 1600000 } },
  ],
  bosques: [
    { name: "Roble A", prices: { 1: 4750000, 2: 4850000, 3: 4900000 } },
    { name: "Roble B", prices: { 1: 4750000, 2: 4850000, 3: 4900000 } },
    { name: "Secuoya", prices: { 1: 5850000, 2: 5925000, 3: 6050000 } },
  ],
};

// Obtiene el mes actual
const currentMonth = new Date().getMonth() + 1; // Enero = 1, Febrero = 2, etc.

function handleDevelopmentChange() {
  const modelSelect = document.getElementById("modelSelect");
  const developmentSelect = document.getElementById("developmentSelect");

  modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';
  const selectedDev = developmentSelect.value;

  if (selectedDev) {
    modelSelect.disabled = false;
    DEVELOPMENTS[selectedDev].forEach((model) => {
      const option = document.createElement("option");
      option.value = JSON.stringify(model.prices);
      option.textContent = model.name;
      modelSelect.appendChild(option);
    });
  } else {
    modelSelect.disabled = true;
  }
}

function handleModelChange() {
  const modelSelect = document.getElementById("modelSelect");
  const propertyValueInput = document.getElementById("propertyValue");
  const modelPrices = JSON.parse(modelSelect.value);
  propertyValueInput.value = modelPrices[currentMonth] || modelPrices[1];
}

// Validación de campos
function validateFields() {
  const propertyValue = document.getElementById("propertyValue").value;
  const downPayment = document.getElementById("downPayment").value;
  const loanYears = document.getElementById("loanYears").value;
  const bankSelect = document.getElementById("bankSelect");
  const calcBtn = document.getElementById("calcBtn");

  if (propertyValue && downPayment && loanYears && bankSelect.value) {
    calcBtn.disabled = false;
  } else {
    calcBtn.disabled = true;
  }
}

// Cálculo del préstamo
function calculateLoan() {
  const propertyValue = parseFloat(document.getElementById("propertyValue").value);
  const downPayment = parseFloat(document.getElementById("downPayment").value);
  const loanYears = parseInt(document.getElementById("loanYears").value);
  const bankSelect = document.getElementById("bankSelect");
  const selectedOption = bankSelect.options[bankSelect.selectedIndex];
  const annualInterestRate = parseFloat(selectedOption.getAttribute("data-rate")) / 100;

  const loanAmount = propertyValue - downPayment;
  if (loanAmount <= 0) {
    alert("El pago inicial no puede ser mayor o igual al valor de la propiedad.");
    return;
  }

  const monthlyInterestRate = annualInterestRate / 12;
  const numberOfMonths = loanYears * 12;
  const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfMonths)) /
    (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);

  const totalPayment = monthlyPayment * numberOfMonths;

  document.getElementById("bankName").textContent = `Banco seleccionado: ${selectedOption.text}`;
  document.getElementById("interestRate").textContent = `Tasa de interés anual: ${(annualInterestRate * 100).toFixed(2)}%`;
  document.getElementById("loanAmount").textContent = `Monto del crédito: MXN $${loanAmount.toLocaleString("es-MX")}`;
  document.getElementById("monthlyPayment").textContent = `Pago mensual aprox.: MXN $${monthlyPayment.toFixed(2)}`;
  document.getElementById("totalPayment").textContent = `Pago total (aprox.): MXN $${totalPayment.toFixed(2)}`;
  document.getElementById("simulationDate").textContent = `Fecha de simulación: ${new Date().toLocaleDateString("es-MX")}`;

  document.getElementById("resultsSection").style.display = "block";

  amortizationData = generateAmortization(loanAmount, monthlyInterestRate, loanYears, monthlyPayment);
}

// Genera la tabla de amortización
function generateAmortization(principal, monthlyInterestRate, numYears, monthlyPayment) {
  const amortizationData = [];
  let balance = principal;

  for (let year = 1; year <= numYears; year++) {
    let interestPaidYearly = 0;
    let capitalPaidYearly = 0;

    for (let month = 1; month <= 12; month++) {
      if (balance <= 0) break;

      const interestPaid = balance * monthlyInterestRate;
      const capitalPaid = monthlyPayment - interestPaid;
      balance -= capitalPaid;

      interestPaidYearly += interestPaid;
      capitalPaidYearly += capitalPaid;

      if (balance < 0) balance = 0;
    }

    amortizationData.push({
      year: year,
      annualPayment: (monthlyPayment * 12).toFixed(2),
      interestPaid: interestPaidYearly.toFixed(2),
      capitalPaid: capitalPaidYearly.toFixed(2),
      remainingBalance: balance.toFixed(2),
    });

    if (balance === 0) break;
  }

  return amortizationData;
}

// Muestra la tabla de amortización
function fillAmortizationTable() {
  const tableBody = document.querySelector("#amortizationTable tbody");
  tableBody.innerHTML = "";

  amortizationData.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.year}</td>
      <td>${row.annualPayment}</td>
      <td>${row.interestPaid}</td>
      <td>${row.capitalPaid}</td>
      <td>${row.remainingBalance}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Genera el PDF con la tabla de amortización
function generatePDF() {
  const doc = new jsPDF('p', 'pt', 'letter');
  doc.setFontSize(14);
  doc.text("Reporte de Simulación de Crédito Inmobiliario", 40, 40);

  const tableColumns = ["Año", "Pago Anual", "Intereses", "Capital", "Saldo Restante"];
  const tableRows = amortizationData.map(row => [
    row.year, row.annualPayment, row.interestPaid, row.capitalPaid, row.remainingBalance
  ]);

  doc.autoTable({ head: [tableColumns], body: tableRows, startY: 200, theme: "grid", styles: { fontSize: 8 } });
  doc.save("SimulacionCredito.pdf");
}

