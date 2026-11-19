"use strict";

const SUBJECTS = ["Math", "English", "Science", "Social Studies"];
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
    """Calculate and return the total score from a list of subject scores."""
    total = sum(scores)
    return total

def calculate_average(total, num_subjects):
    """Calculate and return the average score."""
    average = round(total / num_subjects, 2)
    return average

def determine_status(average, pass_mark=50):
    """Determine whether a student passed or failed."""
    if average >= pass_mark:
        return "Pass"
    else:
        return "Fail"

def rank_students(students):
    """Sort students by total score in descending order and assign positions."""
    ranked_students = sorted(students, key=lambda student: float(student["Total"]), reverse=True)
    for position, student in enumerate(ranked_students, start=1):
        student["Position"] = position
    return ranked_students

def search_student(students, name):
    """Search for a student by name. Returns the record or None."""
    name = name.lower().strip()
    for student in students:
        if student["Name"].lower() == name:
            return student
    return None

def calculate_class_average(students):
    """Calculate the class average."""
    if len(students) == 0:
        return 0
    total_average = 0
    for student in students:
        total_average += float(student["Average"])
    return round(total_average / len(students), 2)
`;

// Glue code: connects the page to the functions above.
const GLUE_CODE = `
import csv, io
SUBJECTS = ["Math", "English", "Science", "Social Studies"]

def process(data_json):
    entries = json.loads(data_json)
    records = []
    for index, entry in enumerate(entries):
        scores = [float(x) for x in entry["scores"]]
        total = calculate_total(scores)
        average = calculate_average(total, len(scores))
        record = {"Id": index, "Name": entry["name"], "Total": total, "Average": average,
                  "Status": determine_status(average), "Position": 0}
        for subject, score in zip(SUBJECTS, scores):
            record[subject] = score
        records.append(record)
    ranked = rank_students(records)
    passed = sum(1 for s in ranked if s["Status"] == "Pass")
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
    out = io.StringIO()
    writer = csv.DictWriter(out, fieldnames=fieldnames, extrasaction="ignore", lineterminator="\\n")
    writer.writeheader()
    for row in rows:
        writer.writerow(row)
    return out.getvalue()

def find(data_json, name):
    return json.dumps(search_student(json.loads(data_json), name))

def run_checks():
    results = []
    def check(label, condition):
        results.append([label, bool(condition)])
    check("Total of 80, 70, 90, 75 is 315", calculate_total([80, 70, 90, 75]) == 315)
    check("Total of all zeros is 0", calculate_total([0, 0, 0, 0]) == 0)
    check("Average of 315 over 4 subjects is 78.75", calculate_average(315, 4) == 78.75)
    check("Average of 300 over 3 subjects is 100.0", calculate_average(300, 3) == 100.0)
    check("78.75 is a Pass", determine_status(78.75) == "Pass")
    check("49.9 is a Fail", determine_status(49.9) == "Fail")
    check("50.0 is a Pass (exact pass mark)", determine_status(50.0) == "Pass")
    ranked = rank_students([{"Name": "John", "Total": 200}, {"Name": "Mary", "Total": 315}])
    check("Highest total ranks first", ranked[0]["Name"] == "Mary" and ranked[0]["Position"] == 1)
    check("Next total ranks second", ranked[1]["Name"] == "John" and ranked[1]["Position"] == 2)
    people = [{"Name": "John"}, {"Name": "Mary"}]
    check("Search finds John", search_student(people, "John") == {"Name": "John"})
    check("Search ignores capital letters", search_student(people, "MARY") == {"Name": "Mary"})
    check("Search returns None when nobody matches", search_student(people, "Peter") is None)
    return json.dumps(results)
