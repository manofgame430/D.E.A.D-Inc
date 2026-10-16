import { useCallback, useEffect, useRef, useState } from "react";

const WORLD = { width: 960, height: 600 };
const ASSET_ROOT = "/assets";
const PALETTE = {
  slimeGreen: "#A6D854",
  forestGreen: "#2E7D32",
  moonlight: "#E6F5B7",
  graveyardBlack: "#3B3B3B",
  cementGray: "#B7B7B7",
  hauntedBlue: "#1E88E5",
  phantomPurple: "#7B3FE4",
  spiritOrange: "#F57C00",
  gold: "#FBC02D",
  tombstoneTeal: "#008973",
};
const MONSTER_ROOM_LAYOUT = {
  2: [
    { x: 190, y: 220, roomName: "The Butcher's Pantry", roomCode: "2A" },
    { x: 490, y: 220, roomName: "The Funhouse", roomCode: "2B" },
    { x: 790, y: 220, roomName: "The Containment Room", roomCode: "2C" },
  ],
  3: [
    { x: 190, y: 220, roomName: "The Doll Parlour", roomCode: "3A" },
    { x: 490, y: 220, roomName: "The Mascot Lounge", roomCode: "3B" },
    { x: 790, y: 220, roomName: "The Long Gallery", roomCode: "3C" },
  ],
};

// The identifiers deliberately match the original monster image filenames.
const Butcher = {
  id: "Butcher", fileName: "Butcher.png", name: "The Butcher", title: "Director of Provisions",
  floor: 2, roomCode: "2A", roomName: "The Butcher's Pantry", fearRating: 9.1,
  encounters: 184, shift: "After midnight", portrait: "Monsters/Portriats/DemonVendor Portriat.png",
  sprite: "Monsters/Butcher.png", quote: "Fresh guests are always on the menu. Metaphorically. Mostly.",
  bio: "Keeps the pantry in order and makes sure no visitor leaves without a memorable story.",
};
const CreepyClown = {
  id: "CreepyClown", fileName: "CreepyClown.png", name: "Creepy Clown", title: "Senior Laughter Engineer",
  floor: 2, roomCode: "2B", roomName: "The Funhouse", fearRating: 8.7,
  encounters: 156, shift: "11:00 PM – 4:00 AM", portrait: "Monsters/Portriats/CreepyClown Portriat.png",
  sprite: "Monsters/CreepyClown.png", quote: "The best joke is the one they remember on the ride home.",
  bio: "Oversees misdirection, hall-of-mirrors incidents and all officially unscheduled pratfalls.",
};
const FleshMass = {
  id: "FleshMass", fileName: "FleshMass.png", name: "Flesh Mass", title: "Containment Specialist",
  floor: 2, roomCode: "2C", roomName: "The Containment Room", fearRating: 9.6,
  encounters: 111, shift: "All hours (unconfirmed)", portrait: "Monsters/Portriats/FleshMass Portriat.png",
  sprite: "Monsters/FleshMass.png", quote: "The room is perfectly safe. Please ignore the walls breathing.",
  bio: "Manages the house's most unusual containment space. Please do not knock on the glass.",
};
const HauntedDoll = {
  id: "HauntedDoll", fileName: "HauntedDoll.png", name: "Haunted Doll", title: "Guest Relations Consultant",
  floor: 3, roomCode: "3A", roomName: "The Doll Parlour", fearRating: 7.9,
  encounters: 98, shift: "Dusk until dawn", portrait: "Monsters/Portriats/HauntedDoll.png",
  sprite: "Monsters/HauntedDoll.png", quote: "I saved a seat for you. It has your name on it.",
  bio: "Collects forgotten keepsakes and specializes in the fine art of a perfectly timed stare.",
};
const HauntedMascot = {
  id: "HauntedMascot", fileName: "HauntedMascot.png", name: "Haunted Mascot", title: "Brand Engagement Lead",
  floor: 3, roomCode: "3B", roomName: "The Mascot Lounge", fearRating: 8.4,
  encounters: 93, shift: "Showtime", portrait: "Monsters/Portriats/HauntedMascot Portriat.png",
  sprite: "Monsters/HauntedMascot.png", quote: "Smile for the annual employee photo. Don't blink.",
  bio: "Leads meet-and-greets, costume audits and the occasional unscheduled parade through the halls.",
};
const TallStranger = {
  id: "TallStranger", fileName: "TallStranger.png", name: "Tall Stranger", title: "Director of Quiet Operations",
  floor: 3, roomCode: "3C", roomName: "The Long Gallery", fearRating: 8.9,
  encounters: 71, shift: "Whenever the lights dim", portrait: "Monsters/Portriats/TallStranger Portriat.png",
  sprite: "Monsters/TallStranger.png", quote: "I was standing here before you arrived.",
  bio: "Maintains the long gallery and its exceptionally strict silence policy. Reports are best delivered in writing.",
};
const MONSTERS = [Butcher, CreepyClown, FleshMass, HauntedDoll, HauntedMascot, TallStranger];

const DECOR = {
  candelabra: "Environment/Decoroations/Candelabra.png",
  candyCorn: "Environment/Decoroations/Candy corn pile.png",
  cauldron: "Environment/Decoroations/Cauldron.png",
  crystalBall: "Environment/Decoroations/Crystal ball.png",
  clock: "Environment/Decoroations/grandfather clock.png",
  jackOLantern: "Environment/Decoroations/Jack-o-lantern.png",
  piratePumpkin: "Environment/Decoroations/Jackolantern Pirate.png",
  mirror: "Environment/Decoroations/Mirror.png",
  scarecrow: "Environment/Decoroations/Scarecrow.png",
  skeleton: "Environment/Decoroations/Skeleton.png",
  orb: "Environment/Decoroations/orb.png",
  phone: "Environment/Decoroations/rotary phone.png",
  trophy: "Environment/Decoroations/trophy.png",
};

const ASSETS = {
  receptionist: `${ASSET_ROOT}/Receptionist/receptionist.png`,
  playerStill: `${ASSET_ROOT}/Player/still.png`,
  playerWalkNorth: `${ASSET_ROOT}/Player/walk/north.png`,
  playerWalkSouth: `${ASSET_ROOT}/Player/walk/south.png`,
  playerWalkEast: `${ASSET_ROOT}/Player/walk/east.png`,
  playerWalkWest: `${ASSET_ROOT}/Player/walk/west.png`,
  playerTurnNorth: `${ASSET_ROOT}/Player/turn/north.png`,
  playerTurnSouth: `${ASSET_ROOT}/Player/turn/south.png`,
  playerTurnEast: `${ASSET_ROOT}/Player/turn/east.png`,
  playerTurnWest: `${ASSET_ROOT}/Player/turn/west.png`,
  tilesetSofas: `${ASSET_ROOT}/Environment/Tileset/web/chairs and sofas transparent.png`,
  tilesetFireplace: `${ASSET_ROOT}/Environment/Tileset/web/fireplace transparent.png`,
  tilesetLibrary: `${ASSET_ROOT}/Environment/Tileset/web/library transparent.png`,
  tilesetDressers: `${ASSET_ROOT}/Environment/Tileset/web/tables and dressers transparent.png`,
  tilesetBoxes: `${ASSET_ROOT}/Environment/Tileset/web/boxes and suitcases transparent.png`,
  ...Object.fromEntries(Object.entries(DECOR).map(([key, path]) => [key, `${ASSET_ROOT}/${path}`])),
  ...Object.fromEntries(MONSTERS.map((monster) => [`${monster.id}Sprite`, `${ASSET_ROOT}/${monster.sprite}`])),
  ...Object.fromEntries(MONSTERS.map((monster) => [`${monster.id}Portrait`, `${ASSET_ROOT}/${monster.portrait}`])),
};

