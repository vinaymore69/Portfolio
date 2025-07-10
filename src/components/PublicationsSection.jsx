import React from 'react';

const PublicationsSection = () => {
  const publications = [
    {
      title: "SanChi: Empowerment Through Education (Vidyalankar Volunteering Committee)",
      journal: "International Journal of Research Publication and Reviews",
      date: "Jan 12, 2025",
      description: "SanChi is a web-based volunteering-driven educational platform developed under the Vidyalankar Volunteering Committee, focusing on Girls' Education, Digital Literacy, Health Awareness, and more. This paper presents the design, development, and social impact of SanChi, including its multilingual support and offline learning features. The project was built using HTML, CSS, JavaScript, Express.js, and PostgreSQL following the Scrum Agile methodology.",
      technologies: ["HTML", "CSS", "JavaScript", "Express.js", "PostgreSQL", "Scrum Agile"],
      link: "https://ijrpr.com/uploads/V6ISSUE3/IJRPR39663.pdf",
      type: "Research Paper",
      status: "Published",
      icon: "📄"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 font-poppins">Publications</h2>
        <p className="text-lg text-gray-600 font-poppins-bold">Research contributions and academic publications</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {publications.map((publication, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Publication Icon & Status */}
              <div className="flex-shrink-0 flex flex-col items-center lg:items-start">
                <div className="text-6xl mb-4">{publication.icon}</div>
                <div className="flex flex-col items-center lg:items-start space-y-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {publication.status}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {publication.type}
                  </span>
                </div>
              </div>

              {/* Publication Details */}
              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2 font-poppins leading-tight text-gray-900">
                    {publication.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <p className="text-lg font-semibold text-blue-600 mb-1 sm:mb-0">
                      {publication.journal}
                    </p>
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                      {publication.date}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6 text-base">
                  {publication.description}
                </p>

                {/* Technologies Used */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Technologies & Methodologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {publication.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={publication.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-poppins-bold text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </a>
                  <a
                    href="/project"
                    className="inline-flex items-center justify-center px-6 py-3 border border-black text-black rounded-full hover:bg-black hover:text-white transition-colors font-poppins-bold text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Project
                  </a>
                </div>
              </div>
            </div>

            {/* Publication Metrics */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">2025</div>
                  <div className="text-sm text-gray-600">Publication Year</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">IJRPR</div>
                  <div className="text-sm text-gray-600">Journal</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">Open Access</div>
                  <div className="text-sm text-gray-600">Availability</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold mb-4 font-poppins">Interested in Collaboration?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            I'm always open to research collaborations, academic discussions, and contributing to impactful projects. 
            Let's connect and explore opportunities together.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-poppins-bold"
          >
            Get In Touch
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PublicationsSection;