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

// Función para manejar el cambio de desarrollo
function handleDevelopmentChange() {
  const developmentSelect = document.getElementById("developmentSelect");
  const modelSelect = document.getElementById("modelSelect");
  const propertyValueInput = document.getElementById("propertyValue");

  modelSelect.innerHTML = `<option value="" disabled selected>Elige un modelo</option>`;
  propertyValueInput.value = ""; // Limpia el valor de la propiedad al cambiar el desarrollo

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
}

// Función para manejar el cambio de modelo
function handleModelChange() {
  const modelSelect = document.getElementById("modelSelect");
  const propertyValueInput = document.getElementById("propertyValue");

  const selectedPrice = modelSelect.value;
  if (selectedPrice) {
    propertyValueInput.value = selectedPrice; // Actualiza automáticamente el valor de la propiedad
  }
}

// Función para validar los campos necesarios
function validateFields() {
  const calcBtn = document.getElementById("calcBtn");
  const propertyValue = document.getElementById("propertyValue").value;
  const downPayment = document.getElementById("downPayment").value;
  const loanYears = document.getElementById("loanYears").value;
  const bankSelect = document.getElementById("bankSelect").value;

  // Habilita el botón si todos los campos tienen datos válidos
  calcBtn.disabled = !(propertyValue && downPayment && loanYears && bankSelect);
}

// Función para calcular el préstamo
function calculateLoan() {
  const propertyValue = parseFloat(document.getElementById("propertyValue").value);
  const downPayment = parseFloat(document.getElementById("downPayment").value);
  const loanYears = parseInt(document.getElementById("loanYears").value, 10);
  const bankSelect = document.getElementById("bankSelect");
  const selectedBank = bankSelect.options[bankSelect.selectedIndex];
  const annualInterestRate = parseFloat(selectedBank.getAttribute("data-rate"));

  // Validar datos
  if (isNaN(propertyValue) || isNaN(downPayment) || isNaN(loanYears) || isNaN(annualInterestRate)) {
    alert("Por favor, completa todos los campos correctamente.");
    return;
  }

  // Calcular monto del préstamo
  const loanAmount = propertyValue - downPayment;
  if (loanAmount <= 0) {
    alert("El enganche no puede ser mayor o igual al valor de la propiedad.");
    return;
  }

  // Cálculo de pagos mensuales
  const monthlyInterestRate = annualInterestRate / 12 / 100;
  const numberOfMonths = loanYears * 12;
  const monthlyPayment = loanAmount * (
    (monthlyInterestRate * Math.pow((1 + monthlyInterestRate), numberOfMonths)) /
    (Math.pow((1 + monthlyInterestRate), numberOfMonths) - 1)
  );

  const totalPayment = monthlyPayment * numberOfMonths;

  // Mostrar resultados
  const resultsSection = document.getElementById("resultsSection");
  resultsSection.style.display = "block";
  document.getElementById("bankName").textContent = `Banco seleccionado: ${selectedBank.text}`;
  document.getElementById("interestRate").textContent = `Tasa de interés anual: ${annualInterestRate}%`;
  document.getElementById("loanAmount").textContent = `Monto del crédito: MXN $${loanAmount.toLocaleString("es-MX")}`;
  document.getElementById("monthlyPayment").textContent = `Pago mensual: MXN $${monthlyPayment.toFixed(2)}`;
  document.getElementById("totalPayment").textContent = `Pago total: MXN $${totalPayment.toFixed(2)}`;
}

// Función para mostrar/ocultar la tabla de amortización (pendiente de implementar)
function toggleAmortTable() {
  const amortSection = document.getElementById("amortSection");
  amortSection.style.display = amortSection.style.display === "none" ? "block" : "none";
}

// Función para limpiar el formulario
function resetForm() {
  document.getElementById("developmentSelect").value = "";
  document.getElementById("modelSelect").innerHTML = `<option value="" disabled selected>Elige un modelo</option>`;
  document.getElementById("modelSelect").disabled = true;
  document.getElementById("propertyValue").value = "";
  document.getElementById("downPayment").value = "";
  document.getElementById("loanYears").value = "";
  document.getElementById("bankSelect").value = "";
  document.getElementById("resultsSection").style.display = "none";
  document.getElementById("calcBtn").disabled = true;
}
