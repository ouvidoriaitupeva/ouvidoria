import json
from pathlib import Path

path = Path('/home/ubuntu/upload/metricas.json')
data = json.loads(path.read_text())
print('top_keys', list(data.keys()))
print('meta_keys', list(data.get('meta', {}).keys()))
daily = data.get('diario', {})
print('days', len(daily), 'first', next(iter(daily), None), 'last', next(reversed(daily), None))
for key in ['f', 'fab', 'fcc', 'fcn', 'c', 'cd', 'cn']:
    values = [row.get(key, 0) for row in daily.values()]
    print(key, 'sum', sum(values), 'last', values[-1] if values else None, 'max', max(values) if values else None)
print('categories', data.get('meta', {}).get('categorias'))
print('category_totals', [sum((row.get('cat') or [0]*8)[i] for row in daily.values()) for i in range(8)])
print('secretarias_count', len(data.get('meta', {}).get('secretarias', [])))
print('assuntos_count', len(data.get('meta', {}).get('assuntos', [])))
for month, dims in list(data.get('mensal_dim', {}).items())[:1]:
    print('mensal_sample', month, {key: (value[:3] if isinstance(value, list) else value) for key, value in dims.items()})
for key in ['mensal_dim', 'abertos_mais_30d']:
    block = data.get(key)
    print(key, type(block).__name__, 'len', len(block) if hasattr(block, '__len__') else None)
    if isinstance(block, dict):
        print(key, 'keys', list(block.keys())[:20])
        for subkey, value in list(block.items())[:3]:
            print(key, subkey, type(value).__name__, value if not isinstance(value, (dict, list)) else (list(value.keys())[:10] if isinstance(value, dict) else value[:3]))
    elif isinstance(block, list):
        print(key, 'sample', block[:3])
