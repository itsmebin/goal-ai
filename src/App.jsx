import React, { useState, useEffect, useRef } from 'react';
import {
  Home, MessageSquare, Wrench, BarChart2, Settings, Search,
  Bell, User, Zap, Droplets, Flame, Trophy, Calendar,
  Activity, PlayCircle, Camera, CheckCircle, Video,
  TrendingUp, Crosshair, Dumbbell, Smartphone, WifiOff,
  Mic, Share2, Award, ChevronRight, Send, Loader, XCircle,
  LogIn, Mail, UserPlus, LogOut, Edit3, Key, Save, History
} from 'lucide-react';

// --- CUSTOM HOOK: LOCAL STORAGE PERSISTENCE ---
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export default function App() {
  const [activeTab, setActiveTab] = useState('tools');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Persisted Storage States
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('goalai_isLoggedIn', false);
  const [userMode, setUserMode] = useLocalStorage('goalai_userMode', null); // 'guest' | 'email'
  const [userData, setUserData] = useLocalStorage('goalai_userData', {
    name: "Alex Doe",
    bio: "Penggemar angkat beban dan gaya hidup sehat.",
    goal: "Hypertrophy (Bulking)",
    level: 12,
    xp: 4500
  });

  const [apiKey, setApiKey] = useLocalStorage('goalai_apiKey', '');
  const [messages, setMessages] = useLocalStorage('goalai_chatMessages', [
    { id: 1, role: 'ai', text: `Halo! Senang melihatmu kembali. Ada yang bisa saya bantu dengan target kamu?` }
  ]);
  const [analysisRecords, setAnalysisRecords] = useLocalStorage('goalai_analysisRecords', []);

  // Jika belum login, tampilkan halaman Welcome/Auth
  if (!isLoggedIn) {
    return <WelcomePage onLogin={(mode, data) => {
      setUserMode(mode);
      if (data) setUserData({ ...userData, ...data });
      setIsLoggedIn(true);
    }} />;
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-neutral-900 border-r border-neutral-800">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Goal Ai</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavItem icon={<Home size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<MessageSquare size={20} />} label="AI Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          <NavItem icon={<Wrench size={20} />} label="AI Tools" active={activeTab === 'tools'} onClick={() => setActiveTab('tools')} />
          <NavItem icon={<BarChart2 size={20} />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <NavItem icon={<User size={20} />} label="Profil Saya" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          <NavItem icon={<Settings size={20} />} label="Pengaturan" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 m-4 bg-neutral-800 rounded-2xl border border-neutral-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden border border-neutral-600">
              <User size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{userData.name}</p>
              <p className="text-xs text-indigo-400">Level {userData.level} • {userMode === 'guest' ? 'Guest' : 'Member'}</p>
            </div>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-1.5 mb-1">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-6 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
              <input
                type="text"
                placeholder="Tanya Goal Ai apa saja..."
                className="w-full bg-neutral-900 border border-neutral-800 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="md:hidden font-bold text-lg text-white">Goal Ai</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>
            <button onClick={() => setActiveTab('profile')} className="md:hidden w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 overflow-hidden">
              <User size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
          {activeTab === 'dashboard' && <Dashboard user={userData} />}
          {activeTab === 'chat' && <AIChat user={userData} apiKey={apiKey} messages={messages} setMessages={setMessages} />}
          {activeTab === 'tools' && <AITools apiKey={apiKey} analysisRecords={analysisRecords} setAnalysisRecords={setAnalysisRecords} />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'profile' && <ProfilePage user={userData} setUser={setUserData} mode={userMode} analysisRecords={analysisRecords} onLogout={() => {setIsLoggedIn(false); setMessages([]); setAnalysisRecords([]);}} />}
          {activeTab === 'settings' && <SettingsPage apiKey={apiKey} setApiKey={setApiKey} />}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 w-full bg-neutral-900 border-t border-neutral-800 flex items-center justify-around p-3 z-50">
        <MobileNavItem icon={<Home size={22} />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <MobileNavItem icon={<MessageSquare size={22} />} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
        <MobileNavItem icon={<Wrench size={22} />} active={activeTab === 'tools'} onClick={() => setActiveTab('tools')} />
        <MobileNavItem icon={<BarChart2 size={22} />} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        <MobileNavItem icon={<User size={22} />} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>
    </div>
  );
}

// --- WELCOME & AUTH PAGE ---

function WelcomePage({ onLogin }) {
  const [view, setView] = useState('landing'); // 'landing' | 'email' | 'onboarding'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (view === 'landing') {
    return (
      <div className="h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
          <Zap size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-white mb-3">Goal Ai</h1>
        <p className="text-neutral-400 max-w-xs mb-10 text-sm leading-relaxed">Asisten kebugaran masa depan dengan kecerdasan buatan untuk hasil nyata.</p>

        <div className="w-full max-w-xs space-y-3">
          <button onClick={() => setView('email')} className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition">
            <Mail size={18} /> Lanjutkan dengan Email
          </button>
          <button onClick={() => onLogin('guest', { name: 'Guest User' })} className="w-full py-3 bg-neutral-900 text-white font-bold rounded-xl border border-neutral-800 hover:bg-neutral-800 transition">
            Masuk sebagai Tamu
          </button>
        </div>
        <p className="mt-8 text-xs text-neutral-600">Dengan masuk, Anda menyetujui Ketentuan Layanan kami.</p>
      </div>
    );
  }

  if (view === 'email') {
    return (
      <div className="h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 animate-in slide-in-from-right duration-300">
        <div className="w-full max-w-xs">
          <h2 className="text-2xl font-bold text-white mb-2 text-left">Masukkan Email</h2>
          <p className="text-sm text-neutral-400 mb-6 text-left">Gunakan email aktif untuk menyimpan progres latihan Anda.</p>
          <input
            type="email"
            placeholder="nama@perusahaan.com"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 mb-4 text-white focus:outline-none focus:border-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => setView('onboarding')} className="w-full py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition">
            Lanjutkan
          </button>
          <button onClick={() => setView('landing')} className="w-full mt-2 text-sm text-neutral-500 py-2">Kembali</button>
        </div>
      </div>
    );
  }

  if (view === 'onboarding') {
    return (
      <div className="h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 animate-in slide-in-from-right duration-300">
        <div className="w-full max-w-xs">
          <h2 className="text-2xl font-bold text-white mb-2">Kenalan Yuk!</h2>
          <p className="text-sm text-neutral-400 mb-6">Siapa nama Anda agar AI bisa menyapa dengan benar?</p>
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 mb-4 text-white focus:outline-none focus:border-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            disabled={!name.trim()}
            onClick={() => onLogin('email', { name })}
            className="w-full py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition disabled:opacity-50"
          >
            Mulai Perjalanan Saya
          </button>
        </div>
      </div>
    );
  }
}

