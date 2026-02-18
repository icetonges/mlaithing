'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, Loader2, FileText, Brain } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'done' | 'error';
  summary?: string;
  insights?: string[];
  id?: string;
}

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/csv': ['.csv'],
  'application/json': ['.json'],
  'text/x-python': ['.py'],
  'text/javascript': ['.js', '.ts'],
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      status: 'uploading',
    }));
    setFiles((prev) => [...prev, ...newFiles]);

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('analyze', 'true');

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();

        setFiles((prev) =>
          prev.map((f, idx) =>
            f.name === file.name
              ? {
                  ...f,
                  status: 'done',
                  summary: data.summary,
                  insights: data.insights,
                  id: data.id,
                }
              : f
          )
        );
        toast.success(`${file.name} processed successfully!`);
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, status: 'error' } : f
          )
        );
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const getIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('python')) return '🐍';
    if (type.includes('json')) return '📋';
    if (type.includes('csv')) return '📊';
    if (type.includes('markdown')) return '📝';
    return '📁';
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`upload-zone p-10 text-center cursor-pointer ${isDragActive ? 'drag-active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
              isDragActive
                ? 'bg-purple-600 scale-110'
                : 'bg-purple-900/30 border border-purple-700/30'
            }`}
          >
            <Upload className={`w-7 h-7 ${isDragActive ? 'text-white' : 'text-purple-400'}`} />
          </div>
          <div>
            <p className="text-lg font-bold text-[#F0F0FF] mb-1">
              {isDragActive ? 'Drop files here...' : 'Upload Documents'}
            </p>
            <p className="text-sm text-[#A0A0C0]">
              Drag & drop or click to browse
            </p>
            <p className="text-xs text-[#606080] mt-1">
              PDF, DOCX, TXT, MD, CSV, JSON, PY, JS, TS · Max 10MB per file
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#F0F0FF]">{files.length} file{files.length !== 1 ? 's' : ''}</p>
            <button
              onClick={() => setFiles([])}
              className="text-xs text-[#606080] hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          </div>

          {files.map((file) => (
            <div key={file.name} className="card-base p-4">
              <div className="flex items-start gap-3">
                {/* Icon & Status */}
                <div className="relative shrink-0">
                  <span className="text-2xl">{getIcon(file.type)}</span>
                  <div className="absolute -bottom-1 -right-1">
                    {file.status === 'uploading' && (
                      <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                    )}
                    {file.status === 'done' && (
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    )}
                    {file.status === 'error' && (
                      <X className="w-3.5 h-3.5 text-red-400" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-[#F0F0FF] truncate">{file.name}</p>
                      <p className="text-xs text-[#606080]">{formatSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="p-1 rounded hover:bg-red-900/20 text-[#606080] hover:text-red-400 transition-all shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Status badge */}
                  <div className="mt-1.5">
                    {file.status === 'uploading' && (
                      <span className="text-xs text-purple-400 font-mono">Uploading...</span>
                    )}
                    {file.status === 'processing' && (
                      <span className="text-xs text-gold-400 font-mono">AI analyzing...</span>
                    )}
                    {file.status === 'error' && (
                      <span className="text-xs text-red-400 font-mono">Upload failed</span>
                    )}
                    {file.status === 'done' && (
                      <span className="text-xs text-green-400 font-mono">✓ Ready</span>
                    )}
                  </div>

                  {/* AI Summary */}
                  {file.summary && (
                    <div className="mt-3 p-3 bg-purple-900/20 border border-purple-800/30 rounded-lg">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Brain className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">AI Summary</span>
                      </div>
                      <p className="text-xs text-[#A0A0C0] leading-relaxed">{file.summary}</p>
                    </div>
                  )}

                  {/* Key Insights */}
                  {file.insights && file.insights.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] text-[#606080] mb-1.5">Key Insights:</p>
                      <ul className="space-y-1">
                        {file.insights.slice(0, 3).map((insight, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-[#A0A0C0]">
                            <span className="text-purple-400 shrink-0">▸</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🔍', title: 'Smart Analysis', desc: 'AI extracts key concepts, algorithms, and patterns from your documents' },
          { icon: '💬', title: 'Ask Questions', desc: 'Use the AI assistant to query your uploaded documents' },
          { icon: '📊', title: 'Insights', desc: 'Get auto-generated summaries, key points, and ML concepts' },
        ].map((tip) => (
          <div key={tip.title} className="card-base p-4 text-center">
            <div className="text-2xl mb-2">{tip.icon}</div>
            <p className="text-xs font-semibold text-[#F0F0FF] mb-1">{tip.title}</p>
            <p className="text-[10px] text-[#606080]">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
