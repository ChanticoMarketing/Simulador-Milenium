<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Simulador de Crédito Inmobiliario</title>
  <style>
    :root {
      --primary-color: #003366;
      --secondary-color: #007bff;
      --light-gray: #f5f5f5;
      --white: #ffffff;
    }

    body {
      background: var(--light-gray);
      font-family: Arial, sans-serif;
      margin: 1rem;
    }

    header {
      background: var(--primary-color);
      color: var(--white);
      text-align: center;
      padding: 1rem;
    }

    .form-group {
      display: grid;
      gap: 1rem;
    }

    .form-group label {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    input,
    select {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
}

<div class="container">
  <h2>Calcule préstamo</h2>
  <p>Complete los siguientes campos para realizar la simulación de un crédito.</p>

  <div class="form-group">
    <label for="developmentSelect">Desarrollo</label>
    <select id="developmentSelect" onchange="handleDevelopmentChange()">
      <option value="" disabled selected>Elige un desarrollo</option>
      <option value="alto">Alta California</option>
      <option value="vista">Vista California</option>
      <option value="bosques">Bosques California</option>
    </select>
  </div>

  <div class="form-group">
    <label for="modelSelect">Modelo</label>
    <select id="modelSelect" onchange="validateFields()">
      <option value="" disabled selected>Elige un modelo</option>
    </select>
  </div>

  <div class="form-group">
    <label for="propertyValue">Valor de la propiedad (MXN)</label>
    <input 
      type="number"
      id="propertyValue"
      placeholder="Ej. 2500000"
      oninput="validateFields()"
    />
  </div>

  <div class="form-group">
    <label for="downPayment">Pago inicial (MXN)</label>
    <input 
      type="number"
      id="downPayment"
      placeholder="Ej. 500000"
      oninput="validateFields()"
    />
  </div>

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

  <div class="form-group">
    <label for="extraPayment">Pago extra mensual (MXN)</label>
    <input 
      type="number"
      id="extraPayment"
      placeholder="Ej. 2000"
      oninput="validateFields()"
    />
  </div>

  <div class="form-group">
    <button class="btn" id="calcBtn" onclick="calculateLoan()" disabled>
      Calcular creditito
    </button>
    <button class="btn" id="toggleAmortTable" onclick="toggleAmortTable()">
      Ver/ocultar tables de amortización
    </button>

  <div id="resultsSection" class="results">
    <h3>Resultados de la Simulación</h3>
    <p id="bankName"></p>
    <p id="interestRate"></p>
    <p id="loanAmount"></p>
    <p id="monthlyPayment"></p>
    <p id="totalPayment"></p>
    <p id="simulationDate" style="font-style: italic;"></p>

    <button class="btn" id="resultsSection" onclick="toggleAmortTable()">
      <h3>Tabla de Amortización</h3>
      <table id="amortizationTable">
        <thead>
          <tr>
            <th>Año</th>
            <th>Pago Anual</th>
            <th>Intereses</th>
            <th>Capital</th>
            <th>Saldo Restante</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>

  <script src="script.js" defer></script>
</body>
</html>
