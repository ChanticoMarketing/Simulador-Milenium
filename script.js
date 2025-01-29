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

// Maneja el cambio de desarrollo para llenar el select de modelos
function handleDevelopmentChange() {
  const developmentSelect = document.getElementById("developmentSelect");
  const modelSelect = document.getElementById("modelSelect");
  modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';

  const selectedDev = developmentSelect.value;
  if (selectedDev) {
    modelSelect.disabled = false;
    DEVELOPMENTS[selectedDev].forEach((model) => {
      const option = document.createElement("option");
      option.value = JSON.stringify(model.prices); // Guardamos los precios como string JSON
      option.textContent = model.name;
      modelSelect.appendChild(option);
    });
  } else {
    modelSelect.disabled = true;
  }
  validateFields();
}

// Maneja el cambio de modelo para actualizar el valor de la propiedad
function handleModelChange() {
  const modelSelect = document.getElementById("modelSelect");
  const propertyValueInput = document.getElementById("propertyValue");

  if (modelSelect.value) {
    const modelPrices = JSON.parse(modelSelect.value); // Recuperamos los precios del modelo seleccionado
    const selectedPrice = modelPrices[currentMonth] || modelPrices[1]; // Si el mes no está en el rango, usa Enero como default
    propertyValueInput.value = selectedPrice;
  }
  validateFields();
}

// Valida que todos los campos necesarios estén llenos
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

// Calcula el préstamo y muestra los resultados
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

// Genera los datos de amortización por años
function generateAmortization(principal, monthlyInterestRate, numYears, monthlyPayment) {
  const amortizationData = [];
  let balance = principal;

  for (let year = 1; year <= numYears; year++) {
    let interestPaidYearly = 0;
    let capitalPaidYearly = 0;

    for (let month = 1; month <= 12; month++) {
      const interestPaid = balance * monthlyInterestRate;
      const capitalPaid = monthlyPayment - interestPaid;
      balance -= capitalPaid;

      if (balance < 0) balance = 0;

      interestPaidYearly += interestPaid;
      capitalPaidYearly += capitalPaid;

      if (balance === 0) break;
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

// Llena la tabla de amortización
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

// Muestra/oculta la tabla de amortización
function toggleAmortTable() {
  const amortSection = document.getElementById("amortSection");
  if (amortSection.style.display === "none" || amortSection.style.display === "") {
    amortSection.style.display = "block";
    fillAmortizationTable();
  } else {
    amortSection.style.display = "none";
  }
}
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

// Maneja el cambio de desarrollo para llenar el select de modelos
function handleDevelopmentChange() {
  const developmentSelect = document.getElementById("developmentSelect");
  const modelSelect = document.getElementById("modelSelect");
  modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';

  const selectedDev = developmentSelect.value;
  if (selectedDev) {
    modelSelect.disabled = false;
    DEVELOPMENTS[selectedDev].forEach((model) => {
      const option = document.createElement("option");
      option.value = JSON.stringify(model.prices); // Guardamos los precios como string JSON
      option.textContent = model.name;
      modelSelect.appendChild(option);
    });
  } else {
    modelSelect.disabled = true;
  }
  validateFields();
}

// Maneja el cambio de modelo para actualizar el valor de la propiedad
function handleModelChange() {
  const modelSelect = document.getElementById("modelSelect");
  const propertyValueInput = document.getElementById("propertyValue");

  if (modelSelect.value) {
    const modelPrices = JSON.parse(modelSelect.value); // Recuperamos los precios del modelo seleccionado
    const selectedPrice = modelPrices[currentMonth] || modelPrices[1]; // Si el mes no está en el rango, usa Enero como default
    propertyValueInput.value = selectedPrice;
  }
  validateFields();
}

// Valida que todos los campos necesarios estén llenos
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

// Calcula el préstamo y muestra los resultados
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

// Genera el archivo PDF con los datos y la tabla de amortización
function generatePDF() {
  try {
    if (typeof jsPDF === "undefined") {
      alert("No se puede generar el PDF. jsPDF no está cargado.");
      return;
    }

    const doc = new jsPDF('p', 'pt', 'letter');
    doc.setFontSize(14);
    doc.text("Reporte de Simulación de Crédito Inmobiliario", 40, 40);

    const bankName = document.getElementById("bankName").textContent;
    const interestRate = document.getElementById("interestRate").textContent;
    const loanAmount = document.getElementById("loanAmount").textContent;
    const monthlyPayment = document.getElementById("monthlyPayment").textContent;
    const totalPayment = document.getElementById("totalPayment").textContent;

    doc.setFontSize(12);
    doc.text(bankName, 40, 70);
    doc.text(interestRate, 40, 90);
    doc.text(loanAmount, 40, 110);
    doc.text(monthlyPayment, 40, 130);
    doc.text(totalPayment, 40, 150);

    if (!amortizationData || amortizationData.length === 0) {
      alert("No se puede generar el PDF porque la tabla de amortización está vacía.");
      return;
    }

    const tableColumns = ["Año", "Pago Anual", "Intereses", "Capital", "Saldo Restante"];
    const tableRows = amortizationData.map(row => [
      row.year, row.annualPayment, row.interestPaid, row.capitalPaid, row.remainingBalance
    ]);

    if (typeof doc.autoTable === "undefined") {
      alert("No se puede generar el PDF. jsPDF-autoTable no está cargado.");
      return;
    }

    doc.autoTable({ head: [tableColumns], body: tableRows, startY: 200, theme: "grid", styles: { fontSize: 8 } });
    doc.save("SimulacionCredito.pdf");

  } catch (error) {
    console.error("Error al generar el PDF:", error);
    alert("Ocurrió un error al generar el PDF.");
  }
}
