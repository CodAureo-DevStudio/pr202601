#!/usr/bin/env python
# -*- coding: utf-8 -*-

with open(r'c:\Users\adna\Documents\PROJETOS\LETREIRO-DIGITAL\main.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Replace lines 1649-1674 with properly indented + clean newlines
new_block = [
    '                          real_y = int((coords[1] - 10) / self.scale_factor + self.preview_offset_y)\r\n',
    '                          \r\n',
    '                          if target_tag == "clock":\r\n',
    '                               w = self.app.clock_width\r\n',
    '                               h = self.app.clock_height\r\n',
    '                               final_x, final_y = self.app.apply_snapping(real_x, real_y, w, h, "clock")\r\n',
    '                               self.app.clock_x = final_x\r\n',
    '                               self.app.clock_y = final_y\r\n',
    '                               self.app.clock_win.geometry(f"+{int(final_x)}+{int(final_y)}")\r\n',
    '                               \r\n',
    '                          elif target_tag == "banner":\r\n',
    '                               w = self.app.monitor_width\r\n',
    '                               h = self.app.bar_height\r\n',
    '                               final_x, final_y = self.app.apply_snapping(real_x, real_y, w, h, "banner")\r\n',
    '                               self.app.banner_x = final_x\r\n',
    '                               self.app.banner_y = final_y\r\n',
    '                               self.app.root.geometry(f"+{int(final_x)}+{int(final_y)}")\r\n',
    '                               \r\n',
    '                          elif target_tag == "schedule":\r\n',
    '                               w = self.app.schedule_width\r\n',
    '                               h = self.app.schedule_win.winfo_height()\r\n',
    '                               final_x, final_y = self.app.apply_snapping(real_x, real_y, w, h, "schedule")\r\n',
    '                               self.app.schedule_x = final_x\r\n',
    '                               self.app.schedule_y = final_y\r\n',
    '                               self.app.schedule_win.geometry(f"+{int(final_x)}+{int(final_y)}")\r\n',
]

# Replace (0-indexed 1649-1674 = lines 1650-1675)
lines[1649:1675] = new_block

with open(r'c:\Users\adna\Documents\PROJETOS\LETREIRO-DIGITAL\main.py', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Bloco corrigido - indentação e newlines fixados!')
