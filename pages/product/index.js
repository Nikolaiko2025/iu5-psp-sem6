import {MainPage} from "../main/index.js";

const API_URL = 'http://localhost:3000/movies';

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
    }

    async getData() {
        const response = await fetch(`${API_URL}/${this.id}`);
        return await response.json();
    }

    get pageRoot() {
        return document.getElementById('product-page')
    }

    getHTML() {
        return `<div id="product-page"></div>`
    }

    clickBack() {
        const mainPage = new MainPage(this.parent)
        mainPage.render()
    }

    async render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const data = await this.getData()
        this.pageRoot.innerHTML = `
            <div class="product-layout">
                <div class="product-info">
                    <div class="product-header">
                        <img class="product-poster" src="${data.img}" alt="${data.title}">
                        <div class="product-title-wrap">
                            <h1 class="product-title">${data.title}</h1>
                            <div class="product-meta">
                                <span class="product-rating">★ ${data.rating || '8.0'}</span>
                                <span>${data.year || '2020'}</span>
                                <span>${data.duration || '2 ч.'}</span>
                                <span class="product-age">${data.badge}</span>
                            </div>
                        </div>
                    </div>
                    <div class="product-genres">
                        ${(data.genres || ['Фильм']).map(g => `<span class="genre-tag">${g}</span>`).join('')}
                    </div>
                    <p class="product-desc">${data.text}</p>
                    <div class="product-actions">
                        <button class="btn-watch">
                            <span>▶</span> Смотреть
                        </button>
                        <button class="btn-favorite" id="back-button">
                            ← Вернуться
                        </button>
                    </div>
                </div>
                <div class="product-video">
                    <img class="video-poster" src="${data.img}" alt="${data.title}">
                    <div class="video-play">
                        <span>▶</span>
                    </div>
                </div>
            </div>
        `

        document.getElementById("back-button").addEventListener("click", this.clickBack.bind(this))
    }
}