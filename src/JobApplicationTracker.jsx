import React, { useState, useEffect } from "react";

export default function JobApplicationTracker() {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem("jobs");
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState({
    company: "",
    title: "",
    status: "Applied",
    date: "",
    notes: "",
  });
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addJob = () => {
    if (!form.company || !form.title) return;
    setJobs([...jobs, { ...form, id: Date.now() }]);
    setForm({ company: "", title: "", status: "Applied", date: "", notes: "" });
  };

  const deleteJob = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setJobs(jobs.filter((job) => job.id !== id));
      setSelectedJob(null);
    }
  };

  const exportJSON = () => {
    const data = JSON.stringify(jobs, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jobs.json";
    link.click();
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedJobs = JSON.parse(event.target.result);
        setJobs(importedJobs);
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const statusColors = {
    Applied: "bg-blue-100 text-blue-800",
    Interviewing: "bg-yellow-100 text-yellow-800",
    Offer: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Job Application Tracker</h1>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={exportJSON}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Export JSON
            </button>
            <label className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer">
              Import JSON
              <input type="file" accept=".json" onChange={importJSON} className="hidden" />
            </label>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Job</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Job Title"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(statusColors).map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
            />
          </div>
          <button
            onClick={addJob}
            className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            Add Job
          </button>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Saved Applications</h2>
          {jobs.length === 0 ? (
            <p className="text-gray-500">No job applications yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[job.status]}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Applied: {job.date || "N/A"}
                  </p>
                  {job.notes && (
                    <p className="text-gray-700 mt-2 text-sm">{job.notes}</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedJob && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedJob.title}</h2>
              <p className="text-gray-600 mb-1">{selectedJob.company}</p>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[selectedJob.status]}`}
              >
                {selectedJob.status}
              </span>
              <p className="text-gray-500 mt-2">Applied: {selectedJob.date || "N/A"}</p>
              {selectedJob.notes && (
                <p className="text-gray-700 mt-3">{selectedJob.notes}</p>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    deleteJob(selectedJob.id);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
