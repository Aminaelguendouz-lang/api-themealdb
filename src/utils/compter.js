// ['Beef', 'Dessert', 'Beef'] => { Beef: 2, Dessert: 1 }
export function compter (liste) {
    const compteur = {}

    for (const valeur of liste) {
        if (compteur[valeur]) {
            compteur[valeur] = compteur[valeur] + 1
        } else {
            compteur[valeur] = 1
        }
    }

    return compteur
}
