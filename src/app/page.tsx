"use client";

import { useState } from "react";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import { Reveal } from "@/components/Reveal";

export default function LandingPage() {
  const { submit: submitLead, isSubmitting } = useMegaLeadForm();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    propertyType: "",
    electricBill: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await submitLead({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        needsType: formData.propertyType,
        message: `Electric Bill: ${formData.electricBill}. ${formData.message}`.trim()
      });
      alert("Thank you! We'll be in touch soon to schedule your consultation.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        propertyType: "",
        electricBill: "",
        message: ""
      });
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  const LeadForm = () => (
    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border">
      <h3 className="font-display text-2xl font-bold mb-4 text-primary">Book Your Consultation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          required
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <select
        name="propertyType"
        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none mb-4"
        value={formData.propertyType}
        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
      >
        <option value="">Property Type</option>
        <option value="residential">Residential Home</option>
        <option value="commercial">Commercial Business</option>
        <option value="agricultural">Farm/Agricultural</option>
      </select>

      <select
        name="electricBill"
        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none mb-4"
        value={formData.electricBill}
        onChange={(e) => setFormData({ ...formData, electricBill: e.target.value })}
      >
        <option value="">Monthly Electric Bill Range</option>
        <option value="under-100">Under $100</option>
        <option value="100-200">$100 - $200</option>
        <option value="200-300">$200 - $300</option>
        <option value="300-500">$300 - $500</option>
        <option value="over-500">Over $500</option>
      </select>

      <textarea
        name="message"
        placeholder="Tell us about your energy goals (optional)"
        rows={3}
        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-primary outline-none mb-4"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white font-semibold py-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Booking..." : "Schedule My Consultation"}
      </button>
    </form>
  );

  return (
    <>
      <QueryParamPersistence />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-display text-2xl font-bold text-primary">
            repower Montana
          </div>
          <a
            href="#contact"
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90"
          >
            Book Now
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal>
              <h1 className="font-display text-6xl md:text-7xl font-bold text-gray-900 mb-6">
                SOLAR + BATTERY FOR MONTANA
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Achieve energy independence with residential and commercial solar installation plus battery backup. Power your Montana home or business with clean, reliable energy that works year-round.
              </p>
            </Reveal>
            <Reveal delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="#contact"
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg text-center hover:bg-primary/90"
                >
                  Schedule Consultation
                </a>
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal delay={600}>
              <LeadForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-2">25+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-2">1,000+</div>
                <div className="text-gray-600">Homes Powered</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-2">99%</div>
                <div className="text-gray-600">Uptime Guarantee</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-primary mb-2">$0</div>
                <div className="text-gray-600">Down Payment</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal>
            <h2 className="font-display text-5xl font-bold text-center mb-4">
              WHY MONTANA CHOOSES SOLAR + BATTERY
            </h2>
            <p className="text-xl text-center text-gray-600 mb-16">
              Perfect for Montana's climate and energy needs
            </p>
          </Reveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "Energy Independence", 
                desc: "Reduce reliance on the grid with your own clean power generation and storage" 
              },
              { 
                title: "Winter Reliability", 
                desc: "Battery backup ensures power during Montana's harsh winter storms" 
              },
              { 
                title: "Lower Bills", 
                desc: "Slash your electric bills with abundant Montana sunshine" 
              },
              { 
                title: "Increase Home Value", 
                desc: "Solar systems boost property values and attract eco-conscious buyers" 
              },
              { 
                title: "Federal Tax Credits", 
                desc: "Take advantage of 30% federal tax credit for solar installations" 
              },
              { 
                title: "Net Metering", 
                desc: "Sell excess power back to the grid for additional savings" 
              }
            ].map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 100}>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="font-display text-2xl font-bold text-primary mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{benefit.desc}</p>
                  <a
                    href="#contact"
                    className="text-primary font-semibold hover:underline"
                  >
                    Learn More →
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <h2 className="font-display text-5xl font-bold mb-6">
                POWERING MONTANA'S FUTURE
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Welcome to repower, your trusted local resource for solar power education in Montana. We believe in empowering our community with knowledge about the incredible benefits of solar energy.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Our goal is to illuminate how solar can provide sustainable, efficient, and reliable energy for both residential and commercial needs in Montana's unique climate.
              </p>
              <a
                href="#contact"
                className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary/90"
              >
                Start Your Journey
              </a>
            </Reveal>
            <Reveal delay={300}>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8">
                <h3 className="font-display text-3xl font-bold text-primary mb-6">
                  MONTANA SOLAR ADVANTAGES
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-secondary mr-3">✓</span>
                    300+ days of sunshine annually
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-3">✓</span>
                    Cool temperatures boost panel efficiency
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-3">✓</span>
                    Strong net metering policies
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-3">✓</span>
                    Low humidity reduces maintenance
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="font-display text-5xl font-bold mb-6">
              READY FOR ENERGY INDEPENDENCE?
            </h2>
            <p className="text-xl mb-12 opacity-90">
              Schedule your free consultation today and discover how solar + battery can transform your energy future in Montana.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="max-w-2xl mx-auto">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white text-center">
        <p className="text-sm opacity-75">
          © 2026 repower Montana. All rights reserved.
        </p>
      </footer>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="#contact"
          className="bg-secondary text-white px-6 py-4 rounded-full font-semibold shadow-lg hover:bg-secondary/90 transition-colors"
        >
          Book Now
        </a>
      </div>
    </>
  );
}