const MUSIC_TRACKS = {
  mansion: "/assets/audio/Haunted Corp Main Theme Loop.wav",
  Butcher: "/assets/audio/DemonicVendor Theme.wav", 
  CreepyClown: "/assets/audio/CreepyClown Theme.wav",
  FleshMass: "/assets/audio/FleshMass Theme.wav",
  HauntedDoll: "/assets/audio/HauntedDoll Theme.wav",
  HauntedMascot: "/assets/audio/HauntedMascot Theme.wav",
  TallStranger: "/assets/audio/TallStranger Theme.wav",
};

function makeMusicDirector() {
  let audio = null;
  let currentKey = null;
  let armed = false;
  return {
    arm() { armed = true; },
    switchTo(key) {
      if (key === currentKey) return;
      currentKey = key;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        audio = null;
      }
      const source = MUSIC_TRACKS[key] || (key !== "mansion" ? MUSIC_TRACKS.mansion : null);
      if (!armed || !source) return;
      audio = new Audio(source);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0.24;
      const candidate = audio;
      candidate.play().catch(() => {
        // Let the next user gesture retry if autoplay policy or network timing rejected playback.
        if (audio === candidate) currentKey = null;
      });
    },
    destroy() {
      if (audio) { audio.pause(); audio.removeAttribute("src"); audio.load(); audio = null; }
    },
  };
}

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = encodeURI(src);
  });
}

function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

function drawWoodFloor(ctx) {
  // Every walkable floor uses the palette's exact Graveyard Black base.
  ctx.fillStyle = PALETTE.graveyardBlack;
  ctx.fillRect(44, 57, 872, 487);
  // Quiet tile seams add pixel-art texture without changing the floor's overall color.
  for (let y = 58, row = 0; y < 544; y += 24, row += 1) {
    for (let x = 44; x < 916; x += 48) {
      const offset = row % 2 ? -24 : 0;
      const plankX = x + offset;
      ctx.fillStyle = "rgba(0, 0, 0, .13)";
      ctx.fillRect(plankX, y + 22, 48, 2);
      ctx.fillRect(plankX + 46, y, 2, 24);
      ctx.fillStyle = "rgba(183, 183, 183, .09)";
      ctx.fillRect(plankX + 4, y + 4, 18, 1);
    }
  }
}

function drawBrickWall(ctx, x, y, width, height) {
  // Cement Gray is the dominant wall material, with charcoal mortar and edges.
  ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(x, y, width, height);
  ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(x + 3, y + 3, width - 6, height - 6);
  for (let row = 0, py = y + 5; py < y + height - 3; row += 1, py += 13) {
    const shift = row % 2 ? 13 : 0;
    for (let px = x + 3 + shift; px < x + width - 4; px += 26) {
      ctx.fillStyle = row % 2 ? "#A7A7A7" : PALETTE.cementGray;
      ctx.fillRect(px, py, Math.min(24, x + width - 4 - px), 10);
      ctx.fillStyle = "rgba(255, 255, 255, .16)"; ctx.fillRect(px + 2, py + 2, 15, 1);
      ctx.fillStyle = "#777777"; ctx.fillRect(px, py + 10, Math.min(24, x + width - 4 - px), 2);
    }
  }
  ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(x, y + height - 4, width, 4);
  ctx.fillStyle = PALETTE.slimeGreen; ctx.fillRect(x, y + height - 4, width, 2);
}

function drawPortraitFrame(ctx, image, x, y, size = 42) {
  ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(x - 4, y - 4, size + 8, size + 8);
  ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(x - 3, y - 3, size + 6, size + 6);
  ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(x, y, size, size);
  if (image) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, x + 2, y + 2, size - 4, size - 4);
  } else {
    ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(x + 5, y + 5, size - 10, size - 10);
  }
  ctx.fillStyle = PALETTE.gold; ctx.fillRect(x - 2, y - 2, 4, 4); ctx.fillRect(x + size - 2, y - 2, 4, 4);
}


function drawSheetCrop(ctx, image, sx, sy, sw, sh, dx, dy, dw, dh) {
  if (!image) return;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
}

