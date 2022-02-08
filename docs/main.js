var pokemones = [];
var search;
var matchList
if(document.getElementById("search")!=undefined)
{
    search = document.getElementById("search");
    matchList = document.getElementById("match-list");
}

var localName = localStorage.getItem("nombre");

if(document.getElementById("saludo")!=undefined)
{
document.getElementById("saludo").innerHTML+=localName;
console.log(localName);
}

var offset = 1;
var limit = 11;
var accorVerMas;  

const typeColors = {
    electric: '#FFEA70',
    normal: '#B09398',
    fire: '#FF675C',
    water: '#0596C7',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#7AE7C7',
    grass: '#4A9681',
    psychic: '#FFC6D9',
    ghost: '#561D25',
    bug: '#A2FAA3',
    poison: '#795663',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#1D8A99',
    fighting: '#8c3eb1',
    default: '#2A1A1F',
};

//Cambia el contenido del accordion.
if(document.getElementById("centrar")!=undefined)
{
    accorVerMas = document.getElementById("centrar");  
    let botonVerMas = document.getElementById("btn-ver-mas"); 
    botonVerMas.addEventListener("click", ()=>{
        if(botonVerMas.textContent.includes("Ver Todos"))
        {
            botonVerMas.textContent="Ver Menos";
        }
        else if(botonVerMas.textContent.includes("Ver Menos"))
        {
            botonVerMas.textContent="Ver Todos";
        }
    })
}

//Funcion que optiene un pokemon.
const getPokemon = async  (id) =>
{
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const pokemon = await response.json();
    pokemones.push(pokemon);
    return pokemon;
}

//completa las options del select que se utiliza para el filtro de tipos.
function completarTipos(allPokemones)
{
   let arrayTipos = [];
   for(let i=0; i<allPokemones.length;i++)
    { 
      if(!arrayTipos.includes(allPokemones[i].types[0].type.name))
      {
        arrayTipos.push(allPokemones[i].types[0].type.name);     
      }
    }

   arrayTipos.sort();

   if(document.getElementById("selectTipo")!=undefined)
   {
      for(let i=0; i<arrayTipos.length;i++)
        { 
          let tipo = arrayTipos[i];
          let option = document.createElement("option");
          option.className = "text-center m-0";
          option.value =  `${arrayTipos[i]}`
          option.innerHTML = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
          document.getElementById("selectTipo").appendChild(option);
        }
   }
}

//busca un pokemon por nombre o id. 
async function searchPokemon(event)
{
    event.preventDefault();
    let value = event.target.inpPokemon.value.toLowerCase();
    if(value.length>0)
    {
            let accorVerMas = document.getElementById("centrar");  
            let boton = document.createElement('div');
            boton.className = "text-center m-4";
            boton.innerHTML =`<a href="#" class="col-2 btn btn-volver" onclick="obtenerPrimerGeneracion()"><<< Volver</a>`;
            document.getElementById("contenedor").innerHTML = ``;
            pokemones.forEach(pokemon =>{
                if(pokemon.forms[0].name.includes(value))
                {
                    imprimirPokemon("contenedor",pokemon);
                }
                } );

            document.getElementById("contenedor").appendChild(boton);
            accorVerMas.style.display="none";
    }
}

//obtiene e imprime la primer generacion de pokemon (los cuales son 151)
const obtenerPrimerGeneracion = async  () =>
{
     pokemones = [];
     let data;
     let allPokemon = [];
     let j = 0;
    if(document.getElementById("contenedor")!=undefined)
    {
        document.getElementById("body-acor").innerHTML = ``;
        accorVerMas.style.display="none";
        let tipoPokemon = document.getElementsByName("tipos");
        let tipo = 0;
        tipoPokemon.forEach(element => {
                if(element.selected)
                {
                    tipo=0;
                }
                else if(element.selectedIndex>0)
                    {                        
                            tipo=element.value;                                   
                    }        
                });

        document.getElementById("contenedor").innerHTML = `<div class="spinner-border text-warning" id="cargando" role="status"> </div>`;
        for (let i = 1; i < 152; i++) 
        {
        data = await getPokemon(i);
        allPokemon.push(data);
        }
        document.getElementById("contenedor").innerHTML = ``;

        allPokemon.forEach(pokemon =>{
            j++;   
             if(tipo== 0)
                 {
                    accorVerMas.style.display="flex";
                    if(j<11)
                    {
                    imprimirPokemon("contenedor",pokemon);
                    }  
                    else
                    {
                    imprimirPokemon("body-acor",pokemon);
                    }
                 }
            else if(pokemon.types[0].type.name === tipo)
                {
                    accorVerMas.style.display="none";
                     imprimirPokemon("contenedor",pokemon);
                }  
            
        } );
        completarTipos(allPokemon);
    }
    
}

//Imprime un pokemon en el lugar que se el indique. 
function imprimirPokemon(idHtml ,data)
{
    let nombre = data.forms[0].name.toUpperCase();
    let imagen = data.sprites.other.dream_world.front_default;
    

    let id = data.id;
    let tipo = data.types[0].type.name.toUpperCase();
    let pokemon = document.createElement('div');
    pokemon.className = "card col-2 m-4";
    pokemon.innerHTML = `
        <p class="card-text pokemon-id col-4 text-center">ID: ${id}</p>
        <img src="${imagen}" class="card-img-top imgCard" name="${data.types[0].type.name}" style="filter: drop-shadow(0 5px 15px ${typeColors[data.types[0].type.name]}); ">
        <div class="card-body">
        <h5 class="card-title">${nombre}</h5>
        
        <p class="card-text" name="tipo">Type: ${tipo}</p>
        <a href="./show_pokemon.html?idpoke=${data.id}" class="btn btn-link" target="_blank" id="${nombre}">See more...</a>
        </div>
    `;

    if(document.getElementById(idHtml)!= undefined)
    {
        document.getElementById(idHtml).appendChild(pokemon); 
    }

    return data;
}


