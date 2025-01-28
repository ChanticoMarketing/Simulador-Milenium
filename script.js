// Definición de los modelos y precios por desarrollo
const DEVELOPMENTS = {
  alta: [
    { name: "Santa Clara", price: 2050000 },
    { name: "Santa Lucía", price: 2450000 },
    { name: "Santa Bárbara", price: 3350000 },
  ],
  vista: [
    { name: "Ventura PA", price: 860000 },
    { name: "Ventura PB", price: 965000 },
    { name: "Cambria", price: 1450000 },
    { name: "Catalina", price: 1700000 },
  ],
  bosques: [
    { name: "Roble A", price: 5150000 },
    { name: "Roble B", price: 5150000 },
    { name: "Secuoya", price: 6250000 },
  ],
};

// Variable global para almacenar los datos de amortización
let amortizationData = [];

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
      option.value = model.price;
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
    propertyValueInput.value = modelSelect.value;
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

  amortizationData = generateAmortization(loanAmount, monthlyInterestRate, numberOfMonths, monthlyPayment);
}

// Genera los datos de amortización
function generateAmortization(principal, monthlyInterestRate, numMonths, monthlyPayment) {
  const amortizationData = [];
  let balance = principal;

  for (let month = 1; month <= numMonths; month++) {
    const interestPaid = balance * monthlyInterestRate;
    const capitalPaid = monthlyPayment - interestPaid;
    balance -= capitalPaid;

    if (balance < 0) balance = 0;

    amortizationData.push({
      month: month,
      paymentDate: new Date(new Date().setMonth(new Date().getMonth() + month)),
      monthlyPayment: monthlyPayment.toFixed(2),
      interestPaid: interestPaid.toFixed(2),
      capitalPaid: capitalPaid.toFixed(2),
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
      <td>${row.month}</td>
      <td>${row.paymentDate.toLocaleDateString("es-MX")}</td>
      <td>${row.monthlyPayment}</td>
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

// Genera el archivo PDF con los datos y la tabla de amortización
function generatePDF() {
  const doc = new jsPDF('p', 'pt', 'letter'); // Sintaxis para jsPDF 1.5.3
  const title = "Reporte de Simulación de Crédito Inmobiliario";

  doc.setFontSize(14);
  doc.text(title, 40, 40);

  // Datos principales
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

  // Tabla de amortización
  const tableColumns = ["Mes", "Fecha de Pago", "Pago Mensual", "Intereses", "Capital", "Saldo Restante"];
  const tableRows = amortizationData.map((row) => [
    row.month,
    row.paymentDate.toLocaleDateString("es-MX"),
    row.monthlyPayment,
    row.interestPaid,
    row.capitalPaid,
    row.remainingBalance,
  ]);

  doc.autoTable({
    head: [tableColumns],
    body: tableRows,
    startY: 200,
    theme: "grid",
    styles: { fontSize: 8 },
  });

  doc.save("SimulacionCredito.pdf");
}

// Resetea el formulario
function resetForm() {
  document.getElementById("developmentSelect").value = "";
  document.getElementById("modelSelect").innerHTML = '<option value="" disabled selected>Elige un modelo</option>';
  document.getElementById("modelSelect").disabled = true;
  document.getElementById("propertyValue").value = "";
  document.getElementById("downPayment").value = "";
  document.getElementById("loanYears").value = "";
  document.getElementById("bankSelect").value = "";
  document.getElementById("calcBtn").disabled = true;
  document.getElementById("resultsSection").style.display = "none";
}
