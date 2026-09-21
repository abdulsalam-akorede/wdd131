const menuButton = document.querySelector("#menu");
const navigation = document.querySelector(".navigation");

menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("show");
    menuButton.setAttribute("aria-expanded", isOpen);
});

document.querySelector("#currentyear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = "Last Modified: " + document.lastModified;


const temples = [
    {
        templeName: "Aba Nigeria",
        location: "Aba, Nigeria",
        dedicated: "2005, August, 7",
        area: 11500,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
    },

    {
        templeName: "Manti Utah",
        location: "Manti, Utah, United States",
        dedicated: "1888, May, 21",
        area: 74792,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
    },

    {
        templeName: "Payson Utah",
        location: "Payson, Utah, United States",
        dedicated: "2015, June, 7",
        area: 96630,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
    },

    {
        templeName: "Yigo Guam",
        location: "Yigo, Guam",
        dedicated: "2020, May, 2",
        area: 6861,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
    },

    {
        templeName: "Washington D.C.",
        location: "Kensington, Maryland, United States",
        dedicated: "1974, November, 19",
        area: 156558,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
    },

    {
        templeName: "Lima Perú",
        location: "Lima, Perú",
        dedicated: "1986, January, 10",
        area: 9600,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
    },

    {
        templeName: "Mexico City Mexico",
        location: "Mexico City, Mexico",
        dedicated: "1983, December, 2",
        area: 116642,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
    },

    {
        templeName: "Accra Ghana",
        location: "Accra, Ghana",
        dedicated: "2004, January, 11",
        area: 17500,
        imageUrl:
            "https://www.churchofjesuschrist.org/imgs/a108bda9a4f3f818feff3b632e7be35ee5882c69/full/!1200,/0/default"
    },
    {
        templeName: "Salt Lake Utah",
        location: "Salt Lake City, Utah, United States",
        dedicated: "1893, April, 6",
        area: 253015,
        imageUrl:
            "https://www.churchofjesuschrist.org/imgs/64de5983126b11eca393eeeeac1e50dfc2db6c7e/full/500%2C/0/default"
},
{
        templeName: "Johannesburg South Africa",
        location: "Johannesburg, South Africa",
        dedicated: "1985, August, 24",
        area: 19184,
        imageUrl:
            "https://www.churchofjesuschrist.org/imgs/b378c080e5880db5bf2bcf6d828b2f3fd59820de/full/500%2C/0/default"
}
];


const templeContainer = document.querySelector("#temples");

function displayTemples(temples) {
    templeContainer.innerHTML = "";

    temples.forEach((temple) => {
        const card = document.createElement("figure");

        card.innerHTML = `
            <img src="${temple.imageUrl}" alt="${temple.templeName}" loading="lazy">
            <figcaption>
                <h2>${temple.templeName}</h2>
                <p><strong>Location:</strong> ${temple.location}</p>
                <p><strong>Dedicated:</strong> ${temple.dedicated}</p>
                <p><strong>Area:</strong> ${temple.area.toLocaleString()} sq ft</p>
            </figcaption>
        `;

        templeContainer.appendChild(card);
    });
}

displayTemples(temples);


const homeButton = document.querySelector("#home");
const oldButton = document.querySelector("#old");
const newButton = document.querySelector("#new");
const largeButton = document.querySelector("#large");
const smallButton = document.querySelector("#small");

homeButton.addEventListener("click", () => {
    displayTemples(temples);
});

oldButton.addEventListener("click", () => {
    const oldTemples = temples.filter((temple) => {
        return new Date(temple.dedicated).getFullYear() < 1900;
    });

    displayTemples(oldTemples);
});

newButton.addEventListener("click", () => {
    const newTemples = temples.filter((temple) => {
        return new Date(temple.dedicated).getFullYear() > 2000;
    });

    displayTemples(newTemples);
});

largeButton.addEventListener("click", () => {
    const largeTemples = temples.filter((temple) => {
        return temple.area > 90000;
    });

    displayTemples(largeTemples);
});

smallButton.addEventListener("click", () => {
    const smallTemples = temples.filter((temple) => {
        return temple.area < 10000;
    });

    displayTemples(smallTemples);
});


