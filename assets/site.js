// ============================================================
// CONFIGURATION : collez ici les liens de vos produits Payhip/Gumroad
// ============================================================
const PRODUCTS = {
  budget:  { url: "https://payhip.com/BudgetMalinShop",  price: "4,90 €" },
  zakat:   { url: "https://payhip.com/VOTRE-LIEN-ZAKAT",   price: "5,90 €" },
  ramadan: { url: "https://payhip.com/VOTRE-LIEN-RAMADAN", price: "3,90 €" },
  defi52:  { url: "https://payhip.com/BudgetMalinShop",  price: "2,90 €" },
  dettes:  { url: "https://payhip.com/BudgetMalinShop",  price: "4,90 €" },
  pack:    { url: "https://payhip.com/BudgetMalinShop",    price: "9,90 €" },
  budget_en: { url: "https://payhip.com/BudgetMalinShop", price: "€4.90" },
  defi52_en: { url: "https://payhip.com/BudgetMalinShop", price: "€2.90" },
  dettes_en: { url: "https://payhip.com/BudgetMalinShop",   price: "€4.90" },
  pack_en:   { url: "https://payhip.com/BudgetMalinShop", price: "€9.90" },
  // Produits en anglais
  zakat_en:   { url: "https://payhip.com/YOUR-LINK-ZAKAT-EN",   price: "€6.90" },
  ramadan_en: { url: "https://payhip.com/YOUR-LINK-RAMADAN-EN", price: "€4.90" },
};
// ============================================================

// Tant qu'un lien est provisoire, son bloc d'achat reste masqué
const pret = p => p && !/VOTRE-LIEN|YOUR-LINK/.test(p.url);
document.querySelectorAll(".cta-produit").forEach(a => {
  const p = PRODUCTS[a.dataset.product || "budget"];
  if (!pret(p)) { const bloc = a.closest(".cta, .prod"); if (bloc) bloc.style.display = "none"; return; }
  a.href = p.url; a.target = "_blank"; a.rel = "noopener";
});
// Vitrine : masquée tant qu'aucun produit n'est en vente (ainsi que les liens qui y mènent)
document.querySelectorAll(".section.produits").forEach(s => {
  if ([...s.querySelectorAll(".prod")].every(x => x.style.display === "none")) {
    s.style.display = "none";
    document.querySelectorAll(".lien-produits").forEach(l => { l.style.display = "none"; });
  }
});
document.querySelectorAll(".prix-produit").forEach(e => { const p = PRODUCTS[e.dataset.product || "budget"]; if (p) e.textContent = p.price; });

const eur = (n, d = 0) => (isFinite(n) ? n : 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: d, minimumFractionDigits: d });
const num = id => parseFloat(String(document.getElementById(id).value).replace(",", ".")) || 0;
function bindAll(fn) { document.querySelectorAll("input,select").forEach(el => el.addEventListener("input", fn)); fn(); }

// Formatage multi-devises pour les pages en anglais
const money = (n, cur, d = 2) => { try { return (isFinite(n) ? n : 0).toLocaleString("en-US", { style: "currency", currency: cur, maximumFractionDigits: d, minimumFractionDigits: d }); } catch (e) { return (n || 0).toFixed(d) + " " + cur; } };

// Cours de l'or et de l'argent, mis à jour chaque jour par une tâche automatique GitHub (fichier prix.json)
const COURS_URLS = [
  "https://raw.githubusercontent.com/flexbhk/budgetmalin/main/prix.json",
  "/budgetmalin/prix.json",
];
async function chargerCours() {
  for (const u of COURS_URLS) {
    try {
      const r = await fetch(u, { cache: "no-store" });
      if (!r.ok) continue;
      const j = await r.json();
      if (j.or_usd_g > 0 && j.argent_usd_g > 0 && j.taux && j.date) return j;
    } catch (e) { /* source suivante */ }
  }
  return null;
}
function brancherCours(calc, langue) {
  const or = document.getElementById("or"), ag = document.getElementById("ag"), note = document.getElementById("cours-note");
  const cur = document.getElementById("cur");
  if (!or || !ag) return;
  let manuel = false;
  [or, ag].forEach(e => e.addEventListener("input", () => { manuel = true; }));
  chargerCours().then(j => {
    if (!j) return;
    const appliquer = () => {
      const t = j.taux[cur ? cur.value : "EUR"];
      if (manuel || !t) return;
      or.value = (j.or_usd_g * t).toFixed(2);
      ag.value = (j.argent_usd_g * t).toFixed(2);
      calc();
    };
    appliquer();
    if (cur) cur.addEventListener("input", appliquer);
    const d = new Date(j.date + "T12:00:00Z").toLocaleDateString(langue === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
    if (note) note.textContent = langue === "fr"
      ? `✅ Cours du ${d}, mis à jour automatiquement chaque jour. Vous pouvez les modifier.`
      : `✅ Prices as of ${d}, updated automatically every day. You can edit them.`;
  });
}
