import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Book, MessageSquare, AlertTriangle, ArrowRight } from 'lucide-react';
import ChatPreview from '../components/chat/ChatPreview';

const HomePage = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-navy-900 to-navy-800 text-black py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-black">
                Your AI Legal Assistant <span className="text-gold-400">At Your Service</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-lg ">
                Get instant legal information and guidance when you need it most. 
                AI Lawyer helps you understand your rights and navigate legal situations confidently.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Link
                  to="/chat"
                  className="bg-crimson-700 hover:bg-crimson-800 text-black px-6 py-3 rounded-md font-medium transition-colors duration-200 text-center"
                >
                 | Ask AI Lawyer Now |
                </Link>
                <Link
                  to="/about"
                  className="bg-transparent hover:bg-white/10 text-black border border-white/30 px-6 py-3 rounded-md font-medium transition-colors duration-200 text-center"
                >
                 | Learn More |
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <ChatPreview />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              How AI Lawyer Helps You
            </h2>
            <p className="text-lg text-slate-600">
              Our AI-powered legal assistant provides accurate information about laws and your rights,
              helping you navigate complex legal situations with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-crimson-700" />}
              title="Know Your Rights"
              description="Learn about your legal rights in various situations, from traffic stops to workplace disputes."
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-crimson-700" />}
              title="Voice Assistant"
              description="Ask questions naturally and get clear, concise answers using our NLP-powered interface."
            />
            <FeatureCard
              icon={<Book className="h-10 w-10 text-crimson-700" />}
              title="Legal Database"
              description="Access a comprehensive database of laws, regulations, and precedents across multiple jurisdictions."
            />
            <FeatureCard
              icon={<AlertTriangle className="h-10 w-10 text-crimson-700" />}
              title="Emergency Guidance"
              description="Get immediate guidance during critical situations like arrests or legal emergencies."
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              Real-World Applications
            </h2>
            <p className="text-lg text-slate-600">
              Discover how AI Lawyer can help you in various scenarios, from everyday legal questions
              to critical situations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <UseCaseCard
                key={index}
                title={useCase.title}
                description={useCase.description}
                image={useCase.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-navy-800 to-navy-700 text-black py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Legal Assistance?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Start using AI Lawyer today and gain confidence in your legal knowledge. 
            Ask your first question and experience the power of AI-powered legal assistance.
          </p>
          <Link
            to="/chat"
            className="inline-flex items-center space-x-2 bg-crimson-700 hover:bg-crimson-800 text-black px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            <span>Try AI Lawyer Now</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="font-serif text-xl font-semibold text-navy-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
};

const UseCaseCard = ({ title, description, image }: { title: string, description: string, image: string }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-navy-900 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
        <Link
          to="/chat"
          className="inline-flex items-center space-x-1 text-crimson-700 font-medium mt-4 hover:text-crimson-800 transition-colors duration-200"
        >
          <span>Ask about this</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

const useCases = [
  {
    title: "Traffic Stops",
    description: "Learn what to do when pulled over, your rights during searches, and how to handle potential violations.",
    image: "https://images.pexels.com/photos/1756957/pexels-photo-1756957.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    title: "Workplace Rights",
    description: "Understand employment laws, workplace discrimination, and how to address unfair treatment.",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    title: "Legal Emergencies",
    description: "Get immediate guidance during arrests, accidents, or other critical legal situations.",
    image: "https://images.pexels.com/photos/8108097/pexels-photo-8108097.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

export default HomePage;