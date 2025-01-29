// Definición de los modelos y precios por desarrollo (precios de Enero 2025)
const DEVELOPMENTS = {
  alta: [
    { name: "Santa Clara", price: 1600000 },
    { name: "Santa Lucía", price: 1900000 },
    { name: "Santa Bárbara", price: 2450000 },
  ],
  vista: [
    { name: "Ventura PA", price: 725000 },
    { name: "Ventura PB", price: 855000 },
    { name: "Cambria", price: 1275000 },
    { name: "Catalina", price: 1560000 },
  ],
  bosques: [
    { name: "Roble A", price: 4750000 },
    { name: "Roble B", price: 4750000 },
    { name: "Secuoya", price: 5850000 },
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
      option.textContent = `${model.name} - $${model.price.toLocaleString('es-MX')}`;
      modelSelect.appendChild(option);
    });
  } else {
    modelSelect.disabled = true;
  }
  validateFields();
}
