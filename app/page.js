"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Flower2, Landmark, NotebookPen, X, Send } from 'lucide-react';

// === 사용자 지시 사항(길거리 1번 좌표 수정)만 반영된 데이터 ===
const SCENE_CONFIG = {
  'Panorama01': { 
    isOutdoor: true, 
    img: '/images/Panorama01.png', 
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 12, yaw: -55 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 2, yaw: -48 },
      { type: 'room', target: 'office', text: '오피스', pitch: 4, yaw: 32 },
      { type: 'room', target: 'dis', text: '전시관', pitch: 3, yaw: 55 },
      { type: 'room', target: 'jip', text: '집회장', pitch: -8, yaw: 45 },
      // [수정 반영] 사용자 요청 좌표: pitch -22, yaw -18
      { type: 'nav', target: 'Panorama02', color: '#ef4444', pitch: -22, yaw: -18, targetYaw: 0 }
    ]
  },
  'Panorama02': { 
    isOutdoor: true, 
    img: '/images/Panorama02.png', 
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -50 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 0, yaw: -45 },
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 8, yaw: 12 }, 
      { type: 'room', target: 'office', text: '오피스', pitch: 8, yaw: 100 },
      { type: 'room', target: 'dis', text: '전시관', pitch: 12, yaw: 120 },
      { type: 'room', target: 'jip', text: '집회장', pitch: -2, yaw: 110 },
      { type: 'nav', target: 'Panorama03', color: '#ef4444', pitch: -18, yaw: 0, targetYaw: 0 }, 
      { type: 'nav', target: 'Panorama01', color: '#3b82f6', pitch: -25, yaw: 0, targetYaw: 180, isReverse: true } 
    ]
  },
  'Panorama03': { 
    isOutdoor: true, 
    img: '/images/Panorama03.png', 
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -30 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 0, yaw: -25 },
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 10, yaw: 25 },
      { type: 'nav', target: 'Panorama04', color: '#ef4444', pitch: -16, yaw: 0, targetYaw: 0 },
      { type: 'nav', target: 'Panorama02', color: '#3b82f6', pitch: -25, yaw: 0, targetYaw: 180, isReverse: true }
    ]
  },
  'Panorama04': { 
    isOutdoor: true, 
    img: '/images/Panorama04.png', 
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -35 },
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 10, yaw: 35 },
      { type: 'room', target: 'bong03', text: '봉안당 3', pitch: 12, yaw: 0 },
      { type: 'nav', target: 'Panorama07', color: '#ef4444', pitch: -10, yaw: 15, targetYaw: 0, rotate: '90deg', w: 60, h: 90 },
      { type: 'nav', target: 'Panorama06', color: '#10b981', pitch: -10, yaw: -15, targetYaw: 0, rotate: '-90deg', w: 60, h: 90 },
      { type: 'nav', target: 'Panorama03', color: '#3b82f6', pitch: -15, yaw: 0, targetYaw: 180, rotate: '180deg', w: 60, h: 90 }
    ]
  },
  'Panorama06': { 
    isOutdoor: true, 
    img: '/images/Panorama06.png', 
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -45 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 0, yaw: -40 },
      { type: 'room', target: 'bong03', text: '봉안당 3', pitch: 10, yaw: 35 },
      { type: 'room', target: 'cafe', text: '카페', pitch: 10, yaw: 10 },
      { type: 'nav', target: 'Panorama04', color: '#3b82f6', pitch: -20, yaw: 0, targetYaw: 160, rotate: '180deg' }
    ]
  },
  'Panorama07': { 
    isOutdoor: true, 
    img: '/images/Panorama07.png', 
    hotspots: [
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 10, yaw: 45 },
      { type: 'room', target: 'bong03', text: '봉안당 3', pitch: 10, yaw: -45 },
      { type: 'nav', target: 'Panorama08', color: '#ef4444', pitch: -16, yaw: 0, targetYaw: 0 },
      { type: 'nav', target: 'Panorama04', color: '#3b82f6', pitch: -25, yaw: 0, targetYaw: -135, rotate: '180deg' }
    ]
  },
  'Panorama08': { 
    isOutdoor: true, 
    img: '/images/Panorama08.png', 
    hotspots: [
      { type: 'room', target: 'hotel', text: '호텔', pitch: 10, yaw: -5 },
      { type: 'room', target: 'pat', text: '팻시설', pitch: 10, yaw: 15 },
      { type: 'nav', target: 'Panorama07', color: '#3b82f6', pitch: -20, yaw: 0, targetYaw: -150, rotate: '180deg' }
    ]
  },
  'res': { title: '레스토랑', img: '/images/res.jpg', hotspots: [] },
  'office': { title: '오피스', img: '/images/office.jpg', hotspots: [] },
  'dis': { title: '전시관', img: '/images/dis.jpg', hotspots: [] },
  'jip': { title: '집회장', img: '/images/jip.jpg', hotspots: [] },
  'cafe': { title: '카페', img: '/images/cafe.jpg', hotspots: [] },
  'hotel': { title: '호텔', img: '/images/hotel.jpg', hotspots: [] },
  'pat': { title: '팻시설', img: '/images/pat.jpg', hotspots: [] },
  'bong01': { title: '봉안당 1', img: '/images/bong01.jpg', hotspots: [] },
  'bong02': { title: '봉안당 2', img: '/images/bong02.jpg', hotspots: [] },
  'bong03': { 
    title: '봉안당 3', 
    img: '/images/bong03.jpg', 
    hotspots: [
      { type: 'room', target: 'family', text: '가족추모실', pitch: 5, yaw: -20 }, 
      { type: 'room', target: 'per', text: '개인추모실', pitch: 5, yaw: 20 }
    ] 
  },
  'family': { title: '가족추모실', img: '/images/family.jpg', hotspots: [] },
  'per': { title: '개인추모실', img: '/images/per.jpg', hotspots: [] }
};

