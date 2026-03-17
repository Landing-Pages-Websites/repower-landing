"use client";

import { useState, useEffect, useRef } from "react";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import { Reveal } from "@/components/Reveal";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
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

  return <div ref={ref} className="font-display text-5xl md:text-6xl font-bold text-primary">{count}{suffix}</div>;
}

export default function LandingPage() {
  const { submit: submitLead, isSubmitting } = useMegaLeadForm();
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", propertyType: "", electricBill: "", message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowFloating(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) return;
    try {
      await submitLead({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        needsType: formData.propertyType,
        message: `Electric Bill: ${formData.electricBill}. ${formData.message}`.trim()
      });
      setSubmitted(true);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", propertyType: "", electricBill: "", message: "" });
    } catch { /* fail silently */ }
  };

  const LeadForm = ({ id = "hero-form" }: { id?: string }) => (
    <form id={id} onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
      <h3 className="font-display text-3xl font-bold mb-2 text-primary uppercase tracking-wide">Book Your Consultation</h3>
      <p className="text-text-muted mb-6 text-sm">Free solar assessment for your Montana property.</p>
      
      {submitted ? (
        <div className="text-center py-8">
          <div className="text-primary text-4xl mb-4">✓</div>
          <h4 className="font-display text-2xl font-bold text-primary mb-2">Consultation Booked</h4>
          <p className="text-text-muted">We&apos;ll contact you within 24 hours to schedule your free assessment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input type="text" name="firstName" placeholder="First Name *" required className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            <input type="text" name="lastName" placeholder="Last Name *" required className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input type="email" name="email" placeholder="Email *" required className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input type="tel" name="phone" placeholder="Phone *" required className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <select name="propertyType" className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors mb-3" value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}>
            <option value="">Property Type</option>
            <option value="residential">Residential Home</option>
            <option value="commercial">Commercial Business</option>
            <option value="agricultural">Farm / Agricultural</option>
          </select>
          <select name="electricBill" className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors mb-3" value={formData.electricBill} onChange={(e) => setFormData({ ...formData, electricBill: e.target.value })}>
            <option value="">Monthly Electric Bill</option>
            <option value="under-100">Under $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200-400">$200 - $400</option>
            <option value="over-400">Over $400</option>
          </select>
          <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-4 rounded-lg text-lg uppercase tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50">
            {isSubmitting ? "Booking..." : "Schedule My Free Consultation"}
          </button>
        </>
      )}
    </form>
  );

  return (
    <>
      <QueryParamPersistence />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-light-bg/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-display text-2xl font-bold text-primary lowercase tracking-tight">repower</div>
          <a href="#hero-form" className="bg-primary text-white px-6 py-2.5 rounded-none font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-all">
            Get Started
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="min-h-screen pt-20 flex items-center relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/70" />
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10 py-12">
          <div>
            <Reveal>
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-white uppercase leading-[0.95] mb-6">
                SOLAR + BATTERY FOR MONTANA
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                Power your Montana home or business with clean, reliable solar energy and battery backup. Achieve true energy independence with a system engineered for Montana&apos;s unique climate.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <a href="#hero-form" className="inline-block bg-white text-primary px-8 py-4 font-bold text-lg uppercase tracking-wider hover:bg-gray-100 transition-all">
                Schedule Free Consultation
              </a>
            </Reveal>
          </div>
          <Reveal delay={400}>
            <LeadForm />
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <AnimatedCounter target={300} suffix="+" />
                <div className="text-text-muted mt-2 uppercase tracking-wider text-sm">Days of Sunshine</div>
              </div>
              <div>
                <AnimatedCounter target={30} suffix="%" />
                <div className="text-text-muted mt-2 uppercase tracking-wider text-sm">Tax Credit</div>
              </div>
              <div>
                <AnimatedCounter target={25} suffix="+" />
                <div className="text-text-muted mt-2 uppercase tracking-wider text-sm">Year Warranty</div>
              </div>
              <div>
                <AnimatedCounter target={0} suffix="" />
                <div className="text-text-muted mt-2 uppercase tracking-wider text-sm">$0 Down Available</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-text-muted uppercase tracking-[0.2em] text-sm font-semibold mb-4">Our Solutions</div>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-primary uppercase">Solar Solutions for Montana</h2>
            </div>
          </Reveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Residential Solar", desc: "Custom solar panel systems designed for Montana homes. Reduce or eliminate your electric bill while increasing property value. Works year-round, even during Montana winters." },
              { title: "Battery Backup", desc: "Keep your lights on when the grid goes down. Our battery systems store excess solar energy for nighttime use and power outages — critical for Montana winters." },
              { title: "Commercial Solar", desc: "Scalable solar solutions for Montana businesses, farms, and ranches. Reduce operating costs and demonstrate environmental leadership." },
              { title: "Off-Grid Systems", desc: "Complete energy independence for remote Montana properties. Solar + battery + generator integration for reliable year-round power." },
              { title: "EV Charging", desc: "Add solar-powered EV charging to your home or business. Power your vehicle with clean Montana sunshine." },
              { title: "Energy Monitoring", desc: "Real-time monitoring of your solar production, battery status, and energy usage. Track savings from your phone." }
            ].map((service, index) => (
              <Reveal key={service.title} delay={index * 80}>
                <div className="bg-white rounded-none p-8 border border-gray-200 hover:border-primary transition-all">
                  <h3 className="font-display text-2xl font-bold text-primary uppercase mb-4">{service.title}</h3>
                  <p className="text-text-muted leading-relaxed">{service.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={500}>
            <div className="flex justify-center mt-12">
              <a href="#contact" className="bg-primary text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-primary/90 transition-all">
                Explore Solutions
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why Solar in Montana */}
      <section id="why-montana" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <div className="text-text-muted uppercase tracking-[0.2em] text-sm font-semibold mb-4">Montana Advantage</div>
                <h2 className="font-display text-5xl font-bold text-primary uppercase mb-6">Why Montana Is Perfect for Solar</h2>
                <p className="text-text-muted text-lg mb-8 leading-relaxed">
                  Montana receives over 300 days of sunshine per year. Combined with cool temperatures that actually boost solar panel efficiency, Montana is one of the best states for residential solar energy production.
                </p>
                <div className="space-y-5">
                  {[
                    "300+ days of sunshine annually — more than most US states",
                    "Cool temperatures increase panel efficiency by 10-25%",
                    "Strong net metering policies let you sell excess power back",
                    "30% federal tax credit significantly reduces installation cost",
                    "Rising electricity rates make solar savings grow over time",
                    "Battery backup protects against winter storm power outages"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-none flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </div>
                      <span className="text-text-dark">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="bg-primary text-white rounded-none p-10">
                <h3 className="font-display text-3xl font-bold uppercase mb-6">Your Savings Potential</h3>
                <div className="space-y-6">
                  <div className="border-b border-white/20 pb-4">
                    <div className="font-display text-4xl font-bold">$20,000 - $40,000</div>
                    <div className="text-gray-300 mt-1">Average 25-year savings for Montana homeowners</div>
                  </div>
                  <div className="border-b border-white/20 pb-4">
                    <div className="font-display text-4xl font-bold">5-7 Years</div>
                    <div className="text-gray-300 mt-1">Typical payback period with tax credits</div>
                  </div>
                  <div>
                    <div className="font-display text-4xl font-bold">4.1%</div>
                    <div className="text-gray-300 mt-1">Average home value increase with solar</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-text-muted uppercase tracking-[0.2em] text-sm font-semibold mb-4">How It Works</div>
              <h2 className="font-display text-5xl font-bold text-primary uppercase">Your Path to Energy Independence</h2>
            </div>
          </Reveal>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Free Consultation", desc: "We assess your property, energy usage, and goals. No pressure, just honest guidance." },
              { step: "02", title: "Custom Design", desc: "Our engineers design a system optimized for your roof, shading, and energy needs." },
              { step: "03", title: "Professional Install", desc: "Certified installers handle everything. Most residential installs complete in 1-2 days." },
              { step: "04", title: "Power On", desc: "Your system goes live. Start generating clean energy and watching your savings grow." }
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 150}>
                <div className="text-center">
                  <div className="font-display text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <h3 className="font-display text-xl font-bold text-primary uppercase mb-3">{item.title}</h3>
                  <p className="text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-text-muted uppercase tracking-[0.2em] text-sm font-semibold mb-4">Testimonials</div>
              <h2 className="font-display text-5xl font-bold text-primary uppercase">Montana Homeowners Love Solar</h2>
            </div>
          </Reveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Our electric bill went from $180/month to under $20. The battery backup gave us peace of mind during last winter's storms. Best investment we've made.", name: "Sarah & Tom H.", location: "Billings, MT" },
              { quote: "I was skeptical about solar in Montana, but the numbers don't lie. We're generating more power than we use most months and selling the excess back.", name: "Mike R.", location: "Missoula, MT" },
              { quote: "The team was professional, the install was fast, and the 30% tax credit made it very affordable. Our ranch is now powered by the Montana sun.", name: "Linda K.", location: "Bozeman, MT" }
            ].map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 100}>
                <div className="bg-light-bg rounded-none p-8 border border-gray-200">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-warm" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-text-dark mb-6 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <div className="font-bold text-primary">{testimonial.name}</div>
                    <div className="text-text-muted text-sm">{testimonial.location}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-light-bg">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-text-muted uppercase tracking-[0.2em] text-sm font-semibold mb-4">FAQ</div>
              <h2 className="font-display text-5xl font-bold text-primary uppercase">Common Questions</h2>
            </div>
          </Reveal>
          
          <div className="space-y-4">
            {[
              { q: "Does solar work in Montana winters?", a: "Yes. Montana gets over 300 days of sunshine. Solar panels actually perform better in cold temperatures. While shorter winter days produce less energy, battery storage and net metering credits from summer overproduction offset this." },
              { q: "How much does a residential solar system cost?", a: "Average residential systems range from $15,000-$30,000 before incentives. The 30% federal tax credit brings this down significantly. We offer $0-down financing options with monthly payments often lower than your current electric bill." },
              { q: "What happens during a power outage?", a: "With battery backup, your essential circuits stay powered automatically. Without batteries, grid-tied systems shut down for safety. We strongly recommend battery backup for Montana homes." },
              { q: "How long does installation take?", a: "Most residential installations take 1-2 days. The full process from consultation to power-on is typically 6-8 weeks, including permitting and utility approval." },
              { q: "What maintenance is required?", a: "Very little. Solar panels have no moving parts. We recommend annual inspections and occasional cleaning if debris accumulates. Your monitoring system alerts you to any issues." },
              { q: "Will solar increase my home value?", a: "Studies show solar systems increase home value by an average of 4.1%. In Montana's growing real estate market, solar is an increasingly attractive feature for buyers." }
            ].map((faq, index) => (
              <Reveal key={index} delay={index * 80}>
                <div className="bg-white rounded-none p-6 border border-gray-200">
                  <h3 className="font-display text-lg font-bold text-primary uppercase mb-3">{faq.q}</h3>
                  <p className="text-text-muted leading-relaxed">{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={500}>
            <div className="flex justify-center mt-12">
              <a href="#contact" className="bg-primary text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-primary/90 transition-all">
                Get Your Questions Answered
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <div className="text-gray-400 uppercase tracking-[0.2em] text-sm font-semibold mb-4">Ready for Energy Independence?</div>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white uppercase mb-6">
              Your Brighter Future Starts Here
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
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-dark text-center">
        <p className="text-gray-500 text-sm">
          © 2026 repower Montana. All rights reserved.
        </p>
      </footer>

      {/* Floating CTA */}
      <div className={`fixed bottom-6 right-6 z-40 transition-all duration-500 ${showFloating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}>
        <a href="#contact" className="bg-primary text-white px-6 py-4 rounded-none font-bold uppercase tracking-wider shadow-lg hover:bg-primary/90 transition-all">
          Book Now
        </a>
      </div>
    </>
  );
}