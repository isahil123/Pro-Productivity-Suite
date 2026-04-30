export const Dashboard = (function () {
  function render(root, { Store }) {
    root.innerHTML = "";
    const all = Store.getTasks();
    const total = all.filter((t) => !t.archived).length;
    const completed = all.filter((t) => t.completed).length;
    const overdue = all.filter(
      (t) =>
        t.dueDate &&
        t.dueDate < new Date().toISOString().slice(0, 10) &&
        !t.completed &&
        !t.archived,
    ).length;
    const upcoming = all.filter(
      (t) =>
        t.dueDate &&
        t.dueDate > new Date().toISOString().slice(0, 10) &&
        !t.archived,
    ).length;

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit,minmax(200px,1fr))";
    grid.style.gap = "12px";
    const c1 = document.createElement("div");
    c1.className = "card";
    c1.innerHTML = `<div class="small">Total open tasks</div><h2>${total}</h2>`;
    const c2 = document.createElement("div");
    c2.className = "card";
    c2.innerHTML = `<div class="small">Completed</div><h2>${completed}</h2>`;
    const c3 = document.createElement("div");
    c3.className = "card";
    c3.innerHTML = `<div class="small">Overdue</div><h2 style="color:var(--danger)">${overdue}</h2>`;
    const c4 = document.createElement("div");
    c4.className = "card";
    c4.innerHTML = `<div class="small">Upcoming</div><h2>${upcoming}</h2>`;
    grid.appendChild(c1);
    grid.appendChild(c2);
    grid.appendChild(c3);
    grid.appendChild(c4);

    // progress
    const progressCard = document.createElement("div");
    progressCard.className = "card";
    progressCard.style.marginTop = "12px";
    const pct = total ? Math.round((completed / total) * 100) : 0;
    progressCard.innerHTML = `<div class="small">Completion</div><div class="progress" style="margin-top:8px"><i style="width:${pct}%"></i></div><div class="small" style="margin-top:8px">${pct}% complete</div>`;

    root.appendChild(grid);
    root.appendChild(progressCard);
  }
  return { render };
})();
