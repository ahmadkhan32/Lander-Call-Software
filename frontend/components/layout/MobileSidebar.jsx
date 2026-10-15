'use client';

import clsx from 'clsx';
import Sidebar from './Sidebar.jsx';

export default function MobileSidebar({ isOpen, onClose, user }) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Slide-out Panel */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar mobileMenuOpen={true} onClose={onClose} user={user} isMobileOnly={true} />
      </div>
    </>
  );
}
