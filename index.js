let isMobile = false;

(function menoBurgerHandler() {
    const burgerMenu = document.querySelector('.header__burger-menu');
    const navbar = document.querySelector('.header__navbar');

    burgerMenu.addEventListener('click', function() {
        this.classList.toggle("close");
        navbar.classList.toggle("overlay");
    });
})();

(function searchHandler() {
    const searchIcon = document.querySelector('.header__search-icon');
    const searchInput = document.querySelector('.header__search-input');
    const searchInputDesk = document.querySelector('.search__input input');

    const searchParam = getURLParameter('search');

    if(typeof searchParam === 'string') {
        searchInput.value = searchParam;
        searchInputDesk.value = searchParam;
        searchInput.classList.add('overlay');
    };

    searchIcon.addEventListener('click', function() {
        searchInput.classList.toggle('overlay');
    });
})();

// Function to set multiple parameters in the URL.
function setURLParameters(params, callback) {
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(params)) {
        urlParams.set(key, value);

        if(!value) {
            urlParams.delete(key);
        };
    };
    
    const newUrl = window.location.pathname + '?' + urlParams.toString();
    window.history.pushState({}, '', newUrl);

    if(typeof callback === 'function') {
        callback();
    };
};

// Function to get a specific parameter from the URL.
function getURLParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

function searchInputTypeHandler(event) {
    const searchInput = event.target;
    if(searchInput instanceof HTMLInputElement === false) {
        return;
    };

    setURLParameters({ search: searchInput.value }, () => {
        if(isMobile) {
            renderAppointmentsMobile(initialAppointments);
        } else {
            renderAppointments(initialAppointments);
        };
    });
};

const initialAppointments = [
    { title: 'Hardware Cosmetology' },
    {
        title: 'Aestheic & Anti-Aging',
        children: [
            { title: "Doctor Consultation" },
            {
                title: "Injection",
                children: [
                    {
                        title: "Dermal Filler Injections",
                        children: [
                            { title: "Hair" },
                            { title: "Face & Neck", children: [
                                { title: "Skin Treatment" },
                                { title: "IV Drips" }
                            ] }
                        ],
                    },
                    { title: "Botulinum Toxin" },
                    { title: "Fat Burner Injection" },
                    { 
                       
                        title: "PRP",
                        children: [
                            { title: "PRP Hair " },
                            { title: "PRP Face & Neck" }
                        ],
                    },
                    { title: "Mesotheraphy" }
                ]
            },
            { title: "Devices" },
            { title: "Skin Treatment" },
            { title: "IV Drips" }
        ]
    },
    { title: 'Plastic Surgery' },
    { title: 'Dental' },
    { title: 'Hair Transplant' },
    { title: 'Dental' }
];

function renderAppointmentsMobile(appointments) {
    const appointmentsElement = document.querySelector('.appointments');
    appointmentsElement.innerHTML = '';

    const createApointments = (aponts, nestedAppointmentRowElement) => {
        const appointmentsGroup = document.createElement('div');
        appointmentsGroup.classList.add('appointments__group');

        aponts.forEach((appointment) => {
            const appointmentRowElement = document.createElement('li');

            appointmentRowElement.onclick = () => {
                appointment.active = !Boolean(appointment.active);

                if(!appointment.active && appointment.children) {
                    const closeAllActiveChidren = (children) => {
                        children.forEach(appointment => {
                            appointment.active = false;
                            if(appointment.children) {
                                closeAllActiveChidren(appointment.children);
                            };
                        });
                    };

                    closeAllActiveChidren(appointment.children);
                };

                renderAppointmentsMobile(initialAppointments);
            };

            const searchValue = getURLParameter('search');

            let title = appointment.title;
            if(typeof searchValue === 'string' && searchValue.length > 1) {
                title = title.replaceAll(searchValue, `<span class='highlight'>${searchValue}</span>`);
            };

            appointmentRowElement.innerHTML = title

            appointmentsGroup.appendChild(appointmentRowElement);

            if(appointment.children) {
                appointmentRowElement.classList.add('withChildren');
            };

            if(appointment.children && appointment.active) {
                appointmentRowElement.classList.add('active')
                createApointments(appointment.children, appointmentRowElement);
            };
        });

        if(nestedAppointmentRowElement) {
            nestedAppointmentRowElement.insertAdjacentElement('afterend', appointmentsGroup);
        };

        return appointmentsGroup;
    };

    appointmentsElement.appendChild(createApointments(appointments));
};

function renderAppointments(appointments) {
    const appointmentsElement = document.querySelector('.appointments');
    appointmentsElement.innerHTML = '';

    const appointmentsGroup = document.createElement('div');
    appointmentsGroup.classList.add('appointments__group');

    appointments.forEach((appointment) => {
        const appointmentRowElement = document.createElement('li');
        
        const handleAppointmentClick = () => {
            if(appointment.children) {
                appointments.forEach(eachAppointment => {
                    if(eachAppointment !== appointment) {
                        eachAppointment.active = false;
                    };
                });

                appointment.active = !Boolean(appointment.active);
                
                if(!appointment.active && appointment.children) {
                    const closeAllActiveChidren = (children) => {
                        children.forEach(appointment => {
                            appointment.active = false;
                            if(appointment.children) {
                                closeAllActiveChidren(appointment.children);
                            };
                        });
                    };

                    closeAllActiveChidren(appointment.children);
                };
                
                renderAppointments(initialAppointments);

                if(appointment.active) {
                    appointmentsElement.scrollTo({
                        left: 10000,
                        behavior: "smooth"
                    })
                };  
            };
        };

        appointmentRowElement.onclick = handleAppointmentClick;

        if(appointment.children) {
            appointmentRowElement.classList.add('withChildren');
        };

        const searchValue = getURLParameter('search');

        let title = appointment.title;
        if(typeof searchValue === 'string' && searchValue.length > 1) {
            title = title.replaceAll(searchValue, `<span class='highlight'>${searchValue}</span>`);
        };

        appointmentRowElement.innerHTML = title

        appointmentsGroup.appendChild(appointmentRowElement);
        appointmentsElement.prepend(appointmentsGroup);

        if(appointmentsElement.children.length > 1) {
            appointmentsElement.classList.add('hideImage')
        } else {
            appointmentsElement.classList.remove('hideImage')
        };

        if(appointment.active && appointment.children) {
            renderAppointments(appointment.children);
        };
    });
};

function render() {
    isMobile = window.innerWidth <= 768;
    if(isMobile) {
        renderAppointmentsMobile(initialAppointments);
    } else {
        renderAppointments(initialAppointments);
    };
};

window.addEventListener('resize', render);
render();
