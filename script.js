const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const customIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [35, 50],
});

const geoApiLinkIp = "https://geo.ipify.org/api/v2/country,city?apiKey=at_zw83q17sJNGb4S89dWSe7kC8YES8V&ipAddress=";
const geoApiLinkDomain = "https://geo.ipify.org/api/v2/country,city?apiKey=at_zw83q17sJNGb4S89dWSe7kC8YES8V&domain=";
const submitButton = document.getElementById("img-submit");
const ipAddressInput = document.getElementById("input-ip-addr");

const ipAddressResult = document.getElementById("ip-addr");
const locationResult = document.getElementById("location");
const timezoneResult = document.getElementById("timezone");
const ispResult = document.getElementById("isp");
const resultArray = [ipAddressResult, locationResult, timezoneResult, ispResult];

let  lat = 0, lng = 0;

submitButton.addEventListener('click', (event) => {
    resultArray.forEach((resultElement) => {
        resultElement.classList.add("lds-dual-ring");
    });
    let geoApiLink = geoApiLinkDomain;
    if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ipAddressInput.value) ||
    /^[\dA-F]{0,4}:[\dA-F]{0,4}:[\dA-F]{0,4}:[\dA-F]{0,4}:[\dA-F]{0,4}:[\dA-F]{0,4}:[\dA-F]{0,4}:[\dA-F]{0,4}$/i.test(ipAddressInput.value)) {
        geoApiLink = geoApiLinkIp;
    }
    fetch(geoApiLink + ipAddressInput.value).
        then((response) => response.json()).
        then((data) => {
            resultArray.forEach((resultElement) => {
                resultElement.classList.remove("lds-dual-ring");
            });
            if(data.code == 422) {
                ipAddressResult.innerHTML = "Invalid IP/Domain";
                locationResult.innerHTML = ""
                timezoneResult.innerHTML = ""
                ispResult.innerHTML = "";
                return;
            }
            ipAddressResult.innerHTML = data.ip;
            locationResult.innerHTML = data.location.region;
            timezoneResult.innerHTML = "UTC" + data.location.timezone;
            ispResult.innerHTML = data.isp;
            lat = data.location.lat;
            lng = data.location.lng;
            map.panTo({lng: lng, lat: lat});
            L.marker([lat, lng], {
                icon: customIcon
            }).addTo(map);
        });
})