import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Badge, Button, Col, Collapse, Form, Row } from 'react-bootstrap';
import Icon from '../components/Icon';
import { ICON_GRID } from '../components/icons';
import ServiceCard from '../components/ServiceCard';
import { PUBLISHED_SERVICES } from '../mocks/services';
import type { Filters } from '../types';
import { countActiveFilters, DEFAULT_FILTERS, filterServices, MAX_KPD } from '../utils/filter';

export default function TilesPage() {
  // form — то, что сейчас введено в полях; applied — то, что применено кнопкой «Отфильтровать»
  const [form, setForm] = useState<Filters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS);
  const [open, setOpen] = useState(true);

  const cards = useMemo(() => filterServices(PUBLISHED_SERVICES, applied), [applied]);
  const activeCount = countActiveFilters(applied);

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setApplied(form);
  }

  function handleReset() {
    setForm(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
  }

  return (
    <>
      <header className="page-header">
        <div className="page-header__top">
          <h1>Плитка услуг</h1>
          <Button
            variant="outline-secondary"
            size="sm"
            className="filter-toggle"
            onClick={() => setOpen(!open)}
            aria-controls="filter-panel"
            aria-expanded={open}
          >
            Фильтр{' '}
            {activeCount > 0 && (
              <Badge bg="success" pill>
                {activeCount}
              </Badge>
            )}
          </Button>
        </div>

        <Collapse in={open}>
          <div id="filter-panel">
            <Form onSubmit={handleSubmit} className="filter-form">
              <Row className="g-2">
                <Col xs={7}>
                  <Form.Group controlId="filter-title">
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Например, HJT"
                      value={form.title}
                      onChange={(e) => update('title', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={5}>
                  <Form.Group controlId="filter-date">
                    <Form.Label>Дата с</Form.Label>
                    <Form.Control
                      size="sm"
                      type="date"
                      value={form.dateFrom}
                      onChange={(e) => update('dateFrom', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={7}>
                  <Form.Group controlId="filter-kpd">
                    <Form.Label>КПД не выше: {form.kpdMax}%</Form.Label>
                    <Form.Range
                      min={0}
                      max={MAX_KPD}
                      step={1}
                      value={form.kpdMax}
                      onChange={(e) => update('kpdMax', Number(e.target.value))}
                    />
                  </Form.Group>
                </Col>
                <Col xs={5}>
                  <Form.Group controlId="filter-price">
                    <Form.Label>Цена до, ₽/м²</Form.Label>
                    <Form.Control
                      size="sm"
                      type="number"
                      min={0}
                      step={100}
                      placeholder="без ограничения"
                      value={form.priceMax}
                      onChange={(e) => update('priceMax', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="filter-actions">
                <Button type="submit" variant="success" size="sm" className="btn-accent">
                  Отфильтровать
                </Button>
                <Button type="button" variant="outline-secondary" size="sm" onClick={handleReset}>
                  Сбросить
                </Button>
                <span className="filter-count">Найдено: {cards.length}</span>
              </div>
            </Form>
          </div>
        </Collapse>
      </header>

      <main className="grid-scroll">
        {cards.length === 0 ? (
          <div className="empty-state">
            <Icon path={ICON_GRID} className="empty-state-icon" />
            <h3 className="empty-state-title">Ничего не найдено</h3>
            <p className="empty-state-text">
              По выбранным условиям нет ни одной солнечной панели.
              <br />
              Попробуйте изменить или сбросить фильтр.
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
