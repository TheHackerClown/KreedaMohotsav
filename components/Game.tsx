"use client"

import { useEffect, useRef, useState } from "react"
import Matter from "matter-js";
import { useGlobalState } from "@/services/global_state";

export default function Game() {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const ballRef = useRef<Matter.Body | null>(null)
    const renderRef = useRef<Matter.Render | null>(null)
    
    // --- SENSOR STATES ---
    const tiltRef = useRef(0);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [already_started_song, setAlreadyStartedSong] = useState<boolean>(false);
    const keysRef = useRef({ left: false, right: false, up: false, down: false })
    const showMobileControls = useGlobalState((state) => state.MobileControls);
    
    // REMOVED: showRotatePrompt state (Ab vertical allowed hai)
    
    const activeGame = useGlobalState((state) => state.startGame) ?? true;
    const bgm_music = useGlobalState((state)=>state.BGMusic);
    const loop_music = useGlobalState((state)=>state.loopMusic);
    const [tilt_available, setTiltAvailable] = useState<boolean>(false);

    useEffect(() => {
        // Check if DeviceOrientationEvent is supported
        if (typeof window !== 'undefined' && typeof (window as any).DeviceOrientationEvent !== 'undefined' && typeof (window as any).DeviceOrientationEvent.requestPermission === 'function') {
            setTiltAvailable(true);
        } else {
            setTiltAvailable(false);
        }}, [activeGame]);
    
    // Audio
    useEffect(() => {
        if (activeGame && loop_music && !already_started_song) {
            setAlreadyStartedSong(true);
            const val = bgm_music.play();
            bgm_music.fade(0, 100, 500, val);
        }
    }, []);


    // --- PERMISSION HANDLER ---
    const requestMotionPermission = async () => {
        if (typeof window !== 'undefined' && typeof (window as any).DeviceOrientationEvent !== 'undefined' && typeof (window as any).DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const response = await (window as any).DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    setPermissionGranted(true);
                    enableSensors();
                }
            } catch (e) { console.error(e); }
        } else {
            setPermissionGranted(true);
            enableSensors();
        }
    };

    const enableSensors = () => {
        window.addEventListener('deviceorientation', (event) => {
            if (event.gamma !== null) {
                console.log("Device Orientation granted.");
                console.log(`Gamma: ${event.gamma}, Beta: ${event.beta}, Alpha: ${event.alpha}`);
                // Portrait mode mein bhi Gamma (Left/Right tilt) sahi kaam karta hai
                tiltRef.current = event.gamma / 45; 
            }
        });
    };

    // --- JUMP LOGIC ---
    const handleJump = () => {
        const b = ballRef.current;
        if (!b) return;
        if (Math.abs(b.velocity.y) > 2) return; 
        Matter.Body.applyForce(b, b.position, { x: 0, y: -0.15 }); 
    };

    useEffect(() => {

        if (!containerRef.current) return
        
        const width = document.body.clientWidth || 800
        const height = containerRef.current.clientHeight || 400

        const engine = Matter.Engine.create()
        engine.gravity.y = 1.2 

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

        // --- BODIES ---
        
        const ball = Matter.Bodies.circle(150, 50, 20, {
            label: "ball",
            restitution: 0.5,    
            friction: 0.01,      
            frictionAir: 0.01,   
            density: 0.005,      
            render: {
                sprite: {
                    texture: "/soccer.png",
                    xScale: 0.2,
                    yScale: 0.2,
                }
            }
        })
        ballRef.current = ball

        const ground = Matter.Bodies.rectangle(0, height, 100000, 200, {
            label: "ground",
            isStatic: true,
            friction: 0.1,
            render: { visible: false }
            })
        Matter.Body.setPosition(ground, { x: 40000, y: height + 60 })

        const leftWall = Matter.Bodies.rectangle(-50, height / 2, 100, height * 2, { isStatic: true, render: { visible: false } })

        Matter.Composite.add(engine.world, [ball, ground, leftWall])

        const runner = Matter.Runner.create()

        if (activeGame) {
            Matter.Render.run(render)
            Matter.Runner.run(runner, engine);
        }      
        
        // --- UPDATE LOOP ---
        const forceMagnitude = 0.002
        
        const beforeUpdate = () => {
            const b = ballRef.current
            if (!b || !renderRef.current) return

            // Controls
            if (keysRef.current.left) Matter.Body.applyForce(b, b.position, { x: -forceMagnitude, y: 0 })
            if (keysRef.current.right) Matter.Body.applyForce(b, b.position, { x: forceMagnitude, y: 0 })
            
            // Gyro
            const tilt = tiltRef.current;
            if (Math.abs(tilt) > 0.1) {
                const sensorForce = tilt * 0.004; 
                Matter.Body.applyForce(b, b.position, { x: sensorForce, y: 0 });
            }

            // Camera Logic
            const screenCenter = width / 2;
            const ballX = b.position.x;
            
            let targetMinX = ballX - screenCenter;
            if (targetMinX < 0) targetMinX = 0; 

            const currentMinX = render.bounds.min.x;
            const lerp = 0.1; 
            const newMinX = currentMinX + (targetMinX - currentMinX) * lerp;

            Matter.Bounds.shift(render.bounds, { x: newMinX, y: 0 });

            // Parallax
            if (containerRef.current) {
                containerRef.current.style.backgroundPositionX = `${-newMinX * 0.5}px`;
            }
        }

        Matter.Events.on(engine, "beforeUpdate", beforeUpdate)


        // Key Handlers
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
            // Removed Orientation cleanup
            Matter.Events.off(engine, "beforeUpdate", beforeUpdate)
            Matter.Runner.stop(runner)
            Matter.Render.stop(render)
            bgm_music.stop();
            if (render.canvas && render.canvas.parentNode) render.canvas.parentNode.removeChild(render.canvas)
            Matter.Composite.clear(engine.world, false)
            Matter.Engine.clear(engine)
        }
    }, [activeGame])

    const startLeft = () => (keysRef.current.left = true)
    const stopLeft = () => (keysRef.current.left = false)
    const startRight = () => (keysRef.current.right = true)
    const stopRight = () => (keysRef.current.right = false)
    const doJump = (e: any) => { e.preventDefault(); handleJump(); }


    return (
        <div id="game_container" className="overflow-hidden">
            
            {/* Permission Button */}
            {activeGame && showMobileControls && !permissionGranted && tilt_available && (
                <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
                    <button 
                        onClick={requestMotionPermission}
                        className="bg-cyan-600 text-white px-4 py-2 rounded shadow-lg border-2 border-white font-mono text-xs animate-pulse"
                    >
                        TAP TO START SENSORS
                    </button>
                </div>
            )}

            {/* REMOVED: Rotation Prompt Overlay */}

            <div ref={containerRef} className="bg-repeat-x bg-contain" style={{backgroundImage: `url("/crowd_edit.png")`, width: "100%", height: "100%", position: "relative"}} />

            {showMobileControls && activeGame && (
                <>
                    {/* Controls adjusted for Vertical Screen */}
                    <button className = "custom_button" style={{ left: 16, bottom: 16, fontSize: "clamp(16px, 3vw, 24px)", padding: "8px 12px", touchAction: "none" }}
                        onMouseDown={startLeft} onMouseUp={stopLeft} onMouseLeave={stopLeft}
                        onTouchStart={(e) => { e.preventDefault(); startLeft() }} onTouchEnd={stopLeft}>◀</button>

                    <button className = "custom_button" style={{ left: 100, bottom: 16, fontSize: "clamp(16px, 3vw, 24px)", padding: "8px 12px", touchAction: "none" }}
                        onMouseDown={startRight} onMouseUp={stopRight} onMouseLeave={stopRight}
                        onTouchStart={(e) => { e.preventDefault(); startRight() }} onTouchEnd={stopRight}>▶</button>
                    
                    <button className = "custom_button" style={{ right: 16, bottom: 16, fontSize: "clamp(16px, 3vw, 24px)", padding: "8px 12px", touchAction: "none" }}
                        onMouseDown={doJump} onTouchStart={doJump}>▲</button>
                </>
            )}
        </div>
    )
}