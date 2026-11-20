import express from 'express'
import cors from 'cors'

import recettesRoutes from './routes/recettes.routes.js'
import statsRoutes from './routes/stats.routes.js'
import categoriesRoutes from './routes/categories.routes.js'

const app = express()

app.use(cors())

app.get('/', (req, res) => {
    res.json({
        message: 'API TheMealDB',
        routes: [
            '/api/recettes',
            '/api/recettes/:id',
            '/api/recettes/hasard',
            '/api/categories',
            '/api/stats'
        ]
    })
})

app.use('/api/recettes', recettesRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/categories', categoriesRoutes)

// aucune route trouvee
app.use((req, res) => {
    res.status(404).json({ erreur: 'Route inconnue : ' + req.originalUrl })
})

// erreurs (4 parametres)
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ erreur: 'Erreur du serveur' })
})

export default app
