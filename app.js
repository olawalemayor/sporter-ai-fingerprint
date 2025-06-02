document.getElementById("browser").innerText =
  platform.name + " " + platform.version;

const userId = generateRandomId(16);

if (userId) {
  const elements = document.getElementsByClassName("userId");
  Array.from(elements).forEach((element) => {
    element.innerText = userId;
  });
}

let isToggled = false;
const textElem = document.getElementById("toggle-text");

function toggleBox() {
  isToggled = !isToggled;
  const box1 = document.getElementById("box1");
  box1.classList.toggle("hidden");

  const box2 = document.getElementById("box2");
  box2.classList.toggle("hidden");

  if (isToggled) {
    textElem.innerText = "Request API key";
    textElem.classList.add("text-spotter");
  } else {
    textElem.innerText = "I'M A DEVELOPER";
    textElem.classList.remove("text-spotter");
  }
}

function openTab(evt, tabId) {
  // Hide all tab contents
  document
    .querySelectorAll(".tab-content")
    .forEach((tab) => tab.classList.add("hidden"));

  // Remove active state from all tab buttons
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) =>
      btn.classList.remove("border-[rgb(0,128,128)]", "text-[rgb(0,128,128)]")
    );

  // Show selected tab content
  document.getElementById(tabId).classList.remove("hidden");

  // Highlight active tab button
  evt.currentTarget.classList.add(
    "border-[rgb(0,128,128)]",
    "text-[rgb(0,128,128)]"
  );
}

// Optional: Activate first tab by default
document.querySelector(".tab-btn").click();

const platforms = {
  Win32: "Windows",
  MacIntel: "macOS",
  "Linux x86_64": "Linux",
};

fetch("https://ipapi.co/json/")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    document.getElementById("ip-address").innerText = data.ip;
    document.getElementById("cc").innerText = data["country_code"];
    Array.from(document.getElementsByClassName("city-country")).forEach(
      (elem) => (elem.innerText = `${data.city}, ${data.country_name}`)
    );

    const codeBlock = document.getElementById("code-block");

    if (codeBlock) {
      codeBlock.innerText = `{
  "visitorId": "${userId}",
  "requestId": "1748887818661.ZwXaW0",
  "browserName": "${platform.name}",
  "browserVersion": ${platform.version},
  "confidence": {
    "revision": "v1.1",
    "score": 1
  },
  "device": "Other",
  "firstSeenAt": {
    "global": "${new Date().toISOString()}",
    "subscription": "${new Date().toISOString()}"
  },
  "incognito": false,
  "ip": "${data.ip}",
  "ipLocation": {
    "accuracyRadius": 20,
    "city": {
      "name": "${data.city}"
    },
    "continent": {
      "code": "${data["continent_code"]}",      
    },
    "country": {
      "code": "${data.country_code}",
      "name": "${data.country_name}"
    },
    "latitude": ${data.latitude},
    "longitude": ${data.longitude},
    "subdivisions": [
      {
        "isoCode": "${data["region_code"]}",
        "name": "${data.region}"
      }
    ],
    "timezone": "${data.timexone}"
  },
  "lastSeenAt": {
    "global": "${new Date().toISOString()}",
    "subscription": "${new Date().toISOString()}"
  },
  "meta": {
    "version": "v1.1.3460+6352978ad"
  },
  "os": "${platforms[navigator.platform]}",  
  "visitorFound": true,
  "cacheHit": false
}          
          `;
    }

    const map = L.map("map").setView([data.latitude, data.longitude], 13);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([data.latitude, data.longitude]).addTo(map);
  })
  .catch((error) => console.error("Error fetching IP info:", error));

function generateRandomId(length = 8) {
  return Math.random().toString(36).substr(2, length);
}
