"use strict";

const SUBJECTS = ["Math", "English", "Science", "Social Studies"];
const STORAGE_KEY = "examinationRankingSystem.v1";

const SAMPLE = [
  { name: "John", scores: [80, 70, 90, 75] },
  { name: "Abdulsalam", scores: [90, 90, 90, 90] },
  { name: "Oke", scores: [88, 99, 67, 87] },
  { name: "Kunle", scores: [22, 54, 12, 10] },
  { name: "Sola", scores: [97, 79, 88, 98] }
];

const PYTHON_CODE = `
import json

def calculate_total(scores):
    return sum(scores)

def calculate_average(total, num_subjects):
    return round(total / num_subjects, 2)

def determine_status(average, pass_mark=50):
    if average >= pass_mark:
        return "Pass"
    else:
        return "Fail"

def rank_students(students):
    ranked_students = sorted(
        students,
        key=lambda student: float(student["Total"]),
        reverse=True
    )
    for position, student in enumerate(ranked_students, start=1):
        student["Position"] = position
    return ranked_students

def search_student(students, name):
    name = name.lower().strip()
    for student in students:
        if student["Name"].lower() == name:
            return student
    return None

def calculate_class_average(students):
    if len(students) == 0:
        return 0
    total_average = sum(float(student["Average"]) for student in students)
    return round(total_average / len(students), 2)
`;

const GLUE_CODE = `
import csv, io

SUBJECTS = ["Math", "English", "Science", "Social Studies"]

def process(data_json):
    entries = json.loads(data_json)
    records = []
    for entry in entries:
        scores = [float(x) for x in entry["scores"]]
        total = calculate_total(scores)
        average = calculate_average(total, len(scores))
        record = {
            "Id": entry["id"],
            "Name": entry["name"],
            "Total": total,
            "Average": average,
            "Status": determine_status(average),
            "Position": 0
        }
        for subject, score in zip(SUBJECTS, scores):
            record[subject] = score
        records.append(record)

    ranked = rank_students(records)
    passed = sum(1 for student in ranked if student["Status"] == "Pass")

    return json.dumps({
        "students": ranked,
        "classAverage": calculate_class_average(ranked),
        "passed": passed,
        "failed": len(ranked) - passed,
        "highest": ranked[0] if ranked else None,
        "lowest": ranked[-1] if ranked else None
    })

def to_csv(data_json):
    rows = json.loads(data_json)
    fieldnames = ["Name"] + SUBJECTS + ["Total", "Average", "Status", "Position"]
    output = io.StringIO()
    writer = csv.DictWriter(
        output,
        fieldnames=fieldnames,
        extrasaction="ignore",
        lineterminator="\\n"
    )
    writer.writeheader()
    for row in rows:
        writer.writerow(row)
    return output.getvalue()

def run_checks():
    results = []

    def check(label, condition):
        results.append([label, bool(condition)])

    check("Total of 80, 70, 90, 75 is 315",
          calculate_total([80, 70, 90, 75]) == 315)
    check("Total of all zeros is 0",
          calculate_total([0, 0, 0, 0]) == 0)
    check("Average of 315 over 4 subjects is 78.75",
          calculate_average(315, 4) == 78.75)
    check("Average of 300 over 3 subjects is 100.0",
          calculate_average(300, 3) == 100.0)
    check("78.75 is a Pass", determine_status(78.75) == "Pass")
    check("49.9 is a Fail", determine_status(49.9) == "Fail")
    check("50.0 is a Pass (exact pass mark)",
          determine_status(50.0) == "Pass")

    ranked = rank_students([
        {"Name": "John", "Total": 200},
        {"Name": "Mary", "Total": 315}
    ])
    check("Highest total ranks first",
          ranked[0]["Name"] == "Mary" and ranked[0]["Position"] == 1)
    check("Next total ranks second",
          ranked[1]["Name"] == "John" and ranked[1]["Position"] == 2)

    people = [{"Name": "John"}, {"Name": "Mary"}]
    check("Search finds John",
          search_student(people, "John") == {"Name": "John"})
    check("Search ignores capital letters",
          search_student(people, "MARY") == {"Name": "Mary"})
    check("Search returns None when nobody matches",
          search_student(people, "Peter") is None)

    return json.dumps(results)
`;

const $ = (id) => document.getElementById(id);

