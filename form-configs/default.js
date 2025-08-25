window.defaultConfig = {
  selectors: {
    email: 'input[type="email"]',
    city: 'input[name="city"]',
    country: 'input[name="country"]'
  },
  actions: {
    fillEmail: (element, userInfo) => element.value = userInfo.email,
    fillCity: (element, userInfo) => element.value = userInfo.city_name,
    fillCountry: (element, userInfo) => element.value = userInfo.country_name
  }
};