import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginCredentials } from '../types';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden selection:bg-primary-container selection:text-on-primary-container relative bg-[#0b141c]">
      {/* Ambient Background Element */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="vignette absolute inset-0"></div>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-[420px] px-margin-mobile">
        {/* Identity Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-primary-container mb-4 shadow-xl text-on-primary-container">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-2">DevCollab</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Sign in to your collaborative workspace</p>
        </div>

        {/* Main Card */}
        <div className="glass-card p-8 rounded-lg shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[18px] group-focus-within:text-primary transition-colors">mail</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@company.com"
                  className="w-full bg-[#0d1117] border border-outline-variant text-on-surface font-body-md text-body-md rounded px-10 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-outline-variant outline-none"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">Password</label>
                <a className="text-[11px] font-label-sm text-primary hover:underline transition-all" href="#forgot">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[18px] group-focus-within:text-primary transition-colors">lock</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0d1117] border border-outline-variant text-on-surface font-body-md text-body-md rounded px-10 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-outline-variant outline-none"
                />
              </div>
            </div>

            {/* Primary Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-container hover:bg-[#79b3ff] active:scale-[0.98] text-on-primary-container font-label-sm text-[14px] uppercase tracking-wider font-semibold rounded transition-all shadow-lg shadow-primary-container/10 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="flex-shrink mx-4 font-label-sm text-label-sm text-outline-variant uppercase">OR CONTINUE WITH</span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded hover:bg-surface-variant transition-colors group">
              <img className="w-5 h-5 opacity-80 group-hover:opacity-100" alt="GitHub Logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmcg9m8M1jIbZUM-jurV5tFY_8G-mmkI0Oi60V0tvWXdJqmcQD0eF2bmn7Wh3p1qDQ-aqJI-BQeiHrrfpnGheIM3bjDE8lzklXFgM6GucBfgDq1wUYCZs-gWwnQSrq_deUG5HSoLZHPpMglrfQ7eUhvGOZ24U6xnmCSq1AfgDtmJJnd7xeyUXd1TFEmIypZz9QUCk2KXH0cpbRoDLRXhENsBNwUSSM08F4h3pp8Y7W5Vm-2HNY0psFr7jJEeW3wYvvtMwD_TXJpjA" />
              <span className="font-label-sm text-label-sm text-on-surface">GitHub</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded hover:bg-surface-variant transition-colors group">
              <img className="w-5 h-5 opacity-80 group-hover:opacity-100" alt="Google Logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA71FBITbS53752UOggm-Gj7cnHUJs26xc1d60pIvoQ8U0uSyzXssbeKxFk-1yBYc7OzzkzYxgePWkWXpwmob9TlRgij8Ke8uTWHsLVF0CHidKUoZVh2199db5_I24otO2xNoyWXXoFssfQTVq7kzrhHF2Rt3nsR5jR09KO_ZN9zGvp67SfsJa4DKd7dKuJUJgePO_VPUwE2j_ftwcUY4ccLZhbCBP7puw2rgpqxyx0jNWblOIhIh8jDWGWiYDwQteNpKyucLmEE8M" />
              <span className="font-label-sm text-label-sm text-on-surface">Google</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-8 font-body-md text-body-md text-on-surface-variant">
          Don't have an account?{' '}
          <Link className="text-primary font-semibold hover:underline transition-all" to="/register">Register</Link>
        </p>

        {/* IDE-like status line at bottom for aesthetic */}
        <div className="fixed bottom-0 left-0 w-full px-4 h-6 bg-surface-container-low border-t border-outline-variant flex items-center justify-between font-code-md text-[10px] text-outline opacity-60">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">source</span> main</div>
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">sync</span> Auth Service: Online</div>
          </div>
          <div className="flex items-center gap-4">
            <span>UTF-8</span>
            <span>v1.2.4-stable</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;