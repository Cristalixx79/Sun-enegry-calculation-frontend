import { useMemo, useState } from 'react';
import Icon from '../components/Icon';
import { ICON_GRID } from '../components/icons';
import KpdFilter from '../components/KpdFilter';
import ServiceCard from '../components/ServiceCard';
import { PUBLISHED_SERVICES } from '../mocks/services';
import { DEFAULT_KPD, filterByKpd, MAX_KPD } from '../utils/filter';

export default function TilesPage() {
  const [kpdMax, setKpdMax] = useState<number>(DEFAULT_KPD);
  const [appliedKpd, setAppliedKpd] = useState<number>(DEFAULT_KPD);

  const cards = useMemo(() => filterByKpd(PUBLISHED_SERVICES, appliedKpd), [appliedKpd]);

  return (
    <>
      <header className="page-header">
        <KpdFilter
          value={kpdMax}
          max={MAX_KPD}
          found={cards.length}
          onChange={setKpdMax}
          onSubmit={() => setAppliedKpd(kpdMax)}
        />
      </header>

      <main className="grid-scroll">
        {cards.length === 0 ? (
          <div className="empty-state">
            <Icon path={ICON_GRID} className="empty-state-icon" />
            <h3 className="empty-state-title">Ничего не найдено</h3>
            <p className="empty-state-text">
              По выбранному КПД нет ни одной солнечной панели.
              <br />
              Попробуйте увеличить значение ползунка.
            </p>
          </div>
        ) : (
          <div className="grid-container">
            {cards.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
