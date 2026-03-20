"use client";

import { useState, useEffect, useRef } from "react";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import { useTracking } from "@/hooks/useTracking";
import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import { Reveal } from "@/components/Reveal";

const PHONE = "(406) 250-2360";
const PHONE_HREF = "tel:4062502360";

/* ── Animated counter ── */
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let current = 0;
        const step = Math.ceil(target / 40);
        const interval = setInterval(() => {
          current += step;
          if (current >= target) { setCount(target); clearInterval(interval); }
          else setCount(current);
        }, 30);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref} className="font-display text-5xl md:text-6xl font-bold text-accent">{prefix}{count.toLocaleString()}{suffix}</div>;
}

/* ── Phone formatting ── */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, "").length === 10;
}

/* ── CTA blocks ── */
function DualCTA({ primary, href = "#hero-form" }: { primary: string; href?: string }) {
  return (
    <div className="mt-10 flex flex-row flex-wrap items-center justify-center gap-3">
      <a href={href} className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 font-display font-bold text-lg uppercase tracking-wider hover:bg-primary/90 transition-all">
        {primary}
      </a>
      <a href={PHONE_HREF} className="inline-flex items-center justify-center border-2 border-primary rounded-lg px-6 py-3 font-display font-semibold text-primary uppercase tracking-wider hover:bg-primary hover:text-white transition-all">
        Call {PHONE}
      </a>
    </div>
  );
}

