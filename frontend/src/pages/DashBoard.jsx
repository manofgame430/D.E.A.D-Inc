import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import EmployeeCard from "../components/employeeCard.jsx";
import "./DashBoard.css";

const API_URL = "http://localhost:3000/api";
const COLORS = ["#8b5cf6", "#22d3ee", "#f97316", "#34d399", "#f43f5e"];
const PAGES = [
  { id: "analytics", label: "Analytics", paths: ["/analytics/overview", "/analytics/monsters", "/analytics/rooms", "/analytics/attendance"] },
  { id: "encounters", label: "Encounters", paths: ["/encounters", "/analytics/monsters"] },
  { id: "guests", label: "Guests", paths: ["/guests"] },
  { id: "monsters", label: "Monsters", paths: ["/monsters", "/analytics/monsters"] },
  { id: "rooms", label: "Rooms", paths: ["/rooms", "/analytics/rooms"] },
  { id: "visits", label: "Visits", paths: ["/visits"] },
  // { id: "employee-card", label: "Employee Card", paths: ["/monsters", "/analytics/monsters"] },
];

function ChartCard({ title, subtitle, children, className = "" }) {
  return <section className={`chart-card ${className}`}><h2>{title}</h2><p className="card-subtitle">{subtitle}</p><div className="chart">{children}</div></section>;
}

function Metric({ label, value }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}

