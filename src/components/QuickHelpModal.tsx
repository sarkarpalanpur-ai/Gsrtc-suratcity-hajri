import React from 'react';
import { X, Keyboard, HelpCircle, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

interface QuickHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickHelpModal: React.FC<QuickHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-900 rounded-lg">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                હાજરી પત્રક અને C-OFF નિયમો તથા કીબોર્ડ શોર્ટકટ્સ
              </h3>
              <p className="text-xs text-slate-500">
                એક્સેલ જેવી ઝડપી એન્ટ્રી અને સરકારી / GSRTC મસ્ટર નિયમો
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Rules Overview */}
        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
            <div className="font-bold text-blue-950 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              તમારા દ્વારા જણાવેલ મુખ્ય નિયમો (Your Specifications):
            </div>
            <ul className="list-disc pl-5 space-y-1 text-blue-900">
              <li>
                <b>ઓફના દિવસે નોકરી (OFF+P / OFF+PN):</b> મસ્ટરમાં ગોળ રાઉન્ડમાં (Circled) દર્શાવાય છે અને ૧ જમા ઓફ ખાતામાં ઉમેરાય છે.
              </li>
              <li>
                <b>ડબલ નોકરી (P+PN):</b> એક જ તારીખે દિવસ અને રાત્રિ બંને ફરજ કરેલ હોય ત્યારે 'P+PN' કોડ વપરાય છે.
              </li>
              <li>
                <b>વાર્ષિક ૧૨ CL:</b> દરેક કર્મચારીને વર્ષમાં ૧૨ પરચૂરણ રજા (Casual Leave) નો કોટા મળે છે. આ પત્રક આ માસની વપરાયેલ અને ૧૨ માંથી બાકી CL લાઈવ ટ્રેક કરે છે.
              </li>
              <li>
                <b>તહેવાર (H):</b> જાહેર રજાના દિવસે નોકરી ન કરી હોય તો પણ પગારના દિવસમાંથી ઓછો થતો નથી (Paid Holiday). જો તહેવારે નોકરી કરી હોય (H+P / H+PN), તો ૧ બદલી રજા પણ જમા મળે છે!
              </li>
              <li>
                <b>૧ પેજ જમા ઓફ ખાતાવહી:</b> ઉપરના 'જમા ઓફ અને હોલીડે ખાતાવહી' ટેબમાં દરેક કર્મચારીની ઓફ તારીખ સાથે જમા રજાનો પાસબુક રેકોર્ડ રાખવામાં આવે છે, જે પછી વાપરી શકાય છે.
              </li>
            </ul>
          </div>

          {/* Keyboard Shortcuts Grid */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-slate-600" />
              ઝડપી કીબોર્ડ શોર્ટકટ્સ (Instant Typing like Excel):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">P અથવા 1</div>
                  <div className="text-[11px] text-slate-500">હાજર દિવસ (Present)</div>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-900 font-bold rounded">P</span>
              </div>

              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">N</div>
                  <div className="text-[11px] text-slate-500">હાજર નાઇટ (Night)</div>
                </div>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-900 font-bold rounded">PN</span>
              </div>

              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">O</div>
                  <div className="text-[11px] text-slate-500">અઠવાડિક ઓફ (Off)</div>
                </div>
                <span className="px-2 py-1 bg-sky-100 text-sky-900 font-bold rounded">OFF</span>
              </div>

              <div className="p-2 border border-amber-300 rounded-lg bg-amber-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-950">W</div>
                  <div className="text-[11px] text-amber-800">ઓફમાં દિવસ ડ્યુટી</div>
                </div>
                <span className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 ring-2 ring-amber-600 font-extrabold flex items-center justify-center text-[10px]">
                  OFF+P
                </span>
              </div>

              <div className="p-2 border border-rose-300 rounded-lg bg-rose-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-rose-950">X</div>
                  <div className="text-[11px] text-rose-800">ઓફમાં નાઇટ ડ્યુટી</div>
                </div>
                <span className="w-7 h-7 rounded-full bg-rose-200 text-rose-900 ring-2 ring-rose-600 font-extrabold flex items-center justify-center text-[10px]">
                  OFF+PN
                </span>
              </div>

              <div className="p-2 border border-purple-300 rounded-lg bg-purple-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-purple-950">D અથવા 2</div>
                  <div className="text-[11px] text-purple-800">ડબલ નોકરી</div>
                </div>
                <span className="px-2 py-1 bg-purple-200 text-purple-900 font-bold rounded">P+PN</span>
              </div>

              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">H</div>
                  <div className="text-[11px] text-slate-500">જાહેર રજા (Holiday)</div>
                </div>
                <span className="px-2 py-1 bg-teal-100 text-teal-900 font-bold rounded">H</span>
              </div>

              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">C</div>
                  <div className="text-[11px] text-slate-500">પરચૂરણ રજા (CL)</div>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-900 font-bold rounded">CL</span>
              </div>

              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">V</div>
                  <div className="text-[11px] text-slate-500">જમા ઓફ વાપરી</div>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-900 font-bold rounded">C-OFF</span>
              </div>

              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">A અથવા 0</div>
                  <div className="text-[11px] text-slate-500">ગેરહાજર (Absent)</div>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-900 font-bold rounded">A</span>
              </div>

              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Backspace / Del</div>
                  <div className="text-[11px] text-slate-500">ખાલી કરો</div>
                </div>
                <span className="px-2 py-1 bg-slate-200 text-slate-700 font-mono rounded">Clear</span>
              </div>

              <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Arrow Keys</div>
                  <div className="text-[11px] text-slate-500">આગળ પાછળ ઉપર નીચે</div>
                </div>
                <span className="px-2 py-1 bg-slate-200 text-slate-700 font-mono rounded">←↑↓→</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg cursor-pointer"
          >
            સમજાઈ ગયું (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
