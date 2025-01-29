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

  // Limpiar modelos previos y habilitar el select
  modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';
  modelSelect.disabled = false;

  const selectedDev = developmentSelect.value;
  if (selectedDev) {
    DEVELOPMENTS[selectedDev].models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model.name;
      option.textContent = model.name;
      modelSelect.appendChild(option);
    });
  }
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
}
