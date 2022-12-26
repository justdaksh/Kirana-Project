const mongoose = require("mongoose");

// Creating a Schema / Skeleton for our product
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        trim:true
    },
    description: {
        type: String,
        required:[true,"Please Enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxLength:[8,"Price Cannot exceed 8 characters"]
    },
    rating: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required:true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required:[true,"Please Enter product Category"]
    },
    Stock: {
        type: Number,
        required: [true, "Please Enter Product Stock"],
        maxLength: [4, "Stock Cannot exceed 4 character"],
        default:1
    },
    numOfreviews: {
        type:Number,
        default: 0,
    },
    reviews: [
        {
            name: {
                type: String,
                required: [true, "Please Add a name"]
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    //Adding user to get the details of who created the item
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Product",productSchema)