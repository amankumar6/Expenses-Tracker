const asyncHandler = require("express-async-handler");

const Category = require("../model/Category");
const Transaction = require("../model/Transaction");

const categoryController = {
    // Create Category
    createCategory: asyncHandler(async (req, res) => {
        const { name, type } = req.body;
        if (!name || !type) {
            throw new Error(
                "Name and type are required for creating a category"
            );
        }

        const normalizedName = name.toLowerCase();
        const validTypes = ["income", "expense"];

        // checking if type is valid or not
        if (!validTypes.includes(type.toLowerCase())) {
            throw new Error("Invalid category type " + type);
        }

        // check if category already exists on the user
        const categoryExists = await Category.findOne({
            name: normalizedName,
            user: req.user,
        });

        if (categoryExists) {
            throw new Error(
                `Category '${categoryExists.name}' already exists.`
            );
        }

        const category = await Category.create({
            name: normalizedName,
            user: req.user,
            type,
        });

        res.status(201).json(category);
    }),

    // Reading Category
    readingCategory: asyncHandler(async (req, res) => {
        const { id } = req.query;

        if (id) {
            const category = await Category.findById(id);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
            return res.status(200).json(category);
        } else {
            // Return all categories
            const categories = await Category.find({ user: req.user });
            return res.status(200).json(categories);
        }
    }),

    // Update Category
    updateCategory: asyncHandler(async (req, res) => {
        const categoryId = req.params.id;
        const { type: newType, name: newName } = req.body;

        const normalizedName = newName.toLowerCase();
        const category = await Category.findById(categoryId);

        if (!category) {
            throw new Error("Category not found.");
        }

        if (category.user.toString() !== req.user.toString()) {
            throw new Error("User not authorized");
        }

        const oldName = category.name;

        //Update category
        category.name = normalizedName;
        category.type = newType;

        const updatedCategory = await category.save();

        //Update affected transaction
        if (oldName !== updatedCategory.name) {
            await Transaction.updateMany(
                {
                    user: req.user,
                    category: oldName,
                },
                {
                    $set: {
                        category: updatedCategory.name,
                    },
                }
            );
        }

        res.json(updatedCategory);
    }),

    // Delete Category
    deleteCategory: asyncHandler(async (req, res) => {
        const category = await Category.findById(req.params.id);

        // update transaction
        if (category && category.user.toString() === req.user.toString()) {
            await Transaction.updateMany(
                {
                    user: req.user,
                    category: category.name,
                },
                {
                    $set: {
                        category: "Uncategorized",
                    },
                }
            );

            // remove category
            await Category.findByIdAndDelete(req.params.id);

            res.json({
                message: "Category removed and transactions updated",
            });
        } else {
            if (category.user.toString() === req.user.toString())
                res.json({
                    message: "User not authorized",
                });
            else
                res.json({
                    message: "Category not found",
                });
        }
    }),
};

module.exports = categoryController;
