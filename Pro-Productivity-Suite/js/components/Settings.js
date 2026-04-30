export const Settings = (function () {
  function render(root, { Store }) {
    root.innerHTML = "";
    const card = document.createElement("div");
    card.className = "card";
    const theme = Store.getTheme();
    card.innerHTML = `
      <div class="kv"><div class="small">Theme</div><div class="controls"><select id="pps-theme" class="input"><option value="light">Light</option><option value="dark">Dark</option></select></div></div>
      <div style="margin-top:12px" class="kv"><div class="small">Export data</div><div><button id="pps-export" class="btn">Export JSON</button></div></div>
      <div style="margin-top:12px" class="kv"><div class="small">Import data</div><div><input type="file" id="pps-import" accept=".json" class="input" style="max-width: 200px;" /></div></div>
    `;
    root.appendChild(card);

    // Theme logic
    const sel = card.querySelector("#pps-theme");
    sel.value = theme || "light";
    sel.addEventListener("change", () => {
      Store.setTheme(sel.value);
      if (sel.value === "dark")
        document.documentElement.setAttribute("data-theme", "dark");
      else document.documentElement.removeAttribute("data-theme");
    });

    // Export logic
    card.querySelector("#pps-export").addEventListener("click", () => {
      Store.exportData();
    });

    // NEW: Import logic using FileReader API
    card.querySelector("#pps-import").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          Store.importData(data);
          alert("Data imported successfully! Refreshing...");
          window.location.reload(); // Refresh to show new data
        } catch (err) {
          alert("Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    });
  }
  return { render };
})();
