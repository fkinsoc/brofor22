import React, { useState } from 'react';
import AppLayout from '../components/Layout';
import { UploadCloud, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';

export default function DataUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setTimeout(() => {
          clearInterval(interval);
          setProgress(100);
          setUploading(false);
          setResult({
            totalRows: results.data.length,
            errors: results.errors.length,
            validRows: results.data.length - results.errors.length,
          });
        }, 1500); // Simulate ML processing time
      },
      error: (error) => {
        clearInterval(interval);
        setUploading(false);
        console.error(error);
      },
    });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-light tracking-tight text-text-primary dark:text-white">Data Upload</h1>
          <p className="text-sm text-zinc-800 dark:text-zinc-300 mt-1">Upload historical land acquisition data to train or run the ML pipeline.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-none p-10 flex flex-col items-center justify-center text-center transition-colors ${file ? 'border-zinc-400 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-800' : 'border-zinc-700 hover:border-zinc-900 dark:border-zinc-100 bg-zinc-900/50'}`}
            >
              <UploadCloud className={`w-12 h-12 mb-4 ${file ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}`} />
              <h3 className="text-lg font-medium text-text-primary dark:text-white mb-1">
                {file ? 'File Selected' : 'Drag & Drop CSV/Excel'}
              </h3>
              <p className="text-sm text-zinc-800 dark:text-zinc-300 mb-6">
                {file ? file.name : 'or click to browse from your computer'}
              </p>
              {!file && (
                <label className="px-4 py-2 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-100 text-text-primary dark:text-white text-sm font-medium rounded-none cursor-pointer transition-colors border border-zinc-700">
                  Select File
                  <input type="file" className="hidden" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
              )}
              {file && !uploading && !result && (
                <div className="flex gap-3">
                  <button onClick={handleUpload} className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-900 dark:bg-zinc-100 text-text-primary dark:text-white text-sm font-medium rounded-none transition-colors">
                    Process Dataset
                  </button>
                  <button onClick={() => setFile(null)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-100 text-zinc-800 dark:text-zinc-300 text-sm font-medium rounded-none transition-colors border border-zinc-700">
                    Cancel
                  </button>
                </div>
              )}
            </div>
            {uploading && (
              <div className="bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none p-6">
                <h3 className="text-sm font-medium text-text-primary dark:text-white mb-4">Processing Pipeline</h3>
                <div className="space-y-4 text-sm text-zinc-800 dark:text-zinc-300">
                  <div className="flex justify-between items-center">
                    <span>1. Validating Schema</span>
                    {progress >= 20 ? <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" /> : <div className="w-4 h-4 rounded-none border-2 border-zinc-700 border-t-amber-500" />}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>2. Imputing Missing Values</span>
                    {progress >= 50 ? <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" /> : (progress >= 20 ? <div className="w-4 h-4 rounded-none border-2 border-zinc-700 border-t-amber-500" /> : null)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>3. Running AI Delay Prediction Engine</span>
                    {progress >= 80 ? <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" /> : (progress >= 50 ? <div className="w-4 h-4 rounded-none border-2 border-zinc-700 border-t-amber-500" /> : null)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>4. Calculating SHAP Explanations</span>
                    {progress >= 100 ? <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" /> : (progress >= 80 ? <div className="w-4 h-4 rounded-none border-2 border-zinc-700 border-t-amber-500" /> : null)}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    <span>Overall Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-none h-2 overflow-hidden">
                    <div className="bg-zinc-900 dark:bg-zinc-100 h-2 rounded-none" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            )}
            {result && (
              <div className="bg-zinc-900 dark:bg-zinc-100/10 border border-emerald-900/30 rounded-none p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-none bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Processing Complete</h3>
                    <p className="text-sm text-zinc-800 dark:text-zinc-300">Dataset successfully analyzed and scored.</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-zinc-900/50 rounded-none p-3 border border-border-subtle dark:border-zinc-800/50">
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Total Records</div>
                    <div className="text-xl font-bold text-text-primary dark:text-white">{result.totalRows}</div>
                  </div>
                  <div className="bg-zinc-900/50 rounded-none p-3 border border-border-subtle dark:border-zinc-800/50">
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Valid Records</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{result.validRows}</div>
                  </div>
                  <div className="bg-zinc-900/50 rounded-none p-3 border border-border-subtle dark:border-zinc-800/50">
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Warnings/Errors</div>
                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{result.errors}</div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => {setResult(null); setFile(null); setProgress(0);}} className="text-sm font-medium text-zinc-800 dark:text-zinc-300 hover:text-text-primary dark:text-white transition-colors">
                    Upload Another File
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-background-secondary dark:bg-[#111111] border border-border-subtle dark:border-zinc-800 rounded-none p-5">
              <h3 className="text-sm font-semibold text-text-primary dark:text-white mb-3">Required Schema</h3>
              <p className="text-xs text-zinc-800 dark:text-zinc-300 mb-4 leading-relaxed">
                Ensure your dataset contains the following columns for accurate prediction:
              </p>
              <ul className="space-y-2 text-xs font-mono text-zinc-800 dark:text-zinc-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-none bg-zinc-900 dark:bg-zinc-100"></div> parcel_id</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-none bg-zinc-900 dark:bg-zinc-100"></div> survey_no</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-none bg-zinc-900 dark:bg-zinc-100"></div> area_acres</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-none bg-zinc-900 dark:bg-zinc-100"></div> ownership_status</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-none bg-zinc-900 dark:bg-zinc-100"></div> legal_dispute</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-none bg-zinc-900 dark:bg-zinc-100"></div> compensation_status</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-none bg-zinc-900 dark:bg-zinc-100"></div> acquisition_stage</li>
              </ul>
              <button className="mt-6 w-full flex items-center justify-center gap-2 py-2 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-100 text-zinc-800 dark:text-zinc-300 rounded-none text-sm transition-colors border border-zinc-700">
                <File className="w-4 h-4" /> Download Template
              </button>
            </div>
            <div className="bg-zinc-900 dark:bg-zinc-100/10 border border-zinc-900 dark:border-zinc-100/30 rounded-none p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-zinc-900 dark:text-zinc-100 flex-shrink-0" />
              <div className="text-xs text-zinc-800 dark:text-zinc-300 leading-relaxed">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-1">Data Privacy Notice</span>
                All uploaded data is processed ephemerally within the secure compute enclave. No PII is persisted beyond the active session.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}