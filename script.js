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

const currentMonth = new Date().getMonth() + 1;

function handleDevelopmentChange() {
  const developmentSelect = document.getElementById("developmentSelect");
  const modelSelect = document.getElementById("modelSelect");
  modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';

  const selectedDev = developmentSelect.value;
  if (DEVELOPMENTS[selectedDev]) {
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

  try {
    if (modelSelect.value) {
      const modelPrices = JSON.parse(modelSelect.value);
      propertyValueInput.value = modelPrices[currentMonth] || modelPrices[1];
    }
  } catch (error) {
    console.error("Error al procesar los precios del modelo:", error);
  }
}

function validateFields() {
  const propertyValue = document.getElementById("propertyValue").value;
  const downPayment = document.getElementById("downPayment").value;
  const loanYears = document.getElementById("loanYears").value;
  const bankSelect = document.getElementById("bankSelect");
  const calcBtn = document.getElementById("calcBtn");

  calcBtn.disabled = !(propertyValue && downPayment && loanYears && bankSelect.value);
}

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
