"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Flower2, Landmark, NotebookPen, X, Send } from 'lucide-react';

// === 모든 로직 및 좌표 정밀 수정 완료 ===
const SCENE_CONFIG = {
  'Panorama01': {
    isOutdoor: true, // 제목 숨기기 활성화
    img: '/images/Panorama01.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 12, yaw: -55 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 2, yaw: -48 },
      { type: 'room', target: 'office', text: '오피스', pitch: 8, yaw: 45 }, // 건물 밀착
      { type: 'room', target: 'dis', text: '전시관', pitch: 6, yaw: 65 },   // 건물 밀착
      { type: 'room', target: 'jip', text: '집회장', pitch: -4, yaw: 55 },  // 건물 밀착
      { type: 'nav', target: 'Panorama02', color: '#ef4444', pitch: -22, yaw: -2, targetYaw: 0 } // 길 가운데 3D 화살표
    ]
  },
  'Panorama02': {
    isOutdoor: true,
    img: '/images/Panorama02.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -50 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 0, yaw: -45 },
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 10, yaw: -10 },
      { type: 'room', target: 'office', text: '오피스', pitch: 10, yaw: 35 },
      { type: 'room', target: 'dis', text: '전시관', pitch: 10, yaw: 50 },
      { type: 'room', target: 'jip', text: '집회장', pitch: 0, yaw: 45 },
      { type: 'nav', target: 'Panorama03', color: '#ef4444', pitch: -18, yaw: 0, targetYaw: 0 },
      { type: 'nav', target: 'Panorama01', color: '#3b82f6', pitch: -25, yaw: 180, targetYaw: 180 } // 파란색 화살표 복구
    ]
  },
  // Panorama03~08 및 세부 공간 설정...
  'office': { title: '오피스', img: '/images/office.jpg', hotspots: [] },
  'bong01': { title: '봉안당 1', img: '/images/bong01.jpg', hotspots: [] },
  'res': { title: '레스토랑', img: '/images/res.jpg', hotspots: [] }
};

export default function MemorialApp() {
  const [activeMenu, setActiveMenu] = useState('main');
  const [currentScene, setCurrentScene] = useState('Panorama01');
  const [sceneHistory, setSceneHistory] = useState([]);
  const [initView, setInitView] = useState({ pitch: 0, yaw: 0 });
  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [isFlowering, setIsFlowering] = useState(false);
  const [hasFlowered, setHasFlowered] = useState(false);

  const viewerRef = useRef(null);
  const pannellumInstance = useRef(null);

  const handleHotspotClick = (hs) => {
    const cp = pannellumInstance.current.getPitch();
    const cy = pannellumInstance.current.getYaw();
    setSceneHistory([...sceneHistory, { scene: currentScene, pitch: cp, yaw: cy }]);
    setInitView({ pitch: 0, yaw: hs.targetYaw || 0 });
    setCurrentScene(hs.target);
  };

  const handleBack = () => {
    if (sceneHistory.length === 0) { setActiveMenu('main'); }
    else {
      const historyCopy = [...sceneHistory];
      const prev = historyCopy.pop();
      setSceneHistory(historyCopy);
      setInitView({ pitch: prev.pitch, yaw: prev.yaw });
      setCurrentScene(prev.scene);
    }
  };

  useEffect(() => {
    if (activeMenu === 'gallery' && isPannellumLoaded && window.pannellum) {
      if (pannellumInstance.current) { pannellumInstance.current.destroy(); }
      const data = SCENE_CONFIG[currentScene] || SCENE_CONFIG['Panorama01'];
      pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
        type: "equirectangular",
        panorama: data.img,
        pitch: initView.pitch,
        yaw: initView.yaw,
        autoLoad: true,
        showControls: false,
        hotSpots: (data.hotspots || []).map(hs => ({
          pitch: hs.pitch, yaw: hs.yaw,
          cssClass: "custom-hotspot",
          createTooltipFunc: (div) => {
            if (hs.type === 'nav') {
              div.innerHTML = `<div class="road-arrow-3d" style="background-color:${hs.color}"></div>`;
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
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                } else {
                  setHasFlowered(true);
                  setIsFlowering(true);
                  setTimeout(() => setIsFlowering(false), 2600);
                }
              }}><Flower2 color="white" /><span>헌화</span></button>
              <button onClick={() => { setCurrentScene('Panorama01'); setSceneHistory([]); setInitView({pitch:0, yaw:0}); setActiveMenu('gallery'); }}><Landmark color="white" /><span>추모관</span></button>
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
          <button className="exit-button" onClick={handleBack}><X size={32} /></button>
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

        .road-arrow-3d { 
          width: 55px; height: 85px; 
          clip-path: polygon(50% 0%, 15% 100%, 50% 80%, 85% 100%); 
          transform: translate(-50%, -50%) rotateX(65deg); 
          cursor: pointer; 
          filter: drop-shadow(0 10px 10px rgba(0,0,0,0.4));
          transition: transform 0.2s;
        }
        .road-arrow-3d:hover { transform: translate(-50%, -50%) rotateX(65deg) scale(1.15); }

        .room-tag-red { background: rgba(0,0,0,0.8); border: 2.5px solid #ef4444; color: white; padding: 7px 18px; border-radius: 8px; font-weight: bold; transform: translate(-50%, -50%); white-space: nowrap; font-size: 1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        .toast-center { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.85); color: white; padding: 22px 45px; border-radius: 20px; z-index: 500; text-align: center; }
        .flower-anim { position: absolute; left: 50%; bottom: 25%; transform: translateX(-50%); z-index: 20; animation: flower-up 2.6s forwards; }
        @keyframes flower-up { 0% { bottom: 25%; opacity: 0; } 20% { opacity: 1; } 100% { bottom: 60%; opacity: 0; } }
      `}</style>
    </div>
  );
}