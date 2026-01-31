#!/usr/bin/env python
# -*- coding: utf-8 -*-

with open(r'c:\Users\adna\Documents\PROJETOS\LETREIRO-DIGITAL\main.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix line 1649 (0-indexed: 1649) - ensure correct indentation (26 spaces before real_y)
lines[1649] = '                          real_y = int((coords[1] - 10) / self.scale_factor + self.preview_offset_y)\r\n'
lines[1650] = '                          \r\n'
lines[1651] = '                          if target_tag == "clock":\r\n'
lines[1652] = '                               w = self.app.clock_width\r\n'
lines[1653] = '                               h = self.app.clock_height\r\n'
lines[1654] = '                               final_x, final_y = self.app.apply_snapping(real_x, real_y, w, h, "clock")\r\n'
lines[1655] = '                               self.app.clock_x = final_x\r\n'
lines[1656] = '                               self.app.clock_y = final_y\r\n'
lines[1657] = '                               self.app.clock_win.geometry(f"+{int(final_x)}+{int(final_y)}")\r\n'

with open(r'c:\Users\adna\Documents\PROJETOS\LETREIRO-DIGITAL\main.py', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Indentação corrigida definitivamente!')
