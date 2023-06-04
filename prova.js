
function apriModale(event) {
	const modale = document.querySelector('#modale');
    //creo un nuovo elemento img
	const image = document.createElement('img');
	//associo all'attributo src, l'src cliccato
	image.src = event.currentTarget.src;
	//appendo quest'immagine alla view modale
	modale.appendChild(image);
	//rendo la modale visibile
	modale.classList.remove('hidden');
	//blocco lo scroll della pagina
	document.body.classList.add('no-scroll');
}


function chiudiModale(event) {
	console.log(event);
    const modale = document.querySelector('#modale');
	if(event.key === 'Escape')
	{
		//aggiungo la classe hidden 
		modale.classList.add('hidden');
		//prendo il riferimento dell'immagine dentro la modale
		const img = modale.querySelector('img');
		//e la rimuovo 
		img.remove();
		//riabilito lo scroll
		document.body.classList.remove('no-scroll');
	}
}


function onHpjson(json){
    console.log(json);
    console.log('JSON ricevuto in onHpjson');

    const arrow = document.querySelector('#arrow');
    arrow.classList.remove('hidden');

    //Svuotiamo la pagina
    const page = document.querySelector('#page-view');
    page.innerHTML = '';


  // Processo ciascun risultato
   for(result of json)
   {
	const box = document.createElement('div');
    box.classList.add('page');
    const img = document.createElement('img');
    img.src = result.image;
    const nam = document.createElement('h1');
    nam.innerText = result.name;
 
    //associo l'handler che apre la modale 
    img.addEventListener('click', apriModale); 

    // Aggiungiamo immagine e nome al div
    box.appendChild(img);
    box.appendChild(nam);
   
    // Aggiungiamo il div alla pagina
    page.appendChild(box);
   }
}

function onJson(json){
   console.log(json);
   console.log('JSON ricevuto in onJson');

   //Prendiamo solo il primo risultato
   const image_url = json.results[0].links.download;
   const header = document.querySelector('#background');
    console.log(image_url);
   header.style.backgroundImage = 'url('+image_url+')';
}

function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
}


function getToken(json)
{
	token_data = json;
	console.log(json);
}

function onTokenResponse(response) {
  return response.json();
}



function Search(event){
    //Impedisco il submit del form
    event.preventDefault();
    //Leggo il valore del campo di testo
    const input = document.querySelector('#content');
    const value = encodeURIComponent(input.value);
    console.log('Eseguo ricerca: ' + value);
    //Preparo le richieste
    rest_url = unsplash_endpoint + '?page=1&query=' + value + '&format=json';
    console.log('URL: ' + rest_url);
    hp_url = hp_api_endpoint + '/' + value;
    console.log('URL: ' + hp_url);
   if(value === 'Gryffindor' || value === 'Hufflepuff' || value === 'Ravenclaw' || value === 'Slytherin'
    || value === 'gryffindor' || value === 'hufflepuff' || value === 'ravenclaw' || value === 'slytherin'){
    //Eseguo le fetch
    fetch(rest_url,
    {
        headers: {
            'Authorization': 'Bearer' + ' ' + token_data.access_token,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(onResponse).then(onJson);
    fetch(hp_url).then(onResponse).then(onHpjson);
    } else {
        alert("Inserisci il nome di una Casata valida per la ricerca");
    }
}

//Preparo gli endpoint delle API
const access_key = 'EYYlgfpmk3DCk8qiGgl4Cyxt0nBeaaBT-jMuttA78vs';
const secret_key = 'kwsVYGYsnACqs8_xHBiMliRudE8CBX5rfj2YqkaWgQI';
const hp_api_endpoint = 'https://hp-api.onrender.com/api/characters/house';
const unsplash_endpoint = 'https://api.unsplash.com/search/photos';
//Ottengo il token
let token_data;
const unsplash_token_endpoint = 'https://unsplash.com/oauth/token';
fetch(unsplash_token_endpoint,
{
	method: 'POST',
	body: 'grant_type=client_credentials&client_id=' + access_key + '&client_secret=' + secret_key,
	headers:
	{
		'Content-Type': 'application/x-www-form-urlencoded'
	}
}).then(onTokenResponse).then(getToken);
//Aggiungo l'event listener al form
const form = document.querySelector('form');
form.addEventListener('submit', Search);

//creo il pulsante per la chiusura del post 
window.addEventListener('keydown', chiudiModale);