import {MainPage} from "../main/index.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
    }

    getData() {
        const products = [
            {
                id: 1,
                img: "image/film1/интерстеллар.jpg?w=400",
                title: "Интерстеллар",
                text: "Фантастический фильм о космическом путешествии. Когда Земля становится непригодной для жизни, группа исследователей отправляется через червоточину в поисках нового дома для человечества.",
                badge: "Хит",
                badgeColor: "bg-danger",
                rating: "8,7",
                year: "2014",
                duration: "2 ч. 49 мин.",
                country: "США",
                genres: ["Фантастика", "Драма", "Приключения"]
            },
            {
                id: 2,
                img: "image/film1/Начало.jpg?w=400",
                title: "Начало",
                text: "Триллер о мире сновидений. Кобб — талантливый вор, который крадет секреты из глубин подсознания людей во время сна.",
                badge: "Новинка",
                badgeColor: "bg-success",
                rating: "8,8",
                year: "2010",
                duration: "2 ч. 28 мин.",
                country: "США",
                genres: ["Фантастика", "Боевик", "Триллер"]
            },
            {
                id: 3,
                img: "image/film1/Побег из Шоушенка.jpg?w=400",
                title: "Побег из Шоушенка",
                text: "Драма о надежде и свободе. История Энди Дюфрейна, который провел 20 лет в тюрьме Шоушенк и не потерял надежду.",
                badge: "Топ",
                badgeColor: "bg-primary",
                rating: "9,1",
                year: "1994",
                duration: "2 ч. 22 мин.",
                country: "США",
                genres: ["Драма"]
            }
        ];
        return products.find(p => p.id === parseInt(this.id));
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

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const data = this.getData()
        this.pageRoot.innerHTML = `
            <div class="product-layout">
                <div class="product-info">
                    <div class="product-header">
                        <img class="product-poster" src="${data.img}" alt="${data.title}">
                        <div class="product-title-wrap">
                            <h1 class="product-title">${data.title}</h1>
                            <div class="product-meta">
                                <span class="product-rating">★ ${data.rating}</span>
                                <span>${data.year}</span>
                                <span>${data.duration}</span>
                                <span class="product-age">${data.badge}</span>
                            </div>
                        </div>
                    </div>
                    <div class="product-genres">
                        ${data.genres.map(g => `<span class="genre-tag">${g}</span>`).join('')}
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
