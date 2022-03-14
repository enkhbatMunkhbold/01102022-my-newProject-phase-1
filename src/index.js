let list = []
let savedMovie = false
// let movie_id = 0

const defaultInfo = {
  Title: "Movie title goes here...",
  Poster: "./src/image-placeholder.jpg",
  Genre: "Movie genre goes here...",
  Year: " ...",
  Ratings: "0.0/10",
  Plot: "Short description about a movie..."
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
      setMovieDetailsToDom(defaultInfo, defaultInfo.Ratings, savedMovie = false)
    })
}

const makeEl = el => document.createElement(el)
const movieList = document.querySelector('ul#movie-list')
const movieDetail = document.querySelector('div#movie-detail')
const commentsAndRating = document.querySelector('div.commentsAndRating')
const buttons = document.querySelector('div.buttons')
const search = document.querySelector('#search-form')

function renderMovie(m) {
  const moviePoster = makeEl('li')
  moviePoster.id = m.Title
  const img = makeEl('img')
  img.src = m.Poster
  img.className = 'poster'
  img.id = m.Title

  moviePoster.appendChild(img)
  movieList.appendChild(moviePoster)

  img.addEventListener('click', () => {
    setMovieDetailsToDom(m, m.Rating, savedMovie = true)
    deleteMovie
  })
}

function deleteMovie(obj, btn) {
  btn.addEventListener('click', (e) => {
    debugger
    console.log('event target:', e.target)
    console.log('movieList before:', movieList.children);
    console.log('List:', list);
    const imageList = movieList.children
    let imageSize = imageList.length
    // if(obj.id) {
    //   obj.Movie_id = obj.id
    // }

    if (imageSize === 0) {
      setMovieDetailsToDom(defaultInfo, defaultInfo.Ratings, savedMovie = false)
    } else if (imageSize === 1) {
      setMovieDetailsToDom(defaultInfo, defaultInfo.Ratings, savedMovie = false)  
      imageList[0].remove()
      removeMovieFromDB(obj)
      list.pop(obj)
      // movie_id = 0
    } else {
      savedMovie = true
      for (let i = 0; i < imageSize; i++) {
        if (list[i].Title === obj.Title) {
          if (i === imageSize - 1) {
            setMovieDetailsToDom(list[0], list[0].Ratings, savedMovie) 
            imageList[i].remove()
            removeMovieFromDB(list[i])
            list.splice(i, 1)
            return
          } else {
            setMovieDetailsToDom(list[i + 1], list[i + 1].Rating, savedMovie) 
            imageList[i].remove()
            removeMovieFromDB(list[i])
            list.splice(i, 1)
            return
          }
        }
      }
    }
  })
}

function saveMovie(button, obj) {

  button.addEventListener('click', () => {
    const title = document.querySelector('h3.title').textContent   
    if(title === 'Movie title goes here...') {
      return
    }
    let found = list.find(movie => movie.Title === obj.Title ? true : false)
    if (!found) {
      // movie_id += 1
      const element = {
        // Movie_id: movie_id,
        Title: obj.Title,
        Poster: obj.Poster,
        Genre: obj.Genre,
        Year: obj.Year,
        Rating: obj.Ratings[0].Value,
        Plot: obj.Plot
      }

      fetch('http://localhost:3000/movies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(element)
        })
        .then(res => res.json())
        .then(data =>{
          // console.log('data.id:', data.id);
          // console.log('data.Movie_id before:', data.Movie_id);          
          // data.Movie_id = data.id   
          // console.log('data.Movie_id after:', data.Movie_id)   
          movieList.reset()
          renderFavoriteMovieList()    
        })
      list.push(element)
      renderMovie(element)

    }
  })
}

function removeMovieFromDB(obj) {
  fetch(`http://localhost:3000/movies/${obj.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(movie => console.log('Removed movie from DB:', movie))
}

function searchMovies() { 

  search.addEventListener('submit', (e) => {
    e.preventDefault()
    const movieName = e.target[0].value
    search.reset()

    fetch(`http://www.omdbapi.com/?t=${movieName}&apikey=19546fcd`)
      .then(res => res.json())
      .then(movie => {
        savedMovie = false      
        if (movie.Response === 'False') {
          const rate = '0.0/10'
          setMovieDetailsToDom(defaultInfo, rate, savedMovie)
        } else {
          const rating = movie.Ratings[0].Value
          setMovieDetailsToDom(movie, rating, savedMovie)
        }

      })
      .catch(err => {
        console.log('err:', err)
        savedMovie = false
        setMovieDetailsToDom(defaultInfo, '0.0/10', savedMovie)
      })
  })
}

function setMovieDetailsToDom(obj, rate, movieStatus) {
  const popMovies = document.querySelector('div#pop-movie')
  popMovies.innerHTML = ''

  const img = makeEl('img')
  if (obj.Poster === 'N/A') {
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

  popMovies.append(movieDetail, commentsAndRating)
  const buttons = makeEl('div')
  buttons.className = 'buttons'

  if (!movieStatus) {
    const saveBtn = makeEl('button')
    saveBtn.type = 'submit'
    saveBtn.className = 'btn btn-outline-light col-5 btn-lg saveBtn'
    saveBtn.id = "saveBtn"
    saveBtn.textContent = 'Save to Favorite'
    buttons.appendChild(saveBtn)    
    saveMovie(saveBtn, obj)
  } else {
    const deleteBtn = makeEl('button')
    deleteBtn.type = 'submit'
    deleteBtn.className = 'btn btn-outline-light col-5 btn-lg deleteBtn'
    deleteBtn.id = "deleteBtn"
    deleteBtn.textContent = 'Delete'
    buttons.appendChild(deleteBtn)
    deleteMovie(obj, deleteBtn)
  }
  popMovies.appendChild(buttons)
}