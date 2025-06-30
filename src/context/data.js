import hero1 from "/assets/hero-1.png";
import hero2 from "/assets/hero-2.png";

import enemy1 from "/assets/enemy-1.png";
import enemy2 from "/assets/enemy-2.png";
import enemy3 from "/assets/enemy-3.png";
import enemy4 from "/assets/enemy-4.png";
import enemy5 from "/assets/enemy-5.png";

export const characters = [
    {
        name: "WEST",
        role: "Tech Hacker",
        description: "Disrupts enemy systems using high-tech gear. Silent but lethal.",
        image: enemy1,
    },
    {
        name: "CUPSEY",
        role: "Sniper Scout",
        description: "Quick-footed and sharp-eyed, takes down enemies from a distance.",
        image: enemy2,
    },
    {
        name: "GAKE",
        role: "Brute Tank",
        description: "Heavyweight defender, absorbs damage like a beast.",
        image: enemy3,
    },
    {
        name: "FIZZY",
        role: "Explosive Bomber",
        description: "Lays traps and grenades across the battlefield.",
        image: enemy4,
    },
    {
        name: "CRABBY",
        role: "Beach Ambusher",
        description: "Burrows under the sand and attacks unsuspecting players.",
        image: enemy5,
    },
];

export const heros = [
    {
        name: "CASINO",
        role: "Main Fighter",
        description: "Leader of the resistance, brave and balanced in all aspects.",
        image: hero1,
        id: "player1"
    },
    {
        name: "RINA",
        role: "Agile Warrior",
        description: "Swift and tactical, masters close combat on the pixel shores.",
        image: hero2,
        id: "player2"
    },
];