function drawSconce(ctx, x, y) {
  ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(x - 7, y, 14, 16);
  ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(x - 4, y + 3, 8, 9);
  ctx.fillStyle = PALETTE.gold; ctx.fillRect(x - 2, y - 1, 4, 7);
  ctx.fillStyle = "rgba(166, 216, 84, .12)"; ctx.beginPath(); ctx.arc(x, y + 4, 22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.moonlight; ctx.fillRect(x - 2, y, 4, 4);
}

function drawWindow(ctx, x, y, width = 48, height = 48) {
  ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(x - 4, y - 4, width + 8, height + 8);
  ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(x - 2, y - 2, width + 4, height + 4);
  ctx.fillStyle = PALETTE.hauntedBlue; ctx.fillRect(x, y, width, height);
  ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(x + 3, y + 3, width - 6, height - 6);
  ctx.fillStyle = "#292929"; ctx.fillRect(x + 5, y + 5, width - 10, height - 10);
  ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(x + width / 2 - 2, y, 4, height); ctx.fillRect(x, y + height / 2 - 2, width, 4);
  ctx.fillStyle = PALETTE.phantomPurple; ctx.fillRect(x + 8, y + 7, 8, 3);
}

function drawDoor(ctx, x, y, width = 44, opened = false) {
  ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(x - 4, y - 3, width + 8, 34);
  ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(x - 2, y - 2, width + 4, 31);
  ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(x, y, width, 28);
  ctx.fillStyle = "#256728"; ctx.fillRect(x + 4, y + 3, width - 8, 23);
  ctx.fillStyle = "#245A29"; ctx.fillRect(x + 8, y + 5, width - 16, 18);
  if (opened) {
    ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(x + 4, y + 1, width - 8, 24);
    ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(x + width - 9, y + 2, 5, 23);
    ctx.fillStyle = PALETTE.slimeGreen; ctx.fillRect(x + 3, y + 1, 3, 23);
  } else {
    ctx.fillStyle = PALETTE.gold; ctx.fillRect(x + width - 8, y + 13, 3, 3);
    ctx.fillStyle = PALETTE.moonlight; ctx.fillRect(x + 5, y + 5, 2, 9);
  }
}

function drawStairs(ctx) {
  ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(806, 412, 83, 99);
  ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(811, 417, 73, 89);
  ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(816, 422, 63, 79);
  for (let i = 0; i < 6; i += 1) {
    const stepY = 485 - i * 10;
    const stepW = 56 - i * 5;
    ctx.fillStyle = i % 2 ? PALETTE.forestGreen : "#398A3E";
    ctx.fillRect(823 + i * 2, stepY, stepW, 8);
    ctx.fillStyle = PALETTE.slimeGreen; ctx.fillRect(823 + i * 2, stepY, stepW, 2);
  }
  ctx.fillStyle = PALETTE.gold; ctx.fillRect(840, 420, 16, 3); ctx.fillRect(846, 414, 4, 10);
  ctx.fillStyle = PALETTE.moonlight; ctx.font = "bold 10px monospace"; ctx.textAlign = "center"; ctx.fillText("STAIRS", 848, 528);
}

function drawDesk(ctx) {
  // Reception counter remains solid and walk-blocking, using the shared mansion palette.
  ctx.fillStyle = "rgba(0, 0, 0, .42)"; ctx.fillRect(344, 244, 240, 32);
  ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(350, 204, 224, 64);
  ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(347, 201, 230, 12);
  ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(351, 204, 222, 8);
  ctx.fillStyle = "#285E2B"; ctx.fillRect(358, 213, 208, 44);
  ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(365, 219, 194, 30);
  ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(365, 259, 194, 5);
  ctx.fillStyle = PALETTE.slimeGreen; ctx.fillRect(371, 224, 182, 2);
  ctx.fillStyle = PALETTE.gold; ctx.fillRect(387, 234, 7, 7); ctx.fillRect(530, 234, 7, 7);
  ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(483, 178, 24, 18); ctx.fillRect(489, 173, 14, 8);
  ctx.fillStyle = PALETTE.gold; ctx.fillRect(493, 186, 4, 10); ctx.fillRect(485, 194, 20, 3);
  ctx.fillStyle = PALETTE.moonlight; ctx.font = "bold 10px monospace"; ctx.textAlign = "center"; ctx.fillText("RECEPTION", 462, 241);
  ctx.fillStyle = PALETTE.gold; ctx.fillRect(415, 220, 16, 5); ctx.fillRect(438, 220, 8, 5);
}

function drawWallPlaque(ctx, x, y, title, code) {
  ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(x - 47, y - 12, 94, 24);
  ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(x - 44, y - 9, 88, 18);
  ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(x - 41, y - 6, 82, 12);
  ctx.fillStyle = PALETTE.moonlight; ctx.textAlign = "center"; ctx.font = "bold 8px monospace"; ctx.fillText(`${code}  ${title.toUpperCase()}`, x, y + 3, 78);
}

function drawReceptionistImage(ctx, image, x, feetY) {
  ctx.fillStyle = "rgba(0, 0, 0, .28)";
  ctx.beginPath(); ctx.ellipse(x, feetY + 1, 22, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, x - 36, feetY - 74, 72, 74);
}

function drawGhostReceptionist(ctx, x, feetY, t) {
  const bob = Math.sin(t / 280) * 2;
  ctx.fillStyle = "rgba(6, 4, 12, .28)"; ctx.beginPath(); ctx.ellipse(x, feetY + 1, 19, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(230, 245, 183, .90)";
  ctx.beginPath(); ctx.moveTo(x - 15, feetY - 24 + bob); ctx.quadraticCurveTo(x - 18, feetY - 44 + bob, x, feetY - 43 + bob); ctx.quadraticCurveTo(x + 18, feetY - 44 + bob, x + 15, feetY - 23 + bob); ctx.lineTo(x + 14, feetY - 4); ctx.lineTo(x + 5, feetY - 10); ctx.lineTo(x, feetY - 4); ctx.lineTo(x - 6, feetY - 10); ctx.lineTo(x - 14, feetY - 4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = PALETTE.hauntedBlue; ctx.fillRect(x - 8, feetY - 30 + bob, 4, 5); ctx.fillRect(x + 4, feetY - 30 + bob, 4, 5);
  ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(x - 11, feetY - 47 + bob, 22, 4); ctx.fillRect(x - 5, feetY - 52 + bob, 10, 6);
}

function renderBackground(floor, images) {
  const offscreen = document.createElement("canvas");
  offscreen.width = WORLD.width; offscreen.height = WORLD.height;
  const ctx = offscreen.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(0, 0, WORLD.width, WORLD.height);
  // Subtle ambient specks outside the walkable footprint.
  for (let i = 0; i < 42; i += 1) {
    const x = (i * 173 + 31) % WORLD.width; const y = (i * 97 + 19) % WORLD.height;
    ctx.fillStyle = i % 3 ? "rgba(166, 216, 84, .10)" : "rgba(30, 136, 229, .10)";
    ctx.fillRect(x, y, 2, 2);
  }
  drawWoodFloor(ctx);
  drawBrickWall(ctx, 28, 31, 904, 31); // north wall
  drawBrickWall(ctx, 28, 31, 25, 525); // west wall
  drawBrickWall(ctx, 907, 31, 25, 525); // east wall
  drawBrickWall(ctx, 28, 536, 904, 23); // south wall

  drawWindow(ctx, 98, 39, 45, 37); drawWindow(ctx, 454, 39, 45, 37); drawWindow(ctx, 818, 39, 45, 37);
  drawSconce(ctx, 202, 51); drawSconce(ctx, 746, 51);
  drawPortraitFrame(ctx, images.HauntedDollPortrait, 266, 36, 28);
  drawPortraitFrame(ctx, images.CreepyClownPortrait, 660, 36, 28);

  // Edge skirting and structural pillars give the hall a built, three-dimensional feel.
  ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(54, 74, 852, 7); ctx.fillRect(54, 524, 852, 6);
  for (const x of [68, 322, 638, 890]) {
    ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(x, 63, 12, 465);
    ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(x - 3, 73, 18, 5); ctx.fillRect(x - 3, 519, 18, 5);
    ctx.fillStyle = "#8F8F8F"; ctx.fillRect(x + 3, 78, 3, 438);
  }

  if (floor === 1) {
    // Grand foyer: entrance carpet, reception desk and richly decorated side tables.
    ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(393, 283, 140, 212);
    ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(399, 289, 128, 200);
    ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(404, 295, 118, 188);
    ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(410, 301, 106, 176);
    for (let y = 306; y < 475; y += 16) { ctx.fillStyle = "rgba(166, 216, 84, .20)"; ctx.fillRect(418, y, 90, 2); }
    ctx.strokeStyle = PALETTE.gold; ctx.lineWidth = 2; ctx.strokeRect(415, 307, 96, 164);
    ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(310, 103, 308, 43);
    ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(315, 108, 298, 33);
    ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(319, 112, 290, 25);
    ctx.fillStyle = PALETTE.moonlight; ctx.textAlign = "center"; ctx.font = "bold 15px Georgia"; ctx.fillText("HAUNTED CORPS", 464, 129);
    ctx.fillStyle = PALETTE.gold; ctx.font = "9px monospace"; ctx.fillText("VISITOR SERVICES  ·  EST. 1897", 464, 156);
    drawDesk(ctx);
    drawDoor(ctx, 447, 505, 63, true);
    ctx.fillStyle = PALETTE.moonlight; ctx.font = "bold 9px monospace"; ctx.fillText("MAIN ENTRANCE", 480, 499);
    drawStairs(ctx);
    drawPortraitFrame(ctx, images.ButcherPortrait, 105, 133, 43);
    drawPortraitFrame(ctx, images.TallStrangerPortrait, 801, 133, 43);
    drawPortraitFrame(ctx, images.HauntedMascotPortrait, 105, 285, 43);
    drawPortraitFrame(ctx, images.FleshMassPortrait, 801, 285, 43);
    ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(104, 365, 120, 86); ctx.fillRect(742, 365, 120, 86);
    ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(100, 360, 128, 9); ctx.fillRect(738, 360, 128, 9);
    ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(112, 371, 104, 4); ctx.fillRect(750, 371, 104, 4);
    if (images.crystalBall) ctx.drawImage(images.crystalBall, 143, 325, 36, 36);
    if (images.phone) ctx.drawImage(images.phone, 780, 330, 48, 16);
    if (images.clock) ctx.drawImage(images.clock, 240, 404, 24, 72);
    if (images.candelabra) { ctx.drawImage(images.candelabra, 294, 438, 30, 41); ctx.drawImage(images.candelabra, 637, 438, 30, 41); }
    if (images.cauldron) ctx.drawImage(images.cauldron, 581, 411, 31, 27);
    if (images.jackOLantern) ctx.drawImage(images.jackOLantern, 332, 468, 34, 34);
    if (images.trophy) ctx.drawImage(images.trophy, 696, 473, 32, 32);
    if (images.scarecrow) ctx.drawImage(images.scarecrow, 158, 302, 40, 46);
    if (images.candyCorn) ctx.drawImage(images.candyCorn, 210, 456, 31, 29);
    if (images.piratePumpkin) ctx.drawImage(images.piratePumpkin, 686, 405, 42, 34);
    if (images.orb) ctx.drawImage(images.orb, 756, 458, 28, 28);
    drawSheetCrop(ctx, images.tilesetSofas, 128, 62, 48, 34, 749, 378, 66, 46);
    ctx.fillStyle = PALETTE.moonlight; ctx.font = "10px monospace"; ctx.textAlign = "center"; ctx.fillText("Please check in at reception", 462, 178);
  } else {
    // Three individual monster rooms open onto a shared corridor. Door gaps stay walkable.
    const roomCenters = [190, 490, 790];
    const roster = MONSTER_ROOM_LAYOUT[floor].map((room) => ({ ...room, monster: MONSTERS.find((m) => m.floor === floor && m.roomCode === room.roomCode) }));
    roster.forEach((room, index) => {
      const roomX = index === 2 ? 670 : index * 300 + 55;
      const roomWidth = index === 2 ? 238 : 270;
      ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(roomX + 8, 85, roomWidth - 12, 177);
      ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(roomX + 15, 94, roomWidth - 26, 157);
      ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(roomX + 20, 99, roomWidth - 36, 147);
      ctx.strokeStyle = PALETTE.forestGreen; ctx.lineWidth = 2; ctx.strokeRect(roomX + 24, 103, roomWidth - 44, 139);
      ctx.strokeStyle = "rgba(183, 183, 183, .42)"; ctx.lineWidth = 1; ctx.strokeRect(roomX + 31, 110, roomWidth - 58, 125);
      // Green room trim and moonlight medallion keep rooms distinct without changing floor color.
      ctx.fillStyle = "rgba(166, 216, 84, .18)"; ctx.fillRect(roomX + 40, 129, roomWidth - 90, 3); ctx.fillRect(roomX + 40, 219, roomWidth - 90, 3);
      ctx.strokeStyle = "rgba(230, 245, 183, .35)"; ctx.beginPath(); ctx.ellipse(roomX + roomWidth / 2, 176, Math.min(54, roomWidth / 4.7), 34, 0, 0, Math.PI * 2); ctx.stroke();
      drawWallPlaque(ctx, roomCenters[index], 83, room.monster?.name || "Employee", room.roomCode);
      drawDoor(ctx, roomCenters[index] - 23, 255, 46, false);
      drawSconce(ctx, roomX + 43, 86); drawSconce(ctx, roomX + roomWidth - 36, 86);
      if (room.monster?.id === "Butcher") {
        // The pantry gets a closed cabinet from the supplied tables/dressers atlas.
        drawSheetCrop(ctx, images.tilesetDressers, 35, 5, 41, 46, roomX + 20, 153, 43, 48);
        drawSheetCrop(ctx, images.tilesetBoxes, 1, 0, 31, 18, roomX + 209, 174, 36, 21);
      } else if (room.monster?.id === "CreepyClown" || room.monster?.id === "HauntedMascot") {
        // A deep green sofa adds a different silhouette to each performance room.
        drawSheetCrop(ctx, images.tilesetSofas, 128, 28, 48, 34, roomX + 20, 176, 65, 46);
      } else if (room.monster?.id === "FleshMass") {
        drawSheetCrop(ctx, images.tilesetDressers, 0, 53, 42, 42, roomX + 18, 163, 47, 47);
        drawSheetCrop(ctx, images.tilesetBoxes, 0, 17, 32, 15, roomX + 208, 181, 36, 18);
      } else if (room.monster?.id === "HauntedDoll") {
        drawSheetCrop(ctx, images.tilesetDressers, 35, 5, 41, 46, roomX + 20, 153, 43, 48);
        drawSheetCrop(ctx, images.tilesetLibrary, 0, 0, 47, 35, roomX + 202, 148, 44, 34);
      } else if (room.monster?.id === "TallStranger") {
        drawSheetCrop(ctx, images.tilesetLibrary, 48, 64, 64, 55, roomX + 159, 137, 63, 54);
        drawSheetCrop(ctx, images.tilesetFireplace, 0, 0, 48, 80, roomX + 17, 125, 47, 79);
      }
    });
    // Corridor runner, wall line, and stair landing.
    ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(55, 285, 850, 111);
    ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(63, 293, 834, 95);
    ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(70, 300, 820, 3); ctx.fillRect(70, 379, 820, 3);
    for (let x = 82; x < 884; x += 34) { ctx.fillStyle = "rgba(183, 183, 183, .18)"; ctx.fillRect(x, 311, 2, 61); }
    // Openings are drawn as separate wall sections instead of one obstructing line.
    const doorGaps = [[55, 143], [231, 443], [537, 743], [823, 905]];
    doorGaps.forEach(([left, right]) => { ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(left, 271, right - left, 13); ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(left, 280, right - left, 4); });
    // Benches, trophy plinths and lighting break up the hallway.
    for (const x of [276, 580]) {
      ctx.fillStyle = PALETTE.graveyardBlack; ctx.fillRect(x - 27, 414, 54, 33);
      ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(x - 30, 410, 60, 8); ctx.fillRect(x - 25, 447, 5, 12); ctx.fillRect(x + 20, 447, 5, 12);
      ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(x - 21, 417, 42, 3);
    }
    if (images.candelabra) { ctx.drawImage(images.candelabra, 108, 409, 27, 37); ctx.drawImage(images.candelabra, 727, 409, 27, 37); }
    drawSheetCrop(ctx, images.tilesetSofas, 128, 28, 48, 34, 245, 407, 61, 43);
    drawSheetCrop(ctx, images.tilesetSofas, 128, 62, 48, 34, 550, 407, 61, 43);
    if (images.mirror) { ctx.drawImage(images.mirror, 412, 404, 32, 43); ctx.drawImage(images.mirror, 619, 404, 32, 43); }
    if (images.skeleton) ctx.drawImage(images.skeleton, 855, 425, 20, 29);
    if (images.orb) ctx.drawImage(images.orb, 765, 462, 28, 28);
    if (images.candyCorn) ctx.drawImage(images.candyCorn, 331, 465, 28, 25);
    if (images.piratePumpkin && floor === 3) ctx.drawImage(images.piratePumpkin, 588, 422, 38, 31);
    drawStairs(ctx);
    ctx.fillStyle = PALETTE.moonlight; ctx.font = "bold 10px monospace"; ctx.textAlign = "left";
    ctx.fillText(floor === 2 ? "PORTRAIT WING  /  FLOOR II" : "MIDNIGHT WING  /  FLOOR III", 72, 518);
    // Interior divider walls stop at each doorway, giving the player true connected rooms.
    ctx.fillStyle = PALETTE.cementGray; ctx.fillRect(344, 70, 13, 194); ctx.fillRect(644, 70, 13, 194);
    ctx.fillStyle = PALETTE.forestGreen; ctx.fillRect(344, 70, 13, 4); ctx.fillRect(644, 70, 13, 4);
  }

  // Cobweb-free silhouettes and common dressing keep every floor visually distinct and readable.
  ctx.fillStyle = "rgba(0, 0, 0, .35)"; ctx.fillRect(56, 83, 3, 432); ctx.fillRect(901, 83, 3, 432);
  return offscreen;
}

function playerBlocked(nextX, nextY, floor, openedRooms, currentY = nextY) {
  if (nextX < 65 || nextX > 895 || nextY < 92 || nextY > 525) return true;
  if (floor === 1) {
    // Reception counter and side furniture.
    if (nextX > 342 && nextX < 581 && nextY > 199 && nextY < 278) return true;
    if (nextX > 95 && nextX < 236 && nextY > 355 && nextY < 385) return true;
    if (nextX > 731 && nextX < 874 && nextY > 355 && nextY < 385) return true;
    return false;
  }
  // Room entrances stay solid until the player opens that room's door.
  // Include the current position in the check so fast frame steps cannot slip through the wall.
  const inFrontWallBand = (nextY > 264 && nextY < 289)
    || (currentY > 264 && currentY < 289 && nextY <= 264);
  if (inFrontWallBand) {
    const room = MONSTER_ROOM_LAYOUT[floor].find((entry) => Math.abs(nextX - entry.x) < 43);
    if (!room || !openedRooms[room.roomCode]) return true;
  }
  if (nextY < 266 && ((nextX > 337 && nextX < 363) || (nextX > 637 && nextX < 663))) return true;
  if (nextX > 808 && nextX < 890 && nextY > 412 && nextY < 511) return true;
  return false;
}

function findNearby(player, floor, openedRooms) {
  const candidates = [];
  if (floor === 1) {
    candidates.push({ id: "reception", type: "reception", label: "Reception desk", hint: "Talk to the receptionist", x: 462, y: 258, radius: 78 });
  } else {
    MONSTER_ROOM_LAYOUT[floor].forEach((room) => {
      const monster = MONSTERS.find((m) => m.floor === floor && m.roomCode === room.roomCode);
      if (!monster) return;
      if (!openedRooms[room.roomCode]) {
        candidates.push({ id: `door-${room.roomCode}`, type: "door", roomCode: room.roomCode, roomName: room.roomName, label: `${room.roomCode} · ${room.roomName}`, hint: "Open room door", x: room.x, y: 268, radius: 54 });
      } else {
        candidates.push({ id: monster.id, type: "monster", monster, label: monster.name, hint: "Talk to employee", x: room.x, y: 218, radius: 42 });
      }
    });
  }
  candidates.push({ id: "stairs", type: "stairs", label: "Grand staircase", hint: floor === 3 ? "Return to Floor I" : `Travel to Floor ${floor + 1}`, x: 848, y: 466, radius: 78 });
  let closest = null;
  let closestDistance = Infinity;
  for (const item of candidates) {
    const d = distance(player, item);
    if (d < item.radius && d < closestDistance) { closest = item; closestDistance = d; }
  }
  return closest;
}

function currentMusicRegion(player, floor, openedRooms) {
  if (floor === 1) return "mansion";
  const roomIndex = player.x < 340 ? 0 : player.x < 640 ? 1 : 2;
  const room = MONSTER_ROOM_LAYOUT[floor][roomIndex];
  if (player.y < 263 && openedRooms[room.roomCode]) {
    const monster = MONSTERS.find((m) => m.floor === floor && m.roomCode === room.roomCode);
    return monster?.id || "mansion";
  }
  return "mansion";
}

function drawPlayer(ctx, images, player, timestamp) {
  const { facing, moving } = player;
  const turnImage = images[`playerTurn${facing[0].toUpperCase()}${facing.slice(1)}`] || images.playerStill;
  const walkImage = images[`playerWalk${facing[0].toUpperCase()}${facing.slice(1)}`] || images.playerWalkSouth;
  const frameCount = facing === "north" ? 8 : 12;
  const frame = moving ? Math.floor(timestamp / 88) % frameCount : 0;
  const image = moving ? walkImage : turnImage;
  if (image) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, moving ? frame * 192 : 0, 0, 192, 192, Math.round(player.x - 56), Math.round(player.y - 100), 112, 112);
  } else {
    ctx.fillStyle = "#d8d1b7"; ctx.fillRect(player.x - 8, player.y - 28, 16, 28);
  }
  // Tiny ground shadow gives the transparent sprite a stable foot point.
  ctx.fillStyle = "rgba(9, 5, 13, .42)"; ctx.beginPath(); ctx.ellipse(player.x, player.y - 1, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
}

function drawMonster(ctx, images, monster, layout, timestamp) {
  const image = images[`${monster.id}Sprite`];
  const width = image?.naturalWidth || 96; const height = image?.naturalHeight || 96;
  const scale = Math.min(128 / width, 111 / height);
  const w = width * scale; const h = height * scale;
  ctx.fillStyle = "rgba(9, 5, 13, .42)"; ctx.beginPath(); ctx.ellipse(layout.x, layout.y + 1, Math.max(17, w * .31), 5, 0, 0, Math.PI * 2); ctx.fill();
  if (image) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, Math.round(layout.x - w / 2), Math.round(layout.y - h), Math.round(w), Math.round(h));
  }
  // Small name rune animates very gently to make the room's interaction target obvious.
  const glow = 0.68 + (Math.sin(timestamp / 360) + 1) * 0.12;
  ctx.globalAlpha = glow; ctx.fillStyle = "#ffbf6f"; ctx.fillRect(layout.x - 3, layout.y + 3, 6, 2); ctx.globalAlpha = 1;
}

