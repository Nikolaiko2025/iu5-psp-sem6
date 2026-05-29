const moviesService = require('../services/moviesService');

const getAllMovies = (req, res) => {
    const { title, search, fields } = req.query;
    let movies = moviesService.findAll({ title, search });
    
    if (fields) {
        const requestedFields = fields.split(',');
        movies = movies.map(movie => {
            const filteredMovie = {};
            requestedFields.forEach(field => {
                if (movie.hasOwnProperty(field)) {
                    filteredMovie[field] = movie[field];
                }
            });
            return filteredMovie;
        });
    }
    
    res.json(movies);
};

const getMovieById = (req, res) => {
    const id = parseInt(req.params.id);
    const { fields } = req.query;
    let movie = moviesService.findOne(id);
    
    if (!movie) {
        return res.status(404).json({ error: 'Фильм не найден' });
    }
    
    if (fields) {
        const requestedFields = fields.split(',');
        const filteredMovie = {};
        requestedFields.forEach(field => {
            if (movie.hasOwnProperty(field)) {
                filteredMovie[field] = movie[field];
            }   
        });
        movie = filteredMovie;
    }
    
    res.json(movie);
};

const createMovie = (req, res) => {
    const { img, title, text, badge, badgeColor, rating, year, duration, country, genres } = req.body;
    
    if (!img || !title || !text) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }
    
    const newMovie = moviesService.create({ img, title, text, badge, badgeColor, rating, year, duration, country, genres });
    res.status(201).json(newMovie);
};

const updateMovie = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedMovie = moviesService.update(id, req.body);
    
    if (!updatedMovie) {
        return res.status(404).json({ error: 'Фильм не найден' });
    }
    
    res.json(updatedMovie);
};

const deleteMovie = (req, res) => {
    const id = parseInt(req.params.id);
    const success = moviesService.remove(id);
    
    if (!success) {
        return res.status(404).json({ error: 'Фильм не найден' });
    }
    
    res.status(204).send();
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};