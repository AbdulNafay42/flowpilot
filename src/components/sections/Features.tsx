import { features as defaultFeatures } from '../../data/features'
import type { Feature } from '../../types'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { FeatureCard } from './FeatureCard'

export function Features({ items = defaultFeatures }: { items?: Feature[] }) {
  return (
    <section id="features" aria-labelledby="features-heading" className="mx-[1.09375rem] bg-surface pb-0 pt-4 md:mx-0 md:py-16">
      <Container>
        <div className="md:mb-12">
          <SectionHeading
            id="features-heading"
            title="Everything your team needs to move faster"
            subtitle="Powerful features to help you plan, automate and collaborate, all in one place."
            subtitleFromMd
            subtitleClassName="md:mt-[0.6875rem]"
          />
        </div>
        <div className="mt-4 grid gap-4 md:mt-0 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {items.map((f) => <FeatureCard key={f.id} feature={f} />)}
        </div>
      </Container>
    </section>
  )
}
