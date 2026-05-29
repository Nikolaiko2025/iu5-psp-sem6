class StockUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getMovies() {
        return `${this.baseUrl}/movies`;
    }

    getMoviesWithFilter(title) {
        const url = `${this.baseUrl}/movies`;
        if (title) {
            return `${url}?title=${encodeURIComponent(title)}`;
        }
        return url;
    }

    getMovieById(id) {
        return `${this.baseUrl}/movies/${id}`;
    }

    createMovie() {
        return `${this.baseUrl}/movies`;
    }

    removeMovieById(id) {
        return `${this.baseUrl}/movies/${id}`;
    }

    updateMovieById(id) {
        return `${this.baseUrl}/movies/${id}`;
    }
}

export const stockUrls = new StockUrls();