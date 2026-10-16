import { useMemo, useState } from "react";
import monsterPortrait from "../assets/monster-portrait.svg";

function EmployeeCard({ monsters, analytics }) {
  const [monsterName, setMonsterName] = useState("");

  const selectedMonster = useMemo(() => {
    const search = monsterName.trim().toLowerCase();
    if (!search) return null;

    const monster = monsters.find((item) => item.name.toLowerCase() === search);
    if (!monster) return undefined;

    const stats = analytics.find((item) => item.id === monster.id);
    return {
      ...monster,
      averageFear: stats?.averageFear ?? 0,
      encounters: stats?.encounters ?? 0,
    };
  }, [analytics, monsterName, monsters]);

  return (
    <section className="employee-card">
      <div className="employee-card-heading">
        <div>
          <p className="eyebrow">MONSTER FILE / EMPLOYEE RECORD</p>
          <h2>Search a monster</h2>
        </div>
        <span className="employee-card-icon" aria-hidden="true">☠</span>
      </div>
      <label className="employee-search">
        <span>Monster name</span>
        <input
          list="monster-names"
          value={monsterName}
          onChange={(event) => setMonsterName(event.target.value)}
          placeholder="The Shadow"
        />
        <datalist id="monster-names">
          {monsters.map((monster) => <option key={monster.id} value={monster.name} />)}
        </datalist>
      </label>
      {monsterName && selectedMonster === undefined ? (
        <p className="employee-card-message">No monster found with that name.</p>
      ) : null}
      {selectedMonster ? (
        <div className="employee-profile">
          <div className="employee-profile-main">
            <img className="employee-portrait" src={monsterPortrait} alt={`${selectedMonster.name} monster portrait`} />
            <div className="employee-profile-content">
            <div className="employee-profile-title">
            <div>
              <p className="eyebrow">ACTIVE FILE</p>
              <h3>{selectedMonster.name}</h3>
            </div>
            <span className="employee-status">{selectedMonster.active ? "ACTIVE" : "INACTIVE"}</span>
          </div>
          <div className="employee-stats">
            <div><span>Species</span><strong>{selectedMonster.species || "Unknown"}</strong></div>
            <div><span>Role</span><strong>{selectedMonster.role || "Unassigned"}</strong></div>
            <div><span>Fear rating</span><strong>{selectedMonster.averageFear}/10</strong></div>
            <div><span>Total encounters</span><strong>{selectedMonster.encounters}</strong></div>
          </div>
          </div>
        </div>
        </div>
      ) : null}
    </section>
  );
}

export default EmployeeCard;
