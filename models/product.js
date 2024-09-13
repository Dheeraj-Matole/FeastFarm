const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String},
    image: {type:String},
    price: { type: Number, required: true },
    category: { type: String, required: true},
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: '66e34ce19cbe0cbdb56c4ff0'
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}) 

ProductSchema.post('findOneAndDelete', async function (doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Product', ProductSchema)