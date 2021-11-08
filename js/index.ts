let link: HTMLElement | null = document.getElementById("theme-link");

interface BasicInformation {
  id: number;
  main: TempInformation;
  name: string;
  weather: WeatherInformation[];
}

interface WeatherInformation {
  main: string;
  icon: string;
}

interface TempInformation {
  temp: number;
}

interface MoreInformation {
  dt_txt: string;
  main: TempInformation;
  weather: WeatherInformation[];
}

interface MoreInformationResponse {
  list: MoreInformation[];
}

class Card {
  private API: string;
  private key: string;
  private city: string | null;
  private weather: WeatherInformation | null;
  private temp: TempInformation | null;
  private imageURL: string;
  private id: number | null;
  private count: number;
  private list: null | MoreInformation[];
  public isActive: boolean;
  private date: string | null;

  constructor() {
    this.API = "https://api.openweathermap.org/data/2.5/";
    this.key = "597979cc37960a1798c02999147019f3";
    this.city = null;
    this.weather = null;
    this.temp = null;
    this.imageURL = "http://openweathermap.org/img/w/";
    this.id = null;
    this.count = 40;
    this.list = null;
    this.isActive = false;
    this.date = null;
  }

  createDefaultCard(): void {
    const defaultDiv: HTMLDivElement = document.createElement("div");

    defaultDiv.classList.add("weather__card");
    defaultDiv.innerText = "Enter your city";
    document.querySelector(".weather__cards")?.appendChild(defaultDiv);
  }

  async loadInformation(): Promise<void> {
    this.showLoader();
    const response: Response = await fetch(
      `${this.API}weather?q=${this.city}&appid=${this.key}`
    );
    const data: BasicInformation = await response.json();
    this.weather = data.weather[0];
    this.temp = data.main;
    this.city = data.name;
    this.id = data.id;
    this.hideLoader();
  }

  renderCard(): void {
    const placeCard: HTMLDivElement | null = document.querySelector(
      ".weather__cards"
    );
    const template: DocumentFragment = (document.querySelector(
      ".weather__card-template"
    ) as HTMLTemplateElement).content;
    const content = document.importNode(template, true);
    const cardItem: HTMLDivElement | null = content.querySelector(
      ".weather__card"
    );
    let clonedCardItem = <HTMLDivElement>cardItem?.cloneNode(true);

    let cardCity: HTMLParagraphElement | null = clonedCardItem.querySelector(
      ".weather__card-city"
    );
    if (cardCity != null && this.city != null) {
      if (placeCard?.childNodes.length === 3) {
        cardCity.innerHTML = this.city;
      } else {
        if (this.date != null) {
          cardCity.innerHTML = this.date;
        }
      }
    }
    if (this.weather != null && this.temp != null) {
      const imageId = this.weather.icon + ".png";
      (clonedCardItem.querySelector(
        ".weather__card-temp"
      ) as HTMLParagraphElement).innerHTML =
        Math.round(this.temp.temp - 273) + " &#176 C";
      (clonedCardItem.querySelector(
        ".weather__card-description"
      ) as HTMLParagraphElement).innerHTML = this.weather.main;
      (clonedCardItem.querySelector(
        ".weather__card-image"
      ) as HTMLImageElement).setAttribute("src", this.imageURL + imageId);
    }

    placeCard?.appendChild(clonedCardItem);

    this.isActive = false;
  }

  deleteOldCard(): void {
    const oldCard = document.querySelectorAll(".weather__card");

    if (oldCard !== null) {
      oldCard.forEach((card) => card.remove());
    }
  }

  changeCard(city: string): void {
    this.city = city;
  }

  async getMoreInformation(): Promise<void> {
    this.showLoader();
    const response: Response = await fetch(
      `${this.API}forecast?id=${this.id}&cnt=${this.count}&appid=${this.key}`
    );
    const data: MoreInformationResponse = await response.json();
    this.list = data.list;
    if (this.list) {
      for (let card of this.list) {
        this.weather = card.weather[0];
        this.temp = card.main;
        this.date = card.dt_txt;
        this.renderCard();
      }
    }
    this.hideLoader();
    this.isActive = true;
  }

  hideMoreInformation(): void {
    const moreCard: Element[] = Array.from(
      document.querySelectorAll(".weather__card")
    );
    for (let i = 1; i <= this.count; i++) {
      moreCard[i].remove();
      this.isActive = false;
    }
  }

  showLoader(): void {
    const template: DocumentFragment = (document.querySelector(
      ".loader-template"
    ) as HTMLTemplateElement).content;
    const content: DocumentFragment = document.importNode(template, true);
    const placeLoader: HTMLDivElement | null = document.querySelector(
      ".container"
    );
    placeLoader?.insertBefore(content, document.querySelector("header"));
  }

  hideLoader(): void {
    document.querySelector(".loader")?.remove();
  }
}

const weather: Card = new Card();
weather.createDefaultCard();

let searchInput: HTMLInputElement | null = document.querySelector(
  ".search__city"
);

searchInput?.addEventListener("keypress", (e) => {
  if (e.code === "Enter") {
    if (!searchInput?.value) {
      console.log("Empty request");
    } else {
      weather.changeCard(searchInput.value);
      weather
        .loadInformation()
        .then(() => {
          weather.deleteOldCard();
          weather.renderCard();
          document
            .querySelector(".weather__card")
            ?.addEventListener("click", (e) => {
              if (!weather.isActive) {
                weather
                  .getMoreInformation()
                  .then(() => {
                    document
                      .querySelector(".weather__card")
                      ?.addEventListener("click", (e) => {
                        if (
                          document.querySelectorAll(".weather__card")?.length >
                          1
                        ) {
                          weather.hideMoreInformation();
                        }
                      });
                  })
                  .catch(() => {
                    weather.hideLoader();
                    const errorDiv: HTMLDivElement = document.createElement(
                      "div"
                    );
                    weather.deleteOldCard();
                    errorDiv.classList.add("weather__card");
                    errorDiv.innerText = "Loading Error";
                    document
                      .querySelector(".weather__cards")
                      ?.appendChild(errorDiv);
                  });
              }
            });
        })
        .catch(() => {
          weather.hideLoader();
          weather.deleteOldCard();
          const errorDiv: HTMLDivElement = document.createElement("div");

          errorDiv.classList.add("weather__card");
          errorDiv.innerText = "City is not found";
          document.querySelector(".weather__cards")?.appendChild(errorDiv);
        });
      searchInput.value = "";
    }
  }
});

function changeTheme(): void {
  const lightTheme: string = "css/light.css";
  const darkTheme: string = "css/dark.css";

  let currentTheme = link?.getAttribute("href");

  if (currentTheme === darkTheme) {
    currentTheme = lightTheme;
  } else {
    currentTheme = darkTheme;
  }
  link?.setAttribute("href", currentTheme);
}

const switchTheme: HTMLElement | null = document.querySelector(".checkTheme");
switchTheme?.addEventListener("click", (e) => {
  changeTheme();
});

const btn: HTMLButtonElement | null = document.querySelector(".scrollToTop");
btn?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
});
window.addEventListener("scroll", function (): void {
  if (btn) {
    if (window.pageYOffset > window.screen.height) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  }
});
