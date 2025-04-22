import React from 'react';
import { Shield, BookOpen, MessageSquare, Globe, Zap, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-navy-800 text-black py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              About AI Lawyer
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6">
              We're revolutionizing legal assistance through advanced AI technology, 
              making legal information accessible to everyone when they need it most.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Our Mission" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900">
                Our Mission
              </h2>
              <p className="text-lg text-slate-700">
                At AI Lawyer, we believe that understanding your legal rights should be accessible to everyone. 
                Our mission is to democratize legal information through technology, helping people navigate 
                complex legal situations with confidence.
              </p>
              <p className="text-lg text-slate-700">
                We're not here to replace attorneys but to empower individuals with knowledge, 
                especially in situations where immediate guidance is needed and professional 
                legal help may not be readily available.
              </p>
              <div className="pt-4">
                <Link 
                  to="/chat" 
                  className="inline-block bg-navy-800 hover:bg-navy-900 text-gray-600 px-6 py-3 rounded-md font-medium transition-colors duration-200"
                >
                  Experience AI Lawyer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              How AI Lawyer Works
            </h2>
            <p className="text-lg text-slate-600">
              Our advanced AI technology leverages natural language processing and a comprehensive 
              legal database to provide you with accurate, relevant information.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-navy-100 text-navy-700 mb-6">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy-900 mb-3">Ask Naturally</h3>
              <p className="text-slate-600">
                Ask questions in plain language, just as you would speak to a person. Our NLP technology 
                understands context and intent.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gold-100 text-gold-700 mb-6">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy-900 mb-3">Instant Research</h3>
              <p className="text-slate-600">
                Our AI searches through millions of legal documents, statutes, and precedents to 
                find relevant information for your situation.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-crimson-100 text-crimson-700 mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy-900 mb-3">Clear Guidance</h3>
              <p className="text-slate-600">
                Receive concise, easy-to-understand information about your rights, obligations, 
                and potential next steps in your specific situation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              Key Features
            </h2>
            <p className="text-lg text-slate-600">
              AI Lawyer combines cutting-edge technology with comprehensive legal knowledge
              to provide an exceptional user experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-crimson-700" />}
              title="Real-time Assistance"
              description="Get immediate answers to your legal questions, any time of day or night, without waiting for appointments."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6 text-crimson-700" />}
              title="Comprehensive Coverage"
              description="Access information on a wide range of legal topics, from criminal law to consumer rights and traffic violations."
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6 text-crimson-700" />}
              title="Natural Conversation"
              description="Interact with AI Lawyer through natural language, just as you would speak to a human legal expert."
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6 text-crimson-700" />}
              title="Privacy-Focused"
              description="Your conversations are private and secure. We prioritize user confidentiality and data protection."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy-800 text-black py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience AI Lawyer?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start using our platform today and gain confidence in navigating legal situations.
              Ask your first question and see how AI Lawyer can help you.
            </p>
            <Link
              to="/chat"
              className="inline-block bg-crimson-700 hover:bg-crimson-800 text-white px-8 py-4 rounded-md font-medium transition-colors duration-200 text-lg"
            >
              Try AI Lawyer Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="flex space-x-4 p-6 bg-white rounded-lg shadow-md border border-slate-100">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="font-serif text-xl font-semibold text-navy-900 mb-2">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
};

export default AboutPage;