function MansionCanvas({ floor, onNearbyChange, pausedRef, interactRef, onFloorChange, musicRef, openedRoomsRef, openRoomRef, onRoomOpened, onInteractItem }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const backgroundsRef = useRef({});
  const imagesRef = useRef({});
  const frameRef = useRef(0);
  const pausedLatest = pausedRef;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;
    context.imageSmoothingEnabled = false;
    const keys = new Set();
    const game = {
      player: { x: 480, y: 474, facing: "north", moving: false, target: null },
      floor: 1, previousTime: 0, nearbyId: null, musicRegion: "mansion", imagesLoaded: false,
    };
    gameRef.current = game;
    let disposed = false;

    Promise.all(Object.entries(ASSETS).map(async ([key, src]) => [key, await loadImage(src)])).then((entries) => {
      if (disposed) return;
      const images = Object.fromEntries(entries);
      imagesRef.current = images;
      game.imagesLoaded = true;
      backgroundsRef.current = {
        1: renderBackground(1, images),
        2: renderBackground(2, images),
        3: renderBackground(3, images),
      };
    });

    const changeFloor = (nextFloor) => {
      game.floor = nextFloor;
      game.player.x = 480;
      game.player.y = nextFloor === 1 ? 465 : 445;
      game.player.target = null;
      game.nearbyId = null;
      game.musicRegion = currentMusicRegion(game.player, nextFloor, openedRoomsRef.current);
      onNearbyChange(null);
      onFloorChange(nextFloor);
      musicRef.current?.switchTo(game.musicRegion);
    };

    const openRoom = (roomCode) => {
      if (!openedRoomsRef.current[roomCode]) onRoomOpened(roomCode);
      game.nearbyId = null;
      game.player.target = null;
    };
    openRoomRef.current = openRoom;

    const interact = () => {
      if (pausedLatest.current.current) return;
      const item = findNearby(game.player, game.floor, openedRoomsRef.current);
      if (!item) return;
      game.player.target = null;
      if (item.type === "stairs") {
        const nextFloor = game.floor === 3 ? 1 : game.floor + 1;
        changeFloor(nextFloor);
        return;
      }
      if (item.type === "door") {
        openRoom(item.roomCode);
        return;
      }
      onInteractItem(item);
    };
    interactRef.current = interact;

    const keyDown = (event) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) event.preventDefault();
      const key = event.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) keys.add(key);
      musicRef.current?.arm();
      musicRef.current?.switchTo(game.musicRegion);
      if ((key === "e" || key === "enter") && !event.repeat) {
        event.preventDefault();
        interact();
      }
      if (key === "escape") pausedLatest.current.onEscape?.();
    };
    const keyUp = (event) => keys.delete(event.key.toLowerCase());
    const blur = () => keys.clear();
    const pointerDown = (event) => {
      musicRef.current?.arm();
      musicRef.current?.switchTo(game.musicRegion);
      const rect = canvas.getBoundingClientRect();
      const logicalX = (event.clientX - rect.left) / rect.width * WORLD.width;
      const logicalY = (event.clientY - rect.top) / rect.height * WORLD.height;
      const gameState = gameRef.current;
      if (!gameState || pausedLatest.current.current) return;
      gameState.player.target = { x: clamp(logicalX, 65, 895), y: clamp(logicalY, 92, 525) };
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("blur", blur);
    canvas.addEventListener("pointerdown", pointerDown);

    const stepPlayer = (dt) => {
      const player = game.player;
      let dx = 0; let dy = 0;
      if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
      if (keys.has("arrowright") || keys.has("d")) dx += 1;
      if (keys.has("arrowup") || keys.has("w")) dy -= 1;
      if (keys.has("arrowdown") || keys.has("s")) dy += 1;
      if (dx || dy) player.target = null;
      if (dx && dy) { const divisor = Math.hypot(dx, dy); dx /= divisor; dy /= divisor; }
      if (!dx && !dy && player.target) {
        const deltaX = player.target.x - player.x;
        const deltaY = player.target.y - player.y;
        const dist = Math.hypot(deltaX, deltaY);
        if (dist < 3) player.target = null;
        else { dx = deltaX / dist; dy = deltaY / dist; }
      }
      const isMoving = Boolean(dx || dy);
      player.moving = isMoving;
      if (!isMoving) return;
      if (Math.abs(dx) > Math.abs(dy)) player.facing = dx < 0 ? "west" : "east";
      else player.facing = dy < 0 ? "north" : "south";
      const velocity = 145 * (dt / 1000);
      const stepX = dx * velocity; const stepY = dy * velocity;
      if (dx && !playerBlocked(player.x + stepX, player.y, game.floor, openedRoomsRef.current, player.y)) player.x += stepX;
      if (dy && !playerBlocked(player.x, player.y + stepY, game.floor, openedRoomsRef.current, player.y)) player.y += stepY;
    };

    const render = (timestamp) => {
      if (disposed) return;
      const dt = Math.min(36, game.previousTime ? timestamp - game.previousTime : 16);
      game.previousTime = timestamp;
      if (!pausedLatest.current.current) stepPlayer(dt);
      const nearby = findNearby(game.player, game.floor, openedRoomsRef.current);
      if ((nearby?.id || null) !== game.nearbyId) {
        game.nearbyId = nearby?.id || null;
        onNearbyChange(nearby);
      }
      const region = currentMusicRegion(game.player, game.floor, openedRoomsRef.current);
      if (region !== game.musicRegion) {
        game.musicRegion = region;
        musicRef.current?.switchTo(region);
      }

      context.clearRect(0, 0, WORLD.width, WORLD.height);
      const background = backgroundsRef.current[game.floor];
      if (background) context.drawImage(background, 0, 0);
      else {
        context.fillStyle = PALETTE.graveyardBlack; context.fillRect(0, 0, WORLD.width, WORLD.height);
        context.fillStyle = PALETTE.cementGray; context.fillRect(40, 55, 880, 490);
      }
      if (game.floor === 1) {
        const receptionistImage = imagesRef.current.receptionist;
        if (receptionistImage) drawReceptionistImage(context, receptionistImage, 462, 201);
        else drawGhostReceptionist(context, 462, 201, timestamp);
      }

      // Room doors are stateful overlays. Closed doors hide the employee sprite behind them.
      if (game.floor > 1) {
        MONSTER_ROOM_LAYOUT[game.floor].forEach((room) => {
          drawDoor(context, room.x - 23, 255, 46, Boolean(openedRoomsRef.current[room.roomCode]));
        });
      }

      const dynamicEntities = [];
      if (game.floor !== 1) {
        MONSTER_ROOM_LAYOUT[game.floor].forEach((layout) => {
          const monster = MONSTERS.find((m) => m.floor === game.floor && m.roomCode === layout.roomCode);
          if (monster && openedRoomsRef.current[layout.roomCode]) dynamicEntities.push({ y: layout.y, type: "monster", monster, layout });
        });
      }
      dynamicEntities.push({ y: game.player.y, type: "player" });
      dynamicEntities.sort((a, b) => a.y - b.y);
      dynamicEntities.forEach((entity) => {
        if (entity.type === "monster") drawMonster(context, imagesRef.current, entity.monster, entity.layout, timestamp);
        else drawPlayer(context, imagesRef.current, game.player, timestamp);
      });
      // Interaction glint is drawn last so the target remains clear against busy pixel art.
      if (nearby && !pausedLatest.current.current) {
        const pulse = 1 + (Math.sin(timestamp / 200) + 1) * 1.25;
        context.strokeStyle = "rgba(166, 216, 84, .92)"; context.lineWidth = 2;
        context.beginPath(); context.arc(nearby.x, nearby.y - 14, 19 + pulse, 0, Math.PI * 2); context.stroke();
      }
      frameRef.current = requestAnimationFrame(render);
    };
    frameRef.current = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", blur);
      canvas.removeEventListener("pointerdown", pointerDown);
      if (interactRef.current === interact) interactRef.current = null;
      if (openRoomRef.current === openRoom) openRoomRef.current = null;
    };
  }, [interactRef, onFloorChange, musicRef, pausedLatest, onNearbyChange, openedRoomsRef, openRoomRef, onRoomOpened, onInteractItem]);

  // Kept in sync when React updates floor after the staircase interaction.
  useEffect(() => {
    if (gameRef.current && gameRef.current.floor !== floor) gameRef.current.floor = floor;
  }, [floor]);

  return <canvas ref={canvasRef} className="mansion-canvas" width={WORLD.width} height={WORLD.height} aria-label="Top-down explorable Haunted Corps mansion. Use WASD or arrow keys to move; press E near the receptionist, a monster, or the staircase." />;
}

