/*
    Ougaba Gray
    ID: 2405837
    Web Programming – Lab Quiz 1 
    Class: Monday @ 3pm
    Date: December 1, 2025
*/

const STORAGE_KEY = "2405837"; // PART B 1 – localStorage key is my ID num

document.addEventListener("DOMContentLoaded", () => {
  // Form elements
  const form = document.getElementById("rewardForm");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const emailHelp = document.getElementById("emailHelp");
  const statementDate = document.getElementById("statementDate");
  const accountNumber = document.getElementById("accountNumber");
  const cardType = document.getElementById("cardType");
  const totalPurchases = document.getElementById("totalPurchases");
  const message = document.getElementById("message");

  // Result output elements (PART B 4)
  const outName = document.getElementById("outName");
  const outDate = document.getElementById("outDate");
  const outAccount = document.getElementById("outAccount");
  const outService = document.getElementById("outService");
  const outCashBack = document.getElementById("outCashBack");
  const storedDataDiv = document.getElementById("storedData");

  let currentCustomer = null; // holds most recent calculated data

  // PART A 3 – Satement dat should not must not be greater than today
  const today = new Date().toISOString().split("T")[0];
  statementDate.max = today;

  // PART A 6 – Generate random Total Purchases between 1.00 and 3000.00
  function generateRandomTotal() {
    // 6a: Generate number
    const min = 1;
    const max = 3000;
    const cents =
      Math.floor(Math.random() * ((max - min) * 100 + 1)) + min * 100;
    const value = (cents / 100).toFixed(2);

    // 6b: User can't type here because it is disabld
    totalPurchases.value = value;
    totalPurchases.disabled = true;
  }

  generateRandomTotal(); // random value on page load

  // PART B 1 & 2 –  Samples the data to local storage and also makes it load every startuP
  function initSampleData() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const sample = {
        firstName: "Sample",
        lastName: "Customer",
        email: "samplecustomer@gmail.com",
        statementDate: today,
        accountNumber: "123-456-78",
        cardType: "S",
        serviceType: "Hotels",
        totalPurchases: 1200.0,
        cashBack: 60.0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
    }
    displayStoredData();
  }

  function displayStoredData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      storedDataDiv.textContent = "No stored data yet.";
      return;
    }

    const data = JSON.parse(raw);

    // PART B 2 – Display stored data using DOM features
    storedDataDiv.innerHTML = `
      <div class="totals">
        <div class="totals-row"><span>Customer:</span><span>${data.firstName} ${
      data.lastName
    }</span></div>
        <div class="totals-row"><span>Statement Date:</span><span>${
          data.statementDate
        }</span></div>
        <div class="totals-row"><span>Account Number:</span><span>${
          data.accountNumber
        }</span></div>
        <div class="totals-row"><span>Service Type:</span><span>${
          data.serviceType
        }</span></div>
        <div class="totals-row"><span>Total Purchases:</span><span>$${Number(
          data.totalPurchases
        ).toFixed(2)}</span></div>
        <div class="totals-row total"><span>Cash Back:</span><span>$${Number(
          data.cashBack
        ).toFixed(2)}</span></div>
      </div>
    `;
  }

  initSampleData();

  // PART A 1c – Disable name fields when they lose focus
  // Disable EACH name field only when that specific field loses focus
  firstName.addEventListener("blur", () => {
    if (firstName.value.trim() !== "") {
      firstName.disabled = true; // disable only first name
    }
  });

  lastName.addEventListener("blur", () => {
    if (lastName.value.trim() !== "") {
      lastName.disabled = true; // disable only last name
    }
  });

  // Name fields are enabled again on form reset (event trigger = reset button)
  form.addEventListener("reset", () => {
    setTimeout(() => {
      firstName.disabled = false;
      lastName.disabled = false;
      emailHelp.textContent = "";
      message.textContent = "";
      clearOutputs();
      generateRandomTotal();
    }, 0);
  });

  // PART B 5a – Calculate data
  document.getElementById("btnCalculate").addEventListener("click", () => {
    emailHelp.textContent = "";
    message.textContent = "";

    if (!validateForm()) {
      return;
    }

    // Re-generate the total for this calculation run
    generateRandomTotal();
    const total = parseFloat(totalPurchases.value) || 0;

    const serviceRadio = document.querySelector(
      'input[name="serviceType"]:checked'
    );
    const serviceType = serviceRadio ? serviceRadio.value : "";

    const cashback = calculateCashBack(cardType.value, total);

    currentCustomer = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      statementDate: statementDate.value,
      accountNumber: accountNumber.value.trim(),
      cardType: cardType.value,
      serviceType: serviceType,
      totalPurchases: total,
      cashBack: cashback,
    };

    displayResults(currentCustomer);
    message.textContent = "Cash back calculated successfully.";
  });

  // PART B 5b – Output the customer data and store in localStorage
  document.getElementById("btnSave").addEventListener("click", () => {
    if (!currentCustomer) {
      message.textContent = "Please calculate the program data before saving.";
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentCustomer));
    displayStoredData();
    message.textContent =
      "Customer data has been stored in localStorage using my Student ID.";
  });

  // PART B 5c – Reset button logic is handled in the form reset listener above

  // Helper: validate all form rules (PART A 1–4, 5)
  function validateForm() {
    // PART A 1a & 1b – Names > 1 character and all required
    if (
      firstName.value.trim().length <= 1 ||
      lastName.value.trim().length <= 1
    ) {
      message.textContent =
        "maKe sure that your lasy and first name has more than one value for each..";
      return false;
    }

    if (
      !email.value.trim() ||
      !statementDate.value ||
      !accountNumber.value.trim() ||
      !cardType.value ||
      !document.querySelector('input[name="serviceType"]:checked')
    ) {
      message.textContent = "All form fields are required.";
      return false;
    }

    // PART A 2 – Email must include gmail.com and show message if format is wrong
    const emailValue = email.value.trim();
    const gmailPattern = /^[^\s@]+@gmail\.com$/;

    if (!gmailPattern.test(emailValue)) {
      emailHelp.textContent = "Use this email format: abc@gmail.com";
      message.textContent = "Email address must be a valid gmail.com address.";
      return false;
    }

    // PART A 3 – Statement date cannot be greater than today's date
    if (statementDate.value > today) {
      message.textContent =
        "Statement date cannot be greater than today's date.";
      return false;
    }

    // PART A 4 – Account number format 000-000-00
    const accountPattern = /^\d{3}-\d{3}-\d{2}$/;
    if (!accountPattern.test(accountNumber.value.trim())) {
      message.textContent = "Account number must follow the format 000-000-00.";
      return false;
    }

    return true;
  }

  // PART B 3 – Calculate Cash Back Reward based on Credit Card Type
  function calculateCashBack(cardCode, total) {
    let rate = 0;

    // SuperSaver (Code S): 5% cash back for purchases > 500
    if (cardCode === "S" && total > 500) {
      rate = 0.05;
    }

    // PlatinumBlue (Code P): 10% cash back for purchases > 800
    if (cardCode === "P" && total > 800) {
      rate = 0.1;
    }

    return Number((total * rate).toFixed(2));
  }

  // PART B 4 & 7 – Output data neatly using DOM
  function displayResults(customer) {
    outName.textContent = `${customer.firstName} ${customer.lastName}`;
    outDate.textContent = customer.statementDate;
    outAccount.textContent = customer.accountNumber;
    outService.textContent = customer.serviceType;

    if (customer.cashBack > 0) {
      outCashBack.textContent = `$${customer.cashBack.toFixed(2)}`;
    } else {
      outCashBack.textContent = "No Cashback Earned.";
    }
  }

  function clearOutputs() {
    outName.textContent = "–";
    outDate.textContent = "–";
    outAccount.textContent = "–";
    outService.textContent = "–";
    outCashBack.textContent = "–";
  }
});
