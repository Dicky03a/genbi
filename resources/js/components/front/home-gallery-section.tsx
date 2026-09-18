import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface User {
    id: number;
    name: string;
    avatar: string | null;
}

interface Props {
    members: User[];
}

export function HomeGallerySection({ members }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const marquee1Ref = useRef<HTMLDivElement>(null);
    const marquee2Ref = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            gsap.fromTo(
                '.gallery-title',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    },
                }
            );

            // Marquee Animation
            const setupMarquee = (marqueeRef: React.RefObject<HTMLDivElement | null>, direction: 1 | -1) => {
                const marquee = marqueeRef.current;
                if (!marquee) return;

                const items = marquee.children;
                if (items.length === 0) return;

                const gap = window.innerWidth < 768 ? 16 : 24; 
                let totalWidth = 0;
                
                // Calculate total width using half the elements since they are duplicated
                for(let i=0; i<items.length/2; i++) {
                    totalWidth += (items[i] as HTMLElement).offsetWidth + gap;
                }

                gsap.to(marquee, {
                    x: direction === 1 ? `-=${totalWidth}` : `+=${totalWidth}`,
                    duration: 40,
                    ease: 'none',
                    repeat: -1,
                    modifiers: {
                        x: gsap.utils.unitize((x) => {
                            const val = parseFloat(x);
                            return ((val % totalWidth) + totalWidth) % totalWidth - (direction === -1 ? totalWidth : 0);
                        })
                    }
                });
            };

            setupMarquee(marquee1Ref, 1);
            setupMarquee(marquee2Ref, -1);
        },
        { scope: containerRef, dependencies: [members] }
    );

    if (!members || members.length === 0) return null;

    // Split members into two rows
    const half = Math.ceil(members.length / 2);
    const row1 = members.slice(0, half);
    const row2 = members.slice(half);

    // Duplicate for seamless loop
    const displayRow1 = [...row1, ...row1, ...row1];
    const displayRow2 = [...row2, ...row2, ...row2];

    return (
        <section ref={containerRef} className="overflow-hidden bg-white py-16 md:py-24 border-t border-[#f0f0f0]">
            <div className="mx-auto max-w-[1200px] px-6 text-center gallery-title md:px-12 mb-10 md:mb-16">
                <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-[#1d1d1f] md:text-[40px]">
                    Keluarga Besar GenBI
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-[16px] text-[#86868b] md:text-[20px]">
                    Bertemu dengan agen perubahan yang berdedikasi membangun negeri bersama Bank Indonesia.
                </p>
            </div>

            <div className="relative flex flex-col gap-4 md:gap-6">
                {/* Gradient Masks */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent md:w-56" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent md:w-56" />

                {/* Marquee Row 1 */}
                <div className="flex w-max items-center gap-4 md:gap-6" ref={marquee1Ref}>
                    {displayRow1.map((member, i) => (
                        <div key={i} className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#fafafc] shadow-md md:h-32 md:w-32">
                            {member.avatar ? (
                                <img
                                    src={`/storage/${member.avatar}`}
                                    alt={member.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-[24px] font-medium text-[#0066cc]">
                                    {member.name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center rounded-full">
                                <span className="text-white text-[10px] md:text-[12px] font-medium px-2 text-center leading-tight">
                                    {member.name.split(' ')[0]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Marquee Row 2 */}
                <div className="flex w-max items-center gap-4 md:gap-6 ml-[-100px]" ref={marquee2Ref}>
                    {displayRow2.map((member, i) => (
                        <div key={i} className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#fafafc] shadow-md md:h-32 md:w-32">
                            {member.avatar ? (
                                <img
                                    src={`/storage/${member.avatar}`}
                                    alt={member.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-[24px] font-medium text-[#0066cc]">
                                    {member.name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center rounded-full">
                                <span className="text-white text-[10px] md:text-[12px] font-medium px-2 text-center leading-tight">
                                    {member.name.split(' ')[0]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
