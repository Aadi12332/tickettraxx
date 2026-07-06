"use client";

import { ArrowLeft, Upload, ImageIcon, Check, X } from "lucide-react";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

interface FormState {
  name: string;
  state: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  appAccess: string;
  password: string;
  assignTruck: string;
  paymentType: string;
  rate: string;
  bank: string;
  accountNumber: string;
  routingNumber: string;
  paymentMethod: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  accountNumber?: string;
  routingNumber?: string;
}

const STATE_OPTIONS = [
  "Texas",
  "California",
  "Florida",
  "New York",
  "Illinois",
];
const CITY_OPTIONS = ["Houston", "Dallas", "Austin", "San Antonio", "El Paso"];
const ACCESS_OPTIONS = ["Enable", "Disable"];
const TRUCK_OPTIONS = ["TX4578", "TX5682", "TX6820", "TX5973", "TX6891"];
const PAYMENT_TYPES = ["Per Trip", "Per Ton", "Per Mile"];
const RATE_OPTIONS = [
  "$80/trip",
  "$90/trip",
  "$100/trip",
  "$110trip",
  "Enter Manually",
];
const BANK_OPTIONS = [
  "Bank of America",
  "Wells Fargo",
  "Citi Bank",
  "U.S. Bank",
  "Bank of New York",
];
const PAYMENT_METHODS = ["Bank Transfer", "Cheque", "Pay Pal"];

