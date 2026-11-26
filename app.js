const STORAGE_KEY = "studentPerformanceStudents";

let students = [];

try {
    const savedStudents = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (Array.isArray(savedStudents)) {
        students = savedStudents;
    }
} catch {
    students = [];
}

const studentForm = document.getElementById("student-form");
const studentNameInput = document.getElementById("student-name");
const scoreOneInput = document.getElementById("score-one");
const scoreTwoInput = document.getElementById("score-two");
const scoreThreeInput = document.getElementById("score-three");

const studentResults = document.getElementById("student-results");
const emptyMessage = document.getElementById("empty-message");

const totalStudents = document.getElementById("total-students");
const classAverage = document.getElementById("class-average");
const passedCount = document.getElementById("passed-count");
const supportCount = document.getElementById("support-count");

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = studentNameInput.value.trim();

    const scores = [
        Number(scoreOneInput.value),
        Number(scoreTwoInput.value),
        Number(scoreThreeInput.value)
    ];

    const average =
        (scores[0] + scores[1] + scores[2]) / scores.length;

    const status = average >= 75
        ? "Passed"
        : "Needs Extra Support";

    students.push({
        name: name,
        scores: scores,
        average: average,
        status: status
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));

    renderStudents();
    studentForm.reset();
});

function renderStudents() {
    studentResults.replaceChildren();

    let passed = 0;
    let needsSupport = 0;
    let totalAverage = 0;

    students.forEach(function (student) {
        const row = document.createElement("tr");

        const values = [
            student.name,
            student.scores[0].toFixed(1),
            student.scores[1].toFixed(1),
            student.scores[2].toFixed(1),
            student.average.toFixed(2),
            student.status
        ];

        values.forEach(function (value, index) {
            const cell = document.createElement("td");
            cell.textContent = value;

            if (index === 5 && student.status === "Needs Extra Support") {
                cell.classList.add("needs-support");
            }

            row.appendChild(cell);
        });

        studentResults.appendChild(row);
        totalAverage += student.average;

        if (student.status === "Passed") {
            passed += 1;
        } else {
            needsSupport += 1;
        }
    });

    totalStudents.textContent = students.length;
    passedCount.textContent = passed;
    supportCount.textContent = needsSupport;

    classAverage.textContent = students.length > 0
        ? (totalAverage / students.length).toFixed(2)
        : "0";

    emptyMessage.hidden = students.length > 0;
}

renderStudents();