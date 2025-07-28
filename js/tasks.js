// /js/tasks.js

import { db, auth } from './firebase.js';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    serverTimestamp,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// 📌 Add Task Modal Elements
const modal = document.getElementById('addTaskModal');
const openBtn = document.getElementById('addTaskBtn');
const cancelBtn = document.getElementById('cancelAddTask');
const submitBtn = document.getElementById('submitAddTask');

// Show modal
if (openBtn) openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
// Show modal with today's date autofilled
if (openBtn) {
    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');

        // Autofill today's date
        const dateInput = document.getElementById('taskDeadline');
        if (!dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    });
}

// Hide modal
if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

// Add Task
if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
        const name = document.getElementById('taskName').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        let deadline = document.getElementById('taskDeadline').value;
        if (!deadline) {
            const today = new Date();
            deadline = today.toISOString().split('T')[0]; // format: YYYY-MM-DD
        }


        if (!name || !deadline) {
            showToast('Please fill task name and date');
            return;
        }

        const user = auth.currentUser;
        if (!user) return;

        try {
            await addDoc(collection(db, "users", user.uid, "tasks"), {
                name,
                description,
                deadline,
                isCompleted: false,
                createdAt: serverTimestamp()
            });

            modal.classList.add('hidden');
            document.getElementById('taskName').value = '';
            document.getElementById('taskDescription').value = '';
            document.getElementById('taskDeadline').value = '';
            showToast('Task added!');
            fetchTasks(); // Reload tasks

        } catch (e) {
            showToast('Error adding task: ' + e.message);
        }
    });
}

// 📌 Helper: Label by Date
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

// 📌 Render a task item
function createTaskElement(task, taskId, dateGroup, userId) {
    const item = document.createElement('div');
    item.className = 'task-item';
    item.innerHTML = `
    <div class="task-name flex">
        <span >${task.name}</span>
        <input type="checkbox" />
    </div>
    <div class="desc-name flex">
        <span class="task-name">${task.description}</span>
        <span class="task-name">${task.deadline}</span>
    </div>
    `;
    // <button class="openBtn">Open</button>

    // Description toggle
    // const desc = document.createElement('p');
    // desc.textContent = task.description || '';
    // desc.style.display = 'none';
    // item.appendChild(desc);

    // item.querySelector('.openBtn').addEventListener('click', () => {
    //     desc.style.display = desc.style.display === 'none' ? 'block' : 'none';
    // });

    // Completion logic
    item.querySelector('input[type="checkbox"]').addEventListener('change', async () => {
        item.classList.add('task-strike');
        setTimeout(async () => {
            item.remove(); // hide from list

            const ref = doc(db, "users", userId, "tasks", taskId);
            await updateDoc(ref, { isCompleted: true });

        }, 2000);
    });

    dateGroup.appendChild(item);
}

// 📌 Fetch and render all active tasks
async function fetchTasks() {
    const user = auth.currentUser;
    // console.log("Current user:", auth.currentUser);

    if (!user) return;

    const q = query(
        collection(db, "users", user.uid, "tasks"),
        where("isCompleted", "==", false),
        orderBy("deadline", "desc")
    );

    const snapshot = await getDocs(q);
    const taskContainer = document.getElementById('taskListContainer');
    taskContainer.innerHTML = '';

    const dateGroups = {};

    snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const label = getDateLabel(data.deadline);

        if (!dateGroups[label]) {
            const group = document.createElement('div');
            group.className = 'date-group';
            group.innerHTML = `<h3>${label}</h3>`;
            dateGroups[label] = group;
            taskContainer.appendChild(group);
        }

        createTaskElement(data, docSnap.id, dateGroups[label], user.uid);
    });
}

// Run on load
window.addEventListener('DOMContentLoaded', fetchTasks);

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchTasks(); // ✅ Safe to fetch now
    } else {
        console.warn("Not logged in");
        window.location.href = "login.html";
    }
});


// Tost Message
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hidden');
    }, duration);
}