/* ── Lead Form (standalone component with own state) ── */
function LeadForm({ id = "hero-form" }: { id?: string }) {
  const { submit: submitLead } = useMegaLeadForm();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "", electricBill: "", creditScore: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || submitted) return;
    if (!isValidPhone(formData.phone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }
    setPhoneError("");
    setSubmitting(true);
    try {
      await submitLead({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        electricBill: formData.electricBill,
        creditScore: formData.creditScore,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Form submission error:", err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="bg-primary/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
      <h3 className="font-display text-3xl font-bold mb-2 text-white uppercase tracking-wide">Book Your Free Assessment</h3>
      <p className="text-gray-300 mb-6 text-sm">Find out how much you could save with solar + battery.</p>

      {submitted ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <h4 className="font-display text-2xl font-bold text-white mb-2 uppercase">You&apos;re All Set</h4>
          <p className="text-gray-300">We&apos;ll be in touch within 24 hours to schedule your free solar assessment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input type="text" name="firstName" placeholder="First Name" required
              className="border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3.5 focus:border-accent outline-none transition-colors"
              value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            <input type="text" name="lastName" placeholder="Last Name" required
              className="border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3.5 focus:border-accent outline-none transition-colors"
              value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
          </div>
          <input type="email" name="email" placeholder="Email Address" required
            className="w-full border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3.5 focus:border-accent outline-none transition-colors mb-3"
            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="tel" name="phone" inputMode="numeric" placeholder="Phone Number" required
            pattern="\(\d{3}\) \d{3}-\d{4}" title="Please enter a valid 10-digit phone number"
            className={`w-full border-2 ${phoneError ? "border-red-400" : "border-white/20"} bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3.5 focus:border-accent outline-none transition-colors mb-1`}
            value={formData.phone} onChange={(e) => { setFormData({ ...formData, phone: formatPhone(e.target.value) }); setPhoneError(""); }} />
          {phoneError && <p className="text-red-400 text-xs mb-2">{phoneError}</p>}
          {!phoneError && <div className="mb-3" />}

          <input type="text" name="address" placeholder="Address" required
            className="w-full border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3.5 focus:border-accent outline-none transition-colors mb-3"
            value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

          <div className="relative mb-3">
            <select
              name="electricBill"
              required
              className="w-full border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3.5 pr-10 focus:border-accent outline-none transition-colors appearance-none"
              value={formData.electricBill}
              onChange={(e) => setFormData({ ...formData, electricBill: e.target.value })}
            >
              <option value="" disabled className="text-gray-800">Average Monthly Electric Bill</option>
              <option value="under_100" className="text-gray-800">Under $100</option>
              <option value="100_250" className="text-gray-800">$100–$250</option>
              <option value="250_500" className="text-gray-800">$250–$500</option>
              <option value="500_plus" className="text-gray-800">$500+</option>
              <option value="dont_know" className="text-gray-800">I don&apos;t know</option>
              <option value="no_bill" className="text-gray-800">I don&apos;t receive a monthly electric bill</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </div>

          <div className="relative mb-4">
            <select
              name="creditScore"
              required
              className="w-full border-2 border-white/20 bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3.5 pr-10 focus:border-accent outline-none transition-colors appearance-none"
              value={formData.creditScore}
              onChange={(e) => setFormData({ ...formData, creditScore: e.target.value })}
            >
              <option value="" disabled className="text-gray-800">Credit Score</option>
              <option value="under_600" className="text-gray-800">Under 600</option>
              <option value="600_700" className="text-gray-800">600–700</option>
              <option value="700_plus" className="text-gray-800">700+</option>
              <option value="dont_know" className="text-gray-800">I don&apos;t know</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </div>

          <button type="submit" disabled={submitting || submitted}
            className="w-full bg-accent text-white font-display font-bold py-4 rounded-lg text-lg uppercase tracking-wider hover:bg-accent/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting ? "Submitting..." : "Schedule My Free Assessment"}
          </button>
        </>
      )}
    </form>
  );
}

export default function LandingPage() {
  useTracking({ siteKey: "sk_mmv1597s_i3ve8nl7cv", gtmId: "GTM-N6DBKMH9" });

  const [showFloating, setShowFloating] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloating(window.scrollY > 800);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <QueryParamPersistence />

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 z-[100] h-1 bg-accent transition-none" style={{ width: `${scrollProgress}%` }} />

      {/* ═══ Header ═══ */}
      <header className="fixed top-0 w-full z-50 bg-light-bg/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="#hero" className="block">
            <img src="/repower-logo.png" alt="repower" className="h-8 w-auto" />
          </a>
          <div className="flex items-center gap-3">
            <a href={PHONE_HREF} className="hidden sm:flex items-center gap-2 border-2 border-primary rounded-lg px-4 py-2 font-display font-semibold text-primary uppercase tracking-wider text-sm hover:bg-primary hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
              {PHONE}
            </a>
            <a href="#hero-form" className="bg-primary text-white px-5 py-2.5 font-display font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-all rounded-lg">
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* ═══ Hero ═══ */}
      <section id="hero" className="min-h-screen pt-20 flex items-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/cta-1.png" alt="repower installer on roof" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10 py-16 md:py-24">
          <div>
            <Reveal>
              <div className="inline-block bg-accent/20 border border-accent/40 rounded-full px-4 py-1 mb-6">
                <span className="text-accent font-display font-semibold text-sm uppercase tracking-wider">Montana&apos;s Solar + Battery Experts</span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white uppercase leading-[0.95] mb-6">
                Power Your<br />Home With<br /><span className="text-accent">Solar + Battery</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                Slash your energy bills and gain true independence from the grid. Montana averages 300+ days of sunshine, making your roof one of your best investments.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex flex-row flex-wrap items-center gap-4">
                <a href="#hero-form" className="inline-flex items-center justify-center bg-accent text-white px-8 py-4 font-display font-bold text-lg uppercase tracking-wider hover:bg-accent/90 transition-all text-center rounded-lg">
                  Book Free Assessment
                </a>
                <a href={PHONE_HREF} className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 font-display font-bold text-lg uppercase tracking-wider hover:bg-white hover:text-primary transition-all text-center rounded-lg">
                  Call {PHONE}
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={400}>
            <LeadForm />
          </Reveal>
        </div>
      </section>

      {/* ═══ Trust Badges ═══ */}
      <section id="trust" className="py-8 bg-white border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4">
          <Reveal>
            <img src="/trust-badges.png" alt="Avoid Power Outages | Montana Based Business | Save on Energy Costs" className="h-16 md:h-20 w-auto opacity-80" />
          </Reveal>
          <DualCTA primary="Book My Free Assessment" href="#hero-form" />
        </div>
      </section>

      {/* ═══ Stats ═══ */}
      <section id="stats" className="py-20 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <AnimatedCounter target={300} suffix="+" />
                <div className="text-text-muted mt-2 uppercase tracking-wider text-sm font-display font-semibold">Days of Sunshine</div>
              </div>
              <div>
                <AnimatedCounter target={30} suffix="%" />
                <div className="text-text-muted mt-2 uppercase tracking-wider text-sm font-display font-semibold">Federal Tax Credit</div>
              </div>
              <div>
                <AnimatedCounter target={25} suffix=" Yr" />
                <div className="text-text-muted mt-2 uppercase tracking-wider text-sm font-display font-semibold">Panel Warranty</div>
              </div>
              <div>
                <AnimatedCounter target={0} prefix="$" />
                <div className="text-text-muted mt-2 uppercase tracking-wider text-sm font-display font-semibold">Down Available</div>
              </div>
            </div>
          </Reveal>
          <DualCTA primary="Get My Free Assessment" />
        </div>
      </section>

      {/* ═══ Benefits — People focused ═══ */}
      <section id="benefits" className="py-24 bg-light-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <div className="text-accent uppercase tracking-[0.2em] text-sm font-display font-semibold mb-4">Why Go Solar?</div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-primary uppercase mb-6 leading-tight">Take Control of Your Energy Future</h2>
                <p className="text-text-muted text-lg mb-8 leading-relaxed">
                  Montana homeowners are switching to solar + battery for energy independence, lower bills, and protection from outages. Here&apos;s what you gain:
                </p>
                <div className="space-y-5">
                  {[
                    "Eliminate or dramatically reduce your monthly electric bill",
                    "Battery backup keeps your home powered during outages",
                    "30% federal tax credit significantly reduces installation cost",
                    "Increase your home&apos;s value by an average of 4.1%",
                    "Cool Montana temperatures boost panel efficiency 10-25%",
                    "Strong net metering lets you sell excess power back to the grid"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </div>
                      <span className="text-text-dark text-lg" dangerouslySetInnerHTML={{ __html: item }} />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="relative">
                <img src="/cta-3.png" alt="repower team installing solar panels" className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/5]" />
                <div className="absolute -bottom-6 -left-6 bg-primary text-white rounded-2xl p-6 shadow-xl hidden lg:block">
                  <div className="font-display text-4xl font-bold text-accent">$20K-$40K</div>
                  <div className="text-gray-300 text-sm mt-1">Average 25-year savings</div>
                </div>
              </div>
            </Reveal>
          </div>
          <DualCTA primary="See My Savings Potential" />
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section id="how-it-works" className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-accent uppercase tracking-[0.2em] text-sm font-display font-semibold mb-4">Simple Process</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">Your Path to Energy Independence</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Free Assessment", desc: "We evaluate your property, energy usage, and goals. No pressure, no obligation, just honest guidance.", icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" },
              { step: "02", title: "Custom Design", desc: "Our engineers design a system optimized for your roof, shading patterns, and energy needs.", icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.764m3.42 3.42a6.776 6.776 0 00-3.42-3.42" },
              { step: "03", title: "Professional Install", desc: "Certified installers handle everything. Most residential installs complete in just 1-2 days.", icon: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" },
              { step: "04", title: "Power On", desc: "Your system goes live. Start generating clean energy and watch your savings grow month after month.", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" }
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 150}>
                <div className="text-center relative">
                  <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                  </div>
                  <div className="font-display text-5xl font-bold text-white/10 absolute top-0 right-4">{item.step}</div>
                  <h3 className="font-display text-xl font-bold uppercase mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex flex-row flex-wrap items-center justify-center gap-3">
            <a href="#contact" className="inline-flex items-center justify-center bg-accent text-white px-8 py-4 font-display font-bold text-lg uppercase tracking-wider hover:bg-accent/90 transition-all rounded-lg">
              Start My Solar Journey
            </a>
            <a href={PHONE_HREF} className="inline-flex items-center justify-center border-2 border-white rounded-lg px-6 py-3 font-display font-semibold text-white uppercase tracking-wider hover:bg-white hover:text-primary transition-all">
              Call {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* ═══ Solar + Battery Split ═══ */}
      <section id="solutions" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-accent uppercase tracking-[0.2em] text-sm font-display font-semibold mb-4">Our Solutions</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-primary uppercase">Solar + Battery, Better Together</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            <Reveal>
              <div className="relative rounded-2xl overflow-hidden group h-full">
                <img src="/cta-5.png" alt="repower solar installation" className="w-full h-80 object-cover object-center" />
                <div className="bg-light-bg p-8 border border-gray-200 rounded-b-2xl">
                  <h3 className="font-display text-2xl font-bold text-primary uppercase mb-4">Solar Panels</h3>
                  <ul className="space-y-3 text-text-muted">
                    {["Custom-designed for your roof and energy needs", "Premium panels with 25+ year warranty", "Works year-round, even in Montana winters", "Net metering: sell excess power back to the grid"].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="relative rounded-2xl overflow-hidden group h-full">
                <img src="/cta-2.png" alt="Tesla Powerwall battery backup" className="w-full h-80 object-cover object-center" />
                <div className="bg-light-bg p-8 border border-gray-200 rounded-b-2xl">
                  <h3 className="font-display text-2xl font-bold text-primary uppercase mb-4">Battery Backup</h3>
                  <ul className="space-y-3 text-text-muted">
                    {["Keep your lights on when the grid goes down", "Store excess solar energy for nighttime use", "Critical protection during Montana winter storms", "Smart energy management from your phone"].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
          <DualCTA primary="Explore My Options" />
        </div>
      </section>

      {/* ═══ Savings Potential ═══ */}
      <section id="savings" className="py-24 bg-light-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <div className="text-accent uppercase tracking-[0.2em] text-sm font-display font-semibold mb-4">The Numbers</div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-primary uppercase mb-6 leading-tight">Your Savings Potential</h2>
                <div className="space-y-8">
                  <div className="border-l-4 border-accent pl-6">
                    <div className="font-display text-4xl font-bold text-primary">$20,000 - $40,000</div>
                    <div className="text-text-muted mt-1">Average 25-year savings for Montana homeowners</div>
                  </div>
                  <div className="border-l-4 border-accent pl-6">
                    <div className="font-display text-4xl font-bold text-primary">5-7 Years</div>
                    <div className="text-text-muted mt-1">Typical payback period with 30% federal tax credit</div>
                  </div>
                  <div className="border-l-4 border-accent pl-6">
                    <div className="font-display text-4xl font-bold text-primary">4.1%</div>
                    <div className="text-text-muted mt-1">Average home value increase with solar installation</div>
                  </div>
                  <div className="border-l-4 border-accent pl-6">
                    <div className="font-display text-4xl font-bold text-primary">$0 Down</div>
                    <div className="text-text-muted mt-1">Financing available, often less than current electric bill</div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="relative">
                <img src="/mtn-cutout.png" alt="Montana mountains" className="w-full" />
              </div>
            </Reveal>
          </div>
          <DualCTA primary="Calculate My Savings" />
        </div>
      </section>

      {/* ═══ Testimonials ═══ */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-accent uppercase tracking-[0.2em] text-sm font-display font-semibold mb-4">What Homeowners Say</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-primary uppercase">Montana Families Love repower</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Our electric bill went from $180/month to under $20. The battery backup gave us complete peace of mind during last winter's storms. Best investment we've ever made for our home.", name: "Sarah & Tom H.", location: "Billings, MT", rating: 5 },
              { quote: "I was skeptical about solar in Montana, but the numbers don't lie. We're generating more power than we use most months and selling the excess back to the grid.", name: "Mike R.", location: "Missoula, MT", rating: 5 },
              { quote: "The repower team was professional from start to finish. The install was fast, and the 30% tax credit made it incredibly affordable. Our ranch is now powered by Montana sunshine.", name: "Linda K.", location: "Bozeman, MT", rating: 5 }
            ].map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 120}>
                <div className="bg-light-bg rounded-2xl p-8 border border-gray-200 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-text-dark mb-6 leading-relaxed flex-1">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <div className="font-display font-bold text-primary uppercase">{testimonial.name}</div>
                    <div className="text-text-muted text-sm">{testimonial.location}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <DualCTA primary="Join Happy Montana Homeowners" />
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-24 bg-light-bg">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-accent uppercase tracking-[0.2em] text-sm font-display font-semibold mb-4">Questions?</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-primary uppercase">Common Questions About Solar</h2>
            </div>
          </Reveal>

          <div className="space-y-4">
            {[
              { q: "Does solar really work in Montana winters?", a: "Absolutely. Montana receives over 300 days of sunshine per year. Solar panels actually perform better in cold temperatures, with efficiency gains of 10-25%. While shorter winter days produce less energy, battery storage and net metering credits from summer overproduction offset this significantly." },
              { q: "How much does a residential solar system cost?", a: "Average residential systems range from $15,000-$30,000 before incentives. The 30% federal tax credit brings this down significantly. We offer $0-down financing options with monthly payments often lower than your current electric bill." },
              { q: "What happens during a power outage?", a: "With battery backup, your essential circuits stay powered automatically. Your home transitions seamlessly to battery power, keeping lights, refrigerator, and critical systems running. We strongly recommend battery backup for Montana homes given winter storm risks." },
              { q: "How long does installation take?", a: "Most residential installations complete in 1-2 days. The full process from initial consultation to power-on is typically 6-8 weeks, which includes custom design, permitting, and utility approval." },
              { q: "Will solar increase my home value?", a: "Studies consistently show solar systems increase home value by an average of 4.1%. In Montana's growing real estate market, solar is an increasingly attractive feature for buyers, often paying for itself at resale." },
              { q: "What maintenance is required?", a: "Very little. Solar panels have no moving parts. We recommend annual inspections and occasional cleaning if debris accumulates. Your real-time monitoring system alerts you to any performance issues automatically." }
            ].map((faq, index) => (
              <Reveal key={index} delay={index * 60}>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left">
                    <h3 className="font-display text-lg font-bold text-primary uppercase pr-4">{faq.q}</h3>
                    <svg className={`w-6 h-6 text-accent flex-shrink-0 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="text-text-muted leading-relaxed px-6 pb-6">{faq.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <DualCTA primary="Get My Questions Answered" href="#contact" />
        </div>
      </section>

      {/* ═══ Final CTA + Form ═══ */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/cta-4.jpg" alt="Montana solar landscape" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <Reveal>
            <div className="text-accent uppercase tracking-[0.2em] text-sm font-display font-semibold mb-4">Ready for Energy Independence?</div>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white uppercase mb-6">
              Your Brighter Future<br />Starts Here
            </h2>
            <p className="text-gray-300 text-xl mb-12 max-w-2xl mx-auto">
              Schedule your free consultation and discover how solar + battery can transform your energy costs and independence.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="max-w-2xl mx-auto">
              <LeadForm id="contact-form" />
            </div>
          </Reveal>
          <div className="mt-8 flex justify-center">
            <a href={PHONE_HREF} className="border-2 border-white rounded-lg px-6 py-3 font-display font-semibold text-white uppercase tracking-wider hover:bg-white hover:text-primary transition-all">
              Or Call {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="py-8 bg-primary text-center">
        <p className="text-gray-500 text-sm">
          © 2026 repower Montana. All rights reserved.
        </p>
      </footer>

      {/* ═══ Floating Sticky CTA ═══ */}
      <div className={`fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto z-40 transition-all duration-500 ${showFloating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}>
        <a href="#contact" className="bg-accent text-white md:rounded-2xl shadow-2xl p-4 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-wider text-sm hover:bg-accent/90 transition-all">
          Book Now
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </a>
      </div>
    </>
  );
}
