import React from "react";

const StatsSection = () => {
  return (
    <section className="w-full py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl glass-panel-elevated border border-outline-variant/30 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-2">
            <span className="font-display-hero text-3xl lg:text-4xl text-primary-container font-extrabold mb-1 drop-shadow-[0_0_12px_rgba(0,210,255,0.4)]">
              11+
            </span>
            <span className="font-headline-sm text-white font-bold text-sm sm:text-base">
              Years of Trust
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              Pan-India bureau remediation
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <span className="font-display-hero text-3xl lg:text-4xl text-tertiary font-extrabold mb-1 drop-shadow-[0_0_12px_rgba(58,250,172,0.4)]">
              10,000+
            </span>
            <span className="font-headline-sm text-white font-bold text-sm sm:text-base">
              Profiles Restored
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              Over ₹180Cr in loans unlocked
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <span className="font-display-hero text-3xl lg:text-4xl text-primary-container font-extrabold mb-1 drop-shadow-[0_0_12px_rgba(0,210,255,0.4)]">
              98.4%
            </span>
            <span className="font-headline-sm text-white font-bold text-sm sm:text-base">
              Dispute Success
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              Validated bureau removals
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <span className="font-display-hero text-3xl lg:text-4xl text-secondary font-extrabold mb-1 drop-shadow-[0_0_12px_rgba(180,197,255,0.4)]">
              200+
            </span>
            <span className="font-headline-sm text-white font-bold text-sm sm:text-base">
              Bank Tie-Ups
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              Direct nodal desk access
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
