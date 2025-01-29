document.addEventListener("DOMContentLoaded", function () {
  const toggleAmortBtn = document.getElementById("toggleAmortBtn");
  if (toggleAmortBtn) {
    toggleAmortBtn.style.display = "none";
  }
});

function toggleAmortTable() {
  const amortSection = document.getElementById("amortSection");
  if (amortSection.style.display === "none" || amortSection.style.display === "") {
    amortSection.style.display = "block";
    fillAmortizationTable();
  } else {
    amortSection.style.display = "none";
  }
}

function fillAmortizationTable() {
  const tableBody = document.querySelector("#amortizationTable tbody");
  tableBody.innerHTML = "";

  amortizationData.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.year}</td><td>${row.annualPayment}</td><td>${row.interestPaid}</td><td>${row.capitalPaid}</td><td>${row.remainingBalance}</td>`;
    tableBody.appendChild(tr);
  });

  const toggleAmortBtn = document.getElementById("toggleAmortBtn");
  if (toggleAmortBtn) {
    toggleAmortBtn.style.display = "inline-block";
  }
}
