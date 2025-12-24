import React from 'react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 font-geom">
            Last updated: January 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div ref={el => sectionsRef.current[0] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Introduction</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              Welcome to Vinay More's Portfolio ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website vinaymore.vercel.app, including any other media form, media channel, mobile website, or mobile application related or connected thereto.
            </p>
          </div>

          <div ref={el => sectionsRef.current[1] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 font-geom">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4 font-geom">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 font-geom">
              <li>Fill out our contact form</li>
              <li>Subscribe to our newsletter</li>
              <li>Download our resume or portfolio materials</li>
              <li>Interact with our website features</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6 font-geom">Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed font-geom">
              When you visit our website, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
            </p>
          </div>

          <div ref={el => sectionsRef.current[2] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4 font-geom">
              We use the information we collect in the following ways:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 font-geom">
              <li>To respond to your inquiries and provide customer support</li>
              <li>To send you updates about our projects and services</li>
              <li>To improve our website and user experience</li>
              <li>To analyze website usage and trends</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div ref={el => sectionsRef.current[3] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy. We may share your information with trusted third parties who assist us in operating our website, conducting our business, or serving our users.
            </p>
          </div>

          <div ref={el => sectionsRef.current[4] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Data Security</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </div>

          <div ref={el => sectionsRef.current[5] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              Our website may use cookies and similar tracking technologies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect the functionality of our website.
            </p>
          </div>

          <div ref={el => sectionsRef.current[6] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4 font-geom">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 font-geom">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to the processing of your personal information</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </div>

          <div ref={el => sectionsRef.current[7] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-geom"><strong>Email:</strong> vinaymore0110@gmail.com</p>
              <p className="font-geom"><strong>Website:</strong> vinaymore.vercel.app</p>
              <p className="font-geom"><strong>Location:</strong> Mumbai, Maharashtra, India</p>
            </div>
          </div>

          <div ref={el => sectionsRef.current[8] = el} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-geom">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed font-geom">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy.
            </p>
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

export default PrivacyPolicy;