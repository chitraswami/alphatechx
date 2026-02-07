import React from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  CogIcon,
  CodeBracketIcon,
  ServerIcon,
  BuildingOfficeIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  icon: React.ComponentType<any>;
  expertise: string[];
  color: string;
}

const About: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Chitralekha Swami",
      role: "Founder & CEO",
      description: "DevOps Architect and visionary leader driving AlphaTechx's mission to democratize AI technology across India. With extensive experience in cloud architecture and business strategy, Chitralekha leads our innovation initiatives.",
      icon: UserIcon,
      expertise: ["DevOps Architecture", "Cloud Strategy", "Business Leadership", "AI Innovation"],
      color: "from-blue-500 to-purple-600"
    },
    {
      name: "Sandeep Kumar",
      role: "Co-Founder & CTO",
      description: "Engineering DevOps Manager and technology architect responsible for our cutting-edge AI solutions. Sandeep oversees all technical development and ensures our platform delivers exceptional performance.",
      icon: CogIcon,
      expertise: ["Engineering Management", "DevOps", "System Architecture", "AI Development"],
      color: "from-purple-500 to-pink-600"
    },
    {
      name: "Ajay Sharma",
      role: "DevOps Engineer",
      description: "Infrastructure specialist ensuring seamless deployment and scalability of our AI solutions. Ajay manages our cloud infrastructure and maintains the reliability of our production systems.",
      icon: ServerIcon,
      expertise: ["Cloud Infrastructure", "CI/CD Pipelines", "Monitoring", "Security"],
      color: "from-green-500 to-teal-600"
    },
    {
      name: "Punit Swami",
      role: "DevOps Engineer",
      description: "Automation expert focused on streamlining our development processes and ensuring optimal system performance. Punit specializes in containerization and orchestration technologies.",
      icon: ServerIcon,
      expertise: ["Automation", "Containerization", "Kubernetes", "Performance Optimization"],
      color: "from-orange-500 to-red-600"
    },
    {
      name: "Gagan Swami",
      role: "Developer",
      description: "Full-stack developer creating intuitive user experiences and robust backend systems. Gagan brings our AI solutions to life through clean, efficient code and innovative user interfaces.",
      icon: CodeBracketIcon,
      expertise: ["Full-Stack Development", "React", "Node.js", "Database Design"],
      color: "from-indigo-500 to-blue-600"
    }
  ];

  const companyValues = [
    {
      icon: LightBulbIcon,
      title: "Innovation First",
      description: "We push the boundaries of AI technology to create solutions that transform businesses."
    },
    {
      icon: ShieldCheckIcon,
      title: "Trust & Security",
      description: "Your data security and privacy are our top priorities in everything we build."
    },
    {
      icon: RocketLaunchIcon,
      title: "Growth Focused",
      description: "We're committed to helping Indian businesses scale and succeed with AI."
    },
    {
      icon: BuildingOfficeIcon,
      title: "Local Expertise",
      description: "Deep understanding of the Indian market with global technology standards."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AlphaTechx</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to democratize AI technology across India, empowering businesses 
              of all sizes to harness the power of artificial intelligence for growth and innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in the heart of India's tech hub, Gurgaon, AlphaTechx was born from a vision 
                  to bridge the gap between cutting-edge AI technology and practical business solutions.
                </p>
                <p>
                  Our founders, with their extensive experience in DevOps architecture and engineering 
                  management, recognized that while AI technology was advancing rapidly, many Indian 
                  businesses were still struggling to implement and benefit from these innovations.
                </p>
                <p>
                  Today, we're proud to serve businesses across India, from startups to enterprises, 
                  helping them transform their operations with AI-powered solutions that are both 
                  sophisticated and accessible.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-blue-100 leading-relaxed">
                  To make AI technology accessible, affordable, and actionable for every Indian business, 
                  enabling them to compete globally while staying rooted in local values and understanding.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm text-blue-200">Businesses Served</div>
                  </div>
      <div className="text-center">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm text-blue-200">Support Available</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at AlphaTechx
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The brilliant minds behind AlphaTechx's innovative AI solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Profile Header */}
                <div className={`bg-gradient-to-br ${member.color} p-6 text-white relative`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <member.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{member.name}</h3>
                      <p className="text-white/90 font-medium">{member.role}</p>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {member.description}
                  </p>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join hundreds of Indian businesses already benefiting from our AI solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                Get Started Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Contact Our Team
              </motion.button>
            </div>
          </motion.div>
      </div>
      </section>
    </div>
  );
};

export default About; 