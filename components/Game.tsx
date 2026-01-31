"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import Matter from "matter-js";
import { useGlobalState } from "@/services/global_state";
import InfoBoards from "./InfoBoards"; 

// --- FIXED STADIUM BANNER (JS CONTROLLED TEXT) ---
// 🔥 Now accepts 'isMobile' prop to guarantee correct text 🔥
const StadiumBanner = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <div 
            className="fixed top-0 left-1/2 transform -translate-x-1/2 z-[60] 
                       bg-gray-900/95 
                       border-b sm:border-b-4 border-blue-500 
                       px-3 py-1 sm:px-6 sm:py-3 
                       rounded-b-md sm:rounded-b-lg 
                       shadow-lg text-center backdrop-blur-sm pointer-events-none
                       w-auto max-w-[95vw]"
        >
            <h1 className="text-white font-black 
                           text-[10px] sm:text-2xl            /* Mobile: 10px, PC: 2xl */
                           uppercase 
                           tracking-normal sm:tracking-wider 
                           drop-shadow-md whitespace-nowrap leading-none">
                {/* 🔥 LOGIC: Mobile h toh '2.0' hata do, PC h toh dikhao 🔥 */}
                {isMobile ? "KREEDA MAHOTSAV" : "KREEDA MAHOTSAV 2.0"}
            </h1>
            <p className="text-cyan-300 font-mono 
                          text-[6px] sm:text-base             /* Mobile: 6px */
                          font-bold leading-none mt-[2px]">
                - Team Parakram
            </p>
        </div>
    );
};

