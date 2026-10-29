# GSRTC સ્ટાફ હાજરી પત્રક અને જમા ઓફ રજીસ્ટર (Hajari Patrak)

પ્રોપર હાજરી પત્રક (GSRTC Mechanic / Staff Attendance Muster & Compensatory Off Ledger) - ૭-દિવસ ઓફ ઓટો કેલ્ક્યુલેશન, OFF+P / OFF+PN રાઉન્ડ માર્કિંગ, ૧૨ CL ટ્રેકર અને જમા ઓફ ખાતાવહી.

---

## 🚀 GitHub Pages પર ઓનલાઇન કેવી રીતે કરવું? (How to Deploy on GitHub)

### કોરું પેજ (Blank Page) કેમ દેખાતું હતું?
1. **કારણ ૧ (Missing Build):** આ પ્રોજેક્ટ **React + TypeScript (Vite)** માં બનેલો છે. બ્રાઉઝર સીધી `.tsx` ફાઇલો ચલાવી શકતું નથી. પ્રોજેક્ટને `npm run build` કરીને `dist` ફોલ્ડરમાં તૈયાર કરવું પડે છે.
2. **કારણ ૨ (Base Path):** GitHub Pages પર પાથ `username.github.io/repo-name/` હોય છે. `base: './'` ન હોવાથી ફાઇલો 404 થતી હતી, જે હવે અમે `vite.config.ts` માં સુધારી દીધું છે.

---

### સરળ રીત ૧: GitHub Actions દ્વારા (સૌથી સરળ - ફક્ત ૧ ક્લિક)

અમે પ્રોજેક્ટમાં `.github/workflows/deploy.yml` ફાઇલ ઉમેરી દીધી છે. હવે GitHub પર માત્ર આ સેટિંગ કરો:

1. તમારા GitHub રીપોઝીટરી (Repository) માં જાઓ.
2. ઉપર **Settings** (સેટિંગ્સ) ટેબ પર ક્લિક કરો.
3. ડાબી બાજુના મેનુમાંથી **Pages** (પેજીસ) પર ક્લિક કરો.
4. **"Build and deployment"** સેક્શનમાં:
   - **Source:** ડ્રોપડાઉનમાંથી **`GitHub Actions`** પસંદ કરો (ડિફોલ્ટ `Deploy from a branch` હોય તેને બદલીને `GitHub Actions` કરો).
5. બસ! હવે **Actions** ટેબમાં જશો તો આપમેળે બિલ્ડ થઈને તમારી વેબસાઇટ લાઈવ થઈ જશે (દા.ત. `https://sarkarpalanpur.github.io/repo-name/`).

---

### સરળ રીત ૨: કમ્પ્યુટરથી સીધું ડિપ્લોય (via Terminal)

જો તમે તમારા કમ્પ્યુટર પરથી કોડ ચલાવો છો:

```bash
# ૧. ડિપેન્ડન્સી ઇન્સ્ટોલ કરો
npm install

# ૨. એક જ કમાન્ડથી GitHub પર લાઈવ કરો
npm run deploy
```

આ કમાન્ડ આપમેળે પ્રોજેક્ટ બિલ્ડ કરીને `gh-pages` બ્રાન્ચ બનાવી GitHub પર ઓનલાઇન મૂકી દેશે!

---

## 🛠️ સ્થાનિક રીતે ચલાવવા માટે (Local Development)

```bash
# ડેવલપમેન્ટ સર્વર શરૂ કરો
npm run dev

# પ્રોડક્શન બિલ્ડ બનાવો
npm run build
```
