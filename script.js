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

// Obtiene el mes actual (1 = Enero, 2 = Febrero, etc.)
const currentMonth = new Date().getMonth() + 1;

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
}

// Genera el archivo PDF con los datos del crédito
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

    doc.save("SimulacionCredito.pdf");
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    alert("Ocurrió un error al generar el PDF.");
  }
}

// Resetea el formulario
function resetForm() {
  document.getElementById("developmentSelect").value = "";
  document.getElementById("modelSelect").innerHTML = '<option disabled selected>Elige un modelo</option>';
  document.getElementById("modelSelect").disabled = true;
  document.getElementById("propertyValue").value = "";
  document.getElementById("downPayment").value = "";
  document.getElementById("loanYears").value = "";
  document.getElementById("bankSelect").value = "";
  document.getElementById("calcBtn").disabled = true;
  document.getElementById("resultsSection").style.display = "none";
}
