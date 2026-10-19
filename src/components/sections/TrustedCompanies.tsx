import { companies } from '../../data/companies'
import { Container } from '../ui/Container'

export function TrustedCompanies() {
  return (
    <section aria-label="Trusted companies" className="bg-surface pb-[1.4375rem] pt-9 md:pb-14 md:pt-14 lg:pb-[3.5rem] lg:pt-[3.4375rem]">
      <Container>
        <p className="mb-8 hidden text-center text-[0.8125rem] font-semibold text-muted md:block">Trusted by modern teams</p>
        <ul className="flex flex-wrap justify-center gap-x-6 max-[22.5rem]:gap-x-2.5 gap-y-6 md:gap-x-12 lg:gap-x-24">
          {companies.map((c) => (
            <li
              key={c.name}
              className={`text-[0.8125rem] font-semibold text-logo md:text-xl lg:text-[1.375rem] lg:leading-[2.0625rem] ${c.desktopOnly ? 'hidden md:block' : ''}`}
            >
              {c.name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
