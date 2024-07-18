let isMobile = false;
let allAppointments = [];

// Helper Function to set multiple parameters in the URL.
function setURLParameters(params, callback) {
    const urlParams = new URLSearchParams(window.location.search);
    for(const [key, value] of Object.entries(params)) {
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

// Helper Function to get a specific parameter from the URL.
function getURLParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

// Helper Function to get highlight search term in title (case-insensitive).
function highlightSearchTerm(title) {
    const searchValue = getURLParameter('search');
    if(searchValue && searchValue.length > 1) {
        // Create a case-insensitive regular expression for the search term.
        const regex = new RegExp(searchValue, 'gi');

        // Replace all occurrences of the search term with the highlighted version.
        return title.replace(regex, match => `<span class='highlight'>${match}</span>`);
    };
    return title;
};

// Initialize the burger menu handler.
function initBurgerMenuHandler() {
    const burgerMenu = document.querySelector('.header__burger-menu');
    const navbar = document.querySelector('.header__navbar');

    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle("close");
        navbar.classList.toggle("overlay");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// Initialize the search handler.
function initSearchHandler() {
    const searchIcon = document.querySelector('.header__search-icon');
    const searchInput = document.querySelector('.header__search-input');
    const searchInputDesk = document.querySelector('.search__input input');

    const searchParam = getURLParameter('search');
    if(searchParam) {
        searchInput.value = searchParam;
        searchInputDesk.value = searchParam;
        searchInput.classList.add('overlay');
    };

    searchIcon.addEventListener('click', () => {
        searchInput.classList.toggle('overlay');
    });
};

// Handler Frunction to handle input in search field.
function searchInputTypeHandler(event) {
    setURLParameters({ search: event.target.value });
    isMobile ? renderAppointmentsMobile() : renderAppointments();
};

// Renderer Funtion to render appointments for mobile.
function renderAppointmentsMobile(appointments = allAppointments) {
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

                renderAppointmentsMobile(allAppointments);
            };

            appointmentRowElement.innerHTML = highlightSearchTerm(appointment.title)

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

// Renderer Funtion to render appointments for Desktop.
function renderAppointments(appointments = allAppointments) {
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
                
                renderAppointments(allAppointments);

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

        appointmentRowElement.innerHTML = highlightSearchTerm(appointment.title);

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

// Funtion to start put on all handlers and start render appointments.
async function render() {
    // Get Appointments from appointments.json local file for test.
    const appointmentsStream = await fetch('./appointments.json');
    allAppointments = await appointmentsStream.json();

    // Call Initialize Functions to put on Event listenrs and Handle Events.
    initBurgerMenuHandler();
    initSearchHandler();

    // Check the Tablet and choose what renderer function should call.
    isMobile = window.innerWidth <= 768;
    isMobile ? renderAppointmentsMobile() : renderAppointments();
};

// Event to listen the HTML dom is ready and call the callback to start our project.
window.addEventListener('DOMContentLoaded', render);