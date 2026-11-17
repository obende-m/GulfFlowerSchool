import sys
from PIL import Image
name, step = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 1800
im = Image.open(f'qa/shots/{name}.png'); y = i = 0
while y < im.height:
    im.crop((0, y, im.width, min(im.height, y + step))).convert('RGB').save(f'qa/shots/_{name}-{i}.jpg', quality=78); y += step; i += 1
print(name, i, 'parts')