let py = null;
let schoolData = { classes: [], activeClassId: null };
let ranked = [];
let editingId = null;

function createId(prefix) {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefix}_${window.crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function createSampleClass() {
  return {
    id: "sample-class",
    name: "Sample data",
    students: SAMPLE.map((student) => ({
      id: createId("student"),
      name: student.name,
      scores: [...student.scores]
    }))
  };
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schoolData));
    setStatus("Python is ready. Changes are saved in this browser.");
    return true;
  } catch (error) {
    showMessage(
      "form-msg",
      "Could not save your records. Browser storage may be full or unavailable. Export a backup before continuing.",
      true
    );
    setStatus("Storage error: your latest changes may not be saved.");
    return false;
  }
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    const sampleClass = createSampleClass();
    schoolData = {
      classes: [sampleClass],
      activeClassId: sampleClass.id
    };
    saveData();
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    if (!parsed || !Array.isArray(parsed.classes)) {
      throw new Error("Invalid saved data");
    }

    schoolData = parsed;
    schoolData.classes = schoolData.classes.map((classFile) => ({
      id: classFile.id || createId("class"),
      name: classFile.name || "Untitled class",
      students: Array.isArray(classFile.students)
        ? classFile.students.map((student) => ({
            id: student.id || createId("student"),
            name: String(student.name || ""),
            scores: Array.isArray(student.scores) ? student.scores : []
          }))
        : []
    }));

    if (!schoolData.classes.some((item) => item.id === schoolData.activeClassId)) {
      schoolData.activeClassId = schoolData.classes[0]?.id || null;
    }

    if (!schoolData.classes.some((item) => item.id === "sample-class")) {
      schoolData.classes.unshift(createSampleClass());
    }
    saveData();
  } catch (error) {
    alert("The saved examination data could not be read. A fresh sample file will be created. If you have an exported backup, do not overwrite it.");
    const sampleClass = createSampleClass();
    schoolData = { classes: [sampleClass], activeClassId: sampleClass.id };
    saveData();
  }
}

function getActiveClass() {
  return schoolData.classes.find(
    (classFile) => classFile.id === schoolData.activeClassId
  ) || null;
}

function setStatus(message) {
  $("status").textContent = message;
}

function setReady(ready) {
  document.querySelectorAll(
    "#add-form button[type=submit], #load-sample, #save-csv, #search-form button, #run-tests, #class-select, #create-class, #rename-class, #delete-class, #global-search-form button, #backup-json, #restore-json"
  ).forEach((button) => {
    button.disabled = !ready;
  });
}

function showMessage(id, message, isError) {
  const element = $(id);
  element.textContent = message;
  element.className = isError ? "msg error" : "msg";
}

function makeCell(tag, text) {
  const cell = document.createElement(tag);
  cell.textContent = text;
  return cell;
}

function renderClassManager() {
  const select = $("class-select");
  select.replaceChildren();

  schoolData.classes.forEach((classFile) => {
    const option = document.createElement("option");
    option.value = classFile.id;
    option.textContent = `${classFile.name} (${classFile.students.length} students)`;
    select.append(option);
  });

  if (schoolData.activeClassId) {
    select.value = schoolData.activeClassId;
  }

  const activeClass = getActiveClass();
  $("active-class-note").textContent = activeClass
    ? `Currently working in: ${activeClass.name}. Records added now will belong to this class file.`
    : "Create a class file to begin adding student records.";

  $("rename-class").disabled = !activeClass || activeClass.id === "sample-class";
  $("delete-class").disabled = !activeClass || activeClass.id === "sample-class";
}