// --- CORE AI FUNCTIONS ---

async function fetchGemini(prompt, userContext = "", apiKey) {
  if (!apiKey) return "Error: API Key Gemini belum diatur.";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const systemPrompt = `Anda adalah Goal Ai. User Context: ${userContext}. Berikan jawaban ringkas, akurat, dan sangat motivatif (hindari kalimat terlalu panjang).`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Ups, sistem gagal memberikan respon.";
  } catch (e) {
    return "Koneksi terputus ke server AI: " + e.message;
  }
}

async function fetchGeminiVision(prompt, base64Image, apiKey) {
  if (!apiKey) throw new Error("API Key Gemini belum diatur.");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }]
      })
    });
    
    if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.error?.message || "Gagal mendapatkan respon API.");
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Gambar berhasil diterima namun tidak ada respon analisis.";
  } catch (e) {
    throw e;
  }
}

// --- COMPONENTS ---

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${active ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800/50'}`}>
      {React.cloneElement(icon, { className: active ? 'text-indigo-400' : 'text-neutral-500' })}
      {label}
    </button>
  );
}

function MobileNavItem({ icon, active, onClick }) {
  return (
    <button onClick={onClick} className={`p-3 rounded-xl transition-all ${active ? 'bg-neutral-800 text-indigo-400' : 'text-neutral-400'}`}>{icon}</button>
  );
}

function Card({ children, className = '' }) {
  return <div className={`bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm ${className}`}>{children}</div>;
}

// --- PAGES ---

