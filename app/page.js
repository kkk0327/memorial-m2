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
  
  // 방명록 관련 상태
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
    const newEntry = {
      id: Date.now(),
      name: inputName,
      msg: inputMsg,
      date: today
    };
    setGuestbookList([newEntry, ...guestbookList]);
    setInputName("");
    setInputMsg("");
    displayToast("방명록이 등록되었습니다.");
  };

  // 팝업 비디오 강제 재생 로직
  useEffect(() => {
    if (selectedContent && selectedContent.type === 'video' && popupVideoRef.current) {
      const playPromise = popupVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Auto-play prevented:", error);
        });
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
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />

      <div className="portrait-lock-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', overflow: 'hidden', backgroundColor: 'black' }}>

        {/* ================= 메인 화면 ================= */}
        {activeMenu === 'main' && (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img 
               src="/images/main.jpg" 
               alt="Main Background" 
               style={{ 
                 position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                 objectFit: 'cover', zIndex: 0, pointerEvents: 'none'
               }}
            />
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)',
                zIndex: 1, pointerEvents: 'none'
            }} />

            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              <div style={{ marginTop: '7vh', textAlign: 'center' }}>
                <h1 style={{ 
                    fontFamily: "'Noto Serif KR', serif", 
                    fontSize: '4.5rem', 
                    fontWeight: '700', 
                    color: '#1a1a1a',
                    marginBottom: '-1.4rem', 
                    letterSpacing: '-0.03em'
                }}>
                  추모관
                </h1>
                <p style={{ 
                    fontFamily: "'Noto Serif KR', serif", 
                    fontSize: '1.35rem', 
                    fontWeight: '500', 
                    color: '#333' 
                }}>
                  영원한 안식, 함께 기억합니다
                </p>
              </div>

              <div style={{ marginBottom: '6vh' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', maxWidth: '400px', margin: '0 auto' }}>
                  <button onClick={handleFlower} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none' }}>
                    <Flower2 size={38} color="white" strokeWidth={1.2} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                    <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500', marginTop: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>헌화</span>
                  </button>

                  <button onClick={handleEnterGallery} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none' }}>
                    <Landmark size={42} color="white" strokeWidth={1.2} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                    <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500', marginTop: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>추모관</span>
                  </button>

                  <button onClick={() => setShowGuestbook(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', position: 'relative' }}>
                    <NotebookPen size={38} color="white" strokeWidth={1.2} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                    <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500', marginTop: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>방명록</span>
                    <div style={{ position: 'absolute', right: '-12px', bottom: '26px', color: 'white', fontSize: '1.2rem', opacity: 0.8 }}>✦</div>
                  </button>
                </div>
              </div>
            </div>

            {/* 헌화 애니메이션 */}
            {isFlowering && (
              <div className="flower-animation" style={{ position: 'absolute', left: '50%', bottom: '20%', transform: 'translateX(-50%)', zIndex: 20, pointerEvents: 'none' }}>
                <img 
                  src="/images/guk.png" 
                  alt="헌화" 
                  style={{ 
                    width: '100px', 
                    height: 'auto', 
                    filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 0 6px rgba(255,215,0,0.6)) drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
                  }} 
                />
              </div>
            )}

            {/* 커스텀 토스트 */}
            {showToast && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '16px 28px',
                borderRadius: '50px',
                zIndex: 100,
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                animation: 'fadeInOut 3s ease-in-out'
              }}>
                <p style={{ fontSize: '1.1rem', fontWeight: '500', margin: 0, fontFamily: 'serif' }}>
                  {toastMessage}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= 방명록 모달 ================= */}
        {showGuestbook && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 90,
            backgroundColor: 'rgba(0,0,0,0.3)', 
            backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
          }} onClick={() => setShowGuestbook(false)}>
            
            <div style={{
              width: '100%', height: '85%',
              backgroundColor: '#1a1a1a',
              borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
              animation: 'slideUp 0.3s ease-out'
            }} onClick={e => e.stopPropagation()}>
              
              {/* 헤더 */}
              <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 style={{ color: 'white', fontSize: '1.4rem', fontFamily: "'Noto Serif KR', serif", margin: 0, fontWeight: '700' }}>방명록</h2>
                <button onClick={() => setShowGuestbook(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', padding: '4px' }}>
                  <X size={24} />
                </button>
              </div>

              {/* 리스트 영역 */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                {guestbookList.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '40px' }}>아직 작성된 글이 없습니다.</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {guestbookList.map(item => (
                      <li key={item.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '0.95rem' }}>{item.name}</span>
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{item.date}</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', margin: 0, lineHeight: '1.5', fontWeight: '300' }}>
                          {item.msg}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 입력 폼 */}
              <form onSubmit={handleGuestbookSubmit} style={{ padding: '16px 20px', backgroundColor: '#111', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="이름" 
                  value={inputName} 
                  onChange={(e) => setInputName(e.target.value)}
                  style={{ 
                    backgroundColor: '#333', 
                    border: 'none', borderRadius: '8px', 
                    padding: '10px 14px', color: 'white', fontSize: '0.9rem', outline: 'none' 
                  }}
                  maxLength={10}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="추모의 글을 남겨주세요." 
                    value={inputMsg} 
                    onChange={(e) => setInputMsg(e.target.value)}
                    style={{ 
                      flex: 1, backgroundColor: '#333', 
                      border: 'none', borderRadius: '8px', 
                      padding: '12px 14px', color: 'white', fontSize: '0.95rem', outline: 'none' 
                    }}
                  />
                  <button type="submit" style={{ 
                    backgroundColor: '#fbbf24', color: '#000', border: 'none', borderRadius: '8px', 
                    padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '0.9rem'
                  }}>
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= 추모관 갤러리 ================= */}
        {activeMenu === 'gallery' && !selectedContent && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 50 }}>
            <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', top: '2rem', left: 0, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 60 }}>
              <div style={{ display: 'flex', gap: '4px', padding: '5px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.15)' }}>
                 {['picture', 'video', 'relics'].map((tab) => (
                   <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    style={{
                      padding: '8px 20px', borderRadius: '99px', fontSize: '0.8rem',
                      backgroundColor: galleryTab === tab ? 'rgba(255,255,255,0.25)' : 'transparent',
                      color: 'white', fontWeight: 'bold', border: 'none'
                    }}
                   >
                     {tab === 'picture' ? '사진관' : tab === 'video' ? '영상관' : '유품관'}
                   </button>
                 ))}
              </div>
            </div>
            <button onClick={() => setActiveMenu('main')} style={{ position: 'absolute', top: '2.2rem', right: '1.8rem', zIndex: 60, color: 'white', background: 'none', border: 'none' }}>
              <X size={28} />
            </button>
          </div>
        )}

        {/* ================= 상세 팝업 ================= */}
        {selectedContent && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={() => setSelectedContent(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', color: 'white', background: 'none', border: 'none' }}>
              <X size={36} />
            </button>
            <div style={{ maxWidth: '85%', maxHeight: '75vh' }}>
              {selectedContent.type === 'video' ? (
                <video 
                  ref={popupVideoRef}
                  key={selectedContent.src} 
                  src={selectedContent.src} 
                  controls 
                  autoPlay 
                  muted 
                  playsInline 
                  preload="auto"
                  onError={() => displayToast("영상을 불러올 수 없습니다.")}
                  style={{ width: '100%', borderRadius: '12px' }}
                />
              ) : (
                <img src={selectedContent.src} style={{ width: '100%', borderRadius: '12px' }} alt="상세" />
              )}
            </div>
            <p style={{ marginTop: '2rem', color: 'white', fontSize: '1.4rem', fontFamily: 'serif' }}>{selectedContent.text}</p>
          </div>
        )}

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;700&display=swap');
          body { margin: 0; padding: 0; overscroll-behavior: none; }
          
          /* Placeholder 색상 스타일 추가 (전역 적용) */
          input::placeholder {
            color: #ccc; 
            opacity: 1;
          }

          @media screen and (orientation: landscape) {
            .portrait-lock-container {
              transform: rotate(-90deg);
              transform-origin: center;
              width: 100vh !important;
              height: 100vw !important;
              left: 50% !important;
              top: 50% !important;
              margin-left: -50vh !important;
              margin-top: -50vw !important;
            }
          }

          @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -40%); }
            15% { opacity: 1; transform: translate(-50%, -50%); }
            85% { opacity: 1; transform: translate(-50%, -50%); }
            100% { opacity: 0; transform: translate(-50%, -60%); }
          }

          @keyframes floatAndFade {
            0% { opacity: 0; transform: translate(-50%, 20px) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, 0) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -100px) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -150px) scale(0.9); }
          }
          
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }

          .flower-animation { animation: floatAndFade 2.5s ease-out forwards; }
          
          .custom-hotspot-wrapper { width: 65px; height: 65px; cursor: pointer; }
          
          .hotspot-card { 
            width: 100%; height: 100%; 
            border-radius: 12px; border: 2.5px solid white; 
            overflow: hidden; position: relative; 
          }
          
          .hotspot-img { 
            width: 100%; height: 100%; object-fit: cover; 
            pointer-events: none; 
          }
          
          .hotspot-label { 
            position: absolute; bottom: 0; width: 100%; 
            background: rgba(0,0,0,0.7); color: white; 
            font-size: 10px; text-align: center; padding: 4px 2px; 
            pointer-events: none;
          }
          
          .play-icon {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            color: white; font-size: 20px; pointer-events: none; text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          }
        `}</style>
      </div>
    </>
  );
}