import json
from datetime import date
from pathlib import Path

obj = json.loads(Path('/home/ubuntu/upload/metricas.json').read_text())
daily = obj['diario']
keys = sorted(daily)
latest = date.fromisoformat(keys[-1])

def summarize(label, selected):
    print('\n', label, selected[0], selected[-1], len(selected))
    for field in ['f','fab','fcc','fcn','c','cn']:
        print(field, sum(int(daily[k].get(field, 0)) for k in selected))
    cats = [sum(int((daily[k].get('cat') or [0]*8)[i]) for k in selected) for i in range(8)]
    print('cat_sum', sum(cats), cats)

summarize('all', keys)
for label, start in [('last_12_calendar_months','2025-09-01'), ('2025_calendar','2025-01-01'), ('2026_to_file','2026-01-01')]:
    selected = [k for k in keys if k >= start and k <= keys[-1]]
    summarize(label, selected)
print('\nmeta', obj['meta']['janela_inicio'], obj['meta']['janela_fim'], 'gerado', obj['meta']['gerado_em'])
print('open_30d', obj.get('abertos_mais_30d', {}).get('total'))
print('monthly_last')
for month in sorted(obj.get('mensal_dim', {}))[-14:]:
    sec = obj['mensal_dim'][month].get('sec', {})
    print(month, 'sec_reg', sum(sec.get('reg', [])), 'sec_ab', sum(sec.get('ab', [])), 'sec_cc', sum(sec.get('cc', [])), 'dias_nonzero', sum(1 for value in sec.get('dias', []) if value))
