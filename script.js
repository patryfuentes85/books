
//***** no me ha funcionado el .env ***//

//const env = require("dotenv").config(); //archivo para proteger contraseñas
//const apikey = process.env.API_KEY;

let list = [];
let bookis = [];
let bigBox = document.getElementById("bigBox");
let bigBox2 = document.getElementById("bigBox2");
let category = '';
let direction = '';
let bodyId = document.getElementById("bodyId");

// esta es la url para sacar las listas.
// https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=s3ot8ciy8B2TsNboXeV9rpBxsBTyP0GD

// hago fetch para sacar las listas de libros 
async function getLists() {
    let response = await fetch(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=OS4f06asBU9xS4odtEGLNQjemXgOBBBz`);
    let data = await response.json();
    await data.results.map((item, index) => {
        list.push({
            'list_name': item.list_name,
            'list_name_encoded': item.list_name_encoded,
            'oldest': item.oldest_published_date,
            'newest':item.newest_published_date,
            'updated':item.updated
        });
    });
    return list;
};


async function pintando() {

    list.map((item, i) => {

        let div = document.createElement('div');
        
        div.innerHTML = `<h3>${list[i].list_name}</h3>
                         <p>Oldest: ${list[i].oldest}</p>
                         <p>Newest: ${list[i].newest}</p>
                         <p>Updated: ${list[i].updated}</p>`;

        const button = document.createElement("button");
        button.setAttribute('id',`${list[i].list_name}`);
        button.setAttribute('class','Books_btn');
        const BooksBtn = document.createTextNode("Books");
        button.appendChild(BooksBtn);

        button.type = "onclick";
        button.onclick = async function Gobooks() {
                        category = await list[i].list_name_encoded;
                        /* direction = await `https://api.nytimes.com/svc/books/v3/lists/${category}.json?api-key=OS4f06asBU9xS4odtEGLNQjemXgOBBBz`; */
                        getBooks().then(bookis => {
 
                            bookis.map((item, i) => {
                                
                                let div2 = document.createElement('div');
                                
                                div2.innerHTML = `<h2>${bookis[i].title}</h2>
                                                  <p id="rank">Rank: ${bookis[i].rank}</p>
                                                  <img id="img2" src='${bookis[i].book_image}'/>
                                                  <p>Weeks_on_list: ${bookis[i].weeks_on_list}</p>
                                                  <p>Description: ${bookis[i].description}</p>`;
                                                  
                                const buttonAmz = document.createElement("button");
                                const amazon = document.createTextNode("Buy On Amazon");
                                buttonAmz.appendChild(amazon);

                                buttonAmz.setAttribute('id','amz')
                                div2.setAttribute('id','cajita');
                                buttonAmz.type = "onclick";
                                
                                //**** cuando le de click lleva a Amazon ****//
                                buttonAmz.onclick = async function GoAmazon() {
                            
                                        window.location.href = bookis[i].amazon_product_url;
                                            };
                        
                                
                                bigBox2.appendChild(div2);
                                div2.appendChild(buttonAmz);
                                //console.log(list[i].list_name)
                            })
                            
                        });
                        showBooks();
                    };

        div.setAttribute('id','caja');
        bigBox.appendChild(div);
        div.appendChild(button);
        //console.log(list[i].list_name)

    });

};

///// obtener librossssss ////
async function getBooks() {
   
    let response = await fetch(`https://api.nytimes.com/svc/books/v3/lists/${category}.json?api-key=OS4f06asBU9xS4odtEGLNQjemXgOBBBz`);
    let data = await response.json();
   /* console.log(category); */
    await data.results.books.map((item, index) => {
        bookis.push({
            'title': item.title,
            'rank': item.rank,
            'book_image': item.book_image,
            'weeks_on_list': item.weeks_on_list,
            'amazon_product_url':item.amazon_product_url,
            'description':item.description
        });
        
    });
    console.log(bookis);
    return bookis;
    
};


function showBooks(){
	let x = document.getElementById("bigBox");
    let y = document.getElementById("bigBox2");
    x.style.display = "none";
    y.style.display = "flex";
};

async function init() {
    await getLists();
    await pintando();
};
init();