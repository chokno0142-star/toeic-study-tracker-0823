const examDate = new Date("2026-08-23T09:00:00");
const storageKey = "toeicStudyRecords0823";

const daysLeftElement = document.getElementById("days-left");
const studyForm = document.getElementById("study-form");
const studyDateInput = document.getElementById("study-date");
const wordRangeInput = document.getElementById("word-range");
const studyTimeInput = document.getElementById("study-time");
const mockScoreInput = document.getElementById("mock-score");
const weaknessNoteInput = document.getElementById("weakness-note");
const recordsList = document.getElementById("records-list");
const clearRecordsButton = document.getElementById("clear-records");
const totalStudyTimeElement = document.getElementById("total-study-time");

function updateDaysLeft() {
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    daysLeftElement.textContent = `あと ${diffDays} 日`;
  } else if (diffDays === 0) {
    daysLeftElement.textContent = "本番当日です";
  } else {
    daysLeftElement.textContent = "本番日は終了しました";
  }
}

function setTodayAsDefaultDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  studyDateInput.value = `${yyyy}-${mm}-${dd}`;
}

function getRecords() {
  const recordsJson = localStorage.getItem(storageKey);
  return recordsJson ? JSON.parse(recordsJson) : [];
}

function saveRecords(records) {
  localStorage.setItem(storageKey, JSON.stringify(records));
}

function renderRecords() {
  const records = getRecords();

  const totalMinutes = records.reduce((sum, record) => {
    return sum + Number(record.studyTime || 0);
  }, 0);

  totalStudyTimeElement.textContent = `合計学習時間：${totalMinutes} 分`;

  if (records.length === 0) {
    recordsList.innerHTML = '<p class="empty-message">まだ記録がありません。</p>';
    return;
  }

  recordsList.innerHTML = "";

  records
    .slice()
    .reverse()
    .forEach((record) => {
      const recordItem = document.createElement("article");
      recordItem.className = "record-item";

      recordItem.innerHTML = `
        <h3>${record.date}</h3>
        <p><strong>金フレ：</strong>${record.wordRange || "未記入"}</p>
        <p><strong>学習時間：</strong>${record.studyTime || 0} 分</p>
        <p><strong>模試スコア：</strong>${record.mockScore || "未記入"}</p>
        <p><strong>弱点メモ：</strong>${record.weaknessNote || "未記入"}</p>
      `;

      recordsList.appendChild(recordItem);
    });
}

studyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newRecord = {
    date: studyDateInput.value,
    wordRange: wordRangeInput.value.trim(),
    studyTime: studyTimeInput.value,
    mockScore: mockScoreInput.value.trim(),
    weaknessNote: weaknessNoteInput.value.trim(),
    createdAt: new Date().toISOString()
  };

  const records = getRecords();
  records.push(newRecord);
  saveRecords(records);

  studyForm.reset();
  setTodayAsDefaultDate();
  renderRecords();
});

clearRecordsButton.addEventListener("click", () => {
  const confirmed = confirm("すべての記録を削除しますか？");

  if (!confirmed) {
    return;
  }

  localStorage.removeItem(storageKey);
  renderRecords();
});

updateDaysLeft();
setTodayAsDefaultDate();
renderRecords();
