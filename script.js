// ARRAY 

    let appliances = []

// VARIABLE 

let electricityRate = 0;

// FORM AND INPUT
const applianceForm = document.getElementById("appliance-form")
const nameInput = document.getElementById("appliance-name")
const wattsInput = document.getElementById("watts")
const quantityInput = document.getElementById("quantity")
const hoursInput = document.getElementById("hours")

const rateInput = document.getElementById("rate-input");

// DASHBOARD DISPLAY
const dailyKwhDisplay = document.getElementById("daily-kwh")
const dailyCostDisplay = document.getElementById("daily-cost")
const weeklyCostDisplay = document.getElementById("weekly-cost")
const monthlyCostDisplay = document.getElementById("monthly-cost")

// APPLIANCE LIST
const applianceList = document.getElementById("appliance-list")
const highestConsumerText = document.getElementById("highest-consumer-text")
const smartMessageText = document.getElementById("smart-message-text")

// BUTTON
const resetBtn = document.getElementById("reset-btn")
const themeToggle = document.getElementById("theme-toggle")

// EVENTS
applianceForm.addEventListener("submit", addAppliance);
rateInput.addEventListener ("input", updateRate);
themeToggle.addEventListener("click", toggleTheme);
resetBtn.addEventListener("click", resetCalculator);

// FUNCTION
function updateRate() {
    
    electricityRate = parseFloat(rateInput.value);
    if (isNaN(electricityRate)) {
        electricityRate = 0; 
    }   
    updateUI(); 

}

function addAppliance(event) {
    event.preventDefault(); 

    let name = nameInput.value;
    let watts = parseFloat(wattsInput.value);
    let quantity = parseInt(quantityInput.value); 
    let hours = parseFloat(hoursInput.value);

    let newAppliance = {
        name: name,
        watts: watts,
        quantity: quantity,
        hours: hours
    };

    appliances.push(newAppliance);

    applianceForm.reset();

    updateUI();
}

// --- IF USER Delete appliance ---
function deleteAppliance(index) {
    appliances.splice(index, 1);
    updateUI();
}

// --- THE MASTER FUNCTION: Updates everything on the screen ---
function updateUI() {
    let totalDailyKwh = 0;
    let totalDailyCost = 0;
    let highestKwh = 0;
    let highestApplianceName = "None";

    // LOOP 1: Calculate totals and find the highest consumer
    for (let i = 0; i < appliances.length; i++) {
        let app = appliances[i]; // Get the current appliance object

        // Calculate usage for this specific appliance
        let dailyKwh = (app.watts * app.hours * app.quantity) / 1000;
        let dailyCost = dailyKwh * electricityRate;

        // Add to our running totals
        totalDailyKwh = totalDailyKwh + dailyKwh;
        totalDailyCost = totalDailyCost + dailyCost;

        // Check if this appliance is the highest consumer
        if (dailyKwh > highestKwh) {
            highestKwh = dailyKwh;
            highestApplianceName = app.name;
        }
    }

// Calculate weekly and monthly costs
let totalWeeklyCost = totalDailyCost * 7;
let totalMonthlyCost = totalDailyCost * 30;

// UPDATE THE DASHBOARD
// toFixed(2) rounds the number to 2 decimal places (e.g., 1.50)
dailyKwhDisplay.textContent = totalDailyKwh.toFixed(2) + " kWh";
dailyCostDisplay.textContent = "₦" + totalDailyCost.toFixed(2);
weeklyCostDisplay.textContent = "₦" + totalWeeklyCost.toFixed(2);
monthlyCostDisplay.textContent = "₦" + totalMonthlyCost.toFixed(2);

// UPDATE THE APPLIANCE LIST
if (appliances.length === 0) {
    applianceList.innerHTML = '<li class="empty-message">No appliances added yet. Add one above!</li>';
} else {
    let listHTML = ""; // We will build a giant string of HTML here
    
    // LOOP 2: Build the HTML for every appliance in the array
    for (let i = 0; i < appliances.length; i++) {
        let app = appliances[i];
        let dailyKwh = (app.watts * app.hours * app.quantity) / 1000;
        let dailyCost = dailyKwh * electricityRate;

        // NEW TRICK: Template Literals (using backticks ` `)
        // This lets us mix text and variables easily using ${variableName}
        listHTML += `
            <li>
                <div>
                    <strong>${app.name}</strong> <br>
                    ${app.watts}W × ${app.hours} Hours × ${app.quantity} <br>
                    Daily Usage: ${dailyKwh.toFixed(2)} kWh | Cost: ₦${dailyCost.toFixed(2)}
                </div>
                <button class="delete-btn" onclick="deleteAppliance(${i})">Delete</button>
            </li>
        `;
    }
    // Inject the built HTML string into the <ul>
    applianceList.innerHTML = listHTML;
}  
 // UPDATE HIGHEST CONSUMER
 if (appliances.length > 0) {
    highestConsumerText.innerHTML = `<strong>${highestApplianceName}</strong> <br> ${highestKwh.toFixed(2)} kWh per day <br><br> Your ${highestApplianceName} currently uses the most electricity.`;
} else {
    highestConsumerText.textContent = "Add appliances to see this.";
}

// UPDATE SMART MESSAGE (Using if / else if / else)
if (appliances.length === 0) {
    smartMessageText.textContent = "Add appliances to get your personalized message.";
    smartMessageText.style.color = "inherit";
} else if (totalDailyKwh < 5) {
    smartMessageText.textContent = "🟢 Great! Your estimated electricity consumption is relatively low.";
    smartMessageText.style.color = "green";
} else if (totalDailyKwh < 15) {
    smartMessageText.textContent = "🟡 Your electricity consumption is moderate. Keep an eye on appliances that run for many hours.";
    smartMessageText.style.color = "orange";
} else {
    smartMessageText.textContent = "🔴 Your estimated electricity consumption is high. Check which appliances are using the most power.";
    smartMessageText.style.color = "red";
}
}

// --- Reset the calculator ---
function resetCalculator() {
// confirm() creates a simple browser popup with "OK" and "Cancel" buttons
let isSure = confirm("Are you sure you want to reset the calculator? All appliances will be deleted.");

if (isSure) {
    appliances = []; // Empty the array completely
    rateInput.value = ""; // Clear the rate input box
    electricityRate = 0; // Reset the rate variable
    updateUI(); // Update the screen to show zeros
}
}

// --- Toggle Light/Dark mode ---
function toggleTheme() {
// classList.toggle is magic: it ADDS the class if it's missing, and REMOVES it if it's there
document.body.classList.toggle("dark-mode");

// Change the text on the button depending on the current mode
if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️ Light Mode";
} else {
    themeToggle.textContent = "🌙 Dark Mode";
}
}
