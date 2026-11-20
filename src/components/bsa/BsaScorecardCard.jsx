import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

export default function BsaScorecardCard({ scorecard }) {
  if (!scorecard) return null;

  const score = scorecard.score || 700;
  const band = scorecard.scoreBand || 'GOOD';
  const label = scorecard.ratingLabel || 'STANDARD APPROVAL';
  const auditTrail = scorecard.auditTrail || [];

  // Determine badge styling
  let badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
  let scoreColor = 'text-blue-600';
  let progressColor = 'bg-blue-600';

  if (score >= 800) {
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    scoreColor = 'text-emerald-600';
    progressColor = 'bg-emerald-600';
  } else if (score >= 700) {
    badgeColor = 'bg-sky-100 text-sky-800 border-sky-300';
    scoreColor = 'text-sky-600';
    progressColor = 'bg-sky-600';
  } else if (score >= 600) {
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    scoreColor = 'text-amber-600';
    progressColor = 'bg-amber-500';
  } else {
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    scoreColor = 'text-rose-600';
    progressColor = 'bg-rose-600';
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4 text-sky-400" />
              Credit Underwriting Risk Score
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-black tracking-tight text-white">{score}</span>
              <span className="text-slate-400 text-lg font-semibold">/ 1000</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${badgeColor}`}>
                {band}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block text-xs font-medium text-slate-400 mb-1">Lender Recommendation</span>
            <div className="text-sm md:text-base font-bold text-sky-300">{label}</div>
          </div>
        </div>

        {/* Progress gauge bar */}
        <div className="w-full bg-slate-700/60 rounded-full h-2.5 mt-5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
            style={{ width: `${Math.min(100, (score / 1000) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
          <span>0 (High Risk)</span>
          <span>600 (Fair)</span>
          <span>700 (Good)</span>
          <span>800+ (Excellent)</span>
        </div>
      </div>

      {/* Factor Audit Trail Table */}
      <div className="p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Transparent Risk Factor Breakdown
        </h4>

        <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
          {auditTrail.map((item, idx) => {
            const isPositive = (item.point_delta || 0) > 0;
            const isNegative = (item.point_delta || 0) < 0;

            let pillClass = 'bg-slate-100 text-slate-700';
            if (item.level === 'GREEN') pillClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            if (item.level === 'AMBER') pillClass = 'bg-amber-50 text-amber-700 border-amber-200';
            if (item.level === 'RED') pillClass = 'bg-rose-50 text-rose-700 border-rose-200';

            return (
              <div key={idx} className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-slate-900">{item.factor}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${pillClass}`}>
                      {item.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.finding}</p>
                  {item.lender_impact && (
                    <p className="text-[11px] text-slate-400 mt-0.5 italic">Impact: {item.lender_impact}</p>
                  )}
                </div>

                <div className="sm:text-right shrink-0">
                  <div
                    className={`inline-flex items-center gap-1 font-bold text-sm px-2.5 py-1 rounded-md ${
                      isPositive
                        ? 'text-emerald-700 bg-emerald-50'
                        : isNegative
                        ? 'text-rose-700 bg-rose-50'
                        : 'text-slate-600 bg-slate-100'
                    }`}
                  >
                    {isPositive && <ArrowUpRight className="w-4 h-4" />}
                    {isNegative && <ArrowDownRight className="w-4 h-4" />}
                    {!isPositive && !isNegative && <Minus className="w-4 h-4" />}
                    <span>{isPositive ? `+${item.point_delta}` : item.point_delta || 0} pts</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

