import OnThisPage from '@/components/OnThisPage';

export default function AgentsPage() {
  const toc = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'core-components', label: 'Core Components' },
    { id: 'cognitive-arch', label: 'Cognitive Architecture' },
    { id: 'tools-interop', label: 'Tools & Interoperability' },
  ];

  return (
    <div className="flex gap-12">
      <div className="flex-1 max-w-4xl">
        {/* Header */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <p className="text-brand-purple font-bold tracking-wide uppercase text-sm mb-2">System Architecture</p>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Agentic AI Systems</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Moving beyond passive prediction models to autonomous software capable of reasoning, planning, and executing actions in external environments.
          </p>
        </div>

        {/* Content Body - PROSE styling active */}
        <article className="prose prose-lg prose-slate max-w-none">
          <section id="introduction">
            <h2>The Shift to Autonomy</h2>
            <p>
              Traditional Machine Learning models are passive; they wait for input and provide a prediction. 
              <strong>Agentic AI</strong> reverses this paradigm. An agent is a system that uses an LLM as a "cognitive engine" 
              to perceive its environment, reason about how to solve a problem, and use tools to execute that solution.
            </p>
            <blockquote>
              "The model is the brain, the tools are the hands, and the orchestration is the nervous system."
            </blockquote>
          </section>

          <section id="core-components" className="mt-12">
            <h2>Core Agent Architecture</h2>
            <p>According to the Google Cloud "Introduction to Agents" whitepaper, a robust agent consists of three pillars:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose my-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-brand-purple transition-colors">
                <div className="text-3xl mb-3">🧠</div>
                <h3 className="font-bold text-gray-900 mb-2">The Model</h3>
                <p className="text-sm text-gray-600">The reasoning engine (e.g., Gemini 1.5 Pro) that plans steps and decides which tools to call.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-brand-purple transition-colors">
                <div className="text-3xl mb-3">🛠️</div>
                <h3 className="font-bold text-gray-900 mb-2">The Tools</h3>
                <p className="text-sm text-gray-600">External APIs, databases, and functions that allow the agent to affect the real world.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-brand-purple transition-colors">
                <div className="text-3xl mb-3">🎼</div>
                <h3 className="font-bold text-gray-900 mb-2">Orchestration</h3>
                <p className="text-sm text-gray-600">The loop (ReAct, Chain-of-Thought) that manages memory, state, and error handling.</p>
              </div>
            </div>
          </section>

          <section id="cognitive-arch">
            <h2>Cognitive Architecture</h2>
            <p>
              Agents operate using a loop often described as <strong>Perceive → Reason → Act</strong>. 
              Modern implementations utilize frameworks like LangGraph or AutoGen to manage this state.
            </p>
            <ul>
              <li><strong>Memory:</strong> Differentiating between short-term (session) and long-term (vector DB) context.</li>
              <li><strong>Planning:</strong> Breaking complex user requests into sequential sub-tasks.</li>
              <li><strong>Reflection:</strong> Self-correction when a tool output does not match the expected result.</li>
            </ul>
          </section>
        </article>
      </div>

      {/* Right Sidebar - TOC */}
      <OnThisPage links={toc} />
    </div>
  );
}