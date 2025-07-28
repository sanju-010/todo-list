import { db, auth } from './firebase.js';
import {
  collection,
  getDocs,
  query
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// DOM Elements
const calendarGrid = document.getElementById('calendarGrid');
const tasksOfDay = document.getElementById('tasksOfDay');
const selectedDate = document.getElementById('selectedDate');
const monthTitle = document.getElementById('monthTitle');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');

let allTasks = [];
let currentDate = new Date();

// 📌 Format YYYY-MM-DD
function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// 📌 Render the calendar grid
function generateCalendar(year, month, tasksMap) {
  calendarGrid.innerHTML = '';

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // Set month title
  const options = { month: 'long', year: 'numeric' };
  monthTitle.textContent = new Date(year, month).toLocaleDateString('en-US', options);

  // Padding before 1st day
  for (let i = 0; i < startWeekday; i++) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    calendarGrid.appendChild(empty);
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(year, month, day);
    const taskCount = tasksMap[dateStr]?.length || 0;

    const cell = document.createElement('div');
    cell.className = 'day';
    if (new Date().toDateString() === new Date(dateStr).toDateString()) {
      cell.classList.add('today');
    }

    cell.innerHTML = `
      <span>${day}</span>
      ${taskCount ? `<div class="count">${taskCount}</div>` : ''}
    `;

    cell.addEventListener('click', () => showTasksForDate(dateStr));
    calendarGrid.appendChild(cell);
  }
}

// 📌 Show list of tasks for selected date
function showTasksForDate(dateStr) {
  selectedDate.textContent = dateStr;
  tasksOfDay.innerHTML = '';

  const filtered = allTasks.filter(t => t.deadline === dateStr);
  if (filtered.length === 0) {
    tasksOfDay.innerHTML = '<p>No tasks for this date.</p>';
    return;
  }

  filtered.forEach(t => {
    const div = document.createElement('div');
    div.className = 'task-item';
    div.innerHTML = `<strong>${t.name}</strong><br/><small>${t.description || ''}</small>`;
    tasksOfDay.appendChild(div);
  });
}

// 📌 Build taskMap
function buildTaskMap(tasks) {
  const taskMap = {};
  tasks.forEach(t => {
    if (!taskMap[t.deadline]) taskMap[t.deadline] = [];
    taskMap[t.deadline].push(t);
  });
  return taskMap;
}

// 📌 Update calendar when month changes
function updateCalendarView() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const taskMap = buildTaskMap(allTasks);
  generateCalendar(year, month, taskMap);
}

// 📌 Listen for Auth and load tasks
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const q = query(collection(db, "users", user.uid, "tasks"));
  const snapshot = await getDocs(q);
  allTasks = snapshot.docs.map(doc => doc.data());

  updateCalendarView();
});

// 📌 Prev/Next month controls
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendarView();
  });
}
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendarView();
  });
}
