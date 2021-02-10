let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//run function main() at the bottom of the page
function main(){
  fetchToys()
  createFormListener()
  createLikeListener()
}



function fetchToys(){
  fetch(`http://localhost:3000/toys`)
  .then(resp => resp.json())
  .then(toys => {
    toys.forEach(function(toy){
      renderToys(toy)
    })
  })
}

const toyContainer = document.querySelector('#toy-collection')

function renderToys(toy){
  
  const div = document.createElement('div')
  div.className = 'card'
  
  const h2 = document.createElement('h2')
  h2.innerText = toy.name 

  const img = document.createElement('img')
  img.className = 'toy-avatar'
  img.setAttribute('src', toy.image)

  const pTag = document.createElement('p')
  pTag.innerText = `${toy.likes} likes`

  const btn = document.createElement('button')
  btn.setAttribute('id', toy.id)
  btn.className = 'like-btn'
  btn.innerText = 'Like <3'

  toyContainer.append(div)
  div.append(h2, img, pTag, btn)

}
function createFormListener(){
const toyForm = document.querySelector('.add-toy-form')
toyForm.addEventListener('submit', function(e){
  e.preventDefault()

  const newToy = {
    name: e.target['name'].value,
    image: e.target['image'].value,
    likes: 0
  }

  const reqObj = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newToy)
  }


  fetch(`http://localhost:3000/toys`, reqObj)
  .then(resp => resp.json())
  .then(newToy => {
      toyForm.reset()
      renderToys(newToy)
  })
})
}

// finish like button 
function createLikeListener(e){
  toyContainer.addEventListener('click', function(e){
    if (e.target.className === 'like-btn'){
      likeToy(e)
    }
  })
}

function likeToy(e){
  //console.log(e.target.id)
  const id = e.target.id
  // e.target is like button - need to update the p tag that displays the amount of likes
  const pTag = e.target.previousElementSibling
  let likes = parseInt(pTag.innerText)

  const reqObj = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'},
      body: JSON.stringify(
        {likes: likes + 1 })
  }

  fetch(`http://localhost:3000/toys/${id}`, reqObj)
  .then (resp => resp.json())
  .then(toy => {
    pTag.innerText = `${likes + 1} likes`
  })
}

main()