function renderReport(result) {
  const body = $("report-body");
  body.replaceChildren();

  ranked = result ? result.students : [];
  $("empty").hidden = ranked.length > 0;
  $("stats").hidden = ranked.length === 0;

  if (!result || ranked.length === 0) {
    $("stats").replaceChildren();
    return;
  }

  ranked.forEach((student) => {
    const row = document.createElement("tr");
    if (student.Position === 1) row.className = "first";

    row.append(
      makeCell("td", student.Position),
      makeCell("td", student.Name),
      makeCell("td", student.Total),
      makeCell("td", student.Average)
    );

    const statusCell = document.createElement("td");
    const badge = makeCell("span", student.Status);
    badge.className = "badge " + student.Status.toLowerCase();
    statusCell.append(badge);
    row.append(statusCell);

    const editCell = document.createElement("td");
    const editButton = makeCell("button", "Edit");
    editButton.type = "button";
    editButton.className = "btn";
    editButton.setAttribute("aria-label", "Edit " + student.Name);
    editButton.addEventListener("click", () => startEdit(student.Id));
    editCell.append(editButton);
    row.append(editCell);

    body.append(row);
  });

  const stats = $("stats");
  stats.replaceChildren();

  [
    [result.classAverage, "Class average"],
    [`${result.passed} passed, ${result.failed} failed`, "Results"],
    [`${result.highest.Name} (${result.highest.Total})`, "Highest scorer"],
    [`${result.lowest.Name} (${result.lowest.Total})`, "Lowest scorer"]
  ].forEach(([value, label]) => {
    const box = document.createElement("div");
    box.className = "stat";
    const strong = makeCell("b", value);
    const small = makeCell("span", label);
    box.append(strong, small);
    stats.append(box);
  });
}

function refresh() {
  renderClassManager();

  if (!py) return;

  const activeClass = getActiveClass();
  const result = activeClass && activeClass.students.length
    ? JSON.parse(py.globals.get("process")(JSON.stringify(activeClass.students)))
    : null;

  renderReport(result);
}

function addStudent(event) {
  event.preventDefault();

  const activeClass = getActiveClass();
  if (!activeClass) {
    showMessage("form-msg", "Create or select a class file first.", true);
    return;
  }

  const name = $("name").value.trim();
  if (!name) {
    showMessage("form-msg", "Name cannot be empty.", true);
    return;
  }

  const scores = [];
  for (let index = 0; index < SUBJECTS.length; index++) {
    const raw = $("s" + index).value.trim();
    const score = Number(raw);

    if (raw === "" || !Number.isFinite(score)) {
      showMessage("form-msg", `Enter a valid number for ${SUBJECTS[index]}.`, true);
      return;
    }
    if (score < 0 || score > 100) {
      showMessage("form-msg", `${SUBJECTS[index]} score must be between 0 and 100.`, true);
      return;
    }
    scores.push(score);
  }

  if (editingId !== null) {
    const student = activeClass.students.find((item) => item.id === editingId);
    if (!student) {
      showMessage("form-msg", "This student record could not be found.", true);
      cancelEdit(false);
      return;
    }
    student.name = name;
    student.scores = scores;
    saveData();
    refresh();
    showMessage("form-msg", `${name}'s record was updated successfully.`, false);
    cancelEdit(true);
  } else {
    activeClass.students.push({
      id: createId("student"),
      name,
      scores
    });
    saveData();
    refresh();
    showMessage("form-msg", `${name}'s record was added to ${activeClass.name}.`, false);
    $("add-form").reset();
  }

  $("name").focus();
}

function startEdit(studentId) {
  const activeClass = getActiveClass();
  const student = activeClass?.students.find((item) => item.id === studentId);
  if (!student) return;

  editingId = studentId;
  $("name").value = student.name;
  student.scores.forEach((score, index) => {
    $("s" + index).value = score;
  });

  $("add-h").textContent = "Edit a record";
  document.querySelector("#add-form button[type=submit]").textContent = "Update record";
  $("cancel-edit").hidden = false;
  showMessage("form-msg", `Editing ${student.name}. Change the details and select Update record.`, false);
  $("name").focus();
}

function cancelEdit(keepMessage) {
  editingId = null;
  $("add-form").reset();
  $("add-h").textContent = "Add a record";
  document.querySelector("#add-form button[type=submit]").textContent = "Add record";
  $("cancel-edit").hidden = true;
  if (!keepMessage) showMessage("form-msg", "", false);
}

function createClass() {
  const name = prompt("Enter the class name (for example, JSS 1):");
  if (name === null) return;

  const cleanName = name.trim();
  if (!cleanName) {
    alert("Class name cannot be empty.");
    return;
  }

  const duplicate = schoolData.classes.some(
    (classFile) => classFile.name.toLowerCase() === cleanName.toLowerCase()
  );
  if (duplicate) {
    alert("A class file with that name already exists.");
    return;
  }

  const newClass = {
    id: createId("class"),
    name: cleanName,
    students: []
  };

  schoolData.classes.push(newClass);
  schoolData.activeClassId = newClass.id;
  cancelEdit(false);
  saveData();
  refresh();
  showMessage("form-msg", `The ${cleanName} class file has been created. You can now add students.`, false);
}

