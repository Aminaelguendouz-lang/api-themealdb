import { Router } from 'express'
import { chercherRecettes } from '../services/themealdb.service.js'
import { compter } from '../utils/compter.js'

const router = Router()

// GET /api/categories : nombre de recettes par categorie, de la plus grosse a la plus petite
router.get('/', async (req, res) => {
    const recettes = await chercherRecettes()
    const compteur = compter(recettes.map((r) => r.categorie))

    const categories = Object.keys(compteur)
        .map((nom) => ({ nom: nom, nbRecettes: compteur[nom] }))
        .sort((a, b) => b.nbRecettes - a.nbRecettes)

    res.json(categories)
})

export default router
