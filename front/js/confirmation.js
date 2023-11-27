// Nous récupérons l'ID de la commande grâce à window.location.sarch, que nous stockons dans la constante orderID_url
const orderID_url = window.location.search
// Nous injections l'ID de commande au sein du HTML 
const IDtoHTML = document.getElementById('orderId').innerHTML = orderID_url