"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Flower2, Landmark, NotebookPen, X, Send } from 'lucide-react';

// === 모든 로직 및 연결 좌표 최종 검토 완료 ===
const SCENE_CONFIG = {
  'Panorama01': { isOutdoor: true, img: '/images/Panorama01.png', hotspots: [
    { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 12, yaw: -55 },
    { type: 'room', target: 'res', text: '레스토랑', pitch: 2, yaw: -48 },
    { type: 'room', target: 'office', text: '오피스', pitch: 4, yaw: 32 },
    { type: 'room', target: 'dis', text: '전시관', pitch: 3, yaw: 55 },
    { type: 'room', target: 'jip', text: '집회장', pitch: -8, yaw: 45 },
    { type: 'nav', target: 'Panorama02', color: '#ef4444', pitch: -22, yaw: -12, targetYaw: 0 }
  ]},
  'Panorama02': { isOutdoor: true, img: '/images/Panorama02.png', hotspots: [
    { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -50 },
    { type: 'room', target: 'res', text: '레스토랑', pitch: 0, yaw: -45 },
    { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 8, yaw: 12 },
    { type: 'room', target: 'office', text: '오피스', pitch: 8, yaw: 35 },
    { type: 'room', target: 'dis', text: '전시관', pitch: 8, yaw: 50 },
    { type: 'room', target: 'jip', text: '집회장', pitch: -2, yaw: 45 },
    { type: 'nav', target: 'Panorama03', color: '#ef4444', pitch: -18, yaw: 0, targetYaw: 0 },
    { type: 'nav', target: 'Panorama01', color: '#3b82f6', pitch: -25, yaw: 0, targetYaw: 180, isReverse: true }
  ]},
  'Panorama03': { isOutdoor: true, img: '/images/Panorama03.png', hotspots: [
    { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -30 },
    { type: 'room', target: 'res', text: '레스토랑', pitch: 0, yaw: -25 },
    { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 10, yaw: 25 },
    { type: 'nav', target: 'Panorama04', color: '#ef4444', pitch: -10, yaw: 0, targetYaw: 0 },
    { type: 'nav', target: 'Panorama02', color: '#3b82f6', pitch: -18, yaw: 0, targetYaw: 180, isReverse: true }
  ]},
  // 실내 공간 이미지들 (title 필수)
  'bong01': { title: '봉안당 1', img: '/images/bong01.jpg', hotspots: [] },
  'bong02': { title: '봉안당 2', img: '/images/bong02.jpg', hotspots: [] },
  'res': { title: '레스토랑', img: '/images/res.jpg', hotspots: [] },
  'office': { title: '오피스', img: '/images/office.jpg', hotspots: [] },
  'dis': { title: '전시관', img: '/images/dis.jpg', hotspots: [] },
  'jip': { title: '집회장', img: '/images/jip.jpg', hotspots: [] },
};

export default function MemorialApp() {
  const [activeMenu, setActiveMenu] = useState('main');
  const [currentScene, setCurrentScene] = useState('Panorama01');
  const [lastOutdoorScene, setLastOutdoorScene] = useState('Panorama01'); // 위치 저장용
  const [initView, setInitView] = useState({ pitch: 0, yaw: 0 });
  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);
  const [hasFlowered, setHasFlowered] = useState(false);
  const [isFlowering, setIsFlowering] = useState(false);
  const [toastMessage, setToastMessage] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const viewerRef = useRef(null);
  const pannellumInstance = useRef(null);

  const handleExit = () => {
    // 현재 화면이 길거리(isOutdoor)면 메인으로, 실내면 들어왔던 길거리로 복귀
    if (SCENE_CONFIG[currentScene]?.isOutdoor) {
      setActiveMenu('main');
    } else {
      setCurrentScene(lastOutdoorScene);
    }
  };

  const handleHotspotClick = (hs) => {
    // 실내로 들어갈 때만 현재 길거리 위치를 저장
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
        autoLoad: true, showControls: false,
        hotSpots: (data.hotspots || []).map(hs => ({
          pitch: hs.pitch, yaw: hs.yaw,
          cssClass: "custom-hotspot",
          createTooltipFunc: (div) => {
            if (hs.type === 'nav') { 
              const rotation = hs.isReverse ? 'rotate(180deg)' : 'rotate(0deg)';
              div.innerHTML = `<div class="road-arrow-3d" style="background-color:${hs.color}; transform: translate(-50%, -50%) rotateX(65deg) ${rotation};"></div>`; 
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
      {/* 메인 화면 UI 생략 (기존 유지) */}
      
      {activeMenu === 'gallery' && (
        <div className="gallery-full-viewport">
          <div ref={viewerRef} className="viewer-canvas" />
          {/* Outdoor가 아닐 때만 제목 표시 */}
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
        .gallery-full-viewport { position: fixed; inset: 0; z-index: 100; width: 100vw; height: 100vh; }
        .viewer-canvas { width: 100%; height: 100%; }
        .scene-title-badge { position: absolute; top: 30px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.75); border: 2px solid #ef4444; color: white; padding: 10px 30px; border-radius: 8px; font-weight: bold; font-size: 1.2rem; z-index: 110; }
        .exit-button { position: absolute; top: 30px; right: 30px; z-index: 110; background: rgba(0,0,0,0.5); border: 1px solid #fff; border-radius: 50%; width: 50px; height: 50px; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .road-arrow-3d { width: 55px; height: 85px; clip-path: polygon(50% 0%, 15% 100%, 50% 80%, 85% 100%); cursor: pointer; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.4)); }
        .room-tag-red { background: rgba(0,0,0,0.8); border: 2.5px solid #ef4444; color: white; padding: 7px 18px; border-radius: 8px; font-weight: bold; transform: translate(-50%, -50%); white-space: nowrap; font-size: 1rem; }
        .toast-center { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.85); color: white; padding: 22px 45px; border-radius: 20px; z-index: 500; text-align: center; }
      `}</style>
    </div>
  );
}