async function obtenerSeeMorePokemon()
{ 
    let pokemonName = location.href;
    pokemonName = pokemonName.split('=');
    pokemonName = pokemonName[1];  
    let data = await getPokemon(pokemonName);
    show(data);
}

function show(data)
{
    let nombre = data.forms[0].name.toUpperCase();
    let imagen = [];
    imagen[0] = data.sprites.other.dream_world.front_default;
    imagen[1] = data.sprites.other.home.front_default;
    imagen[2] = data.sprites.other["official-artwork"].front_default;
    imagen[3] = data.sprites.front_default;
    let id = data.id;
    let tipo = data.types[0].type.name.toUpperCase();
    const { stats } = data;
    
    if(document.getElementById("showPokemon")!= undefined)
    {
        document.getElementById("showPokemon").innerHTML = `
        <div class="col-6" id="stats-pokemon">
            <p class="pokemon-id col-4 text-center p-2" id="id-font">ID: ${id}</p>
            <h1 class="title" id="pokemon-title">${nombre}</h1>
            <h4 id="" style="color: ${typeColors[data.types[0].type.name]};">Type: ${tipo}</h4>        
        </div>

        <div class="col-6 show-pokemon mt-3 mb-2"> 

                <div id="carouselDark" class="carousel slide col-12" data-bs-ride="carousel">
                    <button class="carousel-control-prev col-1" type="button" data-bs-target="#carouselDark" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                    </button>
                <div class="carousel-inner col-10">
                    <div class="carousel-item active col-12 text-center">
                        <h4 class="col-12 text-center"  id="titulo-mostrado">MODEL 1</h4>  
                        <img src="${imagen[0]}" class="col-12 imgPokemon" id="img-mostrada" style="filter: drop-shadow(0 5px 15px ${typeColors[data.types[0].type.name]}); "> 
                    </div>
                    <div class="carousel-item col-12 text-center">
                        <h4 class="col-12 text-center"  id="titulo-mostrado">MODEL 2</h4>  
                        <img src="${imagen[1]}" class="col-12 imgPokemon" id="img-mostrada" style="filter: drop-shadow(0 5px 15px ${typeColors[data.types[0].type.name]}); "> 
                    </div>
                    <div class="carousel-item col-12 text-center">
                        <h4 class="col-12 text-center"  id="titulo-mostrado">MODEL 3</h4>  
                        <img src="${imagen[2]}" class="col-12 imgPokemon" id="img-mostrada" style="filter: drop-shadow(0 5px 15px ${typeColors[data.types[0].type.name]}); "> 
                    </div>
                </div>

                    <button class="carousel-control-next col-1" type="button" data-bs-target="#carouselDark" data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span>
                    </button>
            </div>

        </div>
       
    `; 
        stats.forEach(stat => {
        const statElement = document.createElement("div");
        const statElementName = document.createElement("h4");
        const statElementAmount = document.createElement("h4");
        statElement.className = "text-center col-8 poke-stats";
        statElementName.className = "text-center p-0";
        statElementAmount.className = "text-center p-0"
        statElementName.textContent = stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1);
        statElementAmount.textContent = stat.base_stat;
        statElement.appendChild(statElementName);
        statElement.appendChild(statElementAmount);
        document.getElementById("stats-pokemon").appendChild(statElement);
    });
    }


}

// const searchSt = async searchText => {
//     const res = pokemones;
//     let matches = pokemones.filter(name => {
//         const regex = new RegExp(`${searchText}`, 'gi')
//         return name.forms[0].name.match(regex);
//     })

//     if (searchText.length === 0)
//     {
//         matches = [];
//         matchList.innerHTML = ``;
//     }

//     outputHtml(matches);
// } ;

// const outputHtml = matches => {
//     if (matches.length > 0)
//     {
//         const html = matches
//         .map(
//             match => `
//             <div class="card card-body mb-1">
//                 <h4> ${match.forms[0].name} </h4>
//             </div>
//             `
//         )
//         .join('');
        
//         matchList.innerHTML = html;
//     }
// };

// if(document.getElementById("search")!=undefined)
// {
//     search.addEventListener('input',()=> searchSt(search.value));
// }




// function showSearch(data)
// {
//     let accorVerMas = document.getElementById("centrar");  
//     let boton = document.createElement('div');
//     boton.className = "text-center m-4";
//     boton.innerHTML =`<a href="#" class="col-2 btn btn-volver" onclick="obtenerPrimerGeneracion()"><<< Volver</a>`;
    
    
//     if(document.getElementById("contenedor")!= undefined)
//     {
//         // document.getElementById("contenedor").innerHTML = ``;
//         imprimirPokemon("contenedor",data);
//         document.getElementById("contenedor").appendChild(boton);
//         accorVerMas.style.display="none";
//     }
// }

obtenerPrimerGeneracion();

if(document.title=="show")
{
    obtenerSeeMorePokemon();
}

Vue.component('todo-footer', {
    props: ['texto', 'link'],
    template: `
    <div class="container-fluid text-center p-3">
          {{ texto }}
          <a href="https://pokeapi.co">{{ link }}</a>
        </div>
    `
  })
  
  var footer = new Vue({
    el: '.footer',
    data: { 
    textos: [
        {texto:'Lucio Andres Gonzalez Pokedex ©2021 Copyright ', link:' Pokeapi.co'},
    ]
        
    }
  });