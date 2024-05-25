
function showLoader () {
  gsap.fromTo(
  ".loading-page",
  { opacity: 1 },
  {
    opacity: 0,
    display: "none",
    duration: 1.5,
    delay: 3.5,
  });
  gsap.fromTo(
    ".logo-name",
    {
      y: 50,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 2,
      delay: 0.5,
    });
    gsap.fromTo(
      ".imgLogo",
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 2,
        delay: 0.5,
      });
}
showLoader();


const themeMap = {
  dark: "light",
  light: "solar",
  solar: "dark"
};

const theme = localStorage.getItem('theme') || (tmp = Object.keys(themeMap)[0],
  localStorage.setItem('theme', tmp),
  tmp);
const bodyClass = document.body.classList;
bodyClass.add(theme);

function toggleTheme() {
  const current = localStorage.getItem('theme');
  const next = themeMap[current];

  bodyClass.replace(current, next);
  localStorage.setItem('theme', next);
}
document.getElementById('themeButton').onclick = toggleTheme;

const toggleSearch = () => {
  const searchForm = document.querySelector('.search-form');
  const searchButton = document.querySelector('.search-button');
  const searchInput = document.querySelector('.search-input');

  searchButton.addEventListener('click', () => {
    searchForm.classList.toggle('active-search');
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchInput.value = '';
      searchForm.classList.remove('active-search');
    }
  });
};

toggleSearch();

const upperCase = (string) => {
  return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const cityInput = document.querySelector(".search-input");
const searchButtonDiv = document.querySelector(".search-button");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "e978e2405078911ffb037dc9ab4c9c5c"; // API key for OpenWeatherMap API

const createWeatherCard = (cityName, weatherItem, index) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date(weatherItem.dt * 1000); // Convert Unix timestamp to milliseconds
  const dayOfWeek = dayNames[date.getDay()];// Get the full name of the day of the week
  const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); // Format the date as "April 12, 2023"
  VanillaTilt.init(document.querySelectorAll(".card"), {
		max: 10,
        speed: 400,
        easing:"cubic-bezier(.03,.98,.52,.99)",
        perspective:500,
        transition:true
    });
    VanillaTilt.init(document.querySelector(".current-weather"), {
      max: 2,
          speed: 400,
          easing:"cubic-bezier(.03,.98,.52,.99)",
          perspective:500,
          transition:true
      });
  if (index === 0) { // HTML for the main weather card
    return `<div class="details">
                    <h2>${cityName} (${formattedDate})</h2>
                    <h6 class="mt-5">Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} m/s</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon d-flex justify-content-center align-items-center flex-column">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${upperCase(weatherItem.weather[0].description)}</h6>
                </div>`;
  } else { // HTML for the other five day forecast card
    return `<li class="card d-flex justify-content-center align-items-center">
                    <h3>${dayOfWeek}</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6><i class="fa-solid fa-temperature-three-quarters"></i> : ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6><i class="fa-solid fa-wind"></i> : ${weatherItem.wind.speed} m/s</h6>
                    <h6><svg xmlns="http://www.w3.org/2000/svg" style="margin-left: -28px;" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 16 16">
                    <!-- Original path -->
                    <path d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a29 29 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a29 29 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001zm0 0-.364-.343zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267"/>
                </svg>
                
                : ${weatherItem.main.humidity}%</h6>
                </li>`;

  
  }
}

const getWeatherDetails = (cityName, latitude, longitude) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
    // Filter the forecasts to get only one forecast per day
    const uniqueForecastDays = [];
    const fiveDaysForecast = data.list.filter(forecast => {
      const forecastDate = new Date(forecast.dt_txt).getDate();
      if (!uniqueForecastDays.includes(forecastDate)) {
        return uniqueForecastDays.push(forecastDate);
      }
    });

    // Clearing previous weather data
    cityInput.value = "";
    currentWeatherDiv.innerHTML = "";
    weatherCardsDiv.innerHTML = "";

    // Creating weather cards and adding them to the DOM
    fiveDaysForecast.forEach((weatherItem, index) => {
      const html = createWeatherCard(cityName, weatherItem, index);
      if (index === 0) {
        currentWeatherDiv.insertAdjacentHTML("beforeend", html);
      } else {
        weatherCardsDiv.insertAdjacentHTML("beforeend", html);
      }
    });
  }).catch(() => {
    alert("An error occurred while fetching the weather forecast!");
  });
}

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (cityName === "") return;
  const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  // Get entered city coordinates (latitude, longitude, and name) from the API response
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { lat, lon, name } = data[0];
      getWeatherDetails(name, lat, lon);
      // Fetch news articles based on the city name
      fetchNews(1, name);
      let currentQuery = name
      document.getElementById("previous").addEventListener("click", (e) => {
        e.preventDefault();
        
        if (currentPage > 1) {
          currentPage -= 1;
          fetchNews(currentPage, currentQuery);
        }
      const section = document.getElementById("newsDashboard"); 
        if (section) {
            const topPos = section.offsetTop;
            window.scrollTo({ top: topPos, behavior: 'smooth' });
        }
        
      });
      
      document.getElementById("next").addEventListener("click", (e) => {
        e.preventDefault();
        currentPage += 1;
        fetchNews(currentPage, currentQuery);
        const section = document.getElementById("newsDashboard"); 
        if (section) {
          const topPos = section.offsetTop;
          window.scrollTo({ top: topPos, behavior: 'smooth' });
        }
      });
    })
    .catch(() => {
      alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords; // Get coordinates of user location
      // Get city name from coordinates using reverse geocoding API
      const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
      fetch(API_URL).then(response => response.json()).then(data => {
        const { name } = data[0];
        getWeatherDetails(name, latitude, longitude);
        // Fetch news articles based on the city name
      }).catch(() => {
        alert("An error occurred while fetching the city name!");
      });
    },
    error => { // Show alert if user denied the location permission
      if (error.code === error.PERMISSION_DENIED) {
        alert("Geolocation request denied. Please reset location permission to grant access again.");
      } else {
        alert("Geolocation request error. Please reset location permission.");
      }
    });
}

window.onload = getUserCoordinates;
locationButton.addEventListener("click", getUserCoordinates);
searchButtonDiv.addEventListener("click", function () {
  getCityCoordinates();
});

// SEARCH BAR FOR WEATHER
document.querySelector(".search-input").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    console.log("Enter key pressed"); // Check if Enter key press is detected
    getCityCoordinates();
  }
  
});
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());


//News Dashboard

let currentQuery = cityInput.value.trim();
let currentPage = 1;

