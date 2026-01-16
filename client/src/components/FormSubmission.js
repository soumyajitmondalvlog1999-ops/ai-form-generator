import React, { useState } from 'react';

const FormSubmission = ({ submittedData, formSpec, onReset }) => {
  const [activeTab, setActiveTab] = useState('mapped');

  const downloadJSON = () => {
    const dataStr = JSON.stringify(submittedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'form_submission.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 form-container">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">✅ Form Submitted Successfully!</h2>
          <button
            onClick={onReset}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            ← Create New Form
          </button>
        </div>
        <p className="text-gray-600">Your form data has been processed and mapped with keywords/meta-tags.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('mapped')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mapped'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📋 Mapped Data
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'raw'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔍 Raw JSON
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'metadata'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🏷️ Keywords & Meta-tags
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'mapped' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">Form Title:</h3>
              <p className="text-blue-800">{submittedData.form_title}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submittedData.fields.map((field, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{field.field_label}</h4>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {field.field_type}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {Array.isArray(field.value) ? field.value.join(', ') : String(field.value)}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Keywords/Meta-tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {field.meta_tags?.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'raw' && (
          <div>
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-800">
                {JSON.stringify(submittedData, null, 2)}
              </code>
            </pre>
          </div>
        )}

        {activeTab === 'metadata' && (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Field Metadata Summary</h3>
              <div className="space-y-3">
                {submittedData.fields.map((field, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{field.field_label}</span>
                      <span className="text-xs text-gray-500">({field.field_name})</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.meta_tags?.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={downloadJSON}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          📥 Download as JSON
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Create Another Form
        </button>
      </div>
    </div>
  );
};

export default FormSubmission;
