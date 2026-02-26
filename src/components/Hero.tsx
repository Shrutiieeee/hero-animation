"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

/** Stat cards displayed after the car passes. */
const STATS = [
    { value: "58%", label: "Increase in pick up point use", color: "#D6EA3F" },
    { value: "27%", label: "Increase in pick up point use", color: "#333333", textColor: "white" },
    { value: "23%", label: "Decreased in customer phone calls", color: "#6BB5F2" },
    { value: "40%", label: "Decreased in customer phone calls", color: "#F18231" },
];

/**
 * The order in which the stat cards appear (by index in STATS).
 * Yellow → Blue → Black → Orange
 */
const CARD_APPEARANCE_ORDER = [0, 2, 1, 3];

/** Tailwind positions for each stat card (matches STATS order). */
const STAT_POSITIONS = [
    "top-[5%] left-[45%]",
    "top-[5%] left-[68%]",
    "bottom-[5%] left-[38%]",
    "bottom-[5%] left-[61%]",
];

/** The scroll distance (in px) for the pinned animation. */
const SCROLL_DISTANCE = 1000;

/**
 * The paint reveal starts slightly ahead of the car's tail.
 * 10vw = ~¼ of the car width (40vw), so the green appears
 * about a quarter of the way from the back of the car.
 */
const PAINT_REVEAL_OFFSET = "10vw";

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const carRef = useRef<HTMLDivElement>(null);
    const paintRef = useRef<HTMLDivElement>(null);
    const statsRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            setupScrollAnimation();
        }, containerRef);

        return () => ctx.revert();
    }, []);

    function setupScrollAnimation() {
        // Pin the section and scrub through the timeline via scroll.
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerRef.current,
                start: "top top",
                end: `+=${SCROLL_DISTANCE}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            },
        });

        // 1. Car drives across the screen from left to right.
        gsap.set(carRef.current, { x: 0 });
        scrollTl.to(carRef.current, { x: "100vw", ease: "none" }, 0);

        // 2. Green paint strip reveals from slightly behind the car's center.
        //    Initial width = PAINT_REVEAL_OFFSET, final = 100vw + offset.
        scrollTl.to(
            paintRef.current,
            { width: `calc(100vw + ${PAINT_REVEAL_OFFSET})`, ease: "none" },
            0
        );

        // 3. Stat cards fade in one by one in the requested color order.
        statsRefs.current.forEach((stat, index) => {
            if (!stat) return;
            const delay = 0.15 + CARD_APPEARANCE_ORDER[index] * 0.1;
            scrollTl.fromTo(
                stat,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.15, ease: "power2.out" },
                delay
            );
        });
    }

    return (
        <section
            ref={triggerRef}
            className="relative h-screen w-full overflow-hidden bg-[#f0f0f0]"
        >
            <div
                ref={containerRef}
                className="relative w-full h-full max-w-[1500px] mx-auto"
            >
                {/* ── Black Track ── */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[20vw] bg-[#1a1a1a] z-0" />

                {/* ── Green Paint Strip + Revealed Text ── */}
                <div
                    ref={paintRef}
                    className="absolute top-1/2 left-0 -translate-y-1/2 h-[20vw] bg-[#2ecc71] z-10 overflow-hidden"
                    style={{ width: PAINT_REVEAL_OFFSET }}
                >
                    <div className="w-[100vw] h-full flex items-center justify-center px-[8vw]">
                        <h1 className="text-[#1a1a1a] text-[10vw] font-bold tracking-tight uppercase whitespace-nowrap leading-none">
                            WELCOME ITZFIZZ
                        </h1>
                    </div>
                </div>

                {/* ── Car ── */}
                <div
                    ref={carRef}
                    className="absolute top-1/2 left-0 -translate-y-1/2 z-20 pointer-events-none"
                    style={{ width: "40vw", height: "28vw" }}
                >
                    <Image
                        src="/images/red-car.png"
                        alt="Red Supercar"
                        width={800}
                        height={400}
                        className="object-cover w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                        priority
                    />
                </div>

                {/* ── Stat Cards ── */}
                {STATS.map((stat, i) => (
                    <div
                        key={i}
                        ref={(el) => { statsRefs.current[i] = el; }}
                        className={`absolute ${STAT_POSITIONS[i]} p-6 rounded-2xl shadow-xl flex flex-col justify-center items-start w-[14rem] h-36 z-30 pointer-events-none`}
                        style={{
                            backgroundColor: stat.color,
                            color: stat.textColor ?? "#1a1a1a",
                            opacity: 0,
                        }}
                    >
                        <span className="text-5xl font-bold mb-1 tracking-tighter">{stat.value}</span>
                        <span className="text-base font-semibold leading-tight max-w-[160px]">{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
