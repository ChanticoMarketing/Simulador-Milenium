document.addEventListener("DOMContentLoaded", async () => {
    const elements = {
        monthSelect: document.getElementById("monthSelect"),
        developmentSelect: document.getElementById("developmentSelect"),
        modelSelect: document.getElementById("modelSelect"),
        propertyValue: document.getElementById("propertyValue"),
        downPayment: document.getElementById("downPayment"),
        loanYears: document.getElementById("loanYears"),
        bankSelect: document.getElementById("bankSelect"),
        calcBtn: document.getElementById("calcBtn"),
        resetBtn: document.getElementById("resetBtn"),
        resultsSection: document.getElementById("resultsSection"),
        toggleAmortBtn: document.getElementById("toggleAmortBtn"),
        generatePDFBtn: document.getElementById("generatePDFBtn"),
        amortSection: document.getElementById("amortSection"),
        bankName: document.getElementById("bankName"),
        interestRate: document.getElementById("interestRate"),
        loanAmount: document.getElementById("loanAmount"),
        monthlyPayment: document.getElementById("monthlyPayment"),
        totalPayment: document.getElementById("totalPayment"),
        simulationDate: document.getElementById("simulationDate"),
        amortTableBody: document.querySelector("#amortizationTable tbody"),
        errorMessage: document.getElementById("errorMessage")
    };

    let amortizationData = {};

    // ✅ Mostrar errores en pantalla
    const showError = (message) => {
        elements.errorMessage.textContent = message;
        elements.errorMessage.style.display = "block";
    };

    const hideError = () => {
        elements.errorMessage.style.display = "none";
    };

    // ✅ Cargar los datos de amortización desde el JSON generado a partir del Excel
    const loadAmortizationData = async () => {
        try {
            const response = await fetch("amortizacion.json");

            if (!response.ok) {
                throw new Error("No se pudo encontrar el archivo de amortización.");
            }

            amortizationData = await response.json();
        } catch (error) {
            console.error("Error cargando datos de amortización:", error);
            showError("No se pudo cargar la información del crédito. Verifique que el archivo 'amortizacion.json' exista.");
        }
    };

    await loadAmortizationData();

    // ✅ Llenar los modelos disponibles según el desarrollo seleccionado
    const populateModels = () => {
        elements.developmentSelect.addEventListener("change", () => {
            const selectedDev = elements.developmentSelect.value;
            elements.modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';
            elements.modelSelect.disabled = true;

            if (amortizationData[selectedDev]) {
                elements.modelSelect.disabled = false;
                Object.keys(amortizationData[selectedDev]).forEach(modelName => {
                    const option = new Option(modelName, modelName);
                    elements.modelSelect.add(option);
                });
            }
        });
    };

    // ✅ Actualizar el valor de la propiedad basado en el modelo y mes seleccionados
    const updatePropertyValue = () => {
        const selectedDev = elements.developmentSelect.value;
        const selectedModel = elements.modelSelect.value;
        const selectedMonth = elements.monthSelect.value;

        if (selectedDev && selectedModel && amortizationData[selectedDev][selectedModel][selectedMonth]) {
            elements.propertyValue.value = amortizationData[selectedDev][selectedModel][selectedMonth].precio;
            validateForm();
        }
    };

    // ✅ Validar formulario antes de habilitar botón de cálculo
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
            showError("El enganche no puede exceder el valor de la propiedad.");
            elements.calcBtn.disabled = true;
        } else {
            hideError();
            validateForm();
        }
    };

    // ✅ Cálculo del crédito
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

    // ✅ Mostrar resultados en pantalla
    const displayResults = (loanAmount, rate, monthlyPayment, totalPayment) => {
        elements.bankName.textContent = elements.bankSelect.options[elements.bankSelect.selectedIndex].text;
        elements.interestRate.textContent = `${(rate * 100).toFixed(2)}%`;
        elements.loanAmount.textContent = formatCurrency(loanAmount);
        elements.monthlyPayment.textContent = formatCurrency(monthlyPayment);
        elements.totalPayment.textContent = formatCurrency(totalPayment);
        elements.simulationDate.textContent = `Simulación generada el: ${new Date().toLocaleDateString()}`;

        elements.resultsSection.style.display = "block";
        elements.toggleAmortBtn.style.display = "inline-block";
    };

    // ✅ Generar tabla de amortización
    const generateAmortizationTable = (loanAmount, monthlyPayment, monthlyRate, months) => {
        let balance = loanAmount;
        elements.amortTableBody.innerHTML = "";

        for (let year = 1; year <= months / 12; year++) {
            let yearlyInterest = 0;
            let yearlyPrincipal = 0;

            for (let month = 1; month <= 12; month++) {
                const interest = balance * monthlyRate;
                const principal = monthlyPayment - interest;
                
                yearlyInterest += interest;
                yearlyPrincipal += principal;
                balance -= principal;
            }

            elements.amortTableBody.innerHTML += `
                <tr>
                    <td>${year}</td>
                    <td>${formatCurrency(yearlyInterest)}</td>
                    <td>${formatCurrency(yearlyPrincipal)}</td>
                    <td>${formatCurrency(balance)}</td>
                </tr>
            `;
        }
    };

    // ✅ Formatear moneda mexicana
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);
    };

    // ✅ Reiniciar formulario
    const resetForm = () => {
        elements.developmentSelect.value = "";
        elements.modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';
        elements.modelSelect.disabled = true;
        elements.propertyValue.value = "";
        elements.downPayment.value = "";
        elements.loanYears.value = "";
        elements.bankSelect.value = "";
        elements.resultsSection.style.display = "none";
        elements.amortSection.style.display = "none";
        elements.toggleAmortBtn.style.display = "none";
        hideError();
    };

    // ✅ Eventos
    elements.calcBtn.addEventListener("click", calculateLoan);
    elements.resetBtn.addEventListener("click", resetForm);
    elements.modelSelect.addEventListener("change", updatePropertyValue);
    elements.downPayment.addEventListener("input", validateDownPayment);
    elements.loanYears.addEventListener("input", validateForm);

    populateModels();
});
