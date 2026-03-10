import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ScrollPath() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const ballY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto py-24 flex">
      {/* Left Axis */}
      <div className="w-16 md:w-32 relative flex justify-center shrink-0">
         <div className="absolute top-0 bottom-32 w-[1px] bg-gradient-to-b from-[var(--bg-color)] via-[var(--border-color)] to-[var(--bg-color)]"></div>
         <motion.div 
            style={{ top: ballY }}
            className="absolute shrink-0 w-3 h-3 rounded-full bg-[#2f81f7] shadow-[0_0_15px_rgba(47,129,247,0.8)] -ml-[1px] z-10"
         />
      </div>
      
      {/* Content Nodes */}
      <div className="flex flex-col gap-32 pb-32 w-full pt-10">
         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.7 }}
           className="relative"
         >
            <h3 className="text-3xl lg:text-4xl font-display font-medium mb-4 text-[var(--text-color)] tracking-tight">
                <span className="font-cursive text-[#2f81f7] pr-3 font-normal text-5xl">01.</span> Analyze
            </h3>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-xl">
               Deconstruct complex trends in AI engineering, tech ecosystems, and business architecture into first principles.
            </p>
         </motion.div>
         
         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.7 }}
           className="relative"
         >
            <h3 className="text-3xl lg:text-4xl font-display font-medium mb-4 text-[var(--text-color)] tracking-tight">
                <span className="font-cursive text-[#2f81f7] pr-3 font-normal text-5xl">02.</span> Synthesize
            </h3>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-xl">
               Connect the dots across disparate domains. Weave isolated insights into comprehensive mental models and frameworks.
            </p>
         </motion.div>
         
         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.7 }}
           className="relative"
         >
            <h3 className="text-3xl lg:text-4xl font-display font-medium mb-4 text-[var(--text-color)] tracking-tight">
                <span className="font-cursive text-[#2f81f7] pr-3 font-normal text-5xl">03.</span> Publish
            </h3>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-xl">
               Distill knowledge into high-signal essays and deep dives. Deliver actionable intelligence straight to your inbox.
            </p>
         </motion.div>
      </div>
    </div>
  );
}
