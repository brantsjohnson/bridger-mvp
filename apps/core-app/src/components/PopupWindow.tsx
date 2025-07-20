interface PopupWindowProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const PopupWindow = ({ children, style, className = "" }: PopupWindowProps) => {
  return (
    <div 
      className={`popup-window ${className}`} 
      style={style}
    >
      {children}
    </div>
  );
};