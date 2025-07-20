interface DesktopIconProps {
  iconSrc: string;
  label: string;
  onClick?: () => void;
}

export const DesktopIcon = ({ iconSrc, label, onClick }: DesktopIconProps) => {
  return (
    <div className="desktop-icon cursor-pointer transition-all duration-300 hover:scale-105" onClick={onClick}>
      <div className="flex justify-center mb-1">
        <img 
          src={iconSrc} 
          alt={label} 
          className="w-20 h-20 pixelated transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          style={{ 
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 0 0 transparent)',
            mixBlendMode: 'multiply'
          }}
        />
      </div>
      <span className="desktop-label text-xs max-w-16 leading-tight text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.8)' }}>
        {label}
      </span>
    </div>
  );
};