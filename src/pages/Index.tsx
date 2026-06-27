import Icon from '@/components/ui/icon';

const platforms = [
  { emoji: '▶️', name: 'YouTube', desc: 'Видео, Shorts, плейлисты — качество от 360p до 4K' },
  { emoji: '🎵', name: 'TikTok', desc: 'Короткие видео без водяного знака' },
  { emoji: '📸', name: 'Instagram', desc: 'Reels и посты с видео' },
];

const steps = [
  { n: '01', emoji: '🔗', title: 'Отправь ссылку', desc: 'Скопируй URL видео и кинь боту в чат' },
  { n: '02', emoji: '🎛️', title: 'Выбери качество', desc: 'Бот покажет доступные форматы: 360p, 720p, 1080p, 4K' },
  { n: '03', emoji: '⚡', title: 'Получи видео', desc: 'Файл придёт прямо в Telegram за секунды' },
];

const commands = [
  { cmd: '/start', emoji: '🚀', desc: 'Запустить бота' },
  { cmd: '/help', emoji: '🆘', desc: 'Инструкция по использованию' },
  { cmd: '/formats', emoji: '🎛️', desc: 'Узнать доступные форматы для ссылки' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-rose-600/25 blur-[130px] animate-blob" />
        <div className="absolute top-[30%] right-[0%] w-[35vw] h-[35vw] rounded-full bg-orange-500/20 blur-[120px] animate-blob" style={{ animationDelay: '5s' }} />
        <div className="absolute bottom-[5%] left-[25%] w-[30vw] h-[30vw] rounded-full bg-yellow-500/15 blur-[120px] animate-blob" style={{ animationDelay: '9s' }} />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-float">📥</span>
          <span className="font-display font-extrabold text-xl tracking-tight">SAVEIT</span>
        </div>
        <a href="#" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-105">
          <Icon name="Send" size={16} />
          Открыть в Telegram
        </a>
      </header>

      <section className="relative z-10 px-6 md:px-12 pt-10 md:pt-16 pb-24 max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-rose-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-blink" /> Работает 24/7 · Бесплатно
          </div>
          <h1 className="font-display font-black text-5xl md:text-7xl leading-[0.92] mb-6">
            Скачай<br /><span className="text-gradient">любое</span><br />видео 📥
          </h1>
          <p className="text-lg text-white/60 mb-8 max-w-md">
            YouTube, TikTok, Instagram — отправь ссылку боту и получи видео в любом качестве прямо в Telegram.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold rounded-full px-7 py-4 hover:scale-105 transition-transform">
              <Icon name="Send" size={18} /> Запустить бота
            </a>
            <a href="#how" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-7 py-4 font-semibold hover:bg-white/10 transition-all">
              <Icon name="Play" size={18} /> Как это работает
            </a>
          </div>
        </div>

        <div className="relative animate-float">
          <div className="rounded-[2rem] bg-[#12101f]/80 backdrop-blur-xl border border-white/10 p-5 shadow-2xl">
            <div className="flex items-center gap-2 pb-4 border-b border-white/5 mb-4">
              <span className="text-xl">📥</span>
              <div>
                <p className="font-semibold text-sm">SAVEIT Bot</p>
                <p className="text-xs text-green-400">онлайн</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-rose-500 to-orange-400 text-white rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%] break-all">
                  https://youtube.com/watch?v=dQw4w9WgXcQ
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white/8 text-white/90 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
                  🎛️ Выбери качество:
                </div>
              </div>
              <div className="flex gap-2 flex-wrap pl-2">
                {['360p', '720p', '1080p ⭐', '4K'].map(q => (
                  <button key={q} className={`text-xs rounded-xl px-3 py-1.5 border transition-all ${q.includes('1080') ? 'bg-gradient-to-r from-rose-500 to-orange-400 border-transparent text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}>
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex justify-start">
                <div className="bg-white/8 text-white/90 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
                  ⚡ Загружаю 1080p... готово!<br />
                  <span className="text-white/50 text-xs">video_1080p.mp4 · 48 МБ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-5">
          {platforms.map((p) => (
            <div key={p.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:-translate-y-1 transition-all">
              <span className="text-3xl mb-3 block">{p.emoji}</span>
              <h3 className="font-display font-bold text-xl mb-1">{p.name}</h3>
              <p className="text-white/50 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="relative z-10 px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-orange-300 mb-2">⚡ КАК ЭТО РАБОТАЕТ</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl">Три шага</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="relative bg-gradient-to-b from-white/8 to-white/[0.02] border border-white/10 rounded-3xl p-7">
              <div className="font-display font-black text-6xl text-white/5 absolute top-4 right-6 select-none">{s.n}</div>
              <div className="text-3xl mb-4 animate-float" style={{ animationDelay: `${parseInt(s.n) * 0.5}s` }}>{s.emoji}</div>
              <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-10 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-rose-300 mb-2">⌨️ КОМАНДЫ</p>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl">Управление ботом</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {commands.map(c => (
            <div key={c.cmd} className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:-translate-y-1 transition-all text-center">
              <div className="text-2xl mb-2 group-hover:scale-125 transition-transform">{c.emoji}</div>
              <code className="font-display font-bold text-base text-gradient block mb-1">{c.cmd}</code>
              <p className="text-xs text-white/50">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-20 max-w-4xl mx-auto text-center">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-rose-600/30 via-orange-500/20 to-yellow-500/20 border border-white/10 p-12 backdrop-blur-sm">
          <div className="text-5xl mb-4 animate-float">📥</div>
          <h2 className="font-display font-black text-4xl md:text-5xl mb-4">Попробуй сейчас!</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">Бесплатно, без регистрации — просто кинь ссылку</p>
          <a href="#" className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold rounded-full px-8 py-4 hover:scale-105 transition-transform">
            <Icon name="Send" size={18} /> Открыть SAVEIT в Telegram
          </a>
        </div>
      </section>

      <footer className="relative z-10 px-6 md:px-12 py-10 text-center text-white/30 text-sm border-t border-white/5">
        <span className="font-display font-bold text-white/50">📥 SAVEIT</span> · Загрузчик видео из Telegram · 2026
      </footer>
    </div>
  );
}
