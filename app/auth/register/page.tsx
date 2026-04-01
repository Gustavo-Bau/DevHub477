'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const roles = ['buyer', 'seller', 'freelancer'] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState<(typeof roles)[number]>('buyer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        bio,
        skills: skills.split(',').map((skill) => skill.trim()),
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error ?? 'Unable to register right now.');
      setLoading(false);
      return;
    }

    const loginResult = await signIn('credentials', { email, password, callbackUrl: '/dashboard', redirect: false });

    setLoading(false);
    if (loginResult?.error) {
      router.push('/auth/login');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <main style={{ maxWidth: 600, margin: '3rem auto' }}>
      <h1>Create an account</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="role">Role</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value as (typeof roles)[number])}>
          {roles.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label htmlFor="bio">Bio</label>
        <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />

        <label htmlFor="skills">Skills (comma separated)</label>
        <input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      {error ? <p>{error}</p> : null}
      <p>
        Already have an account? <a href="/auth/login">Login</a>
      </p>
    </main>
  );
}
