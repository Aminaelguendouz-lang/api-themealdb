import { Router } from 'express'
import {
    chercherRecettes,
    chercherUneRecette,
    chercherRecetteAuHasard
} from '../services/themealdb.service.js'

const router = Router()

// GET /api/recettes?categorie=Dessert&pays=British&nom=cake&ingredient=butter
router.get('/', async (req, res) => {
    let recettes = await chercherRecettes()

    if (req.query.categorie) {
        const categorie = req.query.categorie.toLowerCase()
        recettes = recettes.filter((r) => r.categorie.toLowerCase() === categorie)
    }

    if (req.query.pays) {
        const pays = req.query.pays.toLowerCase()
        recettes = recettes.filter((r) => r.pays.toLowerCase() === pays)
    }

    if (req.query.nom) {
        const nom = req.query.nom.toLowerCase()
        recettes = recettes.filter((r) => r.nom.toLowerCase().includes(nom))
    }

    if (req.query.ingredient) {
        const ingredient = req.query.ingredient.toLowerCase()
        recettes = recettes.filter((r) =>
            r.ingredients.some((ing) => ing.nom.toLowerCase().includes(ingredient))
        )
    }

    res.json({
        total: recettes.length,
        recettes: recettes
    })
})

// avant /:id, sinon "hasard" est pris pour un id
router.get('/hasard', async (req, res) => {
    const recette = await chercherRecetteAuHasard()
    res.json(recette)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id

    // les id TheMealDB sont des nombres, pas la peine d'appeler l'API sinon
    if (isNaN(id)) {
        return res.status(404).json({ erreur: 'Recette introuvable : ' + id })
    }

    const recette = await chercherUneRecette(id)

    if (!recette) {
        return res.status(404).json({ erreur: 'Recette introuvable : ' + id })
    }

    res.json(recette)
})

export default router
