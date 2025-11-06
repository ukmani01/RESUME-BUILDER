import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const API = import.meta.env.VITE_API || "http://localhost:7000/api";

const sectionColors = {
    education: "bg-indigo-50 border-indigo-300",
    skills: "bg-green-50 border-green-300",
    experience: "bg-yellow-50 border-yellow-300",
    projects: "bg-pink-50 border-pink-300",
    certifications: "bg-purple-50 border-purple-300",
    languages: "bg-teal-50 border-teal-300",
};

export default function ResumeForm({ resume, setResume }) {
    const steps = [
        "Personal",
        "Education & Skills",
        "Experience & Projects",
        "Certifications & Languages",
    ];
    const [step, setStep] = useState(0);

    const defaultForm = {
        personal: { name: "", email: "", phone: "", location: "", summary: "", link: { label: "", url: "" } },
        education: [{ school: "", degree: "", startYear: "", endYear: "", grade: "" }],
        skills: [""],
        experience: [{ company: "", role: "", start: "", end: "", desc: "" }],
        projects: [{ title: "", desc: "", tech: "" }],
        certifications: [""],
        languages: [""],
    };

    const [form, setForm] = useState({ ...defaultForm, ...resume });

    useEffect(() => {
        if (resume) setForm({ ...defaultForm, ...resume });
    }, [resume]);

    const updateField = (key, value) => {
        const newForm = { ...form, [key]: value };
        setForm(newForm);
        setResume(newForm);
    };

    const addItem = (key) => {
        const arr = [...form[key]];
        const emptyItem =
            typeof arr[0] === "string"
                ? ""
                : Object.fromEntries(Object.keys(arr[0] || {}).map((f) => [f, ""]));
        const newForm = { ...form, [key]: [...arr, emptyItem] };
        setForm(newForm);
        setResume(newForm);
    };

    const deleteItem = (key, index) => {
        const arr = [...form[key]];
        if (arr.length > 1) {
            arr.splice(index, 1);
            const newForm = { ...form, [key]: arr };
            setForm(newForm);
            setResume(newForm);
        }
    };

    const updateArrayItem = (key, index, value) => {
        const arr = [...form[key]];
        arr[index] = value;
        const newForm = { ...form, [key]: arr };
        setForm(newForm);
        setResume(newForm);
    };

    const onDragEnd = (key, result) => {
        if (!result.destination) return;
        const arr = Array.from(form[key]);
        const [removed] = arr.splice(result.source.index, 1);
        arr.splice(result.destination.index, 0, removed);
        const newForm = { ...form, [key]: arr };
        setForm(newForm);
        setResume(newForm);
    };

    const handleSave = async () => {
        try {
            await axios.post(`${API}/resume`, form, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert("✅ Resume saved successfully!");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to save resume");
        }
    };

    const renderArraySection = (key, title) => (
        <div className="mb-6">
            <h3 className="font-semibold text-indigo-700 mb-3 text-lg">{title}</h3>
            <DragDropContext onDragEnd={(result) => onDragEnd(key, result)}>
                <Droppable droppableId={key}>
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {form[key].map((item, i) => (
                                <Draggable key={`${key}-${i}`} draggableId={`${key}-${i}`} index={i}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`relative border rounded-xl p-4 mb-3 shadow-md transition-transform duration-200 ${sectionColors[key] || "bg-white border-gray-300"} ${snapshot.isDragging ? "scale-105 shadow-xl" : "hover:scale-102 hover:shadow-lg"}`}
                                        >
                                            <div
                                                {...provided.dragHandleProps}
                                                className="absolute top-2 right-10 cursor-move text-gray-400 hover:text-gray-600"
                                            >
                                                ☰
                                            </div>

                                            {typeof item === "string" ? (
                                                <input
                                                    className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-300"
                                                    value={item}
                                                    placeholder={title.slice(0, -1)}
                                                    onChange={(e) => updateArrayItem(key, i, e.target.value)}
                                                />
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {Object.keys(item)
                                                        .filter((f) => f !== "_id")
                                                        .map((f) => {
                                                            const isTextArea = f === "desc" || f === "tech";
                                                            const fullWidthClass = isTextArea ? "md:col-span-2" : "";
                                                            const baseClass = "border p-2 rounded focus:ring-2 focus:ring-indigo-300";
                                                            const commonProps = {
                                                                key: f,
                                                                className: `${baseClass} ${fullWidthClass}`,
                                                                placeholder: f.charAt(0).toUpperCase() + f.slice(1),
                                                                value: item[f] || "",
                                                                onChange: (e) =>
                                                                    updateArrayItem(key, i, {
                                                                        ...item,
                                                                        [f]: e.target.value,
                                                                    }),
                                                            };
                                                            if (isTextArea) return <textarea {...commonProps} rows={3} />;
                                                            const inputType = f.toLowerCase().includes("year") ? "number" : "text";
                                                            return <input {...commonProps} type={inputType} />;
                                                        })}
                                                </div>
                                            )}

                                            <button
                                                className="absolute top-2 right-2 text-red-500 font-bold hover:text-red-700"
                                                onClick={() => deleteItem(key, i)}
                                            >
                                                ✖
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => addItem(key)}
            >
                + Add {title.slice(0, -1)}
            </button>
        </div>
    );

    return (


        //




        <div className="space-y-6 p-6 bg-gray-50 rounded-xl shadow-md max-w-4xl mx-auto">


            <h2 className="text-2xl font-bold text-center text-indigo-600 mb-4">
                Step {step + 1} of {steps.length}: {steps[step]}
            </h2>

            {step === 0 && (
                <div className="space-y-4">
                    <input
                        placeholder="Name"
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-300"
                        value={form.personal.name}
                        onChange={(e) =>
                            updateField("personal", { ...form.personal, name: e.target.value })
                        }
                    />
                    <input
                        placeholder="Email"
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-300"
                        value={form.personal.email}
                        onChange={(e) =>
                            updateField("personal", { ...form.personal, email: e.target.value })
                        }
                    />
                    <input
                        placeholder="Phone"
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-300"
                        value={form.personal.phone}
                        onChange={(e) =>
                            updateField("personal", { ...form.personal, phone: e.target.value })
                        }
                    />
                    <input
                        placeholder="Location"
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-300"
                        value={form.personal.location}
                        onChange={(e) =>
                            updateField("personal", { ...form.personal, location: e.target.value })
                        }
                    />
                    <textarea
                        placeholder="Summary"
                        className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-300"
                        rows={4}
                        value={form.personal.summary}
                        onChange={(e) =>
                            updateField("personal", { ...form.personal, summary: e.target.value })
                        }
                    />
                    {/* ✅ Added Link Inputs */}
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="text"
                            placeholder="Link Label (e.g. Portfolio)"
                            value={form.personal.link.label}
                            onChange={(e) =>
                                updateField("personal", {
                                    ...form.personal,
                                    link: { ...form.personal.link, label: e.target.value },
                                })
                            }
                            className="border p-2 rounded focus:ring-2 focus:ring-indigo-300"
                        />
                        <input
                            type="text"
                            placeholder="Link URL (e.g. https://yourportfolio.com)"
                            value={form.personal.link.url}
                            onChange={(e) =>
                                updateField("personal", {
                                    ...form.personal,
                                    link: { ...form.personal.link, url: e.target.value },
                                })
                            }
                            className="border p-2 rounded focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                </div>
            )}

            {step === 1 && (
                <>
                    {renderArraySection("education", "Education")}
                    {renderArraySection("skills", "Skills")}
                </>
            )}
            {step === 2 && (
                <>
                    {renderArraySection("experience", "Experience")}
                    {renderArraySection("projects", "Projects")}
                </>
            )}
            {step === 3 && (
                <>
                    {renderArraySection("certifications", "Certifications")}
                    {renderArraySection("languages", "Languages")}
                </>
            )}

            <div className="flex justify-between mt-6">
                {step > 0 && (
                    <button
                        onClick={() => setStep((s) => s - 1)}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                        ◀ Back
                    </button>
                )}
                {step < steps.length - 1 ? (
                    <button
                        onClick={() => setStep((s) => s + 1)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-auto"
                    >
                        Next ▶
                    </button>
                ) : (
                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-auto"
                    >
                        💾 Save
                    </button>
                )}
            </div>
        </div>
    );
}
