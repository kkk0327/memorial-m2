"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Flower2, Landmark, NotebookPen, X, Send } from 'lucide-react';

// === 오직 사용자님께서 지정하신 새로운 파일들만 사용합니다 ===
const SCENE_CONFIG = {
  'Panorama01': {
    img: '/images/Panorama01.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -35 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 0, yaw: -30 },
      { type: 'room', target: 'office', text: '오피스', pitch: 10, yaw: 30 },
      { type: 'room', target: 'dis', text: '전시관', pitch: 10, yaw: 45 },
      { type: 'room', target: 'jip', text: '집회장', pitch: 0, yaw: 40 },
      { type: 'nav', target: 'Panorama02', color: '#ef4444', symbol: '▲', pitch: -10, yaw: 0, targetYaw: 0 }
    ]
  },
  'Panorama02': {
    img: '/images/Panorama02.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -40 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 0, yaw: -35 },
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 10, yaw: -5 },
      { type: 'room', target: 'office', text: '오피스', pitch: 10, yaw: 25 },
      { type: 'room', target: 'dis', text: '전시관', pitch: 10, yaw: 40 },
      { type: 'room', target: 'jip', text: '집회장', pitch: 0, yaw: 35 },
      { type: 'nav', target: 'Panorama03', color: '#ef4444', symbol: '▲', pitch: -10, yaw: 0, targetYaw: 0 },
      { type: 'nav', target: 'Panorama01', color: '#3b82f6', symbol: '▼', pitch: -15, yaw: 180, targetYaw: 180 }
    ]
  },
  'Panorama03': {
    img: '/images/Panorama03.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -30 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 0, yaw: -25 },
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 10, yaw: 10 },
      { type: 'nav', target: 'Panorama04', color: '#ef4444', symbol: '▲', pitch: -10, yaw: 0, targetYaw: 0 },
      { type: 'nav', target: 'Panorama02', color: '#3b82f6', symbol: '▼', pitch: -15, yaw: 180, targetYaw: 180 }
    ]
  },
  'Panorama04': {
    img: '/images/Panorama04.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -25 },
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 10, yaw: 25 },
      { type: 'nav', target: 'Panorama05', color: '#ef4444', symbol: '▲', pitch: -10, yaw: 0, targetYaw: 0 },
      { type: 'nav', target: 'Panorama03', color: '#3b82f6', symbol: '▼', pitch: -15, yaw: 180, targetYaw: 180 }
    ]
  },
  'Panorama05': {
    img: '/images/Panorama05.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -15 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 0, yaw: -10 },
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 10, yaw: -45 },
      { type: 'room', target: 'bong03', text: '봉안당 3', pitch: 10, yaw: 30 },
      { type: 'nav', target: 'Panorama07', color: '#ef4444', symbol: '▲', pitch: -10, yaw: 45, targetYaw: 45 },
      { type: 'nav', target: 'Panorama06', color: '#10b981', symbol: '▲', pitch: -10, yaw: 0, targetYaw: 0 },
      { type: 'nav', target: 'Panorama04', color: '#3b82f6', symbol: '▼', pitch: -15, yaw: -150, targetYaw: -150 }
    ]
  },
  'Panorama06': {
    img: '/images/Panorama06.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 10, yaw: -45 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 0, yaw: -40 },
      { type: 'room', target: 'bong03', text: '봉안당 3', pitch: 10, yaw: 35 },
      { type: 'room', target: 'cafe', text: '카페', pitch: 10, yaw: 10 },
      { type: 'nav', target: 'Panorama05', color: '#3b82f6', symbol: '▼', pitch: -15, yaw: 160, targetYaw: 160 }
    ]
  },
  'Panorama07': {
    img: '/images/Panorama07.png',
    hotspots: [
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 10, yaw: 45 },
      { type: 'room', target: 'bong03', text: '봉안당 3', pitch: 10, yaw: -45 },
      { type: 'nav', target: 'Panorama08', color: '#ef4444', symbol: '▲', pitch: -10, yaw: 0, targetYaw: 0 },
      { type: 'nav', target: 'Panorama05', color: '#3b82f6', symbol: '▼', pitch: -15, yaw: -135, targetYaw: -135 }
    ]
  },
  'Panorama08': {
    img: '/images/Panorama08.png',
    hotspots: [
      { type: 'room', target: 'hotel', text: '호텔', pitch: 10, yaw: -5 },
      { type: 'room', target: 'pat', text: '팻시설', pitch: 10, yaw: 15 },
      { type: 'nav', target: 'Panorama07', color: '#3b82f6', symbol: '▼', pitch: -15, yaw: -150, targetYaw: -150 }
    ]
  },
  // === 세부 공간 ===
  'bong01': { img: '/images/bong01.jpg', hotspots: [] },
  'bong02': { img: '/images/bong02.jpg', hotspots: [] },
  'bong03': { 
    img: '/images/bong03.jpg', 
    hotspots: [
      { type: 'room', target: 'family', text: '가족추모실', pitch: 5, yaw: -20 },
      { type: 'room', target: 'per', text: '개인추모실', pitch: 5, yaw: 20 }
    ] 
  },
  'res': { img: '/images/res.jpg', hotspots: [] },
  'office': { img: '/images/office.jpg', hotspots: [] },
  'dis': { img: '/images/dis.jpg', hotspots: [] },
  'jip': { img: '/images/jip.jpg', hotspots: [] },
  'cafe': { img: '/images/cafe.jpg', hotspots: [] },
  'hotel': { img: '/images/hotel.jpg', hotspots: [] },
  'pat': { img: '/images/pat.jpg', hotspots: [] },
  'family': { img: '/images/family.jpg', hotspots: [] },
  'per': { img: '/images/per.jpg', hotspots: [] }
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
    { id: 2, name: "이영희", msg: "영원히 기억하겠습니다. 사랑합니다.", date: "2026.02.11" },
  ]);

  const viewerRef = useRef(null);
  const pannellumInstance = useRef(null);

  const displayToast = (msgArray) => {
    setToastMessage(msgArray);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFlower = () => {
    if (hasFlowered) {
      displayToast(["이미 헌화하셨습니다.", "따뜻한 마음 감사합니다."]);
      return;
    }
    setHasFlowered(true);
    setIsFlowering(true);
    setTimeout(() => setIsFlowering(false), 2600);
  };

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

  const handleGuestbookSubmit = (e) => {
    e.preventDefault();
    if (!inputName.trim() || !inputMsg.trim()) {
      displayToast(["이름과 내용을", "모두 입력해주세요."]);
      return;
    }
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    setGuestbookList([{ id: Date.now(), name: inputName, msg: inputMsg, date: today }, ...guestbookList]);
    setInputName(""); setInputMsg("");
    displayToast(["방명록이 등록되었습니다."]);
  };

  useEffect(() => {
    if (activeMenu === 'gallery' && isPannellumLoaded && window.pannellum) {
      if (pannellumInstance.current) { pannellumInstance.current.destroy(); }
      const data = SCENE_CONFIG[currentScene];
      pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
        type: "equirectangular",
        panorama: data.img,
        pitch: initView.pitch,
        yaw: initView.yaw,
        autoLoad: true,
        showControls: false,
        hotSpots: data.hotspots.map(hs => ({
          pitch: hs.pitch, yaw: hs.yaw,
          cssClass: "custom-hotspot",
          createTooltipFunc: (div) => {
            if (hs.type === 'nav') {
              div.innerHTML = `<div class="nav-arrow" style="color:${hs.color}">${hs.symbol}</div>`;
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
      <div className="portrait-lock-container">
        {activeMenu === 'main' && (
          <div className="main-wrap">
            <img src="/images/main.jpg" className="bg-img" />
            <div className="main-content">
              <h1>추모관</h1>
              <p>영원한 안식, 함께 기억합니다</p>
              <div className="nav-btns">
                <button onClick={handleFlower}><Flower2 color="white" /><span>헌화</span></button>
                <button onClick={handleEnterGallery}><Landmark color="white" /><span>추모관</span></button>
                <button onClick={() => setShowGuestbook(true)}><NotebookPen color="white" /><span>방명록</span></button>
              </div>
            </div>
            {isFlowering && <div className="flower-anim"><img src="/images/guk.png" /></div>}
          </div>
        )}

        {showGuestbook && (
          <div className="modal-overlay" onClick={() => setShowGuestbook(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h3>방명록</h3><button onClick={() => setShowGuestbook(false)}><X /></button></div>
              <div className="guest-list">
                {guestbookList.map(item => (
                  <div key={item.id} className="guest-item">
                    <div className="guest-info"><span>{item.name}</span><small>{item.date}</small></div>
                    <p>{item.msg}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleGuestbookSubmit} className="guest-form">
                <input type="text" placeholder="이름" value={inputName} onChange={e => setInputName(e.target.value)} maxLength={10} />
                <div className="row">
                  <input type="text" placeholder="마음을 남겨주세요" value={inputMsg} onChange={e => setInputMsg(e.target.value)} />
                  <button type="submit"><Send size={18} /></button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeMenu === 'gallery' && (
          <div className="pano-view">
            <div ref={viewerRef} className="viewer" />
            <button className="close-btn" onClick={handleBack}><X size={28} /></button>
          </div>
        )}

        {showToast && (
          <div className="toast">
            {toastMessage.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        )}

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');
          body { margin: 0; background: #000; overflow: hidden; font-family: 'Noto Serif KR', serif; }
          .portrait-lock-container { position: fixed; inset: 0; background: #000; display: flex; flex-direction: column; }
          @media screen and (min-width: 1025px) { .portrait-lock-container { max-width: 450px; left: 50%; transform: translateX(-50%); border-inline: 1px solid #333; } }
          
          .main-wrap { position: relative; width: 100%; height: 100%; }
          .bg-img { width: 100%; height: 100%; object-fit: cover; }
          .main-content { position: absolute; inset: 0; z-index: 10; display: flex; flex-direction: column; justify-content: space-between; padding: 10vh 0 8vh; text-align: center; background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent, rgba(0,0,0,0.5)); }
          h1 { font-size: 4rem; margin: 0; color: #1a1a1a; }
          .nav-btns { display: flex; justify-content: space-around; max-width: 400px; margin: 0 auto; width: 100%; }
          .nav-btns button { background: none; border: none; display: flex; flex-direction: column; alignItems: center; gap: 5px; color: white; cursor: pointer; }
          
          .flower-anim { position: absolute; left: 50%; bottom: 25%; z-index: 100; animation: flower-fade 2.6s ease-out forwards; }
          @keyframes flower-fade { 0% { transform: translate(-50%, 0) scale(0.7); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(-50%, -150px) scale(1.1); opacity: 0; } }
          
          .room-tag { background: rgba(0,0,0,0.7); border: 2px solid #ef4444; border-radius: 6px; color: white; padding: 4px 12px; font-weight: bold; white-space: nowrap; transform: translate(-50%, -50%); }
          .nav-arrow { font-size: 50px; text-shadow: 0 0 10px rgba(255,255,255,0.5); transform: translate(-50%, -50%); cursor: pointer; }
          
          .pano-view { position: fixed; inset: 0; z-index: 50; }
          .viewer { width: 100%; height: 100%; }
          .close-btn { position: absolute; top: 30px; right: 20px; z-index: 60; background: rgba(0,0,0,0.5); border: 1px solid #555; border-radius: 50%; width: 44px; height: 44px; color: white; display: flex; align-items: center; justify-content: center; }

          .toast { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.85); color: white; padding: 16px 32px; border-radius: 20px; z-index: 500; text-align: center; }
          .modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.7); display: flex; align-items: flex-end; justify-content: center; }
          .modal-content { width: 100%; max-width: 450px; height: 80%; background: #1a1a1a; border-radius: 20px 20px 0 0; display: flex; flex-direction: column; color: white; }
          .modal-header { padding: 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; }
          .guest-list { flex: 1; overflow-y: auto; padding: 20px; }
          .guest-item { margin-bottom: 15px; border-bottom: 1px solid #2a2a2a; padding-bottom: 10px; }
          .guest-info { display: flex; justify-content: space-between; color: #fbbf24; margin-bottom: 5px; }
          .guest-form { padding: 20px; background: #111; display: flex; flex-direction: column; gap: 10px; }
          .guest-form input { padding: 12px; border-radius: 8px; border: none; background: #333; color: white; }
          .row { display: flex; gap: 8px; }
          .row input { flex: 1; }
          .row button { background: #fbbf24; border: none; padding: 0 15px; border-radius: 8px; font-weight: bold; }
          input::placeholder { color: #ccc; }
        `}</style>
      </div>
    </>
  );
}