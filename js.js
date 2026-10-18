let previousIndiceCount = null;
const soundNewIndice = new Audio('Changement.mp3');

function OnclickIndice(indice, event) {
    if (event.target.closest("video, audio, button, a")) {
        return;
    }

    const detail = indice.querySelector(".indice-detail");
    if (!detail) return;

    const isClosing = !detail.classList.contains("hidden");
    detail.classList.toggle("hidden");

    if (isClosing) {
        detail.querySelectorAll("video, audio").forEach((media) => media.pause());
    }
}
// Fonction pour activer le mode développeur à retirer plus tard
function devmode() {
    const devModeSection = document.getElementById("dev-mode");
    if (devModeSection) {
        devModeSection.classList.remove("hidden");
    }
}

const konamiCode = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a"
];
let konamiProgress = 0;

document.addEventListener("keydown", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

    if (key === konamiCode[konamiProgress]) {
        konamiProgress++;
        if (konamiProgress === konamiCode.length) {
            konamiProgress = 0;
            devmode();
        }
    } else {
        konamiProgress = key === konamiCode[0] ? 1 : 0;
    }
});
//Fin de la fonction à retirer plus tard
async function checkHeartState() {
    try {
        const res = await fetch("state.json?t=" + Date.now());
        if (!res.ok) throw new Error("Fichier introuvable, statut " + res.status);

        const data = await res.json();
        console.log("Données reçues du JSON :", data);

        // 1. Gestion des Vies
        const activeHearts = document.querySelectorAll(".heart-life");
        if (data.Life !== undefined && activeHearts.length > data.Life) {
            const heartsToRemove = activeHearts.length - data.Life;

            for (let i = 0; i < heartsToRemove; i++) {
                const currentActiveHearts = document.querySelectorAll(".heart-life");
                const lastHeart = currentActiveHearts[currentActiveHearts.length - 1];
                
                if (lastHeart) {
                    lastHeart.classList.remove("heart-life");
                    lastHeart.classList.add("heart-death");
                }
            }
        }

        // 2. Gestion des Indices
        if (data.Indice !== undefined) {

            const allIndices = document.querySelectorAll(".indice");

            allIndices.forEach((indiceElement, index) => {
                if (index < data.Indice) {
                    indiceElement.classList.remove("hidden");
                } else {
                    indiceElement.classList.add("hidden");
                }
            });
        }

    } catch (error) {
        console.error("Erreur :", error);
    }
}

async function On() {
    const main = document.querySelector(".main");
    const on = document.querySelector(".on");

    if (on) on.classList.remove("hidden");

    setTimeout(() => {
        if (main && on) {
            on.classList.add("hidden");
            main.classList.remove("hidden");
            detectchangementIndice();
        }
    }, 2000);

    checkHeartState();
    setInterval(checkHeartState, 2000);
}

const SECRET = "SG9tZXI=";

function verifier() {
    var Login = recupererCookie('Login');
    const input = document.getElementById("mdp").value;
    const on = document.querySelector(".on");
    const mdp = document.querySelector(".mdp");

    if(Login=='True'){
        on.classList.remove("hidden");
        mdp.classList.add("hidden");
        On();
        Troll();
    } else {    
        if (btoa(input) === SECRET) {
            on.classList.remove("hidden");
            mdp.classList.add("hidden");
            creerCookie ('Login', 'True', 1);
            On();
        } 
    }
}

function resetAll() {
    creerCookie ('Login', 'False', 1);
    creerCookie ('Indice_dernierco', '0', 1);
    document.location.reload();
}


function creerCookie(nom, contenu, jours) {
    var e = null;
    var date = new Date ();
    date. setTime (date.getTime() + (jours * 24 * 60 * 60 * 1000));
    e = "; expires=" + date. toGMTString();
    document. cookie = nom + "=" + contenu + e + "; path=/";
}

function recupererCookie (nom) {
    nom = nom + "=";
    var liste = document. cookie. split (';');
    for (var i = 0; i < liste.length; i++) {
        var c = liste[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nom) == 0) return c.substring(nom.length, c.length);
    }
    return null;
}

window.addEventListener('DOMContentLoaded', () => {
            if (recupererCookie('Login') === 'True') {
                verifier();
            }
        });

async function detectchangementIndice(){
    const music = new Audio('Changement.mp3');

    const res = await fetch("state.json?t=" + Date.now());
    if (!res.ok) throw new Error("Fichier introuvable, statut " + res.status);

    const data = await res.json();
    var LostIndice = recupererCookie('Indice_dernierco');
    let audioUnlocked = false;

    if(LostIndice!=data.Indice){
        if (!audioUnlocked) {
            music.play();
            soundNewIndice.currentTime = 0;
            audioUnlocked = true;
            document.removeEventListener('click', detectchangementIndice);
            document.removeEventListener('keydown', detectchangementIndice);
            creerCookie ('Indice_dernierco', data.Indice, 1);
        }
    } 
}
function Troll(){
    let Random_meme=Math.floor(Math.random()*10000)
    console.log("Numéro alératoire choisi :", Random_meme);

    if(Random_meme==9999){
        document.location.href="Nyan.mp4"; 
    }
    if(Random_meme==5000){
        document.location.href="Rick.mp4"; 
    }
    if(Random_meme==1){
        document.location.href="Keyboard.mp4";
    }
}
document.addEventListener('click', detectchangementIndice);
document.addEventListener('keydown', detectchangementIndice);