import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Mock responses for demonstration purposes
const mockResponses = {
  'headache': 'Headaches can be caused by various factors, including stress, dehydration, lack of sleep, or eye strain. For occasional headaches, rest, hydration, and over-the-counter pain relievers might help. If you experience severe, frequent, or unusual headaches, please consult with a healthcare professional.',
  'covid': 'COVID-19 symptoms may include fever, cough, fatigue, loss of taste or smell, sore throat, and body aches. If you suspect you have COVID-19, consider getting tested and follow local health guidelines for isolation. Please consult with a healthcare professional for personalized advice.',
  'diabetes': 'Diabetes is a chronic condition that affects how your body turns food into energy. Common symptoms include increased thirst, frequent urination, unexplained weight loss, and fatigue. If you\'re concerned about diabetes, please consult with a healthcare professional for proper diagnosis and treatment.',
  'exercise': 'Regular physical activity is beneficial for overall health. For adults, the WHO recommends at least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity exercise per week, along with muscle-strengthening activities. Always start gradually and consult with a healthcare professional before beginning a new exercise regimen.',
  'nutrition': 'A balanced diet typically includes fruits, vegetables, whole grains, lean proteins, and healthy fats. It\'s recommended to limit processed foods, added sugars, and excessive salt. Individual nutritional needs vary, so consider consulting with a healthcare professional or dietitian for personalized advice.',
  'sleep': 'Adults generally need 7-9 hours of quality sleep per night. Good sleep hygiene includes maintaining a consistent sleep schedule, creating a relaxing bedtime routine, and ensuring a comfortable sleep environment. If you consistently have trouble sleeping, consider consulting with a healthcare professional.',
  'stress': 'Stress management techniques include regular physical activity, relaxation practices (like deep breathing, meditation, or yoga), maintaining social connections, and ensuring adequate rest. If stress significantly impacts your daily life, consider seeking support from a mental health professional.',
  'blood pressure': 'Normal blood pressure is generally considered to be below 120/80 mmHg. High blood pressure (hypertension) often doesn\'t cause symptoms but can lead to serious health problems over time. Regular monitoring, a healthy lifestyle, and prescribed medications when necessary can help manage blood pressure.',
  'heart': 'Heart health can be promoted through regular physical activity, a balanced diet, not smoking, limiting alcohol, managing stress, and getting regular check-ups. If you experience chest pain, shortness of breath, or other concerning symptoms, seek immediate medical attention.',
  'vaccine': 'Vaccines help protect against serious infectious diseases by stimulating the immune system to recognize and fight specific pathogens. Following recommended vaccination schedules is important for individual and public health. Consult with a healthcare professional about which vaccines are appropriate for you based on age, health status, and other factors.',
  'mental health': 'Mental health is as important as physical health. Common mental health conditions include depression, anxiety, and stress-related disorders. Strategies for maintaining good mental health include regular exercise, adequate sleep, social connection, and stress management techniques. If you\'re experiencing persistent mental health concerns, consider speaking with a healthcare professional.',
  'pregnancy': 'Pregnancy typically lasts about 40 weeks, divided into three trimesters. Regular prenatal care is important for monitoring the health of both mother and baby. Common recommendations include taking prenatal vitamins, maintaining a healthy diet, staying physically active as appropriate, and avoiding alcohol, tobacco, and certain medications. Always consult with healthcare providers for personalized guidance during pregnancy.',
  'cancer': 'Cancer refers to diseases characterized by abnormal cell growth. Early detection through recommended screenings is important for many types of cancer. Risk factors can include genetics, lifestyle factors, and environmental exposures. Treatment approaches may include surgery, radiation therapy, chemotherapy, immunotherapy, or a combination of these. For specific concerns about cancer, please consult with a healthcare professional.',
  'allergy': 'Allergies occur when your immune system reacts to a foreign substance that doesn\'t cause a reaction in most people. Common allergens include certain foods, pollen, pet dander, and medications. Symptoms can range from mild (sneezing, itching) to severe (anaphylaxis). Management strategies include avoiding triggers, medications, and in some cases, immunotherapy. Consult with a healthcare professional for proper diagnosis and treatment of allergies.',
  'asthma': 'Asthma is a chronic condition affecting the airways in the lungs, causing symptoms like wheezing, shortness of breath, chest tightness, and coughing. Triggers can include allergens, exercise, cold air, and respiratory infections. Management typically involves avoiding triggers and using medications as prescribed. If you experience severe symptoms, seek immediate medical attention.'
};

