import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- Configuration ---
// Available Images from public/images/
const IMAGE_FILES = [
  '4a53f62cb18869dfe0372d3dd6a7aab0.JPG', 'IMG_0535.jpg', 'IMG_0537.jpg', 'IMG_0548.jpg',
  'IMG_0558.jpg', 'IMG_0573.jpg', 'IMG_0579.jpg', 'IMG_0580.jpg',
  'IMG_0584.jpg', 'IMG_0590.jpg', 'IMG_0591.jpg', 'IMG_0593.jpg',
  'IMG_0604.jpg', 'IMG_0606.jpg', 'IMG_0609.jpg', 'IMG_0613.jpg',
  'IMG_0615.jpg', 'IMG_0619.jpg', 'IMG_0620.jpg', 'IMG_0623.jpg',
  'IMG_0629.jpg', 'IMG_0633.jpg', 'IMG_0658.jpg', 'IMG_0662.jpg',
  'IMG_0672.jpg', 'IMG_0675.jpg', 'IMG_0679.jpg', 'IMG_0692.jpg',
  'IMG_0699.jpg', 'IMG_0709.jpg', 'IMG_0713.jpg', 'IMG_0726.jpg',
  'IMG_0747.jpg'
];

// Poetic Captions to cycle through
const CAPTIONS = [
  "In every walk with nature, one receives far more than he seeks.",
  "Memory is a way of holding on to the things you love.",
  "The world is a book and those who do not travel read only one page.",
  "Not all those who wander are lost.",
  "Life is short and the world is wide.",
  "Collect moments, not things.",
  "Adventure is worthwhile in itself.",
  "To travel is to live.",
  "Every picture tells a story.",
  "Chasing the sun.",
  "Captured moments of time.",
  "Where you go becomes a part of you.",
  "Dreaming with eyes open.",
  "The journey is the destination.",
  "Time stands still in this moment.",
  "A visual poetry of life.",
  "Reflections of a day well spent.",
  "Whispers of the wind.",
  "Serenity found."
];

