#!/usr/bin/env python
# -*- coding: utf-8 -*-

with open(r'c:\Users\adna\Documents\PROJETOS\LETREIRO-DIGITAL\main.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Delete problematic lines 1650-1690 and recreate properly
# First, find the exact line with "real_y = int((coords[1] - 10)"
start_line = None
for i in range(1645, 1660):
    if 'real_y = int((coords[1] - 10)' in lines[i]:
        start_line = i
        break

if start_line:
    # Find end (where self.drag_data starts)
    end_line = start_line + 1
    for i in range(start_line + 1, start_line + 50):
        if i < len(lines) and 'self.drag_data["x"]' in lines[i]:
            end_line = i
            break
    
    # Replace with clean code
    new_code = [
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
    
    lines[start_line:end_line] = new_code
    
    with open(r'c:\Users\adna\Documents\PROJETOS\LETREIRO-DIGITAL\main.py', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print(f'Arquivo corrigido! Linhas {start_line} a {end_line} substituídas.')
else:
    print('Linha inicial não encontrada!')
