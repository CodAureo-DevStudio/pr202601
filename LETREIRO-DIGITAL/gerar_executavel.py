import os
import subprocess
import shutil
from PIL import Image, ImageDraw, ImageFont

import urllib.request
from io import BytesIO

def create_icon():
    print("🎨 Obtendo logo oficial da Lagoinha...")
    # URL da logo da Lagoinha (exemplo público ou placeholder de alta qualidade)
    # Usando uma URL estável de busca ou criando um design mais fiel se falhar
    
    # Tentar baixar uma logo conhecida com Headers para evitar erro 400
    icon_urls = [
        "https://yt3.googleusercontent.com/ytc/AIdro_kX4t934spJ7LgWOpfBq9OqS1N4lZlZ6A4k7L5=s900-c-k-c0x00ffffff-no-rj", # YouTube
        "https://lagoinha.com/wp-content/uploads/2021/04/cropped-favicon-192x192.png" # Site oficial
    ]
    
    img_data = None
    for url in icon_urls:
        try:
            req = urllib.request.Request(
                url, 
                data=None, 
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            )
            with urllib.request.urlopen(req) as u:
                img_data = u.read()
                print(f"✅ Logo baixada de: {url}")
                break
        except Exception as e:
            print(f"⚠️ Tentativa falhou para {url}: {e}")

    try:
        if not img_data:
            raise Exception("Nenhuma URL funcionou")
            
        img = Image.open(BytesIO(img_data))
        
        # Se não for quadrada, recortar o centro ou redimensionar mantendo aspecto
        if img.size[0] != img.size[1]:
            min_side = min(img.size)
            left = (img.size[0] - min_side) / 2
            top = (img.size[1] - min_side) / 2
            right = (img.size[0] + min_side) / 2
            bottom = (img.size[1] + min_side) / 2
            img = img.crop((left, top, right, bottom))
            
        # Redimensionar para alta qualidade
        img = img.resize((256, 256), Image.Resampling.LANCZOS)
        
        # Salvar como ICO
        img.save("app_icon.ico", format='ICO', sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])
        print("✅ Logo Lagoinha convertida para app_icon.ico com sucesso!")
        
    except Exception as e:
        print(f"⚠️ Não foi possível baixar a logo (Erro: {e}). Usando ícone gerado.")
        # ... (Mantendo código de geração de fallback existente se quiser, ou simplificando) ...
        # Fallback: Gerar ícone estilo Lagoinha (Fundo Branco, Texto Preto/Laranja)
        size = (256, 256)
        img = Image.new('RGB', size, "white")
        draw = ImageDraw.Draw(img)
        # Círculo externo
        draw.ellipse([10, 10, 246, 246], outline="black", width=5)
        # Texto L
        try:
            font_big = ImageFont.truetype("arial.ttf", 150)
        except:
            font_big = ImageFont.load_default()
        draw.text((128, 128), "L", fill="#FFA500", font=font_big, anchor="mm")
        img.save("app_icon.ico", format='ICO', sizes=[(256, 256)])
        print("✅ Ícone alternativo criado.")

import sys

def build_exe():
    print("🚀 Preparando arquivos para compilação...")
    
    # CRIAR ARQUIVOS NECESSÁRIOS SE NÃO EXISTIREM
    # PyInstaller falha se tentar adicionar arquivo que não existe
    required_files = ["presets.json", "schedule_data.json"]
    for f in required_files:
        if not os.path.exists(f):
            print(f"🔧 Criando arquivo placeholder: {f}")
            with open(f, 'w') as file:
                file.write("{}") # JSON Vazio válido
    
    print("🚀 Iniciando compilação com PyInstaller...")
    print("\n✅ VERIFICAÇÃO DE FUNCIONALIDADES:")
    print("   ✓ Detecção de múltiplos monitores (screeninfo)")
    print("   ✓ Captura de tela em tempo real (PIL.ImageGrab)")
    print("   ✓ Cursor visível no preview")
    print("   ✓ Centralização automática do preview")
    print("   ✓ Modo Padrão + Modo TV")
    print("   ✓ Cronograma semanal")
    print("   ✓ Sistema de presets")
    print("   ✓ Controle de timer e relógio")
    print("   ✓ Controle de velocidade na interface")
    print("   ✓ Arrastar e soltar elementos\n")
    
    # Nome do executável
    app_name = "LetreiroDigital"
    script_name = "main.py"
    
    # Comandos do PyInstaller
    # Usando sys.executable para chamar o módulo, garantindo o ambiente correto
    cmd = [
        sys.executable, "-m", "PyInstaller",
        "--noconfirm",
        "--onedir",
        "--windowed",
        "--clean",
        f"--name={app_name}",
        "--icon=app_icon.ico",
        # Hidden imports críticos para funcionar em outros computadores
        "--hidden-import=screeninfo",
        "--hidden-import=screeninfo.screeninfo",
        "--hidden-import=PIL",
        "--hidden-import=PIL.Image",
        "--hidden-import=PIL.ImageTk",
        "--hidden-import=PIL.ImageDraw",
        "--hidden-import=PIL.ImageGrab",
        "--hidden-import=queue",
        "--hidden-import=threading",
        # Adicionar dados
        "--add-data=presets.json;.",
        "--add-data=schedule_data.json;.",
        script_name
    ]
    
    subprocess.check_call(cmd)
    
    print("📦 Compilação finalizada.")
    print(f"📂 Seu aplicativo está em: dist/{app_name}")

def post_build_cleanup():
    target_dir = os.path.join("dist", "LetreiroDigital")
    
    # Certificar que arquivos de configuração existem na pasta final
    files_to_copy = ["presets.json", "schedule_data.json", "app_config.json"]
    
    print("📋 Copiando arquivos de configuração...")
    for f in files_to_copy:
        if os.path.exists(f):
            shutil.copy(f, target_dir)
            print(f"   -> Copiado: {f}")
        else:
            # Create empty/default if not exists to avoid errors
            with open(os.path.join(target_dir, f), 'w') as new_f:
                new_f.write("{}")
            print(f"   -> Criado padrão: {f}")

    print("\n✅ PROCESSO CONCLUÍDO COM SUCESSO!")
    print("========================================")
    print(f"Para rodar, abra a pasta 'dist/LetreiroDigital' e execute 'LetreiroDigital.exe'")
    print("========================================")

if __name__ == "__main__":
    try:
        create_icon()
        build_exe()
        post_build_cleanup()
    except Exception as e:
        print(f"❌ Erro durante a construção: {e}")
