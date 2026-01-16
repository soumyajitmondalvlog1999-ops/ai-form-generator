const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Form field schema for validation
const FORM_FIELD_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    fields: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          label: { type: "string" },
          field_type: { 
            type: "string", 
            enum: ["text", "email", "number", "tel", "textarea", "select", "multiselect", "date", "checkbox"] 
          },
          required: { type: "boolean" },
          placeholder: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          validation: { type: "string" },
          meta_tags: { type: "array", items: { type: "string" } }
        },
        required: ["name", "label", "field_type"]
      }
    }
  },
  required: ["title", "fields"]
};

// Sample form templates for fallback
const SAMPLE_FORM_TEMPLATES = {
  doctor_conference: {
    title: "Doctors' Conference Registration",
    description: "Register for the Annual Medical Conference",
    fields: [
      { 
        name: "name", 
        label: "Full Name", 
        field_type: "text", 
        required: true, 
        placeholder: "Enter your full name",
        meta_tags: ["name", "full name", "identity"]
      },
      { 
        name: "medical_license", 
        label: "Medical License Number", 
        field_type: "text", 
        required: true, 
        placeholder: "Enter your medical license number",
        meta_tags: ["license", "medical license", "credential", "verification"]
      },
      { 
        name: "specialization", 
        label: "Specialization", 
        field_type: "select", 
        required: true, 
        options: ["Cardiology", "Neurology", "Pediatrics", "Surgery", "Internal Medicine", "Other"],
        meta_tags: ["specialization", "medical field", "expertise"]
      },
      { 
        name: "dietary_restrictions", 
        label: "Dietary Restrictions", 
        field_type: "multiselect", 
        required: false, 
        options: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut Allergy", "None"],
        meta_tags: ["dietary", "restrictions", "food", "preferences"]
      },
      { 
        name: "email", 
        label: "Email Address", 
        field_type: "email", 
        required: true, 
        placeholder: "Enter your email",
        meta_tags: ["email", "contact", "communication"]
      }
    ]
  },
  fintech_conference: {
    title: "Fintech Conference Registration",
    description: "Register for the Fintech Innovation Summit",
    fields: [
      { 
        name: "name", 
        label: "Full Name", 
        field_type: "text", 
        required: true, 
        placeholder: "Enter your full name",
        meta_tags: ["name", "full name", "identity"]
      },
      { 
        name: "mobile", 
        label: "Mobile Number", 
        field_type: "tel", 
        required: true, 
        placeholder: "Enter your mobile number",
        meta_tags: ["mobile", "phone", "contact", "telephone"]
      },
      { 
        name: "email", 
        label: "Email Address", 
        field_type: "email", 
        required: true, 
        placeholder: "Enter your email",
        meta_tags: ["email", "contact", "communication"]
      },
      { 
        name: "business_pain_points", 
        label: "Business Pain Points", 
        field_type: "textarea", 
        required: false, 
        placeholder: "Describe your current business challenges...",
        meta_tags: ["business", "pain points", "challenges", "problems", "issues"]
      }
    ]
  }
};

