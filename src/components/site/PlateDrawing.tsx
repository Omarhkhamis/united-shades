/** Technical "drawing" over the hero photo — drawn stroke by stroke by the intro animation. */
export function PlateDrawing() {
  return (
    <svg className="plate__draw" viewBox="0 0 1000 1309" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {/* membrane */}
      <path className="d-main" d="M0,641 C200,560 470,430 643,367"/>
      <path className="d-main" d="M643,367 C720,430 860,540 1000,602"/>
      <path className="d-main" d="M0,641 C210,720 470,770 634,742 C780,720 900,660 1000,602"/>
      {/* ribs */}
      <path className="d-thin" d="M634,742 L643,367"/>
      <path className="d-thin" d="M634,742 L120,612"/>
      <path className="d-thin" d="M634,742 L330,530"/>
      <path className="d-thin" d="M634,742 L860,520"/>
      <path className="d-thin" d="M634,742 L1000,640"/>
      {/* column + ground */}
      <path className="d-main" d="M620,742 L620,1143 M655,742 L655,1143"/>
      <path className="d-main" d="M40,1150 L960,1150"/>
      <path className="d-thin d-hatch" d="M60,1150 l-24,28 M110,1150 l-24,28 M160,1150 l-24,28 M210,1150 l-24,28 M260,1150 l-24,28 M310,1150 l-24,28 M360,1150 l-24,28 M410,1150 l-24,28 M460,1150 l-24,28 M510,1150 l-24,28 M560,1150 l-24,28 M610,1150 l-24,28 M660,1150 l-24,28 M710,1150 l-24,28 M760,1150 l-24,28 M810,1150 l-24,28 M860,1150 l-24,28 M910,1150 l-24,28"/>
      {/* dimension: height */}
      <path className="d-dim" d="M90,367 L90,1150 M70,367 L110,367 M70,1150 L110,1150 M80,377 L100,357 M80,1160 L100,1140 M110,367 L600,367"/>
      {/* dimension: span */}
      <path className="d-dim" d="M0,1230 L1000,1230 M0,1210 L0,1250 M1000,1210 L1000,1250 M637,1160 L637,1250"/>
      {/* leaders */}
      <path className="d-dim" d="M760,470 L860,300 L980,300"/>
      <path className="d-dim" d="M655,960 L780,960 L800,940 L980,940"/>
      <circle className="d-node" cx="643" cy="367" r="9"/>
      <circle className="d-node" cx="634" cy="742" r="9"/>
    </svg>
  );
}
