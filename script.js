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

  generateAmortization(loanAmount, monthlyInterestRate, numberOfMonths, monthlyPayment);
}

// Genera la tabla de amortización
function generateAmortization(principal, monthlyInterestRate, numMonths, monthlyPayment) {
  const tableBody = document.querySelector("#amortizationTable tbody");
  tableBody.innerHTML = "";

  let balance = principal;
  for (let month = 1; month <= numMonths; month++) {
    const interestPayment = balance * monthlyInterestRate;
    const capitalPayment = monthlyPayment - interestPayment;
    balance -= capitalPayment;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${month}</td>
      <td>${new Date(new Date().setMonth(new Date().getMonth() + month)).toLocaleDateString("es-MX")}</td>
      <td>${monthlyPayment.toFixed(2)}</td>
      <td>${interestPayment.toFixed(2)}</td>
      <td>${capitalPayment.toFixed(2)}</td>
      <td>${balance.toFixed(2)}</td>
    `;
    tableBody.appendChild(row);

    if (balance <= 0) break;
  }
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
  document.getElementById("extraPayment").value = "";
  document.getElementById("calcBtn").disabled = true;
  document.getElementById("resultsSection").style.display = "none";
}
