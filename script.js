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
      calcBtn.disabled = false;
    } else {
      calcBtn.disabled = true;
    }
  }

  calcBtn.addEventListener("click", function () {
    document.getElementById("resultsSection").style.display = "block";
    toggleAmortBtn.style.display = "inline-block";
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
    doc.text("Reporte de Simulación de Crédito", 20, 20);
    doc.save("SimulacionCredito.pdf");
  });
});
