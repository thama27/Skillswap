import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  Printer,
  Download,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  QrCode,
  Share2,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import CertificateCard from '../components/CertificateCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { mockCertificates } from '../data/mockData';
import type { Certificate } from '../types';

export const Certificates: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const handlePrint = (cert: Certificate) => {
    window.print();
  };

  const handleDownload = (cert: Certificate) => {
    // Generate simulated download
    const element = document.createElement('a');
    const file = new Blob([
      `SkillSwap AI Official Certificate\n\nID: ${cert.certificateId}\nStudent: ${cert.userName}\nSkill: ${cert.skillName}\nMentor: ${cert.mentorName}\nCompleted: ${cert.completionDate}\nVerification: ${cert.verificationCode}\n\nVerified by SkillSwap AI Platform`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${cert.certificateId}_${cert.skillName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloadSuccessToast(`Certificate ${cert.certificateId} downloaded successfully!`);
    setTimeout(() => setDownloadSuccessToast(null), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Toast Alert */}
        {downloadSuccessToast && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#11131A] border border-emerald-500/50 shadow-2xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccessToast}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-white/[0.05]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                My Certificates
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                2 Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Digitally signed and verifiable credentials earned through peer mentorship milestones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDownload(mockCertificates[0])}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Export All
            </Button>
          </div>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockCertificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onView={(c) => setSelectedCert(c)}
              onPrint={handlePrint}
              onDownload={handleDownload}
            />
          ))}
        </div>

        {/* Verification Notice Banner */}
        <div className="p-5 rounded-2xl bg-[#0D0F14] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/15 text-brand-purple border border-brand-purple/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cryptographic Verification</h4>
              <p className="text-xs text-slate-400">
                Each certificate includes a tamper-evident identification hash verifiable by employers and institutions.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCert(mockCertificates[0])}
            icon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Check Verification Status
          </Button>
        </div>
      </div>

      {/* DETAILED PROFESSIONAL CERTIFICATE PREVIEW MODAL */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title={`Certificate Preview • ${selectedCert.certificateId}`}
          subtitle="SkillSwap AI Verified Credential"
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400 font-mono">
                Hash: {selectedCert.verificationCode}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePrint(selectedCert)}
                  icon={<Printer className="w-3.5 h-3.5" />}
                >
                  Print
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownload(selectedCert)}
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  Download
                </Button>
              </div>
            </div>
          }
        >
          {/* High-Fidelity Certificate Artwork Container */}
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-[#0D0F14] via-[#11131A] to-[#0D0F14] border-2 border-brand-purple/50 text-center relative overflow-hidden shadow-2xl space-y-6">
            {/* Subtle background decorative pattern */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Certificate Header with Logo */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-2 text-left">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/20 text-brand-purple border border-brand-purple/40 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-widest uppercase">
                    SkillSwap AI
                  </h3>
                  <p className="text-[10px] text-slate-400 tracking-wider uppercase">
                    Intelligent Skill Exchange Platform
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Certificate ID</p>
                <p className="text-xs font-bold text-brand-purple font-mono">{selectedCert.certificateId}</p>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="space-y-2 py-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-purple">
                Certificate of Completion
              </span>
              <p className="text-xs text-slate-400">
                This is proudly presented in recognition of mastery to
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-indigo-200 to-cyan-400 tracking-tight">
                {selectedCert.userName}
              </h2>
            </div>

            {/* Certificate Description & Skill */}
            <div className="space-y-3 max-w-lg mx-auto">
              <p className="text-xs text-slate-300">
                for successfully completing all peer mentoring requirements and demonstrating practical competence in:
              </p>
              <div className="inline-block px-6 py-2.5 rounded-xl bg-[#08090D] border border-brand-purple/40 text-base sm:text-lg font-bold text-white shadow-glow-sm">
                {selectedCert.skillName}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic pt-2">
                "{selectedCert.description}"
              </p>
            </div>

            {/* Signatures & Verification Seal */}
            <div className="grid grid-cols-3 items-end pt-6 border-t border-white/10 text-xs">
              <div className="text-center">
                <div className="h-9 flex items-center justify-center font-serif italic text-base text-slate-300 font-bold">
                  {selectedCert.mentorName}
                </div>
                <div className="border-t border-slate-700 pt-1">
                  <p className="font-semibold text-slate-200">{selectedCert.mentorName}</p>
                  <p className="text-[10px] text-slate-500">Verified Mentor</p>
                </div>
              </div>

              {/* Gold/Purple Center Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-purple to-cyan-400 p-[2px] shadow-glow">
                  <div className="w-full h-full rounded-full bg-[#0D0F14] flex flex-col items-center justify-center text-brand-purple">
                    <ShieldCheck className="w-6 h-6" />
                    <span className="text-[8px] font-bold uppercase tracking-wider text-slate-300">VERIFIED</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="h-9 flex items-center justify-center font-mono text-xs text-brand-300">
                  {selectedCert.completionDate}
                </div>
                <div className="border-t border-slate-700 pt-1">
                  <p className="font-semibold text-slate-200">Date Issued</p>
                  <p className="text-[10px] text-slate-500">{selectedCert.verificationCode}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Certificates;
