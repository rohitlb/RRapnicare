$(document).ready(function() {

    //     $('#main').hide();
    // $('#nav').hide();
    // //dropdown


    $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrainWidth: true, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true,
            alignment: 'left',
            stopPropagation: false
        }
    );

    // $('#upload').click(function () {
    //     var upload=$('#images').val();
    //     var data={
    //         upload1 = upload
    //     };
    //     $.ajax(
    //         {
    //             url:"/upload",
    //             method: 'POST',
    //             data: JSON.stringify(data),
    //             contentType:'application/json',
    //             success:function (result) {
    //
    //             },
    //             error:function (err) {
    //                 console.log(err);
    //
    //             }
    //         }
    //     )
    //
    // })


});