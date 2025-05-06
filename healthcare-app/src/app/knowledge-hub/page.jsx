import ComprehensiveHealthGuide from '@/components/HealthKnowledgeHub/ComprehensiveHealthGuide';

export default function KnowledgeHubPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Health Knowledge Hub</h1>
      <p className="text-gray-600 mb-8">
        Explore our comprehensive guide to health, wellness, and preventive care with evidence-based information 
        from trusted medical sources like the CDC, WHO, and major medical institutions.
      </p>
      <ComprehensiveHealthGuide />
    </div>
  );
} 