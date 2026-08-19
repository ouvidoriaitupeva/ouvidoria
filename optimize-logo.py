from PIL import Image
from pathlib import Path

source = Path('/home/ubuntu/webdev-static-assets/itupeva-prefeitura-logo.png')
target = Path('/home/ubuntu/falabr-facil/client/public/itupeva-prefeitura-logo.png')
image = Image.open(source).convert('RGBA')
image.thumbnail((900, 500), Image.Resampling.LANCZOS)
image.save(target, format='PNG', optimize=True)
print(target, target.stat().st_size)
