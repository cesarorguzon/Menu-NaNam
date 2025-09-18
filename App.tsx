import React, { useMemo, useEffect, useState } from "react";
import { Phone, MessageCircle, MapPin, Facebook, Instagram } from "lucide-react";

/**
 * Menú Web Móvil — La Hora de NaNam
 * - Mobile-first, sin llamadas externas
 * - Header sticky con logo + CTA Llamar
 * - Chips por categorías
 * - CTA inferiores: Llamar / WhatsApp / Cómo llegar + redes
 */

const FONT_STACK =
  "ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,Liberation Sans,sans-serif";

// Logo inline temporal (SVG). Si quieres tu PNG, te lo incrusto en base64.
const LOGO_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>
  <circle cx='40' cy='40' r='39' fill='white'/>
  <circle cx='40' cy='40' r='37' fill='#111'/>
  <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-size='18' font-family='sans-serif' fill='#f2c200' font-weight='700'>Na Nam</text>
</svg>`;
const LOGO_SRC = "data:image/svg+xml;utf8," + encodeURIComponent(LOGO_SVG);

interface MenuItem { name: string; price: number; rec?: boolean }
interface MenuSection { key: string; title: string; items: MenuItem[]; note?: string }

const PHONE_E164 = "+524831308089";
const HOURS = "8 am – 6 pm";
const MAPS_Q = encodeURIComponent("La Hora de NaNam Tamazunchale SLP");
const MAPS_URL = `https://maps.google.com/?q=${MAPS_Q}`;
const WA_URL = `https://wa.me/${PHONE_E164.replace("+", "")}?text=${encodeURIComponent(
  "Hola La Hora de NaNam, quiero consultar el menú y hacer un pedido."
)}`;
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61566413494101";
const INSTAGRAM_URL = "https://www.instagram.com/lahoradenanam?igsh=N3NqbnM3djQ0YTdp";

// ====== Data ======
const SECTIONS: MenuSection[] = [
  {
    key: "almuerzos",
    title: "Almuerzos",
    note:
      "Enchiladas huastecas, entomatadas y enfrijoladas son de Refill y se pueden acompañar con milanesa de pollo, cecina o huevos. Los almuerzos se pueden acompañar con milanesa de pollo, cecina o huevos a elegir, excepto los sencillos.",
    items: [
      { name: "Enchiladas Huastecas", price: 120, rec: true },
      { name: "Entomatadas", price: 120 },
      { name: "Enfrijoladas", price: 120 },
      { name: "Quesadillas", price: 120 },
      { name: "Chilaquiles", price: 120, rec: true },
      { name: "Estrujadas", price: 120 },
      { name: "Flautas sencillas", price: 80 },
      { name: "Flautas", price: 120 },
    ],
  },
  {
    key: "comidas",
    title: "Comidas",
    note: " La comida del día incluyen sopa de entrada, tortillas, salsas y agua fresca",
    items: [
      { name: "Milanesa de pollo empanizada", price: 120, rec: true },
      { name: "Milanesa de pollo a la plancha", price: 120 },
      { name: "Milanesa de pollo rellena con jamón y queso manchego", price: 140 },
      { name: "Milanesa de res empanizada", price: 120 },
      { name: "Bistec de res entomatado", price: 120 },
      { name: "Bistec de res a la Mexicana", price: 120 },
      { name: "Comida del día", price: 100 },
    ],
  },
  {
    key: "mariscos",
    title: "Mariscos",
    note:
      "Incluyen sopa de entrada, arroz, ensalada de lechuga, papas y enchiladas al centro de mesa; a excepción del coctel de camarón.",
    items: [
      { name: "Filete de pescado empanizado", price: 190 },
      { name: "Camarones empanizados", price: 220 },
      { name: "Camarones envueltos", price: 240, rec: true },
      { name: "Coctel de camarón", price: 190 },
      { name: "Aguachile de camarón", price: 190 },
    ],
  },
  {
    key: "desayunos",
    title: "Desayunos",
    items: [
      { name: "Huevos revueltos o estrellados", price: 75 },
      { name: "Huevos al gusto", price: 90 },
      { name: "Hotcakes sencillos", price: 80 },
      { name: "Hotcakes con huevos y tocino", price: 120 },
    ],
  },
  {
    key: "a_la_carta",
    title: "A la Carta",
    items: [
      { name: "Enchiladas suizas sencillas", price: 120 },
      { name: "Enchiladas suizas", price: 160 },
      { name: "Hamburguesa de pollo con papas", price: 120 },
    ],
  },
  {
    key: "infantil",
    title: "Menú infantil",
    note: "Se pueden acompañar con milanesa de pollo o huevos. Incluyen papas y frijoles al centro.",
    items: [
      { name: "Entomatadas", price: 90 },
      { name: "Enfrijoladas", price: 90 },
      { name: "Quesadillas", price: 90 },
    ],
  },
  {
    key: "bebidas",
    title: "Bebidas",
    note: "Café y aguas frescas mantienen mismo precio hasta segundo refill.",
    items: [
      { name: "Vaso de agua fresca", price: 20, rec: true },
      { name: "Jarra de agua fresca", price: 60 },
      { name: "Café", price: 30, rec: true },
      { name: "Frappes", price: 60 },
      { name: "Chocomil", price: 60 },
      { name: "Refrescos", price: 30 },
    ],
  },
  {
    key: "postres",
    title: "Postres",
    items: [
      { name: "Pay de queso", price: 60 },
      { name: "Flan napolitano", price: 60 },
      { name: "Brownie de chocolate", price: 60, rec: true },
      { name: "Panqué de mantequilla", price: 60 },
      { name: "Pan japonés", price: 60 },
      { name: "Galletas estilo NY", price: 25 },
    ],
  },
];

