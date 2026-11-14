import type { FormEvent } from 'react';
import { Button, Form } from 'react-bootstrap';

interface KpdFilterProps {
  /** Текущее положение ползунка, % */
  value: number;
  /** Максимум шкалы, % */
  max: number;
  /** Сколько услуг найдено при применённом фильтре */
  found: number;
  /** Блокирует ползунок и кнопку на время запроса */
  disabled: boolean;
  /** Вызывается при движении ползунка и передаёт новое значение родителю */
  onChange: (value: number) => void;
  /** Вызывается при нажатии «Отфильтровать» */
  onSubmit: () => void;
}

/**
 * Фильтр по КПД: ползунок и кнопка. Компонент «управляемый»: значение хранит
 * Redux (filtersSlice), а сюда оно приходит через props от TilesPage.
 */
export default function KpdFilter({ value, max, found, disabled, onChange, onSubmit }: KpdFilterProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <Form className="kpd-filter" onSubmit={handleSubmit}>
      <Form.Group controlId="kpd-filter">
        <Form.Label className="filter-label">Фильтр по КПД</Form.Label>
        <div className="filter-row">
          <Form.Range
            min={0}
            max={max}
            step={1}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(Number(e.target.value))}
          />
          <span className="kpd-value">{value}%</span>
          <Button type="submit" variant="success" className="btn-accent filter-btn" disabled={disabled}>
            Отфильтровать
          </Button>
        </div>
      </Form.Group>
      <div className="filter-count">Найдено: {found}</div>
    </Form>
  );
}
