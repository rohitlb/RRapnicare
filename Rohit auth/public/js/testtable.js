$(document).ready(function(){

    $('#disptable').hide();
    $('.btn').click(function() {

        $('#disptable').show();
            //var name= $('#name').val();
            //var number=$('#number').val();
            //var password=$('#password').val();

        // var data={
        //     name: name,
        //     number: number,
        //     password: password
        // };

        $.ajax(
            {
                url: "/table",
                method: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(result) {

                    result=JSON.parse(result);
                    $('.centered tbody tr').each(function() {
                        $('td').getElementById('#name #number #password');
                    });

                    //Materialize.toast(result.message,5000);
                },
                error: function (err) {

                    console.log(err);
                }
            });
    });
});