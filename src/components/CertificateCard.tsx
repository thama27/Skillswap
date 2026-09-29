import React from 'react';
import { Award, Eye, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import type { Certificate } from '../types';
import Button from './Button';
import Badge from './Badge';

interface CertificateCardProps {
  certificate: Certificate;
  onView: (certificate: Certificate) => void;
  onPrint?: (certificate: Certificate) => void;
  onDownload?: (certificate: Certificate) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onView,
  onPrint,
  onDownload,
}) => {
  return (
    <div className="bg-[#11131A] border border-white/[0.08] hover:border-brand-purple/40 rounded-2xl p-5 shadow-card hover:shadow-glow transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Certificate Header Banner */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-purple/15 text-brand-purple border border-brand-purple/30 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">SkillSwap AI</p>
              <h5 className="text-xs font-semibold text-white">Certificate of Completion</h5>
            </div>
          </div>

          <Badge color="emerald" size="sm" variant="subtle">
            Verified
          </Badge>
        </div>

        {/* Certificate Body */}
        <div className="my-4 space-y-2">
          <div>
            <p className="text-[11px] text-slate-400">Skill Mastered</p>
            <h4 className="text-base font-bold text-white group-hover:text-brand-purple transition-colors">
              {certificate.skillName}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <div>
              <p className="text-slate-400">Awarded to</p>
              <p className="font-semibold text-slate-200">{certificate.userName}</p>
            </div>
            <div>
              <p className="text-slate-400">Mentor</p>
              <p className="font-semibold text-slate-200">{certificate.mentorName}</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/[0.05]">
            <span>ID: <code className="text-brand-300 font-mono">{certificate.certificateId}</code></span>
            <span>{certificate.completionDate}</span>
          </div>
        </div>
      </div>

      {/* Buttons: View, Print, Download */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onView(certificate)}
          icon={<Eye className="w-3.5 h-3.5" />}
        >
          View
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPrint?.(certificate)}
          icon={<Printer className="w-3.5 h-3.5" />}
          title="Print Certificate"
        >
          Print
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onDownload?.(certificate)}
          icon={<Download className="w-3.5 h-3.5" />}
          title="Download Certificate PDF"
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default CertificateCard;
