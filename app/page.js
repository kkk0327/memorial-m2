"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Flower2, Landmark, NotebookPen, X, Send } from 'lucide-react';

export default function MemorialApp() {
  const [hasFlowered, setHasFlowered] = useState(false);
  const [activeMenu, setActiveMenu] = useState('main'); 
  const [galleryTab, setGalleryTab] = useState('picture'); 
  const [selectedContent, setSelectedContent] = useState(null); 
  const [isPannellumLoaded, setIsPannellumLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); 
  const [showToast, setShowToast] = useState(false);
  const [isFlowering, setIsFlowering] = useState(false);
  
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
  const popupVideoRef = useRef(null);

  const displayToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFlower = () => {
    if (hasFlowered) {
      displayToast("이미 헌화하셨습니다. 따뜻한 마음 감사합니다.");
      return;
    }
    setHasFlowered(true);
    setIsFlowering(true);
    // 3초 후 꽃 이미지를 사라지게 함
    setTimeout(() => setIsFlowering(false), 3000);
  };

  const handleEnterGallery = () => setActiveMenu('gallery');
  const handleTabChange = (tab) => setGalleryTab(tab);

  const handleGuestbookSubmit = (e) => {
    e.preventDefault();
    if (!inputName.trim() || !inputMsg.trim()) {
      displayToast("이름과 내용을 모두 입력해주세요.");
      return;
    }
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const newEntry = { id: Date.now(), name: inputName, msg: inputMsg, date: today };
    setGuestbookList([newEntry, ...guestbookList]);
    setInputName("");
    setInputMsg("");
    displayToast("방명록이 등록되었습니다.");
  };

  useEffect(() => {
    if (activeMenu === 'gallery' && isPannellumLoaded && !selectedContent && window.pannellum) {
      if (pannellumInstance.current) {
        try { pannellumInstance.current.destroy(); } catch(e) {}
      }

      const config = {
        picture: { 
          img: "/images/panorama_picture.jpg", 
          hotspots: [
            { pitch: -5, yaw: -30, type: "photo", text: "고인의 독사진", src: "/images/picture_01.jpg" },
            { pitch: 5, yaw: 0, type: "photo", text: "가족들과 함께", src: "/images/picture_02.jpg" },
            { pitch: -5, yaw: 30, type: "photo", text: "환한 미소", src: "/images/picture_03.jpg" }
          ]
        },
        video: { 
          img: "/images/panorama_video.jpg", 
          hotspots: [
            { pitch: 0, yaw: -20, type: "video", text: "규빗홍보영상", src: "/images/video_01.mp4" },
            { pitch: 0, yaw: 20, type: "video", text: "과천농협", src: "/images/video_02.mp4" },
            { pitch: 0, yaw: 55, type: "video", text: "전시실", src: "/images/video_03.mp4" }
          ]
        },
        relics: { 
          img: "/images/panorama_relics.jpg", 
          hotspots: [
            { pitch: -10, yaw: -30, type: "photo", text: "자주 사용하시던 가방", src: "/images/relics_01.jpg" },
            { pitch: -10, yaw: 0, type: "photo", text: "도장", src: "/images/relics_02.jpg" },
            { pitch: -10, yaw: 30, type: "photo", text: "안경, 안경집", src: "/images/relics_03.jpg" }
          ]
        }
      };

      const currentData = config[galleryTab];

      pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
        type: "equirectangular",
        panorama: currentData.img,
        autoLoad: true,
        showControls: false,
        hotSpots: currentData.hotspots.map(hs => ({
          pitch: hs.pitch,
          yaw: hs.yaw,
          cssClass: "custom-hotspot-wrapper",
          createTooltipFunc: (hotSpotDiv) => {
            if (hs.type === "photo") {
              hotSpotDiv.innerHTML = `<div class="hotspot-card"><img src="${hs.src}" class="hotspot-img" /><div class="hotspot-label">${hs.text}</div></div>`;
            } else {
              hotSpotDiv.innerHTML = `<div class="hotspot-card"><video src="${hs.src}" muted autoplay loop playsinline class="hotspot-img"></video><div class="play-icon">▶</div><div class="hotspot-label">${hs.text}</div></div>`;
            }
          },
          clickHandlerFunc: () => setSelectedContent(hs)
        }))
      });
    }
  }, [activeMenu, galleryTab, selectedContent, isPannellumLoaded]);

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
      <Script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js" strategy="afterInteractive" onLoad={() => setIsPannellumLoaded(true)} />
      
      <div className="portrait-lock-container">
        {/* 메인 화면 */}
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

            {/* 국화 애니메이션 복구 */}
            {isFlowering && (
              <div className="flower-up">
                <img src="/images/guk.png" alt="꽃" style={{ width: '120px', filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6)) drop-shadow(0 0 2px white)' }} />
              </div>
            )}
          </div>
        )}

        {/* 방명록 모달 */}
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

        {/* 갤러리 뷰어 */}
        {activeMenu === 'gallery' && !selectedContent && (
          <div className="viewer-container" style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
            <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
            <div className="tab-menu" style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 60, background: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '30px' }}>
              {['picture', 'video', 'relics'].map(tab => (
                <button key={tab} onClick={() => handleTabChange(tab)} style={{ padding: '8px 15px', borderRadius: '20px', border: 'none', color: 'white', background: galleryTab === tab ? 'rgba(255,255,255,0.3)' : 'transparent', fontSize: '0.8rem' }}>
                  {tab === 'picture' ? '사진관' : tab === 'video' ? '영상관' : '유품관'}
                </button>
              ))}
            </div>
            <button style={{ position: 'absolute', top: '30px', right: '20px', zIndex: 60, color: 'white', background: 'none', border: 'none' }} onClick={() => setActiveMenu('main')}><X size={30} /></button>
          </div>
        )}

        {/* 상세 팝업 */}
        {selectedContent && (
          <div className="popup-overlay" style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedContent(null)}>
            <div className="popup-content" style={{ position: 'relative', width: '100%', maxWidth: '400px', textAlign: 'center', color: 'white' }} onClick={e => e.stopPropagation()}>
              {selectedContent.type === 'video' ? (
                <video src={selectedContent.src} controls autoPlay muted playsInline style={{ width: '100%', borderRadius: '12px' }} />
              ) : (
                <img src={selectedContent.src} style={{ width: '100%', borderRadius: '12px' }} alt="상세" />
              )}
              <p style={{ marginTop: '20px', fontSize: '1.1rem' }}>{selectedContent.text}</p>
              <button style={{ position: 'absolute', top: '-50px', right: 0, background: 'none', border: 'none', color: 'white' }} onClick={() => setSelectedContent(null)}><X size={30} /></button>
            </div>
          </div>
        )}

        {showToast && <div className="toast" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '15px 30px', borderRadius: '30px', zIndex: 500 }}>{toastMessage}</div>}

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');
          body { margin: 0; background: #000; overflow: hidden; }
          .portrait-lock-container { position: fixed; inset: 0; display: flex; flex-direction: column; background: #000; }
          
          /* 데스크탑에서 비율 유지 및 중앙 정렬 */
          @media screen and (min-width: 1025px) {
            .portrait-lock-container { max-width: 450px; left: 50%; transform: translateX(-50%); border-left: 1px solid #333; border-right: 1px solid #333; }
          }

          /* 국화 솟아오르는 애니메이션 정의 */
          @keyframes flower-up {
            0% { transform: translate(-50%, 80vh) scale(0.6); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translate(-50%, -20vh) scale(1.3); opacity: 0; }
          }
          .flower-up { position: absolute; left: 50%; bottom: 0; z-index: 100; pointer-events: none; animation: flower-up 3s ease-out forwards; }

          /* 방명록 모달 디자인 */
          .modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.7); display: flex; align-items: flex-end; justify-content: center; }
          .modal-content { width: 100%; max-width: 450px; height: 80%; background: #1a1a1a; border-radius: 20px 20px 0 0; display: flex; flex-direction: column; }
          .modal-header { padding: 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; color: white; }
          .guestbook-list { flex: 1; overflow-y: auto; padding: 20px; }
          .guestbook-item { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #2a2a2a; }
          .item-info { display: flex; justify-content: space-between; color: #fbbf24; font-size: 0.9rem; margin-bottom: 5px; }
          .item-info small { color: #888; }
          .guestbook-item p { color: #eee; margin: 0; }
          .guestbook-form { padding: 20px; background: #111; display: flex; flex-direction: column; gap: 10px; }
          
          .custom-hotspot-wrapper { width: 60px; height: 60px; cursor: pointer; border: 2px solid white; border-radius: 10px; overflow: hidden; position: relative; }
          .hotspot-img { width: 100%; height: 100%; object-fit: cover; }
          .hotspot-label { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.7); font-size: 10px; color: white; text-align: center; padding: 2px 0; }
          .play-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 20px; opacity: 0.8; }
          
          input::placeholder { color: #ccc; }
        `}</style>
      </div>
    </>
  );
}