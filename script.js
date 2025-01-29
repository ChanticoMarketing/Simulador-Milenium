// Definición de los modelos y precios por desarrollo, con actualización para Ene, Feb, Mar 2025
const DEVELOPMENTS = {
  alta: {
    name: "Alta California",
    models: [
      { name: "Santa Clara", prices: { "Enero": 1600000, "Febrero": 1650000, "Marzo": 1700000 } },
      { name: "Santa Lucía", prices: { "Enero": 1900000, "Febrero": 1950000, "Marzo": 2000000 } },
      { name: "Santa Bárbara", prices: { "Enero": 2450000, "Febrero": 2500000, "Marzo": 2600000 } }
    ]
  },
  vista: {
    name: "Vista California",
    models: [
      { name: "Ventura PA", prices: { "Enero": 725000, "Febrero": 750000, "Marzo": 775000 } },
      { name: "Ventura PB", prices: { "Enero": 855000, "Febrero": 870000, "Marzo": 890000 } },
      { name: "Cambria", prices: { "Enero": 1275000, "Febrero": 1300000, "Marzo": 1320000 } },
      { name: "Catalina", prices: { "Enero": 1560000, "Febrero": 1580000, "Marzo": 1600000 } }
    ]
  },
  bosques: {
    name: "Bosques California",
    models: [
      { name: "Roble A", prices: { "Enero": 4750000, "Febrero": 4850000, "Marzo": 4900000 } },
      { name: "Roble B", prices: { "Enero": 4750000, "Febrero": 4850000, "Marzo": 4900000 } },
      { name: "Secuoya", prices: { "Enero": 5850000, "Febrero": 5925000, "Marzo": 6050000 } }
    ]
  }
};

// Función para obtener el mes actual y convertirlo en nombre
function getCurrentMonthName() {
  const today = new Date();
  const monthIndex = today.getMonth(); // Enero = 0, Febrero = 1, Marzo = 2
  const monthNames = ["Enero", "Febrero", "Marzo"];
  return monthNames[monthIndex] || "Marzo"; // Si está fuera de rango, tomar Marzo por defecto
}

// Función para manejar el cambio de desarrollo y actualizar modelos
function handleDevelopmentChange() {
  const developmentSelect = document.getElementById("developmentSelect");
  const modelSelect = document.getElementById("modelSelect");

  modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';

  const selectedDev = developmentSelect.value;
  if (selectedDev) {
    modelSelect.disabled = false;
    DEVELOPMENTS[selectedDev].models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model.name;
      option.textContent = model.name;
      modelSelect.appendChild(option);
    });
  } else {
    modelSelect.disabled = true;
  }
  validateFields();
}

// Función para actualizar el precio de la propiedad basado en el modelo y el mes actual
function handleModelChange() {
  const developmentSelect = document.getElementById("developmentSelect").value;
  const modelSelect = document.getElementById("modelSelect").value;
  const propertyValueInput = document.getElementById("propertyValue");

  if (developmentSelect && modelSelect) {
    const selectedModel = DEVELOPMENTS[developmentSelect].models.find(
      (model) => model.name === modelSelect
    );

    if (selectedModel) {
      const currentMonth = getCurrentMonthName();
      propertyValueInput.value = selectedModel.prices[currentMonth];
      document.getElementById("currentMonthDisplay").textContent = `Precio correspondiente a: ${currentMonth}`;
    }
  }
  validateFields();
}

// Función para validar los campos y habilitar el botón de cálculo
function validateFields() {
  const propertyValue = document.getElementById("propertyValue").value;
  const downPayment = document.getElementById("downPayment").value;
  const loanYears = document.getElementById("loanYears").value;
  const bankSelect = document.getElementById("bankSelect").value;
  const calcBtn = document.getElementById("calcBtn");

  if (propertyValue && downPayment && loanYears && bankSelect) {
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

// Función para generar el PDF
function generatePDF() {
  const doc = new jsPDF('p', 'pt', 'letter');
  const title = "Reporte de Simulación de Crédito Inmobiliario";

  doc.setFontSize(14);
  doc.text(title, 40, 40);

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
}

// Función para limpiar el formulario
function resetForm() {
  document.getElementById("developmentSelect").value = "";
  document.getElementById("modelSelect").innerHTML = '<option value="" disabled selected>Elige un modelo</option>';
  document.getElementById("propertyValue").value = "";
  document.getElementById("downPayment").value = "";
  document.getElementById("loanYears").value = "";
  document.getElementById("bankSelect").value = "";
  document.getElementById("calcBtn").disabled = true;
  document.getElementById("resultsSection").style.display = "none";
}
