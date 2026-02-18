import PageLayout from '@/components/layout/PageLayout';
import SectionHeader from '@/components/ui/SectionHeader';
import Link from 'next/link';

const tocItems = [
  { id: 'courses', label: 'Courses', level: 2 },
  { id: 'books', label: 'Books', level: 2 },
  { id: 'tools', label: 'Tools & Platforms', level: 2 },
  { id: 'community', label: 'Community', level: 2 },
];

export default function ResourcesPage() {
  return (
    <PageLayout tocItems={tocItems}>
      <div className="mb-10">
        <p className="section-label mb-2">Section 7</p>
        <h1 className="text-4xl font-black text-[#F0F0FF] mb-3">
          Learning <span className="gradient-text">Resources</span>
        </h1>
        <p className="text-[#A0A0C0] text-base leading-relaxed max-w-2xl">
          Curated courses, books, tools, and communities for your AI/ML journey — personally vetted.
        </p>
      </div>

      {/* Courses */}
      <section id="courses" className="mb-12">
        <SectionHeader label="7.1" title="Recommended Courses" />

        <div className="mb-5">
          <p className="text-xs font-mono text-gold-400 uppercase tracking-wider mb-3">⭐ Completed (Peter Shang)</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'IBM Data Science Professional Certificate', platform: 'Coursera', emoji: '🏅', desc: '10-course series: Python, ML, SQL, data viz, capstone project. Strong foundation for practitioners.' },
              { title: 'Google AI Agents Intensive', platform: 'Google', emoji: '🤖', desc: '5-day intensive on agentic AI, tool calling, prompt engineering, and production Gemini deployment.' },
            ].map((c) => (
              <div key={c.title} className="card-base p-5 border-amber-800/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="badge bg-gold-500/20 text-gold-400 text-[9px]">{c.platform}</span>
                </div>
                <h4 className="font-bold text-[#F0F0FF] text-sm mb-2">{c.title}</h4>
                <p className="text-xs text-[#A0A0C0]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-3">Recommended Learning Paths</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              level: 'Beginner',
              color: 'bg-green-900/20 border-green-800/30',
              textColor: 'text-green-400',
              resources: ['fast.ai — Practical Deep Learning', 'Coursera ML Specialization (Andrew Ng)', 'Kaggle Learn (free)', 'Google ML Crash Course (free)'],
            },
            {
              level: 'Intermediate',
              color: 'bg-blue-900/20 border-blue-800/30',
              textColor: 'text-blue-400',
              resources: ['DeepLearning.AI Specialization', 'Hugging Face NLP Course', 'Full Stack Deep Learning', 'Anthropic Prompt Engineering Guide'],
            },
            {
              level: 'Advanced',
              color: 'bg-purple-900/20 border-purple-800/30',
              textColor: 'text-purple-400',
              resources: ['Stanford CS229 (Machine Learning)', 'Stanford CS224N (NLP with DL)', 'Berkeley CS285 (Deep RL)', 'arXiv daily papers'],
            },
          ].map((path) => (
            <div key={path.level} className={`card-base p-5 border ${path.color}`}>
              <p className={`text-xs font-semibold ${path.textColor} uppercase tracking-wider mb-3`}>{path.level}</p>
              <ul className="space-y-2">
                {path.resources.map((r) => (
                  <li key={r} className="text-xs text-[#A0A0C0] flex items-start gap-1.5">
                    <span className="text-purple-400 shrink-0">▸</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Books */}
      <section id="books" className="mb-12">
        <SectionHeader label="7.2" title="Essential Books" />
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Hands-On Machine Learning', author: 'Aurélien Géron', emoji: '📘', desc: 'Best practical ML book. scikit-learn + TensorFlow. Perfect for practitioners.', level: 'Beginner-Int' },
            { title: 'Deep Learning', author: 'Goodfellow, Bengio, Courville', emoji: '📗', desc: 'The definitive theoretical reference for deep learning. Dense but comprehensive.', level: 'Advanced' },
            { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', emoji: '📙', desc: 'Essential for production ML systems, data pipelines, and distributed systems.', level: 'Intermediate' },
            { title: 'Natural Language Processing with Transformers', author: 'Lewis Tunstall et al.', emoji: '📕', desc: 'Hugging Face team\'s guide. Best book on modern NLP with transformers.', level: 'Intermediate' },
          ].map((book) => (
            <div key={book.title} className="card-base p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{book.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-[#F0F0FF] text-sm">{book.title}</h4>
                    <span className="badge bg-[#1A1A35] text-[#606080] text-[9px]">{book.level}</span>
                  </div>
                  <p className="text-[10px] text-purple-400 font-mono mb-2">by {book.author}</p>
                  <p className="text-xs text-[#A0A0C0]">{book.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="mb-12">
        <SectionHeader label="7.3" title="Tools & Platforms" />
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-purple-400 font-mono uppercase tracking-wider mb-3">Development Environment</p>
            <div className="space-y-2">
              {[
                { tool: 'Cursor IDE', desc: 'AI-powered code editor. Best for AI-assisted development.', star: true },
                { tool: 'VS Code', desc: 'Universal code editor with excellent Python/TS support.' },
                { tool: 'Google Colab', desc: 'Free GPU for ML experiments. Perfect for quick prototypes.' },
                { tool: 'Kaggle Notebooks', desc: 'Free GPU + public datasets. Great for competitions.' },
                { tool: 'Jupyter Lab', desc: 'Local notebook environment for data exploration.' },
              ].map((t) => (
                <div key={t.tool} className="flex items-start gap-2 p-3 bg-[#0A0A0F] rounded-lg border border-[#1A1A35]">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-[#F0F0FF]">{t.tool}</span>
                    {t.star && <span className="ml-2 badge bg-gold-500/20 text-gold-400 text-[9px]">Recommended</span>}
                    <p className="text-xs text-[#606080] mt-0.5">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-purple-400 font-mono uppercase tracking-wider mb-3">ML Ops & Deployment</p>
            <div className="space-y-2">
              {[
                { tool: 'Vercel', desc: 'Best for Next.js AI apps. Zero-config edge deployment.', star: true },
                { tool: 'Weights & Biases', desc: 'Experiment tracking, model registry, hyperparameter sweeps.' },
                { tool: 'MLflow', desc: 'Open-source ML lifecycle management. Self-hosted option.' },
                { tool: 'Hugging Face Hub', desc: 'Model hosting, datasets, Spaces for demos.' },
                { tool: 'FastAPI', desc: 'Best Python framework for ML API endpoints.' },
              ].map((t) => (
                <div key={t.tool} className="flex items-start gap-2 p-3 bg-[#0A0A0F] rounded-lg border border-[#1A1A35]">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-[#F0F0FF]">{t.tool}</span>
                    {t.star && <span className="ml-2 badge bg-gold-500/20 text-gold-400 text-[9px]">Recommended</span>}
                    <p className="text-xs text-[#606080] mt-0.5">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="mb-12">
        <SectionHeader label="7.4" title="Community & Stay Current" />
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'r/MachineLearning', type: 'Reddit', desc: 'Research discussions, paper analysis, industry news.', url: 'https://reddit.com/r/MachineLearning' },
            { name: 'arXiv cs.LG / cs.AI', type: 'Papers', desc: 'Latest research preprints. Daily new papers.', url: 'https://arxiv.org/list/cs.LG/recent' },
            { name: 'Hugging Face Discord', type: 'Community', desc: 'Active ML community, paper discussions, help channels.', url: 'https://hf.co/join/discord' },
            { name: 'The Batch (DeepLearning.AI)', type: 'Newsletter', desc: 'Andrew Ng\'s weekly AI newsletter. Excellent curation.', url: 'https://deeplearning.ai/the-batch' },
            { name: 'AI Explained', type: 'YouTube', desc: 'Best YouTube channel for understanding new AI papers.', url: 'https://youtube.com/@aiexplained-official' },
            { name: 'Simon Willison\'s blog', type: 'Blog', desc: 'Practical LLM applications and experiments. Very pragmatic.', url: 'https://simonwillison.net' },
          ].map((c) => (
            <Link key={c.name} href={c.url} target="_blank" className="card-base p-4 group">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge bg-purple-900/30 text-purple-400 text-[9px]">{c.type}</span>
              </div>
              <h4 className="font-bold text-[#F0F0FF] text-sm mb-1 group-hover:text-purple-300 transition-colors">{c.name}</h4>
              <p className="text-xs text-[#A0A0C0]">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
