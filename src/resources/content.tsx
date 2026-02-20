import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Vinay",
  lastName: "More",
  name: `Vinay More`,
  role: "Mobile Application Developer & Web Developer",
  avatar: "/images/avatar.jpg",
  email: "vinayprakashmore@gmail.com",
  location: "Asia/Kolkata", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: [ "C / C++","JAVA","PHP","HTML/CSS","JavaScript","ReactJS","NextJS","Flutter(Dart)","MySQL","SQLite","ThreeJS"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/vinaymore69",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/vinay--more",
    essential: true,
  },
  // {
  //   name: "Instagram",
  //   icon: "instagram",
  //   link: "https://www.instagram.com/once_ui/",
  //   essential: false,
  // },
  // {
  //   name: "Threads",
  //   icon: "threads",
  //   link: "https://www.threads.com/@once_ui",
  //   essential: true,
  // },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Computer Engineering student passionate about coding.</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Codeterna Pvt. Ltd. & Red Box Agency</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/maha-krushi-mittra",
  },
  subline: (
    <>
    I'm Vinay, a Mobile Application Developer & Web Developer at <Text as="span" size="xl" weight="strong">Codeterna Pvt. Ltd. & Red Box Agency</Text>, where I craft intuitive <br /> industry-ready applications. Always eager to learn and take on new challenges.
</>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com/vinaymore69",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        🚀 I’m Vinay More, a Computer Engineer passionate about AI, Machine Learning, and Full-Stack Development. A Diploma graduate from Vidyalankar Polytechnic and currently pursuing B.E. at Xavier Institute of Technology, I’ve worked at Codeterna Pvt. Ltd. and Red Box Agency on mobile (Flutter, iOS) and web development projects.
<br/>
<br/>
💡 With 15+ industry certifications (Microsoft & Google Cloud AI, PHP, WhatsApp API) and experience as a GSSoC 2025 Tech Contributor, I focus on building scalable, user-centric solutions that drive real-world impact.
<br/>
<br/>
Let’s connect and build innovative tech together.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Codeterna Private Limited",
        timeframe: "Nov 2025 - Present",
        role: "Mobile Application Developer (Full-time)",
        achievements: [
          <>
            Developing cross-platform mobile applications using Flutter and iOS, focusing on performance optimization and user experience.
          </>,
          <>
            Previously worked as Mobile Application Developer Intern (Sep 2025 - Nov 2025) and Full-time Developer (Jul 2025 - Aug 2025), gaining comprehensive experience in mobile app development lifecycle.
          </>,
        ],
        images: [],
      },
      {
        company: "Skill Stream",
        timeframe: "May 2024 - Present",
        role: "Video Editor (Part-time)",
        achievements: [
          <>
            Creating engaging video content and managing video editing projects for various clients.
          </>,
          <>
            Specializing in content creation and post-production workflows.
          </>,
        ],
        images: [],
      },
      {
        company: "Red Box Agency",
        timeframe: "Mar 2024 - Present",
        role: "Web Developer & Creative Head (Part-time)",
        achievements: [
          <>
            Currently leading web development projects and creative initiatives (Aug 2025 - Present).
          </>,
          <>
            Previously worked on website development and social media marketing (Jul 2024 - Aug 2025), developing comprehensive digital marketing strategies (Jun 2024 - Jul 2024), and frontend development (Apr 2024 - Jun 2024).
          </>,
          <>
            Proficient in WordPress, HTML/CSS/JS, SEO, and social media strategy development.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Xavier Institute Of Engineering",
        description: <>Bachelor of Engineering in Computer Engineering (Aug 2025 - Present)</>,
      },
      {
        name: "Vidyalankar Polytechnic",
        description: <>Diploma in Computer Engineering (Sep 2022 - Jun 2025) - Grade: 91.61%</>,
      },
      {
        name: "Malti Jayant Dalal High School",
        description: <>Secondary School Certificate (Jun 2012 - Jun 2022) - Grade: 87.20%</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Frontend Development",
        description: (
          <>Building responsive and interactive user interfaces with modern web technologies.</>
        ),
        tags: [
          { name: "HTML5", icon: "html" },
          { name: "CSS3", icon: "css" },
          { name: "JavaScript", icon: "javascript" },
          { name: "React.js", icon: "react" },
          { name: "Tailwind CSS", icon: "tailwind" },
        ],
        images: [],
      },
      {
        title: "Backend Development",
        description: (
          <>Creating scalable server-side applications and RESTful APIs.</>
        ),
        tags: [
          { name: "Node.js", icon: "nodejs" },
          { name: "Express.js", icon: "express" },
          { name: "PHP", icon: "php" },
        ],
        images: [],
      },
      {
        title: "Mobile Development",
        description: (
          <>Developing cross-platform mobile applications with Flutter and iOS.</>
        ),
        tags: [
          { name: "Flutter", icon: "flutter" },
          { name: "Dart", icon: "dart" },
          { name: "React Native", icon: "react" },
          { name: "iOS", icon: "apple" },
        ],
        images: [],
      },
      {
        title: "Database & Tools",
        description: (
          <>Managing data with modern databases and development tools.</>
        ),
        tags: [
          { name: "PostgreSQL", icon: "postgresql" },
          { name: "MySQL", icon: "mysql" },
          { name: "Supabase", icon: "supabase" },
          { name: "WordPress", icon: "wordpress" },
          { name: "Git", icon: "github" },
        ],
        images: [],
      },
    ],
  },
  honors: {
    display: true,
    title: "Honors & Awards",
    awards: [
      {
        icon: "🏅",
        title: "Selected for SIH 2025 – Internal Hackathon Qualifier",
        organization: "Smart India Hackathon",
        year: "2025",
        description: <>Successfully qualified through the internal hackathon round for Smart India Hackathon 2025, demonstrating innovative problem-solving skills and technical expertise in developing solutions for real-world challenges.</>,
      },
      {
        icon: "🚀",
        title: "Winner – Sprint Nova 6-Hour Hackathon",
        organization: "Xavier Institute of Engineering",
        year: "2025",
        description: <>Won the Sprint Nova 6-hour hackathon competition, demonstrating rapid prototyping skills, innovative problem-solving, and technical excellence under time constraints.</>,
      },
      {
        icon: "🏆",
        title: "Campus Ambassador – GSSoC 2025",
        organization: "GirlScript Foundation",
        year: "Jun 2025",
        description: <>Selected as the official Campus Ambassador for GirlScript Summer of Code 2025, promoting open-source contributions and conducting awareness sessions within the college community.</>,
      },
      {
        icon: "🥈",
        title: "Runner Up – Final Year Project Exhibition",
        organization: "Vidyalankar Polytechnic",
        year: "Apr 2025",
        description: <>Secured Runner Up position in the Final Year Project Exhibition for the Department of Computer Engineering, recognized for innovation and technical excellence.</>,
      },
      {
        icon: "🏆",
        title: "First Prize - 10th Standard Academic Excellence",
        organization: "Malti Jayant Dalal High School",
        year: "2022",
        description: <>Achieved First Prize for outstanding academic performance in 10th Standard examinations, maintaining top position in the class.</>,
      },
      {
        icon: "📚",
        title: "Academic Excellence - MSBTE Summer 2023",
        organization: "Vidyalankar Polytechnic",
        year: "2023",
        description: <>Achieved 86.75% in the Summer 2023 examination conducted by MSBTE, recognized for outstanding academic performance in Class CO5IC Division C.</>,
      },
      {
        icon: "🥇",
        title: "First Rank In Class - MSBTE Winter 2022",
        organization: "Vidyalankar Polytechnic",
        year: "2022",
        description: <>Secured 1st position in Class CO3IC Division C with 86.71% in the Winter 2022 examination conducted by MSBTE.</>,
      },
      {
        icon: "🥉",
        title: "Second Runner-Up – TechSpardha 2024-25",
        organization: "Vidyalankar Polytechnic",
        year: "2024",
        description: <>Awarded Second Runner-Up at TechSpardha 2024-25, an inter-department technical competition organized by TechShala, recognized for outstanding performance in a competitive tech environment.</>,
      },
      {
        icon: "🤗",
        title: "Appreciation for Creative Sketches – Alila Competition",
        organization: "Vidyalankar Polytechnic",
        year: "2022",
        description: <>Received appreciation for showcasing creative sketching skills under the banner of Alila – Surprisingly Charming, a creative initiative to spark imagination and artistic expression.</>,
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
