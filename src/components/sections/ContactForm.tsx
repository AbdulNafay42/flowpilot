import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useForm } from 'react-hook-form'
import chevronIcon from '../../assets/icons/select-chevron.svg'
import {
  MESSAGE_MAX,
  MESSAGE_MIN,
  SUBMIT_DELAY_MS,
  MOBILE_DEFAULT_TEAM_SIZE,
  SUCCESS_MESSAGE,
  demoTimes,
  teamSizeLabel,
  teamSizes,
} from '../../data/form'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

interface FormValues {
  fullName: string
  email: string
  company: string
  teamSize: '' | (typeof teamSizes)[number]
  demoTime: string
  message: string
  terms: boolean
}

// Figma: 46px / white fields on desktop, 40px / tinted fields at 375px.
const fieldClass =
  'block w-full rounded-lg border border-line bg-surface-alt px-[0.8125rem] text-[0.8125rem] text-ink placeholder:text-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand aria-[invalid=true]:border-danger md:bg-surface md:px-[0.9375rem] md:text-sm'
const inputClass = `${fieldClass} h-10 md:h-[2.875rem]`
// Required marker is CSS-only (desktop design) so it stays out of the accessible label text.
const labelClass =
  'block text-xs font-medium leading-[1.125rem] text-ink md:text-[0.8125rem] md:font-semibold md:leading-[1.21875rem] md:after:content-["_*"]'
const fieldWrap = 'flex flex-col gap-1 md:gap-1.5'

const MOBILE_QUERY = 'not (min-width: 48rem)' // below Tailwind's md breakpoint

/** True below the md breakpoint. Falls back to false where matchMedia is missing (tests). */
function useIsMobile() {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window.matchMedia !== 'function') return () => {}
      const mql = window.matchMedia(MOBILE_QUERY)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => typeof window.matchMedia === 'function' && window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return <p id={id} role="alert" className="text-xs text-danger">{message}</p>
}

