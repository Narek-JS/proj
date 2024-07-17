
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

    searchIcon.addEventListener('click', function() {
        searchInput.classList.toggle('overlay');
    });
})();

function searchInputTypeHandler(event) {
    const searchInput = event.target;
    if(searchInput instanceof HTMLInputElement === false) {
        return;
    };

    console.log('searchInput.value --> ', searchInput.value);
};

const initialAppointments = [
    { 
        link: "#",
        title: 'Aestheic & Anti-Aging',
        children: [
            { link: "#", title: "Doctor Consultation" },
            {
                link: "#",
                title: "Injection",
                children: [
                    {
                        link: "#",
                        title: "Dermal Filler Injections",
                        children: [
                            { link: "#", title: "asdasdasdasdPRP Hair " },
                            { link: "#", title: "PRP Face & Neck" }
                        ],
                    },
                    { link: "#", title: "Botulinum Toxin" },
                    { link: "#", title: "Fat Burner Injection" },
                    { 
                        link: "#",
                        title: "PRP",
                        children: [
                            { link: "#", title: "PRP Hair " },
                            { link: "#", title: "PRP Face & Neck" }
                        ],
                    },
                    { link: "#", title: "Mesotheraphy" }
                ]
            },
            { link: "#", title: "Devices" },
            { link: "#", title: "Skin Treatment" },
            { link: "#", title: "IV Drips" }
        ]
    },
    { link: "#", title: 'Hardware Cosmetology' },
    { link: "#", title: 'Plastic Surgery' },
    { link: "#", title: 'Dental' },
    { link: "#", title: 'Hair Transplant' },
    { link: "#", title: 'Dental' }
];


function renderAppointments(appointments) {
    const appointmentsElement = document.querySelector('.appointments');
    appointmentsElement.innerHTML = '';


    const appointmentsGroup = document.createElement('div');
    appointmentsGroup.classList.add('appointments__group');

    appointments.forEach((appointment) => {
        const appointmentRowElement = document.createElement('li');
        appointmentRowElement.onclick = () => {
            if(appointment.children) {
                appointment.active = !Boolean(appointment.active);
                renderAppointments(initialAppointments);
            };
        };

        if(appointment.children) {
            appointmentRowElement.classList.add('withChildren');
        };

        const appointmentLinkElement = document.createElement('a');
        appointmentLinkElement.href = appointment.link;
        appointmentLinkElement.innerHTML = appointment.title;

        appointmentRowElement.appendChild(appointmentLinkElement);
        appointmentsGroup.appendChild(appointmentRowElement);
        appointmentsElement.prepend(appointmentsGroup);

        if(appointment.active && appointment.children) {
            renderAppointments(appointment.children);
        };
    });

    console.log('initialAppointments --> ', initialAppointments);
};

renderAppointments(initialAppointments);