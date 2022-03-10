let list = []
const defaultInfo = {
  "Title": "Movie title goes here...",
  "Poster": "./src/image-placeholder.jpg",
  "Genre": "Movie genre goes here...",
  "Year": "...",
  "Ratings": "0.0/10",
  "Plot": "Comments about a movie..."
}

document.addEventListener('DOMContentLoaded', () => {
  renderFavoriteMovieList()
  searchMovies()
})

let renderFavoriteMovieList = () => {
  fetch('http://localhost:3000/movies')
    .then(res => res.json())
    .then(data => list = data)
    .then(data => {
      data.forEach(renderMovie)
      setMovieDetailsToDom(defaultInfo, defaultInfo.Ratings)     
    })
}

const makeEl = el => document.createElement(el)
const movieList = document.querySelector('ul#movie-list')
const movieDetail = document.querySelector('div#movie-detail')
const commentsAndRating = document.querySelector('div.commentsAndRating')
const buttons = document.querySelector('div.buttons')

function renderMovie(m) {
  console.log('m:', m);
  const moviePoster = makeEl('li')
  moviePoster.id = m.Title
  const img = makeEl('img')
  img.src = m.Poster
  img.className = 'poster'
  img.id = m.Title

  moviePoster.appendChild(img)
  movieList.appendChild(moviePoster)

  img.addEventListener('click', () => {
    setMovieDetailsToDom(m, m.Rating)
    deleteMovie(m)
  })
}

function deleteMovie(obj) {
  const deleteBtn = document.querySelector(`button#deleteBtn${obj.id}`)
  deleteBtn.addEventListener('click', () => {
    debugger
    console.log('movieList before:', movieList.children);
    console.log('List:', list);
    const imageList = movieList.children
    let imageSize = imageList.length
    
    if (imageSize === 0) {
      setMovieDetailsToDom(defaultInfo, defaultInfo.Ratings)
    } else if (imageSize === 1) {
      setMovieDetailsToDom(defaultInfo, defaultInfo.Ratings)
      removeMovieFromDB(obj)
      list.pop(obj)
      imageList[0].remove()
    } else {
      for (let i = 0; i < imageSize; i++) {
        if (list[i].Title === obj.Title) {
          if (i === imageSize - 1) {
            setMovieDetailsToDom(list[0], list[0].Ratings)
            removeMovieFromDB(list[i])
            list.splice(i, 1)
            imageList[i].remove()
            return
          } else {
            setMovieDetailsToDom(list[i + 1], list[i + 1].Rating)
            removeMovieFromDB(list[i])
            list.splice(i, 1)
            imageList[i].remove()
            return
          }  
        } 
      }
    }    
  })
}

function saveMovie(button, obj) {

  button.addEventListener('click', () => {    
    let found = list.find(movie => movie.Title === obj.Title ? true : false)
    if (!found) {      
      const element = {
        "Title": obj.Title,
        "Poster": obj.Poster,
        "Genre": obj.Genre,
        "Year": obj.Year,
        "Rating": obj.Ratings[0].Value,
        "Plot": obj.Plot
      }           

      fetch('http://localhost:3000/movies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(element)
        })
        .then(res => res.json())
        .then(data => console.log(data))
        // renderFavoriteMovieList()
        list.push(element)
        renderMovie(element)
        
    }
  })
}

function removeMovieFromDB(movie) {
  debugger
  // console.log('movie to remove from DB:', movie);
  fetch(`http://localhost:3000/movies/${movie.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(movie => console.log('Removed movie from DB:', movie))
}

function searchMovies() {
  const search = document.querySelector('#search-form')

  search.addEventListener('submit', (e) => {
    e.preventDefault()
    const movieName = e.target[0].value
    console.log("movie name:", movieName);
    const searchMovieTitle = document.querySelector('input#movie_title')
    searchMovieTitle.value = ''

    fetch(`http://www.omdbapi.com/?t=${movieName}&apikey=19546fcd`)
      .then(res => res.json())
      .then(movie => {
        // console.log('AAAA:', movie);        
        if(movie.Response === 'False') {
          const rate = '0.0/10'
          setMovieDetailsToDom(defaultInfo, rate)
        } else { 
          const rating = movie.Ratings[0].Value         
          setMovieDetailsToDom(movie, rating)
        }
        
      })
      .catch(err => {
        console.log('err:', err)
        setMovieDetailsToDom(defaultInfo)
      })
  })
}

function setMovieDetailsToDom(obj, rate) {
  const popMovies = document.querySelector('div#pop-movie')
  popMovies.innerHTML = ''
  const img = makeEl('img')
  if(obj.Poster === 'N/A') {
    obj.Poster = "./src/image-placeholder.jpg"
  }
  img.src = obj.Poster
  img.className = 'poster'
  img.alt = 'Movie poster appear soon...'

  const movieDetail = makeEl('div')
  movieDetail.id = 'movie-detail'
  movieDetail.innerHTML = `    
    <h3 class='title'>${obj.Title}</h3> 
    <h4 class='genre'>${obj.Genre}</h4>
    <h4 class='year'>Year:${obj.Year}</h4>`
  movieDetail.append(img)

  const commentsAndRating = makeEl('div')
  commentsAndRating.className = 'commentsAndRating'
  commentsAndRating.innerHTML = `
    <h3>Rating: ${rate}</h3>       
    <h3>Plot: </h3>
    <p class='movie-comment'>${obj.Plot}</p>`

  const buttons = makeEl('div')
  buttons.className = 'buttons'

  const deleteBtn = makeEl('button')
  deleteBtn.type = 'submit'
  deleteBtn.className = 'btn btn-outline-light col-3 btn-lg deleteBtn'
  deleteBtn.id = "deleteBtn" + obj.id
  deleteBtn.textContent = 'Delete'

  const saveBtn = makeEl('button')
  saveBtn.type = 'submit'
  saveBtn.className = 'btn btn-outline-light col-3 btn-lg saveBtn'
  saveBtn.id = "saveBtn" + obj.id
  saveBtn.textContent = 'Save to Favorite'

  buttons.append(deleteBtn, saveBtn)
  popMovies.append(movieDetail, commentsAndRating, buttons)

  // debugger
  saveMovie(saveBtn, obj)
  deleteMovie(obj)
}