import { Store } from "./store.js";
import { Nav } from "./components/Nav.js";
import { TasksBoard } from "./components/TasksBoard.js";
import { Dashboard } from "./components/Dashboard.js";
import { CalendarView } from "./components/Calendar.js";
import { Archive } from "./components/Archive.js";
import { Settings } from "./components/Settings.js";

const routes = {
  "": TasksBoard,
  "#/": TasksBoard,
  "#/dashboard": Dashboard,
  "#/calendar": CalendarView,
  "#/archive": Archive,
  "#/settings": Settings,
};

const sidebarEl = document.getElementById("sidebar");
const mainEl = document.getElementById("main");

function applyTheme() {
  const theme = Store.getTheme();
  if (theme === "dark")
    document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");
}

function renderRoute() {
  const hash = location.hash || "#/";
  const Comp = routes[hash] || TasksBoard;
  mainEl.innerHTML = "";
  // header area
  const header = document.createElement("div");
  header.className = "header";
  const title = document.createElement("div");
  title.innerHTML = "<strong>Pro Productivity Suite</strong>";
  const controls = document.createElement("div");
  controls.className = "controls";
  header.appendChild(title);
  header.appendChild(controls);
  mainEl.appendChild(header);

  // mount component
  const cont = document.createElement("div");
  cont.className = "view";
  mainEl.appendChild(cont);
  Comp.render(cont, { Store, navigate });

  // re-render sidebar to reflect counts
  Nav.render(sidebarEl, { Store });
}

function navigate(h) {
  if (location.hash === h) renderRoute();
  else location.hash = h;
}

window.addEventListener("hashchange", () => {
  renderRoute();
});
window.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  Nav.render(sidebarEl, { Store, navigate });
  renderRoute();
});

export default { navigate };
