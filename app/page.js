"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Flower2, Landmark, NotebookPen, X, Send } from 'lucide-react';

// === 리뉴얼된 파노라마 설정 (사용자 지정 파일만 사용) ===
const SCENE_CONFIG = {
  'Panorama01': {
    title: '메인 광장',
    img: '/images/Panorama01.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 12, yaw: -55 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 2, yaw: -48 },
      { type: 'room', target: 'office', text: '오피스', pitch: 10, yaw: 35 },
      { type: 'room', target: 'dis', text: '전시관', pitch: 8, yaw: 55 },
      { type: 'room', target: 'jip', text: '집회장', pitch: -2, yaw: 45 },
      { type: 'nav', target: 'Panorama02', color: '#ef4444', pitch: -18, yaw: -2, targetYaw: 0 }
    ]
  },
  'Panorama02': {
    title: '중앙 진입로',
    img: '/images/Panorama02.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -50 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 0, yaw: -45 },
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 10, yaw: -10 },
      { type: 'room', target: 'office', text: '오피스', pitch: 10, yaw: 30 },
      { type: 'room', target: 'dis', text: '전시관', pitch: 10, yaw: 45 },
      { type: 'room', target: 'jip', text: '집회장', pitch: 0, yaw: 40 },
      { type: 'nav', target: 'Panorama03', color: '#ef4444', pitch: -18, yaw: 0, targetYaw: 0 },
      { type: 'nav', target: 'Panorama01', color: '#3b82f6', pitch: -22, yaw: 180, targetYaw: 180 }
    ]
  },
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
  'res': { title: '레스토랑', img: '/images/res.jpg', hotspots: [] },
  'office': { title: '오피스', img: '/images/office.jpg', hotspots: [] },
  'dis': { title: '전시관', img: '/images/dis.jpg', hotspots: [] },
  'jip': { title: '집회장', img: '/images/jip.jpg', hotspots: [] },
  'cafe': { title: '카페', img: '/images/cafe.jpg', hotspots: [] },
  'hotel': { title: '호텔', img: '/images/hotel.jpg', hotspots: [] },
  'pat': { title: '팻시설', img: '/images/pat.jpg', hotspots: [] },
  'family': { title: '가족추모실', img: '/images/family.jpg', hotspots: [] },
  'per': { title: '개인추모실', img: '/images/per.jpg', hotspots: [] }
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
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputMsg, setInputMsg] = useState("");
  const [guestbookList, setGuestbookList] = useState([
    { id: 1, name: "김철수", msg: "좋은 곳에서 편히 쉬시길 바랍니다.", date: "2026.02.12" },
  ]);

  const viewerRef = useRef(null);
  const pannellumInstance = useRef(null);

  const handleEnterGallery = () => {
    setCurrentScene('Panorama01');
    setSceneHistory([]);
    setInitView({ pitch: 0, yaw: 0 });
    setActiveMenu('gallery');
  };

  const handleHotspotClick = (hs) => {
    const cp = pannellumInstance.current.getPitch();
    const cy = pannellumInstance.current.getYaw();
    setSceneHistory([...sceneHistory, { scene: currentScene, pitch: cp, yaw: cy }]);
    setInitView({ pitch: 0, yaw: hs.targetYaw || 0 });
    setCurrentScene(hs.target);
  };

  const handleBack = () => {
    if (sceneHistory.length === 0) {
      setActiveMenu('main');
    } else {
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
              div.innerHTML = `<div class="road-arrow" style="background-color:${hs.color}"></div>`;
            } else {
              div.innerHTML = `<div class="room-tag">${hs.text}</div>`;
            }
          },
          clickHandlerFunc: () => handleHotspotClick(hs)
        }))
      });
    }
  }, [activeMenu, currentScene, isPannellumLoaded, initView]);

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
      <Script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js" strategy="afterInteractive" onLoad={() => setIsPannellumLoaded(true)} />
      
      <div className="full-container">
        {activeMenu === 'main' && (
          <div className="main-viewport">
            <img src="/images/main.jpg" className="full-bg" />
            <div className="main-ui">
              <div className="top-title">
                <h1>추모관</h1>
                <p>영원한 안식, 함께 기억합니다</p>
              </div>
              <div className="bottom-nav">
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
                <button onClick={handleEnterGallery}><Landmark color="white" /><span>추모관</span></button>
                <button onClick={() => setShowGuestbook(true)}><NotebookPen color="white" /><span>방명록</span></button>
              </div>
            </div>
            {isFlowering && <div className="flower-anim"><img src="/images/guk.png" /></div>}
          </div>
        )}

        {activeMenu === 'gallery' && (
          <div className="gallery-viewport">
            <div ref={viewerRef} className="full-viewer" />
            <div className="scene-badge">{SCENE_CONFIG[currentScene]?.title}</div>
            <button className="gallery-exit" onClick={handleBack}><X size={32} /></button>
          </div>
        )}

        {showToast && (
          <div className="center-toast">
            {toastMessage.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        )}

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; font-family: 'Noto Serif KR', serif; }
          
          .full-container { position: fixed; inset: 0; display: flex; justify-content: center; align-items: center; }

          /* 메인 화면 레이아웃 */
          .main-viewport { position: relative; width: 100%; height: 100%; max-width: 450px; }
          @media screen and (min-width: 1025px) { .main-viewport { border-inline: 1px solid #333; } }
          .full-bg { width: 100%; height: 100%; object-fit: cover; }
          .main-ui { position: absolute; inset: 0; z-index: 10; display: flex; flex-direction: column; justify-content: space-between; padding: 10vh 0 8vh; background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent, rgba(0,0,0,0.5)); }
          
          .top-title h1 { font-size: 4rem; margin: 0; color: #1a1a1a; text-align: center; }
          .top-title p { color: #333; text-align: center; font-size: 1.2rem; }
          .bottom-nav { display: flex; justify-content: space-around; width: 100%; }
          .bottom-nav button { background: none; border: none; color: white; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; }

          /* 추모관 데스크탑 전체 화면 */
          .gallery-viewport { position: fixed; inset: 0; z-index: 50; width: 100vw; height: 100vh; background: #000; }
          .full-viewer { width: 100%; height: 100%; }
          .scene-badge { position: absolute; top: 30px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); border: 2px solid #ef4444; color: white; padding: 10px 30px; border-radius: 8px; font-weight: bold; font-size: 1.2rem; z-index: 60; }
          .gallery-exit { position: absolute; top: 30px; right: 30px; z-index: 60; background: rgba(0,0,0,0.5); border: 1px solid #fff; border-radius: 50%; width: 50px; height: 50px; color: white; display: flex; align-items: center; justify-content: center; }

          /* 3D 화살표 및 아이콘 */
          .road-arrow { width: 50px; height: 70px; background: #ef4444; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); transform: translate(-50%, -50%) rotateX(60deg); cursor: pointer; }
          .room-tag { background: rgba(0,0,0,0.75); border: 2px solid #ef4444; color: white; padding: 6px 16px; border-radius: 6px; font-weight: bold; transform: translate(-50%, -50%); white-space: nowrap; }

          /* 토스트 정렬 */
          .center-toast { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.85); color: white; padding: 20px 40px; border-radius: 20px; z-index: 500; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .flower-anim { position: absolute; left: 50%; bottom: 25%; z-index: 100; animation: up-fade 2.6s forwards; }
          @keyframes up-fade { 0% { transform: translate(-50%, 0) scale(0.7); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(-50%, -150px) scale(1.1); opacity: 0; } }
        `}</style>
      </div>
    </>
  );
}