import { useState } from 'react';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');

  const tryLogin = async () => {
    try {
      const resp = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: name.trim(), password: pass }) });
      if (!resp.ok) {
        const err = await resp.json();
        alert(err.error || 'Login failed');
        return;
      }
      const data = await resp.json();
      localStorage.setItem('clash-token', data.token);
      localStorage.setItem('clash-user', JSON.stringify(data.user));
      window.location.href = '/';
    } catch (e) {
      alert('Login error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#f1f5f9' }}>
      <div style={{ width: 360, padding: 24, borderRadius: 12, background: '#111827', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
        <h2 style={{ color: '#f59e0b', marginBottom: 8 }}>Clash Tournament — Login</h2>
        <div style={{ marginBottom: 12 }}>
          <input placeholder="username" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input placeholder="password" type="password" value={pass} onChange={(e) => setPass(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6 }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={tryLogin} style={{ flex: 1, padding: '0.6rem', borderRadius: 6, background: '#f59e0b', border: 'none', fontWeight: 700 }}>Login</button>
          <button onClick={() => { setName(''); setPass(''); }} style={{ padding: '0.6rem', borderRadius: 6, background: '#111827', border: '1px solid #334155' }}>Clear</button>
        </div>
        {/* Demo credentials removed from UI for security */}
      </div>
    </div>
  );
}