`;

const $ = (id) => document.getElementById(id);
let students = [];
let ranked = [];
let py = null;
let editingId = null;

function setStatus(text) { $("status").textContent = text; }

function setReady(ready) {
  document.querySelectorAll("#add-form button[type=submit], #load-sample, #save-csv, #search-form button, #run-tests")
    .forEach((b) => { b.disabled = !ready; });
}

function makeCell(tag, text) {
  const cell = document.createElement(tag);
  cell.textContent = text;
  return cell;
}

function renderReport(result) {
  const body = $("report-body");
  body.replaceChildren();
  ranked = result ? result.students : [];
  $("empty").hidden = ranked.length > 0;
  $("stats").hidden = ranked.length === 0;
  if (!result || ranked.length === 0) { return; }

  ranked.forEach((s) => {
    const row = document.createElement("tr");
    if (s.Position === 1) { row.className = "first"; }
    row.append(makeCell("td", s.Position), makeCell("td", s.Name), makeCell("td", s.Total), makeCell("td", s.Average));
    const statusCell = document.createElement("td");
    const badge = makeCell("span", s.Status);
    badge.className = "badge " + s.Status.toLowerCase();
    statusCell.append(badge);
    row.append(statusCell);
    const editCell = document.createElement("td");
    const editBtn = makeCell("button", "Edit");
    editBtn.type = "button";
    editBtn.className = "btn";
    editBtn.setAttribute("aria-label", "Edit " + s.Name);
    editBtn.addEventListener("click", () => startEdit(s.Id));
    editCell.append(editBtn);
    row.append(editCell);
    body.append(row);
  });

  const stats = $("stats");
  stats.replaceChildren();
  [
    [result.classAverage, "Class average"],
    [result.passed + " passed, " + result.failed + " failed", "Results"],
    [result.highest.Name + " (" + result.highest.Total + ")", "Highest scorer"],
    [result.lowest.Name + " (" + result.lowest.Total + ")", "Lowest scorer"]
  ].forEach(([value, label]) => {
    const box = document.createElement("div");
    box.className = "stat";
    const strong = document.createElement("b");
    strong.textContent = value;
    const small = document.createElement("span");
    small.textContent = label;
    box.append(strong, small);
    stats.append(box);
  });
}

function refresh() {
  if (!py) { return; }
  const result = students.length ? JSON.parse(py.globals.get("process")(JSON.stringify(students))) : null;
  renderReport(result);
}

function showMessage(id, text, isError) {
  const el = $(id);
  el.textContent = text;
  el.className = isError ? "msg error" : "msg";
}

function addStudent(event) {
  event.preventDefault();
  const name = $("name").value.trim();
  if (!name) { showMessage("form-msg", "Name cannot be empty.", true); return; }
  const scores = [];
  for (let i = 0; i < SUBJECTS.length; i++) {
    const raw = $("s" + i).value.trim();
    const score = Number(raw);
    if (raw === "" || Number.isNaN(score)) { showMessage("form-msg", "Enter a valid number for " + SUBJECTS[i] + ".", true); return; }
    if (score < 0 || score > 100) { showMessage("form-msg", SUBJECTS[i] + " score must be between 0 and 100.", true); return; }
    scores.push(score);
  }
  if (editingId !== null) {
    students[editingId] = { name, scores };
    refresh();
    showMessage("form-msg", name + "'s record updated successfully.", false);
    cancelEdit(true);
  } else {
    students.push({ name, scores });
    refresh();
    showMessage("form-msg", name + "'s record added successfully.", false);
    $("add-form").reset();
  }
  $("name").focus();
}

function startEdit(id) {
  const s = students[id];
  editingId = id;
  $("name").value = s.name;
  s.scores.forEach((score, i) => { $("s" + i).value = score; });
  $("add-h").textContent = "Edit a record";
  document.querySelector("#add-form button[type=submit]").textContent = "Update record";
  $("cancel-edit").hidden = false;
  showMessage("form-msg", "Editing " + s.name + ". Change the scores and select Update record.", false);
  $("name").focus();
}

function cancelEdit(keepMessage) {
  editingId = null;
  $("add-form").reset();
  $("add-h").textContent = "Add a record";
  document.querySelector("#add-form button[type=submit]").textContent = "Add record";
  $("cancel-edit").hidden = true;
  if (!keepMessage) { showMessage("form-msg", "", false); }
}

function saveCsv() {
  if (!ranked.length) { showMessage("form-msg", "No records to save.", true); return; }
  const csvText = py.globals.get("to_csv")(JSON.stringify(ranked));
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csvText], { type: "text/csv" }));
  link.download = "students.csv";
  link.click();
  URL.revokeObjectURL(link.href);
  showMessage("form-msg", "Records saved to students.csv.", false);
}

function searchStudent(event) {
  event.preventDefault();
  const name = $("search-name").value;
  if (!name.trim()) { showMessage("search-result", "Enter a name to search.", true); return; }
  const found = JSON.parse(py.globals.get("find")(JSON.stringify(ranked), name));
  if (!found) { showMessage("search-result", "Student not found.", true); return; }
  showMessage("search-result", found.Name + ": position " + found.Position + ", total " + found.Total +
    ", average " + found.Average + ", " + found.Status + ".", false);
}

function runChecks() {
  const list = $("test-list");
  list.replaceChildren();
  const results = JSON.parse(py.globals.get("run_checks")());
  results.forEach(([label, ok]) => {
    const item = document.createElement("li");
    item.textContent = (ok ? "Passed: " : "Failed: ") + label;
    list.append(item);
  });
  const passed = results.filter((r) => r[1]).length;
  setStatus(passed + " of " + results.length + " checks passed.");
}

async function start() {
  $("code-view").textContent = PYTHON_CODE.trim();
  $("add-form").addEventListener("submit", addStudent);
  $("search-form").addEventListener("submit", searchStudent);
  $("run-tests").addEventListener("click", runChecks);
  $("save-csv").addEventListener("click", saveCsv);
  $("cancel-edit").addEventListener("click", () => cancelEdit(false));
  $("load-sample").addEventListener("click", () => { students = SAMPLE.map((s) => ({ ...s })); refresh(); });
  $("clear").addEventListener("click", () => { students = []; refresh(); cancelEdit(false); });
  try {
    py = await loadPyodide();
    py.runPython(PYTHON_CODE + GLUE_CODE);
    setReady(true);
    setStatus("Python is ready.");
    students = SAMPLE.map((s) => ({ ...s }));
    refresh();
  } catch (error) {
    setStatus("Python could not load. Check your internet connection and refresh the page.");
  }
}

start();