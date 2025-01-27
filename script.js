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

function handleDevelopmentChange() {
  const developmentSelect = document.getElementById("developmentSelect");
  const modelSelect = document.getElementById("modelSelect");
  modelSelect.innerHTML = `<option value="" disabled selected>Elige un modelo</option>`;
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

function validateFields() {
  const calcBtn = document.getElementById("calcBtn");
  const propertyValue = document.getElementById("propertyValue").value;
  const downPayment = document.getElementById("downPayment").value;
  const loanYears = document.getElementById("loanYears").value;
  calcBtn.disabled = !(propertyValue && downPayment && loanYears);
}

// Continúa con las demás funciones: cálculo de préstamo, generación de PDF, etc.
