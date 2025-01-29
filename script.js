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
  if (selectedDev && DEVELOPMENTS[selectedDev]) {
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
  
  try {
    if (modelSelect.value) {
      const modelPrices = JSON.parse(modelSelect.value); // Recuperamos los precios del modelo seleccionado
      const selectedPrice = modelPrices[currentMonth] || modelPrices[1]; // Si el mes no está en el rango, usa Enero como default
      propertyValueInput.value = selectedPrice;
    }
  } catch (error) {
    console.error("Error al seleccionar modelo:", error);
  }
  validateFields();
}

// Valida que todos los campos necesarios estén llenos
function validateFields() {
  const propertyValue = parseFloat(document.getElementById("propertyValue").value) || 0;
  const downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
  const loanYears = parseInt(document.getElementById("loanYears").value) || 0;
  const bankSelect = document.getElementById("bankSelect");
  const calcBtn = document.getElementById("calcBtn");

  calcBtn.disabled = !(propertyValue > 0 && downPayment > 0 && loanYears > 0 && bankSelect.value);
}

// Muestra/oculta la tabla de amortización
function toggleAmortTable() {
  const amortSection = document.getElementById("amortSection");
  if (!amortSection) return;

  if (amortSection.style.display === "none" || amortSection.style.display === "") {
    fillAmortizationTable();
    amortSection.style.display = "block";
  } else {
    amortSection.style.display = "none";
  }
}
