import { trip } from "../lib/data";

export default function Emergency() {
  return (
    <div>
      <h1>🚨 Экстренная информация</h1>
      <div className="card">
        <h3>Телефоны</h3>
        {trip.emergency.numbers.map((n) => (
          <p key={n.value}>
            {n.label}:{" "}
            <a href={`tel:${n.value}`} style={{ fontSize: "1.3rem", fontWeight: 700 }}>
              {n.value}
            </a>
          </p>
        ))}
        <p className="muted">
          112 работает по всему ЕС, есть англоговорящие операторы.
        </p>
      </div>
      <div className="card">
        <h3>Отель</h3>
        <p>
          {trip.trip.hotel.name}
          <br />
          {trip.trip.hotel.address}
        </p>
        <p className="muted">
          Телефон отеля — в подтверждении бронирования.{" "}
          <span className="chip outline">⚠ внести</span>
        </p>
      </div>
      <div className="card">
        <h3>Медицина</h3>
        <p>{trip.emergency.hospital.note}</p>
        <p className="muted">
          Аптеки (farmacia) отмечены зелёным крестом; дежурные работают
          круглосуточно по расписанию на двери любой аптеки.
        </p>
      </div>
      <div className="card">
        <h3>Страховка</h3>
        <p>
          {trip.emergency.insurance.note}{" "}
          <span className="chip outline">⚠ внести</span>
        </p>
      </div>
      <div className="card">
        <h3>Если потерялись</h3>
        <ul className="tight">
          <li>Точка сбора по умолчанию — отель {trip.trip.hotel.name}.</li>
          <li>В парках и Oceanogràfic заранее договориться о точке встречи.</li>
          <li>У ребёнка — записка с адресом отеля и телефоном взрослого.</li>
        </ul>
      </div>
    </div>
  );
}
