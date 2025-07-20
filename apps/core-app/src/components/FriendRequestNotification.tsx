import { PopupWindow } from './PopupWindow';


interface FriendRequestNotificationProps {
  count: number;
  onReview: () => void;
  offset?: number;
}

export const FriendRequestNotification = ({ 
  count, 
  onReview, 
  offset = 0 
}: FriendRequestNotificationProps) => {
  return (
    <div 
      className="popup-window mb-2 min-w-[260px]"
      style={{
        transform: `translate(${offset * 12}px, ${offset * 12}px)`,
        zIndex: 5 - offset
      }}
    >
      <div className="window-titlebar">
        <span>Friend Request Alert</span>
      </div>
      <div className="window-content">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="text-2xl">🚨</div>
            <div className="pixel-font">
              !!! {count} NEW FRIEND REQUESTS !!!
            </div>
          </div>
          <div className="pixel-font text-xs">
            People want to connect with you
          </div>
        </div>
        <div className="text-center">
          <button 
            onClick={onReview}
            className="px-4 py-1 pixel-font bg-gray-300 border-2 border-outset hover:bg-gray-200 transition-colors"
            style={{ border: '2px outset #e0e0e0' }}
          >
            Review Requests
          </button>
        </div>
      </div>
    </div>
  );
};