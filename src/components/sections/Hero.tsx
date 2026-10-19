import checkHero from '../../assets/icons/check-hero.svg'
import checkSmall from '../../assets/icons/check-pricing.svg'
import { heroContent } from '../../data/hero'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { DashboardMockup } from './DashboardMockup'

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading" className="bg-soft-gradient pb-10 pt-8 md:py-12 lg:py-0 mx-[1.0625rem]! md:mx-0!">
      <Container className=" w-auto! md:mx-auto! md:w-full! flex flex-col gap-8 lg:min-h-[37.5rem] lg:flex-row lg:items-stretch lg:justify-between lg:gap-10">
        <div className="flex flex-col justify-between lg:w-[30.6875rem] lg:shrink-0">
          <div className="pt-[0.65625rem]">
            <p className="mb-6 flex h-[1.625rem] w-fit max-w-full items-center gap-2 rounded-full bg-tint px-2.5 text-[0.625rem] max-[22.5rem]:gap-1.5 max-[22.5rem]:px-2 max-[22.5rem]:text-[0.5625rem] md:mb-7 md:h-7 md:px-3.5 md:text-[0.6875rem]">
              <span className="font-bold text-brand">{heroContent.badgeTag}</span>
              <span className="font-medium text-muted">{heroContent.badgeText}</span>
            </p>
          </div>
          <div>
            <h1
              id="hero-heading"
              className="text-[2.25rem] font-extrabold leading-9 tracking-[-0.025em] text-ink max-[22.5rem]:text-[1.75rem] max-[22.5rem]:leading-[1.875rem] md:text-[3rem] md:leading-[3.25rem] lg:text-[3.625rem] lg:leading-[3.915rem] lg:tracking-[-0.09062rem]"
            >
              {heroContent.headline.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </h1>
            <p className="mt-4 max-w-[31.25rem] text-sm leading-5 text-muted md:mt-5 md:text-lg md:leading-[1.82812rem]">
              {heroContent.subtitle}
            </p>
            <div className="mt-7 flex gap-3.5 max-[22.5rem]:flex-col md:mt-8 md:gap-4">
              <ButtonLink href="#contact" size="lg" className="flex-1 max-[22.5rem]:flex-none md:w-[9.375rem] md:flex-none">Start Free</ButtonLink>
              <ButtonLink href="#how-it-works" variant="secondary" size="lg" className="flex-1 max-[22.5rem]:flex-none md:w-[10.625rem] md:flex-none">
                See How It Works
              </ButtonLink>
          </div>
          <ul className="mt-8 flex flex-col pb-[0.375rem] gap-2.5 md:mt-9 md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-2">
            {heroContent.trustNotes.map((note) => (
              <li key={note} className="flex items-center gap-3 text-xs leading-[1.125rem] text-muted md:gap-2 md:text-[0.8125rem] md:leading-[1.21875rem]">
                <img src={checkSmall} alt="" width={9.1} height={9.42} className="md:hidden" />
                <img src={checkHero} alt="" width={15} height={22.5} className="hidden md:block" />
                {note}
              </li>
            ))}
          </ul>
          </div>
        </div>
        <div className="w-full lg:max-w-[39.3125rem] lg:py-[5.3125rem]">
          <DashboardMockup />
        </div>
      </Container>
    </section>
  )
}
