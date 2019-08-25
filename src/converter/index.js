const path = require('path');
const XLSX = require('xlsx');
const fs = require('fs');
const utils = require('./utils');
const pairsWorkbook = XLSX.readFile(`${__dirname}/input/Mentor_students_pairs.xlsx`);
const scoreWorkbook = XLSX.readFile(`${__dirname}/input/Mentor_score.xlsx`);

const students = new Map();
const mentors = {};


function getPair(sheet, currentRow) {
  const pairFieldsMapping = {
    'mentor': 'A',
    'studentGithub': 'B'
  }
  const pair = {
    mentorName: sheet[pairFieldsMapping.mentor + currentRow].v,
    studentGithub: sheet[pairFieldsMapping.studentGithub + currentRow].v
  }
  return pair;
}

function getScore(sheet, currentRow) {
  const scoreFieldsMapping = {
    'mentorGithub': 'B',
    'studentGithub': 'C',
    'task': 'D',
    'score': 'F'
  }
  const score = {
    mentorGithub: utils.cutLink(sheet[scoreFieldsMapping.mentorGithub + currentRow].v),
    studentGithub: utils.cutLink(sheet[scoreFieldsMapping.studentGithub + currentRow].v),
    task: sheet[scoreFieldsMapping.task + currentRow].v,
    score: sheet[scoreFieldsMapping.score + currentRow].v,
  }
  return score;
}

const pairs = utils.getMappedDataArray(pairsWorkbook.Sheets['pairs'], getPair);
const scores = utils.getMappedDataArray(scoreWorkbook.Sheets['Form Responses 1'], getScore);

pairs.forEach((pair) => {
  students.set(pair.studentGithub, {
    studentGithub: pair.studentGithub,
    mentorName: pair.mentorName,
    tasks: {}
  });
});

scores.forEach((score) => {
  const student = students.get(score.studentGithub);
  if (student) {
    if (!student.mentorGithub) {
      student.mentorGithub = score.mentorGithub;
    }
    if (!student.tasks[score.task]) {
      student.tasks[score.task] = score.score;
    }
  }
});

students.forEach((student) => {
  if (utils.isEmpty(student.tasks)) {
    students.delete(`${student.studentGithub}`);
  };
});

pairs.forEach((pair) => {
  const student = students.get(pair.studentGithub);
  if (student) {
    if (!mentors[student.mentorGithub]) {
      mentors[student.mentorGithub] = {};
    };
    const mentor = mentors[student.mentorGithub];
    if (!mentor.students) {
      mentor.students = {};
    };
    if (!mentor.students[student.studentGithub]) {
      mentor.students[student.studentGithub] = student;
    };
  };
});

const data = JSON.stringify(mentors);
console.log(data);
fs.writeFile(`${__dirname}/output/Mentors.json`, data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
