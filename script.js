let timer = null;
let seconds = 0;
let currentTask = null;

const taskInput = document.getElementById("taskInput");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const timerDisplay = document.getElementById("timerDisplay");
const currentTaskDisplay = document.getElementById("currentTask");
const taskHistory = document.getElementById("taskHistory");
const totalTimeDisplay = document.getElementById("totalTime");


document.addEventListener("DOMContentLoaded", loadTasks);

startBtn.addEventListener("click", () => {
  if (!taskInput.value.trim()) {
    alert("Please enter a task name!");
    return;
  }

  currentTask = taskInput.value.trim();
  currentTaskDisplay.textContent = `Working on: ${currentTask}`;
  taskInput.value = "";
  startBtn.disabled = true;
  stopBtn.disabled = false;
  seconds = 0;

  timer = setInterval(updateTimer, 1000);
});

stopBtn.addEventListener("click", () => {
  clearInterval(timer);
  saveTask(currentTask, seconds);
  currentTaskDisplay.textContent = "No task running";
  timerDisplay.textContent = "00:00:00";
  currentTask = null;

  startBtn.disabled = false;
  stopBtn.disabled = true;
});


function formatTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function updateTimer() {
  seconds++;
  timerDisplay.textContent = formatTime(seconds);
}


function saveTask(task, timeSpent) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({
    name: task,
    time: timeSpent,
    date: new Date().toLocaleString()
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  addTaskToDOM(task, timeSpent, new Date().toLocaleString());
  updateTotalTime();
}


function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskHistory.innerHTML = "";
  tasks.forEach(t => addTaskToDOM(t.name, t.time, t.date));
  updateTotalTime();
}


function addTaskToDOM(task, time, date) {
  const li = document.createElement("li");
  li.innerHTML = `<strong>${task}</strong> - ${formatTime(time)} <br><small>${date}</small>`;
  taskHistory.appendChild(li);
}


function updateTotalTime() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let today = new Date().toDateString();
  let total = tasks
    .filter(t => new Date(t.date).toDateString() === today)
    .reduce((sum, t) => sum + t.time, 0);

  totalTimeDisplay.textContent = `Total Time Today: ${formatTime(total)}`;
}
