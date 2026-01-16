import React, { useState } from 'react';
import axios from 'axios';
import FormGenerator from './components/FormGenerator';
import DynamicForm from './components/DynamicForm';
import FormSubmission from './components/FormSubmission';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [prompt, setPrompt] = useState('');
  const [formSpec, setFormSpec] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateForm = async () => {
    if (!prompt.trim()) {
      setError('Please enter a form description');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSubmittedData(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/generate-form`, {
        prompt: prompt.trim()
      });
      setFormSpec(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate form. Please try again.');
      console.error('Error generating form:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/submit-form`, {
        formData,
        formSpec
      });
      setSubmittedData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit form. Please try again.');
      console.error('Error submitting form:', err);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setFormSpec(null);
    setSubmittedData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            ✨ AI Form Generator
          </h1>
          <p className="text-xl text-gray-600">
            Describe the form you need in plain English, and watch it appear instantly!
          </p>
        </header>

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Form Generator Section */}
        {!formSpec && (
          <FormGenerator
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerateForm}
            isGenerating={isGenerating}
          />
        )}

        {/* Generated Form Section */}
        {formSpec && !submittedData && (
          <div className="max-w-3xl mx-auto">
            <DynamicForm
              formSpec={formSpec}
              onSubmit={handleFormSubmit}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Submission Result Section */}
        {submittedData && (
          <div className="max-w-4xl mx-auto">
            <FormSubmission
              submittedData={submittedData}
              formSpec={formSpec}
              onReset={handleReset}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600">
        <p>AI Form Generator | Built with React.js & Node.js</p>
        <p className="text-sm mt-2">Simply describe, generate, and collect!</p>
      </footer>
    </div>
  );
}

export default App;
