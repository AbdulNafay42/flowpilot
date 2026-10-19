import type { Feature } from '../../types'

/** Row card on mobile, stacked card from md up. Lifts and tints its border on hover. */
export function FeatureCard({ feature }: { feature: Feature }) {
  const { icon } = feature
  return (
    <article className="group flex items-center gap-3.5 rounded-[0.875rem] border border-line bg-surface p-[0.9375rem] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-card md:flex-col md:items-start md:gap-0 md:rounded-2xl md:p-[1.5625rem] lg:min-h-[12.5rem]">
      {icon.type === 'image' ? (
        <img src={icon.src} alt="" width={44} height={44} className="size-11 shrink-0" />
      ) : (
        <span
          aria-hidden
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-[1.0625rem] font-bold text-white ${icon.tone}`}
        >
          {icon.glyph}
        </span>
      )}
      <div className="md:mt-5">
        <h3 className="text-sm font-bold leading-[1.09375rem] text-ink md:text-base md:leading-6">{feature.title}</h3>
        <p className="mt-0.5 text-[0.6875rem] leading-[1.03125rem] text-muted md:mt-[0.34rem] md:text-[0.8125rem] md:leading-[1.05625rem]">
          <span className="md:hidden">{feature.short}</span>
          <span className="hidden md:inline">{feature.description}</span>
        </p>
      </div>
    </article>
  )
}