function InteractionDialogue({ dialogue, onClose, onOpenDashboard, onViewCard }) {
  if (!dialogue) return null;
  const isReception = dialogue.type === "reception";
  const monster = dialogue.monster;
  return <div className="dialogue-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="dialogue-window" role="dialog" aria-modal="true" aria-labelledby="dialogue-title">
      <div className="dialogue-topline"><span className="dialogue-sigil">{isReception ? "✦" : "☠"}</span><span>{isReception ? "VISITOR SERVICES" : `PERSONNEL FILE · ${monster?.roomCode || "UNKNOWN"}`}</span><button type="button" className="icon-close" aria-label="Close dialogue" onClick={onClose}>×</button></div>
      <h2 id="dialogue-title">{isReception ? "Welcome to Haunted Corps" : `A word with ${monster?.name || "the employee"}`}</h2>
      <p>{isReception ? "The house is open, the spirits are on shift, and the numbers are waiting. What would you like to do?" : (monster?.quote || "The employee turns slowly toward you.")}</p>
      <div className="dialogue-rule"><span /></div>
      <div className="dialogue-options">
        {isReception ? <button type="button" className="choice-primary" onClick={onOpenDashboard}><span className="choice-index">01</span><span><strong>Open Analytics Dashboard</strong><small>View the house performance dashboard</small></span><span className="choice-arrow">↗</span></button> : <button type="button" className="choice-primary" onClick={() => onViewCard(monster)}><span className="choice-index">01</span><span><strong>View Employee Card</strong><small>Open personnel details and assignment</small></span><span className="choice-arrow">↗</span></button>}
        <button type="button" className="choice-secondary" onClick={onClose}><span className="choice-index">02</span><span><strong>{isReception ? "Close dialogue" : "Close dialogue box"}</strong><small>Return to exploring the mansion</small></span><span className="choice-arrow">↵</span></button>
      </div>
      <div className="dialogue-footer">USE MOUSE OR KEYBOARD · ESC TO DISMISS</div>
    </section>
  </div>;
}

