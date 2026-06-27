import json
import os
import tempfile
import urllib.request

import yt_dlp

TG_API = 'https://api.telegram.org/bot'

COMMANDS = {
    '/start': (
        '👋 Привет! Я SAVEIT — бот для скачивания видео 📥\n\n'
        'Поддерживаю:\n'
        '▶️ YouTube\n'
        '🎵 TikTok\n'
        '📸 Instagram / Reels\n\n'
        'Просто пришли мне ссылку на видео!'
    ),
    '/help': (
        '📖 Как пользоваться:\n\n'
        '1️⃣ Скопируй ссылку на видео\n'
        '2️⃣ Отправь её мне в чат\n'
        '3️⃣ Выбери качество из кнопок\n'
        '4️⃣ Получи видео прямо в Telegram!\n\n'
        '⚠️ Ограничение Telegram: файлы до 50 МБ'
    ),
}

USER_STATE = {}


def tg(method: str, payload: dict) -> dict:
    token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    url = f'{TG_API}{token}/{method}'
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read().decode())
    except Exception:
        return {}


def send(chat_id: int, text: str, reply_markup: dict = None) -> None:
    payload = {'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'}
    if reply_markup:
        payload['reply_markup'] = reply_markup
    tg('sendMessage', payload)


def answer_callback(callback_id: str) -> None:
    tg('answerCallbackQuery', {'callback_query_id': callback_id})


def get_formats(url: str) -> list:
    ydl_opts = {'quiet': True, 'no_warnings': True, 'noplaylist': True}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
    formats = info.get('formats', [])
    seen = {}
    for f in formats:
        h = f.get('height')
        if not h:
            continue
        label = f'{h}p'
        if label not in seen:
            seen[label] = f['format_id']
    ordered = []
    for q in ['2160p', '1440p', '1080p', '720p', '480p', '360p']:
        if q in seen:
            ordered.append({'label': q, 'format_id': seen[q]})
    return ordered


def download_and_send(chat_id: int, url: str, format_id: str, label: str) -> None:
    send(chat_id, f'⏳ Скачиваю {label}... Подожди немного!')
    with tempfile.TemporaryDirectory() as tmpdir:
        out_tmpl = os.path.join(tmpdir, 'video.%(ext)s')
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'noplaylist': True,
            'format': f'{format_id}+bestaudio[ext=m4a]/bestvideo[height<={label[:-1]}]+bestaudio/best[height<={label[:-1]}]',
            'merge_output_format': 'mp4',
            'outtmpl': out_tmpl,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        out_path = os.path.join(tmpdir, 'video.mp4')
        if not os.path.exists(out_path):
            candidates = [f for f in os.listdir(tmpdir) if f.startswith('video.')]
            if candidates:
                out_path = os.path.join(tmpdir, candidates[0])
            else:
                send(chat_id, '❌ Не удалось скачать. Попробуй другое качество или ссылку.')
                return

        size_mb = os.path.getsize(out_path) / 1024 / 1024
        if size_mb > 49:
            send(chat_id, f'⚠️ Файл слишком большой ({size_mb:.0f} МБ). Выбери качество пониже — Telegram разрешает до 50 МБ.')
            return

        token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
        send_url = f'{TG_API}{token}/sendVideo'
        boundary = 'saveit_boundary_xyz'
        with open(out_path, 'rb') as f:
            file_data = f.read()
        body = (
            f'--{boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n{chat_id}\r\n'
            f'--{boundary}\r\nContent-Disposition: form-data; name="video"; filename="video.mp4"\r\nContent-Type: video/mp4\r\n\r\n'
        ).encode() + file_data + f'\r\n--{boundary}--\r\n'.encode()
        req = urllib.request.Request(send_url, data=body, method='POST')
        req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
        try:
            urllib.request.urlopen(req, timeout=120)
            send(chat_id, f'✅ Готово! {label} · {size_mb:.1f} МБ 🎉')
        except Exception:
            send(chat_id, '❌ Ошибка при отправке файла. Попробуй ещё раз.')


def handle_url(chat_id: int, url: str) -> None:
    send(chat_id, '🔍 Получаю информацию о видео...')
    try:
        formats = get_formats(url)
    except Exception:
        send(chat_id, '❌ Не могу открыть ссылку. Проверь, что видео публичное.')
        return

    if not formats:
        send(chat_id, '❌ Не нашёл форматы. Поддерживаются: YouTube, TikTok, Instagram.')
        return

    USER_STATE[chat_id] = {'url': url}
    buttons = [[{'text': f['label'], 'callback_data': f'dl:{chat_id}:{f["format_id"]}:{f["label"]}'}] for f in formats]
    send(chat_id, '🎛️ Выбери качество видео:', reply_markup={'inline_keyboard': buttons})


def is_url(text: str) -> bool:
    return text.startswith('http://') or text.startswith('https://')


def handler(event: dict, context) -> dict:
    '''Telegram-бот SAVEIT: скачивает видео с YouTube, TikTok, Instagram в выбранном качестве'''
    method = event.get('httpMethod', 'POST')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type'}, 'body': ''}

    if method == 'GET':
        return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'status': 'ok', 'bot': 'SAVEIT'})}

    try:
        update = json.loads(event.get('body', '') or '{}')
    except Exception:
        update = {}

    if 'callback_query' in update:
        cq = update['callback_query']
        answer_callback(cq.get('id', ''))
        data = cq.get('data', '')
        if data.startswith('dl:'):
            parts = data.split(':', 3)
            if len(parts) == 4:
                _, chat_id_str, fmt_id, label = parts
                chat_id = int(chat_id_str)
                state = USER_STATE.get(chat_id, {})
                url = state.get('url', '')
                if url:
                    download_and_send(chat_id, url, fmt_id, label)
                else:
                    send(chat_id, '❌ Сессия истекла. Пришли ссылку заново.')
        return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True})}

    message = update.get('message') or {}
    chat_id = (message.get('chat') or {}).get('id')
    text = (message.get('text') or '').strip()

    if chat_id and text:
        cmd = text.split()[0].lower()
        if cmd in COMMANDS:
            send(chat_id, COMMANDS[cmd])
        elif is_url(text):
            handle_url(chat_id, text)
        else:
            send(chat_id, '🔗 Пришли мне ссылку на видео с YouTube, TikTok или Instagram!')

    return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True})}
