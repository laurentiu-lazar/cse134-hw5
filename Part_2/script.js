class CurrentWeather extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

		this.shadowRoot.innerHTML = `
        <style>
            :host {
                font-family: arial;
                border: 3px solid black;
                border-radius: 1.5em;
                padding: 0 1em 1em 1em;
                width: 15em;

                text-align: center;
                font-size: large;

                color: var(--text-color, black);
                background-color: var(--background-color, white);
            }

            output img{
                height: 1em;
                width: 1em;
                margin-right: .3em;
            }

            output{
                display:block;
                padding: .5em;
                border-radius: 1em;
                color: white;

                background-color:black;
            }

            details{
                margin-top: 1em;
                text-align: left;
            }
        </style>

        <h2>Current weather</h2>
        <output>
        <img src="" alt="" id="icon" height="" width="">
        <span id="text"></span><br>

        </output>

        <details style="display: none;">
            <ul>
            </ul>
        </details>
        `;

    }

    connectedCallback(){
        let output = this.shadowRoot.querySelector('output #text');
        let icon = this.shadowRoot.querySelector('output #icon');
        let list = this.shadowRoot.querySelector('details ul')

        fetch('https://api.weather.gov/points/32.8426,-117.2577', {
			method: 'get'
		})
        .then(response => response.json())
        .then(data => data.properties.forecast)
        .then(url => {
            fetch(url, {method: 'get'})
            .then(response => response.json())
            .then(data => data.properties.periods)
            .then(data => data[0])
            .then(weather => {
                this.weather = weather;
                this.updateElement(output, icon, list, weather)
            })
            .catch(error => {
                output.innerText = 'An error occured';
            });
        })
        .catch(error => {
            output.innerText = 'An error occured';
        });
    }

    updateElement(output, icon, list, weather){
        output.innerText = `${weather.shortForecast} ${weather.temperature}°${weather.temperatureUnit}`;

        let item = document.createElement("li");
        item.innerText = weather.detailedForecast;
        list.appendChild(item);

        item = document.createElement("li");
        item.innerText = `Humidity: ${weather.relativeHumidity.value}%`;
        list.appendChild(item);

        item = document.createElement("li");
        item.innerText = `Wind speed: ${weather.windSpeed}`;
        list.appendChild(item);

        item = document.createElement("li");
        item.innerText = `Wind direction: ${weather.windDirection}`;
        list.appendChild(item);

        switch (weather.shortForecast){
            case 'Sunny':
                icon.src = '../assets/SVG/day_clear.svg';
                break;
            case 'Mostly Sunny':
                icon.src = '../assets/SVG/day_clear.svg';
                break;
            case 'Mostly Clear':
                icon.src = '../assets/SVG/day_clear.svg';
                break;
            case 'Mostly Cloudy':
                icon.src = '../assets/SVG/cloudy.svg';
                break;
            case 'Cloudy':
                icon.src = '../assets/SVG/cloudy.svg';
                break;
            default:
                icon.style.display = 'none';
                break;
        }

        this.shadowRoot.querySelector('details').style.display = "block";
    }
}

customElements.define('current-weather', CurrentWeather);