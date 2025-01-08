const axios = require('axios');
const ErrorClass = require('./../Utils/ErrorClass');
const { messaging } = require('firebase-admin');
const getState = async(req,res,next)=>{

    const country = req.body.country
    if(!country)
    {
        return next(new ErrorClass('Please pass country',400));
    }
    const data  = await axios.post('https://countriesnow.space/api/v0.1/countries/states', {country})
    console.log(data.data)

    let response=
    {
        status:data.data.error,
        data:{
            data:data.data.data
        }
    }

    res.status(200).json(response)
}

module.exports = {
    getState
}
