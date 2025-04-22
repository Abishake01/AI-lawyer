import React, { useState } from 'react';
import { BookOpen, FileText, Search, ChevronDown, ChevronUp, Link2 } from 'lucide-react';

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const filteredResources = resources.filter(
    resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const categories = Array.from(
    new Set(resources.map(resource => resource.category))
  );

  const toggleCategory = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-navy-800 text-black py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Legal Resources
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse our comprehensive collection of legal guides, documents, and articles
              to better understand your rights and legal processes.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-2 flex items-center shadow-lg">
            <Search className="h-5 w-5 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow p-2 outline-none text-navy-900"
            />
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          {/* Categories */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">
              Resource Categories
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`p-4 rounded-lg flex justify-between items-center transition-colors duration-200 ${
                    activeCategory === category
                      ? 'bg-navy-800 text-white'
                      : 'bg-white text-navy-900 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-medium">{category}</span>
                  {activeCategory === category ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Resource Listings */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">
              {searchTerm 
                ? `Search Results: ${filteredResources.length} resources found` 
                : activeCategory 
                  ? `${activeCategory} Resources` 
                  : 'All Resources'
              }
            </h2>
            
            {filteredResources.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-6">
                {filteredResources
                  .filter(resource => !activeCategory || resource.category === activeCategory)
                  .map((resource, idx) => (
                    <ResourceCard key={idx} resource={resource} />
                  ))}
              </div>
            ) : (
              <div className="bg-slate-50 p-8 rounded-lg text-center">
                <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-navy-900 mb-2">No resources found</h3>
                <p className="text-slate-600">
                  Try adjusting your search term or category selection.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Disclaimer */}
      <section className="bg-slate-100 py-8">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h3 className="font-serif text-xl font-semibold text-navy-900 mb-3">
              Important Disclaimer
            </h3>
            <p className="text-slate-700">
              The resources provided on this page are for informational purposes only and do not 
              constitute legal advice. Every legal situation is unique, and the information 
              presented here may not apply to your specific circumstances. Always consult with a 
              qualified attorney for advice tailored to your situation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

interface Resource {
  title: string;
  category: string;
  description: string;
  type: string;
  url: string;
}

const ResourceCard = ({ resource }: { resource: Resource }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="border-b border-slate-200 p-4 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center">
          {resource.type === 'guide' && <BookOpen className="h-5 w-5 text-crimson-700 mr-2" />}
          {resource.type === 'document' && <FileText className="h-5 w-5 text-navy-700 mr-2" />}
          {resource.type === 'link' && <Link2 className="h-5 w-5 text-gold-700 mr-2" />}
          <span className="font-medium text-slate-600">{resource.category}</span>
        </div>
        <span className="text-xs uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-1 rounded">
          {resource.type}
        </span>
      </div>
      
      <div className="p-5">
        <h3 className="font-serif text-xl font-semibold text-navy-900 mb-2">
          {resource.title}
        </h3>
        <p className="text-slate-600 mb-4">
          {resource.description}
        </p>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-crimson-700 hover:text-crimson-800 font-medium"
        >
          View Resource
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

const resources: Resource[] = [
  {
    title: "Know Your Rights During a Traffic Stop",
    category: "Traffic Law",
    description: "A comprehensive guide to your legal rights when pulled over by law enforcement, including what to say and what not to say.",
    type: "guide",
    url: "#"
  },
  {
    title: "Understanding Search and Seizure Laws",
    category: "Criminal Law",
    description: "Learn about the Fourth Amendment protections against unreasonable searches and seizures, including when police can search your property.",
    type: "guide",
    url: "#"
  },
  {
    title: "Miranda Rights Explained",
    category: "Criminal Law",
    description: "A detailed explanation of your Miranda rights, when they apply, and what happens if they're not read to you.",
    type: "document",
    url: "#"
  },
  {
    title: "What To Do If You're Wrongfully Arrested",
    category: "Criminal Law",
    description: "Step-by-step guidance on how to handle a wrongful arrest situation and protect your legal rights.",
    type: "guide",
    url: "#"
  },
  {
    title: "Your Rights in the Workplace",
    category: "Employment Law",
    description: "An overview of your legal rights as an employee, including protections against discrimination and harassment.",
    type: "guide",
    url: "#"
  },
  {
    title: "Legal Aid Resources Directory",
    category: "Legal Services",
    description: "A comprehensive list of free and low-cost legal aid services available nationwide, organized by state.",
    type: "link",
    url: "#"
  },
  {
    title: "How to File a Police Complaint",
    category: "Civil Rights",
    description: "Instructions on how to file a formal complaint against law enforcement officers for misconduct or rights violations.",
    type: "document",
    url: "#"
  },
  {
    title: "Understanding Probable Cause",
    category: "Criminal Law",
    description: "An explanation of what constitutes 'probable cause' for arrests and searches, with real-world examples.",
    type: "guide",
    url: "#"
  },
  {
    title: "Tenant Rights and Eviction Processes",
    category: "Housing Law",
    description: "Learn about your rights as a tenant, proper eviction procedures, and how to address illegal eviction attempts.",
    type: "guide",
    url: "#"
  },
  {
    title: "Consumer Protection Laws Overview",
    category: "Consumer Rights",
    description: "Summary of key consumer protection laws that safeguard you against unfair business practices and fraud.",
    type: "document",
    url: "#"
  }
];

export default ResourcesPage;