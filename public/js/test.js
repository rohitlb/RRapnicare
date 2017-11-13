$(function () {

    // $('.modal').modal({
    //     dismissible:true,
    //     opacity: 0,
    //     inDuration: 300,
    //     outDuration:200,
    //     startingTop:'70%',
    //     endingTop: '10%'
    //     //translate: scaleX(0.4)
    //     //startingRight: '4%',
    //     //endingRight: '80%'
    // });

    $(':reset');


    $('#drug_form2').hide();
    $('#enter_more_data').click(function () {
        $('#enter_more_data').hide();
        $('#drugs1').hide();
        $('#reset_button').hide();
        $('#drug_form2').show();
    });


    $('#profile2').hide();
    $('#profile3').hide();
    $('#doctor_card').click(function () {
        $('#profile1').hide();
        $('#profile2').show();
    });
    $('#pharmacist_card').click(function () {
        $('#profile1').hide();
        $('#profile3').show();
    });


    // TO ADD NEW TEXT FIELD IN MOLECULE DATA FORM
    $('#new_text').hide();
    $('#cl').hide();
    $('#add_button').click(function () {
        $('#new_text').show();
        $('#cl').show();
    });

    // TO CLOSE THE ABOVE OPENED TEXT FIELD IN MOLECULE DATA FORM
    $('#cl').click(function () {
        $('#new_field').hide();
    });




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


    // var slider = document.getElementById('test-slider');
    // noUISlider.create(slider, {
    //    start : [10],
    //    step: 2,
    //    connect: true,
    //    range: {
    //        'min' : [0],
    //        'profile' : [20],
    //        'drug': [40],
    //        'molecule': [60],
    //        'disease': [80],
    //        'max' : [100]
    //    }
    // });


    // ................FOR PROFILE OF DOCTOR ...................

    $('#create_profile1').click(function () {
        var name = $('#name').val();
        var specialization = $('#specialization').val();
        var city = $('#city').val();

        var data = {
            name : name,
            specialization : specialization,
            city : city
        };
        $.ajax({
            url: '/doctor_details',
            type: 'POST',
            data : JSON.stringify(data),
            contentType : 'application/json',
            success: function (result) {
                if(result.success === 'success')
                {
                    Materialize.toast(result.message,1000);
                    window.render= '/health_care_provider?page=profile_doctor';
                    alert("msg");
                }
                else
                {
                    Materialize.toast(result.message,1000);
                }
            }
        });
        //window.location = '/health_care_provider?page=profile_doctor';
        // $('#profile2').hide();
        // $('#main_profile_doctor').show();
    });



    $('#basic_details').click(function () {
        var gender = $("input[type='radio'][name='gender']:checked").val();
        var city = $('#city').val();
        var experience = $('#year_of_experience').val();
        var about = $('#about_you').val();
        var data = {
            gender : gender,
            city: city,
            experience : experience,
            about: about
        }
        $.ajax({
            url: '/basic',
            type: 'POST',
            data : JSON.stringify(data),
            contentType : 'application/json',
            success: function (result) {
                if(result.success === 'success')
                {
                    Materialize.toast(result.message,1000);
                }
                else
                {
                    Materialize.toast(result.message,1000);
                }
            }
            //window.location = '/health_care_provider?page=profile_pharmacist';
            // $('#profile3').hide();
            // $('#main_profile_pharmacist').show();
        });
        //$('#tab2').focus();
        $('#main_profile_doctor ul.tabs li.tab a').hover(function() {
            $('#tab2').addClass('active').find('li.tab').show().css({'background-color':'lavender'});
        });
        $('#basic_detail').hide();
        $('#edu_special').show();
    });

    $('#education').click(function () {
        var qualification = $('#qualification').val();
        var college = $('#college').val();
        var completion_year = $('#completion_year').val();

        var data = {
            qualification : qualification,
            college : college,
            completion : completion_year
        }
        $.ajax({
            url: '/education',
            type: 'POST',
            data : JSON.stringify(data),
            contentType : 'application/json',
            success: function (result) {
                if(result.success === 'success')
                {
                    Materialize.toast(result.message,1000);
                }
                else
                {
                    Materialize.toast(result.message,1000);
                }
            }
        });
        //$('#tab3').focus();
        $('#main_profile_doctor ul.tabs li.tab a').hover(function() {
            $('#tab3').addClass('active').find('li.tab').show().css({'background-color':'lavender'});
        });

        $('#edu_special').hide();
        $('#register_doc').show();
    });

    $('.upload_image1').submit(function () {
        var council_number = $('#council_reg_no').val();
        var council_name = $('#council_name').val();
        var council_year = $('#council_year').val();
        alert(council_number);
        alert(council_name);
        alert(council_year);
        var data = {
            council_number : council_number,
            council_name : council_name,
            council_year : council_year
        }
        $.ajax({
            url: '/certificate',
            type: 'POST',
            data : JSON.stringify(data),
            contentType : 'application/json',
            success: function (result) {
                if(result.success === 'success')
                {
                    Materialize.toast(result.message,1000);
                }
                else
                {
                    Materialize.toast(result.message,1000);
                }
            }
        });

    });

    // $('.upload_image').submit(function (e) {
    //     e.preventDefault();
    //     $.ajax({
    //         url: '/certificate',
    //         type: 'POST',
    //         contentType : 'application/json',
    //         success: function (result) {
    //             if(result.success === 'success')
    //             {
    //                 Materialize.toast(result.message,1000);
    //             }
    //             else
    //             {
    //                 Materialize.toast(result.message,1000);
    //             }
    //         }
    //     });
    //
    // });




    // ................FOR PROFILE OF PHARMACISTS ...................

    $('#create_profile2').click(function () {
        var name = $('#name').val();
        //var specialization = $('#specialization').val();
        var city = $('#city').val();

        var data = {
            name : name,
            city : city
        };
        $.ajax({
            url: '/doctor_details',
            type: 'POST',
            data : JSON.stringify(data),
            contentType : 'application/json',
            success: function (result) {
                if(result.success === 'success')
                {
                    Materialize.toast(result.message,1000);
                    window.location= '/health_care_provider?page=profile_pharmacist';
                }
                else
                {
                    Materialize.toast(result.message,1000);
                }
            }
        //window.location = '/health_care_provider?page=profile_pharmacist';
        // $('#profile3').hide();
        // $('#main_profile_pharmacist').show();
    });
    });


    //$('select').material_select();

    // TABS USED IN PROFILE STEP 3
    $('ul.tabs').tabs('select_tab','#tab3');

    // $('.file_upload').change(function(input) {
    //     if(input.files && input.files[0])
    //     {
    //         var reader = new FileReader();
    //         $('#{reader}').load(function (e) {
    //             $('#image_for_docs1').attr('src',e.target.result);
    //             $('#image_for_docs2').attr('src',e.target.result);
    //         });
    //         $('#{reader}').readAsDataURL(input.files[0]);
    //     }
    // });

    $('.datepicker').pickadate({

        selectYears: 50,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false
    });



    $('.button-collapse').sideNav({
        menuWidth: 255,
        edge: 'left',
        closeOnClick: true,
        draggable: true,
        opacity: 0,
        onOpen: function openNav() {
            $('#side_navbar').click(function () {
                width = "250px";
            });

            $('#navBar').click(function () {
                marginLeft = "250px";
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


    // ...................FORM VALIDATION.......................

    // $('form[name="drug_form1"]').validate({
    //     //Materialize.toast('this is a test', 2000);
    //
    //         brand_name : "required",
    //         company_name : "required",
    //         categories : "required",
    //         strength : "required",
    //         potent_substances : "required",
    //         dosage_form : "required",
    //         packaging : "required",
    //         price : "required",
    //
    //
    //     messages : {
    //         brand_name : "Required!",
    //         company_name : "Required!",
    //         categories : "Required!",
    //         strength : "Required!",
    //         potent_substances : "Required!",
    //         dosage_form : "Required!",
    //         packaging : "Required!",
    //         price : "Required!"
    //     },
    //     submitHandler: function(form) {
    //         form.submit();
    //     }
    // });

});


// function readURL(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//
//         reader.onload = function (e) {
//             $('#image_for_docs1').attr('src', e.target.result);
//             $('#image_for_docs2').attr('src', e.target.result);
//         };
//
//         reader.readAsDataURL(input.files[0]);
//     }
// }


// function validateForm() {
//     var brand_name = document.forms["drug_form1"]["brand_name"].value;
//     if (x == "") {
//         alert("Name must be filled out");
//         return false;
//     }
// }


// function validateForm() {
//     Materialize.toast('this is a test', 2000);
//
//     $('#drugs1').click(function () {
//             var brand_name = document.forms["drug_form1"]["brand_name"].value;
//             var categories = document.forms["drug_form1"]["brand_name"].value;
//             var company_name = document.forms["drug_form1"]["brand_name"].value;
//             var strength = document.forms["drug_form1"]["brand_name"].value;
//             var potent_substances = document.forms["drug_form1"]["brand_name"].value;
//             var dosage_form = document.forms["drug_form1"]["brand_name"].value;
//             var packaging = document.forms["drug_form1"]["brand_name"].value;
//             var price = document.forms["drug_form1"]["brand_name"].value;
//
//             if (brand_name == '' || categories == '' || company_name == '' || strength == '' || potent_substances == '' || dosage_form == '' || packaging == '' || price == '') {
//                 alert("All Fields must be filled out");
//                 return false;
//             }
//             return true;
//         }
//     );
// }
//         var prescription = $('#prescription').val;
//         var dose_taken = $('#dose_taken').val;
//         var dose_timing = $('#dose_timing').val;
//         var warnings = $('#warnings').val;
//         var primarily_used_for = $('#primarily_used_for').val;
//         var molecule_name = $('#molecule_name').val;
//         var drug_category = $('#drug_category').val;
//         var short_description = $('#short_description').val;
//         var absorption = $('#absorption').val;
//         var distribution = $('#distribution').val;
//         var metabolism = $('#metabolism').val;
//         var excretion = $('#excretion').val;
//         var side_effects = $('#side_effects').val;
//         var special_precautions = $('#special_precautions').val;
//         var other_drug_interactions = $('#other_drug_interactions').val;
//         var food_interaction = $('#food_interaction').val;
//         var oral_dosage = $('#oral_dosage').val;
//         var intravenous_dosage = $('#intravenous_dosage').val;
//         var food_before_after = $('#food_before_after').val;
//         var in_pregnancy = $('#in_pregnancy').val;
//         var in_lactation = $('#in_lactation').val;
//         var in_children = $('#in_children').val;
//         var storage = $('#storage').val;
//         var in_geriatric = $('#in_geriatric').val;
//         var other_contraindications = $('#other_contraindications').val;
//         var lab_interference = $('#lab_interference').val;
//         //var company_name = $('#').val;
//
//
//         alert("Name must be filled out");
//         return false;
//     });
//     return true;
// }

// function openNav() {
//     document.getElementById("mySidenav").style.width = "230px";
//     document.getElementById("main").style.marginLeft = "230px";
// }
// function closeNav() {
//     document.getElementById("mySidenav").style.width = "0";
//     document.getElementById("main").style.marginLeft= "0";
// }
