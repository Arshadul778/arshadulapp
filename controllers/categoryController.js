import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async(req,res) => {
    try {
        const {name} = req.body
        if(!name) {
            return res.status(401).send({message:"Name is required"})
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"Category Already existing"
            })
        }
        const category = await new categoryModel({name,slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:"New Category Created",
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Catagory'
        })
    }
};

//update updateCategoryController
export const updateCategoryController = async(req,res) => {
    try {
        const {name}= req.body
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(
            id,
            {name,slug:slugify(name)},
            {new:true}
            );
        res.status(200).send({
            success:true,
            message:"c u s",
            category,
        });


    } catch(error){
        console.log(error)
        res.status(500).send({
            success:true,
            error,
            message:"error updating"
        })
    }
}