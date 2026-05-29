const moviesService = require('../services/moviesService');

const getAllMovies = (req, res) => {
    const { title } = req.query;
    const movies = moviesService.findAll(title);
    res.json(movies);
};

const getMovieById = (req, res) => {
    const id = parseInt(req.params.id);
    const movie = moviesService.findOne(id);
    
    if (!movie) {
        return res.status(404).json({ error: 'Фильм не найден' });
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