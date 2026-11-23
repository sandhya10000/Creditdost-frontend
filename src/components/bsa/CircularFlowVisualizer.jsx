import React, { useState } from 'react';
import { RefreshCw, ArrowRight, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export default function CircularFlowVisualizer({ circularEvents = [], onSelectTxn }) {
  if (!circularEvents || circularEvents.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-emerald-900 mb-1">Zero Circular Money Movement Detected</h4>
        <p className="text-xs text-emerald-700 max-w-md mx-auto">
          No rapid round-trip fund cycling or pass-through patterns observed within 48-hour turnover windows.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-rose-500 animate-spin-slow" />
            Circular Money & Pass-Through Flow Audit
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Identifies credit inflows that were quickly drained out within 48 hours for comparable amounts.
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
          {circularEvents.length} Event(s)
        </span>
      </div>

      <div className="space-y-3">
        {circularEvents.map((evt, idx) => {
          return (
            <div
              key={idx}
              className="border border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100/60 transition-colors"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Visual Flow diagram */}
                <div className="flex items-center gap-3 flex-1">
                  {/* Inflow node */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 min-w-[140px]">
                    <div className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">Inflow</div>
                    <div className="text-sm font-black text-emerald-900 mt-0.5">
                      ₹{Number(evt.inflowAmount).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{evt.inflowDate}</div>
                    {evt.credit_txn_id && onSelectTxn && (
                      <button
                        onClick={() => onSelectTxn(evt.credit_txn_id)}
                        className="text-[9px] text-blue-600 hover:underline font-mono mt-1 block"
                      >
                        {evt.credit_txn_id}
                      </button>
                    )}
                  </div>

                  {/* Flow connector */}
                  <div className="flex flex-col items-center px-1">
                    <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap mb-0.5">
                      {evt.turnaroundHours}h window
                    </span>
                    <ArrowRight className="w-5 h-5 text-rose-500" />
                    <span className="text-[9px] font-semibold text-rose-600 uppercase tracking-tight">Rapid Drain</span>
                  </div>

                  {/* Outflow node */}
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 min-w-[140px]">
                    <div className="text-[10px] font-bold uppercase text-rose-700 tracking-wider">Outflow</div>
                    <div className="text-sm font-black text-rose-900 mt-0.5">
                      ₹{Number(evt.outflowAmount).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{evt.outflowDate}</div>
                    {evt.debit_txn_id && onSelectTxn && (
                      <button
                        onClick={() => onSelectTxn(evt.debit_txn_id)}
                        className="text-[9px] text-blue-600 hover:underline font-mono mt-1 block"
                      >
                        {evt.debit_txn_id}
                      </button>
                    )}
                  </div>
                </div>

                {/* Classification and Confidence tag */}
                <div className="text-right shrink-0">
                  <div className="inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                    {evt.status}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 mt-1">
                    Confidence: <span className="text-slate-900">{evt.confidenceScore}%</span>
                  </div>
                </div>
              </div>

              {evt.evidence && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-xs text-slate-600 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{evt.evidence}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

