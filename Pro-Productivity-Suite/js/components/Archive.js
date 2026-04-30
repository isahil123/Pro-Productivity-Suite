export const Archive = (function () {
  function render(root, { Store }) {
    root.innerHTML = "";
    const all = Store.getTasks().filter((t) => t.archived);
    const card = document.createElement("div");
    card.className = "card";
    if (all.length === 0) {
      card.innerHTML = '<div class="small">Archive empty.</div>';
      root.appendChild(card);
      return;
    }
    all.forEach((t) => {
      const it = document.createElement("div");
      it.className = "task";
      it.innerHTML = `<div><strong>${t.title}</strong><div class="small">${t.dueDate || ""} • ${t.priority}</div></div><div class="small">${t.completed ? "Done" : "Open"}</div>`;
      card.appendChild(it);
    });
    root.appendChild(card);
  }
  return { render };
})();
