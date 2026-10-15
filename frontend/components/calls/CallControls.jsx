'use client';

import clsx from 'clsx';
import { Mic, MicOff, Pause, Play, PhoneOff, Volume2 } from 'lucide-react';

export default function CallControls({
  isMuted,
  isHeld,
  onToggleMute,
  onToggleHold,
  onHangup,
}) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2">
      {/* Mute Button */}
      <button
        type="button"
        onClick={onToggleMute}
        className={clsx(
          'p-3.5 sm:p-4 rounded-2xl border transition-all active:scale-95 shadow-sm',
          isMuted
            ? 'bg-red-50 border-red-300 text-red-600'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        )}
        title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
      >
        {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>

      {/* Hangup Button */}
      <button
        type="button"
        onClick={onHangup}
        className="p-4 sm:p-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
        title="End Call"
      >
        <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* Hold Button */}
      <button
        type="button"
        onClick={onToggleHold}
        className={clsx(
          'p-3.5 sm:p-4 rounded-2xl border transition-all active:scale-95 shadow-sm',
          isHeld
            ? 'bg-amber-50 border-amber-300 text-amber-600'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        )}
        title={isHeld ? 'Resume call' : 'Hold call'}
      >
        {isHeld ? <Play className="w-5 h-5 sm:w-6 sm:h-6" /> : <Pause className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>
    </div>
  );
}
