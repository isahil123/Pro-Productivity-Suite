export const TasksBoard = (function () {
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function formatDate(d) {
    if (!d) return "";
    const dt = new Date(d);
    return dt.toLocaleDateString();
  }

  // CORRECT PLACEMENT: Debounce is its own standalone helper function
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  function render(root, { Store }) {
    const tasks = Store.getTasks();
    root.innerHTML = "";
    const container = document.createElement("div");
    const card = document.createElement("div");
    card.className = "card";

    // form
    const form = document.createElement("form");
    form.className = "form-row";
    const titleIn = document.createElement("input");
    titleIn.placeholder = "New task title";
    titleIn.className = "input";
    titleIn.required = true;
    const dateIn = document.createElement("input");
    dateIn.type = "date";
    dateIn.className = "input";
    const prio = document.createElement("select");
    prio.className = "input";
    prio.innerHTML =
      '<option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>';
    const addBtn = document.createElement("button");
    addBtn.className = "btn";
    addBtn.type = "submit";
    addBtn.textContent = "Add";
    form.appendChild(titleIn);
    form.appendChild(dateIn);
    form.appendChild(prio);
    form.appendChild(addBtn);
    card.appendChild(form);

    // controls
    const controls = document.createElement("div");
    controls.className = "card";
    controls.style.marginTop = "12px";
    controls.innerHTML = `
      <div class="kv"><div class="small">Filter:</div>
        <div class="controls">
          <select id="pps-filter" class="input"><option value="all">All</option><option value="today">Today</option><option value="upcoming">Upcoming</option><option value="overdue">Overdue</option><option value="completed">Completed</option></select>
          <input id="pps-search" placeholder="Search" class="input" />
          <select id="pps-sort" class="input"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="duedate">Due date</option><option value="priority">Priority</option></select>
        </div>
      </div>
    `;

    container.appendChild(card);
    container.appendChild(controls);

    // list
    const listWrap = document.createElement("div");
    listWrap.className = "card";
    listWrap.style.marginTop = "12px";
    const list = document.createElement("div");
    list.className = "tasks-list";
    listWrap.appendChild(list);
    container.appendChild(listWrap);

    root.appendChild(container);

    // Refresh Function (Handles Filtering, Sorting, and Rendering)
    function refresh() {
      const all = Store.getTasks();
      const filter = controls.querySelector("#pps-filter").value;
      const q = controls
        .querySelector("#pps-search")
        .value.toLowerCase()
        .trim();
      const sort = controls.querySelector("#pps-sort").value;
      let out = all.slice();

      // apply filter
      const todayStr = new Date().toISOString().slice(0, 10);
      if (filter === "today")
        out = out.filter((t) => t.dueDate === todayStr && !t.archived);
      if (filter === "upcoming")
        out = out.filter(
          (t) => t.dueDate && t.dueDate > todayStr && !t.archived,
        );
      if (filter === "overdue")
        out = out.filter(
          (t) =>
            t.dueDate && t.dueDate < todayStr && !t.completed && !t.archived,
        );
      if (filter === "completed")
        out = out.filter((t) => t.completed && !t.archived);

      // search
      if (q) {
        out = out.filter(
          (t) =>
            (t.title || "").toLowerCase().includes(q) ||
            (t.description || "").toLowerCase().includes(q),
        );
      }

      // sort
      if (sort === "duedate")
        out.sort((a, b) => ((a.dueDate || "") > (b.dueDate || "") ? 1 : -1));
      if (sort === "priority") {
        const map = { high: 0, medium: 1, low: 2 };
        out.sort((a, b) => (map[a.priority] || 2) - (map[b.priority] || 2));
      }
      if (sort === "newest") out.sort((a, b) => b.createdAt - a.createdAt);
      if (sort === "oldest") out.sort((a, b) => a.createdAt - b.createdAt);

      // render
      list.innerHTML = "";
      if (out.length === 0) {
        list.innerHTML = '<div class="small">No tasks match.</div>';
      }
      out.forEach((t) => {
        if (t.archived) return; // skip archived here
        const item = document.createElement("div");
        item.className = "task card";
        if (t.completed) item.classList.add("completed");
        const left = document.createElement("div");
        left.className = "meta";
        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.checked = !!t.completed;
        chk.addEventListener("change", () => {
          t.completed = chk.checked;
          t.status = chk.checked ? "done" : "todo"; // Update status for Kanban compatibility
          Store.saveTasks(all);
          refresh();
        });
        const title = document.createElement("div");
        title.innerHTML = `<div><strong>${t.title}</strong></div><div class="small">${t.description || ""}</div>`;
        left.appendChild(chk);
        left.appendChild(title);
        const right = document.createElement("div");
        right.className = "meta";
        const due = document.createElement("div");
        due.className = "small";
        due.textContent = t.dueDate ? formatDate(t.dueDate) : "";
        if (
          t.dueDate &&
          t.dueDate < new Date().toISOString().slice(0, 10) &&
          !t.completed
        )
          due.style.color = "var(--danger)";
        const p = document.createElement("div");
        p.className =
          "small " +
          (t.priority === "high"
            ? "priority-high"
            : t.priority === "medium"
              ? "priority-medium"
              : "priority-low");
        p.textContent = t.priority;
        const edit = document.createElement("button");
        edit.className = "btn ghost";
        edit.textContent = "Edit";
        edit.addEventListener("click", () => {
          titleIn.value = t.title;
          dateIn.value = t.dueDate || "";
          prio.value = t.priority || "low";
          addBtn.textContent = "Update";
          addBtn.dataset.edit = t.id;
        });
        const archiveBtn = document.createElement("button");
        archiveBtn.className = "btn ghost";
        archiveBtn.textContent = "Archive";
        archiveBtn.addEventListener("click", () => {
          t.archived = true;
          Store.saveTasks(all);
          refresh();
        });
        const del = document.createElement("button");
        del.className = "btn ghost";
        del.textContent = "Delete";
        del.addEventListener("click", () => {
          const idx = all.findIndex((x) => x.id === t.id);
          if (idx > -1) {
            all.splice(idx, 1);
            Store.saveTasks(all);
            refresh();
          }
        });
        right.appendChild(due);
        right.appendChild(p);
        right.appendChild(edit);
        right.appendChild(archiveBtn);
        right.appendChild(del);

        item.appendChild(left);
        item.appendChild(right);
        list.appendChild(item);
      });
    }

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const all = Store.getTasks();
      const id = addBtn.dataset.edit;
      if (id) {
        // update
        const t = all.find((x) => x.id === id);
        if (!t) return;
        t.title = titleIn.value;
        t.dueDate = dateIn.value || null;
        t.priority = prio.value;
        Store.saveTasks(all);
        addBtn.textContent = "Add";
        delete addBtn.dataset.edit;
        titleIn.value = "";
        dateIn.value = "";
        prio.value = "low";
        refresh();
        return;
      }
      const newTask = {
        id: uid(),
        title: titleIn.value,
        description: "",
        dueDate: dateIn.value || null,
        priority: prio.value || "low",
        completed: false,
        status: "todo", // Added for Kanban support
        archived: false,
        createdAt: Date.now(),
      };
      all.push(newTask);
      Store.saveTasks(all);
      titleIn.value = "";
      dateIn.value = "";
      prio.value = "low";
      refresh();
    });

    // Event Listeners for controls
    controls.querySelector("#pps-filter").addEventListener("change", refresh);
    controls.querySelector("#pps-sort").addEventListener("change", refresh);

    // CORRECT PLACEMENT: Debounced search listener
    const debouncedSearch = debounce(refresh, 300);
    controls
      .querySelector("#pps-search")
      .addEventListener("input", debouncedSearch);

    refresh();
  }
  return { render };
})();
