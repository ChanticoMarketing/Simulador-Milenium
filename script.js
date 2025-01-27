<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Simulador de Crédito Inmobiliario</title>
  <!-- Vincular el CSS -->
  <link rel="stylesheet" href="styles.css" />
  <!-- Librerías externas necesarias -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jspdf"></script>
  <script src="https://cdn.jsdelivr.net/npm/jspdf-autotable"></script>
</head>
<body>
  <header>
    <img 
      src="https://drive.google.com/uc?export=view&id=1NQ0AWtd__HVjTWs5BYy4vvSv_1dNp8fX" 
      alt="Logo"
      class="logo"
    />
    <h1>Simulador de Crédito Inmobiliario</h1>
  </header>

  <div class="container">
    <h2>Calcule su préstamo</h2>
    <p>Complete los siguientes campos para realizar la simulación de su crédito.</p>

    <!-- FORMULARIO -->
    <div class="form-grid">
      <!-- Desarrollo -->
      <div class="form-group">
        <label for="developmentSelect">Desarrollo</label>
        <select id="developmentSelect" onchange="handleDevelopmentChange()">
          <option value="" disabled selected>Elige un desarrollo</option>
          <option value="alta">Alta California</option>
          <option value="vista">Vista California</option>
          <option value="bosques">Bosques California</option>
        </select>
      </div>

      <!-- Modelo -->
      <div class="form-group">
        <label for="modelSelect">Modelo</label>
        <select id="modelSelect" onchange="handleModelChange()" disabled>
          <option value="" disabled selected>Elige un modelo</option>
        </select>
      </div>

      <!-- Valor de la propiedad -->
      <div class="form-group">
        <label for="propertyValue">Valor de la propiedad (MXN)</label>
        <input 
          type="number"
          id="propertyValue"
          placeholder="Ej. 2500000"
          oninput="validateFields()"
        />
      </div>

      <!-- Pago inicial -->
      <div class="form-group">
        <label for="downPayment">Pago inicial (MXN)</label>
        <input
          type="number"
          id="downPayment"
          placeholder="Ej. 500000"
          oninput="validateFields()"
        />
      </div>

      <!-- Plazo en años -->
      <div class="form-group">
        <label for="loanYears">Plazo del crédito (años)</label>
        <input
          type="number"
          id="loanYears"
          placeholder="Ej. 20"
          oninput="validateFields()"
        />
      </div>

      <!-- Institución financiera -->
      <div class="form-group">
        <label for="bankSelect">Institución Financiera</label>
        <select id="bankSelect" onchange="validateFields()">
          <option value="" disabled selected>Elige una institución</option>
          <option value="infonavit" data-rate="8.0">INFONAVIT ~ 8.0%</option>
          <option value="fovissste" data-rate="9.55">FOVISSSTE ~ 9.55%</option>
          <option value="bbva" data-rate="8.85">BBVA ~ 8.85%</option>
          <option value="santander" data-rate="8.85">Santander ~ 8.85%</option>
        </select>
      </div>

      <!-- Pago extra -->
      <div class="form-group">
        <label for="extraPayment">Pago extra mensual (MXN)</label>
        <input
          type="number"
          id="extraPayment"
          placeholder="Ej. 2000"
          oninput="validateFields()"
        />
      </div>
    </div>

    <!-- Botones -->
    <button class="btn" id="calcBtn" onclick="calculateLoan()" disabled>
      Calcular crédito
    </button>
    <button class="btn" onclick="resetForm()">Limpiar campos</button>

    <!-- Resultados -->
    <div id="resultsSection" class="results" style="display: none;">
      <h3>Resultados de la Simulación</h3>
      <p id="bankName"></p>
      <p id="interestRate"></p>
      <p id="loanAmount"></p>
      <p id="monthlyPayment"></p>
      <p id="totalPayment"></p>
      <p id="simulationDate" style="font-style: italic;"></p>

      <button class="btn" onclick="toggleAmortTable()">
        Ver/ocultar tabla de amortización
      </button>
      <button class="btn" onclick="generatePDF()">
        Descargar reporte en PDF
      </button>

      <!-- Tabla de amortización -->
      <div id="amortSection" style="display: none;">
        <h3>Tabla de Amortización</h3>
        <table id="amortizationTable">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Fecha de Pago</th>
              <th>Pago Mensual</th>
              <th>Intereses</th>
              <th>Capital</th>
              <th>Saldo Restante</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div class="chart-container">
          <canvas id="chart"></canvas>
        </div>
      </div>
    </div>
  </div>

  <!-- Vincular el JS -->
  <script src="script.js" defer></script>
</body>
</html>
