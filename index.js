
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
                            { title: "Face & Neck" }
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
    { title: 'Hardware Cosmetology' },
    { title: 'Plastic Surgery' },
    { title: 'Dental' },
    { title: 'Hair Transplant' },
    { title: 'Dental' }
];


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

        appointmentRowElement.innerText = appointment.title

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

renderAppointments(initialAppointments);