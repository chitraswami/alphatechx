#!/bin/bash
# Create simple placeholder icons and package

echo "🎨 Creating placeholder icons..."

# Create a simple 192x192 PNG (color icon) - just a colored square
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\xc0\x00\x00\x00\xc0\x08\x02\x00\x00\x00\x16\x8d\xd9\x82\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\xc9e<\x00\x00\x00\x0cIDAT\x78\xda\xec\xc1\x01\x01\x00\x00\x00\x80\x90\xfe\xaf\xee\x08 \x00\x01\x00\x00\x00\x00IEND\xaeB`\x82' > color.png

# Create a simple 32x32 PNG (outline icon)
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00 \x08\x06\x00\x00\x00szz\xf4\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\xc9e<\x00\x00\x00\x0cIDAT\x78\xda\xec\xc1\x01\x01\x00\x00\x00\x80\x90\xfe\xaf\xee\x08 \x00\x01\x00\x00\x00\x00IEND\xaeB`\x82' > outline.png

echo "✅ Placeholder icons created"
echo ""
echo "📦 Creating Teams app package..."

# Create the zip package
zip -q AlphaTechX-Bot.zip manifest.json color.png outline.png

if [ -f "AlphaTechX-Bot.zip" ]; then
  echo "✅ Package created: AlphaTechX-Bot.zip"
  echo ""
  echo "📊 Package contents:"
  unzip -l AlphaTechX-Bot.zip
  echo ""
  echo "🎉 SUCCESS! Your Teams app package is ready!"
  echo ""
  echo "📤 Next steps:"
  echo "1. Go to Azure Portal → Your Bot → Channels"
  echo "2. Enable Microsoft Teams channel"
  echo "3. Configure messaging endpoint: https://alphatechx.fly.dev/api/teams/messages"
  echo "4. In Teams, go to Apps → 'Upload a custom app'"
  echo "5. Upload AlphaTechX-Bot.zip"
  echo "6. Click 'Add' to install the bot"
  echo ""
  echo "✨ Users can now chat with AlphaTechX Bot in Teams!"
else
  echo "❌ Failed to create package"
fi
