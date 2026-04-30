export const Nav = (function () {
  function countInbox(tasks) {
    return tasks.filter((t) => !t.archived && !t.completed).length;
  }
  function render(root, { Store, navigate }) {
    const tasks = Store.getTasks();
    root.innerHTML = "";
    const brand = document.createElement("div");
    brand.className = "brand";
    brand.innerHTML = '<i class="fa-solid fa-rocket"></i> Pro Suite';
    root.appendChild(brand);
    const nav = document.createElement("nav");
    nav.className = "nav card";
    const links = [
      { href: "#/", icon: "fa-list", label: "Tasks", badge: countInbox(tasks) },
      { href: "#/dashboard", icon: "fa-chart-simple", label: "Dashboard" },
      { href: "#/calendar", icon: "fa-calendar-days", label: "Calendar" },
      { href: "#/archive", icon: "fa-archive", label: "Archive" },
      { href: "#/settings", icon: "fa-gear", label: "Settings" },
    ];
    links.forEach((l) => {
      const a = document.createElement("a");
      a.href = l.href;
      a.className =
        location.hash === l.href || (location.hash === "" && l.href === "#/")
          ? "active"
          : "";
      a.innerHTML = `<i class="fa-solid ${l.icon}"></i><span>${l.label}</span>`;
      if (l.badge) {
        const b = document.createElement("span");
        b.className = "badge";
        b.textContent = l.badge;
        a.appendChild(b);
      }
      nav.appendChild(a);
    });
    root.appendChild(nav);
    const footer = document.createElement("div");
    footer.className = "footer-note small";
    footer.innerHTML = "Local only • No account required";
    root.appendChild(footer);
  }
  return { render };
})();
