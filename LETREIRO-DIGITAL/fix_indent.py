#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Script para corrigir indentação do main.py"""

# Read file
with open(r'c:\Users\adna\Documents\PROJETOS\LETREIRO-DIGITAL\main.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and fix clock section
for i in range(1650, 1670):
    if 'if target_tag == "clock":' in lines[i]:
        # Rebuild this section cleanly
        new_section = [
            '                          if target_tag == "clock":\r\n',
            '                               w = self.app.clock_width\r\n',
            '                               h = self.app.clock_height\r\n',
            '                               final_x, final_y = self.app.apply_snapping(real_x, real_y, w, h, "clock")\r\n',
            '                               self.app.clock_x = final_x\r\n',
            '                               self.app.clock_y = final_y\r\n',
            '                               self.app.clock_win.geometry(f"+{int(final_x)}+{int(final_y)}")\r\n',
            '                               \r\n',
        ]
        # Find end (next elif or end of block)
        j = i + 1
        while j < len(lines) and 'elif target_tag' not in lines[j]:
            j += 1
        lines[i:j] = new_section
        break

# Find and fix schedule section
for i in range(1660, 1690):
    if 'elif target_tag == "schedule":' in lines[i]:
        new_section = [
            '                          elif target_tag == "schedule":\r\n',
            '                               w = self.app.schedule_width\r\n',
            '                               h = self.app.schedule_win.winfo_height()\r\n',
            '                               final_x, final_y = self.app.apply_snapping(real_x, real_y, w, h, "schedule")\r\n',
            '                               self.app.schedule_x = final_x\r\n',
            '                               self.app.schedule_y = final_y\r\n',
            '                               self.app.schedule_win.geometry(f"+{int(final_x)}+{int(final_y)}")\r\n',
        ]
        # Find end
        j = i + 1
        while j < len(lines) and lines[j].strip() and 'self.drag_data' not in lines[j] and lines[j].strip() != '':
            j += 1
        lines[i:j] = new_section
        break

# Write back
with open(r'c:\Users\adna\Documents\PROJETOS\LETREIRO-DIGITAL\main.py', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Arquivo corrigido com sucesso!')
