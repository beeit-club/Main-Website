// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Code2,
//   Rocket,
//   Zap,
//   Target,
//   Smartphone,
//   Wrench,
//   Globe,
//   Lightbulb,
// } from "lucide-react";

// const Banner = () => {
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [gridSize, setGridSize] = useState({ cols: 0, rows: 0 });
//   const [typedText, setTypedText] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [index, setIndex] = useState(0);
//   const bannerRef = useRef(null);

//   const fullText = "Học tập, hợp tác và cùng nhau trưởng thành.";

//   const icons = [
//     // Top area
//     { Icon: Code2, pos: { left: "8%", top: "15%" } },
//     { Icon: Smartphone, pos: { left: "50%", top: "8%" } },
//     { Icon: Rocket, pos: { left: "88%", top: "12%" } },

//     // Upper-middle area
//     { Icon: Lightbulb, pos: { left: "18%", top: "28%" } },
//     { Icon: Target, pos: { left: "75%", top: "32%" } },

//     // Middle area
//     { Icon: Globe, pos: { left: "92%", top: "48%" } },
//     { Icon: Wrench, pos: { left: "12%", top: "52%" } },

//     // Lower-middle area
//     { Icon: Zap, pos: { left: "42%", top: "65%" } },
//     { Icon: Code2, pos: { left: "82%", top: "68%" } },

//     // Bottom area
//     { Icon: Target, pos: { left: "22%", top: "82%" } },
//     { Icon: Smartphone, pos: { left: "65%", top: "85%" } },
//     { Icon: Lightbulb, pos: { left: "5%", top: "75%" } },

//     // Additional scattered icons for depth
//     { Icon: Zap, pos: { left: "35%", top: "22%" } },
//     { Icon: Wrench, pos: { left: "58%", top: "42%" } },
//     { Icon: Globe, pos: { left: "28%", top: "58%" } },
//     { Icon: Rocket, pos: { left: "72%", top: "78%" } },
//   ];

//   // Mouse move
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (!bannerRef.current) return;
//       const rect = bannerRef.current.getBoundingClientRect();
//       setMousePos({
//         x: e.clientX - rect.left,
//         y: e.clientY - rect.top,
//       });
//     };

//     const banner = bannerRef.current;
//     if (banner) {
//       banner.addEventListener("mousemove", handleMouseMove);
//       return () => banner.removeEventListener("mousemove", handleMouseMove);
//     }
//   }, []);

//   // Update grid size
//   useEffect(() => {
//     const updateGrid = () => {
//       if (!bannerRef.current) return;
//       const rect = bannerRef.current.getBoundingClientRect();
//       setGridSize({
//         cols: Math.ceil(rect.width / 50),
//         rows: Math.ceil(rect.height / 50),
//       });
//     };

//     updateGrid();
//     window.addEventListener("resize", updateGrid);
//     return () => window.removeEventListener("resize", updateGrid);
//   }, []);

//   // Typing effect loop
//   useEffect(() => {
//     const typingSpeed = isDeleting ? 30 : 70;
//     const timeout = setTimeout(() => {
//       if (!isDeleting && index < fullText.length) {
//         setTypedText(fullText.slice(0, index + 1));
//         setIndex(index + 1);
//       } else if (isDeleting && index > 0) {
//         setTypedText(fullText.slice(0, index - 1));
//         setIndex(index - 1);
//       } else if (index === fullText.length) {
//         setTimeout(() => setIsDeleting(true), 1500); // dừng 1.5s trước khi xóa
//       } else if (index === 0 && isDeleting) {
//         setIsDeleting(false);
//       }
//     }, typingSpeed);

//     return () => clearTimeout(timeout);
//   }, [index, isDeleting]);

//   const GridCell = ({ x, y }) => {
//     const centerX = x * 50 + 25;
//     const centerY = y * 50 + 25;
//     const distance = Math.sqrt(
//       Math.pow(centerX - mousePos.x, 2) + Math.pow(centerY - mousePos.y, 2)
//     );
//     const isActive = distance < 200;
//     const intensity = isActive ? Math.max(0, 1 - distance / 200) : 0;

//     return (
//       <div
//         className="absolute transition-all duration-300"
//         style={{
//           left: `${x * 50}px`,
//           top: `${y * 50}px`,
//           width: "50px",
//           height: "50px",
//           border: `1px solid color-mix(in oklab, var(--foreground) 10%, transparent)`,
//           background: `color-mix(in oklab, var(--foreground) ${
//             intensity * 12
//           }%, transparent)`,
//           transform: `scale(${1 + intensity * 0.08})`,
//           boxShadow: isActive
//             ? `0 0 ${20 * intensity}px color-mix(in oklab, var(--foreground) ${
//                 40 * intensity
//               }%, transparent)`
//             : "none",
//         }}
//       />
//     );
//   };

//   const gridCells = [];
//   for (let y = 0; y < gridSize.rows; y++) {
//     for (let x = 0; x < gridSize.cols; x++) {
//       gridCells.push(<GridCell key={`${x}-${y}`} x={x} y={y} />);
//     }
//   }

//   return (
//     <div
//       ref={bannerRef}
//       className="relative w-full h-[calc(100svh_-_80px)] overflow-hidden flex items-center justify-center bg-background"
//     >
//       {/* Grid overlay */}
//       <div className="absolute inset-0 opacity-50 pointer-events-none">
//         {gridCells}
//       </div>

//       {/* Floating icons */}
//       {icons.map((item, index) => {
//         const IconComponent = item.Icon;
//         return (
//           <div
//             key={index}
//             className="absolute animate-float"
//             style={{
//               left: item.pos.left,
//               top: item.pos.top,
//               animationDelay: `${index * 0.3}s`,
//               animationDuration: `${4 + (index % 3)}s`,
//             }}
//           >
//             <IconComponent className="h-8 w-8 text-white/25" />
//           </div>
//         );
//       })}

//       {/* Main content */}
//       <div className="relative z-10 text-center px-6 max-w-4xl">
//         {/* Title */}
//         <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)]">
//           BEE IT CLUB
//         </h1>

//         {/* Subtitle */}
//         <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-semibold mb-6 text-foreground/90">
//           Together We Code, Together We Grow
//         </h2>

//         {/* Typing slogan */}
//         <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-10 text-foreground/70 min-h-[2rem]">
//           {typedText}
//           <span className="animate-pulse">|</span>
//         </p>

//         <div className="flex flex-wrap justify-center gap-6">
//           <button className="px-8 py-3 rounded-full font-bold uppercase tracking-wide bg-foreground text-background shadow-lg transform transition hover:-translate-y-1">
//             Tham gia ngay
//           </button>
//           <button className="px-8 py-3 rounded-full font-bold uppercase tracking-wide border-2 border-foreground text-foreground bg-transparent hover:bg-foreground/10 transition">
//             Khám phá blog
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;
