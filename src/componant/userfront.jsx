
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const symptoms = [
  "Fever",
  "Fatigue",
  "Headache",
  "Shortness of breath",
  "Chest pain",
  "Nausea",
  "Cough",
  "Skin rash",
  "Itching",
  "Vomiting",
  "Sore throat",
  "Runny nose",
  "Body pain",
  "Blurred vision",
  "Excessive thirst",
  "Frequent urination",
];

const stats = [
  { label: "Prediction source", value: "One CSV file" },
  { label: "Medicine information", value: "Same dataset" },
  { label: "Symptom selection", value: "Multiple" },
];

const steps = [
  "Enter patient details and select symptoms.",
  "The backend compares the symptoms with disease_medicines_dataset.csv.",
  "View the matching disease and any medicine information available in the CSV.",
];

function Userfront() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    symptoms: [],
  });

  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
   const [symptoms, setSymptoms] = useState([]);
const [symptomLoading, setSymptomLoading] = useState(true);

useEffect(() => {
  axios
    .get(`${API_URL}/api/symptoms`)
    .then((response) => {
      setSymptoms(response.data.symptoms || []);
    })
    .catch((error) => {
      console.error("Failed to load symptoms:", error);
      setErrorMessage("Could not load symptoms from the backend.");
    })
    .finally(() => {
      setSymptomLoading(false);
    });
}, []);
  // Handle patient name and age.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Select or deselect symptoms.
  const handleSymptomChange = (symptom) => {
    setFormData((prev) => {
      const alreadySelected = prev.symptoms.includes(symptom);

      return {
        ...prev,
        symptoms: alreadySelected
          ? prev.symptoms.filter((item) => item !== symptom)
          : [...prev.symptoms, symptom],
      };
    });
  };

  // Send symptoms to the FastAPI backend.
  const handleSubmit = async (e) => {
    e.preventDefault();

    setResult(null);
    setErrorMessage("");

    if (formData.symptoms.length === 0) {
      setErrorMessage("Please select at least one symptom.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/predict`,
        {
          symptoms: formData.symptoms,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      setResult({
        ...response.data,
        patient: formData.name.trim() || "Not provided",
        age: formData.age || "Not provided",
      });
    } catch (error) {
      console.error("Prediction error:", error);

      const detail = error.response?.data?.detail;

      setErrorMessage(
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail.map((item) => item.msg).join(", ")
            : error.response
              ? "The backend returned an error. Check the API response and CSV columns."
              : "Cannot connect to FastAPI. Start the backend at http://127.0.0.1:8000."
      );
    } finally {
      setLoading(false);
    }
  };

  // Backend field: medicine_information
  const medicineInformation = result?.medicine_information;

  // Backend field: medicine_information.records
  const medicineRecords = Array.isArray(
    medicineInformation?.records
  )
    ? medicineInformation.records
    : [];

  // Backend field: possible_diseases
  const possibleDiseases = Array.isArray(
    result?.possible_diseases
  )
    ? result.possible_diseases
    : [];

  // Backend field: matched_symptoms
  const matchedSymptoms = Array.isArray(
    result?.matched_symptoms
  )
    ? result.matched_symptoms
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navigation */}
      <header className="mx-auto max-w-7xl px-6 py-6">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-xl font-black text-slate-950">
              +
            </div>

            <span className="text-lg font-bold">
              MediPredict
            </span>
          </a>

          <div className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
            <a
              href="#features"
              className="hover:text-emerald-300"
            >
              Features
            </a>

            <a
              href="#prediction"
              className="hover:text-emerald-300"
            >
              Prediction
            </a>

            <a
              href="#how-it-works"
              className="hover:text-emerald-300"
            >
              How it works
            </a>
          </div>

          <a
            href="#prediction"
            className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-300"
          >
            Get started
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-20">
        {/* Hero section */}
        <section className="grid items-center gap-12 py-12 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
              Symptom-based health information
            </span>

            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight text-white md:text-6xl">
              Explore possible diseases from your symptoms.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Select your symptoms to compare them with
              disease_medicines_dataset.csv and retrieve any
              related medicine information available in the
              same dataset.
            </p>

            <a
              href="#prediction"
              className="mt-8 inline-block rounded-full bg-emerald-400 px-7 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              Start prediction
            </a>

            <div className="mt-8 flex flex-wrap gap-2">
              {symptoms.slice(0, 6).map((symptom) => (
                <span
                  key={symptom}
                  className="rounded-full border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          {/* Prediction form */}
          <div
            id="prediction"
            className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl md:p-7"
          >
            <div className="rounded-2xl border border-emerald-400/20 bg-slate-900 p-5 md:p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
                Patient dashboard
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Check symptoms
              </h2>

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
              >
                {/* Patient name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm text-slate-300"
                  >
                    Patient name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter patient name"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Patient age */}
                <div>
                  <label
                    htmlFor="age"
                    className="mb-2 block text-sm text-slate-300"
                  >
                    Age
                  </label>

                  <input
                    id="age"
                    type="number"
                    name="age"
                    min="0"
                    max="130"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Symptom selection */}
                <fieldset>
                  <legend className="mb-3 text-sm font-semibold text-slate-200">
                    Select all symptoms that apply
                  </legend>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {symptoms.map((symptom) => (
                      <label
                        key={symptom}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                          formData.symptoms.includes(symptom)
                            ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
                            : "border-white/10 bg-slate-950 text-slate-300 hover:border-white/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.symptoms.includes(
                            symptom
                          )}
                          onChange={() =>
                            handleSymptomChange(symptom)
                          }
                          className="h-4 w-4 accent-emerald-400"
                        />

                        {symptom}
                      </label>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Selected: {formData.symptoms.length} symptom(s)
                  </p>
                </fieldset>

                {/* Error message */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300"
                  >
                    {errorMessage}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Analyzing symptoms..."
                    : "Predict possible disease"}
                </button>
              </form>

              {/* Prediction results */}
              {result && (
                <div
                  aria-live="polite"
                  className="mt-6 space-y-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/5 p-4"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                      Prediction results
                    </p>

                    <h3 className="mt-2 break-words text-xl font-bold text-white">
                      {result.disease || "No unique disease identified"}
                    </h3>
                  </div>

                  {/* Patient details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-950 p-3">
                      <p className="text-xs text-slate-400">
                        Patient
                      </p>

                      <p className="mt-1 break-words font-semibold">
                        {result.patient}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-950 p-3">
                      <p className="text-xs text-slate-400">
                        Age
                      </p>

                      <p className="mt-1 font-semibold">
                        {result.age}
                      </p>
                    </div>
                  </div>

                  {/* Matching score from Python backend */}
                  {result.matching_score !== undefined && (
                    <div className="rounded-xl bg-slate-950 p-3">
                      <p className="text-sm text-slate-400">
                        Symptom matching score
                      </p>

                      <p className="mt-1 text-2xl font-bold text-emerald-300">
                        {result.matching_score}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        This is a dataset matching score, not a
                        percentage or a clinically validated
                        probability.
                      </p>
                    </div>
                  )}

                  {/* Backend message */}
                  {result.message && (
                    <p className="text-sm leading-6 text-slate-300">
                      {result.message}
                    </p>
                  )}

                  {/* Matched symptoms */}
                  {matchedSymptoms.length > 0 && (
                    <div>
                      <h4 className="mb-2 font-semibold text-white">
                        Matched symptoms
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {matchedSymptoms.map((symptom, index) => (
                          <span
                            key={`${symptom}-${index}`}
                            className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Possible diseases */}
                  {possibleDiseases.length > 0 && (
                    <div>
                      <h4 className="mb-2 font-semibold text-white">
                        Possible matching diseases
                      </h4>

                      <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
                        {possibleDiseases.map((disease, index) => (
                          <li key={`${disease}-${index}`}>
                            {typeof disease === "string"
                              ? disease
                              : disease.disease ||
                                JSON.stringify(disease)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Medicine information from the same CSV */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-lg font-bold text-white">
                      Related medicine information
                    </h4>

                    <p className="mb-3 mt-1 text-sm text-slate-400">
                      Information returned from
                      disease_medicines_dataset.csv.
                    </p>

                    {medicineInformation?.available &&
                    medicineRecords.length > 0 ? (
                      <div className="space-y-3">
                        {medicineRecords.map((record, index) => (
                          <div
                            key={`medicine-${index}`}
                            className="rounded-xl border border-white/10 bg-slate-950 p-4"
                          >
                            {Object.entries(record).map(
                              ([key, value]) => (
                                <p
                                  key={key}
                                  className="break-words py-1 text-sm text-slate-300"
                                >
                                  <span className="font-semibold capitalize text-emerald-300">
                                    {key.replaceAll("_", " ")}:
                                  </span>{" "}

                                  {value === null ||
                                  value === undefined ||
                                  value === ""
                                    ? "Not available"
                                    : typeof value === "object"
                                      ? JSON.stringify(value)
                                      : String(value)}
                                </p>
                              )
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-xl bg-slate-950 p-4 text-sm text-slate-400">
                        {medicineInformation?.message ||
                          "No medicine information was returned. The CSV may not contain medicine-related columns for this disease."}
                      </p>
                    )}

                    {medicineInformation?.safety_notice && (
                      <p className="mt-3 text-xs leading-5 text-amber-200">
                        {medicineInformation.safety_notice}
                      </p>
                    )}
                  </div>

                  {/* Medical safety notice */}
                  <p className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-3 text-xs leading-5 text-amber-200">
                    Educational information only. This result is
                    not a medical diagnosis or prescription. Do not
                    start, stop, or change medication based on this
                    result. Consult a qualified healthcare
                    professional.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mt-10 grid gap-5 md:grid-cols-3"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-slate-900 p-6"
            >
              <p className="text-2xl font-black text-white">
                {stat.value}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mt-20 grid gap-8 lg:grid-cols-2"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              How it works
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white">
              From symptoms to related information
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              The application sends selected symptoms to the FastAPI
              backend. The backend compares them with records
              imported from disease_medicines_dataset.csv and returns
              matching results.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900 p-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400 font-bold text-slate-950">
                  {index + 1}
                </div>

                <p className="pt-2 text-slate-300">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-500">
        MediPredict · Educational health information only
      </footer>
    </div>
  );
}
export default Userfront;