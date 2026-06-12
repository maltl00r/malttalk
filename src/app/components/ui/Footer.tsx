"use client";

import Image from "next/image";
import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-ba text-zinc-200 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Logo / Branding */}
        <div className="flex flex-col items-start sm:col-span-2 lg:col-span-1">
          <div className="flex items-center mb-3">
            <Image 
              src="/logo.ico" 
              alt="MaltTalk Logo" 
              width={120} 
              height={70} 
              className="object-contain"
            />
            <h2 className="font-sans text-3xl font-extrabold pl-5 text-foreground">Malt</h2>
            <h2 className="font-sans text-3xl font-extrabold bg-gradient-to-r from-primary-start to-secondary-start bg-clip-text text-transparent">
              Talk
            </h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed max-w-xs mt-2">
            Aprende idiomas. A tu manera. Sin límites.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
            Navegación
          </h3>
          <ul className="space-y-3 text-sm text-[var(--foreground)]/80">
            <li><a href="/" className="hover:text-[var(--color-primary-start)] transition-colors duration-200">Inicio</a></li>
            <li><a href="/cursos" className="hover:text-[var(--color-primary-start)] transition-colors duration-200">Cursos</a></li>
            <li><a href="/nosotros" className="hover:text-[var(--color-primary-start)] transition-colors duration-200">Nosotros</a></li>
            <li><a href="/contacto" className="hover:text-[var(--color-primary-start)] transition-colors duration-200">Contacto</a></li>
          </ul>
        </div>

        {/* Recursos */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
            Recursos
          </h3>
          <ul className="space-y-3 text-sm text-[var(--foreground)]/80">
            <li><a href="/faq" className="hover:text-[var(--color-primary-start)] transition-colors duration-200">FAQ</a></li>
            <li><a href="/soporte" className="hover:text-[var(--color-primary-start)] transition-colors duration-200">Soporte</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">
            Legal
          </h3>
          <ul className="space-y-3 text-sm text-[var(--foreground)]/80">
            <li><a href="/terminos" className="hover:text-[var(--color-primary-start)] transition-colors duration-200">Términos de Servicio</a></li>
            <li><a href="/privacidad" className="hover:text-[var(--color-primary-start)] transition-colors duration-200">Política de Privacidad</a></li>
            <li><a href="/cookies" className="hover:text-[var(--color-primary-start)] transition-colors duration-200">Política de Cookies</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-800">
        
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--foreground)]/90 text-center md:text-left">
            © {new Date().getFullYear()} MaltTalk · Todos los derechos reservados
          </p>
          
          {/* Redes sociales */}
          <div className="flex space-x-5">
            <a href="https://twitter.com" aria-label="Twitter" className="text-zinc-400 hover:text-[var(--color-secondary-start)] transition-colors duration-200">
              <FaTwitter size={18} />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="text-zinc-400 hover:text-[var(--color-secondary-start)] transition-colors duration-200">
              <FaFacebookF size={18} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="text-zinc-400 hover:text-[var(--color-secondary-start)] transition-colors duration-200">
              <FaInstagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}