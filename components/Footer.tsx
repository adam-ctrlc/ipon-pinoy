import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-border-dark bg-[#0F172A] py-10 w-full flex justify-center">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-[1200px] w-full px-6 gap-8">
        <div className="flex items-center gap-3">
          <div className="size-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-500 text-background-dark shadow-lg shadow-yellow-500/20">
            <span className="material-symbols-outlined text-2xl">savings</span>
          </div>
          <span className="text-white text-lg font-bold">IponPinoy</span>
        </div>
        <a
          className="hover:text-primary transition-colors flex items-center gap-1.5 text-slate-400 group"
          href="https://github.com/adam-ctrlc/pinoy-finance-tracker-frontend"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="material-symbols-outlined text-[18px] text-yellow-500">star</span>
          <span className="text-sm font-bold tracking-wide">Give a Star</span>
        </a>
        <div className="flex gap-6 text-sm text-slate-400">
          <a className="hover:text-primary transition-colors" href="https://github.com/adam-ctrlc/pinoy-finance-tracker-frontend" target="_blank" rel="noopener noreferrer">Repository</a>
          <a className="hover:text-primary transition-colors" href="https://github.com/adam-ctrlc/pinoy-finance-tracker-frontend/issues" target="_blank" rel="noopener noreferrer">Issues</a>
          <a className="hover:text-primary transition-colors" href="https://github.com/adam-ctrlc/pinoy-finance-tracker-frontend/pulls" target="_blank" rel="noopener noreferrer">Pull Requests</a>
        </div>
      </div>
    </footer>
  );
}
