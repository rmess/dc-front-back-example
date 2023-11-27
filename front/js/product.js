//Récupération de la chaine de requête dans l'URL, cela vas nous servir à afficher le produit selectionné sur la page index
const queryString_url_id = window.location.search
const urlSearchParams = new URLSearchParams(queryString_url_id)
const _id = urlSearchParams.get('_id')

const promiseProduct = fetch(`http://localhost:3000/api/products/${_id}`)
.then((response) => response.json())
.then((response) => { 
  meubleData = response
  document.getElementById('item').innerHTML = `
                       <article>
                          <div class="item__img">
                           <img src="${meubleData.imageUrl}" alt="${meubleData.altTxt}">
                           </div>
                           <div class="item__content">
  
                           <div class="item__content__titlePrice">
                               <h1>${meubleData.name}</h1>
                               <p>Prix : <span id="price"></span> €</p>
                           </div>
  
                           <div class="item__content__description">
                               <p class="item__content__description__title">Description :</p>
                               <p id="description"><p>${meubleData.description}</p>
                           </div>
  
                           <div class="item__content__settings">
                               <div class="item__content__settings__color">
                               <label for="color-select">Choisir une couleur :</label>
                               <select name="color-select" id="colors">
  
                               </select>
                               </div>
  
                               <div class="item__content__settings__quantity">
                               <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
                               <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
                               </div>
                           </div>
  
                           <div class="item__content__addButton">
                               <button id="addToCart">Ajouter au panier</button>
                           </div>
  
                          </div>
                       </article>
                         `
        //Déclaration de la constante optionsColors, qui nous sert à récuperer les éléments contenus dans les tableaux 'colors' de chaque index de meubleData
        //Déclaration de la variable structureColors, un tableau vide dans lequel nous ajouterons les valeurs contenues dans optionsColors
        //Pour ce faire, nous utilisons une boucle for : à chaque itération, nous ajoutons la nouvelle valeur au tableau structureColors
        //Enfin, nous injectons structureColors dans le HTML 
        const optionColors =  meubleData.colors
        let structureColors = []
        
        for (let i = 0; i < optionColors.length; i++) {
          structureColors =
            structureColors +
            `<option value="${optionColors[i]}">${optionColors[i]}</option>`
        }
        const positionColorOptions = document.querySelector('#colors')
        positionColorOptions.innerHTML = structureColors
      })
  // 

  
