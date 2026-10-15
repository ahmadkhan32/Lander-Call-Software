'use client';

export default function SaaSSaleIllustration({ className = '' }) {
  return (
    <div className={`relative w-full max-w-md mx-auto aspect-[4/3] flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 500 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Soft Background Clouds & Hills */}
        <path
          d="M30 350C70 310 130 315 180 340C240 370 320 330 380 345C430 358 460 370 480 380H20C20 370 24 358 30 350Z"
          fill="#EEF2FF"
        />
        <path
          d="M0 380C60 330 150 335 210 360C280 388 380 350 450 365C480 372 495 378 500 380H0Z"
          fill="#E0E7FF"
          opacity="0.6"
        />

        {/* Decorative foliage in background */}
        <g opacity="0.85">
          {/* Left blue leaves */}
          <path
            d="M110 240C90 220 85 185 105 160C125 185 130 215 110 240Z"
            fill="#3B82F6"
          />
          <path
            d="M90 230C75 210 70 180 90 155C108 180 110 205 90 230Z"
            fill="#60A5FA"
          />
          <path
            d="M135 220C120 195 125 165 145 145C160 170 155 200 135 220Z"
            fill="#2563EB"
          />
          {/* Right blue leaves */}
          <path
            d="M400 240C420 220 425 185 405 160C385 185 380 215 400 240Z"
            fill="#3B82F6"
          />
          <path
            d="M420 230C435 210 440 180 420 155C402 180 400 205 420 230Z"
            fill="#60A5FA"
          />
        </g>

        {/* Thin blue frame backdrop */}
        <rect
          x="145"
          y="155"
          width="180"
          height="125"
          rx="4"
          stroke="#3B82F6"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.5"
        />
        <circle cx="145" cy="155" r="3" fill="#3B82F6" />
        <circle cx="325" cy="155" r="3" fill="#3B82F6" />
        <circle cx="235" cy="155" r="3" fill="#3B82F6" />

        {/* Big Desktop Monitor */}
        {/* Monitor Stand */}
        <path d="M170 295H195V280H170V295Z" fill="#1E293B" />
        <path d="M150 295H215C217.2 295 219 296.8 219 299V301H146V299C146 296.8 147.8 295 150 295Z" fill="#0F172A" />

        {/* Monitor Outer Frame */}
        <rect
          x="110"
          y="160"
          width="145"
          height="120"
          rx="7"
          fill="#0F172A"
          stroke="#1E293B"
          strokeWidth="2"
        />
        {/* Monitor Screen Glass */}
        <rect
          x="114"
          y="164"
          width="137"
          height="106"
          rx="4"
          fill="#FFFFFF"
        />

        {/* Screen Header Dots */}
        <circle cx="122" cy="170" r="1.5" fill="#EF4444" />
        <circle cx="127" cy="170" r="1.5" fill="#F59E0B" />
        <circle cx="132" cy="170" r="1.5" fill="#10B981" />

        {/* Screen Content: Donut/Pie Chart */}
        <circle cx="138" cy="190" r="14" fill="#F1F5F9" />
        <path
          d="M138 176A14 14 0 0 1 152 190H138Z"
          fill="#DBEAFE"
        />

        {/* Screen Content: Connected Node Track */}
        <path
          d="M170 190C185 190 188 178 200 182C210 185 215 174 225 176"
          stroke="#60A5FA"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        {/* Pin nodes */}
        <circle cx="170" cy="190" r="4" fill="#FBBF24" />
        <circle cx="170" cy="190" r="2" fill="#FFFFFF" />
        <circle cx="200" cy="182" r="4" fill="#10B981" />
        <circle cx="200" cy="182" r="2" fill="#FFFFFF" />

        {/* Screen Content: Horizontal Bars */}
        <rect x="122" y="215" width="55" height="4" rx="2" fill="#E2E8F0" />
        <rect x="122" y="222" width="70" height="4" rx="2" fill="#E2E8F0" />
        <rect x="122" y="229" width="40" height="4" rx="2" fill="#E2E8F0" />

        {/* Screen Content: Mini Metric Card */}
        <rect x="180" y="212" width="60" height="30" rx="3" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        <path d="M185 233L195 225L205 230L215 222L225 227L235 220" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />

        {/* Smartphone Device (Right of Monitor) */}
        <rect
          x="240"
          y="172"
          width="62"
          height="116"
          rx="9"
          fill="#0F172A"
          stroke="#334155"
          strokeWidth="2"
        />
        <rect
          x="243"
          y="176"
          width="56"
          height="108"
          rx="6"
          fill="#FFFFFF"
        />
        {/* Phone speaker pill */}
        <rect x="264" y="179" width="14" height="2" rx="1" fill="#94A3B8" />

        {/* Phone App Grid */}
        <rect x="249" y="186" width="10" height="10" rx="2" fill="#F1F5F9" />
        <rect x="265" y="186" width="10" height="10" rx="2" fill="#F1F5F9" />
        <rect x="281" y="186" width="10" height="10" rx="2" fill="#F1F5F9" />

        <rect x="249" y="200" width="10" height="10" rx="2" fill="#F1F5F9" />
        <rect x="265" y="200" width="10" height="10" rx="2" fill="#F1F5F9" />
        <rect x="281" y="200" width="10" height="10" rx="2" fill="#F1F5F9" />

        {/* Phone Shield Security Badge */}
        <g transform="translate(254, 230)">
          <path
            d="M17 0L33 6V16C33 26 26 34 17 38C8 34 1 26 1 16V6L17 0Z"
            fill="#2563EB"
          />
          <path
            d="M17 3L30 8V16C30 24.5 24 31.5 17 35C10 31.5 4 24.5 4 16V8L17 3Z"
            fill="#3B82F6"
          />
          {/* Gold checkmark */}
          <path
            d="M11 17L15 21L23 13"
            stroke="#FBBF24"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Human Character */}
        {/* Head & Hair */}
        <circle cx="233" cy="188" r="8" fill="#1E293B" />
        <circle cx="234" cy="190" r="6" fill="#FCD34D" />
        {/* Hair shape */}
        <path d="M227 186C227 181 232 181 236 182C240 183 241 187 240 190C238 187 234 186 227 186Z" fill="#0F172A" />

        {/* Torso: Yellow Sweater */}
        <path
          d="M224 198C222 205 220 226 220 236H246C246 226 244 205 242 198C238 196 228 196 224 198Z"
          fill="#F59E0B"
        />
        {/* Arm typing on laptop */}
        <path
          d="M228 202L213 216L218 222L230 208Z"
          fill="#D97706"
        />
        {/* Hand */}
        <circle cx="212" cy="217" r="3" fill="#FCD34D" />

        {/* Small Laptop in Hand */}
        <path d="M204 218L216 218L218 224L202 224Z" fill="#94A3B8" />
        <path d="M205 210L205 218L212 218L212 210Z" fill="#CBD5E1" />

        {/* Pants: Dark Charcoal */}
        <path
          d="M223 236L219 295H226L232 248L239 295H246L243 236H223Z"
          fill="#334155"
        />

        {/* Shoes */}
        <ellipse cx="218" cy="296" rx="5" ry="2" fill="#0F172A" />
        <ellipse cx="247" cy="296" rx="5" ry="2" fill="#0F172A" />

        {/* Floating Sparkles, Circles & Plus Signs */}
        {/* Gold & Blue Stars */}
        <g fill="#F59E0B">
          <circle cx="85" cy="275" r="2.5" />
          <path d="M96 280H102M99 277V283" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M152 145H158M155 142V148" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="160" cy="153" r="2" />
        </g>

        <g fill="#38BDF8">
          <circle cx="103" cy="287" r="2.5" />
          <path d="M107 289H113M110 286V292" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="340" cy="160" r="2" />
          <path d="M346 150H352M349 147V153" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="360" cy="328" r="3" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="370" cy="336" r="2.5" fill="#38BDF8" />
          <path d="M374 322H380M377 319V325" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
