import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DesignSystem: React.FC = () => {
  const [wordWrap, setWordWrap] = useState<boolean>(true);

  return (
    <div className="flex flex-col min-h-screen bg-[#0b141c] text-on-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141c24] border-r border-[#414752] p-6 flex flex-col fixed top-0 bottom-0 left-0 overflow-y-auto">
        <div className="brand flex items-center gap-2 font-bold text-lg mb-8 select-none text-on-surface">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <polygon points="12 2 2 22 22 22"></polygon>
          </svg>
          DEVCOLLAB
        </div>
        <nav className="flex-grow">
          <ul className="space-y-1 list-none">
            <li className="px-3 py-2 rounded bg-secondary-container text-on-secondary-container border-l-2 border-primary font-label-sm text-label-sm">
              <a href="#brand-style" className="block text-inherit no-underline">Brand & Style</a>
            </li>
            <li className="px-3 py-2 rounded text-on-surface-variant hover:bg-surface-variant font-label-sm text-label-sm">
              <a href="#colors" className="block text-inherit no-underline">Colors</a>
            </li>
            <li className="px-3 py-2 rounded text-on-surface-variant hover:bg-surface-variant font-label-sm text-label-sm">
              <a href="#typography" className="block text-inherit no-underline">Typography</a>
            </li>
            <li className="px-3 py-2 rounded text-on-surface-variant hover:bg-surface-variant font-label-sm text-label-sm">
              <a href="#spacing-layouts" className="block text-inherit no-underline">Layouts & Spacing</a>
            </li>
            <li className="px-3 py-2 rounded text-on-surface-variant hover:bg-surface-variant font-label-sm text-label-sm">
              <a href="#components" className="block text-inherit no-underline">Components</a>
            </li>
          </ul>
        </nav>
        <div className="pt-4 border-t border-[#414752] mt-auto">
          <Link to="/dashboard" className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-container py-2 rounded font-label-sm text-label-sm hover:opacity-90 transition-opacity no-underline">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Showcase */}
      <main className="ml-64 flex-1 p-10 max-w-5xl overflow-y-auto">
        <header className="mb-10 border-b border-[#414752] pb-6">
          <h1 className="text-[28px] font-semibold tracking-tight mb-2">DevCollab Design System v1.2</h1>
          <p className="text-on-surface-variant text-base">Technical precision, high-density collaboration layout, and systematic utility aesthetic for professional developer workspaces.</p>
        </header>

        {/* Brand & Style */}
        <section id="brand-style" className="mb-12 scroll-margin-top-10">
          <h2 className="text-lg font-semibold mb-5 pb-2 border-b border-[#414752]">Brand & Style</h2>
          <div className="bg-[#182028] p-6 border border-[#414752] rounded-lg">
            <h4 className="text-sm font-semibold mb-3">The Creative North Star</h4>
            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
              The design system is engineered for deep focus and technical precision, catering to developers who require a high-performance environment for real-time collaboration. The brand personality is systematic, utilitarian, and dependable, mirroring the "no-nonsense" aesthetic of professional integrated development environments (IDEs).
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 text-xs font-semibold rounded bg-[#58a6ff]/10 text-primary border border-[#58a6ff]/20">Modern Minimalism</span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded bg-[#58a6ff]/10 text-primary border border-[#58a6ff]/20">Developer-Centric</span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded bg-[#58a6ff]/10 text-primary border border-[#58a6ff]/20">High Density</span>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section id="colors" className="mb-12">
          <h2 className="text-lg font-semibold mb-5 pb-2 border-b border-[#414752]">Colors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Primary */}
            <div className="bg-[#182028] border border-[#414752] rounded-lg overflow-hidden flex flex-col">
              <div className="h-24 bg-[#58a6ff]"></div>
              <div className="p-3">
                <div className="font-semibold text-sm">Primary</div>
                <div className="text-xs text-on-surface-variant font-code-md">#58a6ff</div>
              </div>
            </div>
            {/* Secondary */}
            <div className="bg-[#182028] border border-[#414752] rounded-lg overflow-hidden flex flex-col">
              <div className="h-24 bg-[#238636]"></div>
              <div className="p-3">
                <div className="font-semibold text-sm">Secondary</div>
                <div className="text-xs text-on-surface-variant font-code-md">#238636</div>
              </div>
            </div>
            {/* Tertiary */}
            <div className="bg-[#182028] border border-[#414752] rounded-lg overflow-hidden flex flex-col">
              <div className="h-24 bg-[#d29922]"></div>
              <div className="p-3">
                <div className="font-semibold text-sm">Tertiary</div>
                <div className="text-xs text-on-surface-variant font-code-md">#d29922</div>
              </div>
            </div>
            {/* Surface */}
            <div className="bg-[#182028] border border-[#414752] rounded-lg overflow-hidden flex flex-col">
              <div className="h-24 bg-[#0b141c]"></div>
              <div className="p-3">
                <div className="font-semibold text-sm">Surface Base</div>
                <div className="text-xs text-on-surface-variant font-code-md">#0b141c</div>
              </div>
            </div>
            {/* Outline Variant */}
            <div className="bg-[#182028] border border-[#414752] rounded-lg overflow-hidden flex flex-col">
              <div className="h-24 bg-[#414752]"></div>
              <div className="p-3">
                <div className="font-semibold text-sm">Outline Variant</div>
                <div className="text-xs text-on-surface-variant font-code-md">#414752</div>
              </div>
            </div>
            {/* Error */}
            <div className="bg-[#182028] border border-[#414752] rounded-lg overflow-hidden flex flex-col">
              <div className="h-24 bg-[#93000a]"></div>
              <div className="p-3">
                <div className="font-semibold text-sm">Error</div>
                <div className="text-xs text-on-surface-variant font-code-md">#93000a</div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section id="typography" className="mb-12">
          <h2 className="text-lg font-semibold mb-5 pb-2 border-b border-[#414752]">Typography</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#414752]">
                <th className="text-left py-3 px-4 font-semibold text-on-surface-variant text-sm">Token</th>
                <th className="text-left py-3 px-4 font-semibold text-on-surface-variant text-sm">Typeface</th>
                <th className="text-left py-3 px-4 font-semibold text-on-surface-variant text-sm">Size / Weight</th>
                <th className="text-left py-3 px-4 font-semibold text-on-surface-variant text-sm">Preview</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#414752]/50">
                <td className="py-3.5 px-4 font-semibold text-sm">headline-lg</td>
                <td className="py-3.5 px-4 text-sm text-on-surface-variant">Geist</td>
                <td className="py-3.5 px-4 text-sm text-on-surface-variant">24px / SemiBold</td>
                <td className="py-3.5 px-4 text-lg font-semibold tracking-tight text-on-surface">Design System</td>
              </tr>
              <tr className="border-b border-[#414752]/50">
                <td className="py-3.5 px-4 font-semibold text-sm">headline-md</td>
                <td className="py-3.5 px-4 text-sm text-on-surface-variant">Geist</td>
                <td className="py-3.5 px-4 text-sm text-on-surface-variant">20px / SemiBold</td>
                <td className="py-3.5 px-4 text-base font-semibold text-on-surface">Color Palette</td>
              </tr>
              <tr className="border-b border-[#414752]/50">
                <td className="py-3.5 px-4 font-semibold text-sm">body-lg</td>
                <td className="py-3.5 px-4 text-sm text-on-surface-variant">Geist</td>
                <td className="py-3.5 px-4 text-sm text-on-surface-variant">16px / Regular</td>
                <td className="py-3.5 px-4 text-body-lg text-on-surface">The quick brown fox jumps over the lazy dog.</td>
              </tr>
              <tr className="border-b border-[#414752]/50">
                <td className="py-3.5 px-4 font-semibold text-sm">body-md</td>
                <td className="py-3.5 px-4 text-sm text-on-surface-variant">Geist</td>
                <td className="py-3.5 px-4 text-sm text-on-surface-variant">14px / Regular</td>
                <td className="py-3.5 px-4 text-body-md text-on-surface-variant">The quick brown fox jumps over the lazy dog.</td>
              </tr>
              <tr className="border-b border-[#414752]/50">
                <td className="py-3.5 px-4 font-semibold text-sm">code-md</td>
                <td className="py-3.5 px-4 text-sm text-on-surface-variant">JetBrains Mono</td>
                <td className="py-3.5 px-4 text-sm text-on-surface-variant">14px / Regular</td>
                <td className="py-3.5 px-4 text-code-md text-primary font-code-md">import &#123; config &#125; from '@devcollab/core';</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Components Showcase */}
        <section id="components" className="mb-12">
          <h2 className="text-lg font-semibold mb-5 pb-2 border-b border-[#414752]">Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buttons */}
            <div className="bg-[#141c24] border border-[#414752] rounded-lg p-6 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-on-surface-variant pb-2 border-b border-[#414752]/50 mb-2">Buttons</h3>
              <div className="flex flex-wrap gap-2.5">
                <button className="px-4 py-2 text-xs font-semibold rounded bg-primary-container text-on-primary-container hover:opacity-90 border-none cursor-pointer">Save Changes</button>
                <button className="px-4 py-2 text-xs font-semibold rounded bg-transparent border border-[#414752] text-on-surface hover:bg-surface-variant cursor-pointer">Cancel</button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button className="px-4 py-2 text-xs font-semibold rounded bg-transparent border border-primary text-primary hover:bg-primary-container/10 cursor-pointer">Outline Button</button>
                <button className="px-4 py-2 text-xs font-semibold rounded bg-transparent border border-error-container text-error hover:bg-error-container/20 cursor-pointer">Delete Room</button>
              </div>
            </div>

            {/* Inputs */}
            <div className="bg-[#141c24] border border-[#414752] rounded-lg p-6 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-on-surface-variant pb-2 border-b border-[#414752]/50 mb-2">Inputs & Controls</h3>
              <input type="text" placeholder="Enter username..." className="w-full bg-[#0b141c] border border-[#414752] text-on-surface rounded px-3 py-2 text-sm focus:border-primary outline-none" />
              <div className="flex flex-col gap-2.5 mt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-[#0b141c] border border-[#414752] accent-primary" />
                  <span>Stay logged in</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer text-sm">
                  <span>Mute notifications</span>
                  <span className="relative inline-block w-9 h-5">
                    <input type="checkbox" checked={wordWrap} onChange={(e) => setWordWrap(e.target.checked)} className="sr-only peer" />
                    <span className="absolute top-0 bottom-0 left-0 right-0 rounded-full cursor-pointer bg-surface-variant peer-checked:bg-primary-container transition-colors slider"></span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DesignSystem;
