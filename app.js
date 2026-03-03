let projects = [];

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

function renderProjects() {
  const list = document.getElementById("projectList");
  list.innerHTML = "";

  projects.sort((a, b) => b.priority - a.priority);

  projects.forEach(project => {
    const li = document.createElement("li");
    li.textContent = `${project.title} — Score: ${project.priority.toFixed(1)}`;
    list.appendChild(li);
  });
}

document.getElementById("addProjectBtn").addEventListener("click", () => {
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

  project.priority = calculatePriority(project);

  projects.push(project);
  renderProjects();
});