const fetchNews = async (page, q) => {
console.log(`Fetching weather news for ${q}, Page number ${page}...`);
const url =  `https://newsapi.org/v2/everything?q=weather${q ? `+${q}` : ''}
              &from=2024-05-13&pageSize=50&language=en&page=${page}
              &sortBy=popularity&apiKey=a6c079ecd6d149c582e35bdddbc399d5`;
const req = new Request(url);
//const response = await fetch(req);
let response = {
  "status": "ok",
  "totalResults": 3035,
  "articles": [
      {
          "source": {
              "id": null,
              "name": "BBC News"
          },
          "author": "Elizabeth Rizzini",
          "title": "Bank holiday weather: Rain or shine?",
          "description": "After yet more rain this week, can we expect something brighter for the long weekend?",
          "url": "https://www.bbc.com/weather/articles/c5115n3gx1do",
          "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_weather/8889/live/9fe02b10-18f4-11ef-baa7-25d483663b8e.jpg",
          "publishedAt": "2024-05-23T12:47:08Z",
          "content": "Meteorological spring continues for another week and it looks as if temperatures will climb a little further after Monday. \r\nThe general outlook is that we will keep a south-westerly wind and that it… [+906 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "BBC News"
          },
          "author": null,
          "title": "Is climate change making turbulence worse?",
          "description": "Studies have shown that climate change is increasing the risk of some types of turbulence.",
          "url": "https://www.bbc.com/news/articles/cv22endle1no",
          "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/4085/live/bd0a9200-1833-11ef-b5b9-3b5366a449c9.jpg",
          "publishedAt": "2024-05-22T12:39:34Z",
          "content": "Esme Stallard,Climate and science reporter, BBC News\r\nSevere turbulence is rare for commercial flights\r\nA Singapore Airlines flight from London to Singapore experienced severe turbulence on Tuesday t… [+4026 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "BBC News"
          },
          "author": "Harry Poole",
          "title": "From Olympic underdog to golden expectations",
          "description": "Keely Hodgkinson stood in total disbelief after winning Olympic silver three years ago - but at Paris 2024 the British 800m star only has gold on her mind.",
          "url": "https://www.bbc.com/sport/athletics/articles/cpvgvgxpk0zo",
          "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_sport/9690/live/dfd95980-138b-11ef-9c28-613aabc13dcb.jpg",
          "publishedAt": "2024-05-22T05:25:05Z",
          "content": "It is in the French capital where Hodgkinson will again battle rivals Athing Mu and Mary Moraa in pursuit of an elusive global gold. \r\nIt was Mu, 21, who beat the Briton to Olympic gold in Tokyo, and… [+1670 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "Android Central"
          },
          "author": "harish.jonnalagadda@futurenet.com (Harish Jonnalagadda)",
          "title": "POCO F6 review: The definitive flagship killer of 2024",
          "description": "Need a gaming phone that also delivers the best value? You'll want to take a look at the POCO F6.",
          "url": "https://www.androidcentral.com/phones/poco-f6-review",
          "urlToImage": "https://cdn.mos.cms.futurecdn.net/Tz5393pUvKw3tX8EXr3Cfb-1200-80.jpg",
          "publishedAt": "2024-05-23T12:15:49Z",
          "content": "POCO's F series has always been about delivering the best hardware in the mid-range segment, and while last year's F5 had a lot to offer in this area, the brand is taking things to a whole new level … [+18074 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "CNET"
          },
          "author": "Jason Coles",
          "title": "Save Your Skin and Save Yourself 25% Thanks to This Memorial Day Sale on Coola - CNET",
          "description": "This sale is a great chance to look after your skin in the hot weather and still save some money, too.",
          "url": "https://www.cnet.com/deals/save-your-skin-and-save-yourself-25-thanks-to-this-memorial-day-sale-on-coola/",
          "urlToImage": "https://www.cnet.com/a/img/resize/6195464b48018848dbb914cb6f840d7bcd0a6a3a/hub/2024/05/21/3b52253a-b3ef-438e-8a1a-e3b042734d4a/coola-memorial-day-sale.png?auto=webp&fit=crop&height=675&width=1200",
          "publishedAt": "2024-05-21T11:27:00Z",
          "content": "Summer is on its way, and that means there are a huge number of Memorial Day sales going on right now. It also means you should consider getting some more sunscreen. If you want to get some great sum… [+1012 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "CNET"
          },
          "author": "Chris Wedel",
          "title": "Best Grill and Smoker Deals for Memorial Day: Save on Traeger, Nexgrill and more - CNET",
          "description": "Summer is the perfect time to cook outside. These Memorial Day deals will save up to $450 on our top-rated grill and smokers.",
          "url": "https://www.cnet.com/deals/bestgrillandsmokerdealsformemorialday/",
          "urlToImage": "https://www.cnet.com/a/img/resize/e38374e6a9b81428b030b00e8ff4026d53930524/hub/2024/05/21/40eacf07-15a7-4c65-bba2-75af94e370b7/pxl-20240503-215658399-mp.jpg?auto=webp&fit=crop&height=675&width=1200",
          "publishedAt": "2024-05-22T13:00:00Z",
          "content": "School is out, the weather is heating up, and the days are getting longer, which means that we all get to spend more time outside. If you've been eyeing a new grill or maybe a fire pit to enjoy, thes… [+2341 chars]"
      },
      {
          "source": {
              "id": "business-insider",
              "name": "Business Insider"
          },
          "author": "ssaril@insider.com (Sarah Saril)",
          "title": "Samsung's summer sale discounts the S24 Ultra and throws in free premium earbuds, plus save $100s on top TVs",
          "description": "The Discover Samsung Summer event lasts until May 26. The best deals include hundreds of dollars off the brand's smartphones, TVs, and more.",
          "url": "https://www.businessinsider.com/guides/deals/discover-samsung-summer-event-2024-05-20",
          "urlToImage": "https://i.insider.com/664b9cd814fb5b23cc5e6769?width=1200&format=jpeg",
          "publishedAt": "2024-05-20T20:11:13Z",
          "content": "When you buy through our links, Business Insider may earn an affiliate commission. Learn more\r\nAs the weather warms up, tons of retailers kick off great sales on just about everything, from tennis sh… [+2771 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "NPR"
          },
          "author": "Scott Neuman",
          "title": "What might have caused the helicopter crash that killed Iran's president",
          "description": "Bad weather may have been a cause of Sunday's crash that killed Ebrahim Raisi. But mechanical issues, possibly exacerbated by a lack of spare parts due to U.S. sanctions, could also be a factor.",
          "url": "https://www.npr.org/2024/05/21/1252441894/iran-helicopter-crash-safety-president-raisi",
          "urlToImage": "https://media.npr.org/assets/img/2024/05/20/gettyimages-2153319416_wide-ffaae5d99e56ac385c22d7fc29c7275b09e4e5e7.jpg?s=1400&c=100&f=jpeg",
          "publishedAt": "2024-05-21T09:00:00Z",
          "content": "Iranians gather at Valiasr Square in central Tehran on May 20 to mourn the deaths of President Ebrahim Raisi, Foreign Minister Hossein Amir-Abdollahian and several others in a helicopter crash the pr… [+6671 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "NPR"
          },
          "author": "Ayana Archie",
          "title": "At least 4 people have died and 35 are injured in a tornado that swept through Iowa",
          "description": "Iowa's Department of Public Safety says there could be many more people injured. Other severe weather events, such as floods and snowstorms, are expected in other parts of the country.",
          "url": "https://www.npr.org/2024/05/23/g-s1-166/at-least-4-people-have-died-and-35-are-injured-in-a-tornado-that-swept-through-iowa",
          "urlToImage": "https://npr.brightspotcdn.com/dims3/default/strip/false/crop/8608x4840+0+899/resize/1400/quality/100/format/jpeg/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F5b%2F36%2Fe54977dd400d9c0311f1a30cd43c%2Fap24143646530084.jpg",
          "publishedAt": "2024-05-23T09:07:21Z",
          "content": "At least four people have died, and at least 35 have been injured after a tornado swept through Iowa. Other severe weather events are forecasted this week in Texas, Oklahoma, New Mexico and Montana.\r… [+2434 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "NPR"
          },
          "author": "James Hider",
          "title": "Iranian President Ebrahim Raisi, a hard-liner who crushed dissent, dies at 63",
          "description": "Iran's ultraconservative president, killed in a helicopter crash, oversaw a crackdown on women's protests and was linked to extrajudicial killings in the 1980s.",
          "url": "https://www.npr.org/2024/05/20/1252381374/iran-president-ebraim-raisi-dead-obituary-human-rights",
          "urlToImage": "https://media.npr.org/assets/img/2024/05/19/gettyimages-2153163349_wide-2accf3b711a19d20a024582294982237266167fd.jpg?s=1400&c=100&f=jpeg",
          "publishedAt": "2024-05-20T07:06:34Z",
          "content": "In this handout image supplied by the Office of the President of the Islamic Republic of Iran, Iranian President Ebrahim Raisi is pictured at the Qiz Qalasi Dam, constructed on the Aras River on the … [+3789 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "NPR"
          },
          "author": "Suzanne Nuyen",
          "title": "Ireland, Norway, Spain to recognize a Palestinian state; stay safe during turbulence",
          "description": "The leaders of Ireland, Norway and Spain will formally recognize a Palestinian state on May 28. Why planes experience turbulence and how to keep yourself safe.",
          "url": "https://www.npr.org/2024/05/22/1252873534/up-first-newsletter-ireland-norway-spain-palestinian-statehood-turbulence-safety",
          "urlToImage": "https://media.npr.org/assets/img/2024/05/22/ireland.harris.getty1_wide-cfb15649f29665a82563e663c9e3132b6b6b54ca.jpg?s=1400&c=100&f=jpeg",
          "publishedAt": "2024-05-22T12:07:50Z",
          "content": "Good morning. You're reading the Up First newsletter. Subscribe here to get it delivered to your inbox, and listen to the Up First podcast for all the news you need to start your day.\r\nToday's top st… [+6279 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "Slashdot.org"
          },
          "author": "msmash",
          "title": "'Never-Ending' UK Rain Made 10 Times More Likely By Climate Crisis, Study Says",
          "description": "The seemingly \"never-ending\" rain last autumn and winter in the UK and Ireland was made 10 times more likely and 20% wetter by human-caused global heating, a study has found. From a report: More than a dozen storms battered the region in quick succession betw…",
          "url": "https://news.slashdot.org/story/24/05/22/1731258/never-ending-uk-rain-made-10-times-more-likely-by-climate-crisis-study-says",
          "urlToImage": "https://a.fsdn.com/sd/topics/earth_64.png",
          "publishedAt": "2024-05-22T18:05:00Z",
          "content": "More than a dozen storms battered the region in quick succession between October and March, which was the second-wettest such period in nearly two centuries of records. The downpour led to severe flo… [+1060 chars]"
      },
      {
          "source": {
              "id": "business-insider",
              "name": "Business Insider"
          },
          "author": "Tom Carter",
          "title": "I was an airline pilot for 11 years. The Singapore Airlines incident shows why you should always wear your seatbelt.",
          "description": "An ex-EasyJet pilot discusses turbulence, the Singapore Airlines incident, and why passengers should always wear seatbelts when flying.",
          "url": "https://www.businessinsider.com/airline-pilot-passengers-should-always-wear-seatbelts-singapore-airlines-turbulence-2024-5",
          "urlToImage": "https://i.insider.com/664dd43320abc1efe8fc4433?width=1200&format=jpeg",
          "publishedAt": "2024-05-22T13:27:40Z",
          "content": "Emma Henderson worked as a pilot for Easyjet from 2009 to 2020.Emma Henderson.\r\n<ul><li>Captain Emma Henderson MBE was a pilot for Easyjet for over a decade. </li><li>She told Business Insider passen… [+4598 chars]"
      },
      {
          "source": {
              "id": "business-insider",
              "name": "Business Insider"
          },
          "author": "Catherine Boudreau",
          "title": "Sweeping changes to America's aging power grid are on their way to help bypass NIMBY roadblocks and state infighting",
          "description": "The federal government in the last month has made sweeping changes to how upgrades to the power grid are planned, paid for, and permitted.",
          "url": "https://www.businessinsider.com/power-grid-transmission-renewable-energy-nimby-states-ferc-2024-5",
          "urlToImage": "https://i.insider.com/664e50159fc063e829b3ef6c?width=1200&format=jpeg",
          "publishedAt": "2024-05-23T10:06:01Z",
          "content": "Anton Petrus\r\n<ul><li>It can take a decade to build transmission lines, and construction fell to an all-time low in 2022.</li><li>The delays make the US's aging power grid more vulnerable to extreme … [+8377 chars]"
      },
      {
          "source": {
              "id": "business-insider",
              "name": "Business Insider"
          },
          "author": "Kenneth Niemeyer,Cheryl Teh",
          "title": "Iranian President Ebrahim Raisi dies in helicopter crash",
          "description": "A helicopter crash killed Iran President Ebrahim Raisi on Sunday. Vice President Mohammad Mokhber is next in line as interim leader.",
          "url": "https://www.businessinsider.com/iran-president-ebrahim-raisi-dead-helicopter-crash-2024-5",
          "urlToImage": "https://i.insider.com/664a1f2114fb5b23cc5e1979?width=1200&format=jpeg",
          "publishedAt": "2024-05-20T04:40:57Z",
          "content": "Iran President Ebrahim Raisi died in a helicopter crash.Handout/Getty Images\r\n<ul><li>Iranian President Ebrahim Raisi is dead after a helicopter crash in northwestern Iran.</li><li>Iran's foreign min… [+3146 chars]"
      },
      {
          "source": {
              "id": "business-insider",
              "name": "Business Insider"
          },
          "author": "Thibault Spirlet",
          "title": "Flying a helicopter in fog can be a recipe for disaster — Kobe Bryant and now Iran's president add to a string of deaths",
          "description": "Iranian President Ebrahim Raisi died in a helicopter crash on Sunday. It follows a series of deadly helicopter crashes in foggy conditions.",
          "url": "https://www.businessinsider.com/iran-president-ebrahim-raisi-kobe-bryant-flying-helicopter-crashes-fog-2024-5",
          "urlToImage": "https://i.insider.com/664b21ad20abc1efe8fb70fb?width=1200&format=jpeg",
          "publishedAt": "2024-05-20T11:02:02Z",
          "content": "A composite image of Iranian President Ebrahim Raisi and Kobe Bryant.Getty Images\r\n<ul><li>Iranian President Ebrahim Raisi died in a helicopter crash on Sunday in foggy conditions.</li><li>The rescue… [+3420 chars]"
      },
      {
          "source": {
              "id": "business-insider",
              "name": "Business Insider"
          },
          "author": "Ellyn Lapointe",
          "title": "The 10 states where your pet is more likely to get sick from tick-borne diseases, viruses, parasites, and more",
          "description": "Analysts ranked the 50 US states by risk of dog and cat diseases. Here are the diseases to watch out for where you live.",
          "url": "https://www.businessinsider.com/top-10-riskiest-states-for-pet-dog-cat-illness-2024-5",
          "urlToImage": "https://i.insider.com/664cf1309fc063e829b3674e?width=1200&format=jpeg",
          "publishedAt": "2024-05-21T20:13:28Z",
          "content": "When it comes to your pet's health, where you live might play a big role.Lourdes Balduque/Getty Images\r\n<ul><li>A new report from Forbes Advisor ranked US states by risk of cat and dog illnesses.</li… [+6678 chars]"
      },
      {
          "source": {
              "id": "business-insider",
              "name": "Business Insider"
          },
          "author": "Dan DeFrancesco",
          "title": "Jamie Dimon might finally be ready to call it quits",
          "description": "The comings and goings of Wall Street executives are common, even at the highest levels. But Dimon and JPMorgan are a different story.",
          "url": "https://www.businessinsider.com/jamie-dimon-retirement-jpmorgan-ceo-update-plan-successor-wall-street-2024-05",
          "urlToImage": "https://i.insider.com/661456763f923f7dab05b37e?width=1200&format=jpeg",
          "publishedAt": "2024-05-21T12:45:41Z",
          "content": "AP Photo/Alex Brandon; iStock; Rebecca Zisser/BI\r\n<ul><li>This post originally appeared in the Insider Today newsletter.</li><li>You can sign up for Business Insider's daily newsletter here.</li></ul… [+7646 chars]"
      },
      {
          "source": {
              "id": "business-insider",
              "name": "Business Insider"
          },
          "author": "Alcynna Lloyd,Jordan Pandy,Dan Latu,Maria Noyen",
          "title": "The 15 best places to live in the US, where homes are cheaper and there are lots of jobs to choose from",
          "description": "The cities that top US News & World Report's list of best places to live in America tend to have a lower cost of living and a higher quality of life.",
          "url": "https://www.businessinsider.com/united-states-best-places-to-live-cheaper-homes-quality-life-2024-5",
          "urlToImage": "https://i.insider.com/664c05309fc063e829b318a2?width=1200&format=jpeg",
          "publishedAt": "2024-05-21T09:13:01Z",
          "content": "Raleigh, North Carolina.Getty Images\r\n<ul><li>US News & World Report released its 2024 list of best places to live in America.</li><li>The best cities to live in have affordable homes, plenty of jobs… [+9135 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "Harvard Business Review"
          },
          "author": null,
          "title": "The Importance of Trust for Managing Through a Crisis",
          "description": "How a vacation rental company leaned into trust to weather the COVID-19 pandemic.",
          "url": "https://hbr.org/podcast/2024/05/the-importance-of-trust-for-managing-through-a-crisis",
          "urlToImage": "https://hbr.org/resources/images/article_assets/2023/04/wide-cold-call-hbr.png",
          "publishedAt": "2024-05-21T13:22:00Z",
          "content": "BRIAN KENNY: You may have heard of the “Butterfly Effect” in which a butterfly flapping its wings in Texas leads to changes in wind patterns that cause a tornado in Brazil. It’s a simple and poetic w… [+31396 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "Design-milk.com"
          },
          "author": "Kelly Beall",
          "title": "The Elevate Indoor/Outdoor Work Height System Bolsters Productivity With Support",
          "description": "SIXINCH USA, alongside Populous, introduce the Elevate indoor/outdoor work height system that's designed to improve productivity through flexibility + support.",
          "url": "https://design-milk.com/the-elevate-indoor-outdoor-work-height-system-bolsters-productivity-with-support/",
          "urlToImage": "https://design-milk.com/images/2024/05/Elevate-SIXINCH-Populous-2.jpg",
          "publishedAt": "2024-05-22T13:00:38Z",
          "content": "There’s no doubt that comfort levels affect productivity. Forward-thinking brands with an eye on functional innovation are ahead of the game, designing specifically for environments that require flex… [+2392 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "Hackaday"
          },
          "author": "Al Williams",
          "title": "Home Assistant Display Uses E-Ink",
          "description": "[Markus] grabbed an ESP32 and created a good-looking e-ink dashboard that can act as a status display for Home Automation. However, the hardware is generic enough that it could work as a weather st…",
          "url": "https://hackaday.com/2024/05/20/home-assistant-display-uses-e-ink/",
          "urlToImage": "https://hackaday.com/wp-content/uploads/2024/05/ink.png",
          "publishedAt": "2024-05-21T05:00:57Z",
          "content": "[Markus] grabbed an ESP32 and created a good-looking e-ink dashboard that can act as a status display for Home Automation. However, the hardware is generic enough that it could work as a weather stat… [+943 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "Yahoo Entertainment"
          },
          "author": "Jesse Ferrell",
          "title": "EF5 tornado ‘drought' reaches 11 years, longest in history",
          "description": "An EF5 tornado is one of the most catastrophic weather events on Earth. Monsterous twisters of this magnitude can destroy entire neighborhoods in the blink...",
          "url": "https://www.yahoo.com/news/ef5-tornado-drought-reaches-11-125543988.html",
          "urlToImage": "https://media.zenfs.com/en/accuweather_297/acf5071a02403c3ba110d83819b4c6a0",
          "publishedAt": "2024-05-20T12:55:43Z",
          "content": "An EF5 tornado is one of the most catastrophic weather events on Earth. Monsterous twisters of this magnitude can destroy entire neighborhoods in the blink of an eye, grow to be more than a mile wide… [+3902 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "KTVI Fox 2 St. Louis"
          },
          "author": "Joey Schneider",
          "title": "St. Louis County police issue Endangered Person Advisory for missing teen",
          "description": "The St. Louis County Police Department has issued an Endangered Person Advisory in search of a missing teenage girl.",
          "url": "https://fox2now.com/news/missouri/st-louis-county-police-issue-endangered-person-advisory-for-missing-teen-2/",
          "urlToImage": "https://media.zenfs.com/en/ktvi_articles_498/7ec6b74f0359be54514d9c12db9f94c4",
          "publishedAt": "2024-05-21T19:26:34Z",
          "content": "ST. LOUIS The St. Louis County Police Department has issued an Endangered Person Advisory in search of a missing teenage girl.\r\nThe advisory was issued for 17-year-old Allyson Cann.\r\nInvestigators sa… [+728 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "KTLA Los Angeles"
          },
          "author": "Travis Schlepp",
          "title": "Man arrested in connection with violent attacks in Santa Monica",
          "description": "Police have arrested a man who they allege was responsible for attacking three people in Santa Monica Sunday evening. Larry Ameyal Cedeno, 29, is suspected...",
          "url": "https://ktla.com/news/local-news/man-arrested-in-connection-with-violent-attacks-in-santa-monica/",
          "urlToImage": "https://media.zenfs.com/en/ktla_articles_362/2de54080f718af32c5bad8da495e7a7f",
          "publishedAt": "2024-05-20T22:32:20Z",
          "content": "Police have arrested a man who they allege was responsible for attacking three people in Santa Monica Sunday evening.\r\nLarry Ameyal Cedeno, 29, is suspected in a seemingly unprovoked attack that happ… [+1363 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "NBC4 WCMH-TV"
          },
          "author": "Daniel Griffin",
          "title": "Former Buckeye arrested on federal charges",
          "description": "COLUMBUS, Ohio (WCMH) — A former Ohio State University football player was taken into custody by the U.S. Marshals Service in Columbus Wednesday for a parole...",
          "url": "https://www.nbc4i.com/news/local-news/columbus/former-buckeye-arrested-on-federal-charges/",
          "urlToImage": "https://media.zenfs.com/en/wcmh_articles_195/29eeabf095500bcb4680b6d9575f1541",
          "publishedAt": "2024-05-22T19:54:12Z",
          "content": "COLUMBUS, Ohio (WCMH) A former Ohio State University football player was taken into custody by the U.S. Marshals Service in Columbus Wednesday for a parole violation.\r\nCorey Davonta Smith Jr., 31, wh… [+1159 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "Wearegreenbay.com"
          },
          "author": "Indiana Schilz",
          "title": "Authorities looking for Wisconsin man who fled crash scene after passenger died",
          "description": "LEWISTON, Wis. (WFRV) – Authorities in Wisconsin are searching for a 26-year-old man who allegedly fled the scene after crashing his vehicle, which killed a ...",
          "url": "https://www.wearegreenbay.com/news/local-news/authorities-looking-for-wisconsin-man-who-fled-crash-scene-after-passenger-died/",
          "urlToImage": "https://media.zenfs.com/en/wfrv_articles_965/79a44ceb18c050882c6d6075b4b3712f",
          "publishedAt": "2024-05-20T19:20:36Z",
          "content": "LEWISTON, Wis. (WFRV) Authorities in Wisconsin are searching for a 26-year-old man who allegedly fled the scene after crashing his vehicle, which killed a 21-year-old woman.\r\nAccording to the Columbi… [+1236 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "KOIN.com"
          },
          "author": "Andrew Foran",
          "title": "Man accused of bias crime after downtown Portland dog attack",
          "description": "A man faces assault and bias crime charges after an alleged attack in Southwest Portland, authorities said.",
          "url": "https://www.koin.com/news/crime/man-accused-of-bias-crime-after-downtown-portland-dog-attack/",
          "urlToImage": "https://media.zenfs.com/en/koin_articles_940/74eb71f626bc814479e299fddf11be82",
          "publishedAt": "2024-05-21T20:14:20Z",
          "content": "PORTLAND, Ore. (KOIN) A man faces assault and bias crime charges after authorities say he ordered his dog to attack a Black man after calling the victim racial slurs earlier this month.\r\nPolice say 2… [+1181 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "KTSM 9 News"
          },
          "author": "Dave Burge",
          "title": "Woman arrested in fatal hit-and-run over weekend",
          "description": "EL PASO, Texas (KTSM) — A 25-year-old woman has been arrested and is facing charges in the hit-and-run death of another woman over the weekend. Leslie Lopez,...",
          "url": "https://www.ktsm.com/local/el-paso-news/woman-arrested-in-fatal-hit-and-run-over-weekend/",
          "urlToImage": "https://media.zenfs.com/en/ktsm_articles_153/94a54066881dc7cc73bcce7d59e83ea9",
          "publishedAt": "2024-05-20T23:55:43Z",
          "content": "EL PASO, Texas (KTSM) A 25-year-old woman has been arrested and is facing charges in the hit-and-run death of another woman over the weekend.\r\nLeslie Lopez, 25, is facing a charge of collision involv… [+1309 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "KTSM 9 News"
          },
          "author": "Luisa Barrios",
          "title": "Traffic stop leads border agents to stash house; 18 migrants, 2 smugglers arrested",
          "description": "EL PASO, Texas (KTSM) – El Paso Border Patrol agents and state law enforcement officers discovered a stash house where 10 were held and eight others were...",
          "url": "https://www.ktsm.com/news/18-migrants-found-in-stash-house/",
          "urlToImage": "https://media.zenfs.com/en/ktsm_articles_153/2fa5d8de4163abcbe0cbc84eb7f60665",
          "publishedAt": "2024-05-23T04:19:45Z",
          "content": "EL PASO, Texas (KTSM) El Paso Border Patrol agents and state law enforcement officers discovered a stash house where 10 were held and eight others were headed on Monday in Anthony, New Mexico.\r\nBorde… [+1082 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "WOODTV.com"
          },
          "author": "Madalyn Buursma",
          "title": "Project to turn empty Kalamazoo office building into 82 apartments",
          "description": "A development planned for downtown Kalamazoo will turn an empty office building into housing and a restaurant.",
          "url": "https://www.woodtv.com/news/kalamazoo-county/project-to-turn-empty-kalamazoo-office-building-into-82-apartments/",
          "urlToImage": "https://media.zenfs.com/en/wood_articles_694/3230d6607d2ced1bb30a7af2f91ac6dc",
          "publishedAt": "2024-05-21T16:16:36Z",
          "content": "KALAMAZOO, Mich. (WOOD) A development planned for downtown Kalamazoo will turn an empty building into housing and a restaurant.\r\nProject leaders are working to turn a vacant building at 203 Rose St. … [+1695 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "WFLA"
          },
          "author": "MARK THIESSEN Associated Press",
          "title": "Moose kills man attempting to take photos of her newborn calves",
          "description": "A 70-year-old Alaska man who was attempting to take photos of two newborn moose calves was attacked and killed by their mother, authorities said Monday.",
          "url": "https://www.wfla.com/news/national/moose-kills-man-attempting-to-take-photos-of-her-newborn-calves/",
          "urlToImage": "https://media.zenfs.com/en/wfla_article_174/1204a685b47bc75b630232a00c51c062",
          "publishedAt": "2024-05-21T14:10:33Z",
          "content": "ANCHORAGE, Alaska (AP) A 70-year-old Alaska man who was attempting to take photos of two newborn moose calves was attacked and killed by their mother, authorities said Monday.\r\nThe man killed Sunday … [+2199 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "WAVY.com"
          },
          "author": "Regina Mobley",
          "title": "Armed road rage incident under investigation in Virginia Beach",
          "description": "VIRGINIA BEACH, Va. (WAVY) — It started as a routine trip for a Virginia Beach mother Tuesday morning. She headed north on First Colonial Road, and, as an...",
          "url": "https://www.wavy.com/news/local-news/virginia-beach/armed-road-rage-incident-under-investigation-in-virginia-beach/",
          "urlToImage": "https://media.zenfs.com/en/wavy_articles_285/224085a894e3876208dc0beffe1bfa46",
          "publishedAt": "2024-05-22T21:56:27Z",
          "content": "VIRGINIA BEACH, Va. (WAVY) It started as a routine trip for a Virginia Beach mother Tuesday morning.\r\nShe headed north on First Colonial Road, and, as an Hampton Roads Transit bus lumbered along near… [+2275 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "FOX 31 Denver"
          },
          "author": "Heather Willard",
          "title": "Colorado’s wolves move toward Vail, Breckenridge in new watershed location map",
          "description": "The reintroduced wolves in Colorado have entered watersheds that stretch across Interstate 70 near the state's beloved ski areas.",
          "url": "https://kdvr.com/news/colorado/colorados-wolves-move-toward-vail-breckenridge-in-new-watershed-location-map/",
          "urlToImage": "https://media.zenfs.com/en/kdvr_denver_articles_499/e59edfd6846d46e9a2a9659745e56b8f",
          "publishedAt": "2024-05-23T18:24:44Z",
          "content": "DENVER (KDVR) The newly reintroduced wolves in Colorado have entered watersheds that stretch across Interstate 70 for the first time closer to the states beloved ski areas, according to a new movemen… [+2490 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "KTLA Los Angeles"
          },
          "author": "Josh DuBose",
          "title": "$800K in diamonds, gold and cash stolen in Southern California jewelry heist",
          "description": "The owner of a well-fortified San Gabriel Valley jewelry store is reeling after thieves managed to break in and get away with some $800,000 worth of diamonds...",
          "url": "https://ktla.com/news/local-news/thieves-get-away-with-800k-in-southern-california-jewelry-heist/",
          "urlToImage": "https://media.zenfs.com/en/ktla_articles_362/0e4599a857182e4a4b321e7bcb80468d",
          "publishedAt": "2024-05-23T05:20:42Z",
          "content": "The owner of a well-fortified San Gabriel Valley jewelry store is reeling after thieves managed to break in and get away with some $800,000 worth of diamonds, gold and cash.\r\nThe May 15 incident occu… [+3024 chars]"
      },
      {
          "source": {
              "id": "time",
              "name": "Time"
          },
          "author": "Chantelle Lee",
          "title": "Food Safety Tips You Should Know As Summer Heats Up",
          "description": "As the weather gets hotter and people start eating outside again, it’s important to make sure that your food remains safe to eat.",
          "url": "https://time.com/6980818/food-safety-tips-memorial-day-summer/",
          "urlToImage": "https://api.time.com/wp-content/uploads/2024/05/Food-Safety-Tips-Memorial-Day.jpg?quality=85&w=1200&h=628&crop=1",
          "publishedAt": "2024-05-21T21:45:34Z",
          "content": "With Memorial Day weekend fast approaching, the start of the summer is in sight. As the weather gets hotter and people start eating and grilling outside again, its important to make sure that your fo… [+2661 chars]"
      },
      {
          "source": {
              "id": "time",
              "name": "Time"
          },
          "author": "Hannah Fingerhut and Margery A. Beck / AP",
          "title": "Iowa Tornadoes Leave Several Dead, Dozens Injured",
          "description": "It’s a historically bad season for tornadoes in the country: April had the second-highest number of tornadoes on record in the U.S.",
          "url": "https://time.com/6981281/iowa-tornado-deaths-injured-homes-destroyed-twisters/",
          "urlToImage": "https://api.time.com/wp-content/uploads/2024/05/iowa-tornado-1.jpg?quality=85&w=1024&h=628&crop=1",
          "publishedAt": "2024-05-23T01:55:00Z",
          "content": "GREENFIELD, Iowa Five people died and at least 35 were hurt as powerful tornadoes ripped through Iowa Tuesday, with one carving a path of destruction through the town of Greenfield, officials said.\r\n… [+6223 chars]"
      },
      {
          "source": {
              "id": "time",
              "name": "Time"
          },
          "author": "Abby Sewell / AP",
          "title": "What We Know So Far About the Helicopter Crash That Killed Iran’s President Ebrahim Raisi",
          "description": "Here's everything we know so far about the helicopter crash that killed the Iranian President and Foreign Minister Hossein Amirabdollahian.",
          "url": "https://time.com/6980072/helicopter-crash-iran-raisi/",
          "urlToImage": "https://api.time.com/wp-content/uploads/2024/05/GettyImages-2153267536.jpg?quality=85&w=1024&h=576&crop=1",
          "publishedAt": "2024-05-20T09:52:00Z",
          "content": "BEIRUT The helicopter crash that killed Irans president and foreign minister has sent shock waves around the region.\r\nIranian state media said on Monday that President Ebrahim Raisi, the countrys for… [+3656 chars]"
      },
      {
          "source": {
              "id": "time",
              "name": "Time"
          },
          "author": "JON GAMBRELL / AP",
          "title": "Iran’s Supreme Leader Presides Over Funeral for President Raisi After Helicopter Crash",
          "description": "Iran's Supreme Leader presided over a funeral Wednesday for the late President, Foreign Minister, and others killed in a helicopter crash.",
          "url": "https://time.com/6980871/president-raisi-funeral-iran-supreme-leader-khamenei-presides/",
          "urlToImage": "https://api.time.com/wp-content/uploads/2024/05/AP24143311015409.jpg?quality=85&w=1200&h=628&crop=1",
          "publishedAt": "2024-05-22T09:49:45Z",
          "content": "DUBAI, United Arab Emirates Iran's supreme leader presided over a funeral Wednesday for the country's late president, foreign minister and others killed in a helicopter crash, as tens of thousands la… [+6003 chars]"
      },
      {
          "source": {
              "id": "time",
              "name": "Time"
          },
          "author": "Armani Syed",
          "title": "Thousands Attend Iranian President Raisi’s Funeral Procession, as Others Celebrate",
          "description": "Funeral rites began Tuesday after the late Iranian President and the country's Foreign Minister died in a helicopter crash on Sunday.",
          "url": "https://time.com/6980553/president-raisi-funeral-iran/",
          "urlToImage": "https://api.time.com/wp-content/uploads/2024/05/iran-raisi-funeral.jpg?quality=85&w=1024&h=628&crop=1",
          "publishedAt": "2024-05-21T12:46:55Z",
          "content": "Iranians are taking to the streets of Tabriz to observe the funeral rites of President Ebrahim Raisi, who died along with Foreign Minister Hossein Amir-Abdollahian and six others in a helicopter cras… [+2335 chars]"
      },
      {
          "source": {
              "id": "espn",
              "name": "ESPN"
          },
          "author": "Kyle Bonagura",
          "title": "A complete timeline of Colorado's tumultuous offseason",
          "description": "From coaching changes to fashion week appearances, Colorado's offseason has been nothing short of eventful.",
          "url": "https://www.espn.com/college-football/story/_/id/40107728/colorado-offseason-line-deion-sanders-2024",
          "urlToImage": "https://a3.espncdn.com/combiner/i?img=%2Fphoto%2F2024%2F0508%2Fr1330249_1296x729_16%2D9.jpg",
          "publishedAt": "2024-05-22T11:20:38Z",
          "content": "Moments after Colorado's once-promising season sputtered to a close with a 23-17 loss at Utah in November, coach Deion Sanders took about a minute to reflect on some of the positives his team showed … [+9003 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "Slate Magazine"
          },
          "author": "Ray Hamel",
          "title": "Which Weather Phenomena Is Studied in Nephology?",
          "description": "Test your wits on the Slate Quiz for May 23, 2024.",
          "url": "https://slate.com/news-and-politics/2024/05/trivia-quiz-daily-slate-science-biochemistry-anthropology-animals.html",
          "urlToImage": "https://compote.slate.com/images/9bcf8540-2990-4c36-bdd3-82ecf9a4e8ff.jpeg?width=1560",
          "publishedAt": "2024-05-23T09:55:00Z",
          "content": "You wanted more quizzes, and weve delivered! Now you can test your wits every day of the week. Each weekday, your host, Ray Hamel, concocts a challenging set of unique questions on a specific topic. … [+460 chars]"
      },
      {
          "source": {
              "id": null,
              "name": "Themarginalian.org"
          },
          "author": "Maria Popova",
          "title": "No One You Love Is Ever Dead: Hemingway on the Most Devastating of Losses and the Meaning of Life",
          "description": "\"We must live it, now, a day at a time and be very careful not to hurt each other.\"",
          "url": "https://www.themarginalian.org/2024/05/21/hemingway-loss-letter/",
          "urlToImage": "https://www.themarginalian.org/wp-content/uploads/2013/11/hemingway5.jpg?fit=600%2C315&ssl=1",
          "publishedAt": "2024-05-21T21:26:07Z",
          "content": "Along the spectrum of losses, from the door keys to the love of one’s life, none is more unimaginable, more incomprehensible in its unnatural violation of being and time, than a parent’s loss of a ch… [+3561 chars]"
      },
      {
          "source": {
              "id": "abc-news",
              "name": "ABC News"
          },
          "author": "Bill Hutchinson",
          "title": "As 3 states recover from 13 tornadoes, more severe weather on the way",
          "description": "As emergency crews in three states began mopping up and assessing damage from a series of tornadoes on Sunday, more severe weather is on the way.",
          "url": "https://abcnews.go.com/US/3-states-recover-13-tornadoes-severe-weather/story?id=110396418",
          "urlToImage": "https://i.abcnewsfe.com/a/39bc8190-9745-41f2-87ac-5a90c669227b/oklahoma-tornado-ht-gmh-240520_1716214628885_hpMain_16x9.jpg?w=1600",
          "publishedAt": "2024-05-20T17:12:32Z",
          "content": "As emergency crews in three states began mopping up and assessing damage from a series of tornadoes on Sunday, more severe weather is being forecast for a large swath of the Midwest.\r\nMore than 230 s… [+3008 chars]"
      },
      {
          "source": {
              "id": "abc-news",
              "name": "ABC News"
          },
          "author": "ABC NEWS",
          "title": "Bad weather may be cause of Iran helicopter crash, expert says",
          "description": "ABC contributor Col. Steve Ganyard, a former fighter pilot and a former State Department official, weighs in on what may have caused Iran helicopter crash.",
          "url": "https://abcnews.go.com/International/expert-insight-suspected-cause-helicopter-crash-killed-irans/story?id=110406062",
          "urlToImage": "https://i.abcnewsfe.com/a/b8a080a5-e9e4-41a9-9321-2829fba18e2e/iran-crash-0524_1716179811006_hpMain_16x9.jpg?w=1600",
          "publishedAt": "2024-05-20T20:34:32Z",
          "content": "Iranian President Ebrahim Raisi, Foreign Minister Hossein Amirabdollahian, and other officials died in a helicopter crash Sunday near Iran's northern border with Azerbaijan, Iranian state media said … [+4647 chars]"
      },
      {
          "source": {
              "id": "abc-news",
              "name": "ABC News"
          },
          "author": "PATRICK WHITTLE Associated Press",
          "title": "Beach weather is here and so are sharks. Scientists say it's time to look out for great whites",
          "description": "Scientists with a Boston aquarium are encouraging beachgoers to report sightings of white sharks this holiday weekend after signs of shark bites were observed on multiple marine mammals",
          "url": "https://abcnews.go.com/US/wireStory/beach-weather-sharks-scientists-time-great-whites-110514718",
          "urlToImage": "https://i.abcnewsfe.com/a/7f3aaaa8-e5a5-4008-8d99-804dc2decb77/wirestory_0ad316711eca9737d872412f00720ae7_16x9.jpg?w=1600",
          "publishedAt": "2024-05-23T19:50:38Z",
          "content": "PORTLAND, Maine -- Scientists with a Boston aquarium are encouraging beachgoers to report sightings of white sharks this holiday weekend after signs of shark bites were observed on multiple marine ma… [+1889 chars]"
      },
      {
          "source": {
              "id": "abc-news",
              "name": "ABC News"
          },
          "author": "Jon Haworth",
          "title": "Climber found dead after falling off highest peak in North America",
          "description": "A climber has died at Denali National Park and Preserve in Alaska after park rangers found a body at an elevation of over three miles, officials said.",
          "url": "https://abcnews.go.com/US/climber-found-dead-after-falling-off-highest-peak/story?id=110424974",
          "urlToImage": "https://i.abcnewsfe.com/a/673a4288-a85b-4827-84b8-c532d40aa450/DenaliNPS_1716276316420_hpMain_16x9.jpg?w=1600",
          "publishedAt": "2024-05-21T07:30:39Z",
          "content": "A climber has died at Denali National Park and Preserve in Alaska after park rangers found a body at an elevation of over three miles, officials said.\r\nThe incident began to unfold on Monday when ran… [+2202 chars]"
      },
      {
          "source": {
              "id": "abc-news",
              "name": "ABC News"
          },
          "author": "Max Golembo, Julia Jacobo",
          "title": "Highest-on record early season hurricane outlook issued by NOAA",
          "description": "The National Oceanic and Atmospheric Administration has issued its highest-on record early season hurricane forecast for an upcoming hurricane season.",
          "url": "https://abcnews.go.com/US/highest-record-early-season-hurricane-outlook-issued-noaa/story?id=110501204",
          "urlToImage": "https://i.abcnewsfe.com/a/b5410d58-8a08-4fb8-838d-354d734f3f06/hurricane-1-gty-gmh-240523_1716475745988_hpMain_16x9.jpg?w=1600",
          "publishedAt": "2024-05-23T15:19:25Z",
          "content": "The National Oceanic and Atmospheric Administration has issued its highest-on record early-season hurricane forecast for the upcoming hurricane season.\r\nAll categories of storms are expected to excee… [+1010 chars]"
      },
      {
          "source": {
              "id": "abc-news",
              "name": "ABC News"
          },
          "author": "Emma Ogao",
          "title": "Kenyan mountaineer dies on Everest",
          "description": "Kenyan mountaineer Joshua Cheruiyot Kirui, who went missing on Wednesday morning on Mount Everest, has been found dead, officials announced Thursday.",
          "url": "https://abcnews.go.com/International/kenyan-mountaineer-dies-everest-attempts-summit-supplemental-oxygen/story?id=110494451",
          "urlToImage": "https://i.abcnewsfe.com/a/636c6e12-0d60-40f2-9c27-cbdb8c433b9a/everest-file_1716457816190_hpMain_16x9.jpg?w=1600",
          "publishedAt": "2024-05-23T13:16:17Z",
          "content": "LONDON -- Kenyan mountaineer Joshua Cheruiyot Kirui, who went missing with his guide on Wednesday morning on Mount Everest, has been found dead, officials announced Thursday.\r\nKirui's body was found … [+2189 chars]"
      },
      {
          "source": {
              "id": "abc-news",
              "name": "ABC News"
          },
          "author": "Katie Kindelan",
          "title": "Boy swept into storm drain to become an organ donor, dad says",
          "description": "Asher Sullivan was helping clean up storm debris at the time of the accident.",
          "url": "https://abcnews.go.com/GMA/Family/family-hopes-miracle-after-10-year-boy-swept/story?id=110231605",
          "urlToImage": "https://i.abcnewsfe.com/a/57dff623-d65c-4563-8cf3-80bbb887049c/rutherford-county-1-ht-bb-240515_1715779511675_hpMain_16x9.jpg?w=1600",
          "publishedAt": "2024-05-20T18:02:42Z",
          "content": "A 10-year-old boy who was swept into a storm drain while helping his family clean up storm debris has passed away, according to his father.\r\nThe boy, Asher Sullivan, is still on life support so that … [+3134 chars]"
      }
  ]
}
//const { articles, totalResults } = await response.json();
//console.log(JSON.stringify(response));


