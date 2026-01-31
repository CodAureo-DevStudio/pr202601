#!/usr/bin/env python
# -*- coding: utf-8 -*-

with open(r'c:\Users\adna\Documents\PROJETOS\LETREIRO-DIGITAL\main.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the entire problematic section
# Looking for the section starting with "# Calculate Real Coords" and ending before "self.drag_data["x"]"

old_section = '''                          # Calculate Real Coords
                          real_x = int((coords[0] - 10) / self.scale_factor + self.preview_offset_x)'''

new_section = '''                          # Calculate Real Coords
                          real_x = int((coords[0] - 10) / self.scale_factor + self.preview_offset_x)
                          real_y = int((coords[1] - 10) / self.scale_factor + self.preview_offset_y)
                          
                          if target_tag == "clock":
                               w = self.app.clock_width
                               h = self.app.clock_height
                               final_x, final_y = self.app.apply_snapping(real_x, real_y, w, h, "clock")
                               self.app.clock_x = final_x
                               self.app.clock_y = final_y
                               self.app.clock_win.geometry(f"+{int(final_x)}+{int(final_y)}")
                               
                          elif target_tag == "banner":
                               w = self.app.monitor_width
                               h = self.app.bar_height
                               final_x, final_y = self.app.apply_snapping(real_x, real_y, w, h, "banner")
                               self.app.banner_x = final_x
                               self.app.banner_y = final_y
                               self.app.root.geometry(f"+{int(final_x)}+{int(final_y)}")
                               
                          elif target_tag == "schedule":
                               w = self.app.schedule_width
                               h = self.app.schedule_win.winfo_height()
                               final_x, final_y = self.app.apply_snapping(real_x, real_y, w, h, "schedule")
                               self.app.schedule_x = final_x
                               self.app.schedule_y = final_y
                               self.app.schedule_win.geometry(f"+{int(final_x)}+{int(final_y)}")'''

# Parse to find start position
start_pos = content.find(old_section)
if start_pos != -1:
    # Find end (next occurrence of self.drag_data["x"])
    search_from = start_pos + len(old_section)
    end_marker = '         self.drag_data["x"] = event.x'
    end_pos = content.find(end_marker, search_from)
    
    if end_pos != -1:
        # Replace section
        new_content = content[:start_pos] + new_section + '\r\n              \r\n' + content[end_pos:]
        
        with open(r'c:\Users\adna\Documents\PROJETOS\LETREIRO-DIGITAL\main.py', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f'Seção substituída! Posições {start_pos} a {end_pos}')
    else:
        print('Marcador de fim não encontrado!')
else:
    print('Marcador de início não encontrado!')
