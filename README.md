# API TheMealDB

API Node.js / Express qui récupère les recettes de [TheMealDB](https://www.themealdb.com/api.php), les nettoie (champs en français, ingrédients regroupés dans un tableau, champs vides supprimés), permet de les filtrer et calcule des statistiques.

Projet Node.js - API, IIM A2 Bachelor.

## Lancer le projet

Node.js 20 minimum.

```bash
git clone <lien-du-repo>
cd api-themealdb
npm install
npm run dev
```

L'API tourne sur http://localhost:3000

Le premier appel à `/api/recettes`, `/api/stats` ou `/api/categories` met quelques secondes : l'API charge toutes les recettes (une requête par lettre de l'alphabet). Elles sont ensuite gardées en cache.

## Routes

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/recettes` | Liste des recettes nettoyées |
| GET | `/api/recettes/:id` | Une recette (404 si l'id n'existe pas) |
| GET | `/api/recettes/hasard` | Une recette au hasard |
| GET | `/api/categories` | Nombre de recettes par catégorie, trié |
| GET | `/api/stats` | Statistiques calculées sur toutes les recettes |

### Filtres sur `/api/recettes`

Combinables avec `&`, sans tenir compte des majuscules.

| Filtre | Exemple | Garde |
|---|---|---|
| `categorie` | `?categorie=Chicken` | les recettes de cette catégorie |
| `pays` | `?pays=Japanese` | les recettes de ce pays |
| `nom` | `?nom=curry` | les recettes dont le nom contient le texte |
| `ingredient` | `?ingredient=garlic` | les recettes qui contiennent cet ingrédient |

### Exemples

- http://localhost:3000/api/recettes?categorie=Dessert&pays=British
- http://localhost:3000/api/recettes?ingredient=chicken
- http://localhost:3000/api/recettes/52772
- http://localhost:3000/api/recettes/1 (404)
- http://localhost:3000/api/recettes/hasard
- http://localhost:3000/api/categories
- http://localhost:3000/api/stats

## Format d'une recette

TheMealDB donne les ingrédients dans 40 champs (`strIngredient1` à `strIngredient20` et `strMeasure1` à `strMeasure20`), souvent vides. L'API renvoie :

```json
{
  "id": "52772",
  "nom": "Teriyaki Chicken Casserole",
  "categorie": "Chicken",
  "pays": "Japanese",
  "image": "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  "ingredients": [
    { "nom": "soy sauce", "quantite": "3/4 cup" },
    { "nom": "water", "quantite": "1/2 cup" }
  ],
  "nbIngredients": 9
}
```

Les recettes sans pays ou sans catégorie ont la valeur `Inconnu` / `Inconnue`.

## Statistiques (`/api/stats`)

- `totalRecettes`, `nbCategories`, `nbPays`
- `categorieLaPlusFrequente`, `paysLePlusFrequent` (sans compter `Inconnu`)
- `moyenneIngredientsParRecette`
- `recetteAvecLePlusDIngredients`
- `parCategorie`, `parPays`

## Arborescence

```
api-themealdb/
├── server.js
├── package.json
└── src/
    ├── app.js
    ├── routes/
    │   ├── recettes.routes.js
    │   ├── categories.routes.js
    │   └── stats.routes.js
    ├── services/
    │   └── themealdb.service.js
    └── utils/
        └── compter.js
```

## Erreurs

- id inconnu : 404 `{ "erreur": "Recette introuvable : ..." }`
- route inconnue : 404 `{ "erreur": "Route inconnue : ..." }`
- erreur du serveur ou de TheMealDB : 500 `{ "erreur": "Erreur du serveur" }`
- si TheMealDB répond 429 (trop de requêtes), le service attend puis réessaie, 5 fois maximum
