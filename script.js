document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    monthSelect: document.getElementById('monthSelect'),
    developmentSelect: document.getElementById('developmentSelect'),
    modelSelect: document.getElementById('modelSelect'),
    propertyValue: document.getElementById('propertyValue'),
    downPayment: document.getElementById('downPayment'),
    loanYears: document.getElementById('loanYears'),
    bankSelect: document.getElementById('bankSelect'),
    calcBtn: document.getElementById('calcBtn'),
    resetBtn: document.getElementById('resetBtn'),
    errorMessage: document.getElementById('errorMessage'),
    resultsSection: document.getElementById('resultsSection'),
    toggleAmortBtn: document.getElementById('toggleAmortBtn'),
    generatePDFBtn: document.getElementById('generatePDFBtn'),
    amortSection: document.getElementById('amortSection'),
    bankName: document.getElementById('bankName'),
    interestRate: document.getElementById('interestRate'),
    loanAmount: document.getElementById('loanAmount'),
    monthlyPayment: document.getElementById('monthlyPayment'),
    totalPayment: document.getElementById('totalPayment'),
    simulationDate: document.getElementById('simulationDate'),
    amortTableBody: document.querySelector('#amortizationTable tbody')
  };

  const DEVELOPMENTS = {
    vista: {
      name: "Vista California",
      models: {
        "Ventura PA": { "ene-25": 725000, "feb-25": 750000, "mar-25": 775000 },
        "Ventura PB": { "ene-25": 855000, "feb-25": 870000, "mar-25": 890000 },
        "Cambria": { "ene-25": 1275000, "feb-25": 1300000, "mar-25": 1320000 },
        "Catalina": { "ene-25": 1560000, "feb-25": 1580000, "mar-25": 1600000 }
      }
    },
    alta: {
      name: "Alta California",
      models: {
        "Santa Clara": { "ene-25": 1600000, "feb-25": 1650000, "mar-25": 1700000 },
        "Santa Lucia": { "ene-25": 1900000, "feb-25": 1950000, "mar-25": 2000000 },
        "Santa Barbara": { "ene-25": 2450000, "feb-25": 2500000, "mar-25": 2600000 }
      }
    },
    bosques: {
      name: "Bosques California",
      models: {
        "Roble": { "ene-25": 4750000, "feb-25": 4850000, "mar-25": 4900000 },
        "Secuoya": { "ene-25": 5850000, "feb-25": 5925000, "mar-25": 6050000 }
      }
    }
  };

  let amortizationData = [];

  // Inicialización
  const init = () => {
    setupEventListeners();
    populateModels();
  };

  // Llenar modelos
  const populateModels = () => {
    elements.developmentSelect.addEventListener('change', () => {
      const selectedDev = elements.developmentSelect.value;
      elements.modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';
      
      if (selectedDev) {
        elements.modelSelect.disabled = false;
        Object.keys(DEVELOPMENTS[selectedDev].models).forEach(modelName => {
          const option = new Option(modelName);
          elements.modelSelect.add(option);
        });
      }
    });
  };

  // Eventos
  const setupEventListeners = () => {
    elements.modelSelect.addEventListener('change', updatePropertyValue);
    elements.monthSelect.addEventListener('change', updatePropertyValue);
    elements.downPayment.addEventListener('input', validateDownPayment);
    elements.loanYears.addEventListener('input', validateForm);
    elements.bankSelect.addEventListener('change', validateForm);
    elements.calcBtn.addEventListener('click', calculateLoan);
    elements.resetBtn.addEventListener('click', resetForm);
    elements.toggleAmortBtn.addEventListener('click', toggleAmortization);
    elements.generatePDFBtn.addEventListener('click', generatePDF);
  };

  // Actualizar valor de la propiedad
  const updatePropertyValue = () => {
    if (elements.modelSelect.value) {
      const selectedDev = elements.developmentSelect.value;
      const selectedModel = elements.modelSelect.options[elements.modelSelect.selectedIndex].text;
      const selectedMonth = elements.monthSelect.value;
      
      const price = DEVELOPMENTS[selectedDev].models[selectedModel][selectedMonth];
      elements.propertyValue.value = price;
      validateForm();
    }
  };

  // Validaciones
  const validateForm = () => {
    const isValid = [
      elements.propertyValue.value,
      elements.downPayment.value,
      elements.loanYears.value,
      elements.bankSelect.value
    ].every(Boolean);

    elements.calcBtn.disabled = !isValid;
  };

  const validateDownPayment = () => {
    const propertyValue = parseFloat(elements.propertyValue.value);
    const downPayment = parseFloat(elements.downPayment.value) || 0;

    if (downPayment > propertyValue) {
      showError('El enganche no puede exceder el valor de la propiedad');
      elements.calcBtn.disabled = true;
    } else {
      hideError();
      validateForm();
    }
  };

  // Cálculos
  const calculateLoan = () => {
    const loanAmount = parseFloat(elements.propertyValue.value) - parseFloat(elements.downPayment.value);
    const years = parseFloat(elements.loanYears.value);
    const rate = parseFloat(elements.bankSelect.options[elements.bankSelect.selectedIndex].dataset.rate) / 100;
    const monthlyRate = rate / 12;
    const months = years * 12;

    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    const totalPayment = monthlyPayment * months;

    displayResults(loanAmount, rate, monthlyPayment, totalPayment);
    generateAmortizationTable(loanAmount, monthlyPayment, monthlyRate, months);
  };

  // Mostrar resultados
  const displayResults = (loanAmount, rate, monthlyPayment, totalPayment) => {
    elements.bankName.textContent = elements.bankSelect.options[elements.bankSelect.selectedIndex].text;
    elements.interestRate.textContent = `${(rate * 100).toFixed(2)}%`;
    elements.loanAmount.textContent = formatCurrency(loanAmount);
    elements.monthlyPayment.textContent = formatCurrency(monthlyPayment);
    elements.totalPayment.textContent = formatCurrency(totalPayment);
    elements.simulationDate.textContent = `Simulación generada el: ${new Date().toLocaleDateString()}`;
    
    elements.resultsSection.style.display = 'block';
    elements.toggleAmortBtn.style.display = 'inline-block';
  };

  // Generar tabla de amortización
  const generateAmortizationTable = (loanAmount, monthlyPayment, monthlyRate, months) => {
    let balance = loanAmount;
    amortizationData = [];
    elements.amortTableBody.innerHTML = '';

    for (let year = 1; year <= elements.loanYears.value; year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      for (let month = 1; month <= 12; month++) {
        const interest = balance * monthlyRate;
        const principal = monthlyPayment - interest;
        
        yearlyInterest += interest;
        yearlyPrincipal += principal;
        balance -= principal;
      }

      const rowData = {
        year,
        yearlyPayment: monthlyPayment * 12,
        yearlyInterest,
        yearlyPrincipal,
        remainingBalance: balance
      };

      amortizationData.push(rowData);
      elements.amortTableBody.innerHTML += `
        <tr>
          <td>${year}</td>
          <td>${formatCurrency(rowData.yearlyPayment)}</td>
          <td>${formatCurrency(rowData.yearlyInterest)}</td>
          <td>${formatCurrency(rowData.yearlyPrincipal)}</td>
          <td>${formatCurrency(rowData.remainingBalance)}</td>
        </tr>
      `;
    }
  };

  // Generar PDF
  const generatePDF = () => {
    try {
      if (amortizationData.length === 0) throw new Error("No hay datos de simulación");
      
      const doc = new jspdf.jsPDF();
      const date = new Date().toLocaleDateString();
      
      doc.setFontSize(18);
      doc.text("Reporte de Simulación de Crédito", 20, 20);
      doc.setFontSize(12);
      doc.text(`Fecha: ${date}`, 20, 30);

      doc.autoTable({
        startY: 40,
        head: [['Concepto', 'Valor']],
        body: [
          ['Institución', elements.bankName.textContent],
          ['Tasa de interés', elements.interestRate.textContent],
          ['Monto del préstamo', elements.loanAmount.textContent],
          ['Pago mensual', elements.monthlyPayment.textContent],
          ['Pago total', elements.totalPayment.textContent]
        ]
      });

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Año', 'Pago Anual', 'Intereses', 'Capital', 'Saldo Restante']],
        body: amortizationData.map(item => [
          item.year,
          formatCurrency(item.yearlyPayment),
          formatCurrency(item.yearlyInterest),
          formatCurrency(item.yearlyPrincipal),
          formatCurrency(item.remainingBalance)
        ])
      });

      doc.save('simulacion-credito.pdf');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      showError('Primero realice una simulación válida');
    }
  };

  // Utilidades
  const formatCurrency = (amount) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  const showError = (message) => {
    elements.errorMessage.textContent = message;
    elements.errorMessage.style.display = 'block';
  };

  const hideError = () => {
    elements.errorMessage.style.display = 'none';
  };

  const toggleAmortization = () => {
    elements.amortSection.style.display = elements.amortSection.style.display === 'none' ? 'block' : 'none';
  };

  const resetForm = () => {
    elements.developmentSelect.value = '';
    elements.monthSelect.value = 'ene-25';
    elements.modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';
    elements.modelSelect.disabled = true;
    elements.propertyValue.value = '';
    elements.downPayment.value = '';
    elements.loanYears.value = '';
    elements.bankSelect.value = '';
    elements.resultsSection.style.display = 'none';
    elements.amortSection.style.display = 'none';
    elements.toggleAmortBtn.style.display = 'none';
    hideError();
  };

  // Iniciar
  init();
});
