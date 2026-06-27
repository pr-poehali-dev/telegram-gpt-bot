import json
import os
import urllib.request
import urllib.parse
import uuid


GIGACHAT_OAUTH_URL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth'
GIGACHAT_API_URL = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions'

BLOCKED_KEYWORDS = ['наркотик', 'оружие', 'взлом', 'суицид', 'насилие']

COMMANDS = {
    '/start': '👋 Привет, космонавт! Я NEONO — твой ГПТ-бот 🤖\n\nПросто напиши мне любой вопрос, и я отвечу. Список команд: /help',
    '/help': '⌨️ Команды бота:\n\n🚀 /start — приветствие\n💬 /chat — начать диалог\n🧹 /clear — очистить историю\n🆘 /help — этот список\n🎭 /mode — стиль ответов\n\nИли просто напиши сообщение!',
    '/chat': '💬 Я готов общаться! Задавай вопрос ✨',
    '/clear': '🧹 История переписки очищена!',
    '/mode': '🎭 Сейчас я отвечаю в обычном дружелюбном стиле.',
}


def get_gigachat_token() -> str:
    auth_key = os.environ.get('GIGACHAT_AUTH_KEY', '')
    data = urllib.parse.urlencode({'scope': 'GIGACHAT_API_PERS'}).encode()
    req = urllib.request.Request(GIGACHAT_OAUTH_URL, data=data, method='POST')
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    req.add_header('Accept', 'application/json')
    req.add_header('RqUID', str(uuid.uuid4()))
    req.add_header('Authorization', f'Basic {auth_key}')
    import ssl
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
        return json.loads(resp.read().decode())['access_token']


def ask_gigachat(text: str) -> str:
    token = get_gigachat_token()
    payload = json.dumps({
        'model': 'GigaChat',
        'messages': [
            {'role': 'system', 'content': 'Ты дружелюбный ассистент NEONO. Отвечай кратко, понятно, с уместными эмодзи.'},
            {'role': 'user', 'content': text},
        ],
        'temperature': 0.7,
    }).encode()
    req = urllib.request.Request(GIGACHAT_API_URL, data=payload, method='POST')
    req.add_header('Content-Type', 'application/json')
    req.add_header('Authorization', f'Bearer {token}')
    import ssl
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
        result = json.loads(resp.read().decode())
        return result['choices'][0]['message']['content']


def send_message(chat_id: int, text: str) -> None:
    token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    data = json.dumps({'chat_id': chat_id, 'text': text}).encode()
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    try:
        urllib.request.urlopen(req, timeout=15)
    except Exception:
        pass


def is_blocked(text: str) -> bool:
    low = text.lower()
    return any(word in low for word in BLOCKED_KEYWORDS)


def handler(event: dict, context) -> dict:
    '''Вебхук Telegram-бота: принимает сообщения, фильтрует запросы и отвечает через GigaChat'''
    method = event.get('httpMethod', 'POST')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': '',
        }

    if method == 'GET':
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'status': 'ok', 'bot': 'NEONO'}),
        }

    body_raw = event.get('body', '') or '{}'
    try:
        update = json.loads(body_raw)
    except Exception:
        update = {}

    message = update.get('message') or {}
    chat = message.get('chat') or {}
    chat_id = chat.get('id')
    text = (message.get('text') or '').strip()

    if not chat_id or not text:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': True}),
        }

    cmd = text.split()[0].lower()
    if cmd in COMMANDS:
        send_message(chat_id, COMMANDS[cmd])
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': True}),
        }

    if is_blocked(text):
        send_message(chat_id, '🛡️ Извини, я не могу отвечать на такие запросы. Давай поговорим о чём-то другом ✨')
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': True}),
        }

    try:
        answer = ask_gigachat(text)
    except Exception:
        answer = '⚠️ Упс, что-то пошло не так с нейросетью. Попробуй ещё раз через минутку 🚀'

    send_message(chat_id, answer)

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True}),
    }
