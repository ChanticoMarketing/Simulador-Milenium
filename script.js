document.addEventListener("DOMContentLoaded", function () {
  const developmentSelect = document.getElementById("developmentSelect");
  const modelSelect = document.getElementById("modelSelect");
  const propertyValueInput = document.getElementById("propertyValue");
  const downPaymentInput = document.getElementById("downPayment");
  const loanYearsInput = document.getElementById("loanYears");
  const bankSelect = document.getElementById("bankSelect");
  const calcBtn = document.getElementById("calcBtn");
  const resetBtn = document.getElementById("resetBtn");
  const toggleAmortBtn = document.getElementById("toggleAmortBtn");
  const generatePDFBtn = document.getElementById("generatePDFBtn");

  // Modelos disponibles por desarrollo
  const DEVELOPMENTS = {
    alta: [{ name: "Santa Clara", price: 1700000 }],
    vista: [{ name: "Ventura PA", price: 750000 }],
    bosques: [{ name: "Roble A", price: 4900000 }],
  };

  // --- Función para habilitar o deshabilitar el botón Calcular ---
  function validateFields() {
    if (
      propertyValueInput.value &&
      downPaymentInput.value &&
      loanYearsInput.value &&
      bankSelect.value
    ) {
      calcBtn.disabled = false;
    } else {
      calcBtn.disabled = true;
    }
  }

  // --- Poblado dinámico de modelos según el desarrollo ---
  developmentSelect.addEventListener("change", function () {
    modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';
    const selectedDev = developmentSelect.value;

    if (selectedDev) {
      modelSelect.disabled = false;
      // Agrega las opciones de modelos
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
  });

  // --- Asigna el precio de la propiedad al cambiar modelo ---
  modelSelect.addEventListener("change", function () {
    if (modelSelect.value) {
      propertyValueInput.value = modelSelect.value;
      // Si se quiere permitir que el usuario modifique el valor de la propiedad, quitar el comentario:
      // propertyValueInput.removeAttribute("readonly");
    } else {
      propertyValueInput.value = "";
    }
    validateFields();
  });

  // --- Listeners para validar campos en tiempo real ---
  downPaymentInput.addEventListener("input", validateFields);
  loanYearsInput.addEventListener("input", validateFields);
  bankSelect.addEventListener("change", validateFields);

  // --- Función para generar la tabla de amortización anual ---
  function generateAmortizationTable(loanAmount, interestRate, years) {
    const tableBody = document.querySelector("#amortizationTable tbody");
    tableBody.innerHTML = "";

    let balance = loanAmount;
    const monthlyInterest = interestRate / 100 / 12;
    const numberOfMonths = years * 12;
    const monthlyPayment = loanAmount * monthlyInterest / (1 - Math.pow(1 + monthlyInterest, -numberOfMonths));

    for (let y = 1; y <= years; y++) {
      let interestPaidYear = 0;
      let capitalPaidYear = 0;

      // Calculamos 12 pagos mensuales para cada año
      for (let m = 1; m <= 12; m++) {
        // Si el saldo ya es 0, terminamos
        if (balance <= 0) break;

        const interestForThisMonth = balance * monthlyInterest;
        const capitalForThisMonth = monthlyPayment - interestForThisMonth;

        interestPaidYear += interestForThisMonth;
        capitalPaidYear += capitalForThisMonth;
        balance -= capitalForThisMonth;

        if (balance < 0) {
          balance = 0;
        }
      }

      // Pago total anual (12 pagos al año); no consideramos fracciones en el último año si se acaba antes
      const paymentYear = monthlyPayment * 12;

      const row = document.createElement("tr");

      const yearCell = document.createElement("td");
      yearCell.textContent = y;

      const paymentCell = document.createElement("td");
      paymentCell.textContent = paymentYear.toFixed(2);

      const interestCell = document.createElement("td");
      interestCell.textContent = interestPaidYear.toFixed(2);

      const capitalCell = document.createElement("td");
      capitalCell.textContent = capitalPaidYear.toFixed(2);

      const balanceCell = document.createElement("td");
      balanceCell.textContent = balance.toFixed(2);

      row.appendChild(yearCell);
      row.appendChild(paymentCell);
      row.appendChild(interestCell);
      row.appendChild(capitalCell);
      row.appendChild(balanceCell);

      tableBody.appendChild(row);

      // Si el saldo se agotó antes de terminar los años, detenemos el ciclo
      if (balance <= 0) break;
    }
  }

  // --- Acción del botón Calcular crédito ---
  calcBtn.addEventListener("click", function () {
    const propertyValue = parseFloat(propertyValueInput.value) || 0;
    const downPayment = parseFloat(downPaymentInput.value) || 0;
    const loanYears = parseFloat(loanYearsInput.value) || 0;

    // Datos de la institución y tasa de interés
    const selectedBankOption = bankSelect.options[bankSelect.selectedIndex];
    const interestRate = parseFloat(selectedBankOption.dataset.rate) || 0;

    // Cálculos principales
    const loanAmount = propertyValue - downPayment;
    const monthlyInterest = interestRate / 100 / 12;
    const totalMonths = loanYears * 12;

    // Fórmula de pago mensual
    // M = P * ( i / (1 - (1+i)^(-n)) )
    const monthlyPayment =
      loanAmount *
      (monthlyInterest / (1 - Math.pow(1 + monthlyInterest, -totalMonths)));

    const totalPayment = monthlyPayment * totalMonths;

    // Mostramos resultados en pantalla
    document.getElementById("bankName").textContent =
      "Institución Financiera: " + selectedBankOption.textContent;
    document.getElementById("interestRate").textContent =
      "Tasa de interés anual: " + interestRate.toFixed(2) + "%";
    document.getElementById("loanAmount").textContent =
      "Monto del préstamo: $" + loanAmount.toLocaleString();
    document.getElementById("monthlyPayment").textContent =
      "Pago mensual aproximado: $" + monthlyPayment.toFixed(2);
    document.getElementById("totalPayment").textContent =
      "Pago total aproximado: $" + totalPayment.toFixed(2);

    const now = new Date();
    document.getElementById("simulationDate").textContent =
      "Fecha de simulación: " + now.toLocaleDateString();

    // Generamos la tabla de amortización
    generateAmortizationTable(loanAmount, interestRate, loanYears);

    // Mostramos la sección de resultados y el botón para ver/ocultar tabla
    document.getElementById("resultsSection").style.display = "block";
    toggleAmortBtn.style.display = "inline-block";
  });

  // --- Acción del botón Limpiar campos ---
  resetBtn.addEventListener("click", function () {
    developmentSelect.value = "";
    modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';
    modelSelect.disabled = true;

    propertyValueInput.value = "";
    downPaymentInput.value = "";
    loanYearsInput.value = "";
    bankSelect.value = "";

    calcBtn.disabled = true;
    document.getElementById("resultsSection").style.display = "none";
    document.getElementById("amortSection").style.display = "none";
    toggleAmortBtn.style.display = "none";
  });

  // --- Ver/ocultar la tabla de amortización ---
  toggleAmortBtn.addEventListener("click", function () {
    const amortSection = document.getElementById("amortSection");
    amortSection.style.display =
      amortSection.style.display === "none" ? "block" : "none";
  });

  // --- Generar PDF con los datos y la tabla de amortización ---
  generatePDFBtn.addEventListener("click", function () {
    const doc = new jsPDF();

    // Título
    doc.text("Reporte de Simulación de Crédito", 20, 20);

    // Datos principales
    let currentY = 30;
    doc.text(
      document.getElementById("bankName").textContent,
      20,
      currentY
    );
    currentY += 10;
    doc.text(
      document.getElementById("interestRate").textContent,
      20,
      currentY
    );
    currentY += 10;
    doc.text(
      document.getElementById("loanAmount").textContent,
      20,
      currentY
    );
    currentY += 10;
    doc.text(
      document.getElementById("monthlyPayment").textContent,
      20,
      currentY
    );
    currentY += 10;
    doc.text(
      document.getElementById("totalPayment").textContent,
      20,
      currentY
    );
    currentY += 10;
    doc.text(
      document.getElementById("simulationDate").textContent,
      20,
      currentY
    );
    currentY += 15;

    // Extraemos filas de la tabla
    const rows = [];
    const tableRows = document.querySelectorAll("#amortizationTable tbody tr");
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      const rowData = [];
      cells.forEach((cell) => {
        rowData.push(cell.textContent);
      });
      rows.push(rowData);
    });

    // Generamos la tabla con autoTable
    doc.autoTable({
      head: [["Año", "Pago Anual", "Intereses", "Capital", "Saldo Restante"]],
      body: rows,
      startY: currentY,
    });

    // Descarga del PDF
    doc.save("SimulacionCredito.pdf");
  });
});
