const { query } = require("express");
const Product = require("../models/Products");


module.exports = {
    createProduct: async(req, res) => {
        const newProduct = new Product(req.body);
        try {
            await newProduct.save();
            res.status(200).json("product created successfully")
        } catch (error) {
            res.status(500).json("failed to create the product")
        }
    },

    getAllProduct: async(req, res)=> {
        try {
            const products = await Product.find().sort({ createAt: -1 })
            res.status(200).json(products)
        } catch (error) {
            res.status(500).json("failed to get the products")
        }
    },
    getProduct: async(req, res) => {
        try {
            const product = await Product.findById(req.params.id)
            res.status(200).json(product)
        } catch (error) {
            res.status(500).json("failed to get the product")
        }
    },
    searchProduct: async(reg, res) => {
        try {
            const result = await Product.aggregate(
                [
                    {
                        $search: {
                            index: "furniture",
                            text: {
                                query: req.params.key,
                                path: {
                                    wildcard: "*"
                                }
                            }
                        }
                    }
                ]
            )
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json("failed to get the product")
        }
    },
    search : async(req, res) => {
        const search = req.params.search;
        try {
            const product = await Product.find({'title': { $regex: ".*"+search+".*"}});
            if (product.length > 0) {
                res.status(200).json(product)
            } else {
                res.status(201).json([])
            }
        } catch (error) {
            res.status(500).json({"message": "error status 500"});
        }
    }

}