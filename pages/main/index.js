import {ProductCardComponent} from "../../components/product-card/index.js";
import {ProductPage} from "../product/index.js";

const API_URL = 'http://localhost:3000/movies';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    async getData() {
        const response = await fetch(API_URL);
        return await response.json();
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

    async render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const data = await this.getData()
        data.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot)
            productCard.render(item, this.clickCard.bind(this))
        })
    }
}