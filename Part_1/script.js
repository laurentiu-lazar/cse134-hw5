class RatingWidget extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

		this.shadowRoot.innerHTML = `
            <style>
                :host {
                    border: 3px solid black;
                    border-radius: 20px;
                    display: inline-block;
                    font-size: large;

                    padding: 0 1em;
                    width: 10em;

                    transition: height 1s;

                    text-align: center;

                    color: var(--text-color, black);
                    background-color: var(--background-color, white);
                }
                .star{
                    font-size:2em;
                }
                slot {
                    box-sizing: border-box;
                    display: none;
                }
                #rating{
                    // border:1px solid red;
                    display: flex;
                    justify-content: stretch;
                    cursor: pointer;
                }
                #rating span{
                    flex-grow:1;
                    // border:1px solid blue;
                    color: var(--star-inactive, gray);
                }
                #rating:hover span:not(:hover ~span){ /* */
                    color: var(--star-hover, black);
                }
                #rating:active span:not(:hover ~span){
                    color: var(--star-active, yellow);
                }

                output{
                    margin-bottom: 1em;
                    display: none;
                }
            </style>
            <slot></slot>
            <h2>Rating widget</h2>
            <p id="rating"></p>
            <output></output>
        `;

    }

    connectedCallback(){
        let stars = document.querySelector('#rating');
        console.log(stars);
        this.nrStars = stars.max;

        let rating = this.shadowRoot.getElementById('rating');
        
        for(let i = 0; i < this.nrStars; i++){
            let star = document.createElement('span');
            star.className = 'star';
            star.innerText = '★';
            star.dataset.value = i + 1;
            star.onclick = (e) => {this.submitRating(this, e);};

            rating.appendChild(star);
        }
    }

    submitRating(root, event){
        let rating = event.target.dataset.value;
        let maxRating = root.nrStars;
        // console.log(`${rating}/${maxRating}`);

        root.shadowRoot.getElementById('rating').style.display='none';

        let output = root.shadowRoot.querySelector('output');
        if(rating < maxRating*8/10)
            output.innerText = `Thanks for your feedback of ${rating} stars. We'll try to do beter!`;
        else
            output.innerText = `Thanks for the ${rating} star rating!`;

        output.style.display = 'inline-block';

        document.querySelector('#rating').value = rating;
        document.querySelector('form input[name=sentBy]').value = 'JS';
        let formData = new FormData(document.forms[0]);

        fetch('https://httpbin.org/post', {
			method: 'POST',
			body: formData,
            headers: {
                'X-Sent-By': 'JS'
            }
		})
        .then(response => response.json())
        .then(data => {
            // Display the response
            console.log(JSON.stringify(data, null, 2));
        })
        .catch(error => {
            console.error('Error:', error);
        });

    }
}

customElements.define('rating-widget', RatingWidget);