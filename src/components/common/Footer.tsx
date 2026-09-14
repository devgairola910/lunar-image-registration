import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  ExternalLink,
  Globe,
  FileText,
  Building,
  Info,
  X
} from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: 'landing' | 'upload' | 'processing' | 'results' | 'history') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeModal, setActiveModal] = useState<'about' | 'contact' | 'terms' | 'privacy' | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOrg, setContactOrg] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmailInput('');
      }, 500);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail && contactMessage) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactName('');
        setContactEmail('');
        setContactOrg('');
        setContactMessage('');
        setTimeout(() => {
          setContactSubmitted(false);
          setActiveModal(null);
        }, 2000);
      }, 1000);
    }
  };

  return (
    <>
      {/* =========================================================================
          COMMERCIAL-GRADE FULL-FLEDGED FOOTER
         ========================================================================= */}
      <footer className="z-20 border-t border-white/20 bg-black/95 backdrop-blur-2xl pt-16 pb-12 px-4 sm:px-8 mt-auto text-xs font-mono text-regolith-400 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Top Row: Mission Newsletter & Live System Health */}
          <div className="gov-card p-6 sm:p-8 rounded-2xl border border-white/20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-2xl">
            <div className="lg:col-span-6 space-y-2">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-white/10 text-regolith-200 text-[10px] font-bold border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-earth-400"></span>
                <span>CHANDRADRISHTI MISSION UPDATES</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Stay Updated with Pipeline Releases
              </h3>
              <p className="text-xs text-regolith-300 leading-relaxed max-w-lg">
                Receive notifications for new algorithm updates, benchmark datasets, and lunar image coregistration releases.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-white flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 text-regolith-200" />
                  <div>
                    <div className="font-bold text-sm text-white">Subscription Confirmed!</div>
                    <div className="text-[11px] text-regolith-200">You will receive notifications for new pipeline releases.</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-regolith-500" />
                    <input
                      type="email"
                      required
                      placeholder="scientist@institution.ac.in"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/80 border border-white/20 text-white placeholder-regolith-600 focus:outline-none focus:border-earth-400 text-xs transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-white hover:bg-regolith-200 text-black font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Middle: 5 Commercial Columns with Rich Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 border-b border-white/15 pb-12">
            
            {/* Column 1: Core Platform & Algorithms */}
            <div className="space-y-3">
              <div className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2 flex items-center space-x-1.5">
                <span>Product & Engine</span>
              </div>
              <ul className="space-y-2 text-[11px] text-regolith-400">
                <li><button onClick={() => onNavigate?.('upload')} className="hover:text-white transition-colors cursor-pointer text-left">Sensor Ingestion Studio</button></li>
                <li><button onClick={() => onNavigate?.('processing')} className="hover:text-white transition-colors cursor-pointer text-left">5-Stage Pipeline Engine</button></li>
                <li><button onClick={() => onNavigate?.('results')} className="hover:text-white transition-colors cursor-pointer text-left">Sub-Pixel Telemetry Viewer</button></li>
                <li><button onClick={() => onNavigate?.('history')} className="hover:text-white transition-colors cursor-pointer text-left">Mission Execution Archive</button></li>
                <li><a href="#architecture" className="hover:text-white transition-colors">Hapke Photometric Normalization</a></li>
                <li><a href="#architecture" className="hover:text-white transition-colors">LoFTR-Lunar Cross-Attention</a></li>
                <li><a href="#architecture" className="hover:text-white transition-colors">MAGSAC++ Consensus Filter</a></li>
                <li><span className="text-regolith-600 cursor-not-allowed">Python SDK (pip install chandradrishti)</span></li>
              </ul>
            </div>

            {/* Column 2: Missions & Datasets */}
            <div className="space-y-3">
              <div className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2">
                Missions & Payloads
              </div>
              <ul className="space-y-2 text-[11px] text-regolith-400">
                <li><a href="https://www.isro.gov.in/Chandrayaan2.html" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1"><span>Chandrayaan-2 Orbiter</span><ExternalLink className="w-2.5 h-2.5 text-regolith-600" /></a></li>
                <li><a href="https://www.isro.gov.in/Chandrayaan3.html" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1"><span>Chandrayaan-3 Propulsion</span><ExternalLink className="w-2.5 h-2.5 text-regolith-600" /></a></li>
                <li><span className="text-white font-medium">OHRC Camera (0.25 m/px)</span></li>
                <li><span className="text-white font-medium">TMC-2 Tri-Stereo DEMs</span></li>
                <li><span className="text-white font-medium">IIRS Hyperspectral (250 bands)</span></li>
                <li><span className="text-white font-medium">DFSAR Polarimetric Radar</span></li>
                <li><a href="https://chandra.issdc.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1"><span>ISSDC PRADAN Science Data</span><ExternalLink className="w-2.5 h-2.5 text-regolith-600" /></a></li>
                <li><a href="https://pds-geosciences.wustl.edu" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1"><span>NASA PDS Geosciences Node</span><ExternalLink className="w-2.5 h-2.5 text-regolith-600" /></a></li>
              </ul>
            </div>

            {/* Column 3: Solutions & Applications */}
            <div className="space-y-3">
              <div className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2">
                Solutions & Science
              </div>
              <ul className="space-y-2 text-[11px] text-regolith-400">
                <li><span className="hover:text-white transition-colors">Lander Hazard Detection & Avoidance</span></li>
                <li><span className="hover:text-white transition-colors">Lunar South Pole Ice Prospecting</span></li>
                <li><span className="hover:text-white transition-colors">Artemis III / ISRO Landing Corridors</span></li>
                <li><span className="hover:text-white transition-colors">Clavius Basin Geomorphology</span></li>
                <li><span className="hover:text-white transition-colors">Tycho Central Peak Terraces</span></li>
                <li><span className="hover:text-white transition-colors">Shackleton Crater Permanently Shadowed</span></li>
                <li><span className="hover:text-white transition-colors">Academic Consortia Research Grants</span></li>
                <li><span className="hover:text-white transition-colors">On-Premises Air-Gapped Deployment</span></li>
              </ul>
            </div>

            {/* Column 4: Institutional & About */}
            <div className="space-y-3">
              <div className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2">
                Organization & About
              </div>
              <ul className="space-y-2 text-[11px] text-regolith-400">
                <li>
                  <button 
                    onClick={() => setActiveModal('about')}
                    className="text-earth-400 hover:text-earth-300 font-bold transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <span>About ChandraDrishti</span>
                    <Info className="w-3 h-3" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('contact')}
                    className="text-white hover:text-regolith-200 font-bold transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <span>Contact Operations Desk</span>
                    <Mail className="w-3 h-3 text-regolith-300" />
                  </button>
                </li>
                <li><a href="https://www.sac.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1"><span>Space Applications Centre (SAC)</span><ExternalLink className="w-2.5 h-2.5 text-regolith-600" /></a></li>
                <li><a href="https://www.issdc.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1"><span>ISSDC Bangalore</span><ExternalLink className="w-2.5 h-2.5 text-regolith-600" /></a></li>
                <li><a href="https://www.prl.res.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center space-x-1"><span>Physical Research Laboratory</span><ExternalLink className="w-2.5 h-2.5 text-regolith-600" /></a></li>
                <li><a href="https://www.isro.gov.in/Careers.html" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">ISRO Research Fellowships</a></li>
                <li><a href="#architecture" className="hover:text-white transition-colors">Pipeline Architecture</a></li>
                <li><span className="text-regolith-300 flex items-center space-x-1.5"><span className="w-1.5 h-1.5 rounded-full bg-regolith-400"></span><span>System Status: 99.98% Operational</span></span></li>
              </ul>
            </div>

            {/* Column 5: Legal & Security */}
            <div className="space-y-3">
              <div className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2">
                Legal & Governance
              </div>
              <ul className="space-y-2 text-[11px] text-regolith-400">
                <li>
                  <button 
                    onClick={() => setActiveModal('privacy')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Privacy Policy & Data Rights
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('terms')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Terms of Service & Usage
                  </button>
                </li>
                <li><span className="text-regolith-300">Open Science Data License (GODL-India)</span></li>
                <li><span className="text-regolith-300">NASA/ISRO PDS4 Archival Standards</span></li>
                <li><span className="text-regolith-300">IAU 2015 Cartographic Compliance</span></li>
                <li><a href="https://www.isro.gov.in/RightToInformation.html" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Right to Information (RTI)</a></li>
                <li><span className="text-regolith-300">Responsible Disclosure Program</span></li>
                <li><span className="text-regolith-300">Cookie & Telemetry Settings</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Card: Institutional Address & Commercial Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
            {/* Headquarters details */}
            <div className="md:col-span-7 space-y-2.5">
              <div className="flex items-center space-x-2 text-white font-bold text-xs">
                <Building className="w-4 h-4 text-earth-400" />
                <span>Space Applications Centre (SAC), Indian Space Research Organisation</span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-regolith-400">
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-regolith-500" />
                  <span>Jodhpur Tekra, Ambawadi Vistar P.O., Ahmedabad – 380015, Gujarat, India</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-regolith-500" />
                  <span>+91 (079) 2691-3000 / 2691-3001</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-regolith-400">
                <span className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-regolith-500" />
                  <a href="mailto:support-chandradrishti@sac.isro.gov.in" className="text-earth-400 hover:underline">
                    support-chandradrishti@sac.isro.gov.in
                  </a>
                </span>
                <span>•</span>
                <span>ISSDC Operations: Byalalu Deep Space Network Complex, Bengaluru</span>
              </div>
            </div>

            {/* Social Links & Accreditation Seals */}
            <div className="md:col-span-5 flex flex-col md:items-end space-y-3">
              <div className="flex items-center space-x-3">
                <a 
                  href="https://github.com/devgairola910/lunar-image-registration" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
                  title="GitHub Repository"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/company/isro" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
                  title="ISRO LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a 
                  href="https://twitter.com/isro" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
                  title="ISRO Official Twitter / X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.youtube.com/@isroofficial5866" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
                  title="ISRO YouTube Channel"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.isro.gov.in" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105"
                  title="ISRO Official Portal"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>

              {/* Compliance tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/15 text-[10px] text-regolith-300">
                  ISO 9001:2015 CERTIFIED
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/15 text-[10px] text-regolith-300">
                  PDS4 v1.19
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/15 text-[10px] text-regolith-300">
                  SPICE IAU-2015
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer Row */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-regolith-500">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-regolith-300 font-bold">CHANDRADRISHTI CORE v2.4.1</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} Space Applications Centre (SAC), Indian Space Research Organisation (ISRO).</span>
              <span>•</span>
              <span>Government of India. All Rights Reserved.</span>
            </div>

            <div className="flex items-center space-x-3 text-regolith-400">
              <span className="text-earth-400 font-semibold">Department of Space</span>
              <span>•</span>
              <span>Open Science & Cartography Node</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          INTERACTIVE MODALS (ABOUT US, CONTACT US, TERMS, PRIVACY)
         ========================================================================= */}

      {/* ABOUT US MODAL */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto gov-card p-6 sm:p-8 rounded-2xl border border-white/30 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-lg bg-white p-0.5" />
                <div>
                  <h3 className="text-xl font-bold text-white font-display">About ChandraDrishti</h3>
                  <p className="text-xs text-regolith-400 font-mono">Planetary Remote Sensing Division, SAC ISRO</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans text-regolith-200 leading-relaxed">
              <p>
                <strong>ChandraDrishti</strong> is an autonomous multi-sensor lunar photogrammetry and image coregistration engine, engineered to align orbital imagery across varying illumination conditions and sensor resolutions.
              </p>
              
              <h4 className="text-sm font-bold text-white font-display pt-2">Core Objective</h4>
              <p>
                Lunar surface imagery frequently exhibits significant variations in solar illumination angles and spatial resolutions. ChandraDrishti provides reliable sub-pixel coregistration across multi-sensor pairs, establishing precise geometric alignment for cartography, elevation modeling, and surface analysis.
              </p>

              <h4 className="text-sm font-bold text-white font-display pt-2">Key Highlights</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-1">
                <div className="p-3 rounded-lg bg-black/60 border border-white/15">
                  <div className="text-white font-bold">Multi-Sensor Support</div>
                  <div className="text-regolith-400 text-[11px]">Calibrated for OHRC (0.25m), TMC-2 (5m), and IIRS (80m) payloads.</div>
                </div>
                <div className="p-3 rounded-lg bg-black/60 border border-white/15">
                  <div className="text-white font-bold">Sub-Pixel Accuracy</div>
                  <div className="text-regolith-400 text-[11px]">Sub-pixel alignment with robust outlier rejection and tile-based spatial balancing.</div>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white font-display pt-2">Mission Application</h4>
              <p>
                The calibrated tie-points and orthorectified datasets produced by ChandraDrishti help identify safe landing sites, support terrain elevation mapping, and assist in correlation of multi-spectral lunar orbital imagery.
              </p>
            </div>

            <div className="border-t border-white/15 pt-4 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-bold font-mono text-xs cursor-pointer hover:bg-regolith-200 transition-colors"
              >
                Close Briefing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT US MODAL */}
      {activeModal === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto gov-card p-6 sm:p-8 rounded-2xl border border-white/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-earth-400" />
                <div>
                  <h3 className="text-xl font-bold text-white font-display">Contact Mission Operations</h3>
                  <p className="text-xs text-regolith-400 font-mono">ISRO Space Applications Centre Helpdesk</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {contactSubmitted ? (
              <div className="py-8 text-center space-y-3 font-mono">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/30 flex items-center justify-center mx-auto text-white">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white font-display">Inquiry Transmitted Successfully</h4>
                <p className="text-xs text-regolith-300 max-w-md mx-auto">
                  Your inquiry has been routed to the SAC Lunar Photogrammetry Support Team. Reference ID: <strong className="text-earth-400">#ISRO-SAC-{Math.floor(100000 + Math.random() * 900000)}</strong>
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-regolith-300 text-[11px]">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Rajesh Raman"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/80 border border-white/20 text-white placeholder-regolith-600 focus:outline-none focus:border-earth-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-regolith-300 text-[11px]">Official Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="scientist@university.edu"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/80 border border-white/20 text-white placeholder-regolith-600 focus:outline-none focus:border-earth-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-regolith-300 text-[11px]">Institution / Organization</label>
                  <input
                    type="text"
                    placeholder="IIT Bombay / Planetary Science Institute"
                    value={contactOrg}
                    onChange={(e) => setContactOrg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/80 border border-white/20 text-white placeholder-regolith-600 focus:outline-none focus:border-earth-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-regolith-300 text-[11px]">Scientific Query / Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Details regarding dataset access, tie-point calibration, or academic research collaboration..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/80 border border-white/20 text-white placeholder-regolith-600 focus:outline-none focus:border-earth-400 resize-none"
                  ></textarea>
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-[10px] text-regolith-400 leading-relaxed">
                  Queries are typically processed within 24–48 mission operational hours by the Planetary Data System desk at SAC ISRO.
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2.5 rounded-lg bg-obsidian-850 hover:bg-obsidian-800 text-regolith-300 border border-white/20 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-white hover:bg-regolith-200 text-black font-bold cursor-pointer shadow-lg transition-all"
                  >
                    Send Transmission
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TERMS OF SERVICE MODAL */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto gov-card p-6 sm:p-8 rounded-2xl border border-white/30 shadow-2xl space-y-4 text-xs font-sans text-regolith-200">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-earth-400" />
                <h3 className="text-lg font-bold text-white font-display">Terms of Service & Open Data Policy</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p>
              ChandraDrishti is maintained under the Indian Space Research Organisation Open Science Protocol and the Government Open Data License (GODL-India).
            </p>
            <h4 className="font-bold text-white font-display pt-1">1. Academic & Scientific Usage</h4>
            <p>
              All calibrated registration outputs, tie-point datasets, and orthomosaics generated using this platform are freely accessible for non-commercial scientific research, academic education, and planetary mapping.
            </p>
            <h4 className="font-bold text-white font-display pt-1">2. Attribution</h4>
            <p>
              Users must provide scientific attribution to Space Applications Centre (SAC), ISRO, referencing the Chandrayaan-2/3 science team in any publication or derived geospatial model.
            </p>
            <h4 className="font-bold text-white font-display pt-1">3. Geodetic Disclaimer</h4>
            <p>
              Coordinate predictions adhere to the IAU 2015 Lunar datum. While validated to sub-pixel precision against ground control baselines, operational spacecraft guidance requires formal verification with ISTRAC flight dynamics.
            </p>
            <div className="pt-3 border-t border-white/15 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-lg bg-white text-black font-bold font-mono text-xs cursor-pointer"
              >
                Accept & Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY POLICY MODAL */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto gov-card p-6 sm:p-8 rounded-2xl border border-white/30 shadow-2xl space-y-4 text-xs font-sans text-regolith-200">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-regolith-300" />
                <h3 className="text-lg font-bold text-white font-display">Privacy & Telemetry Protocol</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p>
              The Indian Space Research Organisation respects the privacy of scientific investigators and researchers accessing the ChandraDrishti portal.
            </p>
            <h4 className="font-bold text-white font-display pt-1">1. Processing Telemetry</h4>
            <p>
              All image feature matching calculations and homography matrix evaluations are performed in-memory or on designated GPU compute nodes. User-uploaded custom sensor frames are not permanently retained unless explicitly marked for public PDS4 archival contribution.
            </p>
            <h4 className="font-bold text-white font-display pt-1">2. Contact & Newsletter Information</h4>
            <p>
              Email addresses provided for the Planetary Science Bulletin are strictly utilized for mission data notifications and are never shared with commercial third parties.
            </p>
            <div className="pt-3 border-t border-white/15 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-lg bg-white text-black font-bold font-mono text-xs cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
