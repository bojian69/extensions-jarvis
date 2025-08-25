window.homes_for_students_applicationConfig = {
  selectors: {
    email: 'input[name="email"], #email',
    firstName: 'input[name="firstName"], #firstName',
    lastName: 'input[name="lastName"], #lastName',
    city: 'input[name="city"], #city',
    country: 'select[name="country"], #country',
    phone: 'input[name="phone"], #phone'
  },
  actions: {
    fillEmail: (element, userInfo) => element.value = userInfo.email,
    fillFirstName: (element, userInfo) => element.value = userInfo.firstName || '',
    fillLastName: (element, userInfo) => element.value = userInfo.lastName || '',
    fillCity: (element, userInfo) => element.value = userInfo.city,
    fillCountry: (element, userInfo) => {
      if (element.tagName === 'SELECT') {
        const option = Array.from(element.options).find(opt => 
          opt.text.includes(userInfo.country) || opt.value === userInfo.country
        );
        if (option) element.value = option.value;
      } else {
        element.value = userInfo.country;
      }
    },
    fillPhone: (element, userInfo) => element.value = userInfo.phone || ''
  }
};