import { Link } from 'react-router-dom';

export default function Tabs() {
  return (
    <div
      className="
        w-full 
        flex flex-col md:flex-row 
        md:justify-center
        md:space-x-8 
        space-y-6 md:space-y-0 
        p-5 
      "
      style={{ backgroundColor: '#0F172B' }}
    >
      {[
        {
          title: 'LLM',
          desc: 'Work and customize the LLM built for customization.',
          // Simple path for internal
          link: '/chat', 
          gradient: 'from-[#0a1b3f] via-[#102a5c] to-[#1e3a8a]',
        },
        {
          title: 'Agentic AI',
          desc: 'Get to use and work with advanced indie agents.',
          // Full URL for external
          link: 'https://agentwithoutimproverwith-faiss-jaoks7gsvwlw2qnevmmmtz.streamlit.app/', 
          gradient: 'from-[#0b1220] via-[#1e3a8a] to-[#3b82f6]',
        },
        {
          title: 'AgentAI with Improver',
          desc: 'Get to use and work with complete indie agents.',
          // Query string for internal
          link: 'https://agentwithimproverandfaiss-bhswws8o7b8pmcbhjda2tt.streamlit.app/', 
          gradient: 'from-[#0a1f2f] via-[#1e3f5b] to-[#772530]',
        },
      ].map((card, i) => {
        // 1. Check if it is an external link
        const isExternal = card.link.startsWith('http');
        
        // 2. Define common button styles
        const btnClasses = "px-4 py-2 bg-black text-white rounded-lg shadow-sm hover:opacity-80 w-fit";

        return (
          <span
            key={i}
            className={`
              w-full md:w-auto
              max-w-[350px]
              mx-auto
              p-6 
              rounded-2xl
              bg-gradient-to-br ${card.gradient}
              flex flex-col gap-4
              transition-transform duration-300
              hover:scale-105 hover:shadow-xl
            `}
          >
            {/* Title */}
            <h2 className="font-bold font-serif text-3xl text-white">
              {card.title}
            </h2>

            {/* Description */}
            <p className="text-left text-red-300 hidden md:block">
              {card.desc}
            </p>

            {/* Conditional Rendering for Button */}
            {isExternal ? (
              // EXTERNAL LINK (Use <a>)
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className={btnClasses}
              >
                Try Our Model
              </a>
            ) : (
              // INTERNAL LINK (Use <Link>)
              <Link
                // Logic: If it's just '/chat', go there. If it's a query '?', append it to '/chat'
                to={card.link.startsWith('?') ? `/chat${card.link}` : card.link}
                className={btnClasses}
              >
                Try Our Model
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}