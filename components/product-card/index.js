export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return (
            `
                <div class="card" id="click-card-${data.id}" data-id="${data.id}" style="width: 300px; height: 400px; background-image: url('${data.img}?w=400'); background-size: cover; background-position: center; position: relative; cursor: pointer; overflow: hidden; border-radius: 16px; transition: transform 0.4s, opacity 0.4s; box-shadow: none; border: none;" data-id="${data.id}">
                    <div class="card-overlay" style="position: absolute; inset: 0; background: rgba(7, 5, 14, 0); padding: 15px; display: flex; flex-direction: column; justify-content: flex-end; transition: background 0.4s ease; border-radius: 16px;">
                        <div class="card-content" style="transform: translateY(20px); opacity: 0; transition: all 0.4s ease;">
                            <h5 class="card-title" style="color: white; margin-bottom: 8px;">${data.title}</h5>
                            <p class="card-text" style="color: white; font-size: 14px;">${data.text}</p>
                        </div>
                    </div>
                    <span class="badge position-absolute top-0 end-0 m-2 ${data.badgeColor}">${data.badge}</span>
                </div>
            `
        )
    }

    addListeners(data, listener) {
        const card = document.getElementById(`click-card-${data.id}`)
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.04)'
            card.style.boxShadow = 'none'
            card.style.border = 'none'
            card.querySelector('.card-overlay').style.background = 'rgba(7, 5, 14, 0.8)'
            card.querySelector('.card-content').style.transform = 'translateY(0)'
            card.querySelector('.card-content').style.opacity = '1'
        })
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)'
            card.style.boxShadow = 'none'
            card.style.border = 'none'
            card.querySelector('.card-overlay').style.background = 'rgba(7, 5, 14, 0)'
            card.querySelector('.card-content').style.transform = 'translateY(20px)'
            card.querySelector('.card-content').style.opacity = '0'
        })
        
        card.addEventListener('click', listener)
    }

    render(data, listener) {
        const html = this.getHTML(data)
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(data, listener)
    }
}