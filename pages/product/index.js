import {MainPage} from "../main/index.js";
import {ajax} from "../../modules/ajax.js";
import {stockUrls} from "../../modules/stockUrls.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
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

    async clickDelete() {
        if (confirm('Вы уверены, что хотите удалить этот фильм?')) {
            const response = await ajax.delete(stockUrls.removeMovieById(this.id));
            if (response.ok) {
                this.clickBack();
            } else {
                alert('Ошибка при удалении фильма');
            }
        }
    }

    renderData(item) {
        const isVite = window.location.port === '5173'

        this.pageRoot.innerHTML = `
            <div class="product-layout">
                <div class="product-info">
                    <div class="product-header">
                        <img class="product-poster" src="${item.img}" alt="${item.title}">
                        <div class="product-title-wrap">
                            <h1 class="product-title">${item.title}</h1>
                            <div class="product-meta">
                                <span class="product-rating">★ ${item.rating || '8.0'}</span>
                                <span>${item.year || '2020'}</span>
                                <span>${item.duration || '2 ч.'}</span>
                                <span class="product-age">${item.badge}</span>
                            </div>
                        </div>
                    </div>
                    <div class="product-genres">
                        ${(item.genres || ['Фильм']).map(g => `<span class="genre-tag">${g}</span>`).join('')}
                    </div>
                    <p class="product-desc">${item.text}</p>
                    <div class="product-actions">
                        <button class="btn-watch">
                            <span>▶</span> Смотреть
                        </button>
                        <div class="action-buttons-row">
                            <button class="btn-favorite" id="back-button">
                                ← Вернуться
                            </button>
                            ${isVite ? '' : `<button class="btn-delete-circle" id="delete-button" title="Удалить">🗑</button>`}
                        </div>
                    </div>
                </div>
                <div class="product-video">
                    <img class="video-poster" src="${item.img}" alt="${item.title}">
                    <div class="video-play">
                        <span>▶</span>
                    </div>
                </div>
            </div>
        `

        document.getElementById("back-button").addEventListener("click", this.clickBack.bind(this))

        if (!isVite) {
            document.getElementById("delete-button").addEventListener("click", this.clickDelete.bind(this))
        }
    }

    async getData() {
        const data = await ajax.get(stockUrls.getMovieById(this.id));
        if (data) {
            this.renderData(data);
        }
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        this.getData()
    }
}