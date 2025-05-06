'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { healthGuideContent } from './healthGuideContent';

const ComprehensiveHealthGuide = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const sectionRefs = useRef({});

  // Register section refs
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.innerWidth < 1024) {
      setShowTableOfContents(false);
    }
  };

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'general-health', title: 'General Health & Wellness' },
    { id: 'diseases-conditions', title: 'Diseases & Conditions' },
    { id: 'first-aid', title: 'First Aid & Emergencies' },
    { id: 'mental-health', title: 'Mental Health & Well-being' },
    { id: 'preventive-healthcare', title: 'Preventive Healthcare' },
    { id: 'conclusion', title: 'Conclusion' },
    { id: 'references', title: 'References' },
  ];

  const subsections = {
    'general-health': [
      { id: 'nutrition', title: 'Nutrition and Balanced Diet' },
      { id: 'exercise', title: 'Exercise and Active Lifestyle' },
      { id: 'sleep', title: 'Sleep Hygiene' },
    ],
    'diseases-conditions': [
      { id: 'common-illnesses', title: 'Common Illnesses' },
      { id: 'infectious-diseases', title: 'Infectious Diseases' },
      { id: 'chronic-conditions', title: 'Chronic Conditions' },
    ],
    'first-aid': [
      { id: 'cpr', title: 'CPR and Emergency Response' },
      { id: 'burns-wounds', title: 'Burns, Wounds, and Fractures' },
      { id: 'strokes-seizures', title: 'Strokes, Seizures, and Heart Attacks' },
    ],
    'mental-health': [
      { id: 'symptoms', title: 'Symptoms of Stress, Anxiety, and Depression' },
      { id: 'counseling', title: 'Mental Health Counseling' },
      { id: 'self-care', title: 'Self-Care Techniques' },
    ],
    'preventive-healthcare': [
      { id: 'vaccination', title: 'Vaccination Schedules' },
      { id: 'screenings', title: 'Health Screenings' },
      { id: 'hygiene', title: 'Hygiene Practices' },
    ],
  };

  // Render markdown content with formatted links
  const renderFormattedContent = (content) => {
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = content.split(linkPattern);
    
    if (parts.length === 1) {
      return content; // No links found
    }
    
    const result = [];
    for (let i = 0; i < parts.length; i += 3) {
      result.push(parts[i]);
      if (i + 2 < parts.length) {
        result.push(
          <a 
            key={i}
            href={parts[i + 2]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {parts[i + 1]}
          </a>
        );
      }
    }
    return result;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Mobile table of contents toggle */}
      <div className="block lg:hidden mb-4">
        <button
          onClick={() => setShowTableOfContents(!showTableOfContents)}
          className="flex items-center justify-between w-full p-4 bg-blue-600 text-white rounded-lg"
        >
          <span className="font-medium">Table of Contents</span>
          <svg
            className={`w-5 h-5 transition-transform ${showTableOfContents ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Table of Contents - Side Navigation */}
      <div
        className={`${
          showTableOfContents ? 'block' : 'hidden'
        } lg:block lg:sticky lg:top-24 lg:w-1/4 xl:w-1/5 self-start bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 shadow-md overflow-y-auto max-h-[calc(100vh-120px)]`}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Table of Contents</h2>
        <ul className="space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`text-left w-full py-2 px-3 rounded ${
                  activeSection === section.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {section.title}
              </button>

              {subsections[section.id] && activeSection === section.id && (
                <ul className="ml-4 mt-1 space-y-1 border-l-2 border-blue-200 dark:border-blue-800">
                  {subsections[section.id].map((subsection) => (
                    <li key={subsection.id}>
                      <button
                        onClick={() => scrollToSection(subsection.id)}
                        className="text-left w-full py-1 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300"
                      >
                        {subsection.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="lg:w-3/4 xl:w-4/5">
        <article className="prose prose-blue dark:prose-invert max-w-none lg:prose-lg">
          {/* Introduction */}
          <section 
            id="introduction" 
            ref={(el) => (sectionRefs.current.introduction = el)}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
              {healthGuideContent.introduction.title}
            </h2>
            
            <div className="space-y-4">
              {healthGuideContent.introduction.content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {renderFormattedContent(paragraph)}
                </p>
              ))}
            </div>
          </section>

          {/* General Health & Wellness */}
          <section 
            id="general-health" 
            ref={(el) => (sectionRefs.current['general-health'] = el)}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
              {healthGuideContent.generalHealth.title}
            </h2>

            {/* Nutrition */}
            <div 
              id="nutrition" 
              ref={(el) => (sectionRefs.current.nutrition = el)}
              className="mb-8"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                {healthGuideContent.generalHealth.subsections.nutrition.title}
              </h3>
              
              <div className="space-y-4">
                {healthGuideContent.generalHealth.subsections.nutrition.content.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {renderFormattedContent(paragraph)}
                  </p>
                ))}
              </div>

              {/* Macronutrients */}
              <div className="mt-6 mb-6">
                <h4 className="text-xl font-medium mb-3 text-gray-800 dark:text-white">
                  {healthGuideContent.generalHealth.subsections.nutrition.parts.macronutrients.title}
                </h4>
                <ul className="list-disc pl-6 space-y-2">
                  {healthGuideContent.generalHealth.subsections.nutrition.parts.macronutrients.items.map((item, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{item.title}:</span> {renderFormattedContent(item.content)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dietary Guidelines */}
              <div className="mt-6 mb-6">
                <h4 className="text-xl font-medium mb-3 text-gray-800 dark:text-white">
                  {healthGuideContent.generalHealth.subsections.nutrition.parts.dietaryGuidelines.title}
                </h4>
                <div className="space-y-4">
                  {healthGuideContent.generalHealth.subsections.nutrition.parts.dietaryGuidelines.content.map((paragraph, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {renderFormattedContent(paragraph)}
                    </p>
                  ))}
                </div>
                {healthGuideContent.generalHealth.subsections.nutrition.parts.dietaryGuidelines.items && (
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    {healthGuideContent.generalHealth.subsections.nutrition.parts.dietaryGuidelines.items.map((item, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">
                        {renderFormattedContent(item)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Exercise */}
            <div 
              id="exercise" 
              ref={(el) => (sectionRefs.current.exercise = el)}
              className="mb-8"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                {healthGuideContent.generalHealth.subsections.exercise.title}
              </h3>
              
              <div className="space-y-4">
                {healthGuideContent.generalHealth.subsections.exercise.content.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {renderFormattedContent(paragraph)}
                  </p>
                ))}
              </div>

              {/* Physical Benefits */}
              <div className="mt-6 mb-6">
                <h4 className="text-xl font-medium mb-3 text-gray-800 dark:text-white">
                  {healthGuideContent.generalHealth.subsections.exercise.parts.physicalBenefits.title}
                </h4>
                <ul className="list-disc pl-6 space-y-2">
                  {healthGuideContent.generalHealth.subsections.exercise.parts.physicalBenefits.items.map((item, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{item.title}:</span> {renderFormattedContent(item.content)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mental Benefits */}
              <div className="mt-6 mb-6">
                <h4 className="text-xl font-medium mb-3 text-gray-800 dark:text-white">
                  {healthGuideContent.generalHealth.subsections.exercise.parts.mentalBenefits.title}
                </h4>
                <ul className="list-disc pl-6 space-y-2">
                  {healthGuideContent.generalHealth.subsections.exercise.parts.mentalBenefits.items.map((item, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{item.title}:</span> {renderFormattedContent(item.content)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sleep */}
            <div 
              id="sleep" 
              ref={(el) => (sectionRefs.current.sleep = el)}
              className="mb-8"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                {healthGuideContent.generalHealth.subsections.sleep.title}
              </h3>
              
              <div className="space-y-4">
                {healthGuideContent.generalHealth.subsections.sleep.content.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {renderFormattedContent(paragraph)}
                  </p>
                ))}
              </div>

              {/* Sleep Importance */}
              <div className="mt-6 mb-6">
                <h4 className="text-xl font-medium mb-3 text-gray-800 dark:text-white">
                  {healthGuideContent.generalHealth.subsections.sleep.parts.importance.title}
                </h4>
                <div className="space-y-4">
                  {healthGuideContent.generalHealth.subsections.sleep.parts.importance.content.map((paragraph, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {renderFormattedContent(paragraph)}
                    </p>
                  ))}
                </div>
              </div>

              {/* Sleep Consequences */}
              <div className="mt-6 mb-6">
                <h4 className="text-xl font-medium mb-3 text-gray-800 dark:text-white">
                  {healthGuideContent.generalHealth.subsections.sleep.parts.consequences.title}
                </h4>
                <div className="space-y-4">
                  {healthGuideContent.generalHealth.subsections.sleep.parts.consequences.content.map((paragraph, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {renderFormattedContent(paragraph)}
                    </p>
                  ))}
                </div>
                {healthGuideContent.generalHealth.subsections.sleep.parts.consequences.items && (
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    {healthGuideContent.generalHealth.subsections.sleep.parts.consequences.items.map((item, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">{item.title}:</span> {renderFormattedContent(item.content)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Diseases & Conditions */}
          <section 
            id="diseases-conditions"
            ref={(el) => (sectionRefs.current['diseases-conditions'] = el)}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
              {healthGuideContent.diseasesConditions.title}
            </h2>
            {/* Render subsections and parts for Diseases & Conditions */}
            {Object.values(healthGuideContent.diseasesConditions.subsections).map(subsection => (
              <div key={subsection.id} id={subsection.id} ref={el => sectionRefs.current[subsection.id] = el} className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{subsection.title}</h3>
                {subsection.content?.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{renderFormattedContent(paragraph)}</p>
                ))}
                {subsection.parts && Object.values(subsection.parts).map(part => (
                  <div key={part.title} className="mt-6 mb-6">
                    <h4 className="text-xl font-medium mb-3 text-gray-800 dark:text-white">{part.title}</h4>
                    {part.content && part.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">{renderFormattedContent(paragraph)}</p>
                    ))}
                    {part.items && (
                      <ul className="list-disc pl-6 space-y-2">
                        {part.items.map((item, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">
                            {item.title ? <><span className="font-medium">{item.title}:</span> {renderFormattedContent(item.content)}</> : renderFormattedContent(item)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* First Aid & Emergencies */}
          <section 
            id="first-aid"
            ref={(el) => (sectionRefs.current['first-aid'] = el)}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
              {healthGuideContent.firstAid.title}
            </h2>
            {healthGuideContent.firstAid.content?.map((paragraph, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{renderFormattedContent(paragraph)}</p>
            ))}
            {Object.values(healthGuideContent.firstAid.subsections).map(subsection => (
              <div key={subsection.id} id={subsection.id} ref={el => sectionRefs.current[subsection.id] = el} className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{subsection.title}</h3>
                {subsection.content?.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{renderFormattedContent(paragraph)}</p>
                ))}
                {subsection.parts && Object.values(subsection.parts).map(part => (
                  <div key={part.title} className="mt-6 mb-6">
                    <h4 className="text-xl font-medium mb-3 text-gray-800 dark:text-white">{part.title}</h4>
                    {part.content && part.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">{renderFormattedContent(paragraph)}</p>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* Mental Health & Well-being */}
          <section 
            id="mental-health"
            ref={(el) => (sectionRefs.current['mental-health'] = el)}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
              {healthGuideContent.mentalHealth.title}
            </h2>
            {healthGuideContent.mentalHealth.content?.map((paragraph, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{renderFormattedContent(paragraph)}</p>
            ))}
            {Object.values(healthGuideContent.mentalHealth.subsections).map(subsection => (
              <div key={subsection.id} id={subsection.id} ref={el => sectionRefs.current[subsection.id] = el} className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{subsection.title}</h3>
                {subsection.content?.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{renderFormattedContent(paragraph)}</p>
                ))}
                {subsection.parts && Object.values(subsection.parts).map(part => (
                  <div key={part.title} className="mt-6 mb-6">
                    <h4 className="text-xl font-medium mb-3 text-gray-800 dark:text-white">{part.title}</h4>
                    {part.content && part.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">{renderFormattedContent(paragraph)}</p>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* Preventive Healthcare */}
          <section 
            id="preventive-healthcare"
            ref={(el) => (sectionRefs.current['preventive-healthcare'] = el)}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
              {healthGuideContent.preventiveHealthcare.title}
            </h2>
            {healthGuideContent.preventiveHealthcare.content?.map((paragraph, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{renderFormattedContent(paragraph)}</p>
            ))}
            {Object.values(healthGuideContent.preventiveHealthcare.subsections).map(subsection => (
              <div key={subsection.id} id={subsection.id} ref={el => sectionRefs.current[subsection.id] = el} className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{subsection.title}</h3>
                {subsection.content?.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{renderFormattedContent(paragraph)}</p>
                ))}
                {subsection.parts && Object.values(subsection.parts).map(part => (
                  <div key={part.title} className="mt-6 mb-6">
                    <h4 className="text-xl font-medium mb-3 text-gray-800 dark:text-white">{part.title}</h4>
                    {part.content && part.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">{renderFormattedContent(paragraph)}</p>
                    ))}
                    {part.items && (
                      <ul className="list-disc pl-6 space-y-2">
                        {part.items.map((item, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">
                            {item.title ? <><span className="font-medium">{item.title}:</span> {renderFormattedContent(item.content)}</> : renderFormattedContent(item)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* Conclusion */}
          <section 
            id="conclusion" 
            ref={(el) => (sectionRefs.current.conclusion = el)}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
              {healthGuideContent.conclusion.title}
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The journey to optimal health is multifaceted, involving attention to nutrition, physical activity, sleep, 
                mental health, and preventive measures. This comprehensive Healthcare Knowledge Hub has been organized to 
                provide a clear, evidence-based overview of essential topics, enabling readers to make informed decisions 
                about their health and well-being.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By integrating principles of a balanced diet, regular exercise, quality sleep, and robust first aid 
                techniques with the proactive measures of preventive healthcare and mental health support, individuals 
                can significantly improve their quality of life.
              </p>
              
              <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-white">Key Takeaways:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Nutrition:</span> A balanced diet is foundational to health, providing the necessary nutrients for bodily functions and disease prevention.
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Exercise:</span> Regular physical activity not only improves physical health but also enhances mental well-being.
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Sleep:</span> Quality sleep is essential for physical restoration and cognitive function.
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Chronic & Infectious Diseases:</span> Understanding and managing both chronic conditions and acute infections require vigilance, early detection, and appropriate treatment.
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">First Aid:</span> Knowledge of first aid techniques can be life-saving during emergencies.
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Mental Health:</span> Early recognition and proactive management of mental health issues can lead to better outcomes.
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Preventive Healthcare:</span> Vaccinations, screenings, and good hygiene practices are crucial in preventing diseases and promoting long-term health.
                </li>
              </ul>
            </div>
          </section>

          <section 
            id="references" 
            ref={(el) => (sectionRefs.current.references = el)}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
              References
            </h2>
            
            <div className="space-y-6">
              {/* CDC */}
              <div>
                <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-white">Centers for Disease Control and Prevention (CDC):</h3>
                <ul className="list-none space-y-2">
                  <li>
                    <a href="https://www.cdc.gov/nutrition/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Nutrition Basics
                    </a>
                  </li>
                  <li>
                    <a href="https://www.cdc.gov/vaccines/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Vaccines & Immunizations
                    </a>
                  </li>
                  <li>
                    <a href="https://www.cdc.gov/flu/index.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Flu Information
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* WHO */}
              <div>
                <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-white">World Health Organization (WHO):</h3>
                <ul className="list-none space-y-2">
                  <li>
                    <a href="https://www.who.int/health-topics/nutrition" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Nutrition
                    </a>
                  </li>
                  <li>
                    <a href="https://www.who.int/news-room/fact-sheets/detail/physical-activity" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Physical Activity
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Mayo Clinic */}
              <div>
                <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-white">Mayo Clinic:</h3>
                <ul className="list-none space-y-2">
                  <li>
                    <a href="https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/protein/art-20045076" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Protein and Nutrition
                    </a>
                  </li>
                  <li>
                    <a href="https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/exercise/art-20048389" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Exercise Benefits
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </article>
        
        {/* Back to top button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Back to top
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveHealthGuide; 