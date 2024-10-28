const fs = require("fs");

const data = JSON.parse(fs.readFileSync("data/data-set.json", "utf8"));

console.log("Turmas: " + data.classes.length);
console.log("Cursos: " + data.courses.length);
console.log("Disciplinas: " + data.subjects.length);
console.log("Professores: " + data.teachers.length);
