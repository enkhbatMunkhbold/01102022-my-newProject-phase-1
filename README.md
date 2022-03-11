# my-newProject-phase-1

**Favorite Movies Search** app helps user to create own list of favorite movies, by giving short information about a movie that user searches. It's user's choice to add a searched movie to his or her own movies' list or delete a movie from the list.


# Goal

This app is built, to demonstrate the skills I have gotten from the Phase-1 in Flatiron school, using css, html and js files, which work together to complete and achieve the goal of the app. 

## Work environment

The app works locally, using url addresss 'http://localhost:3000' which means it is hosted in node server and on port 3000. 

## Search Movies

The app uses Open Movie Database API to fetch a movie that an user interested in. When a user inputs a movie name into the search bar, it takes the movie title and sends a query to the database. Then, it receives the respond in json format and converts into the readable javascript object. If it doesn't find the movie with the inputted title, then the response is 'False' and  the it displays default screen. If it finds the movie, then the app will show some information about movie, such as year of the release, rating and short plot. At the bottom of the info, there will appear a save button, if the user wants to keep the movie to the list of the favorite movies.

## Save Movies

If the user wants to save the movie to his or her favorite movies' list, then clicks on the **Save to Favorite** button, after which the movie's poster goes to the favorite movie list on the left side of the screen.

## Choose a Movie From the List

If user wants to review a particular movie from his or her list of favorite movies, the user simply needs to click on the movie poster, which is under the **My Favorites** category on the left side of the screen. Clicked movie's poster and other info about the movie will appear on the center of the screen. This time there will be **Delete** button under the detailed info of movie, giving a choice to remove the movie from the favorite movie list, if the user wants to. 

## Delete Movie

If the user want to remove the movie from his or her list, then he/she would click on a movie poster in the favorite movie list. After that, when it appears at the center of the screen, the user can press on **Delete** button, which is under the movie's poster and info. Then the movie will be removed from the favorite movies list, DOM and from the backend effectively. 