// Extract form requirements using OpenAI
async function extractFormRequirements(prompt) {
  const promptLower = prompt.toLowerCase();
  
  // Check for known templates first
  if (promptLower.includes("doctor") || promptLower.includes("medical") || promptLower.includes("license")) {
    return SAMPLE_FORM_TEMPLATES.doctor_conference;
  }
  
  if (promptLower.includes("fintech") || promptLower.includes("business pain")) {
    return SAMPLE_FORM_TEMPLATES.fintech_conference;
  }
  
  // Use OpenAI if API key is available
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a form generation assistant. Extract form requirements from the user's prompt and return ONLY valid JSON (no markdown, no code blocks).
            
            Format: {
              "title": "Form Title",
              "description": "Form description",
              "fields": [
                {
                  "name": "field_name_snake_case",
                  "label": "Field Label",
                  "field_type": "text|email|number|tel|textarea|select|multiselect|date|checkbox",
                  "required": true/false,
                  "placeholder": "optional placeholder",
                  "options": ["option1", "option2"], // only for select/multiselect
                  "meta_tags": ["keyword1", "keyword2"] // relevant keywords for this field
                }
              ]
            }
            
            Important:
            - Return ONLY JSON, no markdown formatting
            - Use snake_case for field names
            - Include relevant meta_tags for each field based on the prompt
            - Make field_type appropriate for the context`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });
      
      const content = response.choices[0].message.content.trim();
      
      // Remove markdown code blocks if present
      let jsonStr = content;
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n?/g, '');
      }
      
      const formSpec = JSON.parse(jsonStr);
      
      // Ensure meta_tags exist for all fields
      formSpec.fields = formSpec.fields.map(field => ({
        ...field,
        meta_tags: field.meta_tags || [field.name, field.label.toLowerCase()]
      }));
      
      return formSpec;
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Fallback to simple form generation
      return generateSimpleForm(prompt);
    }
  }
  
  // Fallback: Generate simple form based on keywords
  return generateSimpleForm(prompt);
}

// Generate simple form based on keywords
function generateSimpleForm(prompt) {
  const fields = [];
  const promptLower = prompt.toLowerCase();
  
  // Always add name field
  fields.push({
    name: "name",
    label: "Full Name",
    field_type: "text",
    required: true,
    placeholder: "Enter your full name",
    meta_tags: ["name", "full name", "identity"]
  });
  
  // Add email if mentioned
  if (promptLower.includes("email") || promptLower.includes("contact")) {
    fields.push({
      name: "email",
      label: "Email Address",
      field_type: "email",
      required: true,
      placeholder: "Enter your email address",
      meta_tags: ["email", "contact", "communication"]
    });
  }
  
  // Add phone/mobile if mentioned
  if (promptLower.includes("phone") || promptLower.includes("mobile") || promptLower.includes("number")) {
    fields.push({
      name: "phone",
      label: "Phone Number",
      field_type: "tel",
      required: promptLower.includes("mobile number"),
      placeholder: "Enter your phone number",
      meta_tags: ["phone", "mobile", "contact", "telephone"]
    });
  }
  
  // Extract title from prompt
  const words = prompt.split(' ').slice(0, 5);
  const title = words.join(' ') + " Registration Form";
  
  return {
    title: title,
    description: `Form generated from: "${prompt}"`,
    fields: fields
  };
}

// Map form submission data to keywords/meta-tags
function mapFormDataToKeywords(formData, formSpec) {
  const mappedData = {
    form_title: formSpec.title,
    submitted_at: new Date().toISOString(),
    fields: []
  };
  
  formSpec.fields.forEach(field => {
    const fieldValue = formData[field.name];
    if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
      mappedData.fields.push({
        field_name: field.name,
        field_label: field.label,
        field_type: field.field_type,
        value: fieldValue,
        meta_tags: field.meta_tags || [field.name, field.label.toLowerCase()],
        keywords: field.meta_tags || [field.name, field.label.toLowerCase()]
      });
    }
  });
  
  return mappedData;
}

// Routes
app.post('/api/generate-form', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const formSpec = await extractFormRequirements(prompt);
    res.json(formSpec);
  } catch (error) {
    console.error('Error generating form:', error);
    res.status(500).json({ error: 'Failed to generate form', details: error.message });
  }
});

app.post('/api/submit-form', (req, res) => {
  try {
    const { formData, formSpec } = req.body;
    
    if (!formData || !formSpec) {
      return res.status(400).json({ error: 'Form data and form spec are required' });
    }
    
    const mappedData = mapFormDataToKeywords(formData, formSpec);
    res.json(mappedData);
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Failed to submit form', details: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Form Generator API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/generate-form`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  Warning: OPENAI_API_KEY not set. Using fallback form generation.');
  }
});
