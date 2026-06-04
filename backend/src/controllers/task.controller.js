import Task from "../models/task.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllTasks = asyncHandler(async (req, res) => {
    const { status, priority, search } = req.query;

    const filter = {
        userId: req.user._id,
    };

    if (status) {
        filter.status = status;
    }

    if (priority) {
        filter.priority = priority;
    }

    if (search) {
        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    const tasks = await Task.find(filter).sort({
        createdAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                count: tasks.length,
                tasks,
            },
            "Tasks fetched successfully"
        )
    );
});

const getTask = asyncHandler(async (req, res) => {
    const task = await Task.findOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            task,
            "Task fetched successfully"
        )
    );
});

const createTask = asyncHandler(async (req, res) => {
    const { title, description, priority, dueDate } = req.body;

    if (!title?.trim()) {
        throw new ApiError(400, "Task title is required");
    }

    const task = await Task.create({
        title,
        description,
        priority,
        dueDate,
        userId: req.user._id,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            task,
            "Task created successfully"
        )
    );
});

const updateTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            task,
            "Task updated successfully"
        )
    );
});

const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Task deleted successfully"
        )
    );
});

const toggleTask = asyncHandler(async (req, res) => {
    const task = await Task.findOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    task.status =
        task.status === "completed"
            ? "pending"
            : "completed";

    await task.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            task,
            "Task status updated successfully"
        )
    );
});

export {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
};