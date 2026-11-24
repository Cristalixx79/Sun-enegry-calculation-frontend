import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { authErrorMessage, loginRequest } from '../auth/authApi';
import { MOCK_ONLY } from '../config';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser } from '../store/slices/authSlice';

/**
 * Страница входа. Запрос выполняется вручную через axios (без кодогенерации и thunk),
 * результат передаётся в Redux вызовом setUser.
 */
export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Уже вошедшему пользователю (и в демо-версии без бэкенда) страница входа не нужна
  if (isAuthenticated || MOCK_ONLY) return <Navigate to="/feed" replace />;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const user = await loginRequest(username.trim(), password);
      dispatch(setUser(user));
      navigate('/feed');
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <header className="form-page-header">
        <h1>Вход</h1>
      </header>
      <main className="form-scroll">
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-block" controlId="auth-username">
            <Form.Label>Имя пользователя</Form.Label>
            <Form.Control
              type="text"
              required
              minLength={3}
              maxLength={50}
              autoComplete="username"
              value={username}
              disabled={busy}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="form-block" controlId="auth-password">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              required
              minLength={6}
              maxLength={128}
              autoComplete="current-password"
              value={password}
              disabled={busy}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="success" className="btn-accent btn-wide" disabled={busy}>
            {busy && <Spinner animation="border" size="sm" className="me-2" />}
            Войти
          </Button>
        </Form>
      </main>
    </>
  );
}