// Function to call local Ollama model using a file-based approach with a shell script
async function callOllamaModel(message) {
  const execPromise = promisify(exec);
  const writeFilePromise = promisify(fs.writeFile);
  const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma:latest';
  const MAX_TIMEOUT = 60000; // 60 seconds timeout
  
  try {
    // Create a temporary directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Create unique filenames for this request
    const timestamp = Date.now();
    const inputFile = path.join(tempDir, `input_${timestamp}.txt`);
    
    // Write the message to the input file
    console.log('Writing message to file for Ollama...');
    await writeFilePromise(inputFile, message, 'utf8');
    
    // Make the shell script executable
    const scriptPath = path.join(process.cwd(), 'src', 'scripts', 'run-ollama.sh');
    await execPromise(`chmod +x "${scriptPath}"`);
    
    // Run the shell script with the input file
    console.log(`Running Ollama with model: ${OLLAMA_MODEL}`);
    const { stdout, stderr } = await execPromise(`"${scriptPath}" "${OLLAMA_MODEL}" "${inputFile}"`, { 
      timeout: MAX_TIMEOUT,
      maxBuffer: 2 * 1024 * 1024 // 2MB buffer
    });
    
    if (stderr) {
      console.error('Ollama stderr:', stderr);
    }
    
    // Clean up the temporary file
    try {
      fs.unlinkSync(inputFile);
    } catch (cleanupError) {
      console.error('Error cleaning up temporary file:', cleanupError);
    }
    
    if (stdout && stdout.trim()) {
      console.log(`Received response from Ollama (${stdout.length} chars)`);
      return stdout.trim();
    } else {
      throw new Error('No output received from Ollama');
    }
  } catch (error) {
    console.error('Error in Ollama execution:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const userMessage = body.message;
    const messageHistory = body.history || [];

    if (!userMessage) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log(`Received message for chatbot: ${userMessage}`);
    
    // Check if we have a mock response for this query
    const normalizedQuery = userMessage.toLowerCase().trim();
    const mockResponseKeys = Object.keys(mockResponses);
    const matchedKey = mockResponseKeys.find(key => normalizedQuery.includes(key.toLowerCase()));
    
    // Format conversation history for the Gemma model
    let formattedPrompt = '';
    
    // Add system instructions to guide the model's behavior
    formattedPrompt += `System: You are HealLearn's health information assistant powered by Gemma 3 (4B). Your purpose is to provide helpful, accurate, and educational information about health topics. Remember these guidelines:\n
    1. Provide educational information only, not medical advice\n
    2. Be clear about medical uncertainties when they exist\n
    3. Encourage consulting healthcare professionals for personal medical concerns\n
    4. Be respectful, empathetic, and professional\n
    5. If you don't know something, admit it rather than making up information\n
    6. Keep responses concise but informative\n\n`;
    
    // Add conversation history if available
    if (messageHistory.length > 0) {
      
      const historyToInclude = messageHistory.slice(0, -1);
      
      for (const msg of historyToInclude) {
        if (msg.role === 'user') {
          formattedPrompt += `User: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          formattedPrompt += `Assistant: ${msg.content}\n`;
        }
      }
    }
    
    // Add the current user message
    formattedPrompt += `User: ${userMessage}\n`;
    formattedPrompt += 'Assistant: ';
    
    // Check if we should use the mock response directly based on query complexity
    // For simple queries that match our mock data, we can skip the Ollama call entirely
    if (matchedKey && userMessage.length < 50 && !messageHistory.length) {
      console.log(`Using direct mock response for "${matchedKey}" query (simple query optimization)`);
      return NextResponse.json({ response: mockResponses[matchedKey] });
    }
    
    try {
      // Try to call the Ollama model with the formatted conversation
      const ollamaResponse = await callOllamaModel(formattedPrompt);
      console.log(`Ollama response: ${ollamaResponse}`);
      return NextResponse.json({ response: ollamaResponse });
    } catch (ollamaError) {
      console.error('Ollama model error:', ollamaError.message);
      
      // If we have a matching mock response, use it as fallback
      if (matchedKey) {
        console.log(`Using mock response for "${matchedKey}" query as fallback`);
        return NextResponse.json({ 
          response: mockResponses[matchedKey],
          fallback: true,
          error: ollamaError.message
        });
      }
      
      // If no specific mock response is available, provide a generic fallback
      const genericResponse = 'I apologize, but I\'m having trouble processing your request at the moment. ' +
        'Please try again later or rephrase your question. If you have a specific health topic in mind, ' +
        'you might try mentioning keywords like "diabetes", "nutrition", "exercise", or "sleep" in your question.';
      
      return NextResponse.json({
        response: genericResponse,
        fallback: true,
        error: ollamaError.message
      });
    }

  } catch (error) {
    console.error('Error in chatbot API:', error);
    
    // Check if we can extract a keyword from the user message for fallback
    const userMessage = error.userMessage || '';
    const normalizedQuery = userMessage.toLowerCase().trim();
    const possibleKeywords = Object.keys(mockResponses).filter(key => 
      normalizedQuery.includes(key.toLowerCase())
    );
    
    // If we found any matching keywords, use the first one as fallback
    if (possibleKeywords.length > 0) {
      const bestMatchKey = possibleKeywords[0];
      console.log(`Using fallback response for "${bestMatchKey}" after error`);
      return NextResponse.json({
        response: mockResponses[bestMatchKey],
        fallback: true,
        error: error.message || 'Failed to process chatbot request'
      });
    }
    
    // Provide a more informative error message with a helpful suggestion
    const errorMessage = error.message || 'Failed to process chatbot request due to an internal error';
    return NextResponse.json({
      error: errorMessage,
      response: 'I apologize, but I\'m having trouble processing your request at the moment. ' +
        'Please try again later or ask about a specific health topic like "diabetes", "nutrition", or "exercise".',
      fallback: true
    }, { status: 500 });
  }
}