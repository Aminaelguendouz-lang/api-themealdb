// Seul fichier qui connait TheMealDB

const BASE = 'https://www.themealdb.com/api/json/v1/1'

let cache = null

function nettoyer (meal) {
    const ingredients = []

    // les ingredients sont dans strIngredient1 ... strIngredient20, souvent vides
    for (let i = 1; i <= 20; i++) {
        const nom = meal['strIngredient' + i]
        const quantite = meal['strMeasure' + i]

        if (nom && nom.trim() !== '') {
            ingredients.push({
                nom: nom.trim(),
                quantite: quantite ? quantite.trim() : ''
            })
        }
    }

    return {
        id: meal.idMeal,
        nom: meal.strMeal,
        // certaines recettes n'ont pas de pays
        categorie: meal.strCategory || 'Inconnue',
        pays: meal.strArea || 'Inconnu',
        image: meal.strMealThumb,
        ingredients: ingredients,
        nbIngredients: ingredients.length
    }
}

async function chercher (url) {
    for (let essai = 1; essai <= 5; essai++) {
        const response = await fetch(url)

        if (response.ok) {
            return response.json()
        }

        if (response.status !== 429) {
            throw new Error('Reponse ' + response.status + ' sur ' + url)
        }

        // 429 : trop de requetes, on attend avant de reessayer
        const attente = Number(response.headers.get('retry-after')) || essai * 2
        console.log('429 sur ' + url + ', on attend ' + attente + ' s')
        await new Promise((r) => setTimeout(r, attente * 1000))
    }

    throw new Error('Toujours bloque apres 5 essais sur ' + url)
}

// Pas de route "toutes les recettes" chez TheMealDB : on passe lettre par lettre
export async function chercherRecettes () {
    if (cache) {
        return cache
    }

    const toutes = []
    const lettres = 'abcdefghijklmnopqrstuvwxyz'

    for (const lettre of lettres) {
        const donnees = await chercher(BASE + '/search.php?f=' + lettre)

        // meals vaut null si aucune recette pour cette lettre
        if (donnees.meals) {
            for (const meal of donnees.meals) {
                toutes.push(nettoyer(meal))
            }
        }
    }

    cache = toutes
    return cache
}

export async function chercherUneRecette (id) {
    const donnees = await chercher(BASE + '/lookup.php?i=' + id)

    if (!donnees.meals) {
        return null
    }

    return nettoyer(donnees.meals[0])
}

export async function chercherRecetteAuHasard () {
    const donnees = await chercher(BASE + '/random.php')
    return nettoyer(donnees.meals[0])
}
