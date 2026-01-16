# ✨ AI Form Generator

An AI-powered form generator that creates functional forms from natural language prompts. Simply describe what you need, and the form appears instantly!

## 🎯 Features

- **Natural Language Processing**: Describe forms in plain English
- **AI-Powered Generation**: Uses OpenAI GPT to understand and generate form schemas
- **Dynamic Form Rendering**: Automatically renders forms based on generated schemas
- **Smart Field Mapping**: Automatically maps form inputs with keywords and meta-tags
- **Multiple Field Types**: Supports text, email, number, tel, textarea, select, multiselect, date, and checkbox
- **Beautiful UI**: Built with React.js and Tailwind CSS
- **JSON Export**: Download form submissions as structured JSON data

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key (optional, but recommended for best results)

### Installation

1. **Clone or download the project**

2. **Install dependencies**

   ```bash
   # Install root dependencies (server)
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ```

   > **Note**: If you don't have an OpenAI API key, the app will use fallback form generation based on keyword matching. However, AI-powered generation provides much better results.

4. **Run the application**

   ```bash
   # Run both server and client concurrently
   npm run dev
   ```

   Or run them separately:

   ```bash
   # Terminal 1: Start the server
   npm run server

   # Terminal 2: Start the client
   npm run client
   ```

5. **Open your browser**

   Navigate to `http://localhost:3000` to see the application.

## 📖 Usage

1. **Enter a prompt**: Type what form you need in the input box
   - Example: "I need a registration form for a doctors' conference with Name, Medical License Number, and Dietary Restrictions"
   - Example: "I need a registration form for a Fintech conference with Name, Mobile number, and their business pain points"

2. **Generate the form**: Click "Generate Form" and wait for the AI to create your form

3. **Fill out the form**: Complete the dynamically generated form

4. **Submit**: Submit the form to see the data mapped with keywords and meta-tags

5. **Export**: Download the submission as JSON with all metadata

## 🏗️ Project Structure

```
ai-form-generator/
├── server/
│   └── index.js          # Express server with OpenAI integration
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormGenerator.js    # Prompt input component
│   │   │   ├── DynamicForm.js      # Dynamic form renderer
│   │   │   └── FormSubmission.js   # Submission results display
│   │   ├── App.js                  # Main app component
│   │   └── index.js                # React entry point
│   └── package.json
├── package.json           # Root package.json with scripts
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🔧 API Endpoints

### `POST /api/generate-form`

Generates a form schema from a natural language prompt.

**Request:**
```json
{
  "prompt": "I need a registration form for a doctors' conference with Name, Medical License Number, and Dietary Restrictions"
}
```

**Response:**
```json
{
  "title": "Doctors' Conference Registration",
  "description": "Register for the Annual Medical Conference",
  "fields": [
    {
      "name": "name",
      "label": "Full Name",
      "field_type": "text",
      "required": true,
      "placeholder": "Enter your full name",
      "meta_tags": ["name", "full name", "identity"]
    },
    ...
  ]
}
```

### `POST /api/submit-form`

Submits form data and returns mapped data with keywords/meta-tags.

**Request:**
```json
{
  "formData": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "formSpec": { ... }
}
```

**Response:**
```json
{
  "form_title": "Form Title",
  "submitted_at": "2024-01-16T13:37:00.000Z",
  "fields": [
    {
      "field_name": "name",
      "field_label": "Full Name",
      "field_type": "text",
      "value": "John Doe",
      "meta_tags": ["name", "full name", "identity"],
      "keywords": ["name", "full name", "identity"]
    },
    ...
  ]
}
```

## 🎨 Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express
- **AI**: OpenAI GPT-3.5-turbo
- **HTTP Client**: Axios

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Keep your OpenAI API key secure
- The `.env` file is already in `.gitignore`

## 🐛 Troubleshooting

### Server won't start
- Make sure port 5000 is not in use, or change the PORT in `.env`
- Check that all dependencies are installed: `npm install`

### Client won't start
- Make sure you're in the `client` directory when running `npm install`
- Check that port 3000 is available

### Forms not generating
- If using OpenAI: Check that your API key is set correctly in `.env`
- The app will fall back to keyword-based generation if OpenAI is unavailable
- Check the server console for error messages

### CORS errors
- Make sure the server is running on port 5000
- Check that the `proxy` setting in `client/package.json` points to the correct server URL

## 📝 Example Prompts

Try these prompts to see the AI in action:

1. "I need a registration form for a doctors' conference with Name, Medical License Number, and Dietary Restrictions"
2. "I need a registration form for a Fintech conference with Name, Mobile number, and their business pain points"
3. "Create a contact form with name, email, and message"
4. "Make a job application form with name, email, phone, and resume upload"
5. "Generate an event registration form with name, email, and ticket type"

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify as needed!

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

**Built with ❤️ using React.js, Node.js, and OpenAI**
