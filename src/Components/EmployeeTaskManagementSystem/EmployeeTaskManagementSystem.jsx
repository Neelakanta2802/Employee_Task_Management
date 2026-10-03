import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/tasks";

export default function EmployeeTaskManagement() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        dueDate: ""
    });

    const [searchText, setSearchText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedPriority, setSelectedPriority] = useState("All");

    // null = Add mode
    // id = Edit mode
    const [editingId, setEditingId] = useState(null);

    // GET ALL TASKS
    const getTasks = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API_URL);
            setTasks(response.data);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch tasks"
            );
        } finally {
            setLoading(false);
        }
    };

    // HANDLE INPUT
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };

    // ADD / EDIT TASK
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");

            if (editingId) {

                // EDIT
                const response = await axios.put(
                    `${API_URL}/${editingId}`,
                    form
                );

                setTasks(
                    tasks.map(task =>
                        task._id === editingId
                            ? response.data
                            : task
                    )
                );

                setEditingId(null);

            } else {

                // ADD
                const response = await axios.post(
                    API_URL,
                    form
                );

                setTasks([
                    ...tasks,
                    response.data
                ]);
            }

            // Clear form
            setForm({
                title: "",
                description: "",
                priority: "Medium",
                status: "Pending",
                dueDate: ""
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save task"
            );
        }
    };

    // START EDITING
    const editTask = (task) => {
        setEditingId(task._id);

        setForm({
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate.split("T")[0]
        });
    };

    // CANCEL EDIT
    const cancelEdit = () => {
        setEditingId(null);

        setForm({
            title: "",
            description: "",
            priority: "Medium",
            status: "Pending",
            dueDate: ""
        });
    };

    // SEARCH + FILTER
    const filteredTasks = tasks.filter((task) => {

        const matchesSearch =
            task.title
                .toLowerCase()
                .includes(searchText.toLowerCase());

        const matchesStatus =
            selectedStatus === "All" ||
            task.status === selectedStatus;

        const matchesPriority =
            selectedPriority === "All" ||
            task.priority === selectedPriority;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
        );
    });

    // DASHBOARD
    const totalTasks = tasks.length;

    const pendingTasks = tasks.filter(
        task => task.status === "Pending"
    ).length;

    const inProgressTasks = tasks.filter(
        task => task.status === "In Progress"
    ).length;

    const completedTasks = tasks.filter(
        task => task.status === "Completed"
    ).length;

    // DELETE
    const deleteTask = async (id) => {
        try {
            setError("");

            await axios.delete(`${API_URL}/${id}`);

            setTasks(
                tasks.filter(task => task._id !== id)
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        }
    };

    // LOAD TASKS
    useEffect(() => {
        getTasks();
    }, []);

    return (
        <div>

            <h1>Employee Task Management</h1>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            {/* DASHBOARD */}
            <div>
                <h2>Dashboard</h2>

                <p>Total: {totalTasks}</p>
                <p>Pending: {pendingTasks}</p>
                <p>In Progress: {inProgressTasks}</p>
                <p>Completed: {completedTasks}</p>
            </div>

            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search by title..."
                value={searchText}
                onChange={(e) =>
                    setSearchText(e.target.value)
                }
            />

            {/* STATUS FILTER */}
            <select
                value={selectedStatus}
                onChange={(e) =>
                    setSelectedStatus(e.target.value)
                }
            >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>

            {/* PRIORITY FILTER */}
            <select
                value={selectedPriority}
                onChange={(e) =>
                    setSelectedPriority(e.target.value)
                }
            >
                <option value="All">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            {/* TASK LIST */}
            <h2>Tasks</h2>

            {filteredTasks.length === 0 && (
                <p>No tasks found.</p>
            )}

            {filteredTasks.map((task) => (
                <div key={task._id}>

                    <h3>{task.title}</h3>

                    <p>
                        Description: {task.description}
                    </p>

                    <p>
                        Due Date:{" "}
                        {new Date(task.dueDate)
                            .toLocaleDateString("en-GB")}
                    </p>

                    <p>
                        Priority: {task.priority}
                    </p>

                    <p>
                        Status: {task.status}
                    </p>

                    <button
                        onClick={() => editTask(task)}
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => deleteTask(task._id)}
                    >
                        Delete
                    </button>

                    <hr />

                </div>
            ))}

            {/* FORM */}
            <h2>
                {editingId ? "Edit Task" : "Add Task"}
            </h2>

            <form onSubmit={handleSubmit}>

                <input
                    name="title"
                    placeholder="Task Title"
                    value={form.title}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>

                <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                />

                <button type="submit">
                    {editingId ? "Update Task" : "Add Task"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                    >
                        Cancel
                    </button>
                )}

            </form>

        </div>
    );
}