function populateRegions(country) {
  const regions = {
    "Ethiopia": [
      "Addis Ababa",
      "Afar",
      "Amhara",
      "Benishangul-Gumuz",
      "Dire Dawa",
      "Gambela",
      "Harari",
      "Oromia",
      "Sidama",
      "Somali",
      "South Ethiopia",
      "South West Ethiopia Peoples",
      "Southern Nations Nationalities (SNN)",
      "Tigray"
    ],
  };

  const regionDropdown = document.getElementById('region');
  regionDropdown.innerHTML = '<option value="">Select</option>';
  if (regions[country]) {
    regions[country].forEach(region => {
      const option = document.createElement('option');
      option.value = region;
      option.text = region;
      regionDropdown.appendChild(option);
    });
    document.getElementById('region-control').style.display = 'block';
  } else {
    document.getElementById('region-control').style.display = 'none';
  }
}

function populateCities(region) {
  const cities = {
    "Addis Ababa": ["Addis Ababa"],
    "Dire Dawa": ["Dire Dawa"],
    "Oromia": ["Adama",
      "Adola Town",
      "Agaro",
      "Ambo, Ethiopia",
      "Asella",
      "Babile (town)",
      "Bako, Oromia",
      "Bale Robe",
      "Bishoftu",
      "Bule Hora (town)",
      "Bule Hora",
      "Burayu",
      "Chinaksen",
      "Chiro",
      "Dader",
      "Dembidolo",
      "Dukem",
      "Durba",
      "Fiche",
      "Galan (town)",
      "Gimbi",
      "Goba",
      "Gore, Ethiopia",
      "Guder",
      "Gutin",
      "Haramaya",
      "Jimma",
      "Koye Feche",
      "Kulubi",
      "Meki",
      "Metu",
      "Moyale",
      "Naqamte",
      "Negele Arsi",
      "Negele Borana",
      "Sabata",
      "Sagure",
      "Sebeta Hawas (town)",
      "Shambu",
      "Shashamane",
      "Tijo",
      "Tulu Bolo",
      "Waliso", "Other"],
    "Tigray": ["Mekele", "Adigrat", "Axum", "Shire", "Adwa", "Humera", "Wukro", "Other"],
    "Amhara": ["Abomsa",
      "Addiet Canna",
      "Adis Zemen",
      "Bahir Dar",
      "Bati",
      "Bichena",
      "Bure",
      "Dabat",
      "Debark'",
      "Debre Birhan",
      "Debre Mark'os",
      "Debre Sina",
      "Debre Tabor",
      "Debre Werk'",
      "Dejen",
      "Dese",
      "Finote Selam",
      "Gondar",
      "Kemise",
      "Kombolcha",
      "Lalibela",
      "Robit",
      "Were Ilu",
      "Werota"],
    "Somali": ["Jijiga", "Gode", "Dolo Odo", "Kebri Dahar", "Danan", "Gursum", "Other"],
    "Southern Nations Nationalities (SNN)": ["Hawassa", "Dila", "Arba Minch", "Sodo", "Yirgalem", "Wendo Genet", "Other"],
    "South Ethiopia": ["Gedeo",
      "Gamo",
      "Gofa",
      "Konso",
      "South Omo",
      "Wolayita"],
    "South West Ethiopia Peoples": ["Bench Sheko",
      "Dawuro",
      "Kaffa",
      "Sheka",
      "West Omo"],
    "Afar": ["Semera", "Asaita", "Assab", "Bure", "Awash", "Dubti", "Other"],
    "Benishangul-Gumuz": ["Assosa", "Mendi", "Gilgel Beles", "Kurmuk", "Shambo", "Mao Komo", "Other"],
    "Gambela": ["Gambela", "Itang", "Abobo", "Jor", "Akobo", "Gog", "Other"],
    "Harari": ["Harar"],
    "Sidama": ["Hawassa", "Yirgalem", "Aleta Wendo", "Boricha", "Bensa", "Dilla", "Other"],
  };

  const cityDropdown = document.getElementById('city');
  cityDropdown.innerHTML = '<option value="">Select</option>';
  if (cities[region]) {
    cities[region].forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.text = city;
      cityDropdown.appendChild(option);
    });
    document.getElementById('city-control').style.display = 'block';
  } else {
    document.getElementById('city-control').style.display = 'none';
  }
}


function populateSubcities(city) {
  const subcities = {
    "Addis Ababa": ["Yeka", "Arada", "Bole", "Kolfe Keraniyo", "Kirkos", "Gullele", "Nifas Silk-Lafto", "Akaky Kaliti", "Lideta", "Lemikura", "Addis Ketema"]

  };

  const subcityDropdown = document.getElementById('subcity');
  subcityDropdown.innerHTML = '<option value="">Select</option>';
  if (subcities[city]) {
    subcities[city].forEach(subcity => {
      const option = document.createElement('option');
      option.value = subcity;
      option.text = subcity;
      subcityDropdown.appendChild(option);
    });
    document.getElementById('subcity-control').style.display = 'block';
  } else {
    document.getElementById('subcity-control').style.display = 'none';
  }
}

document.getElementById('country').addEventListener('change', function (event) {
  const selectedCountry = event.target.value;
  if (selectedCountry) {
    populateRegions(selectedCountry);
  } else {
    document.getElementById('region-control').style.display = 'none';
    document.getElementById('city-control').style.display = 'none';
    document.getElementById('subcity-control').style.display = 'none';
  }
});

document.getElementById('region').addEventListener('change', function (event) {
  const selectedRegion = event.target.value;
  if (selectedRegion) {
    populateCities(selectedRegion);
  } else {
    document.getElementById('city-control').style.display = 'none';
    document.getElementById('subcity-control').style.display = 'none';
  }
});

document.getElementById('city').addEventListener('change', function (event) {
  const selectedCity = event.target.value;
  if (selectedCity) {
    populateSubcities(selectedCity);
  } else {
    document.getElementById('subcity-control').style.display = 'none';
  }
});
