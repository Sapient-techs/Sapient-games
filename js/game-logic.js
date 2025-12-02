// USE CDN IMPORTS FOR BROWSER (NO BUILD STEP REQUIRED)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, setDoc, runTransaction, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";

// --- YOUR CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyD64Sh7TsMuSwCEGqjYmjaXDaYMlQbVI9s",
    authDomain: "sapient-games.firebaseapp.com",
    projectId: "sapient-games",
    storageBucket: "sapient-games.firebasestorage.app",
    messagingSenderId: "927823217864",
    appId: "1:927823217864:web:bc4959cf319c1792dc91fd",
    measurementId: "G-X97KG9XK2G"
};

// Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Unique ID for this specific event run
const appId = 'sapient-global-hunt-v1';

// --- GAME SETTINGS ---
// Set the start date to when you want the 48h to begin (e.g., this Friday)
// Currently set to: Friday, Dec 6, 2024, 12:00 PM UTC
const START_DATE = new Date("2024-12-06T12:00:00Z").getTime();
const HUNT_DURATION_MS = 48 * 60 * 60 * 1000; // 48 Hours
const END_DATE = START_DATE + HUNT_DURATION_MS;

// SHARED STATE
let globalState = {
    active: true,
    winner: null
};

// --- INITIALIZATION ---
async function initGame() {
    try {
        await signInAnonymously(auth);

        // Listen for Global Game State in Firestore
        // Path: artifacts -> sapient-global-hunt-v1 -> public -> data -> gameState
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'gameState');

        onSnapshot(docRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                globalState.winner = data.winner;
                checkGlobalStatus();
            } else {
                // First run: Create the document if it doesn't exist
                console.log("Initializing Game State...");
                setDoc(docRef, { winner: null, startTime: START_DATE });
            }
        });

        // Start Local Timer for UI
        setInterval(updateGlobalTimer, 1000);
    } catch (e) {
        console.error("Firebase Init Error:", e);
    }
}

function updateGlobalTimer() {
    const now = Date.now();
    const timeLeft = END_DATE - now;

    const timerDisplay = document.getElementById('globalTimer');
    if (timerDisplay) {
        if (timeLeft <= 0) {
            timerDisplay.innerText = "HUNT EXPIRED";
            timerDisplay.style.color = "red";
            disableGame("TIME_UP");
        } else {
            // Format: HH:MM:SS
            const h = Math.floor(timeLeft / (1000 * 60 * 60));
            const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((timeLeft % (1000 * 60)) / 1000);
            timerDisplay.innerText = `${h}h ${m}m ${s}s`;
        }
    }
}

function checkGlobalStatus() {
    // If a winner exists in DB, stop the game for everyone else
    if (globalState.winner) {
        disableGame("WINNER_DECLARED");
    }
}

function disableGame(reason) {
    // Only redirect if not already on the end screens
    if (!window.location.href.includes("game-over.html") && !window.location.href.includes("reward.html")) {
        const msg = reason === "WINNER_DECLARED" ? "GAME OVER: The Treasure has been claimed." : "GAME OVER: Time Expired.";
        // We just log/alert for now, you can create a dedicated game-over.html later
        console.log(msg);
        // alert(msg); // Optional: Uncomment to force alert
    }
}

// --- LEVEL GATING (Security) ---
export function checkGate(requiredCode) {
    const entered = prompt(`ENTER PREVIOUS LEVEL CODE TO ACCESS:`);
    if (!entered || entered.toUpperCase().trim() !== requiredCode) {
        alert("ACCESS DENIED.");
        window.location.href = "index.html";
        return false;
    }
    return true;
}

// --- WINNER LOGIC (Reward Page) ---
export async function claimPrize(prizeName, winningCode) {
    if (!auth.currentUser) return { success: false, msg: "Auth Error" };
    const userId = auth.currentUser.uid;
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'gameState');

    try {
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(docRef);
            if (!sfDoc.exists()) throw "Document does not exist!";

            const data = sfDoc.data();
            if (data.winner) {
                throw "ALREADY_WON";
            }

            // Write Winner to DB
            transaction.update(docRef, {
                winner: { id: userId, prize: prizeName, code: winningCode, time: Date.now() }
            });
        });
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, msg: e === "ALREADY_WON" ? "Too late! Prize claimed." : "Transaction Error." };
    }
}

// Start immediately
initGame();