function SelectChevron() {
  return (
    <img
      src={chevronIcon}
      alt=""
      width={21}
      height={21}
      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
    />
  )
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const isMobile = useIsMobile()
  const inFlight = useRef(false)

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onTouched',
    // Unmounted (hidden) fields are dropped, so a hidden Preferred Demo Time
    // can neither block submission nor leak a stale value.
    shouldUnregister: true,
    // Figma's 375px form shows Team Size already selected; desktop shows the placeholder.
    defaultValues: { teamSize: isMobile ? MOBILE_DEFAULT_TEAM_SIZE : '', terms: false },
  })

  const teamSize = watch('teamSize')

  // The 375px design preselects Team Size, desktop shows the placeholder. Keep that in sync
  // if the viewport crosses the breakpoint after load, until the user picks a size themselves.
  const teamSizeTouched = useRef(false)
  useEffect(() => {
    if (!teamSizeTouched.current) setValue('teamSize', isMobile ? MOBILE_DEFAULT_TEAM_SIZE : '')
  }, [isMobile, setValue])
  const teamSizeField = register('teamSize', { required: 'Select your team size' })
  const demoTime = watch('demoTime')
  const messageLength = (watch('message') ?? '').length

  const onSubmit = async () => {
    inFlight.current = true
    await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS)) // simulated request
    setSubmitted(true)
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="mx-[1.09375rem] bg-surface pb-12 pt-6 md:mx-0 md:bg-soft-gradient md:pb-[2.85062rem] md:pt-20">
      <Container className="flex flex-col gap-1 lg:flex-row lg:justify-between lg:gap-10">
        <div className="lg:w-[26.8125rem] lg:shrink-0 lg:pt-4">
          <p className="hidden text-xs font-bold uppercase tracking-[0.0375rem] text-brand md:block">Get in touch</p>
          <h2 id="contact-heading" className="text-2xl font-extrabold leading-[1.875rem] text-ink md:mt-2 md:text-[2.125rem] md:leading-[2.3375rem]">
            Let&apos;s build the future together
          </h2>
          <p className="mt-1 text-xs font-medium leading-[1.125rem] text-muted md:hidden">Contact form reference</p>
          <p className="mt-[0.94125rem] hidden max-w-[25rem] text-[0.8125rem] leading-[1.3125rem] text-muted md:block">
            Have questions? Want a demo? Send us a message and our team will get back to you.
          </p>
        </div>

        <div className="mt-6 md:mt-8 lg:mt-0 lg:w-[42.1875rem] lg:max-w-full">
          <div className="md:rounded-2xl md:border md:border-line md:bg-surface md:p-8 md:shadow-soft">
            {submitted ? (
              <p role="status" className="rounded-lg bg-surface-alt p-6 text-center text-sm font-medium text-ink">
                {SUCCESS_MESSAGE}
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  // Ignore further submit events while one is pending (the button is disabled too).
                  if (inFlight.current) {
                    e.preventDefault()
                    return
                  }
                  void handleSubmit(onSubmit)(e)
                }}
                noValidate className="flex flex-col gap-3.5 md:gap-5">
                <div className="grid gap-3.5 md:grid-cols-2 md:gap-5">
                  <div className={fieldWrap}>
                    <label htmlFor="fullName" className={labelClass}>Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder={isMobile ? 'Sarah Connor' : 'John Doe'}
                      className={inputClass}
                      aria-required="true"
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                      {...register('fullName', {
                        required: 'Full name is required',
                        minLength: { value: 3, message: 'Full name must be at least 3 characters' },
                        validate: (v) => v.trim() !== '' || 'Full name is required',
                      })}
                    />
                    <FieldError id="fullName-error" message={errors.fullName?.message} />
                  </div>

                  <div className={fieldWrap}>
                    <label htmlFor="email" className={labelClass}>Work Email</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder={isMobile ? 'sarah@company.com' : 'you@company.com'}
                      className={inputClass}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      {...register('email', {
                        required: 'Work email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                      })}
                    />
                    <FieldError id="email-error" message={errors.email?.message} />
                  </div>

                  <div className={fieldWrap}>
                    <label htmlFor="company" className={labelClass}>Company Name</label>
                    <input
                      id="company"
                      type="text"
                      autoComplete="organization"
                      placeholder={isMobile ? 'Acme Studio' : 'Acme Inc.'}
                      className={inputClass}
                      aria-required="true"
                      aria-invalid={!!errors.company}
                      aria-describedby={errors.company ? 'company-error' : undefined}
                      {...register('company', {
                        required: 'Company name is required',
                        validate: (v) => v.trim() !== '' || 'Company name is required',
                      })}
                    />
                    <FieldError id="company-error" message={errors.company?.message} />
                  </div>

                  <div className={fieldWrap}>
                    <label htmlFor="teamSize" className={labelClass}>Team Size</label>
                    <div className="relative">
                      <select
                        id="teamSize"
                        className={`${inputClass} appearance-none pr-10 ${teamSize === '' ? 'text-muted' : ''}`}
                        aria-required="true"
                      aria-invalid={!!errors.teamSize}
                        aria-describedby={errors.teamSize ? 'teamSize-error' : undefined}
                        {...teamSizeField}
                        onChange={(e) => {
                          teamSizeTouched.current = true
                          return teamSizeField.onChange(e)
                        }}
                      >
                        <option value="">Select team size</option>
                        {teamSizes.map((s) => <option key={s} value={s}>{teamSizeLabel(s)}</option>)}
                      </select>
                      <SelectChevron />
                    </div>
                    <FieldError id="teamSize-error" message={errors.teamSize?.message} />
                  </div>

                  {teamSize === '200+' && (
                    <div className={fieldWrap}>
                      <label htmlFor="demoTime" className={labelClass}>Preferred Demo Time</label>
                      <div className="relative">
                        <select
                          id="demoTime"
                          className={`${inputClass} appearance-none pr-10 ${demoTime ? '' : 'text-muted'}`}
                          aria-required="true"
                      aria-invalid={!!errors.demoTime}
                          aria-describedby={errors.demoTime ? 'demoTime-error' : undefined}
                          {...register('demoTime', { required: 'Select a preferred demo time' })}
                        >
                          <option value="">Select a time</option>
                          {demoTimes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <SelectChevron />
                      </div>
                      <FieldError id="demoTime-error" message={errors.demoTime?.message} />
                    </div>
                  )}
                </div>

                <div className={`relative ${fieldWrap}`}>
                  <label htmlFor="message" className={`${labelClass} pr-14`}>Message</label>
                  <textarea
                    id="message"
                    placeholder={isMobile ? "Tell us about your team's workflow challenges..." : 'Tell us about your needs…'}
                    className={`${fieldClass} h-[6.125rem] resize-none py-3 max-md:px-[0.6875rem] max-md:pt-[0.6875rem] md:h-[4.875rem]`}
                    aria-required="true"
                      aria-invalid={!!errors.message}
                    aria-describedby={`message-count${errors.message ? ' message-error' : ''}`}
                    {...register('message', {
                      required: 'Message is required',
                      minLength: { value: MESSAGE_MIN, message: `Message must be at least ${MESSAGE_MIN} characters` },
                      maxLength: { value: MESSAGE_MAX, message: `Message must be at most ${MESSAGE_MAX} characters` },
                      validate: (v) => v.trim() !== '' || 'Message is required',
                    })}
                  />
                  <p
                    id="message-count"
                    className="absolute right-0 top-0 text-[0.6875rem] leading-[1.125rem] text-muted md:bottom-2.5 md:right-3 md:top-auto md:leading-[1.03125rem]"
                  >
                    {messageLength}/{MESSAGE_MAX}
                  </p>
                  <FieldError id="message-error" message={errors.message?.message} />
                </div>

                <div>
                  <label className="flex items-start gap-2 text-[0.6875rem] leading-[1.03125rem] text-muted">
                    <input
                      type="checkbox"
                      className="check-input mt-px size-3.5 shrink-0 md:size-4"
                      aria-required="true"
                      aria-invalid={!!errors.terms}
                      aria-describedby={errors.terms ? 'terms-error' : undefined}
                      {...register('terms', { required: 'You must accept the terms to continue' })}
                    />
                    <span>
                      I agree to the <span className="text-brand md:text-inherit">Terms of Service</span> and{' '}
                      <span className="text-brand md:text-inherit">Privacy Policy</span>
                      <span className="md:hidden">.</span>
                      <span aria-hidden className="hidden md:inline"> *</span>
                    </span>
                  </label>
                  <FieldError id="terms-error" message={errors.terms?.message} />
                </div>

                <Button type="submit" disabled={isSubmitting} className="mt-2 h-[2.625rem] w-full md:mt-0 md:h-[2.6875rem]">
                  {isSubmitting ? 'Submitting…' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
