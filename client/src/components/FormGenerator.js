import React from 'react';

const FormGenerator = ({ prompt, setPrompt, onGenerate, isGenerating }) => {
  const examplePrompts = [
    "I need a registration form for a doctors' conference with Name, Medical License Number, and Dietary Restrictions",
    "I need a registration form for a Fintech conference with Name, Mobile number, and their business pain points",
    "Create a contact form with name, email, and message",
    "Make a job application form with name, email, phone, and resume upload",
    "Generate an event registration form with name, email, and ticket type"
  ];

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Main Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6 form-container">
        <label htmlFor="prompt-input" className="block text-lg font-semibold text-gray-700 mb-4">
          Describe the form you need:
        </label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., 'I need a registration form for a doctors' conference with Name, Medical License Number, and Dietary Restrictions'"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="4"
          disabled={isGenerating}
        />
        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating your form...
            </span>
          ) : (
            'Generate Form'
          )}
        </button>
      </div>

      {/* Examples Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">💡 Try these examples:</h3>
        <div className="space-y-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors duration-200 text-sm text-gray-700"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl mb-2">🤖</div>
          <h4 className="font-semibold text-gray-700">AI-Powered</h4>
          <p className="text-sm text-gray-600">Natural language processing</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <h4 className="font-semibold text-gray-700">Instant</h4>
          <p className="text-sm text-gray-600">Generate forms in seconds</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl mb-2">🎯</div>
          <h4 className="font-semibold text-gray-700">Smart Mapping</h4>
          <p className="text-sm text-gray-600">Auto-tagging & metadata</p>
        </div>
      </div>
    </div>
  );
};

export default FormGenerator;
