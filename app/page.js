"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Flower2, Landmark, NotebookPen, X, Image as ImageIcon, Film, Gift, Send } from 'lucide-react';

export default function MemorialApp() {
  const [flowerCount, setFlowerCount] = useState(1240);
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
    setFlowerCount(prev => prev + 1);
    setHasFlowered(true);
    setIsFlowering(true);
    setTimeout(() => setIsFlowering(false), 2500);
  };

  const handleEnterGallery = () => {
    setActiveMenu('gallery');
  };

  const handleTabChange = (tab) => {
    setGalleryTab(tab);
  };

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
    if (selectedContent && selectedContent.type === 'video' && popupVideoRef.current) {
      const playPromise = popupVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.log("Auto-play prevented:", error));
      }
    }
  }, [selectedContent]);

  useEffect(() => {
    window.scrollTo(0, 1);

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
        hotSpots: (currentData.hotspots || []).map(hs => ({
          pitch: hs.pitch,
          yaw: hs.yaw,
          cssClass: "custom-hotspot-wrapper",
          createTooltipFunc: (hotSpotDiv) => {
            if (hs.type === "photo") {
              hotSpotDiv.innerHTML = `<div class="hotspot-card"><img src="${hs.src}" class="hotspot-img" /><div class="hotspot-label">${hs.text}</div></div>`;
            } else if (hs.type === "video") {
              hotSpotDiv.innerHTML = `<div class="hotspot-card video-card"><video src="${hs.src}" muted autoplay loop playsinline webkit-playsinline onloadeddata="this.play();" class="hotspot-img"></video><div class="play-icon">▶</div><div class="hotspot-label">${hs.text}</div></div>`;
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
      <Script 
        src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        strategy="afterInteractive"
        onLoad={() => setIsPannellumLoaded(true)}
      />
      
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />

      <div className="portrait-lock-container">
        {/* 메인 화면 */}
        {activeMenu === 'main' && (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img src="/images/main.jpg" alt="Main" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent, rgba(0,0,0,0.3))', zIndex: 1 }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ marginTop: '7vh', textAlign: 'center' }}>
                <h1 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: '4.5rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '-1.4rem' }}>추모관</h1>
                <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: '1.35rem', color: '#333' }}>영원한 안식, 함께 기억합니다</p>
              </div>
              <div style={{ marginBottom: '6vh' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', maxWidth: '400px', margin: '0 auto' }}>
                  <button onClick={handleFlower} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Flower2 size={38} color="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                    <span style={{ color: 'white', fontSize: '0.9rem', marginTop: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>헌화</span>
                  </button>
                  <button onClick={handleEnterGallery} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Landmark size={42} color="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                    <span style={{ color: 'white', fontSize: '0.9rem', marginTop: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>추모관</span>
                  </button>
                  <button onClick={() => setShowGuestbook(true)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <NotebookPen size={38} color="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                    <span style={{ color: 'white', fontSize: '0.9rem', marginTop: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>방명록</span>
                  </button>
                </div>
              </div>
            </div>
            {isFlowering && (
              <div className="flower-animation" style={{ position: 'absolute', left: '50%', bottom: '20%', transform: 'translateX(-50%)', zIndex: 20 }}>
                <img src="/images/guk.png" alt="헌화" style={{ width: '100px', filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 0 6px rgba(255,215,0,0.6))' }} />
              </div>
            )}
          </div>
        )}

        {/* 방명록 모달 */}
        {showGuestbook && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 90, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowGuestbook(false)}>
            <div style={{ width: '100%', maxWidth: '450px', height: '85%', backgroundColor: '#1a1a1a', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333' }}>
                <h2 style={{ color: 'white', margin: 0 }}>방명록</h2>
                <button onClick={() => setShowGuestbook(false)} style={{ background: 'none', border: 'none', color: 'white' }}><X /></button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {guestbookList.map(item => (
                  <div key={item.id} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24', fontSize: '0.9rem' }}>
                      <span>{item.name}</span><span>{item.date}</span>
                    </div>
                    <p style={{ color: 'white', marginTop: '5px' }}>{item.msg}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleGuestbookSubmit} style={{ padding: '20px', background: '#111' }}>
                <input type="text" placeholder="이름" value={inputName} onChange={e => setInputName(e.target.value)} style={{ width: '100%', padding: '10px', background: '#333', border: 'none', color: 'white', marginBottom: '10px', borderRadius: '8px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="추모의 글을 남겨주세요." value={inputMsg} onChange={e => setInputMsg(e.target.value)} style={{ flex: 1, padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '8px' }} />
                  <button type="submit" style={{ padding: '10px 20px', background: '#fbbf24', border: 'none', borderRadius: '8px' }}><Send size={20} /></button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 갤러리 뷰 */}
        {activeMenu === 'gallery' && !selectedContent && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 50 }}>
            <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', top: '2rem', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 60 }}>
              <div style={{ display: 'flex', gap: '5px', padding: '5px', background: 'rgba(0,0,0,0.5)', borderRadius: '99px' }}>
                 {['picture', 'video', 'relics'].map((tab) => (
                   <button key={tab} onClick={() => handleTabChange(tab)} style={{ padding: '8px 20px', borderRadius: '99px', border: 'none', color: 'white', background: galleryTab === tab ? 'rgba(255,255,255,0.3)' : 'transparent' }}>
                     {tab === 'picture' ? '사진관' : tab === 'video' ? '영상관' : '유품관'}
                   </button>
                 ))}
              </div>
            </div>
            <button onClick={() => setActiveMenu('main')} style={{ position: 'absolute', top: '2.2rem', right: '1.8rem', zIndex: 60, background: 'none', border: 'none', color: 'white' }}><X size={28} /></button>
          </div>
        )}

        {/* 상세 상세 상세 팝업 */}
        {selectedContent && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={() => setSelectedContent(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', color: 'white', background: 'none', border: 'none' }}><X size={36} /></button>
            <div style={{ maxWidth: '90%', maxHeight: '70vh' }}>
              {selectedContent.type === 'video' ? (
                <video ref={popupVideoRef} src={selectedContent.src} controls autoPlay muted playsInline style={{ width: '100%', borderRadius: '12px' }} />
              ) : (
                <img src={selectedContent.src} style={{ width: '100%', borderRadius: '12px' }} alt="Detail" />
              )}
            </div>
            <p style={{ marginTop: '20px', color: 'white', fontSize: '1.2rem' }}>{selectedContent.text}</p>
          </div>
        )}

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');
          body { margin: 0; padding: 0; background: #000; overflow: hidden; }
          
          input::placeholder { color: #ccc; }

          /* 기본 컨테이너: 데스크탑 모바일 공통 */
          .portrait-lock-container {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            display: flex; flex-direction: column; background: #000;
          }

          /* 데스크탑 환경 (너비 1025px 이상) */
          @media screen and (min-width: 1025px) {
            .portrait-lock-container {
               max-width: 450px;
               left: 50% !important;
               transform: translateX(-50%) !important;
               border-left: 1px solid #333;
               border-right: 1px solid #333;
            }
          }

          /* 모바일/태블릿 환경 (너비 1024px 이하) */
          @media screen and (max-width: 1024px) {
            /* 기기를 가로로 눕혔을 때만 회전 적용 */
            @media screen and (orientation: landscape) {
              .portrait-lock-container {
                transform: rotate(-90deg) !important;
                transform-origin: center !important;
                width: 100vh !important;
                height: 100vw !important;
                left: 50% !important;
                top: 50% !important;
                margin-left: -50vh !important;
                margin-top: -50vw !important;
              }
            }
          }

          @keyframes fadeInOut { 0% { opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; } }
          @keyframes floatAndFade { 0% { opacity: 0; transform: translate(-50%, 20px); } 100% { opacity: 0; transform: translate(-50%, -150px); } }
          .flower-animation { animation: floatAndFade 2.5s ease-out forwards; }
          .custom-hotspot-wrapper { width: 60px; height: 60px; cursor: pointer; border: 2px solid white; border-radius: 10px; overflow: hidden; }
          .hotspot-img { width: 100%; height: 100%; object-fit: cover; }
          .hotspot-label { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.6); color: white; font-size: 10px; text-align: center; }
        `}</style>
      </div>
    </>
  );
}