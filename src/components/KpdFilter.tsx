import type { FormEvent } from 'react';
import { Button, Form } from 'react-bootstrap';

interface KpdFilterProps {
  value: number;
  max: number;
  found: number;
  onChange: (value: number) => void;
  onSubmit: () => void;
}

export default function KpdFilter({ value, max, found, onChange, onSubmit }: KpdFilterProps) {
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
            onChange={(e) => onChange(Number(e.target.value))}
          />
          <span className="kpd-value">{value}%</span>
          <Button type="submit" variant="success" className="btn-accent filter-btn">
            Отфильтровать
          </Button>
        </div>
      </Form.Group>
      <div className="filter-count">Найдено: {found}</div>
    </Form>
  );
}
