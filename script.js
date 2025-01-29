// Función para obtener el precio según la fecha actual
function getCurrentPrice(prices) {
  const today = new Date();
  const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  
  // Solo permitir los meses establecidos (Enero a Marzo 2025)
  const allowedMonths = ['2025-01', '2025-02', '2025-03'];
  
  // Si el mes actual está en el rango permitido, usar ese precio
  if (allowedMonths.includes(monthKey)) {
    return {
      price: prices[monthKey],
      month: monthKey
    };
  }
  
  // Si estamos fuera del rango, mostrar mensaje de error
  alert("Los precios solo están disponibles para el periodo Enero-Marzo 2025. Por favor, contacte a un asesor para precios actualizados.");
  return null;
}

// Función actualizada para manejar el cambio de desarrollo
function handleDevelopmentChange() {
  const developmentSelect = document.getElementById("developmentSelect");
  const modelSelect = document.getElementById("modelSelect");
  modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';

  const selectedDev = developmentSelect.value;
  if (selectedDev) {
    modelSelect.disabled = false;
    DEVELOPMENTS[selectedDev].forEach((model) => {
      const priceData = getCurrentPrice(model.prices);
      
      // Si no hay precio disponible para el periodo, no mostrar el modelo
      if (!priceData) {
        modelSelect.innerHTML = '<option value="" disabled selected>Precios no disponibles para el periodo actual</option>';
        return;
      }

      const option = document.createElement("option");
      option.value = priceData.price;
      
      // Formatear la fecha para mostrar
      const [year, month] = priceData.month.split('-');
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const monthName = monthNames[parseInt(month) - 1];
      
      option.textContent = `${model.name} - $${priceData.price.toLocaleString('es-MX')} (${monthName} ${year})`;
      modelSelect.appendChild(option);
    });
  } else {
    modelSelect.disabled = true;
  }
  validateFields();
}
