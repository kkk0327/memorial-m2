"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Flower2, Landmark, NotebookPen, X, Send } from 'lucide-react';

// === [파노라마 씬 설정] ===
// pitch(상하 각도), yaw(좌우 각도)는 기본값으로 임의 배치되어 있습니다.
// 실제 이미지에 맞게 이 수치들을 나중에 조금씩 수정하시면 됩니다.
const SCENE_CONFIG = {
  'Panorama01': {
    img: '/images/Panorama01.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 5, yaw: -40 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 5, yaw: -20 },
      { type: 'room', target: 'office', text: '오피스', pitch: 5, yaw: 20 },
      { type: 'room', target: 'dis', text: '전시관', pitch: 5, yaw: 40 },
      { type: 'room', target: 'jip', text: '집회장', pitch: 5, yaw: 60 },
      { type: 'nav', target: 'Panorama02', color: '#ef4444', symbol: '▲', pitch: -10, yaw: 0, targetPitch: 0, targetYaw: 0 } // 빨간 화살표 (직진)
    ]
  },
  'Panorama02': {
    img: '/images/Panorama02.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 5, yaw: -45 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 5, yaw: -30 },
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 5, yaw: -15 },
      { type: 'room', target: 'office', text: '오피스', pitch: 5, yaw: 15 },
      { type: 'room', target: 'dis', text: '전시관', pitch: 5, yaw: 30 },
      { type: 'room', target: 'jip', text: '집회장', pitch: 5, yaw: 45 },
      { type: 'nav', target: 'Panorama03', color: '#ef4444', symbol: '▲', pitch: -10, yaw: 0, targetPitch: 0, targetYaw: 0 }, // 빨간 화살표 (직진)
      { type: 'nav', target: 'Panorama01', color: '#3b82f6', symbol: '▼', pitch: -10, yaw: 180, targetPitch: 0, targetYaw: 180 } // 파란 화살표 (뒤로)
    ]
  },
  'Panorama03': {
    img: '/images/Panorama03.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 5, yaw: -30 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 5, yaw: -15 },
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 5, yaw: 15 },
      { type: 'nav', target: 'Panorama04', color: '#ef4444', symbol: '▲', pitch: -10, yaw: 0, targetPitch: 0, targetYaw: 0 }, 
      { type: 'nav', target: 'Panorama02', color: '#3b82f6', symbol: '▼', pitch: -10, yaw: 180, targetPitch: 0, targetYaw: 180 }
    ]
  },
  'Panorama04': {
    img: '/images/Panorama04.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 5, yaw: -20 },
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 5, yaw: 20 },
      { type: 'nav', target: 'Panorama05', color: '#ef4444', symbol: '▲', pitch: -10, yaw: 0, targetPitch: 0, targetYaw: 0 }, 
      { type: 'nav', target: 'Panorama03', color: '#3b82f6', symbol: '▼', pitch: -10, yaw: 180, targetPitch: 0, targetYaw: 180 }
    ]
  },
  'Panorama05': {
    img: '/images/Panorama05.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 5, yaw: -45 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 5, yaw: -30 },
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 5, yaw: -15 },
      { type: 'room', target: 'bong03', text: '봉안당 3', pitch: 5, yaw: 15 },
      { type: 'nav', target: 'Panorama07', color: '#ef4444', symbol: '▲', pitch: -10, yaw: 30, targetPitch: 0, targetYaw: 0 }, // 우측 대각선 직진
      { type: 'nav', target: 'Panorama06', color: '#10b981', symbol: '▲', pitch: -10, yaw: -30, targetPitch: 0, targetYaw: 0 }, // 좌측 대각선 분기점(녹색)
      { type: 'nav', target: 'Panorama04', color: '#3b82f6', symbol: '▼', pitch: -10, yaw: 180, targetPitch: 0, targetYaw: 180 }
    ]
  },
  'Panorama06': {
    img: '/images/Panorama06.png',
    hotspots: [
      { type: 'room', target: 'bong01', text: '봉안당 1', pitch: 5, yaw: -45 },
      { type: 'room', target: 'res', text: '레스토랑', pitch: 5, yaw: -15 },
      { type: 'room', target: 'bong03', text: '봉안당 3', pitch: 5, yaw: 15 },
      { type: 'room', target: 'cafe', text: '카페', pitch: 5, yaw: 45 },
      { type: 'nav', target: 'Panorama05', color: '#3b82f6', symbol: '▼', pitch: -10, yaw: 180, targetPitch: 0, targetYaw: 180 }
    ]
  },
  'Panorama07': {
    img: '/images/Panorama07.png',
    hotspots: [
      { type: 'room', target: 'bong02', text: '봉안당 2', pitch: 5, yaw: -20 },
      { type: 'room', target: 'bong03', text: '봉안당 3', pitch: 5, yaw: 20 },
      { type: 'nav', target: 'Panorama08', color: '#ef4444', symbol: '▲', pitch: -10, yaw: 0, targetPitch: 0, targetYaw: 0 }, 
      { type: 'nav', target: 'Panorama05', color: '#3b82f6', symbol: '▼', pitch: -10, yaw: 180, targetPitch: 0, targetYaw: 180 }
    ]
  },
  'Panorama08': {
    img: '/images/Panorama08.png',
    hotspots: [
      { type: 'room', target: 'hotel', text: '호텔', pitch: 5, yaw: -20 },
      { type: 'room', target: 'pat', text: '팻시설', pitch: 5, yaw: 20 },
      { type: 'nav', target: 'Panorama07', color: '#3b82f6', symbol: '▼', pitch: -10, yaw: 180, targetPitch: 0, targetYaw: 180 }
    ]
  },
  // === [세부 공간 (방)] ===
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
  const [hasFlowered, setHasFlowered] = useState(false);
  const [activeMenu, setActiveMenu] = useState('main'); 
  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [isFlowering, setIsFlowering] = useState(false);
  
  // === 네비게이션 상태 ===
  const [currentScene, setCurrentScene] = useState('Panorama01');
  const [sceneHistory, setSceneHistory] = useState([]); // 이전 화면 히스토리 스택
  const [initView, setInitView] = useState({ pitch: 0, yaw: 0 }); // 화면 이동 시 초기 시선 방향
  
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputMsg, setInputMsg] = useState("");
  const [guestbookList, setGuestbookList] = useState([
    { id: 1, name: "김철수", msg: "좋은 곳에서 편히 쉬시길 바랍니다.", date: "2026.02.12" },
    { id: 2, name: "이영희", msg: "영원히 기억하겠습니다. 사랑합니다.", date: "2026.02.11" },
    { id: 3, name: "박지민", msg: "그곳에선 아프지 말고 행복하세요.", date: "2026.02.10" },
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
    // 현재 보고 있는 시야각을 저장하고 이동
    const currentPitch = pannellumInstance.current.getPitch();
    const currentYaw = pannellumInstance.current.getYaw();
    
    setSceneHistory([...sceneHistory, { scene: currentScene, pitch: currentPitch, yaw: currentYaw }]);
    
    // 대상 씬의 초기 시야각 설정 (설정값이 없으면 0)
    setInitView({ pitch: hs.targetPitch || 0, yaw: hs.targetYaw || 0 });
    setCurrentScene(hs.target);
  };

  const handleBack = () => {
    if (sceneHistory.length === 0) {
      setActiveMenu('main'); // 히스토리가 없으면 메인으로 복귀
    } else {
      const historyCopy = [...sceneHistory];
      const prev = historyCopy.pop(); // 직전 화면 꺼내기
      setSceneHistory(historyCopy);
      setInitView({ pitch: prev.pitch, yaw: prev.yaw }); // 돌아갈 땐 아까 보던 방향 그대로
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
    const newEntry = { id: Date.now(), name: inputName, msg: inputMsg, date: today };
    setGuestbookList([newEntry, ...guestbookList]);
    setInputName("");
    setInputMsg("");
    displayToast(["방명록이 등록되었습니다."]);
  };

  useEffect(() => {
    if (activeMenu === 'gallery' && isPannellumLoaded && window.pannellum) {
      if (pannellumInstance.current) {
        try { pannellumInstance.current.destroy(); } catch(e) {}
      }

      const sceneData = SCENE_CONFIG[currentScene];

      pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
        type: "equirectangular",
        panorama: sceneData.img,
        pitch: initView.pitch,
        yaw: initView.yaw,
        autoLoad: true,
        showControls: false,
        hotSpots: (sceneData.hotspots || []).map(hs => ({
          pitch: hs.pitch,
          yaw: hs.yaw,
          cssClass: "custom-hotspot-wrapper",
          createTooltipFunc: (hotSpotDiv) => {
            if (hs.type === 'nav') {
              hotSpotDiv.innerHTML = `<div class="nav-arrow" style="color: ${hs.color}; text-shadow: 0 0 15px rgba(255,255,255,0.8);">${hs.symbol}</div>`;
            } else {
              hotSpotDiv.innerHTML = `<div class="room-box">${hs.text}</div>`;
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
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img src="/images/main.jpg" alt="Main" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent, rgba(0,0,0,0.5))' }} />
            
            <div style={{ position: 'absolute', top: '10vh', width: '100%', textAlign: 'center', zIndex: 10 }}>
              <h1 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: '4rem', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>추모관</h1>
              <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: '1.2rem', color: '#333' }}>영원한 안식, 함께 기억합니다</p>
            </div>

            <div style={{ position: 'absolute', bottom: '8vh', width: '100%', zIndex: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '400px', margin: '0 auto' }}>
                <button onClick={handleFlower} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Flower2 size={35} color="white" />
                  <span style={{ color: 'white', fontSize: '0.85rem', marginTop: '5px' }}>헌화</span>
                </button>
                <button onClick={handleEnterGallery} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Landmark size={38} color="white" />
                  <span style={{ color: 'white', fontSize: '0.85rem', marginTop: '5px' }}>추모관</span>
                </button>
                <button onClick={() => setShowGuestbook(true)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <NotebookPen size={35} color="white" />
                  <span style={{ color: 'white', fontSize: '0.85rem', marginTop: '5px' }}>방명록</span>
                </button>
              </div>
            </div>

            {isFlowering && (
              <div className="flower-up-fade">
                <img src="/images/guk.png" alt="꽃" style={{ width: '110px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' }} />
              </div>
            )}
          </div>
        )}

        {showGuestbook && (
          <div className="modal-overlay" onClick={() => setShowGuestbook(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>방명록</h3>
                <button onClick={() => setShowGuestbook(false)} style={{ background: 'none', border: 'none', color: 'white' }}><X /></button>
              </div>
              <div className="guestbook-list">
                {guestbookList.map(item => (
                  <div key={item.id} className="guestbook-item">
                    <div className="item-info"><span>{item.name}</span><small>{item.date}</small></div>
                    <p>{item.msg}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleGuestbookSubmit} className="guestbook-form">
                <input type="text" placeholder="이름" value={inputName} onChange={e => setInputName(e.target.value)} maxLength={10} style={{ backgroundColor: '#333', color: 'white', border: 'none', padding: '10px', borderRadius: '8px' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" placeholder="마음을 남겨주세요" value={inputMsg} onChange={e => setInputMsg(e.target.value)} style={{ flex: 1, backgroundColor: '#333', color: 'white', border: 'none', padding: '10px', borderRadius: '8px' }} />
                  <button type="submit" style={{ backgroundColor: '#fbbf24', border: 'none', padding: '10px 15px', borderRadius: '8px' }}><Send size={18} /></button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeMenu === 'gallery' && (
          <div className="viewer-container" style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
            <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
            
            {/* 뒤로 가기 / 닫기 공통 버튼 */}
            <button 
              style={{ position: 'absolute', top: '30px', right: '20px', zIndex: 60, color: 'white', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }} 
              onClick={handleBack}
            >
              <X size={28} />
            </button>
          </div>
        )}

        {showToast && (
          <div className="toast">
            {toastMessage.map((line, idx) => (
              <div key={idx} style={{ fontSize: '1rem', marginBottom: idx === 0 && toastMessage.length > 1 ? '4px' : 0 }}>{line}</div>
            ))}
          </div>
        )}

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');
          body { margin: 0; background: #000; overflow: hidden; }
          .portrait-lock-container { position: fixed; inset: 0; display: flex; flex-direction: column; background: #000; }
          
          @media screen and (min-width: 1025px) {
            .portrait-lock-container { max-width: 450px; left: 50%; transform: translateX(-50%); border-left: 1px solid #333; border-right: 1px solid #333; }
          }

          @keyframes flower-up-fade {
            0% { transform: translate(-50%, 0) scale(0.7); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translate(-50%, -150px) scale(1.1); opacity: 0; }
          }
          .flower-up-fade { position: absolute; left: 50%; bottom: 25%; z-index: 100; pointer-events: none; animation: flower-up-fade 2.5s ease-out forwards; }

          /* 파노라마 핫스팟 (텍스트 방/시설 아이콘) 디자인 */
          .room-box {
            background-color: rgba(0, 0, 0, 0.65);
            border: 2px solid #ef4444; /* 빨간색 테두리 */
            border-radius: 8px;
            color: white;
            padding: 6px 14px;
            font-size: 0.95rem;
            font-weight: bold;
            text-align: center;
            white-space: nowrap;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            transform: translate(-50%, -50%);
            transition: transform 0.2s;
          }
          .room-box:hover { transform: translate(-50%, -50%) scale(1.05); background-color: rgba(0, 0, 0, 0.8); }

          /* 파노라마 핫스팟 (이동 화살표) 디자인 */
          .nav-arrow {
            font-size: 55px; /* 화살표 크기 */
            line-height: 1;
            transform: translate(-50%, -50%);
            transition: transform 0.2s;
            cursor: pointer;
          }
          .nav-arrow:hover { transform: translate(-50%, -50%) scale(1.15); }

          .toast { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.85); color: white; padding: 18px 38px; border-radius: 24px; z-index: 500; text-align: center; backdrop-filter: blur(8px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

          .modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.7); display: flex; align-items: flex-end; justify-content: center; }
          .modal-content { width: 100%; max-width: 450px; height: 80%; background: #1a1a1a; border-radius: 20px 20px 0 0; display: flex; flex-direction: column; }
          .modal-header { padding: 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; color: white; }
          .guestbook-list { flex: 1; overflow-y: auto; padding: 20px; }
          .guestbook-item { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #2a2a2a; }
          .item-info { display: flex; justify-content: space-between; color: #fbbf24; font-size: 0.9rem; margin-bottom: 5px; }
          .item-info small { color: #888; }
          .guestbook-item p { color: #eee; margin: 0; font-weight: 300; }
          .guestbook-form { padding: 20px; background: #111; display: flex; flex-direction: column; gap: 10px; }
          
          input::placeholder { color: #ccc; }
        `}</style>
      </div>
    </>
  );
}