function EmployeeCardModal({ monster, onClose }) {
  if (!monster) return null;
  return <div className="dialogue-scrim card-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="employee-file-modal" role="dialog" aria-modal="true" aria-labelledby="employee-name">
      <div className="file-ribbon"><span>HAUNTED CORPS</span><span>EMPLOYEE DOSSIER / {monster.roomCode}</span></div>
      <button type="button" className="icon-close file-close" aria-label="Close employee card" onClick={onClose}>×</button>
      <div className="employee-file-main">
        <div className="file-portrait-frame"><img src={encodeURI(`${ASSET_ROOT}/${monster.portrait}`)} alt={`${monster.name} portrait`} /><span className="portrait-stamp">ACTIVE</span></div>
        <div className="file-identity"><p className="file-eyebrow">NIGHT SHIFT PERSONNEL</p><h2 id="employee-name">{monster.name}</h2><p className="file-title">{monster.title}</p><p className="file-room"><span>ASSIGNED LOCATION</span>{monster.roomName} · Floor {monster.floor}</p></div>
      </div>
      <p className="employee-bio">{monster.bio}</p>
      <div className="employee-file-stats">
        <div><span>Fear rating</span><strong>{monster.fearRating}<small>/10</small></strong></div>
        <div><span>Recorded encounters</span><strong>{monster.encounters}</strong></div>
        <div><span>Scheduled shift</span><strong className="shift-value">{monster.shift}</strong></div>
      </div>
      <div className="employee-quote">“{monster.quote}”</div>
      <div className="file-footer"><span>INTERNAL USE ONLY · DO NOT FEED DURING REVIEW</span><button type="button" onClick={onClose}>Close employee card <span>↵</span></button></div>
    </section>
  </div>;
}

