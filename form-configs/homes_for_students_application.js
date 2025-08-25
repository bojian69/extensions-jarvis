window.homes_for_students_applicationConfig = {
  selectors: {
    email: 'input[name="email"], #email',
    city: 'input[name="city"], #city',
    country: 'select[name="country"], #country'
  },
  actions: {
    fillEmail: (element, userInfo) => element.value = userInfo.email,
    fillCity: (element, userInfo) => element.value = userInfo.city_name,
    fillCountry: (element, userInfo) => {
      if (element.tagName === 'SELECT') {
        const option = Array.from(element.options).find(opt => 
          opt.text.includes(userInfo.country_name) || opt.value === userInfo.country_name
        );
        if (option) element.value = option.value;
      } else {
        element.value = userInfo.country_name;
      }
    }
  }
};