function renameClass() {
  const activeClass = getActiveClass();
  if (!activeClass || activeClass.id === "sample-class") return;

  const name = prompt("Enter the new class name:", activeClass.name);
  if (name === null) return;

  const cleanName = name.trim();
  if (!cleanName) {
    alert("Class name cannot be empty.");
    return;
  }

  const duplicate = schoolData.classes.some(
    (classFile) => classFile.id !== activeClass.id &&
      classFile.name.toLowerCase() === cleanName.toLowerCase()
  );
  if (duplicate) {
    alert("Another class file already uses that name.");
    return;
  }

  activeClass.name = cleanName;
  saveData();
  refresh();
}

function deleteClass() {
  const activeClass = getActiveClass();
  if (!activeClass || activeClass.id === "sample-class") return;

  const confirmed = confirm(
    `Delete "${activeClass.name}" and all ${activeClass.students.length} student record(s)? This cannot be undone unless you have a backup.`
  );
  if (!confirmed) return;

  schoolData.classes = schoolData.classes.filter(
    (classFile) => classFile.id !== activeClass.id
  );
  schoolData.activeClassId = schoolData.classes[0]?.id || null;
  cancelEdit(false);
  saveData();
  refresh();
  showMessage("form-msg", "The class file was deleted.", false);
}

function switchClass() {
  schoolData.activeClassId = $("class-select").value;
  cancelEdit(false);
  saveData();
  refresh();
  showMessage("form-msg", "", false);
  showMessage("search-result", "", false);
}

function saveCsv() {
  if (!ranked.length) {
    showMessage("form-msg", "There are no records in this class to export.", true);
    return;
  }

  const csvText = py.globals.get("to_csv")(JSON.stringify(ranked));
  const activeClass = getActiveClass();
  downloadFile(csvText, `${safeFileName(activeClass.name)}-students.csv`, "text/csv;charset=utf-8");
  showMessage("form-msg", "The current class records were exported as a CSV file.", false);
}

function searchStudent(event) {
  event.preventDefault();
  const name = $("search-name").value.trim();

  if (!name) {
    showMessage("search-result", "Enter a student name to search.", true);
    return;
  }

  const activeClass = getActiveClass();
  const found = activeClass?.students.find(
    (student) => student.name.toLowerCase() === name.toLowerCase()
  );

  if (!found) {
    showMessage("search-result", `No student named "${name}" was found in ${activeClass?.name || "this class"}.`, true);
    return;
  }

  const result = JSON.parse(
    py.globals.get("process")(JSON.stringify(activeClass.students))
  );
  const rankedStudent = result.students.find((student) => student.Id === found.id);

  showMessage(
    "search-result",
    `${rankedStudent.Name} (${activeClass.name}): position ${rankedStudent.Position}, total ${rankedStudent.Total}, average ${rankedStudent.Average}, ${rankedStudent.Status}.`,
    false
  );
}

function searchAllClasses(event) {
  event.preventDefault();
  const query = $("global-search-name").value.trim();
  const resultsBox = $("global-search-results");
  resultsBox.replaceChildren();

  if (!query) {
    showMessage("global-search-message", "Enter a student name to search across all class files.", true);
    return;
  }

  const matches = [];

  schoolData.classes.forEach((classFile) => {
    const result = classFile.students.length
      ? JSON.parse(py.globals.get("process")(JSON.stringify(classFile.students)))
      : { students: [] };

    result.students.forEach((student) => {
      if (student.Name.toLowerCase().includes(query.toLowerCase())) {
        matches.push({ ...student, className: classFile.name, classId: classFile.id });
      }
    });
  });

  if (!matches.length) {
    showMessage("global-search-message", `No matching student was found in any class file.`, true);
    return;
  }

  showMessage("global-search-message", `${matches.length} matching record(s) found.`, false);

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Class", "Student", "Position in class", "Total", "Average", "Status"].forEach((heading) => {
    headerRow.append(makeCell("th", heading));
  });
  thead.append(headerRow);

  const tbody = document.createElement("tbody");
  matches.forEach((student) => {
    const row = document.createElement("tr");
    row.append(
      makeCell("td", student.className),
      makeCell("td", student.Name),
      makeCell("td", student.Position),
      makeCell("td", student.Total),
      makeCell("td", student.Average),
      makeCell("td", student.Status)
    );
    tbody.append(row);
  });

  table.append(thead, tbody);
  resultsBox.append(table);
}

