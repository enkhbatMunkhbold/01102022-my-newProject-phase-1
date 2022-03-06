document.addEventListener('DOMContentLoaded', () => {
  renderFavoriteMovieList()
  saveMovie
  searchMovies
  deleteMovie
})

let renderFavoriteMovieList = () => {
  fetch('http://localhost:3000/movies')
    .then(res => res.json())
    .then(data => list = data)
    .then(data => data.forEach(getEveryMovie))
}

const makeEl = el => document.createElement(el)
const movieList = document.querySelector('ul#movie-list')
const movieDetail = document.querySelector('div#movie-detail').children
const commentsAndRating = document.querySelector('div.commentsAndRating')
const rating = commentsAndRating.querySelector('#movie-rating')
const comment = commentsAndRating.querySelector('.movie-comment')

const defaultInfo = {
  "name": "Movie title goes here...",
  "img_link": "./src/image-placeholder.jpg",
  "genre": "Movie genre goes here...",
  "year": "Year: ...",
  "rating": 0.0,
  "comment": "Comments about the movie..."
}

function getEveryMovie(m) {
  const moviePoster = makeEl('li')
  moviePoster.id = m.name
  const img = makeEl('img')
  img.src = m.img_link
  img.className = 'poster'

  moviePoster.appendChild(img)
  movieList.appendChild(moviePoster)

  img.addEventListener('click', () => {
    
    // console.log('getEveryMovie:', m);
    console.log('getEveryMovie:', moviePoster)
    setMovieInfoToDom(m)
    deleteMovie(img, moviePoster)
  })
}

function deleteMovie(image, el) {
  const deleteBtn = document.querySelector('button#deleteBtn')
  deleteBtn.addEventListener('click', () => {

    const currentMovie = document.querySelector('h3.title').innerText
    // console.log('movie:', movie);
    // console.log('movieList:', movieList.children);
    
    // let list = movieList.children
    let size = list.length
    // console.log('list size:', size);
    // console.log('currentMovie:', currentMovie);
    debugger

    if (size === 0) {
      setMovieInfoToDom(defaultInfo)
    }    

    for(let i = 0; i < size; i++) {
      if (list[i].name === currentMovie && size > 1) {
        console.log('List[i+1]:', list[i+1]);
        setMovieInfoToDom(list[i+1])
        removeMovieFromDB(list[i])
        if(arguments.length === 0) {
          el.remove()
        } else {
          image.remove()
        }        
        return 
      } else if(list[i].name === currentMovie && size === 1) {
        setMovieInfoToDom(defaultInfo)
        removeMovieFromDB(list[i])
        if(arguments.length === 0) {
          el.remove()
        } else {
          image.remove()
        }        
        return
      }        
    }
  })
}

function saveMovie() {
  const saveBtn = document.querySelector('button#saveBtn')
  saveBtn.addEventListener('click', () => {
    const currentMovie = movieDetail[1].innerText
    let found = list.find(obj => obj.name === currentMovie ? true : false)
    if (!found) {

      const img = makeEl('img')
      img.src = movieDetail[0].src
      img.className = 'poster'
      document.querySelector('#movie-list').appendChild(img)

      const obj = {
        "name": currentMovie,
        "img_link": movieDetail[0].src,
        "genre": movieDetail[2].innerText,
        "year": movieDetail[3].innerText,
        "rating": Number(rating.textContent),
        "comment": comment.innerText
      }

      fetch('http://localhost:3000/movies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(obj)
        })
        .then(res => res.json())
        .then(data => console.log(data))
    }
    renderFavoriteMovieList()
  })
}

function removeMovieFromDB(movie) {
  fetch(`http://localhost:3000/movies/${movie.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(movie => console.log(movie))
}

function searchMovies() {
  const search = document.querySelector('#search-form')

  search.addEventListener('submit', (e) => {
    e.preventDefault()
    const movieName = e.target[0].value

    fetch(`http://www.omdbapi.com/?t=${movieName}&apikey=19546fcd`)
      .then(res => res.json())
      .then(movie => {
        console.log('AAAA:', movie);
        movieDetail[0].src = movie.Poster
        movieDetail[1].innerText = movie.Title
        movieDetail[2].innerText = movie.Genre
        movieDetail[3].innerText = `Year: ${movie.Year}`
        const rate = movie.Ratings[0].Value.split('/')
        rating.textContent = rate[0]
        comment.textContent = movie.Plot
      })
      .catch(err => {
        console.log('err:', err)
        setMovieInfoToDom(defaultInfo)
      })
  })
}

function setMovieInfoToDom(data) {
  movieDetail[0].src = data.img_link
  movieDetail[1].innerText = data.name
  movieDetail[2].innerText = data.genre
  movieDetail[3].innerText = `Year: ${data.year}`
  rating.textContent = data.rating
  comment.textContent = data.comment
}
