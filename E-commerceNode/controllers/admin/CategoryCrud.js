const asyncHandler = require("express-async-handler");
const { Category, validateCreateCategory, validateUpdateCategory } = require("../../models/Category");

//Add Category
const addCategory = asyncHandler(async (req, res) => {

    const { error } = validateCreateCategory(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let category = await Category.findOne({ name: req.body.name });
        if (category) {
            return res.status(400).json({ error: "This category is already created before" }); 
        }

    let parent = null;

    if (req.body.parent) {
        const parentCategory = await Category.findById(req.body.parent);
        if (!parentCategory) {
        return res.status(400).json({ error: "Parent category not found" });
        }
        parent = req.body.parent;
    }

    const categories = new Category({
        name: req.body.name,
        parent: parent
    });

    const savedCategory = await categories.save();

    const populatedCategory = await Category.findById(savedCategory._id).populate("parent","name");

    return res.status(201).json({
    message: "Category created successfully",
    category: populatedCategory
});
});

//Get root category
const getRootCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find({ parent: null });
    res.json(categories);
});

//Get children category
const getChildrenCategories = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Children Categories not found" });
    const categories = await Category.find({ parent: req.params.id });
    res.json(categories);
});

//get all categories
const getAllCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

//Update Categories
const updateCategory = asyncHandler(async (req, res) => {

    const { error } = validateUpdateCategory(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    if (req.body.parent === req.params.id) {
        return res.status(400).json({ error: "A category cannot be its own parent" });
    }

    category.name = req.body.name || category.name;
    category.parent = req.body.parent ?? category.parent;

    const updatedCategory = await category.save();
    const populatedCategory = await Category.findById(updatedCategory._id).populate("parent", "name");

    res.json({ message: "Category updated successfully", category: populatedCategory });
});

//Delete Categories and its sub categories
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    
    if (!category) return res.status(404).json({ error: "Category not found" });

    async function deleteChildren(parentId) {
    const children = await Category.find({ parent: parentId });
    for (const child of children) {
        await deleteChildren(child._id); 
        await child.deleteOne(); 
        }
    }

    await deleteChildren(category._id); 
    await category.deleteOne(); 

    res.json({ message: "Category and all sub-categories deleted successfully" });
});

module.exports = { addCategory , getRootCategory , getChildrenCategories ,getAllCategory, updateCategory , deleteCategory};
