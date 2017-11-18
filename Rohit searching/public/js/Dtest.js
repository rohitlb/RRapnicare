$(document).ready(function() {
//for otp request
$('#Dsend').click(function () {


    var name = $('#name').val();
    var number = $('#number').val();

    var data = {
        name: name,
        number: number
    };

    $.ajax(
        {
            url: "/DoctorsendOTP",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {

                if (result.status === "success") {
                    Materialize.toast(result.message, 2000);
                    $('#divider').hide();
                    $('#healthCare').hide();
                    $('#send').hide();
                    $('#loginButton12').hide();
                    //$('#change').show();

                    $('#pass').show();

                    $('#name').attr('disabled','disabled');
                    $('#number').attr('disabled','disabled');
                    $('#password1').attr('disabled','disabled');
                }
                else {
                    Materialize.toast(result.message, 2000);

                }

            },
            error: function (err) {

            }
        }

    )

});

$('#Dverify').click(function () {
    var otp = $('#otp').val();

    var data = {
        number: otp
    };

    $.ajax(
        {
            url: "/VerifyOTP",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {

                if (result) {
                    Materialize.toast(result.message, 2000);
                    $('#password1').removeAttr('disabled');

                }
                else {
                    Materialize.toast(result.message, 2000);

                }

            },
            error: function (err) {

            }
        }

    )

});


$('#DsubmitButton').click(function () {

    var name = $('#name').val();
    var email = $('#email').val();
    var number = $('#number').val();
    var password = $('#password1').val();
    //var otp = $('#otp').val();

    var data = {
        name: name,
        email: email,
        number: number,
        password: password
        //  otp: otp
    };

    $.ajax(
        {
            url: "/doctorregister",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {

                if (result.status === "success") {
                    window.location = '/occupation';

                }
                else {
                    Materialize.toast(result.message, 2000);
                }

            },
            error: function (err) {

                console.log(err);
            }
        }
    )
});




//for login

$('#DloginButton1').click(function () {

    // $('#preloader').show();

    var number = $('#number2').val();
    var password = $('#password2').val();

    var data1 = {

        number: number,
        password: password
    };

    $.ajax(
        {
            url: "/doctorlogin",
            method: 'POST',
            data: JSON.stringify(data1),
            contentType: 'application/json',
            success: function (result) {

                if (result.status === "success") {
                    window.location = '/profiles';

                }
                else {
                    Materialize.toast(result.message, 2000);
                }

            },
            error: function (err) {

                console.log(err);
            }
        }
    )
});
//for forgot password
$('#DOTPforForgot').click(function () {


    // var name = $('#name').val();
    var number = $('#registeredMOB').val();

    var data = {
        //name: name,
        number: number
    };

    $.ajax(
        {
            url: "/doctorcheckforgotpassword",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {

                if (result.status === "success") {
                    Materialize.toast(result.message, 2000);

                    $('#OTPforForgot').hide();
                    $('#pass1').show();
                    $('#healthCare').hide();
                    $('#Customer').hide();
                    $('#password3').attr('disabled','disabled');
                }
                else {
                    Materialize.toast(result.message, 2000);
                    //$('#change').click(function () {
                    //  $('#number').removeAttr('disabled');
                    //$('#password').attr('disabled','disabled');

                    //});
                }

            },
            error: function (err) {

            }
        }

    )

});
//for verification
$('#Dverify1').click(function () {
    var otp = $('#otp1').val();

    var data = {
        number: otp
    };

    $.ajax(
        {
            url: "/VerifyOTP",
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {

                if (result) {
                    Materialize.toast(result.message, 2000);
                    $('#password3').removeAttr('disabled');

                }
                else {
                    Materialize.toast(result.message, 2000);

                }

            },
            error: function (err) {

            }
        }

    )

});



$('#DagainLogin').click(function () {

    //$('#preloader').show();

    //var number = $('#registeredMOB').val();
    var password = $('#password3').val();

    var data1 = {

        //number: number,
        password: password
    };

    $.ajax(
        {
            url: "/doctorupdatepassword",
            method: 'POST',
            data: JSON.stringify(data1),
            contentType: 'application/json',
            success: function (result) {

                if (result.status === "success") {
                    window.location = '/profiles';

                }
                else {
                    Materialize.toast(result.message, 2000);
                }

            },
            error: function (err) {

                console.log(err);
            }
        }
    )
});


});