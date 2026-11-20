import React, { useState, useRef } from 'react';
import {
  Upload,
  Lock,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import axios from 'axios';

const STEPS = [
  { key: 'ingestion', label: 'Ingestion' },
  { key: 'profiling', label: 'Profiling' },
  { key: 'extraction', label: 'Extraction' },
  { key: 'reconciliation', label: 'Reconciliation' },
  { key: 'enrichment', label: 'Enrichment' },
  { key: 'complete', label: 'Complete' },
];

export default function BsaUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleUnauthorized = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('preLoginPath');
    setErrorMsg('Session expired. Please log in again.');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      setErrorMsg('');
      setNeedsPassword(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrorMsg('');
      setNeedsPassword(false);
    }
  };

  const pollJobStatus = async (jobId) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/v1/bsa/report/${jobId}`, {
          headers: { ...getAuthHeaders() },
        });
        const data = res.data;

        if (data.status === 'PROCESSING') {
          // Increment through progress steps
          const progress = data.progress || 0;
          if (progress < 25) setActiveStepIdx(0);
          else if (progress < 45) setActiveStepIdx(1);
          else if (progress < 65) setActiveStepIdx(2);
          else if (progress < 85) setActiveStepIdx(3);
          else setActiveStepIdx(4);
        } else if (data.status === 'COMPLETED') {
          clearInterval(interval);
          setActiveStepIdx(5);
          setIsUploading(false);
          if (onUploadSuccess) {
            onUploadSuccess(data.report, jobId);
          }
        } else if (data.status === 'NEEDS_PASSWORD') {
          clearInterval(interval);
          setIsUploading(false);
          setNeedsPassword(true);
          setErrorMsg('This statement PDF is password-protected. Please enter the password.');
        } else if (data.status === 'FAILED') {
          clearInterval(interval);
          setIsUploading(false);
          setErrorMsg(data.error || 'Bank statement processing failed. Please check file format.');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          clearInterval(interval);
          setIsUploading(false);
          handleUnauthorized();
          return;
        }
        clearInterval(interval);
        setIsUploading(false);
        setErrorMsg('Error checking analysis status. Please retry.');
      }
    }, 2000);
  };

  const handleUploadSubmit = async () => {
    if (!file) {
      setErrorMsg('Please select or drop a bank statement file.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');
    setActiveStepIdx(0);

    const formData = new FormData();
    formData.append('file', file);
    if (password) {
      formData.append('password', password);
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/v1/bsa/upload`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success && res.data.jobId) {
        pollJobStatus(res.data.jobId);
      } else {
        setIsUploading(false);
        setErrorMsg(res.data.message || 'Upload failed.');
      }
    } catch (err) {
      setIsUploading(false);
      if (err.response?.status === 401) {
        handleUnauthorized();
        return;
      }
      const respData = err.response?.data;
      if (respData?.status === 'NEEDS_PASSWORD' || respData?.code === 'PASSWORD_PROTECTED') {
        setNeedsPassword(true);
        setErrorMsg('This statement PDF is password-protected. Please enter password.');
      } else {
        setErrorMsg(respData?.message || 'Failed to upload statement file.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Upload Bank Statement</h3>
            <p className="text-xs text-slate-500">Supports PDF, Scanned Documents, XLSX, and CSV (Up to 25MB)</p>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Multi-step progress indicator when uploading */}
          {isUploading && (
            <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  Analyzing Statement
                </span>
                <span className="text-xs font-semibold text-blue-600">
                  Step {activeStepIdx + 1} of {STEPS.length}
                </span>
              </div>

              {/* Step pills */}
              <div className="grid grid-cols-6 gap-1.5">
                {STEPS.map((step, idx) => {
                  const isDone = idx < activeStepIdx;
                  const isCurrent = idx === activeStepIdx;
                  return (
                    <div key={step.key} className="text-center">
                      <div
                        className={`h-1.5 rounded-full mb-1 transition-all duration-300 ${
                          isDone
                            ? 'bg-emerald-500'
                            : isCurrent
                            ? 'bg-blue-600 animate-pulse'
                            : 'bg-slate-200'
                        }`}
                      />
                      <span className={`text-[9px] font-medium block truncate ${isCurrent ? 'text-blue-700 font-bold' : 'text-slate-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Drag & Drop Zone */}
          {!isUploading && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/60'
                  : file
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.xlsx,.xls,.csv,image/*"
                className="hidden"
              />

              {file ? (
                <div className="flex items-center justify-center gap-3">
                  {file.name.endsWith('.xlsx') || file.name.endsWith('.csv') ? (
                    <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <FileText className="w-8 h-8 text-blue-600" />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="w-12 h-12 bg-blue-100/80 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">
                    Click to browse or drag and drop statement
                  </p>
                  <p className="text-xs text-slate-400">PDF, Scanned Document, Excel (.xlsx) or CSV</p>
                </div>
              )}
            </div>
          )}

          {/* Password Prompt Section */}
          {needsPassword && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Lock className="w-4 h-4 text-amber-600" />
                Password Protected PDF
              </div>
              <p className="text-xs text-amber-700 mb-3">
                This document is encrypted by the bank. Enter the PDF password (e.g., DOB, PAN, or account number) to unlock.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter statement password..."
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Error Message Display */}
          {errorMsg && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              disabled={isUploading || !file}
              className="px-5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Start Analysis'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

