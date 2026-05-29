import {ProductCardComponent} from "../../components/product-card/index.js";
import {ProductPage} from "../product/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getData() {
        return [
            {
                id: 1,
                img: "image/film1/интерстеллар.jpg?w=400",
                title: "Интерстеллар",
                text: "Фантастический фильм о космическом путешествии",
                badge: "Хит",
                badgeColor: "bg-danger"
            },
            {
                id: 2,
                img: "image/film1/Начало.jpg?w=400",
                title: "Начало",
                text: "Триллер о мире сновидений",
                badge: "Новинка",
                badgeColor: "bg-success"
            },
            {
                id: 3,
                img: "image/film1/Побег из Шоушенка.jpg?w=400",
                title: "Побег из Шоушенка",
                text: "Драма о надежде и свободе",
                badge: "Топ",
                badgeColor: "bg-primary"
            }
        ]
    }

    get pageRoot() {
        return document.getElementById('main-page')
    }

    getHTML() {
        return (
            `
                <div class="center-container">
                    <div class="main-content">
                        <h1 class="text-center text-white mb-4">Популярные фильмы</h1>
                        <div id="main-page" class="d-flex justify-content-center flex-wrap gap-4"></div>
                    </div>
                </div>
            `
        )
    }

    clickCard(e) {
        const card = e.target.closest('[data-id]')
        const cardId = card?.dataset.id
        const productPage = new ProductPage(this.parent, cardId)
        productPage.render()
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const data = this.getData()
        data.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot)
            productCard.render(item, this.clickCard.bind(this))
        })
    }
}
