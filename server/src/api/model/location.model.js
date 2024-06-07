const mongoose = require('../../config/mogoose');
const { v4: uuidv4 } = require('uuid');
const APIError = require('../errors/api-error');
const httpStatus = require('http-status');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    uid: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
}, { timestamps: true });

locationSchema.pre('save', async function save(next) {
    try {
        if (!this.uid || this.uid === '') {
            this.uid = uuidv4();
        }
        return next();
    } catch (error) {
        return next(error);
    }
});

/**
 * Statics
 */
locationSchema.statics = {

    async createLocation(name, latitude, longitude) {
        const location = new this({
            name,
            latitude,
            longitude
        });
        await location.save();
        return location;
    },

    async updateLocation(uid, data) {
        const location = await this.findOneAndUpdate({ uid }, data, { new: true }).exec();
        if (!location) {
            throw new APIError({
                message: 'Location not found',
                status: httpStatus.NOT_FOUND,
            });
        }
        return location;
    },

    async deleteLocation(uid) {
        const location = await this.findOneAndDelete({ uid }).exec();
        if (!location) {
            throw new APIError({
                message: 'Location not found',
                status: httpStatus.NOT_FOUND,
            });
        }
        return location;
    },

    async getLocationById(uid) {
        const location = await this.findOne({ uid }).exec();
        if (!location) {
            throw new APIError({
                message: 'Location not found',
                status: httpStatus.NOT_FOUND,
            });
        }
        return location;
    },

    async getAllLocations() {
        const locations = await this.find().exec();
        return locations;
    }
};

const Location = mongoose.appConn.model('locations', locationSchema);
module.exports = Location;
