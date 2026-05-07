import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Services } from '../components/Services';
import { Clients } from '../components/Clients';
import { Testimonials } from '../components/Testimonials';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <div className="flex flex-col bg-white">
      <Hero />
      <About />
      <Services />
      <Clients />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
