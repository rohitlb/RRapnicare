var request = require('request');

module.exports = {
    sendOTP : function (api_key, mob_num,req,res,next) {

        const URL = 'https://2factor.in/API/V1/'+api_key+'/SMS/+91'+mob_num+'/AUTOGEN';

        const options = {
            url: URL,
            method: 'GET',
            header:
                {
                    'Accept': 'application/json',
                    'Accept-Charset': 'utf-8'
                }
        };

        request(options,function(err,api_res,body){

            var msg;
            if(err)
            {
                msg = {
                    success: null,
                    error: 'Unable to Send OTP. Try again'
                };

                next(req,res,msg);
                return;
            }

            var json = JSON.parse(body);
            console.log(json);

            switch(json.Status){
                case 'Success':
                    msg = {
                        success: 1,
                        otp_sid: json.Details
                    };
                    break;
                case 'Error':
                    msg = {
                        success: 0,
                        error: json.Details
                    };
                    break;
                default:
                    msg = {
                        success: 0,
                        error: "Please Try Again Later"
                    };
                    break;
            }

            next(req,res,msg);
        });
    },
    checkOTP: function (api_key,otp_sid,otp,req,res,next) {

        const URL = 'https://2factor.in/API/V1/'+api_key+'/SMS/VERIFY/'+otp_sid+'/'+otp;

        const options =
            {
                url: URL,
                method: 'GET',
                header:
                    {
                        'Accept': 'application/json',
                        'Accept-Charset': 'utf-8'
                    }
            };

        request(options,function (err, api_res, body) {

            if(err){
                console.log('error in 2Factor API call');
                next(req,res,null);
                return;
            }

            var json = JSON.parse(body);
            console.log(json);

            next(req,res,json);
            return;
        });
    }
};