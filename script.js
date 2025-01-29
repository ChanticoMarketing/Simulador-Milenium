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

  const DEVELOPMENTS = {
    alta: [{ name: "Santa Clara", price: 1700000 }],
    vista: [{ name: "Ventura PA", price: 750000 }],
    bosques: [{ name: "Roble A", price: 4900000 }],
  };

  developmentSelect.addEventListener("change", function () {
    modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';
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
  });

  modelSelect.addEventListener("change", function () {
    if (modelSelect.value) {
      propertyValueInput.value = modelSelect.value;
      propertyValueInput.removeAttribute("readonly");
    }
  });

  function validateFields() {
    if (propertyValueInput.value && downPaymentInput.value && loanYearsInput.value && bankSelect.value) {
      if (parseFloat(downPaymentInput.value) > parseFloat(propertyValueInput.value)) {
        alert("El pago inicial no puede ser mayor que el valor de la propiedad.");
        calcBtn.disabled = true;
      } else {
        calcBtn.disabled = false;
      }
    } else {
      calcBtn.disabled = true;
    }
  }

  propertyValueInput.addEventListener("input", validateFields);
  downPaymentInput.addEventListener("input", validateFields);
  loanYearsInput.addEventListener("input", validateFields);
  bankSelect.addEventListener("change", validateFields);

  calcBtn.addEventListener("click", function () {
    const propertyValue = parseFloat(propertyValueInput.value);
    const downPayment = parseFloat(downPaymentInput.value);
    const loanYears = parseFloat(loanYearsInput.value);
    const selectedBank = bankSelect.options[bankSelect.selectedIndex];
    const interestRate = parseFloat(selectedBank.getAttribute("data-rate"));

    const loanAmount = propertyValue - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanYears * 12;

    const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    const totalPayment = monthlyPayment * numberOfPayments;

    document.getElementById("resultsSection").style.display = "block";
    document.getElementById("bankName").textContent = `Institución: ${selectedBank.textContent}`;
    document.getElementById("interestRate").textContent = `Tasa de interés: ${interestRate}%`;
    document.getElementById("loanAmount").textContent = `Monto del préstamo: $${loanAmount.toLocaleString()}`;
    document.getElementById("monthlyPayment").textContent = `Pago mensual: $${monthlyPayment.toFixed(2)}`;
    document.getElementById("totalPayment").textContent = `Pago total: $${totalPayment.toFixed(2)}`;
    document.getElementById("simulationDate").textContent = `Fecha de simulación: ${new Date().toLocaleDateString()}`;
    toggleAmortBtn.style.display = "inline-block";

    generateAmortizationTable(loanAmount, monthlyInterestRate, numberOfPayments, monthlyPayment);
  });

  function generateAmortizationTable(loanAmount, monthlyInterestRate, numberOfPayments, monthlyPayment) {
    const amortTableBody = document.getElementById("amortizationTable").getElementsByTagName("tbody")[0];
    amortTableBody.innerHTML = "";

    let remainingBalance = loanAmount;

    for (let year = 1; year <= numberOfPayments / 12; year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      for (let month = 1; month <= 12; month++) {
        const interestPayment = remainingBalance * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;

        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        remainingBalance -= principalPayment;
      }

      const row = amortTableBody.insertRow();
      row.insertCell().textContent = year;
      row.insertCell().textContent = `$${(yearlyInterest + yearlyPrincipal).toFixed(2)}`;
      row.insertCell().textContent = `$${yearlyInterest.toFixed(2)}`;
      row.insertCell().textContent = `$${yearlyPrincipal.toFixed(2)}`;
      row.insertCell().textContent = `$${remainingBalance.toFixed(2)}`;
    }
  }

  toggleAmortBtn.addEventListener("click", function () {
    const amortSection = document.getElementById("amortSection");
    amortSection.style.display = amortSection.style.display === "none" ? "block" : "none";
  });

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

  generatePDFBtn.addEventListener("click", function () {
    const doc = new jsPDF();
    const bankName = document.getElementById("bankName").textContent;
    const interestRate = document.getElementById("interestRate").textContent;
    const loanAmount = document.getElementById("loanAmount").textContent;
    const monthlyPayment = document.getElementById("monthlyPayment").textContent;
    const totalPayment = document.getElementById("totalPayment").textContent;
    const simulationDate = document.getElementById("simulationDate").textContent;

    doc.text("Reporte de Simulación de Crédito", 20, 20);
    doc.text(bankName, 20, 30);
    doc.text(interestRate, 20, 40);
    doc.text(loanAmount, 20, 50);
    doc.text(monthlyPayment, 20, 60);
    doc.text(totalPayment, 20, 70);
    doc.text(simulationDate, 20, 80);

    const amortTable = document.getElementById("amortizationTable");
    doc.autoTable({
      html: amortTable,
      startY: 90,
    });

    doc.save("SimulacionCredito.pdf");
  });
});
