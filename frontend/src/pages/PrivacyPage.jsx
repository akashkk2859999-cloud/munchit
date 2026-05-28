import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import munchItLogo from '../assets/Munch It logo.png';

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center py-0 md:py-8 md:px-4 overflow-hidden relative">
      <div className="hidden md:block absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-munchit-yellow/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full h-screen md:h-[850px] md:max-h-[90vh] md:w-[412px] bg-white md:rounded-[3rem] md:shadow-2xl md:border-[12px] md:border-slate-800 md:relative md:overflow-hidden flex flex-col z-10 transition-all duration-300">
        <div className="hidden md:block absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-40" />

        {/* Header Bar */}
        <div className="bg-munchit-red text-white px-5 pt-10 md:pt-12 pb-4 flex items-center gap-3 relative z-20">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={18} strokeWidth={3} />
          </button>
          <img src={munchItLogo} alt="Munch It Logo" className="h-7 object-contain" />
          <span className="font-display font-black text-[10px] uppercase tracking-wider ml-auto">Privacy Policy</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 text-gray-700 text-[11px] leading-relaxed space-y-3.5 scrollbar-none">
          <h1 className="text-base font-display font-black text-gray-900 uppercase tracking-tight leading-tight">
            WHICH MUNCH IT FLAVOUR ARE YOU? – PRIVACY POLICY & TERMS AND CONDITIONS
          </h1>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Version: 1.0 | Last Updated: May 2026</p>

          {/* Section 1 */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">1. Introduction</h2>
          <p>
            Kelloggs Tolaram Nigeria Ltd ("KTNL," "we", "us", "our," "Munch It") respects your privacy and is committed to protecting your ("you," "yours," "participant," "consumer," "customer") personal data. This privacy policy contains information on how we collect your personal data as a part of Which Munch It Flavour Are You website ("Munch It", "Website"), how we look after your personal data and inform you of your privacy rights and how the law protects you.
          </p>
          <p>
            This policy also identifies the data we collect from you, why we collect your data, how we use your data, how you can control your data and how we manage, store, protect, share, and retain your data. The policy also highlights the minimum-security controls put in place to protect your data.
          </p>
          <p>
            This document outlines the Terms and Conditions of use as well as our Privacy Policy in compliance with the Nigeria Data Protection Act 2023 and other applicable laws. By downloading, accessing, or using this Website, you accept and agree to be bound by these Terms and Conditions and consent to the practices described in our Privacy Policy.
          </p>

          {/* Section 2 */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">2. Purpose of This Privacy Policy</h2>
          <p>
            The main purpose of the Website is to help participants to answer a fun filled and entertaining quiz about their personality and they will get to know which Munch It flavour best suits their personality. Participants can share their Munch It personality on social media and share with their family and friends.
          </p>
          <p>
            The purpose of this Privacy Policy is to define the data collected and processed as a part of your activities related to Munch It Know Your Flavour Website, registration activities, and interacting with our Website to participate in quiz and sharing of links over social media. Our Website is meant for adults above 18 years of age. However, if you want your Child to participate, you must be parent/legal guardian who will accept this policy on behalf of the Child. You are responsible for exercising parental guidance and controls for the kids on the website.
          </p>
          <p>
            By accepting this policy, you consent to our collection, use, and processing of your information as needed for business purposes. You are expected to use your discretion and security knowledge in providing information to any publicly available websites/links.
          </p>
          <p className="text-[9px] text-gray-400 font-bold">
            We keep our privacy policy under regular review. The latest version of the policy is updated in the month of May 2026.
          </p>

          {/* Section 3 */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">3. What Data We Collect From You</h2>
          <p>
            The data we collect from you is Personal Data. Personal Data, or personal information, means any information about an individual from which that person can be identified. In this case Personal Data contains details of you as a user of the Website. The data we collect from you and how we use it is described below:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Full name:</strong> As a participant in the Munch It Know Your Flavour contest, your name is used to authenticate you as unique participant/user, and if needed to establish communications with you as applicable based on nature of your participation in the Website. Name can be used for communication regarding sales campaigns, and marketing events.</li>
            <li><strong>Phone number:</strong> Phone number is one of the ways to register to the Website and is used to contact you if needed. Phone number is also used to authenticate you as unique participant, and to establish communications regarding the quiz. Used for communication regarding the quiz results. Phone number can be used for multifactor authentication using SMS or WhatsApp based one time password.</li>
            <li><strong>Email ID:</strong> Email ID is used as an alternate means of communication or used for multi-factor authentication (if applicable). Email ID is also used to identify you as a unique participant.</li>
            <li><strong>Quiz Results:</strong> This is automatically generated from the Website based on your responses to the quiz questions. The results are generated for fun and entertainment purposes only.</li>
          </ul>
          <p>Any other information may be collected at the time of prize dispatching or other activities as needed to maintain the functionality of the campaign.</p>
          <p className="font-bold text-gray-800">By sharing this information, you have provided consent to:</p>
          <ol className="list-[lower-alpha] pl-5 space-y-1.5">
            <li>The collection, use, processing, storage, and retention of your data for the purposes of the Munch It Know Your Flavour Contest.</li>
            <li>Receiving future marketing communications from Munch It, including promotional offers, events, and brand updates.</li>
            <li>Provide you with ability to link with your quiz results on social media platforms.</li>
            <li>Agree that sharing your images on social media is your responsibility and Munch It will not hold any responsibility.</li>
            <li>Allow interested parties to view results of your quiz, using the link you have shared on social media.</li>
            <li>Munch It cannot guarantee that your quiz results will be approved. Approvals are subject to relevance to the quiz context.</li>
          </ol>

          {/* Section 4 */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">4. How We Collect The Personal Data</h2>
          <p>The above-mentioned personally identifiable information is collected through multiple touch points while you interact with the Website. Our key modes of collection include:</p>
          <ol className="list-[lower-alpha] pl-5 space-y-1.5">
            <li><strong>Website registration and profile creation:</strong> When you register on the Website, use our services and become a Participant of Munch It Know Your Flavour Nigeria contest.</li>
            <li><strong>Forms, feedback tools, and surveys:</strong> Online web surveys that enable us to gather feedback regarding your preferences.</li>
            <li><strong>Interactions with content and features of the Website:</strong> For voting, registration and other activities provided by the Website and the data obtained will be used to provide better customer experience.</li>
          </ol>

          {/* Section 5 */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">5. Legal Basis For Processing</h2>
          <p>We will only use your Personal Data as allowed by law. As a part of the Munch It Know Your Flavour Website, we will use your Personal Data in the following circumstances applied under relevant laws:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Informed consent from you to use your data.</li>
            <li>Compliance with legal obligation.</li>
            <li>Legitimate interest in improving user experience and promoting safe interaction.</li>
            <li>Enhance our brand image, products, and services experience across our channels.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          </ul>
          <p>
            While we mostly collect and process your data with your consent, we may collect and process your data under any of the identified lawful basis depending on the circumstance. We do need your consent before we can process your data for purposes such as direct marketing communications. You are at liberty to withdraw your consent to such kinds of processing at any time. Where such withdrawal makes us unable to proceed with providing you with certain services, we will inform you accordingly.
          </p>
          <p>
            If you consent to it, we can also use your Personal Data (e.g., phone number) for direct marketing purposes, to send you online marketing campaigns and for targeted advertising. We may also use your Personal Data for commercial communication purposes with our users that have submitted an order on our website, since there is a legitimate interest in processing such data. In this regard, we may use your phone number for sending you our newsletter, new products, services, promotions, offers related to services or products that you purchased, unless you have opted out of receiving such commercial communication. In these cases, you can request the opt-out by contacting the Customer Care Team mentioned in the last section of this policy.
          </p>
          <p>
            We might collect publicly accessible information about you for the purpose of being able to conduct marketing activities. You can always opt out from receiving any marketing communications at any time by contacting our Customer Care Team.
          </p>

          {/* Section 6 */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">6. Data Storage and Protection</h2>
          <p>Data is stored securely and has administrative safeguards. Only authorized personnel and service providers may access the application and databases on which Personal Data is stored. Your Personal Data will be:</p>
          
          <p className="font-bold text-gray-800 mt-2">a. Retained for as long as necessary:</p>
          <p>
            We will retain your Personal Data only for as long as necessary to fulfil the purpose(s) for which it was collected and to comply with applicable laws. This means that we store your Personal Data for as long as it is required to deliver our Services to you, except where we have a lawful basis for saving it for an extended period. We also retain the Personal Data we need for the execution of contractual obligations, and/or as necessary for the establishment, exercise, or defense of legal claims and for audit and compliance purposes, for our legitimate business interests, and to prevent harm. Anonymized data may be retained for analytics or archival purposes.
          </p>

          <p className="font-bold text-gray-800 mt-2">b. Protection of your Personal Data and Security Measures:</p>
          <p>
            To prevent unauthorized access or disclosure, to maintain data accuracy, and to ensure the appropriate use of information, Munch It uses a range of physical, technical, and administrative, and procedural security measures to safeguard your Personal Data. These measures are aimed at preventing unauthorized access, collection, use, disclosure, copying, modification, or disposal. We safeguard and protect your data in a manner that complies with applicable data protection regulation Nigeria.
          </p>
          <p>
            Please recognize that protecting your Personal Data is also your responsibility. We ask you to be responsible for safeguarding your data and review who you share it with. Munch It cannot safeguard your personal data disclosed to other sources of which Munch It has no knowledge or control.
          </p>

          <p className="font-bold text-gray-800 mt-2">c. Information we share with third parties:</p>
          <p>
            We do not sell data. We may share data with trusted service providers for Website operations, analytics, or communication. If data is transferred outside Nigeria, we ensure it is protected in compliance with Nigerian laws. We do not routinely transfer your data inside or outside of Nigeria. Whenever we transfer your personal data to third parties, we ensure that a similar degree of protection is afforded to it. You hereby consent to such transfers where such adequate protection has been ensured for your data.
          </p>

          {/* Section 7 */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">7. Your Privacy Rights</h2>
          <p>In addition to being able to control the data you directly provide to us, you may exercise any of the below rights with respect to your data:</p>

          <p className="font-bold text-gray-800 mt-2">a. Withdrawal of Consent</p>
          <p>
            Participants may withdraw their consent and request the deletion of their personal data and/or their child's data at any time by contacting Munch It Customer Service. Upon verification, Munch It shall process the request in accordance with applicable data protection regulations.
          </p>

          <p className="font-bold text-gray-800 mt-2">b. Other Privacy Rights</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Request information about any of your personal data which we are processing, and request access to your personal information which we process.</li>
            <li>Request correction of personal information that we hold about you to make it more accurate or to reflect change in circumstances.</li>
            <li>Request us to refrain from doing certain things with your data or restrict the extent of our collection or processing of your data.</li>
            <li>Request partial or complete erasure of your personal information.</li>
            <li>Object to our processing of your personal information where we are processing your personal information for direct marketing purposes.</li>
            <li>Object to decisions being taken by automated means which produce legal effects concerning you or similarly significantly affect you.</li>
            <li>Request the transfer of your personal information to another party.</li>
          </ul>

          {/* Section 8 */}
          <h2 className="text-xs font-display font-black text-gray-900 uppercase mt-4">8. Cookies Policy</h2>
          <p>
            Cookies are small files placed on your computer's hard drive that enable the website or a digital application to identify your computer as you view different pages. Cookies allow websites and applications to store your preferences in order to present contents, options or functions that are specific to you. Like most interactive websites, our website uses cookies to enable the tracking of your activity for the duration of a session. Our website uses only encrypted session cookies which are erased either after a predefined timeout period or once the user logs out of the platform and closes the browser. Session cookies do not collect information from the user's computer. They will typically store information in the form of a session identification that does not personally identify the user.
          </p>

          {/* Section 10 - Contact */}
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
              By reading and/or accepting this privacy policy, you confirm that you have read, understood, and agreed to the policy terms & conditions.
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

export default PrivacyPage;
