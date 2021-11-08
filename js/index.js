var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var link = document.getElementById("theme-link");
var Card = /** @class */ (function () {
    function Card() {
        this.API = "https://api.openweathermap.org/data/2.5/";
        this.key = "597979cc37960a1798c02999147019f3";
        this.city = "Moscow";
        this.weather = null;
        this.temp = null;
        this.imageURL = "http://openweathermap.org/img/w/";
        this.id = null;
        this.count = 40;
        this.list = null;
        this.isActive = false;
        this.date = null;
    }
    Card.prototype.createDefaultCard = function () {
        var _a;
        var defaultDiv = document.createElement("div");
        defaultDiv.classList.add("weather__card");
        defaultDiv.innerText = "Enter your city";
        (_a = document.querySelector(".weather__cards")) === null || _a === void 0 ? void 0 : _a.appendChild(defaultDiv);
    };
    Card.prototype.loadInformation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.showLoader();
                        return [4 /*yield*/, fetch(this.API + "weather?q=" + this.city + "&appid=" + this.key)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        this.weather = data.weather[0];
                        this.temp = data.main;
                        this.city = data.name;
                        this.id = data.id;
                        this.hideLoader();
                        return [2 /*return*/];
                }
            });
        });
    };
    Card.prototype.renderCard = function () {
        var placeCard = document.querySelector(".weather__cards");
        var template = document.querySelector(".weather__card-template").content;
        var content = document.importNode(template, true);
        var cardItem = content.querySelector(".weather__card");
        var clonedCardItem = cardItem === null || cardItem === void 0 ? void 0 : cardItem.cloneNode(true);
        var cardCity = clonedCardItem.querySelector(".weather__card-city");
        if (cardCity != null && this.city != null) {
            if ((placeCard === null || placeCard === void 0 ? void 0 : placeCard.childNodes.length) === 3) {
                cardCity.innerHTML = this.city;
            }
            else {
                if (this.date != null) {
                    cardCity.innerHTML = this.date;
                }
            }
        }
        if (this.weather != null && this.temp != null) {
            var imageId = this.weather.icon + ".png";
            clonedCardItem.querySelector(".weather__card-temp").innerHTML =
                Math.round(this.temp.temp - 273) + " &#176 C";
            clonedCardItem.querySelector(".weather__card-description").innerHTML = this.weather.main;
            clonedCardItem.querySelector(".weather__card-image").setAttribute("src", this.imageURL + imageId);
        }
        placeCard === null || placeCard === void 0 ? void 0 : placeCard.appendChild(clonedCardItem);
        this.isActive = false;
    };
    Card.prototype.deleteOldCard = function () {
        var oldCard = document.querySelectorAll(".weather__card");
        if (oldCard !== null) {
            oldCard.forEach(function (card) { return card.remove(); });
        }
    };
    Card.prototype.changeCard = function (city) {
        this.city = city;
    };
    Card.prototype.getMoreInformation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, _i, _a, card;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.showLoader();
                        return [4 /*yield*/, fetch(this.API + "forecast?id=" + this.id + "&cnt=" + this.count + "&appid=" + this.key)];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _b.sent();
                        this.list = data.list;
                        if (this.list) {
                            for (_i = 0, _a = this.list; _i < _a.length; _i++) {
                                card = _a[_i];
                                this.weather = card.weather[0];
                                this.temp = card.main;
                                this.date = card.dt_txt;
                                this.renderCard();
                            }
                        }
                        this.hideLoader();
                        this.isActive = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Card.prototype.hideMoreInformation = function () {
        var moreCard = Array.from(document.querySelectorAll(".weather__card"));
        for (var i = 1; i <= this.count; i++) {
            moreCard[i].remove();
            this.isActive = false;
        }
    };
    Card.prototype.showLoader = function () {
        var template = document.querySelector(".loader-template").content;
        var content = document.importNode(template, true);
        var placeLoader = document.querySelector(".container");
        placeLoader === null || placeLoader === void 0 ? void 0 : placeLoader.insertBefore(content, document.querySelector("header"));
    };
    Card.prototype.hideLoader = function () {
        var _a;
        (_a = document.querySelector(".loader")) === null || _a === void 0 ? void 0 : _a.remove();
    };
    return Card;
}());
var weather = new Card();
weather.createDefaultCard();
var searchInput = document.querySelector(".search__city");
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("keypress", function (e) {
    if (e.code === "Enter") {
        if (!(searchInput === null || searchInput === void 0 ? void 0 : searchInput.value)) {
            console.log("Empty request");
        }
        else {
            weather.changeCard(searchInput.value);
            weather
                .loadInformation()
                .then(function () {
                var _a;
                weather.deleteOldCard();
                weather.renderCard();
                (_a = document
                    .querySelector(".weather__card")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function (e) {
                    if (!weather.isActive) {
                        weather
                            .getMoreInformation()
                            .then(function () {
                            var _a;
                            (_a = document
                                .querySelector(".weather__card")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function (e) {
                                var _a;
                                if (((_a = document.querySelectorAll(".weather__card")) === null || _a === void 0 ? void 0 : _a.length) >
                                    1) {
                                    weather.hideMoreInformation();
                                }
                            });
                        })["catch"](function () {
                            var _a;
                            weather.hideLoader();
                            var errorDiv = document.createElement("div");
                            weather.deleteOldCard();
                            errorDiv.classList.add("weather__card");
                            errorDiv.innerText = "Loading Error";
                            (_a = document
                                .querySelector(".weather__cards")) === null || _a === void 0 ? void 0 : _a.appendChild(errorDiv);
                        });
                    }
                });
            })["catch"](function () {
                var _a;
                weather.hideLoader();
                weather.deleteOldCard();
                var errorDiv = document.createElement("div");
                errorDiv.classList.add("weather__card");
                errorDiv.innerText = "City is not found";
                (_a = document.querySelector(".weather__cards")) === null || _a === void 0 ? void 0 : _a.appendChild(errorDiv);
            });
            searchInput.value = "";
        }
    }
});
function changeTheme() {
    var lightTheme = "css/light.css";
    var darkTheme = "css/dark.css";
    var currentTheme = link === null || link === void 0 ? void 0 : link.getAttribute("href");
    if (currentTheme === darkTheme) {
        currentTheme = lightTheme;
    }
    else {
        currentTheme = darkTheme;
    }
    link === null || link === void 0 ? void 0 : link.setAttribute("href", currentTheme);
}
var switchTheme = document.querySelector(".checkTheme");
switchTheme === null || switchTheme === void 0 ? void 0 : switchTheme.addEventListener("click", function (e) {
    changeTheme();
});
var btn = document.querySelector(".scrollToTop");
btn === null || btn === void 0 ? void 0 : btn.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
});
window.addEventListener("scroll", function () {
    if (btn) {
        if (window.pageYOffset > window.screen.height) {
            btn.style.display = "block";
        }
        else {
            btn.style.display = "none";
        }
    }
});
