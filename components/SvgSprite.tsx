export default function SvgSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
      <defs>
        <symbol id="logo" viewBox="0 0 270 270">
          <polygon
            points="137,9 182,89 165,119 137,71 126,89 176,178 179,178 168,135 214,59 257,137 174,221 222,139 213,122 135,256 59,122 49,138 98,221 12,135 59,59 130,186 135,193 137,191 142,180 90,89"
            fill="currentColor"
          />
        </symbol>
        <symbol id="arr" viewBox="0 0 24 24">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
        <symbol id="aur" viewBox="0 0 24 24">
          <path
            d="M7 17 17 7M8 7h9v9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </symbol>
        <symbol id="star" viewBox="0 0 24 24">
          <path
            d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.9l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5z"
            fill="currentColor"
          />
        </symbol>
        <symbol id="globe" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9.25" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M12 2.75c2.6 2.3 4 5.8 4 9.25s-1.4 6.95-4 9.25c-2.6-2.3-4-5.8-4-9.25s1.4-6.95 4-9.25zM2.75 12h18.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </symbol>
        <symbol id="x" viewBox="0 0 24 24">
          <path d="M4 4l16 16M20 4 4 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </symbol>
        <symbol id="dot" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="3.2" fill="currentColor" />
        </symbol>
        <symbol id="menu" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </symbol>
        <symbol id="spotify" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.436-5.308-1.76-8.793-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.51 9.722 1.113.294.18.386.563.207.857zm1.225-2.724c-.226.367-.707.482-1.074.256-2.69-1.653-6.79-2.131-9.97-1.165-.413.125-.85-.107-.975-.521-.125-.414.108-.85.522-.975 3.633-1.103 8.147-.568 11.24 1.332.368.226.483.707.257 1.073zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-.99-.133-1.14-.627-.15-.494.133-.99.627-1.14 3.542-1.075 9.42-.87 13.14 1.34.444.263.588.84.324 1.284-.263.443-.84.588-1.332.324z"/>
        </symbol>
      </defs>
    </svg>
  );
}
