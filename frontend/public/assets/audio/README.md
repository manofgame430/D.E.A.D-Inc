# Haunted Corps music drops

No music is included yet. Add looping `.ogg` or `.mp3` files at these locations and replace the matching `null` entries in `src/components/HauntedMansion.jsx`'s `MUSIC_TRACKS` object with the matching URL paths.

- `mansion-theme-loop.ogg` — global loop for the foyer and all corridors (`/assets/audio/mansion-theme-loop.ogg`).
- `rooms/butcher-loop.ogg` — Floor II, room 2A, The Butcher's Pantry (`/assets/audio/rooms/butcher-loop.ogg`).
- `rooms/creepy-clown-loop.ogg` — Floor II, room 2B, The Funhouse (`/assets/audio/rooms/creepy-clown-loop.ogg`).
- `rooms/flesh-mass-loop.ogg` — Floor II, room 2C, The Containment Room (`/assets/audio/rooms/flesh-mass-loop.ogg`).
- `rooms/haunted-doll-loop.ogg` — Floor III, room 3A, The Doll Parlour (`/assets/audio/rooms/haunted-doll-loop.ogg`).
- `rooms/haunted-mascot-loop.ogg` — Floor III, room 3B, The Mascot Lounge (`/assets/audio/rooms/haunted-mascot-loop.ogg`).
- `rooms/tall-stranger-loop.ogg` — Floor III, room 3C, The Long Gallery (`/assets/audio/rooms/tall-stranger-loop.ogg`).

Playback starts after the first keyboard or mouse gesture to satisfy browser autoplay policies. Each selected track loops automatically; the mansion theme is used whenever a specific room track has not been added.