function Dashboard({ user }) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Halo, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-neutral-400 text-sm">Target Fokus: <span className="text-white">{user.goal}</span></p>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 rounded-xl flex items-start gap-3 max-w-sm">
          <Zap size={20} className="text-indigo-400 mt-0.5" />
          <p className="text-sm text-neutral-200">AI: "Set API Key Anda di Pengaturan untuk menganalisa form latihan dan memulai sesi percakapan."</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar size={18} /> Jadwal Latihan</h2>
          <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-800 flex flex-col md:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-neutral-800 flex items-center justify-center flex-shrink-0"><Dumbbell size={28} className="text-white" /></div>
            <div className="flex-1"><h3 className="font-bold text-white text-lg">Push Day</h3><p className="text-sm text-neutral-400">Personalized for {user.name}</p></div>
            <button className="w-full md:w-auto px-6 py-2.5 bg-white text-black font-semibold rounded-xl">Mulai</button>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Flame size={18} /> Nutrisi</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm"><span className="text-neutral-400">Kalori</span><span className="text-white">1,800 / 2,500</span></div>
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden"><div className="bg-orange-500 h-full" style={{ width: '72%' }}></div></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProfilePage({ user, setUser, mode, onLogout, analysisRecords }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20"></div>
        <div className="relative pt-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-neutral-800 border-4 border-neutral-950 flex items-center justify-center mb-4 overflow-hidden shadow-xl">
            <User size={48} className="text-neutral-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-indigo-400 text-sm font-medium mb-2">{mode === 'guest' ? 'Akun Guest' : 'Member Terverifikasi'}</p>
          <div className="bg-neutral-800 px-4 py-1.5 rounded-full border border-neutral-700 text-xs text-neutral-300 mb-6">
            Lvl {user.level} Fit Explorer
          </div>

          <div className="grid grid-cols-3 gap-8 w-full border-t border-neutral-800 pt-6">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{(analysisRecords?.length || 0)}</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Form Checks</p>
            </div>
            <div className="text-center border-x border-neutral-800">
              <p className="text-lg font-bold text-white">4.5k</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">XP Total</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">12</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Badges</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2"><Edit3 size={16} /> Tentang Saya</h3>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="text-xs font-bold px-3 py-1.5 bg-neutral-800 rounded flex gap-1 items-center hover:bg-neutral-700 text-indigo-400 transition"><Edit3 size={12}/> Edit</button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="text-xs px-3 py-1.5 bg-neutral-800 rounded hover:bg-neutral-700 text-neutral-300 transition">Batal</button>
              <button onClick={handleSave} className="text-xs px-3 py-1.5 bg-indigo-500 rounded text-white font-bold hover:bg-indigo-600 transition">Simpan</button>
            </div>
          )}
        </div>
        
        {!isEditing ? (
          <>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">{user.bio}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs py-2 border-b border-neutral-800"><span className="text-neutral-500">Nama</span><span className="text-neutral-200">{user.name}</span></div>
              <div className="flex justify-between text-xs py-2 border-b border-neutral-800"><span className="text-neutral-500">Goal Utama</span><span className="text-neutral-200">{user.goal}</span></div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div><label className="text-xs text-neutral-500 block mb-1">Nama Lengkap</label><input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none" /></div>
            <div><label className="text-xs text-neutral-500 block mb-1">Goal Utama</label><input type="text" value={editForm.goal} onChange={e => setEditForm({...editForm, goal: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none" /></div>
            <div><label className="text-xs text-neutral-500 block mb-1">Bio</label><textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none" rows={3}></textarea></div>
          </div>
        )}
      </Card>
      
      {analysisRecords && analysisRecords.length > 0 && (
        <Card>
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><History size={16} /> Riwayat Analisis Kamera AI</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {analysisRecords.slice().reverse().map(rec => (
              <div key={rec.id} className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col md:flex-row gap-4 items-start">
                 <img src={rec.image} alt="Form frame" className="w-full md:w-32 h-32 rounded-lg object-cover bg-neutral-900" />
                 <div className="flex-1">
                   <p className="text-xs text-indigo-400 font-semibold mb-2">{new Date(rec.id).toLocaleString()}</p>
                   <p className="text-sm text-neutral-300 leading-relaxed bg-neutral-900 border border-neutral-800 p-3 rounded-lg"><Zap size={14} className="inline mr-1 text-indigo-500"/> {rec.feedback}</p>
                 </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <button onClick={onLogout} className="w-full mt-4 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl border border-red-500/20 flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition">
        <LogOut size={18} /> Keluar & Hapus Data Sesi
      </button>
    </div>
  );
}

function AIChat({ user, messages, setMessages, apiKey }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    if (!apiKey) {
      alert("API Key Gemini belum diatur. Silakan atur di menu Pengaturan terlebih dahulu.");
      return;
    }

    const userMsg = input;
    // Tampilkan pesan pengguna
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const context = `Nama User: ${user.name}. Fokus: ${user.goal}. Karakteristik User: ${user.bio}`;
    const aiResponse = await fetchGemini(userMsg, context, apiKey);
    
    // Tampilkan respon AI
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: aiResponse }]);
    setLoading(false);
  };

  const resetChat = () => {
    if(confirm("Hapus seluruh riwayat chat?")) {
      setMessages([{ id: Date.now(), role: 'ai', text: `Halo ${user.name}! Saya sudah mengosongkan ingatan saya. Mau ngobrolin apa?` }]);
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-in fade-in">
      <Card className="flex-1 flex flex-col p-0 overflow-hidden border border-neutral-800 h-full">
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
             <h2 className="font-bold text-white">Goal AI Assistant</h2>
          </div>
          <button onClick={resetChat} className="text-xs px-3 py-1 border border-neutral-700 hover:bg-neutral-800 rounded-lg text-neutral-400">Clear</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950/30">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-indigo-600' : 'bg-neutral-800 border border-neutral-700'}`}>
                {msg.role === 'ai' ? <Zap size={14} className="text-white" /> : <User size={14} className="text-white" />}
              </div>
              <div className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'ai' ? 'bg-neutral-800 text-neutral-200 rounded-tl-none border border-neutral-700/50 shadow-sm' : 'bg-white text-black rounded-tr-none font-medium'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center animate-pulse"><Zap size={14} className="text-white" /></div>
              <div className="bg-neutral-800 p-3.5 rounded-2xl rounded-tl-none text-xs text-neutral-400 animate-pulse border border-neutral-700/50">Menganalisa target Anda...</div></div>
          )}
          <div ref={scrollRef} className="pb-2" />
        </div>
        <form onSubmit={handleSend} className="p-4 border-t border-neutral-800 bg-neutral-900 z-10">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Tanya seputar progres latihan kamu..." 
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:border-indigo-500 text-white shadow-inner" 
              disabled={loading} 
            />
            <button type="submit" className={`absolute right-2 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${input.trim() ? 'bg-indigo-500 text-white' : 'bg-neutral-800 text-neutral-500'}`} disabled={loading}>
              {loading ? <Loader size={16} className="animate-spin text-white" /> : <Send size={16} className={input.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function AITools({ apiKey, analysisRecords, setAnalysisRecords }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setFeedback(null);
      }
    } catch (err) { alert("Izin kamera ditolak. Pastikan browser Anda mengizinkan akses kamera."); }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const captureAndAnalyze = async () => {
    if (!apiKey) {
      alert("API Key Gemini belum diatur. Sila atur di menu Pengaturan!");
      return;
    }
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;
    
    setIsAnalyzing(true);
    setFeedback("Menghubungi AI Vision...");
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Draw current frame to canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get base64 image (jpeg)
    const base64ImageWithPrefix = canvas.toDataURL('image/jpeg', 0.8);
    const base64Data = base64ImageWithPrefix.split(',')[1];
    
    try {
      const prompt = "Anda adalah AI personal trainer. Silakan Analisa gambar ini secara ringkas. Jelaskan apakah sekilas ada postur/teknik yang salah, atau konfirmasi jika terlihat benar. Jika tidak ada orang di gambar, beritahu. Berikan 1 tipe latihan yang cocok untuk postur ini. (Jawab ringkas dalam bahasa indonesia, max 5 kalimat).";
      const analysisResult = await fetchGeminiVision(prompt, base64Data, apiKey);
      setFeedback(analysisResult);
      
      // Save result immediately to our records hook!
      setAnalysisRecords(prev => [...prev, {
        id: Date.now(),
        image: base64ImageWithPrefix,
        feedback: analysisResult
      }]);
      
    } catch (error) {
      setFeedback("Gagal menganalisa form: " + error.message);
    }
    
    setIsAnalyzing(false);
  };
  
  // Matikan kamera saat pindah halaman
  useEffect(() => {
    return () => { stopCamera(); }
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">AI Tools</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:border-emerald-500/50 transition-all group h-fit">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all"><Camera size={20} /></div>
          <h3 className="font-semibold text-white mb-2 text-lg">AI Form Correction (Vision)</h3>
          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">Pastikan teknik Anda benar dengan AI. Kamera akan merekam 1 frame foto dari postur fisik Anda untuk dianalisa secara mendalam oleh algoritma Vision kami.</p>
          
          <button onClick={cameraActive ? stopCamera : startCamera} className="w-full py-3 mb-3 rounded-xl text-sm font-bold bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition flex items-center justify-center gap-2">
            {cameraActive ? <><XCircle size={18}/> Tutup Kamera</> : <><Camera size={18}/> Buka Kamera</>}
          </button>
          
          {cameraActive && (
             <button 
                onClick={captureAndAnalyze} 
                disabled={isAnalyzing}
                className="w-full py-4 rounded-xl text-sm font-bold bg-emerald-600 shadow-[0_0_15px_rgba(5,150,105,0.4)] text-white hover:bg-emerald-500 transition disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isAnalyzing ? <><Loader size={18} className="animate-spin" /> Menganalisa Gambar...</> : <><Crosshair size={18} /> Capture Frame & Analisa</>}
              </button>
          )}
        </Card>
        
        {cameraActive && (
          <div className="col-span-1 md:col-span-1 space-y-4 animate-in slide-in-from-right duration-500">
            <Card className="p-2 border-emerald-500/30 overflow-hidden bg-neutral-950">
                <div className="relative rounded-xl overflow-hidden bg-neutral-900 aspect-video flex-center">
                    <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${isAnalyzing ? 'blur-sm grayscale opacity-50' : ''} transition-all`} />
                    {isAnalyzing && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400 flex flex-col items-center gap-3 bg-black/80 px-6 py-4 rounded-xl">
                        <Loader size={32} className="animate-spin" />
                        <span className="font-bold text-sm tracking-wide">Processing Vision...</span>
                      </div>
                    )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
            </Card>
            
            {feedback && (
              <Card className="bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <h4 className="font-bold text-white flex gap-2 items-center mb-3"><CheckCircle size={18} className="text-emerald-400" /> Hasil Analisis Vision</h4>
                <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                   {feedback}
                </p>
                {!isAnalyzing && <p className="text-[10px] text-neutral-500 mt-4 uppercase tracking-wider text-right">Data tersimpan di riwayat</p>}
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Statistik</h1>
      <Card><div className="h-40 flex items-end justify-between gap-1">{[30, 60, 40, 80, 50, 90, 70].map((h, i) => (<div key={i} className="w-full bg-indigo-500/20 rounded-t-md relative group"><div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-md transition-all duration-1000" style={{ height: `${h}%` }}></div></div>))}</div></Card>
    </div>
  );
}

function SettingsPage({ apiKey, setApiKey }) {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSaveKey = () => {
    setApiKey(keyInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Pengaturan</h1>
      
      <Card className="border-indigo-500/30">
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2"><Key size={20} className="text-indigo-400" /> Konfigurasi AI API</h3>
        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
          Untuk menggunakan fitur Chat dan Form Correction yang terhubung ke internet, Anda membutuhkan <strong className="text-white">Google Gemini API Key</strong>. <br/>Dapatkan gratis di <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-indigo-400 font-bold underline">Google AI Studio</a>.
        </p>
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="password" 
            value={keyInput} 
            onChange={e => setKeyInput(e.target.value)} 
            placeholder="Ketik AIzaSy... (Aman & tersimpan lokal)" 
            className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl pl-4 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white shadow-inner font-mono" 
          />
          <button onClick={handleSaveKey} className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-500/20">
            {saved ? <CheckCircle size={18} /> : <Save size={18} />} {saved ? 'Tersimpan!' : 'Simpan Key'}
          </button>
        </div>
        {(!apiKey) && (
          <div className="mt-5 p-4 bg-orange-500/10 border border-orange-500/20 flex gap-3 rounded-xl items-start">
             <Zap className="text-orange-400 flex-shrink-0" size={20}/>
             <p className="text-orange-400/90 text-sm font-medium">API Key belum diatur. Aplikasi tidak dapat menghubungi internet untuk layanan AI. Harap atur terlebih dahulu.</p>
          </div>
        )}
      </Card>
      
      <Card>
          <h3 className="font-semibold text-white mb-2">Tentang Keamanan</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">Aplikasi ini tidak memiliki database backend. Kunci API dan semua data log riwayat serta foto yang Anda ambil hanya tersimpan secara lokal pada browser di perangkat ini. Jangan sebarkan tangkapan layar (screenshot) jika API Key Anda terlihat.</p>
      </Card>
    </div>
  );
}