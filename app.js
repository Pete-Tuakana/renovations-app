// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHXej4P9Bximr3dLA3A4GbF-R3femko1o",
  authDomain: "reno-app-91ded.firebaseapp.com",
  projectId: "reno-app-91ded",
  storageBucket: "reno-app-91ded.firebasestorage.app",
  messagingSenderId: "947893360118",
  appId: "1:947893360118:web:e0af122d90471665fd63d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let projects = [];

// Priority Logic
function calculatePriority(project) {
  const today = new Date();
  const deadline = new Date(project.deadline);
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let urgencyScore = 0;

  if (diffDays > 30) urgencyScore = 1;
  else if (diffDays > 14) urgencyScore = 3;
  else if (diffDays > 7) urgencyScore = 5;
  else urgencyScore = 8;

  return (project.importance * 3) + urgencyScore - (project.hoursRequired / 2);
}

// Render
function renderProjects() {
  const list = document.getElementById("projectList");
  list.innerHTML = "";

  projects.sort((a, b) => b.priority - a.priority);

  projects.forEach(project => {
    const li = document.createElement("li");
    li.textContent = `${project.title} | ${project.hoursRequired} hrs | Due: ${project.deadline}`;
    list.appendChild(li);
  });
}

function filterByAvailableTime() {

  const availableTime = parseFloat(document.getElementById("availableTime").value);

  if (!availableTime) {
    alert("Enter available time.");
    return;
  }

  const filteredProjects = projects.filter(project =>
    project.hoursRequired <= availableTime
  );

  const list = document.getElementById("projectList");
  list.innerHTML = "";

  filteredProjects.sort((a, b) => b.priority - a.priority);

  filteredProjects.forEach(project => {

    const li = document.createElement("li");

    const date = new Date(project.deadline);
    const formattedDate = date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    li.textContent = `${project.title} | ${project.hoursRequired} hrs | Due: ${formattedDate}`;

    list.appendChild(li);

  });

}

// Load Projects from Firestore
async function loadProjects() {
  projects = [];
  const querySnapshot = await getDocs(collection(db, "projects"));
  querySnapshot.forEach((doc) => {
  const data = doc.data();

  // Skip incomplete records
  if (!data.title || !data.importance || !data.hoursRequired || !data.deadline) {
    return;
  }

  data.priority = calculatePriority(data);
  projects.push(data);
});
  renderProjects();
}

// Add Project
document.getElementById("addProjectBtn").addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const importance = parseInt(document.getElementById("importance").value);
  const hoursRequired = parseInt(document.getElementById("hoursRequired").value);
  const deadline = document.getElementById("deadline").value;

  if (!title || !importance || !hoursRequired || !deadline) {
    alert("Please fill in all fields.");
    return;
  }

  const project = {
    title,
    importance,
    hoursRequired,
    deadline
  };

  await addDoc(collection(db, "projects"), project);

  document.getElementById("title").value = "";
  document.getElementById("importance").value = "";
  document.getElementById("hoursRequired").value = "";
  document.getElementById("deadline").value = "";

  loadProjects();
});

// Initial load
loadProjects();

document.getElementById("filterBtn").addEventListener("click", filterByAvailableTime);