function HauntedMansion({ onOpenDashboard }) {
  const [floor, setFloor] = useState(1);
  const [nearby, setNearby] = useState(null);
  const [dialogue, setDialogue] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [openedRooms, setOpenedRooms] = useState({});
  const openedRoomsRef = useRef(openedRooms);
  const openRoomRef = useRef(null);
  const musicStatus = "loop-ready";
  const musicRef = useRef(null);
  const pausedRef = useRef({ current: false, onEscape: null });
  const interactRef = useRef(null);

  useEffect(() => {
    const director = makeMusicDirector();
    musicRef.current = director;
    return () => { director.destroy(); musicRef.current = null; };
  }, []);

  const closePanels = useCallback(() => { setDialogue(null); setActiveCard(null); }, []);
  const handleInteractItem = useCallback((item) => { setDialogue(item); }, []);
  const handleRoomOpened = useCallback((roomCode) => {
    if (openedRoomsRef.current[roomCode]) return;
    const nextOpenedRooms = { ...openedRoomsRef.current, [roomCode]: true };
    openedRoomsRef.current = nextOpenedRooms;
    setOpenedRooms(nextOpenedRooms);
  }, []);

  useEffect(() => {
    pausedRef.current.current = Boolean(dialogue || activeCard);
    pausedRef.current.onEscape = closePanels;
  }, [dialogue, activeCard, closePanels]);

  const handleCanvasFloor = useCallback((nextFloor) => {
    setFloor(nextFloor);
    setNearby(null);
    setDialogue(null);
    setActiveCard(null);
  }, []);

  const floorName = floor === 1 ? "Grand Foyer" : floor === 2 ? "Portrait Wing" : "Midnight Wing";
  const floorMonsters = MONSTERS.filter((monster) => monster.floor === floor);

  return <main className="mansion-app">
    <div className="mansion-ambience" aria-hidden="true"><span /><span /><span /><span /><span /></div>
    <header className="mansion-header">
      <div className="mansion-brand"><div className="brand-mark"><span>H</span><i>✦</i></div><div><p className="mansion-kicker">HAUNTED CORPS · EST. 1897</p><h1>THE HAUNTED <em>MANSION</em></h1><p className="mansion-subtitle">An after-hours tour of our people, rooms, and performance.</p></div></div>
      <div className="house-status"><span className="status-pulse" /><div><small>HOUSE STATUS</small><strong>OPEN AFTER DARK</strong></div><div className="status-divider" /><div><small>YOUR LOCATION</small><strong>FLOOR 0{floor}</strong></div></div>
    </header>

    <section className="mansion-layout">
      <div className="exploration-column">
        <div className="stage-topbar"><div className="stage-location"><span className="location-icon">⌖</span><div><small>YOU ARE EXPLORING</small><strong>{floorName}</strong></div></div><div className="floor-pips" aria-label={`Floor ${floor} of 3`}><span className={floor === 1 ? "active" : ""}>I</span><span className={floor === 2 ? "active" : ""}>II</span><span className={floor === 3 ? "active" : ""}>III</span></div><div className="mini-status"><span className="mini-status-dot" /> LIVE SCENE</div></div>
        <div className="game-frame">
          <MansionCanvas floor={floor} onNearbyChange={setNearby} pausedRef={pausedRef} interactRef={interactRef} onFloorChange={handleCanvasFloor} musicRef={musicRef} openedRoomsRef={openedRoomsRef} openRoomRef={openRoomRef} onRoomOpened={handleRoomOpened} onInteractItem={handleInteractItem} />
          <div className="stage-corner stage-corner-tl" aria-hidden="true" /><div className="stage-corner stage-corner-br" aria-hidden="true" />
          {nearby && !dialogue && !activeCard && <button type="button" className="interaction-prompt" onClick={() => interactRef.current?.()}><span className="prompt-key">E</span><span><strong>{nearby.hint}</strong><small>{nearby.label}</small></span><span className="prompt-arrow">↗</span></button>}
          {dialogue && <InteractionDialogue dialogue={dialogue} onClose={() => setDialogue(null)} onOpenDashboard={() => { setDialogue(null); onOpenDashboard(); }} onViewCard={(monster) => { setDialogue(null); setActiveCard(monster); }} />}
          {activeCard && <EmployeeCardModal monster={activeCard} onClose={() => setActiveCard(null)} />}
        </div>
        <div className="controls-bar"><div className="control-cluster"><span className="keycap">W</span><div className="key-column"><span className="keycap">A</span><span className="keycap">S</span><span className="keycap">D</span></div><span className="control-caption">MOVE</span></div><div className="control-divider" /><div className="control-cluster"><span className="keycap keycap-wide">E</span><span className="control-caption">INTERACT</span></div><div className="control-divider" /><div className="control-cluster"><span className="keycap keycap-wide">ESC</span><span className="control-caption">CLOSE DIALOGUE</span></div><p className="controls-hint">WASD or arrow keys let you roam through each doorway.</p></div>
      </div>

      <aside className="mansion-sidebar">
        <section className="sidebar-card orientation-card"><div className="sidebar-card-heading"><span className="sidebar-icon">✦</span><div><p>FIELD GUIDE</p><h2>Welcome, visitor.</h2></div></div><p className="sidebar-copy">Take your time. The house has three floors, six employees, and a great many stories in its walls.</p><div className="guide-route"><div className={`route-stop ${floor === 1 ? "current" : ""}`}><span className="route-marker">I</span><div><strong>Grand Foyer</strong><small>Reception · Analytics access</small></div><span className="route-state">{floor === 1 ? "YOU ARE HERE" : ""}</span></div><div className={`route-stop ${floor === 2 ? "current" : ""}`}><span className="route-marker">II</span><div><strong>Portrait Wing</strong><small>3 employee rooms</small></div><span className="route-state">{floor === 2 ? "YOU ARE HERE" : ""}</span></div><div className={`route-stop ${floor === 3 ? "current" : ""}`}><span className="route-marker">III</span><div><strong>Midnight Wing</strong><small>3 employee rooms</small></div><span className="route-state">{floor === 3 ? "YOU ARE HERE" : ""}</span></div></div><p className="stairs-note"><span>↑↓</span> Find the grand staircase in the lower-right corner to travel between floors.</p></section>
        <section className="sidebar-card staff-card"><div className="sidebar-card-heading"><span className="sidebar-icon">☠</span><div><p>STAFF ON THIS FLOOR</p><h2>{floor === 1 ? "Visitor Services" : `${floorMonsters.length} resident employees`}</h2></div></div>
          {floor === 1 ? <button type="button" className="staff-entry receptionist-entry" onClick={() => setDialogue({ type: "reception" })}><span className="staff-avatar receptionist-avatar">✦</span><div><strong>The Receptionist</strong><small>Front desk · Visitor Services</small></div><span className="staff-live">ON DUTY</span></button> : <div className="staff-list">{floorMonsters.map((monster) => {
            const doorIsOpen = Boolean(openedRooms[monster.roomCode]);
            return <button type="button" className={`staff-entry${doorIsOpen ? " staff-entry-open" : " staff-entry-closed"}`} key={monster.id} disabled={!doorIsOpen} onClick={() => setDialogue({ type: "monster", monster })}><span className="staff-avatar">{doorIsOpen ? <img src={encodeURI(`${ASSET_ROOT}/${monster.portrait}`)} alt="" /> : <span className="closed-door-mark">?</span>}</span><div><strong>{monster.name}</strong><small>{doorIsOpen ? `${monster.roomCode} · ${monster.title}` : `${monster.roomCode} · Door closed — open it in the room`}</small></div><span className="staff-open">{doorIsOpen ? "↗" : "▣"}</span></button>;
          })}</div>}
          <p className="sidebar-footnote">{floor === 1 ? "Approach the desk and press E to open the house dashboard." : "Approach a resident or select a staff file to read their employee card."}</p>
        </section>
        <div className="sidebar-footer"><span className="footer-seal">HC</span><p>HAUNTED CORPS<br /><small>WE MAKE MEMORIES THAT FOLLOW YOU HOME.</small></p></div>
      </aside>
    </section>
    <footer className="mansion-footer"><span>© HAUNTED CORPS · INTERNAL TOUR EXPERIENCE</span><span><i /> THE HOUSE IS SAFE. PROBABLY.</span><span className="music-note">♫ {musicStatus === "loop-ready" ? "AMBIENT MUSIC SYSTEM READY" : musicStatus}</span></footer>
  </main>;
}

export default HauntedMansion;
