"use client"

import { useEffect, useRef, useState } from "react"
import Matter from "matter-js";
import { useGlobalState } from "@/services/global_state";


export default function Game({ onReady }: { onReady?: () => void }) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const ballRef = useRef<Matter.Body | null>(null)
    const engineRef = useRef<Matter.Engine | null>(null)
    const renderRef = useRef<Matter.Render | null>(null)
    const runnerRef = useRef<Matter.Runner | null>(null)
    const keysRef = useRef({ left: false, right: false, up: false, down: false })
    const [showMobileControls, setShowMobileControls] = useState(false)
    const [showRotatePrompt, setShowRotatePrompt] = useState(false)
    const activeGame = useGlobalState((state) => state.startGame);
     const bgm_music = useGlobalState((state)=>state.BGMusic);
     const val = bgm_music.play();
    bgm_music.fade(0, 0.01, 500, val);
    useEffect(() => {
        // detect mobile (simple UA + touch check)
        const ua = typeof navigator !== "undefined" ? navigator.userAgent : ""
        const isTouch = typeof window !== "undefined" && "ontouchstart" in window
        if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua) || isTouch) setShowMobileControls(true);

        // Check orientation and show rotate prompt if in portrait mode on mobile
        const checkOrientation = () => {
            if (typeof window === "undefined") return
            const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || isTouch
            const isPortrait = window.innerHeight > window.innerWidth
            setShowRotatePrompt(isMobile && isPortrait)
        }

        checkOrientation()
        window.addEventListener("resize", checkOrientation)
        window.addEventListener("orientationchange", checkOrientation)

        if (!containerRef.current) return
        
        const width = document.body.clientWidth || 800
        const height = containerRef.current.clientHeight || 400

        const engine = Matter.Engine.create()
        engineRef.current = engine
        engine.gravity.y = 0.98

        const render = Matter.Render.create({
            element: containerRef.current,
            engine,
            options: {
                width,
                height,
                wireframes: false,
                background: "transparent",
                pixelRatio: window.devicePixelRatio || 1,
            },
        })
        renderRef.current = render

        const ball = Matter.Bodies.circle(150, 50, 20, {
            restitution: 1,
            friction: 0.1,
            frictionAir: 0.05,
            density: 0.002,
            render: {
                sprite: {
                    texture: "/soccer.png",
                    xScale: 0.2,
                    yScale: 0.2,
                }
            }
            
        })
        ballRef.current = ball
        const ground = Matter.Bodies.rectangle(100, height-40, 100000, 200, {
            isStatic: true,
            friction: 1,
            restitution: 0,
            
        })

        // walls to prevent leaving screen (we'll move these together with the ground)
        const leftWall = Matter.Bodies.rectangle(width/8-width/2, height / 2, width/4, height, { isStatic: true })
        
        // this will hold all world bodies for translation of ground and walls w.r.t ball movement
        const world_bodies = Matter.Composite.create(); 
        Matter.Composite.add(world_bodies, [ground, leftWall]);

        Matter.Composite.add(engine.world, [ball, world_bodies])

        const runner = Matter.Runner.create()
        runnerRef.current = runner

        if (activeGame) {
            Matter.Render.run(render)
            Matter.Runner.run(runner, engine)
        }

        
        
        
        // continuous force while keys are held
        const forceMagnitude = 0.002
        const beforeUpdate = () => {
            const b = ballRef.current
            if (!b) return
            if (keysRef.current.left) Matter.Body.applyForce(b, b.position, { x: -forceMagnitude, y: 0 })
            if (keysRef.current.right) Matter.Body.applyForce(b, b.position, { x: forceMagnitude, y: 0 })
            if (keysRef.current.up) Matter.Body.applyForce(b, b.position, { x: 0, y: -forceMagnitude*0.2 })
            if (keysRef.current.down) Matter.Body.applyForce(b, b.position, { x: 0, y: forceMagnitude })

            // move the ground and walls in the opposite horizontal direction of the ball
            // this creates an effect where the platform appears to slide opposite to ball movement
            const platformMoveFactor = 3 // tweak for responsiveness
            const dx = -b.velocity.x * platformMoveFactor
            try {
                 if (world_bodies) Matter.Composite.translate(world_bodies, { x: dx, y: 0 })
            } catch (e) {
                // ignore translate errors
            }
        }
        Matter.Events.on(engine, "beforeUpdate", beforeUpdate)

        // keyboard handlers
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keysRef.current.left = true
            if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keysRef.current.right = true
            if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") keysRef.current.up = true
            if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") keysRef.current.down = true
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key === "a") keysRef.current.left = false
            if (e.key === "ArrowRight" || e.key === "d") keysRef.current.right = false
            if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") keysRef.current.up = false
            if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") keysRef.current.down = false
        }
        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)

        // resize handling
        const resize = () => {
            if (!containerRef.current || !renderRef.current) return
            const w = containerRef.current.clientWidth
            Matter.Render.lookAt(renderRef.current, { min: { x: 0, y: 0 }, max: { x: w, y: height } })
            renderRef.current.canvas.style.width = `${w}px`
            renderRef.current.canvas.width = w * (window.devicePixelRatio || 1)
        }
        const ro = new ResizeObserver(resize)
        ro.observe(containerRef.current)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
            window.removeEventListener("resize", checkOrientation)
            window.removeEventListener("orientationchange", checkOrientation)
            Matter.Events.off(engine, "beforeUpdate", beforeUpdate)
            Matter.Runner.stop(runner)
            Matter.Render.stop(render)
            bgm_music.stop();
            if (render.canvas && render.canvas.parentNode) render.canvas.parentNode.removeChild(render.canvas)
            Matter.Composite.clear(engine.world, false)
            Matter.Engine.clear(engine)
            ro.disconnect()
        }
    }, [activeGame])

    // mobile button handlers (touch + mouse)
    const startLeft = () => (keysRef.current.left = true)
    const stopLeft = () => (keysRef.current.left = false)
    const startRight = () => (keysRef.current.right = true)
    const stopRight = () => (keysRef.current.right = false)


    return (
        <div id="game_container">
            {/* Rotation Prompt Overlay for mobile devices */}
            {showRotatePrompt && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.95)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        color: "white",
                        textAlign: "center",
                        padding: 16,
                    }}
                >
                    <div style={{ fontSize: "clamp(36px, 6vw, 64px)", marginBottom: 16 }}>📱 ➜ 🔄</div>
                    <h2 style={{ fontSize: "clamp(16px, 3.2vw, 24px)", marginBottom: 10, fontWeight: "bold" }}>
                        Please Rotate Your Device
                    </h2>
                    <p style={{ fontSize: "clamp(12px, 2.5vw, 16px)", opacity: 0.9 }}>
                        This Website is designed to be viewed in landscape mode (16:9)
                    </p>
                </div>
            )}

            <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

            {showMobileControls && activeGame && (
                <>
                    <button
                        aria-label="Move left"
                        className = "custom_button"
                        style={{ left: 16, bottom: 16, fontSize: "clamp(16px, 3vw, 24px)", padding: "8px 12px", touchAction: "none" }}
                        onMouseDown={startLeft}
                        onMouseUp={stopLeft}
                        onMouseLeave={stopLeft}
                        onTouchStart={(e) => {
                            e.preventDefault()
                            startLeft()
                        }}
                        onTouchEnd={stopLeft}
                    >
                        ◀
                    </button>

                    <button
                        aria-label="Move right"
                        className = "custom_button"
                        style={{ right: 16, bottom: 16, fontSize: "clamp(16px, 3vw, 24px)", padding: "8px 12px", touchAction: "none" }}
                        onMouseDown={startRight}
                        onMouseUp={stopRight}
                        onMouseLeave={stopRight}
                        onTouchStart={(e) => {
                            e.preventDefault()
                            startRight()
                        }}
                        onTouchEnd={stopRight}
                    >
                        ▶
                    </button>
                </>
            )}
        </div>
    )
}