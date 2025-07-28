// /js/completed.js
import { db, auth } from './firebase.js';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// 📅 Helper to group by date
function getDateLabel(dateStr) {
  const today = new Date();
  const taskDate = new Date(dateStr);
  const diff = (today.setHours(0, 0, 0, 0) - taskDate.setHours(0, 0, 0, 0)) / 86400000;

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';

  return taskDate.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

// 📦 Render a single completed task
function createCompletedTaskElement(task, dateGroup) {
  const item = document.createElement('div');
  item.className = 'task-item';
  item.innerHTML = `
    <span class="task-name task-strike">${task.name}</span>
    <p>${task.description || ''}</p>
  `;
  dateGroup.appendChild(item);
}

// 📋 Load and render completed tasks
async function fetchCompletedTasks() {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, "users", user.uid, "tasks"),
    where("isCompleted", "==", true),
    orderBy("deadline", "desc")
  );

  const snapshot = await getDocs(q);
  const container = document.getElementById('completedTaskListContainer');
  container.innerHTML = '';

  const dateGroups = {};

  snapshot.forEach(doc => {
    const task = doc.data();
    const label = getDateLabel(task.deadline);

    if (!dateGroups[label]) {
      const group = document.createElement('div');
      group.className = 'date-group';
      group.innerHTML = `<h3>${label}</h3>`;
      dateGroups[label] = group;
      container.appendChild(group);
    }

    createCompletedTaskElement(task, dateGroups[label]);
  });
}

// 👤 Wait for user login before fetching
onAuthStateChanged(auth, user => {
  if (user) {
    fetchCompletedTasks();
  } else {
    window.location.href = 'login.html';
  }
});
