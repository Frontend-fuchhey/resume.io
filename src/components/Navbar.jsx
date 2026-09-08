import { useState } from 'react';
import { FileUp, FolderOpen } from 'lucide-react';
import logoImg from './assets/resume-io.png';
import { ImportResumeModal } from './modals/ImportResumeModal';
import { SavedResumesModal } from './modals/SavedResumesModal';

function Link({ to = '/', className, children, ...props }) {
  return (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  );
}

export function Navbar({ onOpenEditor }) {
  const [importOpen, setImportOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between py-6">
        <Link className="flex items-center" to="/">
          <img 
            src={logoImg} 
            alt="resume.io" 
            className="h-8 w-auto object-contain hover:opacity-90 transition-opacity" 
          />
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E2DC] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1A1A1A] shadow-xs hover:border-[#FF5E1A] hover:text-[#FF5E1A] hover:bg-[#FFF3EB] transition-all"
          >
            <FolderOpen size={14} className="text-[#FF5E1A]" />
            <span>My Resumes</span>
          </button>
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E2DC] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1A1A1A] shadow-xs hover:border-[#FF5E1A] hover:text-[#FF5E1A] hover:bg-[#FFF3EB] transition-all"
          >
            <FileUp size={14} className="text-[#FF5E1A]" />
            <span>Import CV</span>
          </button>
        </div>
      </header>

      <ImportResumeModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImportSuccess={() => {
          if (onOpenEditor) onOpenEditor();
        }}
      />
      <SavedResumesModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectResume={() => {
          if (onOpenEditor) onOpenEditor();
        }}
        onOpenImport={() => setImportOpen(true)}
      />
    </>
  );
}

export default Navbar;
