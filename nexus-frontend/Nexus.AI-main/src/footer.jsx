"use client";
import sarvdeep from './assets/sarvdeep.png'
import Rishab from './assets/rishab.png'
import Priyanshu from './assets/priyanshu.png';
import Abhijeet from './assets/abhijeet.png';

import { Github } from "lucide-react";
import { Boxes } from "./components/background-boxes";
import { AnimatedTooltip } from "./components/animated-tooltip"; //make sure this path is correct
import "../src/global.css";


const teamMembers = [
  { 
    id: 1,
    name: "Suryash Khare", 
    designation: "LLM architect",
    image: "https://cdn.pixabay.com/photo/2018/06/17/20/35/chain-3481377_1280.jpg",
    linkedin: "https://in.linkedin.com/in/suryansh-khare-5a95b3215"
  },
  { 
    id: 2,
    name: "Rishabh Srivastava", 
    designation: "ML Engineer",
    image: "https://avatar.iran.liara.run/public/31",
    linkedin: "https://www.linkedin.com/in/rishabh-srivastava-796b60244/ "
  },
  { 
    id: 3,
    name: "Sarvpreet Kaur", 
    designation: "Research",
    image: "https://avatar.iran.liara.run/public/64",
    linkedin: "https://www.linkedin.com/in/sarvpreet-kaur-a230702a1/ "
  },
  { 
    id: 4,
    name: "Priyanshu Kumar", 
    designation: "AgentAI head",
    image: "https://avatar.iran.liara.run/public/3",
    linkedin: "https://www.linkedin.com/in/priyanshu-kumar-980b50179/ "
  },
  { 
    id: 5,
    name: "Abhijeet", 
    designation: "UI and Frontend",
    image: "https://avatar.iran.liara.run/public/28",
    linkedin: "https://linkedin.com/in/research-example"
  }
];

export const Footer = () => {
  return (
    <footer className="relative overflow-visible bg-gray-900 border-t border-gray-700 text-gray-300">
      
      {/* Background Boxes */}
      <div className="absolute inset-0 w-full h-full">
        <Boxes />
      </div>

      <div className="absolute inset-0 w-full h-full bg-slate-900 z-[1] pointer-events-none [mask-image:radial-gradient(transparent,white)]" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 py-12">

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* GitHub Link */}
          <a
            href="https://github.com/your-repo-link-here"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-all duration-300"
          >
            <div className="relative">
              <Github className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 blur-xl bg-cyan-400 opacity-0 group-hover:opacity-40 transition-opacity" />
            </div>
            <span className="font-mono text-sm">Repo Link</span>
          </a>

          {/* Center Text */}
          <div className="text-center">
            <p className="text-gray-400 text-sm font-mono mb-1">
              © 2025 Project-Nexus Initiative
            </p>
            <p className="text-xs text-gray-500">
              Synthesizing tomorrow • Powered by distributed neural autonomy
            </p>
          </div>

          {/* ✅ Animated Tooltip Replaces Connect Button */}
          <div className="relative flex items-center justify-center">
            {/* Make the tooltip avatar images clickable links */}
            <AnimatedTooltip
              items={teamMembers.map((m) => ({
                ...m,
                id: m.id,
                name: m.name,
                designation: m.designation,
                image: m.image,
                link: m.linkedin         // ✅ we’ll use this in a wrapper link
              }))}
            />
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-500 font-mono">
            Fabricated within the Nexus grid • Indigenous AI from zero
          </p>
        </div>


      </div>
    </footer>
  );
};
