$(document).ready(function () {

    $(window).scroll(function () {

        if($(this).scrollTop() > 50){
            $('#scrollButton').fadeIn();
        }
        else{
            $('#scrollButton').fadeOut();
        }
    });

    $('#scrollButton').click(function () {
        $('html, body').animate({scrollTop: 0}, 600);
        return false;
    });

    //send OTP Button AJAX handler
    $("#sendOTPButton").click(function () {

        var mobNumber = $('#mobNumber').val();
        var mobNumberRegx = "^[0-9]{10}$";

        var result = mobNumber.match(mobNumberRegx);

        if(!result){
            alert('invalid number');
            return;
        }

        $.ajax(
            {
                type: 'POST',
                url: "/signup",
                data:
                    {
                        'contact': mobNumber
                    },
                success: function (res) {
                    var response = JSON.parse(res);

                    switch(response.success)
                    {
                        //failure case
                        case 0:
                            alert(response.error);
                            break;
                        //successfully sent OTP case
                        case 1:
                            alert('sending OTP..wait');
                            break;
                    }
                }
            }
        );
    });

    $("#signupButton").click(function () {

        var mobNum = $('#mobNumber').val();
        var otp = $('#otp').val();
        var password = $('#password').val();

        $.ajax(
            {
                type: 'POST',
                url: "/signup/register",
                data:
                    {
                        'mobNum': mobNum,
                        'otp': otp,
                        'password': password
                    },
                success: function (res) {
                    var response = JSON.parse(res);

                    switch (response.success)
                    {
                        case 0:
                            alert(response.error);
                            break;
                        case 1:
                            alert('successfully signed up');
                            break;
                        default:
                            alert('Please try again\nThere was some error');
                            break;
                    }
                }
            }
        );
    });

});