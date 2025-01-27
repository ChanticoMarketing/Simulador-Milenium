const models = {
  alta: [
    { name: 'Modelo A', price: 1500000 },
    { name: 'Modelo B', price: 1800000 }
  ],
  vista: [
    { name: 'Modelo C', price: 2000000 },
    { name: 'Modelo D', price: 2300000 }
  ],
  bosques: [
    { name: 'Modelo E', price: 2500000 },
    { name: 'Modelo F', price: 2800000 }
  ]
};

let amortizationData = [];
let chartInstance = null;

function handleDevelopmentChange() {
  const development = document.getElementById('developmentSelect').value;
  const modelSelect = document.getElementById('modelSelect');
  
  // Limpiar opciones anteriores
  modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';
  
  // Cargar nuevos modelos
  models[development].forEach(model => {
    const option = document.createElement('option');
    option.value = model.price;
    option.textContent = `${model.name} - $${model.price.toLocaleString()}`;
    modelSelect.appendChild(option);
  });
  
  modelSelect.disabled = false;
  validateFields();
}

function handleModelChange() {
  const modelSelect = document.getElementById('modelSelect');
  document.getElementById('propertyValue').value = modelSelect.value;
  validateFields();
}

// Resto del código JavaScript (validaciones, cálculos, PDF, etc.)...
