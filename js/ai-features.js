// --- CONFIGURATION ---
// No API Key needed. The "AI" is now local.

// --- 1. THE PROPHECY ENGINE ---
const PROPHECIES = [
    "THE BEAR SLEEPS, BUT THE BULL IS HUNGRY.",
    "LIQUIDITY IS DRYING UP IN THE DARK POOLS.",
    "VOLATILITY SPIKE IMMINENT. PREPARE.",
    "THE ALGORITHM SEES WHAT YOU IGNORE.",
    "SMART MONEY IS MOVING TO SAFE HAVENS.",
    "INSTITUTIONAL ORDER FLOW DETECTED.",
    "THE MARKET WHISPERS OF A CRASH.",
    "DATA CORRELATION: 98%. CONFIDENCE: HIGH.",
    "HEDGE FUNDS ARE TRAPPING THE RETAIL TRADERS.",
    "THE FRACTAL IS COMPLETING."
];

export async function initProphecy() {
    const el = document.getElementById('aiProphecy');
    if (!el) return;

    // Simulate "Thinking" delay
    el.innerText = "ESTABLISHING NEURAL LINK...";

    setTimeout(() => {
        // Pick random prophecy
        const prediction = PROPHECIES[Math.floor(Math.random() * PROPHECIES.length)];

        // Typewriter effect
        el.innerText = "";
        let i = 0;
        const typeInterval = setInterval(() => {
            el.innerText += prediction.charAt(i);
            i++;
            if (i > prediction.length) clearInterval(typeInterval);
        }, 50);
    }, 1500);
}

// --- 2. THE ORACLE CHAT ENGINE ---
// This maps keywords to specific "AI" responses.
const BRAIN = [
    {
        keywords: ["1", "one", "desk", "level 1", "wick"],
        response: "The desk holds the first secret. Focus on the chart. The wicks tell the story of rejection. How many rejected the lows?"
    },
    {
        keywords: ["2", "two", "wall", "level 2", "invisible", "uv"],
        response: "The market hides its tracks. Use the UV light to see where the orders are stacked. Look at the highs and lows of the frames."
    },
    {
        keywords: ["3", "three", "tape", "level 3", "audio", "record"],
        response: "Listen closely to the institutional chatter. They mention an order that hides its true size. 90% below the surface."
    },
    {
        keywords: ["4", "four", "alchemist", "level 4", "telescope", "star"],
        response: "The Alchemist seeks alignment. The parchment holds the order: Fire reveals the name. The Lens reveals the stars. The Angle is 33."
    },
    {
        keywords: ["5", "five", "core", "level 5", "singularity"],
        response: "The Core requires the sum of your knowledge. Gather the four keys from the previous days. Timing is everything on the execution."
    },
    {
        keywords: ["hint", "help", "stuck"],
        response: "I can guide you. Which level are you analyzing? (Level 1-5)"
    },
    {
        keywords: ["hello", "hi", "hey", "sapient"],
        response: "Greetings, Analyst. I am the Sapient Core. My function is to test your edge. Are you ready?"
    },
    {
        keywords: ["code", "answer", "password"],
        response: "I cannot provide the Alpha directly. That would violate the assessment protocol. Use your edge."
    }
];

const DEFAULT_RESPONSES = [
    "DATA INSUFFICIENT. PLEASE REPHRASE.",
    "MARKET NOISE DETECTED. BE MORE SPECIFIC.",
    "FOCUS ON THE CHARTS, ANALYST.",
    "THE ANSWER LIES IN THE PRICE ACTION."
];

export async function askOracle(userQuery) {
    // 1. Clean the input
    const text = userQuery.toLowerCase();

    // 2. Simulate Network Delay (Authenticity)
    return new Promise(resolve => {
        setTimeout(() => {
            // 3. Search the "Brain"
            let answer = null;

            for (const entry of BRAIN) {
                // If the user's text contains ANY of the keywords
                if (entry.keywords.some(keyword => text.includes(keyword))) {
                    answer = entry.response;
                    break;
                }
            }

            // 4. Fallback if no keywords matched
            if (!answer) {
                answer = DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
            }

            resolve(answer);
        }, 1500); // 1.5s delay makes it feel like it's "thinking"
    });
}