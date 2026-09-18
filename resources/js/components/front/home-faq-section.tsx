import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface Faq {
    id: number;
    question: string;
    answer: string;
}

interface Props {
    faqs: Faq[];
}

export function HomeFaqSection({ faqs }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            gsap.fromTo(
                '.faq-header',
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

            gsap.fromTo(
                '.faq-item',
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 75%',
                    },
                }
            );
        },
        { scope: containerRef }
    );

    if (!faqs || faqs.length === 0) return null;

    return (
        <section ref={containerRef} className="bg-[#fafafc] py-16 md:py-24 border-t border-[#f0f0f0]">
            <div className="mx-auto max-w-[800px] px-6 md:px-12">
                <div className="text-center faq-header mb-10 md:mb-16">
                    <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-[#1d1d1f] md:text-[40px]">
                        Pertanyaan Umum
                    </h2>
                    <p className="mt-3 text-[16px] text-[#86868b] md:text-[20px]">
                        Jawaban atas pertanyaan yang sering diajukan.
                    </p>
                </div>

                <div className="flex flex-col gap-3 md:gap-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div 
                                key={faq.id} 
                                className="faq-item overflow-hidden rounded-2xl bg-white ring-1 ring-[#e0e0e0] transition-shadow shadow-sm hover:shadow-md"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="flex w-full items-center justify-between px-5 md:px-8 py-5 md:py-6 text-left"
                                >
                                    <span className="text-[17px] font-medium text-[#1d1d1f] md:text-[19px] pr-4">
                                        {faq.question}
                                    </span>
                                    <ChevronDown 
                                        className={cn(
                                            "h-5 w-5 shrink-0 text-[#86868b] transition-transform duration-300",
                                            isOpen && "rotate-180 text-[#0066cc]"
                                        )}
                                    />
                                </button>
                                <div 
                                    className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-5 md:px-8 pb-6 text-[15px] leading-relaxed text-[#1d1d1f]/70 md:text-[17px]">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
