/* Acceso a «Simuladores Psiquiatría».
   El contenido (bancos, lecturas) va cifrado con AES-GCM; la llave sale del correo y la contraseña
   (PBKDF2-SHA256). Sin las credenciales correctas los .enc no se pueden leer.
   SALT y CHK los escribe ~/Documents/Profesor/Banco PUEM/simulador/cifrar.py — no editarlos a mano. */
(() => {
const SALT = "KZZKnBOjyr6SdFEAocwm8A==";
const CHK = "A3vRniliRdmtC3qClSIPw5f24fX6vzTCRiV44zdNY9PFON8xISI=";
const ITER = 310000, KEY = "simpsiq_llave_v1";
const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const u64 = a => btoa(String.fromCharCode(...new Uint8Array(a)));
const te = new TextEncoder(), td = new TextDecoder();
let keyP = null;

async function derive(user, pass) {
  const base = await crypto.subtle.importKey("raw", te.encode(user.trim().toLowerCase() + "\n" + pass), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: b64(SALT), iterations: ITER }, base, 256);
  return bits;
}
const imp = raw => crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);
async function dec(key, buf) {
  const a = new Uint8Array(buf);
  return crypto.subtle.decrypt({ name: "AES-GCM", iv: a.slice(0, 12) }, key, a.slice(12));
}
async function ok(key) { try { return td.decode(await dec(key, b64(CHK))) === "simpsiq-ok"; } catch (e) { return false; } }

function css() {
  const s = document.createElement("style");
  s.textContent = `#acc{position:fixed;inset:0;z-index:100;background:var(--bg,#faf9f7);display:grid;place-items:center;padding:24px 16px;overflow:auto}
#acc{background:radial-gradient(40vmax 40vmax at 10% 0%,color-mix(in srgb,var(--acc,#6d2233) 26%,transparent),transparent 70%),radial-gradient(40vmax 40vmax at 90% 100%,color-mix(in srgb,#34c759 12%,transparent),transparent 70%),var(--bg,#faf9f7)!important}
#acc form{width:100%;max-width:380px;background:color-mix(in srgb,var(--card,#fff) 66%,transparent);-webkit-backdrop-filter:saturate(180%) blur(22px);backdrop-filter:saturate(180%) blur(22px);border:1px solid color-mix(in srgb,var(--fg,#1d1b19) 9%,transparent);border-radius:26px;padding:26px 22px;box-shadow:0 24px 60px rgba(20,10,15,.14),inset 0 1px 0 rgba(255,255,255,.55)}
#acc .lg{font-size:30px;color:var(--acc,#6d2233);font-weight:700;line-height:1}
#acc h1{font-size:22px;margin:10px 0 4px;letter-spacing:-.01em}
#acc p{color:var(--mut,#6b655e);font-size:14px;margin:0 0 16px}
#acc label{display:block;font-size:13.5px;font-weight:600;margin:12px 0 4px}
#acc input{width:100%;font:inherit;font-size:16px;padding:12px 14px;border:1px solid var(--line,#e4e0da);border-radius:14px;background:var(--bg,#faf9f7);color:var(--fg,#1d1b19)}
#acc input:focus{outline:2px solid var(--acc,#6d2233);outline-offset:1px}
#acc button{width:100%;margin-top:18px;font:inherit;font-weight:600;border:0;border-radius:14px;padding:12px 20px;min-height:48px;cursor:pointer;background:linear-gradient(180deg,color-mix(in srgb,var(--acc,#6d2233) 90%,#fff 10%),var(--acc,#6d2233));color:#fff;box-shadow:0 8px 20px color-mix(in srgb,var(--acc,#6d2233) 30%,transparent),inset 0 1px 0 rgba(255,255,255,.25);transition:transform .34s cubic-bezier(.34,1.56,.64,1)}
#acc button:active{transform:scale(1.04)}
#acc button:disabled{opacity:.6}
#acc .er{color:var(--bad,#b3261e);font-size:14px;margin:12px 0 0;min-height:1.2em}
@media (prefers-color-scheme:dark){#acc{background:var(--bg,#131211)}#acc form{background:var(--card,#1c1a19);border-color:var(--line,#2f2c29);box-shadow:none}#acc input{background:var(--bg,#131211);color:var(--fg,#f2efea);border-color:var(--line,#2f2c29)}#acc h1{color:var(--fg,#f2efea)}#acc button{color:#1a1110}}`;
  document.head.appendChild(s);
}

function gate() {
  return new Promise(res => {
    css();
    const w = document.createElement("div"); w.id = "acc";
    w.innerHTML = `<form autocomplete="on"><div class="lg">Ψ</div><h1>Simuladores Psiquiatría</h1>
<p>Material de estudio para la residencia de Psiquiatría.</p>
<label for="accU">Correo</label><input id="accU" type="email" name="username" autocomplete="username" required>
<label for="accP">Contraseña</label><input id="accP" type="password" name="password" autocomplete="current-password" required>
<button type="submit">Entrar</button><div class="er" id="accE" role="alert"></div></form>`;
    document.body.appendChild(w);
    document.documentElement.style.overflow = "hidden";
    const f = w.querySelector("form"), btn = w.querySelector("button"), er = w.querySelector("#accE");
    w.querySelector("#accU").focus();
    f.onsubmit = async e => {
      e.preventDefault(); btn.disabled = true; btn.textContent = "Verificando…"; er.textContent = "";
      try {
        const raw = await derive(w.querySelector("#accU").value, w.querySelector("#accP").value);
        const key = await imp(raw);
        if (await ok(key)) {
          try { localStorage.setItem(KEY, u64(raw)); } catch (e) {}
          w.remove(); document.documentElement.style.overflow = ""; res(key); return;
        }
        er.textContent = "Correo o contraseña incorrectos.";
      } catch (e) { er.textContent = "No se pudo verificar. Intenta de nuevo."; }
      btn.disabled = false; btn.textContent = "Entrar";
    };
  });
}

async function getKey() {
  try {
    const s = localStorage.getItem(KEY);
    if (s) { const k = await imp(b64(s)); if (await ok(k)) return k; localStorage.removeItem(KEY); }
  } catch (e) {}
  if (document.readyState === "loading") await new Promise(r => document.addEventListener("DOMContentLoaded", r, { once: true }));
  return gate();
}

window.ACCESO = {
  ready: () => keyP || (keyP = getKey()),
  async json(url) {
    const key = await this.ready();
    const r = await fetch(url, { cache: "no-cache" });
    if (!r.ok) throw new Error("http " + r.status);
    let raw = new Uint8Array(await dec(key, await r.arrayBuffer()));
    if (raw[0] === 0x1f && raw[1] === 0x8b) raw = new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer()); // comprimido antes de cifrar
    return JSON.parse(td.decode(raw));
  },
  salir() { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); }
};
// las páginas sin contenido cifrado (índice, exámenes) solo piden el acceso
if (document.currentScript && document.currentScript.dataset.gate !== undefined) window.ACCESO.ready();
})();
