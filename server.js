import app from './src/app.js'

const PORT = 3000

app.listen(PORT, () => {
    console.log('Serveur lance sur http://localhost:' + PORT)
})