function TextInput({
  placeholder,
  type = "text",
  value,
  onChange,
  error,
}: {
  label?: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="relative flex flex-col rounded-md border px-3 py-2">
      {/* <label className="text-[12px] text-[#6B7280] z-10">{label}</label> */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full text-[16px] outline-none transition-all h-full
          placeholder-[#111827] text-[#111827] bg-white
          ${error ? "border-red-400 bg-red-50" : "border-[#D1D5DB]"}`}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
}) {
  return (
    <div className="relative flex flex-col rounded-md border p-3">
      <label className="text-[12px] text-[#6B7280] z-10">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full text-[16px] outline-none appearance-none bg-white cursor-pointer
          ${value ? "text-[#111827]" : "text-[#9CA3AF]"}
          ${error ? "border-red-400" : "border-[#D1D5DB]"}`}
      >
        <option value="" disabled>
          Select one
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-[35px] text-[#9CA3AF]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function ImageUploadBox({
  label,
  previewLabel,
  preview,
  onFileChange,
}: {
  label: string;
  previewLabel: string;
  preview: string | null;
  onFileChange: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onFileChange(file);
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileChange(file);
  }

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-6 items-start">
      <div className="md:col-span-2">
        <p className="text-[13px] font-semibold text-[#111827] mb-3">{label}</p>
        <div
          className={`border-2 border-dashed h-[250px] p-3 rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer
            ${dragging ? "border-[#1D3461]" : "border-[#838383]"}`}
        >
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`h-full w-full rounded-lg flex flex-col items-center justify-center py-10 px-4 transition-colors cursor-pointer
            ${dragging ? "bg-blue-50" : "bg-[#F2F2F7]"}`}
            onClick={() => inputRef.current?.click()}
          >
            <div className="w-12 h-12 flex items-center justify-center text-[#9CA3AF] mb-3">
              <ImageIcon size={40} strokeWidth={1} />
            </div>
            <p className="text-[13px] text-[#6B7280]">Drag the picture</p>
            <p className="text-[13px] text-[#6B7280] mb-4">or</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="flex items-center gap-2 px-4 py-2 text-[12px] text-[#374151] bg-[#D4D4D4] shadow-xl border border-[#D1D5DB] rounded-md hover:bg-gray-50 transition-colors"
            >
              <Upload size={13} />
              Upload Image
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <p className="text-[13px] font-semibold text-[#111827] mb-3">
          {previewLabel}
        </p>
        <div className="border w-full border-[#E5E7EB] rounded-lg overflow-hidden min-h-[250px] bg-[#F2F2F7] flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt={previewLabel}
              className="w-full h-full object-contain max-h-[200px]"
            />
          ) : (
            <p className="text-[12px] text-[#9CA3AF]">No image uploaded</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-[15px] font-bold text-[#111827] px-1 mb-3">
        {title}
      </h2>
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
        {children}
      </div>
    </div>
  );
}

export default function AddDriver() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    state: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    appAccess: "",
    password: "",
    assignTruck: "",
    paymentType: "",
    rate: "",
    bank: "",
    accountNumber: "",
    routingNumber: "",
    paymentMethod: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [cdlPreview, setCdlPreview] = useState<string | null>(null);
  const [medicalPreview, setMedicalPreview] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

  function setField(key: keyof FormState) {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };
  }

  function handleImageFile(type: "cdl" | "medical") {
    return (file: File) => {
      const url = URL.createObjectURL(file);
      if (type === "cdl") setCdlPreview(url);
      else setMedicalPreview(url);
    };
  }

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email.";
    if (!form.phone.trim()) errs.phone = "Phone is required.";
    if (!form.password) errs.password = "Password is required.";
    if (!form.accountNumber.trim())
      errs.accountNumber = "Account number is required.";
    if (!form.routingNumber.trim())
      errs.routingNumber = "Routing number is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (validate()) {
      setShowSuccessModal(true);
    }
  }

  return (
    <div className="bg-[#F3F4F6]">
      <div className="flex items-center flex-wrap gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#1D3461] rounded-lg hover:bg-[#16213a] transition-colors whitespace-nowrap"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div>
          <h1 className="text-[20px] font-bold text-[#111827]">Add Driver</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Enter Driver details for management and payroll
          </p>
        </div>
      </div>

      <SectionCard title="Basic Information">
        <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mb-4">
          <TextInput
            label="Name"
            placeholder="Name"
            value={form.name}
            onChange={setField("name")}
            error={errors.name}
          />
          <SelectInput
            label="State"
            value={form.state}
            onChange={setField("state")}
            options={STATE_OPTIONS}
          />
          <SelectInput
            label="City"
            value={form.city}
            onChange={setField("city")}
            options={CITY_OPTIONS}
          />
          <TextInput
            label="Address"
            placeholder="Address"
            value={form.address}
            onChange={setField("address")}
          />
        </div>
        <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
          <TextInput
            label="Phone Number"
            placeholder="Phone"
            value={form.phone}
            onChange={setField("phone")}
            error={errors.phone}
          />
          <TextInput
            label="Email Address"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={setField("email")}
            error={errors.email}
          />
          <SelectInput
            label="App Access"
            value={form.appAccess}
            onChange={setField("appAccess")}
            options={ACCESS_OPTIONS}
          />
          <TextInput
            label="Password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={setField("password")}
            error={errors.password}
          />
        </div>
      </SectionCard>

      <SectionCard title="Work & Payment Details">
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          <SelectInput
            label="Assign Truck"
            value={form.assignTruck}
            onChange={setField("assignTruck")}
            options={TRUCK_OPTIONS}
          />
          <SelectInput
            label="Payment Type"
            value={form.paymentType}
            onChange={setField("paymentType")}
            options={PAYMENT_TYPES}
          />
          <SelectInput
            label="Rate"
            value={form.rate}
            onChange={setField("rate")}
            options={RATE_OPTIONS}
          />
        </div>
      </SectionCard>

      <SectionCard title="Bank Information">
        <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
          <SelectInput
            label="Bank"
            value={form.bank}
            onChange={setField("bank")}
            options={BANK_OPTIONS}
          />
          <TextInput
            label="Account Number"
            placeholder="Account Number"
            value={form.accountNumber}
            onChange={setField("accountNumber")}
            error={errors.accountNumber}
          />
          <TextInput
            label="Routing Number"
            placeholder="Routing Number"
            value={form.routingNumber}
            onChange={setField("routingNumber")}
            error={errors.routingNumber}
          />
          <SelectInput
            label="Payment Method"
            value={form.paymentMethod}
            onChange={setField("paymentMethod")}
            options={PAYMENT_METHODS}
          />
        </div>
      </SectionCard>

      <SectionCard title="Documents">
        <div className="flex flex-col gap-8">
          <ImageUploadBox
            label="CDL Picture"
            previewLabel="Preview CDL"
            preview={cdlPreview}
            onFileChange={handleImageFile("cdl")}
          />
          <ImageUploadBox
            label="Medical Card Picture"
            previewLabel="Preview Medical Card"
            preview={medicalPreview}
            onFileChange={handleImageFile("medical")}
          />
        </div>
      </SectionCard>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          className="px-10 py-3 text-sm font-semibold text-white bg-[#1D3461] rounded-lg hover:bg-[#16213a] transition-colors"
        >
          Add Driver
        </button>
      </div>

        {showSuccessModal && (
                  <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
                    <div className="w-[520px] bg-white rounded-lg border border-[#D9D9D9] z-50 px-8 py-14 flex items-center justify-center flex-col relative">
                      <X
                        size={20}
                        className="text-[#000] cursor-pointer absolute top-4 right-4"
                        onClick={() => {setShowSuccessModal(false); navigate(-1);}}
                      />
                      <div className="w-[60px] h-[60px] rounded-full bg-[#1F8A46] flex items-center justify-center">
                        <Check size={50} className="text-white stroke-[4]" />
                      </div>
          
                      <h2 className="mt-10 text-[16px] text-center leading-none font-normal text-[#000]">
                        A New Drier Has Been Added
                      </h2>
                    </div>
                  </div>
                )}
    </div>
  );
}
