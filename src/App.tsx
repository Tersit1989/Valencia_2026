import { useEffect } from "react";
import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import { STORE_KEYS, useStoredState } from "./lib/store";
import Today from "./pages/Today";
import Days from "./pages/Days";
import MapPage from "./pages/MapPage";
import Restaurants from "./pages/Restaurants";
import Missions from "./pages/Missions";
import Phrases from "./pages/Phrases";
import Emergency from "./pages/Emergency";
import Settings from "./pages/Settings";

const NAV = [
  { to: "/", ico: "🏠", label: "Сегодня" },
  { to: "/days", ico: "🗓️", label: "Дни" },
  { to: "/map", ico: "🗺️", label: "Карта" },
  { to: "/food", ico: "🍽️", label: "Еда" },
  { to: "/missions", ico: "🦇", label: "Миссии" },
  { to: "/more", ico: "☰", label: "Ещё" }
];

export default function App() {
  const [theme] = useStoredState<string>(STORE_KEYS.theme, "auto");

  useEffect(() => {
    const apply = () => {
      const dark =
        theme === "dark" ||
        (theme === "auto" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    };
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  return (
    <HashRouter>
      <main>
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/days" element={<Days />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/food" element={<Restaurants />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/phrases" element={<Phrases />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/more" element={<Settings />} />
          <Route path="*" element={<Today />} />
        </Routes>
      </main>
      <nav className="bottom">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === "/"}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="ico">{n.ico}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>
    </HashRouter>
  );
}
