import {ProductCardComponent} from "../../components/product-card/index.js";
import {ProductPage} from "../product/index.js";
import {FilterComponent} from "../../components/filter/index.js";
import {ajax} from "../../modules/ajax.js";
import {stockUrls} from "../../modules/stockUrls.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    get pageRoot() {
        return document.getElementById('main-page')
    }

    get filterRoot() {
        return document.getElementById('filter-container')
    }

    getHTML() {
        return `
            <div class="center-container">
                <div class="main-content">
                    <h1 class="text-center text-white mb-4">Популярные фильмы</h1>
                    <div id="filter-container"></div>
                    <div id="main-page" class="d-flex justify-content-center flex-wrap gap-4"></div>
                </div>
            </div>
        `
    }

    clickCard(e) {
        const card = e.target.closest('[data-id]')
        const cardId = card?.dataset.id
        const productPage = new ProductPage(this.parent, cardId)
        productPage.render()
    }

    renderData(items) {
        this.pageRoot.innerHTML = '';
        items.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot)
            productCard.render(item, this.clickCard.bind(this))
        })
    }

    getData(title = '') {
        ajax.get(stockUrls.getMoviesWithFilter(title), (data) => {
            if (data) {
                this.renderData(data);
            }
        })
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const filterComponent = new FilterComponent(this.filterRoot)
        filterComponent.render((title) => {
            this.getData(title);
        })

        this.getData()
    }
}