const REDIRECT_URL = "https://lumalabs.ai/capture/DE180D77-1EA7-453A-833E-2D87B81C8A88";
const REDIRECT_DELAY_MS = 3000;
const REDIRECT_DELAY_S = REDIRECT_DELAY_MS / 1000;

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [redirectIn, setRedirectIn] = useState<number | null>(null);
  const totalPages = Math.ceil(IMAGE_FILES.length / 2); // 2 photos per spread (one left, one right)

  const handleOpenBook = () => {
    setIsOpen(true);
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (!isOpen || currentPage !== totalPages - 1) {
      setRedirectIn(null);
      return;
    }
    setRedirectIn(REDIRECT_DELAY_S);
    const deadline = Date.now() + REDIRECT_DELAY_MS;
    const interval = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRedirectIn(remaining);
    }, 200);
    const timer = window.setTimeout(() => {
      window.location.href = REDIRECT_URL;
    }, REDIRECT_DELAY_MS);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [isOpen, currentPage, totalPages]);

  // Calculate which images to show
  // Page 0: img 0, img 1
  // Page 1: img 2, img 3
  const leftImgIndex = currentPage * 2;
  const rightImgIndex = currentPage * 2 + 1;
  const leftImg = IMAGE_FILES[leftImgIndex];
  const rightImg = IMAGE_FILES[rightImgIndex]; // might be undefined if odd number

  const leftCaption = CAPTIONS[leftImgIndex % CAPTIONS.length];
  const rightCaption = CAPTIONS[rightImgIndex % CAPTIONS.length];
  const redirectProgress = redirectIn === null ? 0 : (REDIRECT_DELAY_S - redirectIn) / REDIRECT_DELAY_S;

  return (
    <div className="scene">
       {/* 
         Structure:
         - Scene (Perspective)
         - Book Chassis (Width/Height container)
         - Cover (Visible when !isOpen)
         - Content (Visible when isOpen)
       */}
       
       <div className={`book-chassis ${isOpen ? 'open' : ''}`}>
          
          {/* --- The Front Cover --- */}
          <div className={`hardcover front ${isOpen ? 'open' : ''}`} onClick={!isOpen ? handleOpenBook : undefined}>
            <div className="book-cover-content">
               <div className="leather-texture"></div>
               <div className="gold-frame">
                 <div className="logo-icon">✦</div>
                 <h1 className="cover-title">永平书院</h1>
                 <div className="cover-subtitle">环球之旅</div>
                 <div className="divider-line"></div>
                 <div className="cover-location">2026.01.15</div>
                 {!isOpen && <div className="click-hint">CLICK TO OPEN</div>}
               </div>
            </div>
          </div>

          {/* --- The Back Cover (Expands behind) --- */}
          <div className="hardcover back">
            <div className="leather-texture"></div>
          </div>

          {/* --- The Pages (Only visible when Open) --- */}
          <div className="paper-spread">
             
             {/* Center Spine Shadow/Decoration */}
             <div className="center-spine"></div>

             {/* Content Area */}
             <div className="spread-content" key={currentPage}>
                
                {/* LEFT PAGE */}
                <div className="page left-page">
                    <div className="page-inner animate-spread-left">
                       {leftImg && (
                         <div className="photo-entry">
                            <div className="tape-strip top-left"></div>
                            <div className="image-frame">
                               <img src={`/images/${leftImg}`} alt="Memory"/>
                               <div className="grain-overlay"></div>
                            </div>
                            <div className="handwritten-caption">{leftCaption}</div>
                            <div className="date-stamp">JAN 15</div>
                         </div>
                       )}
                    </div>
                </div>

                {/* RIGHT PAGE */}
                <div className="page right-page">
                    <div className="page-inner animate-spread-right">
                       {rightImg && (
                         <div className="photo-entry controls-overlay-wrapper">
                            <div className="tape-strip top-right"></div>
                            <div className="image-frame">
                               <img src={`/images/${rightImg}`} alt="Memory"/>
                               <div className="grain-overlay"></div>
                            </div>
                            <div className="handwritten-caption">{rightCaption}</div>
                         </div>
                       )}
                       {!rightImg && (
                          <div className="end-of-book">
                             <div className="end-text">The End</div>
                          </div>
                       )}
                    </div>
                </div>
                
                {/* Navigation Buttons (Overlay on top of pages) */}
                <div className="nav-controls">
                    <button 
                      className="nav-btn prev" 
                      onClick={handlePrevPage} 
                      disabled={currentPage === 0}>
                      ←
                    </button>
                    <button 
                      className="nav-btn next" 
                      onClick={handleNextPage} 
                      disabled={currentPage >= totalPages - 1}>
                      →
                    </button>
                </div>

             </div>
          </div>

       </div>

       {redirectIn !== null && (
         <div className="redirect-toast">
           <div className="redirect-card">
             <div className="redirect-title">即将跳转</div>
             <div className="redirect-desc">3 秒后进入 Luma Capture</div>
             <div className="redirect-progress">
               <span style={{ width: `${Math.min(100, Math.max(0, redirectProgress * 100))}%` }}></span>
             </div>
             <div className="redirect-count">{redirectIn}秒</div>
           </div>
         </div>
       )}

       {/* CSS Styles */}
       <style dangerouslySetInnerHTML={{__html: `
         /* Global Reset & Fonts */
         :root {
            --paper: #FDFBF7;
            --ink: #2C2C2C;
            --gold: #D4AF37;
            --leather: #3E2723;
         }

         /* Animation for Page Spreading from Center */
         @keyframes spreadFromCenterLeft {
            0% { transform: scaleX(0); opacity: 0; }
            100% { transform: scaleX(1); opacity: 1; }
         }
         @keyframes spreadFromCenterRight {
            0% { transform: scaleX(0); opacity: 0; }
            100% { transform: scaleX(1); opacity: 1; }
         }

         .animate-spread-left {
            transform-origin: right center; /* Grow from right (spine) */
            animation: spreadFromCenterLeft 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            backface-visibility: hidden;
         }
         .animate-spread-right {
            transform-origin: left center; /* Grow from left (spine) */
            animation: spreadFromCenterRight 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            backface-visibility: hidden;
         }

         /* Layout */
         .scene {
             width: 100%; height: 100%;
             display: flex; justify-content: center; align-items: center;
         }

         .book-chassis {
            position: relative;
            width: 450px; /* Closed width */
            height: 650px;
            transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
            perspective: 2500px;
            z-index: 10;
         }
         .book-chassis.open {
            width: 900px; /* Open width */
         }

         /* Covers */
         .hardcover {
            position: absolute; top:0; bottom:0;
            background: var(--leather);
            border-radius: 4px 12px 12px 4px;
            box-shadow: 10px 15px 40px rgba(0,0,0,0.5);
            transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s;
            transform-origin: left center;
            overflow: hidden;
            display: flex; justify-content: center; align-items: center;
            border: 2px solid #5a3b32;
         }
         .hardcover.front { width: 450px; z-index: 20; left: 0; cursor: pointer; }
         .hardcover.back { width: 100%; z-index: 1; right: 0; border-radius: 12px; height: 100%; }

         .hardcover.front.open {
            transform: rotateY(-180deg);
            pointer-events: none;
            opacity: 0;
         }

         .book-cover-content {
            position: relative; width: 100%; height: 100%;
            display: flex; justify-content: center; align-items: center;
            color: var(--gold);
         }
         .leather-texture {
           position: absolute; top:0; left:0; width:100%; height:100%;
           background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E");
           opacity: 0.6; mix-blend-mode: overlay;
         }

         .gold-frame {
            border: 2px solid transparent;
            border-image: linear-gradient(to bottom right, #CFB53B, #AA8E22) 1;
            padding: 40px; text-align: center;
            background: rgba(0,0,0,0.2);
            box-shadow: inset 0 0 0 2px #2D1B15;
            width: 70%;
            display: flex; flex-direction: column; align-items: center;
         }
         .logo-icon { font-size: 2.5rem; margin-bottom: 20px; text-shadow: 0 2px 2px rgba(0,0,0,0.5); }
         .cover-title { font-family: 'Playfair Display', serif; font-size: 3rem; margin: 10px 0; letter-spacing: 0.1em; color: transparent; background: linear-gradient(45deg, #FFD700, #F0E68C, #B8860B); -webkit-background-clip: text; }
         .cover-subtitle { font-size: 0.9rem; letter-spacing: 0.4em; color: #AA8E22; margin-top: 10px; }
         .divider-line { width: 40px; height: 1px; background: #AA8E22; margin: 30px 0; }
         .cover-location { font-family: 'Courier New', monospace; letter-spacing: 0.1em; color: #F0E68C; }
         .click-hint { font-size: 0.7rem; margin-top: 50px; opacity: 0.5; letter-spacing: 0.2em; text-transform: uppercase; animation: pulse 2s infinite; }
         
         @keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.8; } 100% { opacity: 0.3; } }

         /* Redirect Toast */
         .redirect-toast {
           position: fixed; left: 50%; bottom: 40px; transform: translateX(-50%);
           z-index: 200; pointer-events: none;
         }
         .redirect-card {
           background: rgba(18, 18, 18, 0.75);
           border: 1px solid rgba(212, 175, 55, 0.4);
           color: #F3E7B4;
           padding: 14px 18px;
           border-radius: 14px;
           box-shadow: 0 10px 30px rgba(0,0,0,0.35);
           backdrop-filter: blur(8px);
           min-width: 260px;
           text-align: center;
           font-family: 'Playfair Display', serif;
         }
         .redirect-title { font-size: 0.95rem; letter-spacing: 0.2em; text-transform: uppercase; color: #D4AF37; }
         .redirect-desc { margin-top: 6px; font-size: 0.85rem; color: rgba(255,255,255,0.85); }
         .redirect-progress {
           margin-top: 10px; height: 4px; background: rgba(255,255,255,0.15);
           border-radius: 999px; overflow: hidden;
         }
         .redirect-progress span {
           display: block; height: 100%;
           background: linear-gradient(90deg, #D4AF37, #F0E68C);
           box-shadow: 0 0 10px rgba(212,175,55,0.6);
           transition: width 0.2s linear;
         }
         .redirect-count { margin-top: 6px; font-size: 0.8rem; color: rgba(255,255,255,0.7); }

         /* Paper Spread */
         .paper-spread {
             position: absolute; top: 12px; bottom: 12px; left: 16px; right: 16px;
             background: transparent;
             display: flex;
             opacity: 0;
             transition: opacity 0.5s 0.6s; /* Fade in after cover opens */
             z-index: 5;
         }
         .book-chassis.open .paper-spread {
             opacity: 1;
         }
         
         .spread-content {
             display: flex; width: 100%; height: 100%;
             box-shadow: 0 10px 30px rgba(0,0,0,0.15);
             position: relative;
         }

         .center-spine {
             position: absolute; left: 50%; top: 0; bottom: 0; width: 60px; transform: translateX(-50%);
             background: linear-gradient(to right, rgba(0,0,0,0.05), rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05));
             z-index: 50; pointer-events: none;
         }

         /* Pages */
         .page {
             flex: 1;
             background: var(--paper);
             position: relative;
             overflow: hidden;
         }
         .left-page { 
           border-radius: 4px 0 0 4px; 
           background-image: linear-gradient(to right, #f8f8fa 0%, var(--paper) 10%);
         }
         .right-page { 
           border-radius: 0 4px 4px 0; 
           background-image: linear-gradient(to left, #f8f8fa 0%, var(--paper) 10%);
         }
         
         .page-inner {
             width: 100%; height: 100%;
             padding: 30px;
             box-sizing: border-box;
             display: flex; flex-direction: column; justify-content: center; align-items: center;
         }

         /* Content Styling */
         .photo-entry {
             width: 100%; max-width: 320px;
             display: flex; flex-direction: column; align-items: center;
             position: relative;
             transform: rotate(-1.5deg);
             transition: transform 0.3s;
             background: #fff;
             padding: 15px 15px 50px 15px;
             box-shadow: 3px 5px 15px rgba(0,0,0,0.1);
         }
         .right-page .photo-entry { transform: rotate(1.5deg); }
         .photo-entry:hover { transform: rotate(0) scale(1.02); z-index: 10; }

         .image-frame {
             width: 100%; height: 280px; 
             background: #eee; overflow: hidden;
             position: relative;
         }
         .image-frame img { 
            width: 100%; height: 100%; object-fit: cover; 
            filter: sepia(0.25) contrast(1.1) brightness(0.95);
            transition: filter 0.3s;
         }
         .photo-entry:hover img { filter: sepia(0) contrast(1) brightness(1); }

         .handwritten-caption {
             font-family: 'Dancing Script', cursive; font-size: 1.6rem; color: #444;
             margin-top: 20px; text-align: center;
             line-height: 1.4;
             text-shadow: 0 1px 0 rgba(255,255,255,0.5);
         }
         
         /* Decors */
         .tape-strip {
             position: absolute; top: -15px; width: 120px; height: 35px;
             mask: linear-gradient(135deg, transparent 5px, black 5px);
             box-shadow: 0 1px 3px rgba(0,0,0,0.1);
             z-index: 10; opacity: 0.8;
         }
         .tape-strip.top-left { left: 50%; transform: translateX(-50%) rotate(-3deg); background: #E1BEE7; }
         .tape-strip.top-right { left: 50%; transform: translateX(-50%) rotate(2deg); background: #C5E1A5; }
         
         .date-stamp {
             position: absolute; bottom: -25px; right: -15px;
             border: 2px double #C62828; color: #C62828;
             border-radius: 50%; width: 70px; height: 70px;
             display: flex; flex-direction: column; align-items: center; justify-content: center;
             font-family: 'Courier New', monospace; font-weight: bold; font-size: 0.7rem;
             transform: rotate(-15deg); opacity: 0.7;
             background: transparent;
             pointer-events: none;
         }

         /* Navigation */
         .nav-controls {
            position: absolute; bottom: 0; width: 100%; height: 100%;
            pointer-events: none; top: 0; left: 0;
            display: flex; justify-content: space-between; align-items: center;
         }
         .nav-btn {
            pointer-events: auto;
            background: rgba(0,0,0,0.02);
            border: none;
            font-size: 2rem; color: #3E2723; cursor: pointer;
            opacity: 0; transition: opacity 0.3s, background 0.3s;
            width: 60px; height: 100%;
            display: flex; align-items: center; justify-content: center;
         }
         .book-chassis:hover .nav-btn { opacity: 0.3; }
         .nav-btn:hover:not(:disabled) { opacity: 1 !important; background: rgba(0,0,0,0.05); }
         .nav-btn:disabled { opacity: 0; cursor: default; }

         .end-of-book {
             width: 100%; height: 100%;
             display: flex; align-items: center; justify-content: center;
         }
         .end-text {
            font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #ddd; font-style: italic;
         }
         
         .grain-overlay {
           position: absolute; top:0; left:0; width:100%; height:100%;
           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E");
           mix-blend-mode: overlay; pointer-events: none;
         }
       `}} />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
