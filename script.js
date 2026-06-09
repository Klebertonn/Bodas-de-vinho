const envelope = document.getElementById("envelope");
const envImg = document.getElementById("envImg");
const letter = document.getElementById("letter");
const bg = document.getElementById("bg");
const form = document.getElementById("rsvpForm");

let opened = false;

/* =========================
   CHECAGEM SEGURA GSAP
========================= */
if (typeof gsap === "undefined") {
  console.error("GSAP não carregado");
}

/* =========================
   TIMELINE CINEMATOGRÁFICA 3D
========================= */
const tl = gsap.timeline({ paused: true });

tl.to(envelope, {
  duration: 0.6,
  scale: 1.05,
  rotateX: 12,
  rotateY: -6,
  ease: "power2.out"
})

.to(envelope, {
  duration: 0.8,
  rotateX: 45,
  transformOrigin: "center bottom",
  ease: "power3.inOut"
})

.to(envelope, {
  opacity: 0.4,
  z: -120,
  duration: 0.7,
  ease: "power2.inOut"
})

.to(bg, {
  scale: 1.08,
  duration: 1.2,
  ease: "power2.out"
}, "-=0.5")

.fromTo(letter,
  {
    opacity: 0,
    y: 120,
    z: -200,
    rotateX: -18,
    scale: 0.85,
    filter: "blur(12px)"
  },
  {
    opacity: 1,
    y: 0,
    z: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
    duration: 1.4,
    ease: "power3.out"
  }
);

/* =========================
   ABERTURA DO CONVITE
========================= */
envelope.addEventListener("pointerdown", () => {
  if (opened) return;
  opened = true;

  envImg.src = "envelope_abrindo_2.png";

  requestAnimationFrame(() => {
    setTimeout(() => {
      envImg.src = "envelope_abrindo_3.png";
      envelope.style.filter = "blur(1px)";
      tl.play();
    }, 250);
  });
});

/* =========================
   GOOGLE FORMS RSVP
========================= */

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdsShZoxqStxEzXAa3bEtxuH2qkLXRBXDL6T5KLRUYPa0Wucg/formResponse";

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const telefone = form.telefone.value.trim();
    const quantidade = form.quantidade.value;

    /* validação simples */
    if (!nome || !telefone || !quantidade) {
      alert("Preencha todos os campos");
      return;
    }

    const btn = form.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Enviando...";

    const data = new FormData();

    data.append("entry.2005620554", nome);
    data.append("entry.1166974658", telefone);
    data.append("entry.839337160", quantidade);

    try {
      await fetch(FORM_URL, {
        method: "POST",
        mode: "no-cors",
        body: data
      });

      form.innerHTML = "<h3>🎉 Presença confirmada!</h3>";

    } catch (err) {
      console.error(err);
      alert("Erro ao enviar");

      btn.disabled = false;
      btn.textContent = "Confirmar presença";
    }
  });
}