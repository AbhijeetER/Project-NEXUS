import './global.css';
import backDrop from "../src/assets/backdrop.mp4";

import { LayoutTextFlip } from './components/layout-text-flip';
import {motion} from 'motion/react';
export default function Hero(){
    const placeholders = [
        "What's the first rule of Fight Club?",
        "Who is Tyler Durden?",
        "Where is Andrew Laeddis Hiding?",
        "Write a Javascript method to reverse a string",
        "How to assemble your own PC?",
      ];
     

    return(
        <section className="relative w-full h-screen overflow-hidden">
        {/* Background Video */}
        <video
          src={backDrop}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="
            absolute inset-0 w-full h-full 
            object-cover 
            -z-10 
            brightness-[0.75]
          "
        />
  
        {/* Centered Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
  
        
         <h1 class="text-white text-4xl sm:text-5xl md:text-9xl font-bold tracking-tight 
       drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]
       transition-all duration-300 
       hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(255,255,255,1)]">
  Nexus.Ai
</h1>

         
            <br />
            <p></p>

          <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
        <LayoutTextFlip
          text=""
          words={["Welcome to Our Project","A New Nexus of Intelligence",
             "Autonomous reasoning from scratch",
              "Rooted. Adaptive. Independent",
              "A completely customizable architecture",
               
            "Built to think, adapt, and operate without external control.",
        "Indie-built LLM with Indigenous-informed design","Crafted with sovereignty in mind."]}
        />
      </motion.div>
  
        
  
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-b from-transparent to-[#0B1020] pointer-events-none" />

      </section>
    )
}