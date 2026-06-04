import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a task title"],
            trim: true,
            maxlength: [100, "Task title cannot be more than 100 characters"],
        },

        description: {
            type: String,
            default: "",
            maxlength: [500, "Description cannot be more than 500 characters"],
        },

        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        dueDate: {
            type: Date,
            default: null,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;