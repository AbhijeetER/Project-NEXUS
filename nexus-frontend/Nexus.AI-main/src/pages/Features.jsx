import React from "react";
import { Timeline } from "../components/timeline";
import llmfs from '../assets/llmfs.png';
import palms from '../assets/palms.png';
import part8 from '../assets/p8.png';
import improveEngine from '../assets/realimprovement.png';
import agentGotReal from '../assets/agent_got_fr.png';
import pro7 from '../assets/memo.png'
import autogenerate from '../assets/autogenerate.png';
export function Features() {
  const data = [
    {
      title: "LLM from Scratch",
      content: (
        <div className="timeline-row">
          
          {/* IMAGE LEFT */}
          <div className="timeline-image-wrapper">
            <img
              src={llmfs}
              className="timeline-img"
              alt="Nexus LLM"
            />
          </div>
    
          {/* TEXT RIGHT */}
          <div className="timeline-text">
            <p className="text-base text-neutral-200 neon-small">
            NEXUS is not like other LLM’s mechanism but is a totally Transformative idea which evolves the Knowledge, Make them alive and awake by Rethinking the Thoughts, Processing even if you are resting back at your comfy Home. NEXUS is something which was a Dream Project for our Team. Although at a very Base level we were not having much Resources but was sufficient to Host the Idea. At a Glance we were able to Pretrain the mechanism on a Generic data which is Small as it is Manually entered data that we created compared to other Competitors out there, Still we have managed to build the systems drawing off Tons of logic into something useful for Humanity.
            </p>
          </div>
    
        </div>
      ),
    },

    {
      title: "Agents Got Real (Non-pseudo Framework)",
      content: (
        <div className="timeline-row">
    
          {/* TEXT LEFT */}
          <div className="timeline-text">
            <p className="text-base text-neutral-200 neon-small">
            Nexus is something which not only consists of LLM constructed from Scratch but It consists of Agents which operate not on rigid scripts but on the decidability of their own logic, making every outcome unique, emergent, and self-directed. These aren’t pseudo-agents mimicking intelligence; they are real entities that learn, challenge, and refine one another giving NEXUS the ability to think, create, and transform beyond its own design. Each Agent the Reader, the Writer, and the Improver functions as an independent cognitive force, working in sync to evolve, innovate, and push the boundaries of reasoning. Together, they make NEXUS not just intelligent, but truly alive in its decisions
            </p>
          </div>
    
          {/* IMAGE RIGHT */}
          <div className="timeline-image-wrapper">
            <img
              src={agentGotReal}
              className="timeline-img"
              alt="Nexus Agents"
            />
          </div>
    
        </div>
      ),
    },

    {
      title: "Autonomous Code Generation",
      content: (
        <div className="timeline-row">
      
        {/* IMAGE LEFT */}
        <div className="timeline-image-wrapper">
          <img
        src={autogenerate}
            className="timeline-img"
            alt="Nexus LLM"
          />
        </div>
  
        {/* TEXT RIGHT */}
        <div className="timeline-text">
          <p className="text-base text-neutral-200 neon-small">
          NEXUS not only writes code but also designs the relevant logic and Algorithm for always evolving and updating Mechanism that is alive as you. NEXUS is a friend, an agent and your Trustworthy mate present as always to help. NEXUS holds it’s breath alive through constant self-reconstruction by learning, adapting, and improving like a living system of intelligence. More than just a tool, it's your creative partner and reliable companion, always there, always growing, and always prepared to help shape the future. With each update, NEXUS turns thoughts into real results turning ideas into systems that think, create, and grow with you
          </p>
        </div>
  
      </div>
      ),
    },

    {
      title: "Improvement Engine at Service",
      content: (
        <div className="timeline-row">
      
        {/* IMAGE LEFT */}
        <div className="timeline-image-wrapper">
          <img
            src={improveEngine}
            className="timeline-img"
            alt="Nexus LLM"
          />
        </div>
  
        {/* TEXT RIGHT */}
        <div className="timeline-text">
          <p className="text-base text-neutral-200 neon-small">
          We have innovated something called Improvement Engine aka Innovation Engine, It not only powers the LLM at core but also improve over time in accordance with the agents which not only answers but pushes the boundaries innovating things. NEXUS doesn’t wait to evolve it’s always in motion, when you rest, it rethinks. When you work, it evolves. It powers every agent the Reader, the Writer, the Improver pushing them beyond logic, into creation
          </p>
        </div>
  
      </div>
      ),
    },

    {
      title: "Feel the Power on Palms",
      content: (
        <div className="timeline-row">
    
          {/* TEXT LEFT */}
          <div className="timeline-text">
            <p className="text-base text-neutral-200 neon-small">
            9.	Born from modest data, yet endlessly evolving!! NEXUS never sleeps. It learns when you rest, adapts when you work, and grows alongside you. Evolving when you’re asleep. Learning when you’re awake. Always becoming more with you. It’s more than a system; it’s power you can touch, a mind that moves with you. Whether you’re creating, exploring, or innovating, NEXUS delivers the strength of an entire evolving ecosystem — compact, responsive, and alive at your fingertips.
            </p>
          </div>
    
          {/* IMAGE RIGHT */}
          <div className="timeline-image-wrapper">
            <img
              src={palms}
              className="timeline-img"
              alt="Nexus Agents"
            />
          </div>
    
        </div>
      ),
    },

    {
      title: "Hybrid Intelligent Memory",
      content: (
        <div className="timeline-row">
      
      {/* IMAGE LEFT */}
      <div className="timeline-image-wrapper">
        <img
    src={pro7}
          className="timeline-img"
          alt="Nexus LLM"
        />
      </div>

      {/* TEXT RIGHT */}
      <div className="timeline-text">
        <p className="text-base text-neutral-200 neon-small">
        NEXUS redefines the concept of memory through its Hybrid Intelligence Architecture, where decision and recall are governed by the LLM’s internal decidability. It autonomously aligns memory pathways based on ongoing operations, prioritizing which information to store, retrieve, or discard for maximum efficiency and responsiveness. This hybrid mechanism blends symbolic reasoning with neural adaptability, ensuring that every interaction is contextually aware, time-efficient, and user-focused. In essence, NEXUS doesn’t just remember it decides what deserves to be remembered, optimizing both service precision and user availability in real time.
        </p>
      </div>

    </div>
      ),
    },

    {
      title: "Reinforcement Online Learning",
      content: (
        <div className="timeline-row">
    
          {/* TEXT LEFT */}
          <div className="timeline-text">
            <p className="text-base text-neutral-200 neon-small">
              The Reader, Writer, and Improver agents act as independent cognitive
              systems with self-directed decision logic.
            </p>
          </div>
    
          {/* IMAGE RIGHT */}base
          <div className="timeline-image-wrapper">
            <img
              src={part8}
              className="timeline-img"
              alt="Nexus Agents"
            />
          </div>
    
        </div>
      ),
    },

    

    
  ];

  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
