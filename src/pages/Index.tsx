import { useState } from 'react';
import Icon from '@/components/ui/icon';

const commands = [
  { cmd: '/start', emoji: '🚀', desc: 'Запустить бота и поприветствовать' },
  { cmd: '/chat', emoji: '💬', desc: 'Начать диалог с нейросетью' },
  { cmd: '/image', emoji: '🎨', desc: 'Сгенерировать картинку по описанию' },
  { cmd: '/clear', emoji: '🧹', desc: 'Очистить историю переписки' },
  { cmd: '/help', emoji: '🆘', desc: 'Список всех доступных команд' },
  { cmd: '/mode', emoji: '🎭', desc: 'Сменить стиль ответов бота' },
];

const filters = [
  { emoji: '🛡️', title: 'Безопасные темы', desc: 'Блокируем токсичность, спам и запрещённый контент автоматически' },
  { emoji: '🎯', title: 'Контроль типа', desc: 'Текст, код, картинки — бот понимает формат и отвечает правильно' },
  { emoji: '⚡', title: 'Лимиты запросов', desc: 'Анти-флуд: бот не даст себя перегрузить и сэкономит ресурсы' },
];

const demoChat = [
  { from: 'user', text: 'Привет! Что ты умеешь? 😄' },
  { from: 'bot', text: 'Привет, космонавт! 🤖 Я отвечу на любой вопрос, напишу код и нарисую картинку. С чего начнём?' },
  { from: 'user', text: 'Объясни квантовую физику простыми словами' },
  { from: 'bot', text: 'Представь, что частица — это монетка, которая крутится в воздухе. Пока не поймал — она и орёл, и решка одновременно ✨' },
];

export default function Index() {
  const [input, setInput] = useState('');

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/30 blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-cyan-500/20 blur-[120px] animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-[0%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-pink-500/20 blur-[120px] animate-blob" style={{ animationDelay: '8s' }} />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-float">🤖</span>
          <span className="font-display font-extrabold text-xl tracking-tight">NEONO</span>
        </div>
        <a
          href="#"
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-105"
        >
          <Icon name="Send" size={16} />
          Открыть в Telegram
        </a>
      </header>

      <section className="relative z-10 px-6 md:px-12 pt-10 md:pt-16 pb-20 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-purple-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-blink" /> Бот онлайн 24/7
          </div>
          <h1 className="font-display font-black text-5xl md:text-7xl leading-[0.95] mb-6">
            Твой <span className="text-gradient">ГПТ-бот</span><br />в Телеграме 🚀
          </h1>
          <p className="text-lg text-white/60 mb-8 max-w-md">
            Общайся с нейросетью, генерируй идеи и картинки — прямо в чате. С умной фильтрацией запросов и заботой о тебе.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-bold rounded-full px-7 py-4 hover:scale-105 transition-transform glow">
              <span>💬</span> Начать общение
            </a>
            <a href="#commands" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-7 py-4 font-semibold hover:bg-white/10 transition-all">
              <Icon name="List" size={18} /> Все команды
            </a>
          </div>
        </div>

        <div className="relative animate-float">
          <div className="rounded-[2rem] bg-[#12101f]/80 backdrop-blur-xl border border-white/10 p-5 shadow-2xl glow">
            <div className="flex items-center gap-2 pb-4 border-b border-white/5 mb-4">
              <span className="text-xl">🤖</span>
              <div>
                <p className="font-semibold text-sm">NEONO Bot</p>
                <p className="text-xs text-green-400">печатает...</p>
              </div>
            </div>
            <div className="space-y-3">
              {demoChat.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.from === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md'
                      : 'bg-white/8 text-white/90 rounded-bl-md'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 bg-white/5 rounded-full px-4 py-2 border border-white/10">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Напиши сообщение..."
                className="bg-transparent flex-1 text-sm outline-none placeholder:text-white/30"
              />
              <button className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 flex items-center justify-center text-black hover:scale-110 transition-transform">
                <Icon name="ArrowUp" size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="commands" className="relative z-10 px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-cyan-300 mb-2">⌨️ КОМАНДЫ</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl">Чем управляем ботом</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {commands.map((c) => (
            <div key={c.cmd} className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:-translate-y-1 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl group-hover:scale-125 transition-transform">{c.emoji}</span>
                <code className="font-display font-bold text-lg text-gradient">{c.cmd}</code>
              </div>
              <p className="text-sm text-white/60">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-pink-300 mb-2">🛡️ ФИЛЬТРАЦИЯ ЗАПРОСОВ</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl">Умный контроль типов</h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto">Бот анализирует каждое сообщение и решает, как лучше ответить — безопасно и точно</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {filters.map((f, idx) => (
            <div key={f.title} className="relative bg-gradient-to-b from-white/8 to-white/[0.02] border border-white/10 rounded-3xl p-7 hover:border-purple-400/40 transition-all">
              <div className="text-4xl mb-4 animate-float" style={{ animationDelay: `${idx * 0.6}s` }}>{f.emoji}</div>
              <h3 className="font-display font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-20 max-w-4xl mx-auto text-center">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-purple-600/30 via-cyan-500/20 to-pink-500/30 border border-white/10 p-12 backdrop-blur-sm">
          <div className="text-5xl mb-4 animate-float">✨</div>
          <h2 className="font-display font-black text-4xl md:text-5xl mb-4">Готов к запуску?</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">Добавь NEONO в Телеграм и начни общаться с нейросетью прямо сейчас</p>
          <a href="#" className="inline-flex items-center gap-2 bg-white text-black font-bold rounded-full px-8 py-4 hover:scale-105 transition-transform">
            <Icon name="Send" size={18} /> Запустить бота
          </a>
        </div>
      </section>

      <footer className="relative z-10 px-6 md:px-12 py-10 text-center text-white/30 text-sm border-t border-white/5">
        <span className="font-display font-bold text-white/50">🤖 NEONO</span> · ГПТ-бот в Телеграме · 2026
      </footer>
    </div>
  );
}
