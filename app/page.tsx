import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-brand-purple text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">AI/ML Knowledge Hub</h1>
        <p className="text-xl text-brand-gold font-medium max-w-3xl mx-auto">
          From Fundamentals to Production-Ready AI: A personal repository for learning, reference, and innovation.
        </p>
      </section>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 py-16 px-6">
        
        {/* Section 1: ML Fundamentals */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold border-b-4 border-brand-gold pb-2 text-brand-purple">
            ML Fundamentals
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-lg mb-2">Binary Classifiers</h3>
            <p className="text-sm text-gray-600 mb-4">Models used to classify data into two categories (e.g., spam vs. normal).</p>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
              <li>Logistic Regression</li>
              <li>Support Vector Machines (SVM)</li>
              <li>Decision Trees & Random Forests</li>
            </ul>
          </div>
        </div>

        {/* Section 2: Agentic AI Systems */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold border-b-4 border-brand-gold pb-2 text-brand-purple">
            Agentic AI
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-lg mb-2">The Agent Paradigm</h3>
            <p className="text-sm text-gray-600 mb-4">Moving from passive models to autonomous problem-solving software.</p>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Model:</strong> The "Brain"</p>
              <p><strong>Tools:</strong> The "Hands"</p>
              <p><strong>Orchestration:</strong> The "Governing Layer"</p>
            </div>
          </div>
        </div>

        {/* Section 3: MyThing Case Study */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold border-b-4 border-brand-gold pb-2 text-brand-purple">
            Applied AI
          </h2>
          <div className="bg-brand-purple/5 p-6 rounded-lg border border-brand-purple/20">
            <h3 className="font-bold text-lg mb-2 text-brand-purple">MyThing Platform</h3>
            <p className="text-sm text-gray-600">Deep dive into production-grade multi-agent orchestration for DoD policy and tech trends.</p>
            <Link href="/mything" className="inline-block mt-4 text-brand-purple font-bold hover:underline">
              View Implementation →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}