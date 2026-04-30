export const Store = (function () {
  const TASKS_KEY = "pps_tasks_v1";
  const THEME_KEY = "pps_theme_v1";

  function getTasks() {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  function saveTasks(tasks) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks || []));
  }
  function getTheme() {
    return localStorage.getItem(THEME_KEY) || "light";
  }
  function setTheme(name) {
    localStorage.setItem(THEME_KEY, name);
  }
  function exportData() {
    const data = {
      tasks: getTasks(),
      theme: getTheme(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pro-productivity-suite-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  function importData(obj) {
    if (!obj) return;
    if (Array.isArray(obj)) saveTasks(obj);
    else if (obj.tasks) saveTasks(obj.tasks);
  }
  return { getTasks, saveTasks, getTheme, setTheme, exportData, importData };
})();