export default function MemorialApp() {
  const [activeMenu, setActiveMenu] = useState('main');
  const [currentScene, setCurrentScene] = useState('Panorama01');
  const [lastOutdoorScene, setLastOutdoorScene] = useState('Panorama01');
  const [initView, setInitView] = useState({ pitch: 0, yaw: 0 });
  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);
  const [hasFlowered, setHasFlowered] = useState(false);
  const [isFlowering, setIsFlowering] = useState(false);
  const [toastMessage, setToastMessage] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const viewerRef = useRef(null);
  const pannellumInstance = useRef(null);

  const handleExit = () => {
    if (SCENE_CONFIG[currentScene]?.isOutdoor) {
      setActiveMenu('main');
    } else if (currentScene === 'family' || currentScene === 'per') {
      setCurrentScene('bong03');
    } else {
      setCurrentScene(lastOutdoorScene);
    }
  };

  const handleHotspotClick = (hs) => {
    if (SCENE_CONFIG[currentScene]?.isOutdoor && !SCENE_CONFIG[hs.target]?.isOutdoor) {
      setLastOutdoorScene(currentScene);
    }
    setInitView({ pitch: 0, yaw: hs.targetYaw || 0 });
    setCurrentScene(hs.target);
  };

  useEffect(() => {
    if (activeMenu === 'gallery' && isPannellumLoaded && window.pannellum) {
      if (pannellumInstance.current) { pannellumInstance.current.destroy(); }
      const data = SCENE_CONFIG[currentScene] || SCENE_CONFIG['Panorama01'];
      pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
        type: "equirectangular", panorama: data.img,
        pitch: initView.pitch, yaw: initView.yaw,
        hfov: 90, maxHfov: 90, minHfov: 50,
        autoLoad: true, showControls: false,
        hotSpots: (data.hotspots || []).map(hs => ({
          pitch: hs.pitch, yaw: hs.yaw,
          cssClass: "custom-hotspot",
          createTooltipFunc: (div) => {
            if (hs.type === 'nav') { 
              const width = hs.w || 55;
              const height = hs.h || 85;
              const rotation = hs.rotate || (hs.isReverse ? '180deg' : '0deg');
              div.innerHTML = `<div class="road-arrow-3d" style="width:${width}px; height:${height}px; background-color:${hs.color}; transform: translate(-50%, -50%) rotateX(65deg) rotate(${rotation});"></div>`; 
            } else { 
              div.innerHTML = `<div class="room-tag-red">${hs.text}</div>`; 
            }
          },
          clickHandlerFunc: () => handleHotspotClick(hs)
        }))
      });
    }
  }, [activeMenu, currentScene, isPannellumLoaded, initView]);

  return (
    <div className="app-container">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
      <Script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js" strategy="afterInteractive" onLoad={() => setIsPannellumLoaded(true)} />
      
      {activeMenu === 'main' && (
        <div className="main-viewport">
          <img src="/images/main.jpg" className="full-bg" />
          <div className="main-overlay">
            <h1>추모관</h1>
            <div className="bottom-menu">
              <button onClick={() => {
                if (hasFlowered) {
                  setToastMessage(["이미 헌화하셨습니다.", "따뜻한 마음 감사합니다."]);
                  setShowToast(true); setTimeout(() => setShowToast(false), 3000);
                } else {
                  setHasFlowered(true); setIsFlowering(true);
                  setTimeout(() => setIsFlowering(false), 2600);
                }
              }}><Flower2 color="white" /><span>헌화</span></button>
              <button onClick={() => { setCurrentScene('Panorama01'); setInitView({pitch:0, yaw:0}); setActiveMenu('gallery'); }}><Landmark color="white" /><span>추모관</span></button>
              <button onClick={() => {}}><NotebookPen color="white" /><span>방명록</span></button>
            </div>
          </div>
          {isFlowering && <div className="flower-anim"><img src="/images/guk.png" /></div>}
        </div>
      )}

      {activeMenu === 'gallery' && (
        <div className="gallery-full-viewport">
          <div ref={viewerRef} className="viewer-canvas" />
          {!SCENE_CONFIG[currentScene]?.isOutdoor && (
            <div className="scene-title-badge">{SCENE_CONFIG[currentScene]?.title}</div>
          )}
          <button className="exit-button" onClick={handleExit}><X size={32} /></button>
        </div>
      )}

      {showToast && (
        <div className="toast-center">
          {toastMessage.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}

      <style jsx global>{`
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; font-family: 'Noto Serif KR', serif; }
        .app-container { width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; }
        .main-viewport { position: relative; width: 100%; height: 100%; max-width: 450px; background: #000; }
        @media screen and (min-width: 1025px) { .main-viewport { border-left: 1px solid #333; border-right: 1px solid #333; } }
        .full-bg { width: 100%; height: 100%; object-fit: cover; }
        .main-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 10vh 0 8vh; background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent, rgba(0,0,0,0.5)); z-index: 10; }
        h1 { font-size: 4rem; margin: 0; color: #1a1a1a; text-align: center; font-weight: 700; }
        .bottom-menu { display: flex; justify-content: space-around; width: 100%; }
        .bottom-menu button { background: none; border: none; color: white; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; }
        .gallery-full-viewport { position: fixed; inset: 0; z-index: 100; width: 100vw; height: 100vh; }
        .viewer-canvas { width: 100%; height: 100%; }
        .scene-title-badge { position: absolute; top: 30px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.75); border: 2px solid #ef4444; color: white; padding: 10px 30px; border-radius: 8px; font-weight: bold; font-size: 1.2rem; z-index: 110; }
        .exit-button { position: absolute; top: 30px; right: 30px; z-index: 110; background: rgba(0,0,0,0.5); border: 1px solid #fff; border-radius: 50%; width: 50px; height: 50px; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .custom-hotspot { z-index: 100; pointer-events: auto; }
        .road-arrow-3d { clip-path: polygon(50% 0%, 15% 100%, 50% 80%, 85% 100%); cursor: pointer; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.4)); }
        .room-tag-red { background: rgba(0,0,0,0.8); border: 2.5px solid #ef4444; color: white; padding: 7px 18px; border-radius: 8px; font-weight: bold; transform: translate(-50%, -50%); white-space: nowrap; font-size: 1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.5); cursor: pointer; }
        .toast-center { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.85); color: white; padding: 22px 45px; border-radius: 20px; z-index: 500; text-align: center; }
        .flower-anim { position: absolute; left: 50%; bottom: 25%; transform: translateX(-50%); z-index: 20; animation: flower-up 2.6s forwards; }
        @keyframes flower-up { 0% { bottom: 25%; opacity: 0; } 20% { opacity: 1; } 100% { bottom: 60%; opacity: 0; } }
      `}</style>
    </div>
  );
}