//Récupérer les données séléctionnées par l'utilisateur afin de les envoyer vers le panier
//Récupération des données de l'API :
fetch('http://localhost:3000/api/products')
  .then((res) => res.json())
  .then((res) => {
    data = res
    //Récupération, au sein de l'API, du produit séléctionné par l'utilisateur 
    const selectedProduct_id = data.find((element) => element._id === _id)

    let idForm = document.querySelector('#colors')
    let quantity = document.querySelector('#quantity')
    const btn_addToCart = document.querySelector('#addToCart')

    /*LE ADD EVENT LISTENER*/
    //Ecouter le click, puis envoyer l'article vers le panier
    btn_addToCart.addEventListener('click', (event) => {
         for(j = 0 ; j < selectedProduct_id.colors.length ; j ++)
      event.preventDefault()
      //Mettre le choix de l'utilisateur dans une variable
      const choixForm = idForm.value
      //Mettre la quantité dans une variable
      let choixQuantity = quantity.value
      //Récupération des valeurs au sein de la variables "optionsProduit"
      optionsProduit = {
        name: selectedProduct_id.name,
        selectedProduct_id: selectedProduct_id._id,
        option_produit: choixForm,
        quantite: choixQuantity,
        image: selectedProduct_id.imageUrl,
      }
      //Nous stockons les éventuels résultats provenants du localStorage dans fromJSON
      fromJSON = localStorage.getItem('idJSON')
      //Fonction servant à ajouter un article au panier 
      function addToArray() {
        fromJS.push(optionsProduit)
        localStorage.setItem('idJSON', JSON.stringify(fromJS))
        window.alert("Le produit vient d'être ajouté à votre panier")
      }
      
      //Fonction servant à retourner les produits ayant le même ID, afin que le tri soit fait lors de l'ajout au panier
      function sameId(product) {
        return product.selectedProduct_id === optionsProduit.selectedProduct_id
      }
      
      ///LA GESTION DU PANIER///
      if (fromJSON) {
        fromJS = JSON.parse(fromJSON) //On ajoute dans le tableau JS les produits déjà présents dans le storage
        for (i = 0; i < fromJS.length; i++){
          if (optionsProduit.quantite === '0') {
            alert('Le quantité séléctionnée est de 0')
          } else if (
            optionsProduit.selectedProduct_id !== fromJS[i].selectedProduct_id
          ) {
            const quantityToNumber = parseInt(optionsProduit.quantite)
            optionsProduit.quantite = quantityToNumber
            let foundSameID = fromJS.find(sameId)
            if (foundSameID === undefined) {
              // Si undefined nous est retourné, c'est que l'ID n'est présent sur aucune ligne du tableau
              addToArray() //Nous ajoutons donc le produit au panier
              break //Puis nous sortons de la boucle for
            }
          } else if (
            optionsProduit.selectedProduct_id === fromJS[i].selectedProduct_id
          ) {
            //Si l'ID du produit séléctionné est présent sur la ligne en cours d'analyse
            let foundSameID = fromJS.find(sameId) // Alors nous utilisons la méhode find afin de retourner le premier élément ayant le même ID
            if (foundSameID.option_produit === optionsProduit.option_produit) {// Si cet élément possède la même option produit
              let quantityToNumber = parseInt(optionsProduit.quantite) // Nous convertissons la quantite du produit sélectionné en nombre
              let quantityToNumberBis = parseInt(foundSameID.quantite) // Nous convertissons la quantite du produit retourné par la méthode find en nombre
              foundSameID.quantite = quantityToNumber += quantityToNumberBis // Nous additionnons les deux quantités ci-dessus afin d'obtenir le nouveau nombre total de produit avec le même ID / même options
              localStorage.setItem('idJSON', JSON.stringify(fromJS)) //Pour finir, nous mettons à jour le localStorage
              break // Puis nous sortons de la boucle for
            } else if (
              foundSameID.option_produit !== optionsProduit.option_produit
            ) {
              //Si le produit retourné par find possède bien le même ID, mais avec une option différente :
              const filtrage = fromJS.filter(
                (produit) =>
                  produit.selectedProduct_id ===
                  optionsProduit.selectedProduct_id,
              ) //Alors on déclare la variable filtrage, qui utilise la méthode filter pour vérifier si un d'autres produits avec le même ID existe à travers le tableau fromJS
              const filtrageFindOption = filtrage.find(
                (element) =>
                  element.option_produit === optionsProduit.option_produit,
              ) //Puis on applique de nouveau la méthode find au sein de filtrage, pour vérifier si un élément avec la même option nous est retourné
              if (filtrageFindOption === undefined) {
                // Si aucun produit correspondant n'est trouvé :
                const toNumber = parseInt(optionsProduit.quantite)
                optionsProduit.quantite = toNumber
                addToArray() // Alors nous ajoutons le produit au panier
              } else if (
                filtrageFindOption.option_produit ===
                optionsProduit.option_produit
              ) {
                // Si find nous retourne un élément :
                let convertQuantity = parseInt(optionsProduit.quantite) // Alors nous convertissons en number la quantite du produit séléctionné
                let convertQuantityBis = parseInt(filtrageFindOption.quantite) // Puis nous faisons de même avec la quantite de l'élément retourné par find
                filtrageFindOption.quantite = convertQuantity += convertQuantityBis // Nous additionnons les 2 number ci-dessus afin d'obtegnir la quantité total
                localStorage.setItem('idJSON', JSON.stringify(fromJS)) // Puis nous mettons le localStorage à jour
              }
              break //Pour sortir de la boucle for, afin d'éviter une répétition pour chaque ligne du tableau
            }
          }
        }
      } else {
        if (optionsProduit.quantite === '0') {
          alert('Le quantité séléctionnée est de 0')
        } else {
          fromJS = []
          const toNumber = parseInt(optionsProduit.quantite)
          optionsProduit.quantite = toNumber
          addToArray()
        }
      }
    })
  })



// Recuperation du prix produit dans l'API

const priceFetching = fetch('http://localhost:3000/api/products')
  .then((res) => res.json())
  .then((res) => {
    data = res
    let fetchedProduct = data.find((element) => element._id === _id)
    document.getElementById('price').innerHTML = fetchedProduct.price 
  })