function AnalyticsPage({ data }) {
  const [overview, monsterAnalytics, roomAnalytics, attendance] = data;
  const completion = [{ name: "Completion", value: overview.completionRate, fill: "#8b5cf6" }];
  return (
    <div className="page-grid">
      <section className="metrics-grid">
        <Metric label="Total guests" value={overview.totalGuests} />
        <Metric label="Total visits" value={overview.totalVisits} />
        <Metric label="Average fear" value={`${overview.averageFear}/10`} />
        <Metric label="Average duration" value={`${overview.averageVisitDuration} min`} />
      </section>
      <ChartCard title="Visit completion" subtitle="analytics.ts · overview">
        <ResponsiveContainer><RadialBarChart innerRadius="62%" outerRadius="100%" startAngle={90} endAngle={-270} data={completion} barSize={18}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} /><RadialBar background dataKey="value" cornerRadius={12} />
          <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="chart-value">{overview.completionRate}%</text>
          <text x="50%" y="60%" textAnchor="middle" className="chart-label">completed</text>
        </RadialBarChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Monster performance" subtitle="analytics.ts · encounters and average fear">
        <ResponsiveContainer><BarChart data={monsterAnalytics} margin={{ bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={55} />
          <YAxis yAxisId="count" allowDecimals={false} /><YAxis yAxisId="fear" orientation="right" domain={[0, 10]} />
          <Tooltip /><Legend /><Bar yAxisId="count" dataKey="encounters" fill="#22d3ee" name="Encounters" radius={[5, 5, 0, 0]} /><Bar yAxisId="fear" dataKey="averageFear" fill="#f97316" name="Avg. fear" radius={[5, 5, 0, 0]} />
        </BarChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Room performance" subtitle="analytics.ts · encounters and average fear">
        <ResponsiveContainer><RadarChart data={roomAnalytics} outerRadius="70%">
          <PolarGrid /><PolarAngleAxis dataKey="name" /><PolarRadiusAxis domain={[0, 10]} />
          <Radar name="Encounters" dataKey="encounters" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.35} />
          <Radar name="Avg. fear" dataKey="averageFear" stroke="#f97316" fill="#f97316" fillOpacity={0.4} /><Legend /><Tooltip />
        </RadarChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Attendance" subtitle="analytics.ts · visits by date" className="wide-card">
        <ResponsiveContainer><AreaChart data={attendance}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis allowDecimals={false} /><Tooltip />
          <Area type="monotone" dataKey="visits" stroke="#34d399" fill="#34d399" fillOpacity={0.25} name="Visits" />
        </AreaChart></ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function EncountersPage({ data }) {
  const [encounters, monsterAnalytics] = data;
  const mostEncountered = monsterAnalytics.reduce((best, monster) => monster.encounters > (best?.encounters ?? -1) ? monster : best, null);
  const leastEncountered = monsterAnalytics.reduce((least, monster) => monster.encounters < (least?.encounters ?? Infinity) ? monster : least, null);
  const averageDuration = encounters.length ? Math.round(encounters.reduce((sum, item) => sum + (item.duration || 0), 0) / encounters.length) : 0;
  return <div className="page-grid">
    <section className="metrics-grid"><Metric label="Total encounters" value={encounters.length} /><Metric label="Average duration" value={`${averageDuration} min`} /><Metric label="Most encountered monster" value={mostEncountered ? `${mostEncountered.name} (${mostEncountered.encounters})` : "—"} /><Metric label="Least encountered monster" value={leastEncountered ? `${leastEncountered.name} (${leastEncountered.encounters})` : "—"} /></section>
  </div>;
}

function GuestsPage({ data }) {
  const groups = useMemo(() => Object.entries(data.reduce((result, guest) => { const group = guest.ageGroup || "Unknown"; result[group] = (result[group] || 0) + 1; return result; }, {})).map(([name, value]) => ({ name, value })), [data]);
  return <div className="page-grid">
    <section className="metrics-grid"><Metric label="Total guests" value={data.length} /><Metric label="Age groups" value={groups.length} /><Metric label="Unique guest codes" value={new Set(data.map((guest) => guest.guestCode)).size} /></section>
    <ChartCard title="Guest age distribution" subtitle="guests.ts · guests grouped by age group">
      <ResponsiveContainer><PieChart><Pie data={groups} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="72%" label>
        {groups.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
      </Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>
    </ChartCard>
  </div>;
}

function MonstersPage({ data }) {
  const [monsters, monsterAnalytics] = data;
  const species = useMemo(() => Object.entries(monsters.reduce((result, monster) => { const name = monster.species || "Unknown"; result[name] = (result[name] || 0) + 1; return result; }, {})).map(([name, value]) => ({ name, value })), [monsters]);
  const roles = useMemo(() => Object.entries(monsters.reduce((result, monster) => { const name = monster.role || "Unassigned"; result[name] = (result[name] || 0) + 1; return result; }, {})).map(([name, value]) => ({ name, value })), [monsters]);
  const highestFear = monsterAnalytics.reduce((highest, monster) => monster.averageFear > (highest?.averageFear ?? -1) ? monster : highest, null);
  return <div className="page-grid">
    <section className="metrics-grid"><Metric label="Total monsters" value={monsters.length} /><Metric label="Highest fear rating" value={highestFear ? `${highestFear.name} (${highestFear.averageFear}/10)` : "—"} /><Metric label="Species" value={species.length} /><Metric label="Roles" value={roles.length} /></section>
    <ChartCard title="Species composition" subtitle="monsters.ts · species distribution">
      <ResponsiveContainer><PieChart><Pie data={species} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="72%" label>{species.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>
    </ChartCard>
    <ChartCard title="Monster roles" subtitle="monsters.ts · role distribution">
      <ResponsiveContainer><BarChart data={roles}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" angle={-20} textAnchor="end" height={55} interval={0} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" name="Monsters" fill="#8b5cf6" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer>
    </ChartCard>
  </div>;
}

function EmployeeCardPage({ data }) {
  const [monsters, analytics] = data;
  return <div className="page-grid"><EmployeeCard monsters={monsters} analytics={analytics} /></div>;
}

function RoomsPage({ data }) {
  const [rooms, roomAnalytics] = data;
  const mostEncountered = roomAnalytics.reduce((best, room) => room.encounters > (best?.encounters ?? -1) ? room : best, null);
  const roomData = rooms.map((room) => ({ ...room, difficulty: room.difficulty || 0 }));
  return <div className="page-grid">
    <section className="metrics-grid"><Metric label="Total rooms" value={rooms.length} /><Metric label="Active" value={rooms.filter((room) => room.active).length} /><Metric label="Average difficulty" value={`${(rooms.reduce((sum, room) => sum + (room.difficulty || 0), 0) / (rooms.length || 1)).toFixed(1)}/10`} /><Metric label="Most encounters" value={mostEncountered ? `${mostEncountered.name} (${mostEncountered.encounters})` : "—"} /></section>
    <ChartCard title="Room difficulty" subtitle="rooms.ts · difficulty by room">
      <ResponsiveContainer><RadarChart data={roomData} outerRadius="70%"><PolarGrid /><PolarAngleAxis dataKey="name" /><PolarRadiusAxis allowDecimals={false} /><Radar name="Difficulty" dataKey="difficulty" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.45} /><Legend /><Tooltip /></RadarChart></ResponsiveContainer>
    </ChartCard>
    <section className="entity-grid">{rooms.map((room) => <article className="entity-card" key={room.id}><h3>{room.name}</h3><p>{room.description || "No description"}</p><span>Difficulty {room.difficulty ?? "—"} · {room.active ? "Active" : "Inactive"}</span></article>)}</section>
  </div>;
}

function VisitsPage({ data }) {
  return <div className="page-grid">
    <section className="metrics-grid"><Metric label="Total visits" value={data.length} /><Metric label="Completed" value={data.filter((visit) => visit.completed).length} /><Metric label="Unique guests" value={new Set(data.map((visit) => visit.guestId)).size} /><Metric label="Avg. duration" value={`${Math.round(data.reduce((sum, visit) => sum + (visit.duration || 0), 0) / (data.length || 1))} min`} /></section>
    <ChartCard title="Visit outcomes" subtitle="visits.ts · completion status">
      <ResponsiveContainer><PieChart><Pie data={[{ name: "Completed", value: data.filter((visit) => visit.completed).length }, { name: "Incomplete", value: data.filter((visit) => !visit.completed).length }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="72%" label>{[0, 1].map((index) => <Cell key={index} fill={index ? "#f43f5e" : "#34d399"} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>
    </ChartCard>
  </div>;
}

function App() {
  const [pageId, setPageId] = useState(() => window.location.hash.slice(1) || "analytics");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const page = PAGES.find((item) => item.id === pageId) || PAGES[0];

  useEffect(() => {
    const onHashChange = () => setPageId(window.location.hash.slice(1) || "analytics");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    let cancelled = false;
    Promise.all(page.paths.map((path) => fetch(`${API_URL}${path}`).then((response) => {
      if (!response.ok) throw new Error(`Unable to load ${page.label.toLowerCase()} data`);
      return response.json();
    }))).then((pageData) => { if (!cancelled) setResult({ pageId: page.id, data: pageData }); }).catch((requestError) => { if (!cancelled) setError({ pageId: page.id, message: requestError.message }); });
    return () => { cancelled = true; };
  }, [page.id, page.label, page.paths]);

  const Page = { analytics: AnalyticsPage, encounters: EncountersPage, guests: GuestsPage, monsters: MonstersPage, rooms: RoomsPage, visits: VisitsPage, "employee-card": EmployeeCardPage }[page.id];
  return <main className="app">
    <div className="bat-swarm" aria-hidden="true">
      <span className="bat bat-one" />
      <span className="bat bat-two" />
      <span className="bat bat-three" />
      <span className="bat bat-four" />
    </div>
    <header className="dashboard-header"><div><p className="eyebrow">HAUNTED CORP. / HAUNTED HOUSE OPERATIONS</p><h1>Haunted House Intelligence</h1><p className="header-copy">A spectral readout of every scream, scare, and visitor.</p></div><div className="status-pill"><span /> HOUSE ONLINE</div></header>
    <nav className="page-nav" aria-label="Data pages">{PAGES.map((item) => <a className={item.id === page.id ? "active" : ""} href={`#${item.id}`} key={item.id}>{item.label}</a>)}</nav>
    <div className="page-heading"><p className="eyebrow">SOURCE / {page.paths.join(" · ")}</p><h2>{page.label}</h2></div>
    {error?.pageId === page.id ? <div className="error-state"><h2>Page unavailable</h2><p>{error.message}. Confirm the API is running on port 3000.</p></div> : result?.pageId !== page.id ? <div className="loading-state">Loading {page.label.toLowerCase()} data...</div> : <div className="page-content"><Page data={page.paths.length === 1 ? result.data[0] : result.data} /></div>}
  </main>;
}

export default App;
