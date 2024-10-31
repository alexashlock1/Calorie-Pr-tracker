// Helper function to get the date in YYYY-MM-DD format
function getDateString(date) {
  return date.toISOString().split('T')[0];
}

// Initialize logs from localStorage, or create empty logs
let calorieLog = JSON.parse(localStorage.getItem("calorieLog")) || [];
let prLog = JSON.parse(localStorage.getItem("prLog")) || [];

// Generate a unique ID for each calorie entry
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function addCalories() {
  const calories = document.getElementById("calories").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date-selector").value || getDateString(new Date());

  if (!calories) return;

  const entry = { id: generateId(), date, category, calories: parseInt(calories) };
  calorieLog.push(entry);
  localStorage.setItem("calorieLog", JSON.stringify(calorieLog));

  document.getElementById("calories").value = '';
  displayCalories();
}

function deleteCalories(id) {
  calorieLog = calorieLog.filter(entry => entry.id !== id);
  localStorage.setItem("calorieLog", JSON.stringify(calorieLog));
  displayCalories();
}

function displayCalories() {
  const selectedDate = document.getElementById("date-selector").value || getDateString(new Date());
  const dayEntries = calorieLog.filter(entry => entry.date === selectedDate);
  const dateDisplay = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById("displayed-day").textContent = dateDisplay;

  const categories = {
    Breakfast: document.getElementById("breakfast-list"),
    Lunch: document.getElementById("lunch-list"),
    Dinner: document.getElementById("dinner-list"),
    Other: document.getElementById("other-list")
  };

  Object.values(categories).forEach(list => list.innerHTML = '');

  const totals = { Breakfast: 0, Lunch: 0, Dinner: 0, Other: 0 };

  dayEntries.forEach(entry => {
    const list = categories[entry.category];
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.calories} calories`;

    // Add delete button for each calorie entry
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.onclick = () => deleteCalories(entry.id);

    listItem.appendChild(deleteButton);
    list.appendChild(listItem);
    totals[entry.category] += entry.calories;
  });

  document.getElementById("total-calories").innerHTML = `
    <strong>Total Calories:</strong><br>
    Breakfast: ${totals.Breakfast} calories<br>
    Lunch: ${totals.Lunch} calories<br>
    Dinner: ${totals.Dinner} calories<br>
    Other: ${totals.Other} calories<br>
    <strong>Grand Total: ${totals.Breakfast + totals.Lunch + totals.Dinner + totals.Other} calories</strong>
  `;
}

// PR Estimator
function calculatePR() {
  const weight = parseInt(document.getElementById("weight").value);
  const reps = parseInt(document.getElementById("reps").value);
  
  if (!weight || !reps) return;

  const prEstimate = Math.round(weight * (1 + reps / 30));
  document.getElementById("pr-result").textContent = `Estimated PR: ${prEstimate} lbs`;
}

// PR Tracker
function addPR() {
  const exercise = document.getElementById("exercise").value;
  const prWeight = document.getElementById("pr-weight").value;

  if (!exercise || !prWeight) return;

  prLog.push({ exercise, prWeight: parseInt(prWeight) });
  localStorage.setItem("prLog", JSON.stringify(prLog));

  document.getElementById("exercise").value = '';
  document.getElementById("pr-weight").value = '';
  displayPRs();
}

function displayPRs() {
  const prTrackerList = document.getElementById("pr-tracker-list");
  prTrackerList.innerHTML = '';
  prLog.forEach(pr => {
    const listItem = document.createElement("li");
    listItem.textContent = `${pr.exercise}: ${pr.prWeight} lbs`;
    prTrackerList.appendChild(listItem);
  });
}

// Initialize display on page load
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("date-selector").value = getDateString(new Date());
  displayCalories();
  displayPRs();
});