function currency(n: number) { return `$${n}`; }

function StickyHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b" style={{ fontFamily: FONT_STACK }}>
      <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center gap-3">
        <img src={LOGO_SRC} alt="La Hora de NaNam" className="w-9 h-9 rounded-full border" />
        <div className="grow">
          <div className="text-base font-bold leading-none">La Hora de NaNam</div>
          <div className="text-[11px] text-neutral-600">Cocina huasteca • Hoy {HOURS}</div>
        </div>
        <a href={`tel:${PHONE_E164}`} className="px-3 py-2 text-sm rounded-full border font-semibold">
          <span className="inline-flex items-center gap-1"><Phone className="w-4 h-4" /> Llamar</span>
        </a>
      </div>
    </header>
  );
}

function CategoryChips({ sections, onJump, activeKey }:{ sections: MenuSection[]; onJump:(key:string)=>void; activeKey?:string }) {
  return (
    <div className="sticky top-[56px] z-30 bg-white/90 backdrop-blur border-b">
      <div className="max-w-screen-sm mx-auto px-2 py-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => onJump(s.key)}
              className={`px-3 py-1 rounded-full text-sm border ${activeKey===s.key ? "bg-black text-white border-black" : "bg-white"}`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ section }:{ section: MenuSection }) {
  return (
    <section id={section.key} className="max-w-screen-sm mx-auto px-4 py-4 scroll-mt-28" style={{ fontFamily: FONT_STACK }}>
      <div className="border-t-4 border-b-2 py-2 mb-2">
        <h2 className="tracking-widest font-extrabold text-sm">{section.title.toUpperCase()}</h2>
      </div>
      {section.note && <p className="text-xs text-neutral-600 mb-2">{section.note}</p>}
      <ul className="divide-y">
        {section.items.map((it, idx) => (
          <li key={`${it.name}-${idx}`} className="py-2 flex items-baseline justify-between gap-3">
            <div className="font-medium">
              {it.rec ? <span aria-label="recomendado" role="img" className="mr-1">★</span> : null}
              {it.name}
            </div>
            <div className="font-semibold">{currency(it.price)}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FooterCTA() {
  return (
    <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur border-t">
      <div className="max-w-screen-sm mx-auto px-3 py-2 flex justify-center gap-4">
        <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" aria-label="Facebook" className="p-2 rounded-full border">
          <Facebook className="w-5 h-5" />
        </a>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram" className="p-2 rounded-full border">
          <Instagram className="w-5 h-5" />
        </a>
      </div>
      <div className="max-w-screen-sm mx-auto px-3 pb-2 grid grid-cols-3 gap-2">
        <a href={`tel:${PHONE_E164}`} className="text-center rounded-lg border px-3 py-2 text-sm font-semibold inline-flex items-center justify-center gap-1"><Phone className="w-4 h-4" /> Llamar</a>
        <a href={WA_URL} target="_blank" rel="noreferrer" className="text-center rounded-lg border px-3 py-2 text-sm font-semibold inline-flex items-center justify-center gap-1"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
        <a href={MAPS_URL} target="_blank" rel="noreferrer" className="text-center rounded-lg border px-3 py-2 text-sm font-semibold inline-flex items-center justify-center gap-1"><MapPin className="w-4 h-4" /> Cómo llegar</a>
      </div>
    </div>
  );
}

function DevSelfTests() {
  useEffect(() => {
    const alm = SECTIONS.find(s=>s.key==='almuerzos')!;
    console.assert(alm.items.find(i=>i.name.includes('Huastecas'))?.price===120, 'Enchiladas Huastecas $120');
    const mar = SECTIONS.find(s=>s.key==='mariscos')!;
    console.assert(mar.items.find(i=>i.name==='Camarones envueltos')?.price===240, 'Camarones envueltos $240');
    const bev = SECTIONS.find(s=>s.key==='bebidas')!;
    console.assert(bev.items.find(i=>i.name==='Vaso de agua fresca')?.price===20, 'Vaso de agua $20');
    const pos = SECTIONS.find(s=>s.key==='postres')!;
    console.assert(pos.items.find(i=>i.name.includes('Galletas'))?.price===25, 'Galletas NY $25');
    const inf = SECTIONS.find(s=>s.key==='infantil')!;
    console.assert(inf.items.length===3, 'Infantil debe tener 3 opciones');
    console.assert(inf.items.every(i=>i.price===90), 'Infantil $90 c/u');
  }, []);
  return null;
}

export default function App() {
  const filtered = SECTIONS;
  const ids = useMemo(() => filtered.map(s => s.key), [filtered]);
  const [activeKey, setActiveKey] = useState<string>(ids[0] || "");

  useEffect(() => { setActiveKey(ids[0] || ""); }, [ids.join(",")]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible?.target && (visible.target as HTMLElement).id) {
        setActiveKey((visible.target as HTMLElement).id);
      }
    }, { rootMargin: "-120px 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] });

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids.join(",")]);

  const jump = (key: string) => {
    document.getElementById(key)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: FONT_STACK }}>
      <DevSelfTests />
      <StickyHeader />
      <CategoryChips sections={filtered} onJump={jump} activeKey={activeKey} />

      <main>
        {filtered.map(sec => (
          <SectionCard key={sec.key} section={sec} />
        ))}
      </main>

      <div className="h-14" />
      <FooterCTA />
    </div>
  );
}
