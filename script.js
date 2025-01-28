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

// Cargar modelos al seleccionar desarrollo
function handleDevelopmentChange() {
    const development = document.getElementById('developmentSelect').value;
    const modelSelect = document.getElementById('modelSelect');
    
    modelSelect.innerHTML = '<option value="" disabled selected>Elige un modelo</option>';
    models[development].forEach(model => {
        const option = document.createElement('option');
        option.value = model.price;
        option.textContent = `${model.name} - $${model.price.toLocaleString()}`;
        modelSelect.appendChild(option);
    });
    
    modelSelect.disabled = false;
    validateFields();
}

// Actualizar valor de propiedad al seleccionar modelo
function handleModelChange() {
    const modelSelect = document.getElementById('modelSelect');
    document.getElementById('propertyValue').value = modelSelect.value;
    validateFields();
}

// Validar campos del formulario
function validateFields() {
    const requiredFields = [
        'developmentSelect', 'modelSelect', 'propertyValue',
        'downPayment', 'loanYears', 'bankSelect'
    ];

    let isValid = requiredFields.every(id => {
        const element = document.getElementById(id);
        const value = element.value;
        
        if (id === 'downPayment') {
            const propertyValue = parseFloat(document.getElementById('propertyValue').value);
            if (parseFloat(value) >= propertyValue) {
                showError('downPaymentError', 'El pago inicial no puede ser mayor o igual al valor de la propiedad');
                return false;
            }
        }
        
        return value && element.checkValidity();
    });

    document.getElementById('calcBtn').disabled = !isValid;
    return isValid;
}

// Mostrar mensajes de error
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => errorElement.style.display = 'none', 5000);
}

// Calcular préstamo
function calculateLoan() {
    if (!validateFields()) return;

    const propertyValue = parseFloat(document.getElementById('propertyValue').value);
    const downPayment = parseFloat(document.getElementById('downPayment').value);
    const loanYears = parseInt(document.getElementById('loanYears').value);
    const bank = document.getElementById('bankSelect');
    const interestRate = parseFloat(bank.selectedOptions[0].dataset.rate) / 100;
    const extraPayment = parseFloat(document.getElementById('extraPayment').value) || 0;

    const loanAmount = propertyValue - downPayment;
    const monthlyInterest = interestRate / 12;
    const totalPayments = loanYears * 12;

    let monthlyPayment = (loanAmount * monthlyInterest) / 
        (1 - Math.pow(1 + monthlyInterest, -totalPayments));
    monthlyPayment += extraPayment;

    amortizationData = [];
    let balance = loanAmount;
    let currentDate = new Date();

    for (let month = 1; month <= totalPayments && balance > 0; month++) {
        const interest = balance * monthlyInterest;
        const principal = monthlyPayment - interest;
        const actualPayment = Math.min(monthlyPayment, balance + interest);

        amortizationData.push({
            month,
            date: new Date(currentDate.setMonth(currentDate.getMonth() + 1)).toLocaleDateString(),
            payment: actualPayment.toFixed(2),
            interest: interest.toFixed(2),
            principal: principal.toFixed(2),
            balance: (balance - principal).toFixed(2)
        });

        balance -= principal;
        if (balance < 0) balance = 0;
    }

    showResults(loanAmount, monthlyPayment, interestRate);
    updateAmortizationTable();
    create
