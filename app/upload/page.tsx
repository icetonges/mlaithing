import PageLayout from '@/components/layout/PageLayout';
import DocumentUpload from '@/components/features/DocumentUpload';
import SectionHeader from '@/components/ui/SectionHeader';
import Callout from '@/components/ui/Callout';

export const metadata = {
  title: 'Upload Documents | AI/ML Knowledge Hub',
  description: 'Upload research papers, notebooks, or code for AI-powered analysis.',
};

export default function UploadPage() {
  return (
    <PageLayout>
      <div className="mb-10">
        <p className="section-label mb-2">Tools</p>
        <h1 className="text-4xl font-black text-[#F0F0FF] mb-3">
          Document <span className="gradient-text">Upload & Analysis</span>
        </h1>
        <p className="text-[#A0A0C0] text-base leading-relaxed max-w-2xl">
          Upload research papers, Jupyter notebooks, Python scripts, policy documents, or any text file for AI-powered analysis and insight extraction.
        </p>
      </div>

      <Callout type="tip" title="Supported Use Cases">
        Upload ML research papers to extract key findings · Upload your Python notebooks for code review · 
        Upload DoD policy documents for NLP analysis · Upload CSV datasets for automatic profiling
      </Callout>

      <div className="mt-8 max-w-3xl">
        <DocumentUpload />
      </div>

      {/* Supported formats */}
      <div className="mt-12">
        <SectionHeader
          title="Supported File Formats"
          description="All text-based formats are supported for full AI analysis."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { ext: '.pdf', icon: '📄', desc: 'Research papers, policy docs' },
            { ext: '.py', icon: '🐍', desc: 'Python scripts & notebooks' },
            { ext: '.md', icon: '📝', desc: 'Documentation & notes' },
            { ext: '.docx', icon: '📑', desc: 'Word documents' },
            { ext: '.csv', icon: '📊', desc: 'Data files' },
            { ext: '.json', icon: '📋', desc: 'API responses, configs' },
            { ext: '.ts/.js', icon: '🔷', desc: 'TypeScript/JavaScript' },
            { ext: '.txt', icon: '📃', desc: 'Plain text files' },
          ].map((f) => (
            <div key={f.ext} className="card-base p-4 text-center">
              <div className="text-2xl mb-1.5">{f.icon}</div>
              <p className="text-sm font-mono text-purple-400 font-bold">{f.ext}</p>
              <p className="text-[10px] text-[#606080] mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
