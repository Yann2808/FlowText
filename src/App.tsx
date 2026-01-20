import { useState } from 'react';
import { transformText, normalizeText, type StyleType } from './logic/unicode';

function App() {
  const [text, setText] = useState('FlowText makes your LinkedIn posts stand out.');
  const [copied, setCopied] = useState(false);

  const applyStyle = (style: StyleType) => {
    // Logic similar to Tooltip
    // Convert current to normal first to avoid double styling issues if user clicks multiple
    const normal = normalizeText(text);
    const styled = transformText(normal, style);

    // If result is same (toggle off), revert to normal
    // But since we normalized first, 'styled' will be styled version of normal.
    // If current 'text' is ALREADY that style, we want to revert.
    if (styled === text) {
      setText(normal);
    } else {
      setText(styled);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">FlowText</span>
          </div>
          <a
            href="https://github.com/your-repo/flowtext"
            className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
          🚀 Now available for Chrome & Edge
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Write beautifully on <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">LinkedIn</span>
        </h1>

        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          The minimal browser extension to style your posts with
          <span className="font-serif font-bold text-slate-200 mx-1">Bold</span>,
          <span className="font-serif italic text-slate-200 mx-1">Italic</span>, and
          <span className="text-slate-200 mx-1">𝓢𝓬𝓻𝓲𝓹𝓽</span> directly in the editor.
        </p>

        {/* Interactive Demo */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm max-w-2xl mx-auto mb-16 relative group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-500"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-500"></div>

          {/* Tooltip Simulation */}
          <div className="flex items-center justify-center gap-3 mb-6 bg-slate-900/80 p-2 rounded-xl inline-flex border border-slate-700/50 shadow-lg">
            {/* Reusing Styles Logic */}
            <DemoButton onClick={() => applyStyle('boldSerif')} title="Bold Serif">𝐁</DemoButton>
            <DemoButton onClick={() => applyStyle('italicSerif')} title="Italic Serif">𝑖</DemoButton>
            <div className="w-px h-6 bg-slate-700 mx-1"></div>
            <DemoButton onClick={() => applyStyle('boldSans')} title="Bold Sans">𝗕</DemoButton>
            <DemoButton onClick={() => applyStyle('boldScript')} title="Bold Script">𝓑</DemoButton>
            <div className="w-px h-6 bg-slate-700 mx-1"></div>
            <DemoButton onClick={() => applyStyle('smallCaps')} title="Small Caps" small>ᴄ</DemoButton>
            <DemoButton onClick={() => applyStyle('squared')} title="Squared" small>🅰</DemoButton>
            <DemoButton onClick={() => applyStyle('circles')} title="Circles" small>ⓐ</DemoButton>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-transparent text-xl md:text-2xl text-center focus:outline-none min-h-[120px] resize-none placeholder-slate-600"
            spellCheck="false"
          />

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleCopy}
              className="text-sm text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-2"
            >
              {copied ? '✅ Copied!' : 'Click to copy text'}
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl w-full md:w-auto">
            Download for Chrome
          </button>
          <button className="px-8 py-4 bg-slate-800 text-white rounded-full font-bold text-lg hover:bg-slate-700 border border-slate-700 w-full md:w-auto">
            View Source Code
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} FlowText. Open Source.</p>
      </footer>
    </div>
  )
}

const DemoButton = ({ children, onClick, title, small }: { children: React.ReactNode, onClick: () => void, title: string, small?: boolean }) => (
  <button
    onClick={onClick}
    title={title}
    className={`
      hover:bg-slate-700 rounded-lg transition-all duration-200 
      flex items-center justify-center text-slate-200 hover:text-white hover:scale-110 active:scale-95
      ${small ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-xl'}
    `}
  >
    {children}
  </button>
);

export default App
