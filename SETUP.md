# Quick Setup Guide

## Step 1: Install Dependencies

```bash
# Install root dependencies (server)
npm install

# Install client dependencies
cd client
npm install
cd ..
```

## Step 2: Configure Environment

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

   > **Note**: You can get an API key from https://platform.openai.com/api-keys
   > 
   > If you don't have an API key, the app will still work using fallback keyword-based form generation, but AI-powered generation provides much better results.

## Step 3: Run the Application

```bash
# Run both server and client
npm run dev
```

This will start:
- Server on http://localhost:5000
- Client on http://localhost:3000

## Step 4: Use the Application

1. Open http://localhost:3000 in your browser
2. Type a form description like: "I need a registration form for a doctors' conference with Name, Medical License Number, and Dietary Restrictions"
3. Click "Generate Form"
4. Fill out the form
5. Submit and see the mapped data with keywords/meta-tags

## Troubleshooting

- **Port already in use**: Change PORT in `.env` file
- **Module not found**: Run `npm install` in both root and client directories
- **CORS errors**: Make sure server is running on port 5000