document.getElementById("resultCount").textContent = response.totalResults;

let carouselIndicators = "";
let carouselItems = "";
let newsCards = "";
let addedIndices = []; 
const numArticles = Math.min(5, response.articles.length);
  for (let i = 0; i < numArticles; i++) {
      const item = response.articles[i];
      carouselItems += `
        <div class="item">
          <img class="mainCard" src="${item.urlToImage}" alt="">
          <div class="content">
              <div class="title">${item.title}</div>
              <div class="description mt-3">${item.description}</div>
              <div class="button">
                <a href="${item.url}" target="_blank" class="anchor mt-4">
                  <button class="readmore-btn">
                    <span class="book-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#1a2a32" viewBox="0 0 126 75" class="book">
                        <rect stroke-width="3" stroke="#fff" rx="7.5" height="70" width="121" y="2.5" x="2.5"></rect>
                        <line stroke-width="3" stroke="#fff" y2="75" x2="63.5" x1="63.5"></line>
                        <path stroke-linecap="round" stroke-width="4" stroke="#fff" d="M25 20H50"></path>
                        <path stroke-linecap="round" stroke-width="4" stroke="#fff" d="M101 20H76"></path>
                        <path stroke-linecap="round" stroke-width="4" stroke="#fff" d="M16 30L50 30"></path>
                        <path stroke-linecap="round" stroke-width="4" stroke="#fff" d="M110 30L76 30"></path>
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 65 75" class="book-page">
                        <path stroke-linecap="round" stroke-width="4" stroke="#fff" d="M40 20H15"></path>
                        <path stroke-linecap="round" stroke-width="4" stroke="#fff" d="M49 30L15 30"></path>
                        <path stroke-width="3" stroke="#fff"
                          d="M2.5 2.5H55C59.1421 2.5 62.5 5.85786 62.5 10V65C62.5 69.1421 59.1421 72.5 55 72.5H2.5V2.5Z"></path>
                      </svg>
                    </span>
                    <span class="text"> Read More </span>
                  </button>
                </a>
              </div>
          </div>
        </div>
      `;
  carouselIndicators +=`
        <div class="item">
          <img src="${item.urlToImage}" alt="">
        </div>
      `;
  addedIndices.push(i); 
  }
  

  for (let i = 0; i < response.articles.length; i++) {
    if (!addedIndices.includes(i)) { 
      const item = response.articles[i];
      let description = item.description || ''; 
      newsCards += `
        <div class="card my-4 mx-2 mainCard" style="width: 18rem; height: 25rem">
          <img height="184px" src="${item.urlToImage}" class="card-img-top mt-2" alt="Error" />
          <div class="card-body">
            <h5 class="card-title">${item.title.slice(0, 50)}</h5>
            <p class="card-text">${description.slice(0, 25)}...</p> <!-- Null check added here -->
            <a class="buttonNews" href="${item.url}" target="_blank">
              <span class="button__icon-wrapper">
                <svg width="10" class="button__icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                    <path fill="currentColor" d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                </svg>
                <svg class="button__icon-svg  button__icon-svg--copy" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                    <path fill="currentColor" d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                </svg>
              </span>
              <span class="buttonText btn">Read More</span>
            </a>
          </div>
        </div>
      `;
      
    }
  }

