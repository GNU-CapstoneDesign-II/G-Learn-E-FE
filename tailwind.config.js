import React from "react";
import level0to10 from "../../assets/Level_Icon/level_0to10.png";
import level10to20 from "../../assets/Level_Icon/level_10to20.png";
import level20to30 from "../../assets/Level_Icon/level_20to30.png";
import level30to40 from "../../assets/Level_Icon/level_30to40.png";
import level40to50 from "../../assets/Level_Icon/level_40to50.png";

const getIconSrc = (level) => {
  if (level < 10) return level0to10;
  if (level < 20) return level10to20;
  if (level < 30) return level20to30;
  if (level < 40) return level30to40;
  return level40to50;
};

export default function LevelIcon({
  level,
  size = 64,
  fontRatio = 0.35,
  className = "",
}) {
  const src = getIconSrc(level);
  const fontSize = size * fontRatio;

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={`Level ${level}`}
        className="w-full h-full object-contain"
      />
      <span
        className={`
          absolute inset-0 flex items-center justify-center 
          text-brown5
          [text-shadow:0_0_2px_theme(colors.black/50%)]
        `}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: 1,
          fontWeight: 700,
        }}
      >
        {level}
      </span>
    </div>
  );
}