function runChecks() {
  const list = $("test-list");
  list.replaceChildren();

  const results = JSON.parse(py.globals.get("run_checks")());
  results.forEach(([label, passed]) => {
    const item = document.createElement("li");
    item.textContent = (passed ? "Passed: " : "Failed: ") + label;
    list.append(item);
  });

  const passedCount = results.filter((result) => result[1]).length;
  setStatus(`${passedCount} of ${results.length} calculation checks passed.`);
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function safeFileName(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "class";
}

function backupJson() {
  downloadFile(
    JSON.stringify(schoolData, null, 2),
    "examination-system-backup.json",
    "application/json"
  );
  showMessage("backup-message", "Your class files have been exported as a JSON backup.", false);
}

function restoreJson(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!imported || !Array.isArray(imported.classes)) {
        throw new Error("This is not a valid examination backup.");
      }

      const confirmed = confirm(
        "Importing this backup will replace all class files currently stored in this browser. Have you exported a backup of your current data?"
      );
      if (!confirmed) {
        event.target.value = "";
        return;
      }

      const ids = new Set();
      imported.classes.forEach((classFile) => {
        if (!classFile.id || !classFile.name || !Array.isArray(classFile.students)) {
          throw new Error("The backup contains an invalid class file.");
        }
        if (ids.has(classFile.id)) throw new Error("The backup contains duplicate class IDs.");
        ids.add(classFile.id);

        classFile.students.forEach((student) => {
          if (!student.id || !student.name || !Array.isArray(student.scores) ||
              student.scores.length !== SUBJECTS.length ||
              student.scores.some((score) => !Number.isFinite(Number(score)) || Number(score) < 0 || Number(score) > 100)) {
            throw new Error("The backup contains an invalid student record.");
          }
        });
      });

      if (!imported.classes.some((classFile) => classFile.id === "sample-class")) {
        imported.classes.unshift(createSampleClass());
      }

      schoolData = imported;
      if (!schoolData.classes.some((classFile) => classFile.id === schoolData.activeClassId)) {
        schoolData.activeClassId = schoolData.classes[0]?.id || null;
      }

      saveData();
      refresh();
      showMessage("backup-message", "Backup imported successfully.", false);
    } catch (error) {
      showMessage("backup-message", `Import failed: ${error.message}`, true);
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}

async function start() {
  $("code-view").textContent = PYTHON_CODE.trim();

  $("add-form").addEventListener("submit", addStudent);
  $("search-form").addEventListener("submit", searchStudent);
  $("global-search-form").addEventListener("submit", searchAllClasses);
  $("run-tests").addEventListener("click", runChecks);
  $("save-csv").addEventListener("click", saveCsv);
  $("cancel-edit").addEventListener("click", () => cancelEdit(false));

  $("class-select").addEventListener("change", switchClass);
  $("create-class").addEventListener("click", createClass);
  $("rename-class").addEventListener("click", renameClass);
  $("delete-class").addEventListener("click", deleteClass);
  $("backup-json").addEventListener("click", backupJson);
  $("restore-json").addEventListener("change", restoreJson);

  $("load-sample").addEventListener("click", () => {
    schoolData.activeClassId = "sample-class";
    cancelEdit(false);
    saveData();
    refresh();
    showMessage("form-msg", "Sample data opened. It is stored separately from your other class files.", false);
  });

  $("clear").addEventListener("click", () => {
    const activeClass = getActiveClass();
    if (!activeClass) return;

    const confirmed = confirm(
      `Remove all ${activeClass.students.length} student record(s) from ${activeClass.name}?`
    );
    if (!confirmed) return;

    activeClass.students = [];
    cancelEdit(false);
    saveData();
    refresh();
    showMessage("form-msg", `All student records in ${activeClass.name} have been cleared.`, false);
  });

  setReady(false);
  setStatus("Loading Python…");

  try {
    loadData();
    renderClassManager();

    py = await loadPyodide();
    py.runPython(PYTHON_CODE + GLUE_CODE);

    setReady(true);
    refresh();
    setStatus("Python is ready. Changes are saved in this browser.");
  } catch (error) {
    console.error(error);
    setStatus("The application could not start. Check your internet connection and refresh the page.");
  }
}

start();
