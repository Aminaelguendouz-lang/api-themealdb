import { Router } from 'express'
import { chercherRecettes } from '../services/themealdb.service.js'
import { compter } from '../utils/compter.js'

const router = Router()

function plusFrequent (compteur) {
    let meilleur = null

    for (const cle in compteur) {
        // on ignore les recettes sans pays / sans categorie
        if (cle === 'Inconnu' || cle === 'Inconnue') {
            continue
        }

        if (meilleur === null || compteur[cle] > compteur[meilleur]) {
            meilleur = cle
        }
    }

    return meilleur
}

// GET /api/stats
router.get('/', async (req, res) => {
    const recettes = await chercherRecettes()

    if (recettes.length === 0) {
        return res.json({ totalRecettes: 0 })
    }

    const parCategorie = compter(recettes.map((r) => r.categorie))
    const parPays = compter(recettes.map((r) => r.pays))

    let totalIngredients = 0
    let laPlusLongue = recettes[0]

    for (const recette of recettes) {
        totalIngredients = totalIngredients + recette.nbIngredients

        if (recette.nbIngredients > laPlusLongue.nbIngredients) {
            laPlusLongue = recette
        }
    }

    const moyenne = totalIngredients / recettes.length

    res.json({
        totalRecettes: recettes.length,
        nbCategories: Object.keys(parCategorie).length,
        nbPays: Object.keys(parPays).length,
        categorieLaPlusFrequente: plusFrequent(parCategorie),
        paysLePlusFrequent: plusFrequent(parPays),
        moyenneIngredientsParRecette: Math.round(moyenne * 10) / 10,
        recetteAvecLePlusDIngredients: {
            id: laPlusLongue.id,
            nom: laPlusLongue.nom,
            nbIngredients: laPlusLongue.nbIngredients
        },
        parCategorie: parCategorie,
        parPays: parPays
    })
})

export default router
