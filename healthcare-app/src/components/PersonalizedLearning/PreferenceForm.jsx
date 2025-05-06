'use client';

import { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowLeft, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const PreferenceForm = ({ initialPreferences = {}, onSubmit }) => {
  // Form steps state
  const [currentStep, setCurrentStep] = useState(1);
  const [formCompleted, setFormCompleted] = useState(false);
  const [tip, setTip] = useState('');
  const [badge, setBadge] = useState('');

  // Expanded form data with more personalization options
  const [formData, setFormData] = useState({
    ageRange: initialPreferences.ageRange || '',
    gender: initialPreferences.gender || '',
    healthGoals: initialPreferences.healthGoals || [],
    interests: initialPreferences.interests || [],
    conditions: initialPreferences.conditions || '',
    learningStyle: initialPreferences.learningStyle || '',
    timeCommitment: initialPreferences.timeCommitment || '',
    dietaryPreferences: initialPreferences.dietaryPreferences || [],
    activityLevel: initialPreferences.activityLevel || '',
  });

  // Define options for different form fields
  const categories = [
    'Nutrition', 'Fitness', 'Mental Health', 'Heart Health', 'Diabetes',
    'Sleep', 'Preventive Care', 'Women\'s Health', 'Men\'s Health', 'Pediatrics'
  ];

  const ageRanges = [
    'Under 18', '18-30', '31-45', '46-60', 'Over 60'
  ];

  const genderOptions = [
    'Male', 'Female', 'Non-binary', 'Prefer not to say'
  ];

  const goals = [
    'Improve General Wellness', 'Lose Weight', 'Gain Muscle', 'Manage Stress',
    'Improve Sleep', 'Manage a Specific Condition', 'Learn About Prevention'
  ];

  const learningStyles = [
    'Visual (videos, infographics)', 
    'Reading (articles, guides)', 
    'Interactive (quizzes, tools)'
  ];

  const timeCommitments = [
    '5-10 minutes daily', 
    '15-30 minutes daily', 
    'A few times a week', 
    'Weekends only'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-free', 'Keto', 'Paleo', 
    'Mediterranean', 'No specific diet', 'Dairy-free'
  ];

  const activityLevels = [
    'Sedentary (little to no exercise)',
    'Lightly active (light exercise/sports 1-3 days/week)',
    'Moderately active (moderate exercise/sports 3-5 days/week)',
    'Very active (hard exercise/sports 6-7 days/week)',
    'Extra active (very hard daily exercise/physical job)'
  ];

  // Handle form change with real-time personalization
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const newValues = checked
        ? [...formData[name], value]
        : formData[name].filter(item => item !== value);
      
      setFormData(prev => ({ ...prev, [name]: newValues }));
      
      // Generate personalized tip based on selection
      if (checked) {
        generateTipForSelection(name, value);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      generateTipForSelection(name, value);
    }
  };

  // Function to generate personalized tips
  const generateTipForSelection = (fieldName, value) => {
    const tips = {
      healthGoals: {
        'Lose Weight': 'Did you know? Small, sustainable changes to your diet are often more effective for long-term weight loss than crash diets.',
        'Manage Stress': 'Quick tip: Deep breathing for just 5 minutes daily can significantly reduce stress hormones in your body.',
        'Improve Sleep': 'Sleep fact: Keeping your bedroom between 60-67°F (15-19°C) can help promote better sleep.',
        'Manage a Specific Condition': 'Health insight: Regular monitoring of your symptoms can help you and your healthcare provider better manage your condition.',
      },
      interests: {
        'Nutrition': 'Nutrition fact: Adding colorful fruits and vegetables to your meals provides a wider range of nutrients and antioxidants.',
        'Fitness': 'Fitness tip: Short, intense workouts can be as effective as longer, moderate-intensity sessions.',
        'Mental Health': 'Mindfulness moment: Taking short breaks throughout your day to check in with yourself can improve mental well-being.',
        'Diabetes': 'Diabetes insight: Consistent meal timing can help maintain stable blood sugar levels throughout the day.',
      },
      gender: {
        'Male': 'Health note: Men are less likely to visit doctors regularly. Regular check-ups are essential for preventive care.',
        'Female': 'Women\'s health: Monthly self-breast exams are recommended for early detection of any changes.',
      },
      learningStyle: {
        'Visual (videos, infographics)': 'We\'ll prioritize video content and visual guides in your learning materials.',
        'Reading (articles, guides)': 'We\'ll recommend our best articles and in-depth guides for your health journey.',
        'Interactive (quizzes, tools)': 'You\'ll love our interactive health quizzes and self-assessment tools!',
      }
    };

    if (tips[fieldName] && tips[fieldName][value]) {
      setTip(tips[fieldName][value]);
      
      // Clear tip after 6 seconds
      setTimeout(() => {
        setTip('');
      }, 6000);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Show completion badge
    setBadge('Profile Complete! Personalizing your experience...');
    setFormCompleted(true);
    
    // Submit after showing the completion message
    setTimeout(() => {
      onSubmit(formData);
    }, 2000);
  };

  // Move to next step if current step is valid
  const nextStep = () => {
    // Basic validation for each step
    if (currentStep === 1) {
      if (!formData.ageRange || !formData.gender) {
        alert('Please complete all required fields before continuing.');
        return;
      }
    } else if (currentStep === 2) {
      if (formData.healthGoals.length === 0) {
        alert('Please select at least one health goal.');
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
    
    // Show step completion badge
    setBadge(`Step ${currentStep} completed!`);
    setTimeout(() => {
      setBadge('');
    }, 2000);
  };

  // Move to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Tell Us About Yourself</h2>
            <p className="text-gray-600">We'll use this to customize your health journey.</p>
            
            {/* Age Range */}
            <div>
              <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-1">
                Age Range <span className="text-red-500">*</span>
              </label>
              <select
                id="ageRange"
                name="ageRange"
                value={formData.ageRange}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select your age range</option>
                {ageRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
            
            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select your gender</option>
                {genderOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Your Health Goals</h2>
            <p className="text-gray-600">Select all that apply to your current health journey.</p>
            
            {/* Health Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are your main health goals? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {goals.map(goal => (
                  <div key={goal} className="flex items-center">
                    <input
                      id={`goal-${goal.replace(/\s+/g, '-')}`}
                      name="healthGoals"
                      type="checkbox"
                      value={goal}
                      checked={formData.healthGoals.includes(goal)}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`goal-${goal.replace(/\s+/g, '-')}`} className="ml-2 block text-sm text-gray-900">
                      {goal}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Activity Level */}
            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Your Activity Level
              </label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select your activity level</option>
                {activityLevels.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Your Health Interests</h2>
            <p className="text-gray-600">Help us understand what topics interest you most.</p>
            
            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which topics interest you? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`interest-${category.replace(/\s+/g, '-')}`}
                      name="interests"
                      type="checkbox"
                      value={category}
                      checked={formData.interests.includes(category)}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`interest-${category.replace(/\s+/g, '-')}`} className="ml-2 block text-sm text-gray-900">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Existing Conditions (Optional) */}
            <div>
              <label htmlFor="conditions" className="block text-sm font-medium text-gray-700 mb-1">
                Any specific health conditions? (Optional)
              </label>
              <textarea
                id="conditions"
                name="conditions"
                rows="2"
                value={formData.conditions}
                onChange={handleChange}
                placeholder="e.g., Asthma, Hypertension, Arthritis"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            {/* Dietary Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Preferences (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {dietaryOptions.map(option => (
                  <div key={option} className="flex items-center">
                    <input
                      id={`diet-${option.replace(/\s+/g, '-')}`}
                      name="dietaryPreferences"
                      type="checkbox"
                      value={option}
                      checked={formData.dietaryPreferences.includes(option)}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`diet-${option.replace(/\s+/g, '-')}`} className="ml-2 block text-sm text-gray-900">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Learning Preferences</h2>
            <p className="text-gray-600">Let us know how you prefer to learn about health topics.</p>
            
            {/* Learning Style */}
            <div>
              <label htmlFor="learningStyle" className="block text-sm font-medium text-gray-700 mb-1">
                How do you prefer to learn? <span className="text-red-500">*</span>
              </label>
              <select
                id="learningStyle"
                name="learningStyle"
                value={formData.learningStyle}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select your preferred learning style</option>
                {learningStyles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            
            {/* Time Commitment */}
            <div>
              <label htmlFor="timeCommitment" className="block text-sm font-medium text-gray-700 mb-1">
                How much time can you dedicate to health learning?
              </label>
              <select
                id="timeCommitment"
                name="timeCommitment"
                value={formData.timeCommitment}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select your time commitment</option>
                {timeCommitments.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600">You're almost done! Submit your preferences to get your personalized learning experience.</p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Progress indicator
  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between w-full mb-2">
          {[1, 2, 3, 4].map(step => (
            <div 
              key={step} 
              className={`flex items-center justify-center rounded-full w-8 h-8 ${
                step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step < currentStep ? <FaCheckCircle /> : step}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${(currentStep - 1) * 33.33}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Real-time personalization tip */}
      {tip && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md shadow-sm animate-fadeIn">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-blue-500 pt-0.5">
              <FaInfoCircle />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">{tip}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Completion badge */}
      {badge && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-center animate-pulse">
          <p className="text-green-700 font-medium flex items-center justify-center">
            <FaCheckCircle className="mr-2" /> {badge}
          </p>
        </div>
      )}
    
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        {/* Progress bar */}
        {renderProgressBar()}
        
        {/* Step content */}
        {renderStepContent()}
        
        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next <FaArrowRight className="ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              disabled={formCompleted}
            >
              {formCompleted ? 'Processing...' : 'Submit & Get Started'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PreferenceForm; 