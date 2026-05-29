const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (title) => {
    const movies = fileService.readData(dataFilePath);
    if (title) {
        return movies.filter(movie => 
            movie.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    return movies;
};

const findOne = (id) => {
    const movies = fileService.readData(dataFilePath);
    return movies.find(movie => movie.id === id);
};

const create = (movieData) => {
    const movies = fileService.readData(dataFilePath);
    
    const newId = movies.length > 0 
        ? Math.max(...movies.map(m => m.id)) + 1 
        : 1;
        
    const newMovie = { id: newId, ...movieData };
    movies.push(newMovie);
    fileService.writeData(dataFilePath, movies);
    
    return newMovie;
};

const update = (id, movieData) => {
    const movies = fileService.readData(dataFilePath);
    const index = movies.findIndex(m => m.id === id);
    
    if (index === -1) return null;
    
    movies[index] = { ...movies[index], ...movieData };
    fileService.writeData(dataFilePath, movies);
    
    return movies[index];
};

const remove = (id) => {
    const movies = fileService.readData(dataFilePath);
    const filteredMovies = movies.filter(m => m.id !== id);
    
    if (filteredMovies.length === movies.length) {
        return false;
    }
    
    fileService.writeData(dataFilePath, filteredMovies);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };