import { stripHtml } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

interface AboutProps {
    about: {
        profile: string;
        vision: string;
        mission: string[];
    };
}

export function AboutSection({ about }: AboutProps) {
    const strippedProfile = stripHtml(about.profile);
    const truncatedProfile = strippedProfile.length > 350 ? strippedProfile.substring(0, 350) + '...' : strippedProfile;

    return (
        <section className="bg-[#f5f5f7] py-[80px] md:py-[120px]">
            <div className="mx-auto max-w-[1440px] px-6 md:px-12">
                <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12 lg:gap-24">
                    {/* Left: Profile Information */}
                    <div className="flex flex-col space-y-8 lg:col-span-7">
                        <h2 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.374px] text-[#1d1d1f] md:text-[40px] lg:text-[56px] lg:tracking-[-0.28px]">
                            Komunitas masa depan untuk Indonesia yang lebih baik.
                        </h2>
                        <div className="text-[19px] leading-[1.47] text-[#1d1d1f] md:text-[24px] md:font-light md:leading-[1.5]">
                            {truncatedProfile}
                        </div>
                        <div>
                            <Link
                                href="#"
                                className="group inline-flex items-center text-[19px] font-medium text-[#0066cc] hover:underline md:text-[21px]"
                            >
                                Selengkapnya
                                <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Right: Vision & Mission (Apple-style Utility Card) */}
                    <div className="space-y-12 rounded-[18px] bg-white p-8 shadow-sm ring-1 ring-[#e0e0e0] lg:col-span-5 lg:p-12">
                        {/* Vision */}
                        <div className="space-y-4">
                            <h3 className="text-[21px] font-semibold tracking-[0.231px] text-[#1d1d1f]">Visi</h3>
                            <p className="text-[17px] leading-[1.47] tracking-[-0.374px] text-[#333333]">
                                {stripHtml(about.vision)}
                            </p>
                        </div>

                        {/* Mission */}
                        <div className="space-y-4">
                            <h3 className="text-[21px] font-semibold tracking-[0.231px] text-[#1d1d1f]">Misi</h3>
                            <ul className="space-y-4">
                                {about.mission.map((item, index) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <div className="mt-2 h-[6px] w-[6px] shrink-0 rounded-full bg-[#0066cc]" />
                                        <span className="text-[17px] leading-[1.47] tracking-[-0.374px] text-[#333333]">
                                            {stripHtml(item)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
