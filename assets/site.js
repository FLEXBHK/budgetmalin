// ============================================================
// CONFIGURATION : collez ici les liens de vos produits Payhip/Gumroad
// ============================================================
const PRODUCTS = {
  budget:  { url: "https://payhip.com/VOTRE-LIEN-BUDGET",  price: "4,90 €" },
  zakat:   { url: "https://payhip.com/VOTRE-LIEN-ZAKAT",   price: "5,90 €" },
  ramadan: { url: "https://payhip.com/VOTRE-LIEN-RAMADAN", price: "3,90 €" },
  defi52:  { url: "https://payhip.com/VOTRE-LIEN-DEFI52",  price: "2,90 €" },
  dettes:  { url: "https://payhip.com/VOTRE-LIEN-DETTES",  price: "4,90 €" },
  pack:    { url: "https://payhip.com/VOTRE-LIEN-PACK",    price: "9,90 €" },
  // Produits en anglais
  zakat_en:   { url: "https://payhip.com/YOUR-LINK-ZAKAT-EN",   price: "$6.90" },
  ramadan_en: { url: "https://payhip.com/YOUR-LINK-RAMADAN-EN", price: "$4.90" },
};
// ============================================================

// Tant qu'un lien est provisoire, son bloc d'achat reste masqué
const pret = p => p && !/VOTRE-LIEN|YOUR-LINK/.test(p.url);
document.querySelectorAll(".cta-produit").forEach(a => {
  const p = PRODUCTS[a.dataset.product || "budget"];
  if (!pret(p)) { const bloc = a.closest(".cta"); if (bloc) bloc.style.display = "none"; return; }
  a.href = p.url; a.target = "_blank"; a.rel = "noopener";
});
document.querySelectorAll(".prix-produit").forEach(e => { e.textContent = PRODUCTS[e.dataset.product || "budget"].price; });

const eur = (n, d = 0) => (isFinite(n) ? n : 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: d, minimumFractionDigits: d });
const num = id => parseFloat(String(document.getElementById(id).value).replace(",", ".")) || 0;
function bindAll(fn) { document.querySelectorAll("input,select").forEach(el => el.addEventListener("input", fn)); fn(); }

// Formatage multi-devises pour les pages en anglais
const money = (n, cur, d = 2) => { try { return (isFinite(n) ? n : 0).toLocaleString("en-US", { style: "currency", currency: cur, maximumFractionDigits: d, minimumFractionDigits: d }); } catch (e) { return (n || 0).toFixed(d) + " " + cur; } };
