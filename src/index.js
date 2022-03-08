document.addEventListener('DOMContentLoaded', () => {
  renderFavoriteMovieList()
  saveMovie()
  searchMovies()
  deleteMovie()
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
  "year": "...",
  "rating": 0.0,
  "comment": "Comments about the movie..."
}

function getEveryMovie(m) {
  const moviePoster = makeEl('li')
  moviePoster.id = m.name
  const img = makeEl('img')
  img.src = m.img_link
  img.className = 'poster'
  img.id = m.name

  moviePoster.appendChild(img)
  movieList.appendChild(moviePoster)

  img.addEventListener('click', () => {

    console.log('getEveryMovie:', moviePoster)
    setMovieInfoToDom(m)
    deleteMovie()
  })
}

function deleteMovie() {
  const deleteBtn = document.querySelector('button#deleteBtn')
  deleteBtn.addEventListener('click', () => {

    const currentMovie = document.querySelector('h3.title').innerText
    debugger
    console.log('movieList before:', movieList.children);
    const imageList = movieList.children

    let size = imageList.length
    if (size === 0) {
      setMovieInfoToDom(defaultInfo)
    }

    for (let i = 0; i < size; i++) {
      if (imageList[i].id === currentMovie && size > 1) {
        if(i === size-1) {
          setMovieInfoToDom(list[0])
          removeMovieFromDB(list[i])
          list.splice(i, 1)
          imageList[i].remove()
          return
        } else {
          setMovieInfoToDom(list[i + 1])
          removeMovieFromDB(list[i])
          list.splice(i, 1)
          imageList[i].remove()
          return
        } 
        
      } else if (imageList[i].id === currentMovie && size === 1) {
        setMovieInfoToDom(defaultInfo)
        removeMovieFromDB(list[i])
        list.splice(i, 1)
        imageList[i].remove()
        return
      }
    }
    return    
  })  
}

function saveMovie() {
  const saveBtn = document.querySelector('button#saveBtn')
  saveBtn.addEventListener('click', () => {
    debugger
    const currentMovie = movieDetail[1].innerText    
    console.log('movie list:', list);
    let found = list.find(obj => obj.name === currentMovie ? true : false)
    if (!found) {

      // const img = makeEl('img')
      // img.src = movieDetail[0].src
      // img.className = 'poster'
      // document.querySelector('#movie-list').appendChild(img)
      
      const obj = {
        "name": currentMovie,
        "img_link": movieDetail[0].src,
        "genre": movieDetail[2].innerText,
        "year": movieDetail[3].innerText,
        "rating": Number(rating.textContent),
        "comment": comment.innerText
      }
      list.push(obj)
      getEveryMovie(obj)

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
    .then(movie => console.log('Removed movie from DB:', movie))
}

function searchMovies() {
  const search = document.querySelector('#search-form')

  search.addEventListener('submit', (e) => {
    e.preventDefault()
    const movieName = e.target[0].value
    const searchMovieTitle = document.querySelector('input#movie_title')
    searchMovieTitle.value = ''

    fetch(`http://www.omdbapi.com/?t=${movieName}&apikey=19546fcd`)
      .then(res => res.json())
      .then(movie => {
        // console.log('AAAA:', movie);
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
  // debugger
  movieDetail[0].src = data.img_link
  movieDetail[1].innerText = data.name
  movieDetail[2].innerText = data.genre
  movieDetail[3].innerText = `Year: ${data.year}`
  rating.textContent = data.rating
  comment.textContent = data.comment
}
