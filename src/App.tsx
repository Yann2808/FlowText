import { useState } from 'react';
import { transformText, normalizeText, type StyleType } from './logic/unicode';
import { Download, Chrome, Github, CheckCircle2 } from 'lucide-react';

function App() {
  const [text, setText] = useState('FlowText makes your LinkedIn posts stand out.');
  const [copied, setCopied] = useState(false);

  const isStyleActive = (style: StyleType) => {
    return text && transformText(text, style) === text;
  };

  const applyStyle = (style: StyleType) => {
    const isActive = isStyleActive(style);
    if (isActive) {
      setText(normalizeText(text));
    } else {
      setText(transformText(text, style));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const DemoButton = ({ style, icon, title, isTextIcon = false }: { style: StyleType, icon: string, title: string, isTextIcon?: boolean }) => {
    const active = isStyleActive(style);
    return (
      <button
        onClick={() => applyStyle(style)}
        title={title}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
          ${active
            ? 'bg-indigo-500 text-white shadow-lg scale-105'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:scale-105 active:scale-95'
          }
          ${isTextIcon ? 'text-sm font-bold tracking-widest' : 'text-xl'}
        `}
      >
        {icon}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/flowtext-logo.png" alt="FlowText Logo" className="w-8 h-8 rounded-lg" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">FlowText</span>
          </div>
          <a
            href="https://github.com/Yann2808/flowtext"
            className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
          🚀 v1.0 Released on GitHub
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

        {/* Installation Guide */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-16 text-left max-w-2xl mx-auto backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Chrome className="w-6 h-6 text-indigo-400" />
            How to Install (Developer Mode)
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold shrink-0">1</div>
              <div>
                <p className="text-slate-300 font-medium">Download v1.0</p>
                <p className="text-sm text-slate-500">Get the zip file from our GitHub Release.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold shrink-0">2</div>
              <div>
                <p className="text-slate-300 font-medium">Unzip the file</p>
                <p className="text-sm text-slate-500">Extract the folder to a safe location.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold shrink-0">3</div>
              <div>
                <p className="text-slate-300 font-medium">Load in Chrome</p>
                <p className="text-sm text-slate-500">Go to <code className="bg-slate-800 px-1 py-0.5 rounded text-xs">chrome://extensions</code>, toggle <strong>Developer mode</strong>, and click <strong>Load unpacked</strong>.</p>
              </div>
            </div>
          </div>
        </div>


        {/* Interactive Demo */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm max-w-2xl mx-auto mb-16 relative group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-500"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-500"></div>

          {/* Tooltip Simulation */}
          <div className="flex items-center justify-center gap-1.5 mb-6 bg-slate-900/90 p-2 rounded-xl inline-flex border border-slate-700/50 shadow-lg backdrop-blur-md">

            {/* Group 1 */}
            <DemoButton style="boldSans" icon="𝗕" title="Bold Sans" />
            <DemoButton style="boldSerif" icon="𝐁" title="Bold Serif" />
            <DemoButton style="italicSerif" icon="𝑖" title="Italic Serif" />

            <div className="w-px h-6 bg-slate-700 mx-2 opacity-50"></div>

            {/* Group 2 */}
            <DemoButton style="smallCaps" icon="ᴀʙ" title="Small Caps" isTextIcon />
            <DemoButton style="boldScript" icon="𝒮" title="Script" />
            <DemoButton style="squared" icon="🅰" title="Squared" />
            <DemoButton style="circles" icon="Ⓐ" title="Circles" />

            <div className="w-px h-6 bg-slate-700 mx-2 opacity-50"></div>

            {/* More */}
            <button className="flex items-center justify-center w-10 h-10 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <span className="mb-2">...</span>
            </button>
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
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Copied!
                </>
              ) : 'Click to copy text'}
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <a
            href="https://github.com/Yann2808/flowtext/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl w-full md:w-auto flex items-center justify-center gap-3"
          >
            <Download className="w-6 h-6" />
            Download v1.0 (GitHub)
          </a>
          <a
            href="https://github.com/Yann2808/flowtext"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-slate-800 text-white rounded-full font-bold text-lg hover:bg-slate-700 border border-slate-700 w-full md:w-auto flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            View Source Code
          </a>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} FlowText. Open Source.</p>
      </footer>
    </div>
  )
}

export default App
