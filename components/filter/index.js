export class FilterComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <div class="filter-container mb-4">
                <input type="text" id="filter-input" class="filter-input" placeholder="Поиск по названию...">
            </div>
        `
    }

    getStyles() {
        return `
            <style>
                .filter-container {
                    display: flex;
                    justify-content: center;
                }
                .filter-input {
                    width: 100%;
                    max-width: 400px;
                    padding: 12px 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 77, 77, 0.3);
                    border-radius: 30px;
                    color: white;
                    font-size: 16px;
                    outline: none;
                    transition: all 0.3s ease;
                }
                .filter-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }
                .filter-input:focus {
                    border-color: #ff4d4d;
                    background: rgba(255, 255, 255, 0.15);
                    box-shadow: 0 0 15px rgba(255, 77, 77, 0.2);
                }
            </style>
        `
    }

    addListeners(callback) {
        const input = document.getElementById('filter-input');
        input.addEventListener('input', (e) => {
            callback(e.target.value);
        });
    }

    render(callback) {
        const styleContainer = document.getElementById('style-container') || document.head;
        styleContainer.insertAdjacentHTML('beforeend', this.getStyles());
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.addListeners(callback);
    }
}