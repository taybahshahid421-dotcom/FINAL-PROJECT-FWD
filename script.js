/* ---------- SELECT ELEMENTS ---------- */

const taskForm = document.getElementById("taskForm");

const taskName = document.getElementById("taskName");

const taskSubject = document.getElementById("taskSubject");

const taskDate = document.getElementById("taskDate");

const taskPriority = document.getElementById("taskPriority");

const taskFilter = document.getElementById("taskFilter");

const taskContainer = document.getElementById("taskContainer");

const emptyMessage = document.getElementById("emptyMessage");


const subjectCount = document.getElementById("subjectCount");

const taskCount = document.getElementById("taskCount");

const completedCount = document.getElementById("completedCount");

const pendingCount = document.getElementById("pendingCount");


const progressFill = document.getElementById("progressFill");

const progressText = document.getElementById("progressText");

const progressCircle = document.getElementById("progressCircle");

const progressMessage = document.getElementById("progressMessage");


const heroProgressBar = document.getElementById("heroProgressBar");

const heroCompleted = document.getElementById("heroCompleted");

const heroTotal = document.getElementById("heroTotal");

const heroPercent = document.getElementById("heroPercent");


const menuToggle = document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");


/* ---------- DEFAULT SUBJECT COUNT ---------- */

const defaultSubjects = 4;


/* ---------- LOAD TASKS ---------- */

let tasks =
    JSON.parse(localStorage.getItem("studyPlannerTasks")) || [];


/* ---------- SET MINIMUM DATE TO TODAY ---------- */

const today = new Date();

const year = today.getFullYear();

const month =String(today.getMonth() + 1).padStart(2, "0");
    
const day =String(today.getDate()).padStart(2, "0");
   
taskDate.min = ${year}-${month}-${day};


/* ---------- MOBILE MENU ---------- */

menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("show");

});


document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("show");

    });

});


/* ---------- ADD TASK ---------- */

taskForm.addEventListener("submit", event => {

    event.preventDefault();


    const newTask = {

        id: Date.now(),

        name: taskName.value.trim(),

        subject: taskSubject.value,

        date: taskDate.value,

        priority: taskPriority.value,

        completed: false

    };


    if (
        !newTask.name ||
        !newTask.subject ||
        !newTask.date ||
        !newTask.priority
    ) {

        alert("Please fill in all fields.");

        return;

    }


    tasks.push(newTask);

    saveTasks();

    taskForm.reset();

    taskDate.min = ${year}-${month}-${day};

    displayTasks();

    updateDashboard();

    updateProgress();

});


/* ---------- FILTER TASKS ---------- */

taskFilter.addEventListener("change", displayTasks);


/* ---------- SAVE TASKS ---------- */

function saveTasks() {

    localStorage.setItem(
        "studyPlannerTasks",
        JSON.stringify(tasks)
    );

}


/* ---------- FORMAT DATE ---------- */

function formatDate(dateString) {

    const date =
        new Date(${dateString}T00:00:00);


    return date.toLocaleDateString("en-US", {

        day: "numeric",

        month: "short",

        year: "numeric"

    });

}


/* ---------- DISPLAY TASKS ---------- */

function displayTasks() {

    taskContainer.innerHTML = "";


    const filter = taskFilter.value;


    let filteredTasks = tasks;


    if (filter === "pending") {

   filteredTasks =
            tasks.filter(task => !task.completed);

    }


    if (filter === "completed") {

        filteredTasks =
            tasks.filter(task => task.completed);

    }


    if (filteredTasks.length === 0) {

        const empty =
            document.createElement("div");

        empty.className = "empty-state";


        empty.innerHTML = `

            <div class="empty-icon">
                📋
            </div>

            <h4>
                No tasks found
            </h4>

            <p>
                Add a task or change the filter.
            </p>

        `;


        taskContainer.appendChild(empty);

        return;

    }


    filteredTasks.forEach(task => {

        const card =
            document.createElement("article");


        card.className = "task-item";


        if (task.completed) {

            card.classList.add("completed");

        }


        const priorityClass =

            task.priority === "High"

                ? "priority-high"

                : task.priority === "Medium"

                    ? "priority-medium"

                    : "priority-low";


        card.innerHTML = `

            <div class="task-main">

                <div>

                    <div class="task-title">
                        ${escapeHTML(task.name)}
                    </div>


                    <div class="task-meta">

                        <span class="badge">
                            ${escapeHTML(task.subject)}
                        </span>

                        <span class="badge">
                            📅 ${formatDate(task.date)}
                        </span>

                        <span class="badge ${priorityClass}">
                            ${escapeHTML(task.priority)} Priority
                        </span>

                    </div>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="small-btn complete-btn"
                    onclick="toggleTask(${task.id})"
                >

                    ${task.completed
                        ? "↩️ Undo"
                        : "✓ Complete"}

                </button>


                <button
                    class="small-btn delete-btn"
                    onclick="deleteTask(${task.id})"
                >

                    🗑️ Delete

                </button>

            </div>

        `;


        taskContainer.appendChild(card);

    });

}


/* ---------- ESCAPE USER TEXT ---------- */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* ---------- COMPLETE / UNDO ---------- */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {

                ...task,

                completed: !task.completed

            };

        }


        return task;

    });


    saveTasks();

    displayTasks();

    updateDashboard();
     updateProgress();

}


/* ---------- DELETE TASK ---------- */

function deleteTask(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) {

        return;

    }


    tasks =
        tasks.filter(task => task.id !== id);


    saveTasks();

    displayTasks();

    updateDashboard();

    updateProgress();

}


/* ---------- DASHBOARD ---------- */

function updateDashboard() {

    const total = tasks.length;


    const completed =
        tasks.filter(task => task.completed).length;


    const pending =
        total - completed;


    subjectCount.textContent =
        defaultSubjects;


    taskCount.textContent =
        total;


    completedCount.textContent =
        completed;


    pendingCount.textContent =
        pending;


    heroCompleted.textContent =
        completed;


    heroTotal.textContent =
        total;

}


/* ---------- PROGRESS ---------- */

function updateProgress() {

    const total = tasks.length;


    const completed =
        tasks.filter(task => task.completed).length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    progressFill.style.width =
        ${percentage}%;


    progressText.textContent =
        ${percentage}%;


    progressCircle.textContent =
        ${percentage}%;


    heroProgressBar.style.width =
        ${percentage}%;


    heroPercent.textContent =
        ${percentage}%;


    if (total === 0) {

        progressMessage.textContent =
            "Start adding tasks to begin your progress.";

    }
    else if (percentage === 100) {
        progressMessage.textContent =
            "Excellent! You completed all your tasks. 🎉";
    }
    else if (percentage >= 50) {
        progressMessage.textContent =
            "Great work! Keep going and finish the remaining tasks.";

    }
    else {

        progressMessage.textContent =
            "You have started. Stay consistent and complete your tasks.";

    }
}

       /* ---------- INITIAL PAGE LOAD ---------- */

displayTasks();

updateDashboard();

updateProgress();