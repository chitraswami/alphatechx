#!/usr/bin/env python3
"""
Create placeholder icons for AlphaTechX Teams App
Requires: pip install Pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_color_icon():
    """Create 192x192 color icon with indigo background and white 'A'"""
    size = 192
    img = Image.new('RGB', (size, size), color='#4F46E5')
    draw = ImageDraw.Draw(img)
    
    # Try to use a nice font, fall back to default if not available
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 120)
    except:
        try:
            font = ImageFont.truetype("Arial.ttf", 120)
        except:
            font = ImageFont.load_default()
    
    # Draw 'A' in center
    text = "A"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((size - text_width) // 2, (size - text_height) // 2 - 10)
    
    draw.text(position, text, fill='white', font=font)
    img.save('color.png')
    print("✅ Created color.png (192x192)")

def create_outline_icon():
    """Create 32x32 outline icon with transparent background and white 'A'"""
    size = 32
    img = Image.new('RGBA', (size, size), color=(0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Try to use a nice font, fall back to default if not available
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
    except:
        try:
            font = ImageFont.truetype("Arial.ttf", 24)
        except:
            font = ImageFont.load_default()
    
    # Draw 'A' in center
    text = "A"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((size - text_width) // 2, (size - text_height) // 2 - 2)
    
    draw.text(position, text, fill='white', font=font)
    img.save('outline.png')
    print("✅ Created outline.png (32x32)")

def create_package():
    """Create the Teams app package zip file"""
    import zipfile
    
    files = ['manifest.json', 'color.png', 'outline.png']
    
    # Check if all files exist
    missing = [f for f in files if not os.path.exists(f)]
    if missing:
        print(f"❌ Missing files: {', '.join(missing)}")
        return False
    
    # Create zip package
    with zipfile.ZipFile('AlphaTechX-Bot.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in files:
            zipf.write(file)
    
    print("✅ Created AlphaTechX-Bot.zip")
    return True

if __name__ == '__main__':
    print("🎨 Creating AlphaTechX Teams App icons...")
    print()
    
    try:
        create_color_icon()
        create_outline_icon()
        print()
        print("📦 Creating Teams app package...")
        if create_package():
            print()
            print("🎉 Success! Package ready for distribution")
            print()
            print("📤 How to distribute:")
            print("1. Share AlphaTechX-Bot.zip with your users")
            print("2. Users go to Teams → Apps → 'Upload a custom app'")
            print("3. Users select AlphaTechX-Bot.zip")
            print("4. Users click 'Add' to install")
            print()
            print("✅ Users can now chat with AlphaTechX Bot in Teams!")
    except ImportError:
        print("❌ Error: Pillow library not installed")
        print()
        print("Please install it:")
        print("  pip install Pillow")
        print()
        print("Or create icons manually:")
        print("  - color.png: 192x192px")
        print("  - outline.png: 32x32px")
        print("Then run: python3 -c 'import zipfile; zipfile.ZipFile(\"AlphaTechX-Bot.zip\", \"w\").write(\"manifest.json\"); zipfile.ZipFile(\"AlphaTechX-Bot.zip\", \"a\").write(\"color.png\"); zipfile.ZipFile(\"AlphaTechX-Bot.zip\", \"a\").write(\"outline.png\")'")
    except Exception as e:
        print(f"❌ Error: {e}")

