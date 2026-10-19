import { useState } from 'react'
import checkIcon from '../../assets/icons/check-pricing.svg'
import { plans as defaultPlans } from '../../data/pricing'
import type { BillingPeriod, PricingPlan } from '../../types'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

const periods: { id: BillingPeriod; label: string; width: string }[] = [
  { id: 'monthly', label: 'Monthly', width: 'w-[5.75rem]' },
  { id: 'yearly', label: 'Yearly', width: 'w-20' },
]

// Figma uses different list spacing per card at 1440 (Starter 16/8, Pro 12/6, Business 8/6).
const listSpacing: Record<string, string> = {
  starter: 'md:pt-4 md:gap-2',
  pro: 'md:pt-3 md:gap-1.5',
  business: 'md:pt-2 md:gap-1.5',
}

function PricingCard({ plan, period }: { plan: PricingPlan; period: BillingPeriod }) {
  const price = period === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
  const body = (
    <>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold leading-6 text-ink">{plan.name}</h3>
        <p className="flex items-baseline gap-1 pb-0.5 pt-1 md:pb-0">
          <span className="text-[2.125rem] font-bold leading-[2.65625rem] text-ink md:leading-[2.125rem]">
            {price === null ? '—' : `$${price}`}
          </span>
          <span className="text-xs font-medium leading-[1.125rem] text-muted">/{period === 'yearly' ? 'year' : 'month'}</span>
        </p>
        <p className="pb-4 text-xs leading-[1.125rem] text-muted md:pb-0">{plan.description}</p>
        <ul className={`flex flex-col gap-2.5 pb-6 md:pb-0 ${listSpacing[plan.id] ?? 'md:pt-3 md:gap-1.5'}`}>
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-xs leading-[1.125rem] text-muted md:gap-2">
              <img src={checkIcon} alt="" width={9.1} height={9.42} />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <ButtonLink
        href="#contact"
        variant={plan.highlighted ? 'primary' : 'secondary'}
        size="sm"
        className="mt-[1.21875rem] w-full md:mt-4 lg:mt-0"
        aria-label={`Get Started with ${plan.name}`}
      >
        Get Started
      </ButtonLink>
    </>
  )

  const shared =
    'flex w-[17.3125rem] shrink-0 snap-center flex-col justify-between rounded-2xl bg-surface md:w-auto lg:h-[18.875rem]'
  if (plan.highlighted) {
    return (
      <article className={`${shared} order-first overflow-hidden border-2 border-brand shadow-card md:order-none lg:translate-y-px`}>
        <p className="h-[1.875rem] shrink-0 bg-brand-gradient text-center text-xs font-bold leading-[1.875rem] tracking-[0.01875rem] text-white">
          Most Popular
        </p>
        <div className="flex flex-1 flex-col justify-between px-6 pb-6 pt-2">{body}</div>
      </article>
    )
  }
  return (
    <article className={`${shared} border border-line p-6 ${plan.id === 'business' ? 'lg:-translate-y-0.5' : ''}`}>
      {body}
    </article>
  )
}

export function Pricing({ items = defaultPlans }: { items?: PricingPlan[] }) {
  const [period, setPeriod] = useState<BillingPeriod>('monthly')

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="mx-[1.09375rem] bg-surface py-6 md:mx-0 md:py-20">
      <Container>
        <SectionHeading
          id="pricing-heading"
          size="lg"
          title={
            <>
              <span className="block md:inline">Simple, transparent</span>{' '}
              <span className="block md:inline">pricing</span>
            </>
          }
          subtitle="Choose the plan that works best for your team."
          subtitleClassName="mt-[1.125rem]! md:mt-2! md:text-sm! md:leading-[1.3125rem]!"
        />
        <div className="mt-4 flex gap-2 md:mt-6 md:justify-center" role="group" aria-label="Billing period">
          {periods.map((p) => {
            const active = p.id === period
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={active}
                onClick={() => setPeriod(p.id)}
                className={`h-9 ${p.width} rounded-[0.625rem] text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  active
                    ? 'bg-brand-gradient text-white'
                    : 'border border-line bg-surface text-ink hover:border-brand hover:text-brand'
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>

        <div className="no-scrollbar -mx-[2.34375rem] mt-[0.78125rem] flex snap-x scroll-px-[2.34375rem] gap-6 overflow-x-auto px-[2.34375rem] pb-0 md:mx-0 md:mt-14 md:grid md:grid-cols-3 md:items-stretch md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:items-start lg:gap-[2.625rem] lg:pt-[1.85062rem]">
          {items.map((p) => <PricingCard key={p.id} plan={p} period={period} />)}
        </div>
      </Container>
    </section>
  )
}
