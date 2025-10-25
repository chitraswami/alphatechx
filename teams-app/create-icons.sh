#!/bin/bash

# Script to create placeholder icons for Teams app
# You should replace these with your actual brand icons

echo "Creating placeholder icons for AlphaTechX Teams App..."

# Create color icon (192x192) - indigo background with white "A"
convert -size 192x192 xc:"#4F46E5" \
  -gravity center \
  -pointsize 120 \
  -fill white \
  -font Arial-Bold \
  -annotate +0+0 "A" \
  color.png 2>/dev/null

# Create outline icon (32x32) - white outline on transparent
convert -size 32x32 xc:none \
  -gravity center \
  -pointsize 24 \
  -fill white \
  -stroke white \
  -strokewidth 2 \
  -font Arial-Bold \
  -annotate +0+0 "A" \
  outline.png 2>/dev/null

if [ -f "color.png" ] && [ -f "outline.png" ]; then
  echo "✅ Icons created successfully!"
  echo ""
  echo "📦 Creating Teams app package..."
  zip -r AlphaTechX-Bot.zip manifest.json color.png outline.png
  echo ""
  echo "✅ Package created: AlphaTechX-Bot.zip"
  echo ""
  echo "🚀 Next steps:"
  echo "1. Share AlphaTechX-Bot.zip with your users"
  echo "2. Users upload it to Teams: Apps → Upload a custom app"
  echo "3. Users click 'Add' to install the bot"
  echo "4. Done! They can now chat with AlphaTechX Bot in Teams"
else
  echo "⚠️  ImageMagick not installed. Creating manual package..."
  echo ""
  echo "📝 Please create icons manually:"
  echo "  - color.png: 192x192px with your logo"
  echo "  - outline.png: 32x32px white outline on transparent"
  echo ""
  echo "Then run: zip -r AlphaTechX-Bot.zip manifest.json color.png outline.png"
fi

