let link = document.getElementById("theme-link");
console.log(link);
class Card {
    constructor() {
        this.API = "https://api.openweathermap.org/data/2.5/";
        this.key = "597979cc37960a1798c02999147019f3"
        this.city = "Moscow";
        this.weather = {};
        this.temp = {};
        this.imageURL = "http://openweathermap.org/img/w/";
        this.searchProcess = false;
        this.id = null;
        this.count = 40;
        this.list = [];
        this.isActive = false;
        this.date = null;
    }

    createDefaultCard() {
        const defaultDiv = document.createElement("div")

        defaultDiv.classList.add("weather__card");
        defaultDiv.innerText = "Enter your city"
        document.querySelector(".weather__cards").appendChild(defaultDiv);
    }

    async loadInformation() {
        const response = await fetch(`${this.API}weather?q=${this.city}&appid=${this.key}`);
        const data = await response.json();
        this.weather = data.weather[0];
        this.temp = data.main;
        this.city = data.name;
        this.id = data.id;
        console.log(this.weather);
        console.log(this.temp);
    }

    renderCard() {
        const placeCard = document.querySelector(".weather__cards");
        const template = document.querySelector(".weather__card-template");
        const content = document.importNode(template.content, true);
        const cartItem = content.querySelector(".weather__card");
        let clonedCartItem = cartItem.cloneNode(true);

        if (placeCard.childNodes.length === 3) {
            clonedCartItem.querySelector(".weather__card-city").innerHTML = this.city;
        } else {
            clonedCartItem.querySelector(".weather__card-city").innerHTML = this.date;
        }
        const imageId = this.weather.icon + ".png";
        clonedCartItem.querySelector(".weather__card-temp").innerHTML = parseInt(this.temp.temp - 273) + " &#176 C";
        clonedCartItem.querySelector(".weather__card-description").innerHTML = this.weather.main;
        clonedCartItem.querySelector(".weather__card-image").setAttribute("src", this.imageURL + imageId);
        placeCard.appendChild(clonedCartItem);

        this.isActive = false;
    }

    deleteOldCard() {
        const oldCard = document.querySelectorAll(".weather__card");

        if (oldCard !== null) {
            oldCard.forEach((card) => card.remove())
        }
    }

    changeCard(city) {
        this.searchProcess = true;
        this.city = city;
    }

    async getMoreInformation() {
        const response = await fetch(`${this.API}forecast?id=${this.id}&cnt=${this.count}&appid=${this.key}`);
        const data = await response.json();
        this.list = data.list;
        console.log(this.list);
        for (let card of this.list) {
            this.weather = card.weather[0];
            this.temp = card.main;
            this.date = card.dt_txt;
            this.renderCard()
        }
        this.isActive = true;
    }

    hideMoreInformation() {
        console.log("hello");
        const moreCard = Array.from(document.querySelectorAll(".weather__card"));
        for (let i = 1; i <= this.count; i++) {
            moreCard[i].remove();
            this.isActive = false;
        }
    }
}

const weather = new Card();
weather.createDefaultCard();

searchInput = document.querySelector(".search__city");

searchInput.addEventListener("keypress", (e) => {
    if (e.code === 'Enter') {
        if (!searchInput.value) {
            console.log("Empty request");
        } else {
            weather.changeCard(searchInput.value);
            weather.loadInformation()
                .then(() => {
                    weather.deleteOldCard();
                    weather.renderCard();
                    document.querySelector(".weather__card").addEventListener("click", (e) => {
                        if (!weather.isActive) {
                        weather.getMoreInformation()
                            .then(() => {
                                document.querySelector(".weather__card").addEventListener("click", (e) =>{
                                    if (document.querySelectorAll(".weather__card").length > 1) {
                                        weather.hideMoreInformation();
                                    }
                                })
                            })
                            .catch(() => console.log("error"))
                        }
                    })
                })
                .catch(() => {
                    weather.deleteOldCard();
                    const errorDiv = document.createElement("div")

                    errorDiv.classList.add("weather__card");
                    errorDiv.innerText = "City is not found"
                    document.querySelector(".weather__cards").appendChild(errorDiv);
                });
            searchInput.value = "";
        }
    }
});

const switchTheme = document.querySelector(".checkTheme");
switchTheme.addEventListener("click", (e) => {
    ChangeTheme()
});

function ChangeTheme() {
    console.log(1);
    const lightTheme = "css/light.css";
    const darkTheme = "css/dark.css";

    let currentTheme = link.getAttribute("href");

    if (currentTheme === darkTheme) {
        currentTheme = lightTheme;
    } else {
        currentTheme = darkTheme;
    }
    console.log(currentTheme);
    link.setAttribute("href", currentTheme);
}

const btn = document.querySelector(".scrollToTop");
btn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
})
window.addEventListener('scroll', function() {
    if (window.pageYOffset > window.screen.height) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
});