document.querySelector(".thumbnail").innerHTML = carouselIndicators;
document.querySelector(".list").innerHTML = carouselItems;
document.querySelector(".main-content").innerHTML = newsCards;
VanillaTilt.init(document.querySelectorAll(".card"), {
  max: 5,
      speed: 400,
      easing:"cubic-bezier(.03,.98,.52,.99)",
      perspective:500,
      transition:true
  });
};

fetchNews(1, currentQuery);

//SEARCH BAR FOR NEWS
document.getElementById("search").addEventListener("click", (e) => {
  e.preventDefault();
  const query = document.getElementById("searchInput").value;
  currentQuery = query;
  currentPage = 1;
  fetchNews(1, query);
});
document.getElementById("previous").addEventListener("click", (e) => {
  e.preventDefault();
  
  if (currentPage > 1) {
    currentPage -= 1;
    fetchNews(currentPage, currentQuery);
  }
const section = document.getElementById("newsDashboard"); 
  if (section) {
      const topPos = section.offsetTop;
      window.scrollTo({ top: topPos, behavior: 'smooth' });
  }
  
});

document.getElementById("next").addEventListener("click", (e) => {
  e.preventDefault();
  currentPage += 1;
  fetchNews(currentPage, currentQuery);
  const section = document.getElementById("newsDashboard"); 
  if (section) {
    const topPos = section.offsetTop;
    window.scrollTo({ top: topPos, behavior: 'smooth' });
  }
});

function moveSlider(direction) {
    const slider = document.querySelector('.slider');
    const sliderList = slider.querySelector('.slider .list');
    const thumbnail = document.querySelector('.slider .thumbnail');
    const sliderItems = sliderList.querySelectorAll('.item');
    const thumbnailItems = thumbnail.querySelectorAll('.item');

    if (direction === 'next') {
        sliderList.appendChild(sliderItems[0]);
        thumbnail.appendChild(thumbnailItems[0]);
        slider.classList.add('next');
    } else {
        sliderList.prepend(sliderItems[sliderItems.length - 1]);
        thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1]);
        slider.classList.add('prev');
    }

    slider.addEventListener('animationend', function() {
        slider.classList.remove('next', 'prev');
    }, { once: true });
}
function nextSlide() {
    moveSlider('next');
}
setInterval(nextSlide, 5000);
