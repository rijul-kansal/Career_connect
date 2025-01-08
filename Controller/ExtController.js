const axios = require('axios');
const ErrorClass = require('./../Utils/ErrorClass');
const getState = async (req, res, next) => {
    try {
        const country = req.body.country;
        if (!country) {
            return next(new ErrorClass('Please pass country', 400));
        }

        const { data } = await axios.post('https://countriesnow.space/api/v0.1/countries/states', { country });
        const response = {
            status: true,
            data: data.data,
        };

        res.status(200).json(response);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return next(new ErrorClass(err.response.data.msg,400));
        }else
        {
            return next(new ErrorClass(err.message,400));
        }
    }
};

const getCity = async (req, res, next) => {
    try {
        const {country,state} = req.body;
        if (!country || !state) {
            return next(new ErrorClass('Please pass country or state', 400));
        }

        const { data } = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', { country,state });
        const response = {
            status: true,
            data: data.data,
        };

        res.status(200).json(response);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return next(new ErrorClass(err.response.data.msg,400));
        }else
        {
            return next(new ErrorClass(err.message,400));
        }
    }
};
module.exports = {
    getState,
    getCity
}
