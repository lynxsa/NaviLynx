# NaviGenie AI Setup

## Getting Started with AI Chat

NaviGenie uses Google's Gemini AI for intelligent conversations. To enable AI chat:

### 1. Get a Gemini API Key
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new project (if needed)
4. Generate an API key

### 2. Configure the API Key
1. Open the `.env` file in the project root
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Restart the Development Server
```bash
npx expo start --clear
```

## Features

### AI-Powered Chat
- Natural language understanding
- Context-aware responses
- South African venue knowledge
- Multi-turn conversations

### Fallback Responses
If AI is unavailable, NaviGenie provides intelligent fallback responses for:
- Coffee shop locations
- Parking assistance
- Restroom directions
- Current deals and offers
- Food recommendations
- ATM locations
- General navigation help

### Quick Actions
Use the quick action chips for instant help:
- Scan & Shop
- Find Coffee
- Hot Deals
- Find Parking
- Restrooms
- ATM
- Food Court

## Troubleshooting

### API Key Issues
- Ensure your API key is valid and has proper permissions
- Check that the key is correctly set in the `.env` file
- Restart the app after changing environment variables

### Fallback Mode
If you see "I'm experiencing technical difficulties", the app is using fallback responses. This happens when:
- No API key is configured
- API quota is exceeded
- Network connectivity issues

## Security Note
Never commit your actual API key to version control. The `.env` file should be added to `.gitignore`.
