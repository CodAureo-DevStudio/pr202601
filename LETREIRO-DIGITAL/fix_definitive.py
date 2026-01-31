#!/usr/bin/env python
# -*- coding: utf-8 -*-

with open(r'c:\Users\adna\Documents\PROJETOS\LETREIRO-DIGITAL\main.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# From line 1650 (0-indexed: 1649) to end of duplicates (around 1700), replace with correct code
# Find where self.drag_data["x"] starts
end_idx = 1649
for i in range(1649, min(1800, len(lines))):
    if 'self.drag_data["x"] = event.x' in lines[i]:
        end_idx = i
        break

# Replace lines 1649 through end_idx-1 with correct indented code
new_lines = [
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
    '              \r\n',
]

lines[1649:end_idx] = new_lines

with open(r'c:\Users\adna\Documents\PROJETOS\LETREIRO-DIGITAL\main.py', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f'Arquivo corrigido! Substituídas linhas 1649 a {end_idx}')
