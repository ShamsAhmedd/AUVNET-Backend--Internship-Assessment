const asyncHandler = require("express-async-handler");
const { Category, validateCreateCategory, validateUpdateCategory } = require("../../models/Category");

// Add Category
const addCategory = asyncHandler(async (req, res) => {
    const { error } = validateCreateCategory(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const existing = await Category.findOne({ name: req.body.name });
    if (existing) return res.status(400).json({ error: "This category is already created before" });

    let parent = null;
    if (req.body.parent) {
        const parentExists = await Category.findById(req.body.parent);
        if (!parentExists) return res.status(400).json({ error: "Parent category not found" });
        parent = req.body.parent;
    }

    const newCategory = new Category({
        name: req.body.name,
        parent
    });

    const saved = await newCategory.save();
    const populated = await Category.findById(saved._id).populate("parent", "name");

    res.status(201).json({
        message: "Category created successfully",
        category: populated
    });
});

// Get All Root Categories
const getRootCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find({ parent: null });
    res.json(categories);
});

// Get Children for a Category
const getChildrenCategories = asyncHandler(async (req, res) => {
    const parent = await Category.findById(req.params.id);
    if (!parent) return res.status(404).json({ error: "Parent category not found" });

    const children = await Category.find({ parent: req.params.id });
    res.json(children);
});

// Get All Categories
const getAllCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find().populate("parent", "name");
    res.json(categories);
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
    const { error } = validateUpdateCategory(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    if (req.body.parent === req.params.id) {
        return res.status(400).json({ error: "A category cannot be its own parent" });
    }

    if (req.body.parent) {
        const parentExists = await Category.findById(req.body.parent);
        if (!parentExists) return res.status(400).json({ error: "Parent category not found" });
    }

    category.name = req.body.name || category.name;
    category.parent = req.body.parent ?? null;

    const updated = await category.save();
    const populated = await Category.findById(updated._id).populate("parent", "name");

    res.json({
        message: "Category updated successfully",
        category: populated
    });
});

// Delete Category & Its Subcategories
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const deleteRecursively = async (parentId) => {
        const children = await Category.find({ parent: parentId });
        for (const child of children) {
        await deleteRecursively(child._id);
        await child.deleteOne();
        }
    };

    await deleteRecursively(category._id);
    await category.deleteOne();

    res.json({ message: "Category and its subcategories deleted successfully" });
});

module.exports = {addCategory,getRootCategory,getChildrenCategories,getAllCategory,updateCategory,deleteCategory};
