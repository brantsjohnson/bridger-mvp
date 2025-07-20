import React, { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';

interface BridgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenFriends: () => void;
}

const BridgerMenu = ({ isOpen, onClose, onOpenProfile, onOpenFriends }: BridgerMenuProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset confirmation dialog when menu opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowLogoutConfirm(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogOut = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogOut = () => {
    console.log('Logging out...');
    // Add actual logout logic here
    setShowLogoutConfirm(false);
    onClose();
  };

  const cancelLogOut = () => {
    setShowLogoutConfirm(false);
  };

  const menuItems: any[] = [];

  return (
    <>
      <div 
        ref={menuRef}
        className="popup-window absolute top-12 left-8 z-50"
        style={{
          width: '240px',
          fontFamily: 'MS Sans Serif, sans-serif'
        }}
      >
        {/* Menu Header */}
        <div className="window-titlebar">
          <span>Bridger Menu</span>
        </div>

        <div className="window-content">

          {/* Log Out */}
          <div className="py-1">
            <div
              className="flex items-center space-x-3 px-3 py-2 hover:bg-red-100 cursor-pointer transition-colors text-sm"
              onClick={handleLogOut}
            >
              <LogOut className="w-4 h-4 text-black" />
              <span className="pixel-font text-black">Log Out</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70]">
          <div 
            className="popup-window"
            style={{ 
              width: '300px',
              fontFamily: 'MS Sans Serif, sans-serif'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title Bar */}
            <div className="window-titlebar">
              <span>Confirm</span>
            </div>

            {/* Dialog Content */}
            <div className="window-content">
              <div className="flex items-center mb-4">
                <div className="mr-3 text-2xl">⚠️</div>
                <div className="text-sm pixel-font text-black">
                  Are you sure you want to log out?
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={confirmLogOut}
                  className="px-4 py-2 text-sm pixel-font bg-gray-200 border border-gray-400 hover:bg-gray-300"
                  style={{ border: '2px outset #e0e0e0' }}
                >
                  Yes
                </button>
                <button
                  onClick={cancelLogOut}
                  className="px-4 py-2 text-sm pixel-font bg-gray-200 border border-gray-400 hover:bg-gray-300"
                  style={{ border: '2px outset #e0e0e0' }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BridgerMenu;