export default function Game() {
    // --- REFS ---
    const containerRef = useRef<HTMLDivElement | null>(null)
    const renderRef = useRef<Matter.Render | null>(null)
    const ballRef = useRef<Matter.Body | null>(null)
    
    // Parallax Layer Refs
    const structureRef = useRef<HTMLDivElement | null>(null)
    const crowdRef = useRef<HTMLDivElement | null>(null)
    const hoardingRef = useRef<HTMLDivElement | null>(null)
    const grassRef = useRef<HTMLDivElement | null>(null)
    const boardsRef = useRef<HTMLDivElement | null>(null)
    
    // --- STATE & GLOBAL ---
    const tiltRef = useRef(0);
    const keysRef = useRef({ left: false, right: false, up: false, down: false })
    
    // SENSOR STATES
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [tilt_available, setTiltAvailable] = useState<boolean>(false);
    const [requiresButton, setRequiresButton] = useState<boolean>(false); 

    const [already_started_song, setAlreadyStartedSong] = useState<boolean>(false);

    // Force Mobile Controls if screen is small
    const globalMobileControls = useGlobalState((state) => state.MobileControls);
    const [isMobileScreen, setIsMobileScreen] = useState(false);

    // GLOBAL GAME STATE
    const activeGame = useGlobalState((state) => state.startGame) ?? true;
    const setStartGame = useGlobalState((state) => state.setStartGame);
    const bgm_music = useGlobalState((state)=>state.BGMusic);
    const loop_music = useGlobalState((state)=>state.loopMusic);

    // --- MEMOIZED ASSETS ---
    const tileCount = 150; 
    const tiles = useMemo(() => [...Array(tileCount)], []);

    const adText = useMemo(() => {
        const text = "  ★  NFSU DELHI  ★  KREEDA MAHOTSAV 2.0  ★  TEAM PARAKRAM  ★  ";
        return text.repeat(150); 
    }, []);

    // --- SETUP LISTENERS ---
    useEffect(() => {
        const checkScreen = () => setIsMobileScreen(window.innerWidth < 768);
        checkScreen();
        window.addEventListener('resize', checkScreen);

        if (typeof window !== 'undefined' && (window as any).DeviceOrientationEvent) {
            setTiltAvailable(true);

            if (typeof (window as any).DeviceOrientationEvent.requestPermission === 'function') {
                setRequiresButton(true);
                setPermissionGranted(false);
            } else {
                setRequiresButton(false);
                setPermissionGranted(true);
                enableSensors();
            }
        } else {
            setTiltAvailable(false);
        }

        return () => window.removeEventListener('resize', checkScreen);
    }, []);
    
    useEffect(() => {
        if (activeGame && loop_music && !already_started_song) {
            setAlreadyStartedSong(true);
            const val = bgm_music.play();
            bgm_music.fade(0, 100, 500, val);
        }
    }, [activeGame, loop_music, already_started_song, bgm_music]);

    const requestMotionPermission = async () => {
        if (typeof (window as any).DeviceOrientationEvent !== 'undefined' && typeof (window as any).DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const response = await (window as any).DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    setPermissionGranted(true);
                    enableSensors();
                }
            } catch (e) { console.error(e); }
        }
    };

    const enableSensors = () => {
        window.addEventListener('deviceorientation', (event) => {
            if (event.gamma !== null) {
                tiltRef.current = event.gamma / 45; 
            }
        });
    };

    // --- PHYSICS JUMP ---
    const handleJump = () => {
        const b = ballRef.current;
        if (!b) return;
        if (Math.abs(b.velocity.y) > 2) return; 
        Matter.Body.applyForce(b, b.position, { x: 0, y: -0.15 }); 
    };

    // --- MAIN GAME LOGIC ---
    useEffect(() => {
        if (!containerRef.current) return
        
        const width = document.body.clientWidth || 800
        const height = containerRef.current.clientHeight || 400
        const isMobile = window.innerWidth < 768;

        const engine = Matter.Engine.create()
        engine.gravity.y = 1.3 

        const render = Matter.Render.create({
            element: containerRef.current,
            engine,
            options: {
                width,
                height,
                wireframes: false,
                background: "transparent",
                pixelRatio: window.devicePixelRatio || 1,
                hasBounds: true 
            },
        })
        renderRef.current = render

        // --- CALCULATE GROUND LEVEL ---
        const groundLevel = height * 0.85; 

        // --- CREATE BODIES ---
        const ball = Matter.Bodies.circle(150, height * 0.4, 22, { 
            label: "ball",
            restitution: 0.6,    
            frictionAir: 0.002,  
            friction: 0.02,
            density: 0.005,      
            render: {
                sprite: {
                    texture: "/soccer.png",
                    xScale: 0.22,
                    yScale: 0.22,
                }
            }
        })
        ballRef.current = ball

        // --- INVISIBLE PHYSICS GROUND ---
        const ground = Matter.Bodies.rectangle(0, groundLevel + 50, 100000, 100, {
            label: "ground",
            isStatic: true,
            friction: 0.1, 
            render: { visible: false }
        })
        Matter.Body.setPosition(ground, { x: 40000, y: groundLevel + 50 })

        const leftWall = Matter.Bodies.rectangle(-50, height / 2, 100, height * 2, { isStatic: true, render: { visible: false } })

        // RIGHT WALL
        const endPosition = isMobile ? 15000 : 32500;
        
        const rightWall = Matter.Bodies.rectangle(endPosition, height / 2, 100, height * 2, { 
            isStatic: true, 
            label: "end_wall",
            render: { visible: false } 
        });

        Matter.Composite.add(engine.world, [ball, ground, leftWall, rightWall])

        const runner = Matter.Runner.create()

        if (activeGame) {
            Matter.Render.run(render)
            Matter.Runner.run(runner, engine);
        }      
        
        // --- UPDATE LOOP ---
        const forceMagnitude = 0.005 
        
        const beforeUpdate = () => {
            const b = ballRef.current
            if (!b || !renderRef.current) return

            // Controls
            if (keysRef.current.left) Matter.Body.applyForce(b, b.position, { x: -forceMagnitude, y: 0 })
            if (keysRef.current.right) Matter.Body.applyForce(b, b.position, { x: forceMagnitude, y: 0 })
            
            // Tilt
            const tilt = tiltRef.current;
            if (Math.abs(tilt) > 0.05) { 
                 Matter.Body.applyForce(b, b.position, { x: tilt * 0.005, y: 0 });
            }

            // Max Speed Limit
            const maxSpeed = 15;
            if (b.velocity.x > maxSpeed) Matter.Body.setVelocity(b, { x: maxSpeed, y: b.velocity.y });
            if (b.velocity.x < -maxSpeed) Matter.Body.setVelocity(b, { x: -maxSpeed, y: b.velocity.y });

            // Camera Sync
            const screenCenter = width / 2;
            const ballX = b.position.x;
            let targetMinX = ballX - screenCenter;
            if (targetMinX < 0) targetMinX = 0; 
            const currentMinX = render.bounds.min.x;
            const lerp = 0.1; 
            const newMinX = currentMinX + (targetMinX - currentMinX) * lerp;
            
            Matter.Bounds.shift(render.bounds, { x: newMinX, y: 0 });

            // --- PARALLAX SYNC ---
            const SPEED_STRUCTURE = 0.2; 
            const SPEED_BOARDS = 0.2;    
            const SPEED_CROWD = 0.5;
            const SPEED_HOARDING = 0.5;
            const SPEED_GRASS = 1.0;  

            if (structureRef.current) structureRef.current.style.transform = `translateX(${-newMinX * SPEED_STRUCTURE}px)`;
            if (boardsRef.current) boardsRef.current.style.transform = `translateX(${-newMinX * SPEED_BOARDS}px)`;
            
            if (crowdRef.current) crowdRef.current.style.transform = `translateX(${-newMinX * SPEED_CROWD}px)`;
            if (hoardingRef.current) hoardingRef.current.style.transform = `translateX(${-newMinX * SPEED_HOARDING}px)`;
            if (grassRef.current) grassRef.current.style.transform = `translateX(${-newMinX * SPEED_GRASS}px)`;
        }

        Matter.Events.on(engine, "beforeUpdate", beforeUpdate)

        // Listeners & Cleanup
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keysRef.current.left = true
            if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keysRef.current.right = true
            if (e.key === "ArrowUp" || e.key.toLowerCase() === "w" || e.code === "Space") handleJump();
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key === "a") keysRef.current.left = false
            if (e.key === "ArrowRight" || e.key === "d") keysRef.current.right = false
        }
        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)
        const resize = () => {
            if (!containerRef.current || !renderRef.current) return
            const w = containerRef.current.clientWidth
            renderRef.current.canvas.width = w * (window.devicePixelRatio || 1)
        }
        window.addEventListener("resize", resize)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
            window.removeEventListener("resize", resize)
            Matter.Events.off(engine, "beforeUpdate", beforeUpdate)
            Matter.Runner.stop(runner)
            Matter.Render.stop(render)
            bgm_music.stop();
            if (render.canvas && render.canvas.parentNode) render.canvas.parentNode.removeChild(render.canvas)
            Matter.Composite.clear(engine.world, false)
            Matter.Engine.clear(engine)
        }
    }, [activeGame, bgm_music])

    const startLeft = () => (keysRef.current.left = true)
    const stopLeft = () => (keysRef.current.left = false)
    const startRight = () => (keysRef.current.right = true)
    const stopRight = () => (keysRef.current.right = false)
    const doJump = (e: any) => { e.preventDefault(); handleJump(); }

    const showMobileUI = (globalMobileControls || isMobileScreen) && activeGame;

    return (
        // === MAIN CONTAINER ===
        <div id="game_container" className="overflow-hidden relative w-full h-full bg-gradient-to-b from-sky-400 via-sky-200 to-white">
            
            {/* 🔥 CONDITIONALLY RENDER BANNER WITH PROPS 🔥 */}
            { activeGame && <StadiumBanner isMobile={isMobileScreen} /> }

            {/* === LAYER 1: STADIUM STRUCTURE === */}
            <div 
                ref={structureRef}
                className="absolute top-0 left-0 w-[150000px] h-full z-10 pointer-events-none"
                style={{ willChange: 'transform' }}
            >
                {/* ROOF */}
                <div className="h-[12%] w-full bg-gray-900 border-b-8 border-gray-800 shadow-2xl relative z-20"></div>
                {/* BACK WALL */}
                <div className="absolute top-[12%] left-0 w-full h-[60%] bg-gray-800 z-10"></div>
            </div>

            {/* === LAYER 2: CROWD === */}
            <div 
                ref={crowdRef} 
                className="absolute top-[20%] left-0 h-[60%] z-20 flex pointer-events-none"
                style={{ width: '150000px', willChange: 'transform' }} 
            >
                <div className="absolute inset-0 z-30 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
                {tiles.map((_, index) => (
                    <img 
                        key={`crowd-${index}`}
                        src="/crowd.jpg" 
                        alt="crowd"
                        className={`h-full w-auto object-cover ${index % 2 !== 0 ? 'scale-x-[-1]' : ''}`}
                        style={{ marginRight: '-1px' }}
                    />
                ))}
            </div>

            {/* === LAYER 2.5: ADVERTISEMENT HOARDING === */}
            <div 
                ref={hoardingRef}
                className="absolute bottom-[30%] left-0 w-[150000px] h-[6%] sm:h-[10%] z-25 flex items-center bg-gray-900 border-y-2 sm:border-y-4 border-blue-600 shadow-[0_0_20px_rgba(0,100,255,0.4)] pointer-events-none overflow-hidden"
                style={{ willChange: 'transform' }}
            >
                 <div className="whitespace-nowrap text-yellow-300 font-black text-sm sm:text-2xl font-mono tracking-widest drop-shadow-[0_0_5px_rgba(255,255,0,0.8)]">
                    {adText}
                 </div>
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.2)_50%,transparent_50%),linear-gradient(90deg,rgba(0,0,0,0.1)_50%,transparent_50%)] bg-[length:4px_4px] pointer-events-none"></div>
            </div>

            {/* === LAYER 3: JUMBOTRONS === */}
             <InfoBoards 
                containerRef={boardsRef} 
                onExitGame={() => window.location.reload()} 
            />

            {/* === LAYER 4: GRASS === */}
            <div 
                ref={grassRef}
                className="absolute bottom-0 left-0 h-[30%] z-40 flex pointer-events-none border-t-4 border-[#3a6b22]"
                style={{ width: '150000px', willChange: 'transform' }}
            >
                {tiles.map((_, index) => (
                    <img 
                        key={`grass-${index}`}
                        src="/grass.jpg" 
                        alt="grass"
                        className={`h-full w-auto object-cover ${index % 2 !== 0 ? 'scale-x-[-1]' : ''}`}
                         style={{ marginRight: '-1px' }}
                    />
                ))}
            </div>

            {/* === LAYER 5: PHYSICS CANVAS === */}
            <div ref={containerRef} className="absolute top-0 left-0 w-full h-full z-50 pointer-events-none" />
            
            {/* === UI OVERLAYS === */}
            {showMobileUI && requiresButton && !permissionGranted && (
                <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
                    <button 
                        onClick={requestMotionPermission}
                        className="bg-cyan-600 text-white px-4 py-2 rounded shadow-lg border-2 border-white font-mono text-xs animate-pulse pointer-events-auto"
                    >
                        TAP TO START SENSORS
                    </button>
                </div>
            )}

            {showMobileUI && (
                <div className="z-[100] relative pointer-events-auto">
                    <button className = "custom_button bg-green-900/80 border-green-400 text-green-100" style={{ left: 16, bottom: 16, fontSize: "clamp(16px, 3vw, 24px)", padding: "8px 12px", touchAction: "none" }}
                        onMouseDown={startLeft} onMouseUp={stopLeft} onMouseLeave={stopLeft}
                        onTouchStart={(e) => { e.preventDefault(); startLeft() }} onTouchEnd={stopLeft}>◀</button>

                    <button className = "custom_button bg-green-900/80 border-green-400 text-green-100" style={{ left: 100, bottom: 16, fontSize: "clamp(16px, 3vw, 24px)", padding: "8px 12px", touchAction: "none" }}
                        onMouseDown={startRight} onMouseUp={stopRight} onMouseLeave={stopRight}
                        onTouchStart={(e) => { e.preventDefault(); startRight() }} onTouchEnd={stopRight}>▶</button>
                    
                    <button className = "custom_button bg-green-900/80 border-green-400 text-green-100" style={{ right: 16, bottom: 16, fontSize: "clamp(16px, 3vw, 24px)", padding: "8px 12px", touchAction: "none" }}
                        onMouseDown={doJump} onTouchStart={doJump}>▲</button>
                </div>
            )}
        </div>
    )
}
