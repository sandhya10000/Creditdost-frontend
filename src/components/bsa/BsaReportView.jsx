import React, { useState } from 'react';
import {
  Download,
  User,
  CreditCard,
  PieChart as PieIcon,
  Users,
  Activity,
  FileCheck,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Shield,
  X,
  FileText,
} from 'lucide-react';
import BsaScorecardCard from './BsaScorecardCard';
import CircularFlowVisualizer from './CircularFlowVisualizer';

export default function BsaReportView({ reportData, jobId }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedTxnModal, setSelectedTxnModal] = useState(null);

  if (!reportData) return null;

  const account = reportData.account || {};
  const statementPeriod = reportData.statementPeriod || {};
  const analytics = reportData.analytics || {};
  const summary = analytics.summary || {};
  const eod = analytics.eodMetrics || {};
  const monthlyBreakdown = analytics.monthlyBreakdown || [];
  const forensics = analytics.forensics || {};
  const obligations = forensics.loansAndEmis?.detectedEmis || [];
  const circularEvents = forensics.circularAndSelf?.circularEvents || [];
  const selfTransfers = forensics.circularAndSelf?.selfTransfers || [];
  const relatedTransfers = forensics.circularAndSelf?.relatedPartyTransfers || [];
  const bounces = forensics.reversalsAndBounces?.bounceEvents || [];
  const scorecard = reportData.scorecard || {};
  const narrative = reportData.narrative || {};

  const handleDownloadPdf = () => {
    if (jobId) {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      window.open(`${API_BASE_URL}/v1/bsa/report/${jobId}/pdf`, '_blank');
    }
  };

  const tabs = [
    { key: 'profile', label: 'Profile & Overview', icon: User },
    { key: 'income', label: 'Income Reality', icon: CreditCard },
    { key: 'spending', label: 'Spending DNA', icon: PieIcon },
    { key: 'counterparties', label: 'Counterparties & Forensics', icon: Users },
    { key: 'eod', label: 'EOD Balances', icon: Activity },
    { key: 'scorecard', label: 'Risk Scorecard', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <FileCheck className="w-4 h-4" />
            Credit Intelligence Report · VerifyHub
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {account.accountHolderName || 'Borrower Analysis'}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
            <span><strong>Bank:</strong> {account.bankName || 'Verified Statement'}</span>
            <span>•</span>
            <span><strong>A/C:</strong> {account.accountNumberMasked || 'N/A'}</span>
            <span>•</span>
            <span><strong>Period:</strong> {statementPeriod.from || 'Start'} to {statementPeriod.to || 'End'}</span>
          </div>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          Download Underwriting PDF
        </button>
      </div>

      {/* Interactive Tabs Header */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile & Overview */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <BsaScorecardCard scorecard={scorecard} />

          {/* Qualitative Underwriting Narrative */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Executive Underwriting Summary
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
              {narrative.executiveUnderwritingSummary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-lg">
                <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wide block mb-1">
                  Borrower Behavioral Persona
                </span>
                <p className="text-xs text-sky-800 leading-relaxed">{narrative.borrowerBehavioralPersona}</p>
              </div>

              <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-lg">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide block mb-1">
                  AML & Rotation Observations
                </span>
                <p className="text-xs text-amber-800 leading-relaxed">{narrative.amlObservations}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Income Reality */}
      {activeTab === 'income' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Genuine Monthly Income</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{Number(summary.monthlyGenuineIncome || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Excludes self-transfers & loans</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Income Stability CV</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {((summary.incomeStabilityCv || 0) * 100).toFixed(1)}%
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {(summary.incomeStabilityCv || 0) <= 0.30 ? 'Low Volatility (Predictable)' : 'Moderate/High Volatility'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Gross Inflows</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{Number(summary.totalGrossCredits || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Total statement credits</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Discounted Inflows</span>
              <div className="text-2xl font-black text-rose-600 mt-1">
                ₹{Number(summary.totalExcludedCredits || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-rose-500 mt-1">Reversals, loans, self transfers</p>
            </div>
          </div>

          {/* Monthly Inflow breakdown table */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Monthly Income Reality Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Month</th>
                    <th className="py-3 px-4">Gross Credits</th>
                    <th className="py-3 px-4">Excluded Credits</th>
                    <th className="py-3 px-4">Genuine Monthly Income</th>
                    <th className="py-3 px-4">Debits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyBreakdown.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{m.month}</td>
                      <td className="py-3 px-4 text-slate-700">₹{Number(m.grossCredits).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-rose-600 font-semibold">₹{Number(m.excludedCredits).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-emerald-700 font-bold">₹{Number(m.genuineIncome).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-slate-700">₹{Number(m.debits).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Spending DNA & Obligations */}
      {activeTab === 'spending' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Monthly EMI</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{Number(summary.totalMonthlyEmi || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{obligations.length} Detected active mandate(s)</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">FOIR (Fixed Obligation Ratio)</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {summary.foir !== null && summary.foir !== undefined ? `${summary.foir}%` : 'N/A'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Safe benchmark: &le; 50%</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Average Monthly Outflow</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{Number(summary.avgMonthlyOutflow || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Monthly debit burn rate</p>
            </div>
          </div>

          {/* Detected EMIs Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Detected Loan EMIs & NACH Mandates</h3>
            {obligations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Lender / Mandate</th>
                      <th className="py-3 px-4">Monthly Obligation</th>
                      <th className="py-3 px-4">Periodicity</th>
                      <th className="py-3 px-4">Confidence</th>
                      <th className="py-3 px-4">Evidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {obligations.map((o, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-slate-900">{o.lenderName}</td>
                        <td className="py-3 px-4 text-slate-800 font-semibold">₹{Number(o.monthlyEmi).toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-slate-600">{o.frequencyDays} Days</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {o.confidence}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {o.transactions && o.transactions[0] && (
                            <button
                              onClick={() => setSelectedTxnModal(o.transactions[0])}
                              className="text-blue-600 hover:underline font-mono text-[11px]"
                            >
                              {o.transactions[0]}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No active recurring EMIs detected.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Counterparties & Circular Forensics */}
      {activeTab === 'counterparties' && (
        <div className="space-y-6">
          <CircularFlowVisualizer circularEvents={circularEvents} onSelectTxn={(id) => setSelectedTxnModal(id)} />

          {/* Self & Related Party Transfers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Self-Transfers ({selfTransfers.length})</h3>
              {selfTransfers.length > 0 ? (
                <div className="space-y-2">
                  {selfTransfers.map((s, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{s.date}</span>
                        <span className="text-blue-600">₹{Number(s.amount).toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-1">{s.evidence}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No self-transfers identified.</p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Related Party Transfers ({relatedTransfers.length})</h3>
              {relatedTransfers.length > 0 ? (
                <div className="space-y-2">
                  {relatedTransfers.map((r, idx) => (
                    <div key={idx} className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{r.date}</span>
                        <span className="text-amber-800">₹{Number(r.amount).toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-amber-700 text-[11px] mt-1">{r.evidence}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No related-party transfers detected.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: EOD Balances */}
      {activeTab === 'eod' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Average Daily EOD</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{Number(eod.avgEod || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{eod.totalCalendarDays || 0} Calendar Days Tracked</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Minimum EOD Balance</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{Number(eod.minEod || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Lowest recorded balance</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Days Balance &lt; ₹1k</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{eod.pctDaysBelow1k || 0}%</div>
              <p className="text-[11px] text-slate-500 mt-1">{eod.daysBelow1k || 0} Days below threshold</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Repayment Bounces</span>
              <div className="text-2xl font-black text-rose-600 mt-1">{bounces.length}</div>
              <p className="text-[11px] text-rose-500 mt-1">Dishonoured debit events</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Risk Scorecard */}
      {activeTab === 'scorecard' && (
        <div className="space-y-6">
          <BsaScorecardCard scorecard={scorecard} />
        </div>
      )}

      {/* Modal for Raw Line Evidence */}
      {selectedTxnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-slate-900">Transaction Evidence</h4>
              <button onClick={() => setSelectedTxnModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <strong>Transaction ID:</strong> <span className="font-mono text-blue-600">{selectedTxnModal}</span>
              </div>
              <div>
                <strong>Source Evidence:</strong> Corroborated with source line ID and verified statement row.
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedTxnModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

