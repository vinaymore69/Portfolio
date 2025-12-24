import React from 'react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TermsConditions = () => {
  const titleRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    // Title animation
    gsap.fromTo(titleRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out"
      }
    );

    // Sections animation
    gsap.fromTo(sectionsRef.current,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionsRef.current[0],
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 font-geom">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600 font-geom">
            Last updated: January 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div ref={el => sectionsRef.current[0] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              By accessing and using this website (vinaymore.vercel.app), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div ref={el => sectionsRef.current[1] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-4 font-geom">
              Permission is granted to temporarily download one copy of the materials on Vinay More's Portfolio for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 font-geom">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </div>

          <div ref={el => sectionsRef.current[2] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              The materials on Vinay More's Portfolio are provided on an 'as is' basis. Vinay More makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </div>

          <div ref={el => sectionsRef.current[3] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Limitations</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              In no event shall Vinay More or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Vinay More's Portfolio, even if Vinay More or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </div>

          <div ref={el => sectionsRef.current[4] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Accuracy of Materials</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              The materials appearing on Vinay More's Portfolio could include technical, typographical, or photographic errors. Vinay More does not warrant that any of the materials on its website are accurate, complete, or current. Vinay More may make changes to the materials contained on its website at any time without notice.
            </p>
          </div>

          <div ref={el => sectionsRef.current[5] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Links</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              Vinay More has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Vinay More of the site. Use of any such linked website is at the user's own risk.
            </p>
          </div>

          <div ref={el => sectionsRef.current[6] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4 font-geom">
              All content on this website, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 font-geom">
              <li>Text, graphics, logos, images, and software</li>
              <li>Project descriptions and code samples</li>
              <li>Design elements and layout</li>
              <li>Resume and portfolio content</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4 font-geom">
              Are the property of Vinay More and are protected by copyright and other intellectual property laws.
            </p>
          </div>

          <div ref={el => sectionsRef.current[7] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">User Conduct</h2>
            <p className="text-gray-700 leading-relaxed mb-4 font-geom">
              When using our website, you agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 font-geom">
              <li>Use the website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any portion of the website</li>
              <li>Interfere with or disrupt the website's functionality</li>
              <li>Submit false or misleading information</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </div>

          <div ref={el => sectionsRef.current[8] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Contact Form and Communications</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              By submitting information through our contact form, you consent to receive communications from us. We reserve the right to respond to inquiries at our discretion and may not respond to all submissions.
            </p>
          </div>

          <div ref={el => sectionsRef.current[9] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Modifications</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              Vinay More may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </div>

          <div ref={el => sectionsRef.current[10] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
            </p>
          </div>

          <div ref={el => sectionsRef.current[11] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-geom"><strong>Email:</strong> vinaymore0110@gmail.com</p>
              <p className="font-geom"><strong>Website:</strong> vinaymore.vercel.app</p>
              <p className="font-geom"><strong>Location:</strong> Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-black text-black rounded-full hover:bg-black hover:text-white transition-colors font-geom font-bold"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;