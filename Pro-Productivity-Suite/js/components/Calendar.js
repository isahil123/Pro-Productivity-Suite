export const CalendarView = (function () {
  function render(root, { Store }) {
    root.innerHTML = "";
    const all = Store.getTasks().filter((t) => t.dueDate && !t.archived);
    const map = {};
    all.forEach((t) => {
      map[t.dueDate] = map[t.dueDate] || [];
      map[t.dueDate].push(t);
    });
    // simple list grouped by date
    const days = Object.keys(map).sort();
    if (days.length === 0) {
      root.innerHTML = '<div class="card small">No dated tasks.</div>';
      return;
    }
    days.forEach((d) => {
      const card = document.createElement("div");
      card.className = "card";
      const h = document.createElement("div");
      h.className = "kv";
      h.innerHTML = `<div><strong>${new Date(d).toLocaleDateString()}</strong></div><div class="small">${map[d].length} tasks</div>`;
      card.appendChild(h);
      const list = document.createElement("div");
      list.style.marginTop = "8px";
      map[d].forEach((t) => {
        const it = document.createElement("div");
        it.className = "task";
        it.innerHTML = `<div><strong>${t.title}</strong><div class="small">${t.priority}</div></div><div class="small">${t.completed ? "Done" : "Open"}</div>`;
        list.appendChild(it);
      });
      card.appendChild(list);
      root.appendChild(card);
    });
  }
  return { render };
})();
