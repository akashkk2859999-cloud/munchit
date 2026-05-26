import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import munchItLogo from '../assets/Munch It logo.png';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center py-0 md:py-8 md:px-4 overflow-hidden relative">
      <div className="hidden md:block absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-munchit-yellow/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full h-screen md:h-[850px] md:max-h-[90vh] md:w-[412px] bg-white md:rounded-[3rem] md:shadow-2xl md:border-[12px] md:border-slate-800 md:relative md:overflow-hidden flex flex-col z-10 transition-all duration-300">
        <div className="hidden md:block absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-40" />

        {/* Header Bar */}
        <div className="bg-munchit-red text-white px-5 pt-10 md:pt-12 pb-4 flex items-center gap-3 relative z-20">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={18} strokeWidth={3} />
          </button>
          <img src={munchItLogo} alt="Munch It Logo" className="h-7 object-contain" />
          <span className="font-display font-black text-[10px] uppercase tracking-wider ml-auto">Terms & Conditions</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 text-gray-700 text-[11px] leading-relaxed space-y-3.5 scrollbar-none">
          <h1 className="text-base font-display font-black text-gray-900 uppercase tracking-tight leading-tight">
            Terms and Conditions
          </h1>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Version: 1.0 | Last Updated: May 2026</p>

          {/* PII Collected */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">Personal Identified Information (PII) Collected</h2>
          <p>The following information will be collected from participants who choose to make use of the Munch It Know Your Flavour Website ("Website"):</p>
          <ol className="list-[lower-roman] pl-5 space-y-1">
            <li>Name</li>
            <li>Phone Number</li>
            <li>Email ID</li>
            <li>Quiz Results Link</li>
          </ol>

          {/* Appropriate Use */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">Appropriate Use</h2>
          <p>
            You agree to use the Website solely for its intended purposes. You must not misuse, exploit, or manipulate the Website in any unauthorized manner including, but not limited to, uploading harmful, defamatory, or illegal content.
          </p>

          {/* User-Generated Content */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">User-Generated Content</h2>
          <p>
            By submitting content including your preferences for the quiz questions, through the Website, you grant Munch It a royalty-free, non-exclusive, perpetual, and worldwide license to use, reproduce, and distribute the content for marketing, education, promotional or research purposes, provided such use complies with privacy rights.
          </p>

          {/* Updates and Termination */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">Updates and Termination</h2>
          <p>
            Munch It reserves the right to update, modify, suspend, or terminate the Website or its features at any time. If needed, notifications of material changes will be sent via the Website or other reasonable communication channels.
          </p>

          {/* Limitation of Liability */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">Limitation of Liability</h2>
          <p>
            We do not warrant uninterrupted access or error-free performance. Munch It is not responsible for indirect, incidental, or consequential damage from the use or inability to use the Website.
          </p>

          {/* Indemnification */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">Indemnification</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>You agree to indemnify and hold harmless Munch It from any claims, liabilities, damages, or expenses arising out of your misuse of the Website or breach of these terms.</li>
            <li>You agree that Munch It cannot guarantee a hundred percent satisfactory results or confirmation that all your quiz results will be approved. In case you are not satisfied with the outcome of your participation in the quiz, or any other activity on the Website, you agree to indemnify Munch It of any responsibility.</li>
            <li>In case of Child/Children sharing quiz result links without Parent/Guardian consent you agree that Munch It is not responsible to ensure appropriate parental oversight is in place before a child interacts with our platform. This is the responsibility of the parent/legal guardian.</li>
            <li>Any information shared by you on your social media channels is your responsibility.</li>
          </ul>

          {/* Governing Law */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of the Federal Republic of Nigeria. Disputes shall first be addressed amicably, and unresolved issues may be submitted to the Lagos Multi-Door Courthouse for mediation.
          </p>

          {/* Contact */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">Contact Details</h2>
          <p>To exercise your rights, please contact:</p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1">
            <p className="font-bold text-gray-900 text-[11px] leading-relaxed">
              Kellogg Tolaram Nigeria Limited<br />
              3B Eric Moore Road, Surulere, Lagos, Nigeria<br />
              Email: contact@kelloggtolaram.com<br />
              Phone: +234 907 029 3810
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200 mt-6">
            <p className="text-[9px] text-gray-400 text-center uppercase tracking-wider font-bold">
              By reading and/or accepting these terms, you confirm that you have read, understood, and agreed to the policy terms & conditions.
            </p>
            <p className="text-[8px] text-gray-300 text-center uppercase tracking-wider font-bold mt-2">
              © {new Date().getFullYear()} Kellogg Tolaram Nigeria Limited. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
