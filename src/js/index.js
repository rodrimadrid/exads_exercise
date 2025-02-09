const init = async () => {
    const container_movies = document.getElementById('container-movies');
    const container_selection = document.getElementById('container-selection');
    const final_alert = document.getElementById('final-alert');
    const container_circles = document.getElementById('container-circles');
    const title_question = document.getElementById('title-question');
    const text_progress = document.querySelector('.question-progress p');
    const button_imdb = document.getElementById('button-imdb');

    const API_URL = 'src/data/movies.json';

    let array_movies = [];


    const getMovies = async () => {
        try {
            const response = await fetch(API_URL);
            const { movies } = await response.json();
            return movies;
        } catch (error) {
            console.error(error);
            alert('Ups... There were some problems, try again later.');
        }
    }

    const handleSelectMovie = (movie) => {
        const condition = (m) =>  movie.parent == -1 ? m.parent == movie.id : m.type == movie.type + 1;
        const next_movies = array_movies.filter(condition);
        if (next_movies.length > 0) {
            setQuestionProgress(array_movies, next_movies[0].type);
            title_question.innerText = next_movies[0].question;
            container_movies.innerHTML = '';
            listMovies(next_movies, next_movies[0].type);
        }else{
            container_selection.classList.add('d-none');
            final_alert.classList.remove('d-none');
            button_imdb.onclick = () => {
                window.location.assign(movie.imdb);
            }       
        }
    }

    const appendMovies = (filtered_movies) => {
        filtered_movies.forEach(movie => {
            const div = document.createElement('div');        
            const div_image = document.createElement('div');        
            div.classList.add('movie-card');
            div_image.classList.add('image-container');
            const img = document.createElement('img');
            img.src = movie.href;
            div_image.appendChild(img);
            div.appendChild(div_image);
            div.addEventListener('click', (e) => handleSelectMovie(movie));
            container_movies.appendChild(div);
        });
    }

    const listMovies = (movies, type) => {
        const filtered_movies = movies.filter(movie => movie.type == type);
        appendMovies(filtered_movies);
    }

    const getMovieTypes = (movies) => {
        const types = movies.map(movie => movie.type);
        const unique_types = [...new Set(types)];
        return unique_types;
    }

    const setDotProgress = (types_length, progress) => {    
        if (container_circles.childElementCount == 0) {
            types_length.forEach(type => {
                const circle = document.createElement('div');
                circle.classList.add('circle');
                circle.id = `circle-${type}`;
                if (type == progress) {
                    circle.classList.add('filled');
                }
                container_circles.appendChild(circle);
            });
        }else{
            const next_circle = document.getElementById(`circle-${progress}`);
            const prev_circle = document.getElementById(`circle-${progress - 1}`);
            prev_circle.classList.remove('filled');
            next_circle.classList.add('filled');

        }
    }

    const setQuestionProgress = (movies, progress) => {
        const movie_types = getMovieTypes(movies);
        const types_length = movie_types.length;
        text_progress.innerText = `QUESTION ${progress} OF ${types_length}`;
        setDotProgress(movie_types, progress);
    }

    const setLoading = (loading, container) => {
        if (loading) {
            const spinner = createSpinner();
            container.appendChild(spinner);
        }else{
            const spinner = container.getElementsByClassName('spinner')[0] ?? false;
            if (spinner) {
                spinner.remove();
            }
        }
    }

    const createSpinner = () => {
        const spinner = document.createElement('div');
        spinner.classList.add('spinner');
        spinner.setAttribute('id', `spinner-${setSpinnerID()}`);
        return spinner;
    }

    const setSpinnerID = () => {
        let maxID = 0;
        const spinners = document.getElementsByClassName('spinner');
        for (let spinner of spinners) {
            const id = parseInt(spinner.id.replace('spinner-', ''), 10);
            if (id > maxID) {
                maxID = id;
            }
        }
        return maxID + 1;
    }

    setLoading(true, container_movies);
    array_movies = await getMovies();
    setLoading(false, container_movies);
    setQuestionProgress(array_movies, 1);
    listMovies(array_movies, 1);
}



document.addEventListener('DOMContentLoaded', () => {
    init();
})