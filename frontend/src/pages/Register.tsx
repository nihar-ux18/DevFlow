import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RegisterData } from '../types';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData & { confirmPassword: string }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    const registerData: RegisterData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };
    const result = await register(registerData);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="font-body-md text-body-md min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop overflow-hidden bg-[#0b141c] relative">
      {/* Atmospheric Background Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,_#58a6ff33_0%,_transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,_#00712433_0%,_transparent_50%)]"></div>
      </div>

      {/* Registration Container */}
      <div className="w-full max-w-[440px] z-10 relative">
        <div className="auth-card p-8 rounded-lg shadow-2xl bg-[#141c24] border border-[#30363D]">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[32px]">terminal</span>
              <span className="font-headline-md text-headline-md text-primary tracking-tight">DevCollab</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Create Account</h1>
            <p className="text-on-surface-variant font-body-md text-body-md mt-2">Join the professional workspace</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="username">Username</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] group-focus-within:text-primary transition-colors">person</span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="johndoe"
                  className="input-dark w-full pl-10 pr-4 py-2 rounded-lg bg-[#0b141c] border border-[#414752] text-on-surface font-code-md text-code-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline-variant"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="email">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] group-focus-within:text-primary transition-colors">mail</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="dev@example.com"
                  className="input-dark w-full pl-10 pr-4 py-2 rounded-lg bg-[#0b141c] border border-[#414752] text-on-surface font-code-md text-code-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline-variant"
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="password">Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] group-focus-within:text-primary transition-colors">lock</span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="input-dark w-full pl-10 pr-4 py-2 rounded-lg bg-[#0b141c] border border-[#414752] text-on-surface font-code-md text-code-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline-variant"
                  />
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="confirmPassword">Confirm</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] group-focus-within:text-primary transition-colors">lock_reset</span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="input-dark w-full pl-10 pr-4 py-2 rounded-lg bg-[#0b141c] border border-[#414752] text-on-surface font-code-md text-code-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline-variant"
                  />
                </div>
              </div>
            </div>

            {/* Password Requirements Hint */}
            <div className="flex items-start gap-2 py-1.5 px-2 bg-surface-container-high rounded border border-outline-variant">
              <span className="material-symbols-outlined text-tertiary text-[16px] mt-0.5">info</span>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Password must be at least 6 characters long.</p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-wider py-3 rounded-lg hover:brightness-110 active:opacity-80 transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer shadow-lg shadow-primary-container/10"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
              ) : (
                <>
                  Create Account
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center pt-6 border-t border-outline-variant">
            <p className="text-on-surface-variant font-body-md text-body-md">
              Already have an account?{' '}
              <Link className="text-primary hover:underline transition-all ml-1 font-semibold" to="/login">Login</Link>
            </p>
          </div>
        </div>

        {/* Secondary Decoration */}
        <div className="mt-8 flex justify-center items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all">
          <span className="font-code-md text-[12px] uppercase">Encrypted</span>
          <span className="font-code-md text-[12px] uppercase">Dev-Friendly</span>
          <span className="font-code-md text-[12px] uppercase">ISO Certified</span>
        </div>
      </div>
    </div>
  );
};

export default Register;