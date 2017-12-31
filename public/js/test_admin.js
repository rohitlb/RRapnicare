$(document).ready(function () {

    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'right', // Displays dropdown with edge aligned to the left of button
        stopPropagation: false // Stops event propagation
    });

    // PROFILE NAV-BAR TOOLTIPS: PROFILE AND NOTIFICATIONS
    $('.tooltipped').tooltip({
        delay: 5000,
        fontSize: '0.5rem'
    });


    $('.button-collapse').sideNav({
        menuWidth: 270,
        edge: 'left',
        closeOnClick: true,
        draggable: true,
        opacity: 0,
        onOpen: function openNav() {
            $('#side_navbar').click(function () {
                width = "270px";
            });

            $('#navBar').click(function () {
                marginLeft = "270px";
            });
            //$('#menubar').hide();
        },
        onClose: function closeNav() {
            $('#side_navbar').click(function () {
                width = "0px";
            });

            $('#navBar').click(function () {
                marginLeft = '0px';
            });
        }
    });





});