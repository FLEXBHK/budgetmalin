"""Récupère le cours de l'or et de l'argent (USD/once) et les taux de change,
puis écrit prix.json (prix au gramme en USD + taux USD -> devise).
Sources gratuites, sans clé : api.gold-api.com et open.er-api.com.
En cas de données manquantes ou incohérentes, le script échoue sans toucher prix.json.
"""
import datetime, json, sys, urllib.request

ONCE = 31.1034768  # grammes dans une once troy
DEVISES = ["USD", "EUR", "GBP", "CAD", "AUD", "MYR", "SGD", "AED", "SAR", "PKR", "INR", "ZAR"]


def lire(url):
    req = urllib.request.Request(url, headers={"User-Agent": "barakah-budget-cours/1.0", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def prix_metal(symbole):
    data = lire(f"https://api.gold-api.com/price/{symbole}")
    prix = data.get("price")
    if not isinstance(prix, (int, float)) or prix <= 0:
        sys.exit(f"Réponse inattendue pour {symbole} : {data}")
    return prix / ONCE


def main():
    or_g, argent_g = prix_metal("XAU"), prix_metal("XAG")
    if not (20 < or_g < 1000):
        sys.exit(f"Cours de l'or incohérent : {or_g:.2f} USD/g")
    if not (0.1 < argent_g < 50):
        sys.exit(f"Cours de l'argent incohérent : {argent_g:.2f} USD/g")
    fx = lire("https://open.er-api.com/v6/latest/USD")
    if fx.get("result") != "success":
        sys.exit(f"Taux de change indisponibles : {fx.get('result')}")
    manquantes = [d for d in DEVISES if d not in fx.get("rates", {})]
    if manquantes:
        sys.exit(f"Devises manquantes : {manquantes}")
    sortie = {
        "date": datetime.datetime.now(datetime.timezone.utc).date().isoformat(),
        "or_usd_g": round(or_g, 4),
        "argent_usd_g": round(argent_g, 4),
        "taux": {d: fx["rates"][d] for d in DEVISES},
        "sources": ["api.gold-api.com", "open.er-api.com"],
    }
    with open("prix.json", "w", encoding="utf-8") as f:
        json.dump(sortie, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"Or : {or_g:.2f} USD/g ({or_g * sortie['taux']['EUR']:.2f} EUR/g) — "
          f"Argent : {argent_g:.3f} USD/g ({argent_g * sortie['taux']['EUR']:.3f} EUR/g)")


if __name__ == "__main__":
    main()
