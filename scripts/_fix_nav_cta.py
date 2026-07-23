# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(r"C:\Users\adrie\auros\lib\nav-hub.ts")
t = p.read_text(encoding="utf-8")

# AR: primary Energy Lab Arabic-ish, secondary create dossier
reps = [
    (
        'primaryCta: "Energy Lab",\n  secondaryCta: "تجربة Shield",',
        'primaryCta: "Energy Lab",\n  secondaryCta: "إنشاء ملفي",',
    ),
    (
        'primaryCta: "Open Energy Lab",\n  secondaryCta: "试用 Shield",',
        'primaryCta: "打开 Energy Lab",\n  secondaryCta: "创建档案",',
    ),
]
for a, b in reps:
    if a in t:
        t = t.replace(a, b, 1)
        print("ok")
    else:
        print("miss")
p.write_text(t, encoding="utf-8")
