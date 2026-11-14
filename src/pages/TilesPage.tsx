import { useEffect } from 'react';
import Icon from '../components/Icon';
import { ICON_GRID } from '../components/icons';
import KpdFilter from '../components/KpdFilter';
import ServiceCard from '../components/ServiceCard';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { applyKpd, setKpdMax } from '../store/slices/filtersSlice';
import { selectIsBusy } from '../store/slices/uiSlice';
import { deleteSolarPanel, fetchSolarPanels } from '../store/thunks/solarPanelsThunks';
import { MAX_KPD } from '../utils/filter';

export default function TilesPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.solarPanels.items);
  const { kpdMax, appliedKpd } = useAppSelector((s) => s.filters);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const isBusy = useAppSelector(selectIsBusy);

  // Фильтр уходит в запрос к бэкенду (kpd_below_than). Запрос повторяется при смене
  // применённого фильтра и после входа (чтобы пришёл признак is_own).
  useEffect(() => {
    dispatch(fetchSolarPanels({ kpdMax: appliedKpd, allowMock: !isAuthenticated }));
  }, [dispatch, appliedKpd, isAuthenticated]);

  return (
    <>
      <header className="page-header">
        <KpdFilter
          value={kpdMax}
          max={MAX_KPD}
          found={items.length}
          disabled={isBusy}
          onChange={(value) => dispatch(setKpdMax(value))}
          onSubmit={() => dispatch(applyKpd())}
        />
      </header>

      <main className="grid-scroll">
        {items.length === 0 ? (
          isBusy ? null : (
            <div className="empty-state">
              <Icon path={ICON_GRID} className="empty-state-icon" />
              <h3 className="empty-state-title">Ничего не найдено</h3>
              <p className="empty-state-text">
                По выбранному КПД нет ни одной солнечной панели.
                <br />
                Попробуйте увеличить значение ползунка.
              </p>
            </div>
          )
        ) : (
          <div className="grid-container">
            {items.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                showDelete={isAuthenticated && service.is_own === 1}
                disabled={isBusy}
                onDelete={(id) => dispatch(deleteSolarPanel(id))}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
