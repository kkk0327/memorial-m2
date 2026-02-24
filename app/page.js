"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Flower2, Landmark, NotebookPen, X, Send } from 'lucide-react';

const SCENE_CONFIG = {
  'Panorama01': { isOutdoor: true, img: '/images/Panorama01.png', hotspots: [
    { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 12, yaw: -55 },
    { type: 'room', target: 'res', text: '레스토랑', pitch: 2, yaw: -48 },
    { type: 'room', target: 'office', text: '오피스', pitch: 4, yaw: 32 },
    { type: 'room', target: 'dis', text: '전시관', pitch: 3, yaw: 55 },
    { type: 'room', target: 'jip', text: '집회장', pitch: -8, yaw: 45 },
    { type: 'nav', target: 'Panorama02', color: '#ef4444', pitch: -20, yaw: -12, targetYaw: 0 }
  ]},
  'Panorama02': { isOutdoor: true, img: '/images/Panorama02.png', hotspots: [
    { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -50 },
    { type: 'room', target: 'res', text: '레스토랑', pitch: 0, yaw: -45 },
    { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 8, yaw: 12 }, // 우측 건물 밀착
    { type: 'room', target: 'office', text: '오피스', pitch: 8, yaw: 35 },
    { type: 'room', target: 'dis', text: '전시관', pitch: 8, yaw: 50 },
    { type: 'room', target: 'jip', text: '집회장', pitch: -2, yaw: 45 },
    // 화살표 상하 배치: 빨간색 위, 파란색 아래
    { type: 'nav', target: 'Panorama03', color: '#ef4444', pitch: -18, yaw: 0, targetYaw: 0 },
    { type: 'nav', target: 'Panorama01', color: '#3b82f6', pitch: -25, yaw: 0, targetYaw: 180 }
  ]},
  // 실내 공간 설정
  'res': { title: '레스토랑', img: '/images/res.jpg', hotspots: [] },
  'bong01': { title: '봉안당 1', img: '/images/bong01.jpg', hotspots: [] },
  'bong02': { title: '봉안당 2', img: '/images/bong02.jpg', hotspots: [] },
  'office': { title: '오피스', img: '/images/office.jpg', hotspots: [] },
  // ... 나머지 Panorama03~08 생략
};

export default function MemorialApp() {
  const [activeMenu, setActiveMenu] = useState('main');
  const [currentScene, setCurrentScene] = useState('Panorama01');
  const [lastOutdoorScene, setLastOutdoorScene] = useState('Panorama01'); // 직전 길거리 기억
  const [initView, setInitView] = useState({ pitch: 0, yaw: 0 });
  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);
  // ... 기타 상태 변수들 생략

  const viewerRef = useRef(null);
  const pannellumInstance = useRef(null);

  // === 핵심 수정: X 버튼 로직 ===
  const handleExit = () => {
    if (SCENE_CONFIG[currentScene]?.isOutdoor) {
      setActiveMenu('main'); // 길거리에서 X 누르면 메인으로
    } else {
      setCurrentScene(lastOutdoorScene); // 실내에서 X 누르면 들어왔던 길거리 번호로 복귀
    }
  };

  const handleHotspotClick = (hs) => {
    // 실내로 들어가기 직전의 길거리 번호를 저장
    if (SCENE_CONFIG[currentScene]?.isOutdoor) {
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
            if (hs.type === 'nav') { div.innerHTML = `<div class="road-arrow-3d" style="background-color:${hs.color}"></div>`; }
            else { div.innerHTML = `<div class="room-tag-red">${hs.text}</div>`; }
          },
          clickHandlerFunc: () => handleHotspotClick(hs)
        }))
      });
    }
  }, [activeMenu, currentScene, isPannellumLoaded, initView]);

  return (
    <div className="app-container">
      {/* ... 기존 UI 구조 ... */}
      {activeMenu === 'gallery' && (
        <div className="gallery-full-viewport">
          <div ref={viewerRef} className="viewer-canvas" />
          {!SCENE_CONFIG[currentScene]?.isOutdoor && (
            <div className="scene-title-badge">{SCENE_CONFIG[currentScene]?.title}</div>
          )}
          <button className="exit-button" onClick={handleExit}><X size={32} /></button>
        </div>
      )}
      <style jsx global>{`
        /* ... 기존 스타일 유지 ... */
        .road-arrow-3d { 
          width: 55px; height: 85px; 
          clip-path: polygon(50% 0%, 15% 100%, 50% 80%, 85% 100%); 
          transform: translate(-50%, -50%) rotateX(65deg); 
          cursor: pointer; 
        }
        .room-tag-red { background: rgba(0,0,0,0.8); border: 2.5px solid #ef4444; color: white; padding: 7px 18px; border-radius: 8px; font-weight: bold; transform: translate(-50%, -50%); white-space: nowrap; }
      `}</style>
    </div>
  );
}