"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  description: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

type PermissionKey =
  | "uploadTickets"
  | "uploadMultipleTickets"
  | "uploadOnBehalf"
  | "rate"
  | "grossAmount"
  | "fsc"
  | "deduction"
  | "bonus"
  | "enableAppLogin";

interface PermissionState {
  enabled: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;
}

const PERMISSIONS: { key: PermissionKey; label: string }[] = [
  { key: "uploadTickets", label: "Upload Tickets" },
  { key: "uploadMultipleTickets", label: "Upload Multiple Tickets" },
  { key: "uploadOnBehalf", label: "Upload on behalf of others" },
  { key: "rate", label: "Rate" },
  { key: "grossAmount", label: "Gross Amount" },
  { key: "fsc", label: "FSC" },
  { key: "deduction", label: "Deduction" },
  { key: "bonus", label: "Bonus" },
  { key: "enableAppLogin", label: "Enable App Login" },
];

function defaultPermissions(enabled = false): Record<PermissionKey, PermissionState> {
  return Object.fromEntries(
    PERMISSIONS.map(({ key }) => [
      key,
      { enabled, view: false, edit: false, delete: false },
    ]),
  ) as Record<PermissionKey, PermissionState>;
}

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#111827]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 text-sm rounded-md border outline-none transition-all
          placeholder-[#9CA3AF] text-[#111827]
          ${error ? "border-red-400 bg-red-50" : "border-[#E5E7EB] bg-white"}`}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? "bg-[#2BB7DC]" : "bg-[#E5E7EB]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

type ActionType = "view" | "edit" | "delete";

function PermissionCard({
  label,
  state,
  onToggle,
  onToggleAction,
  isEdit,
}: {
  label: string;
  state: PermissionState;
  onToggle: () => void;
  onToggleAction: (action: "view" | "edit" | "delete") => void;
  isEdit: boolean;
}) {
  const [selectedActions, setSelectedActions] = useState<ActionType[]>([
    "view",
    "edit",
    "delete",
  ]);

  const handleActionClick = (action: ActionType) => {
    setSelectedActions((prev) =>
      prev.includes(action)
        ? prev.filter((item) => item !== action)
        : [...prev, action],
    );

    onToggleAction(action);
  };

  return (
    <div className="border border-[#E5E7EB] rounded-lg p-3 flex flex-col gap-2.5 bg-white">
      <p className="text-[13px] font-medium text-[#374151]">{label}</p>
      <div className="flex items-center gap-2 flex-wrap min-h-10">
        <Toggle enabled={state.enabled} onChange={onToggle} />
        {isEdit && state.enabled && (
          <>
            {(["view", "edit", "delete"] as ActionType[]).map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => handleActionClick(action)}
                className={`px-3 py-2 text-xs font-semibold rounded-md border transition-colors ${
                  selectedActions.includes(action)
                    ? "bg-[#22C55E] text-white border-[#22C55E]"
                    : "bg-white text-[#6B7280] border-[#D1D5DB]"
                }`}
              >
                {action.charAt(0).toUpperCase() + action.slice(1)}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

interface CreateNewRoleProps {
  mode?: "create" | "edit";
}

export default function CreateNewRole({ mode = "create" }: CreateNewRoleProps) {
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [permissions, setPermissions] =
    useState<Record<PermissionKey, PermissionState>>(defaultPermissions(isEdit));

  function setField(key: keyof FormState) {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };
  }

  function togglePermission(key: PermissionKey) {
    setPermissions((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  }

  function toggleAction(
    key: PermissionKey,
    action: "view" | "edit" | "delete",
  ) {
    setPermissions((prev) => ({
      ...prev,
      [key]: { ...prev[key], [action]: !prev[key][action] },
    }));
  }

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.email.trim()) errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters.";
    if (!form.confirmPassword)
      errs.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (validate()) navigate("/dashboard/permissions");
  }

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="bg-[#F3F4F6]">
      <div className="flex items-start md:flex-row flex-col gap-5 mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#1D3461] rounded-lg hover:bg-[#16213a] transition-colors whitespace-nowrap"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div>
          <h1 className="text-[20px] font-bold text-[#111827]">
            {isEdit ? "Edit New Role" : "Create A New Role"}
          </h1>
          <p className="text-base text-[#6B7280] mt-0.5">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>
      </div>

      <h2 className="text-[20px] font-medium text-[#1F2020] mb-2">
        {isEdit ? "Edit Role" : "Create A New Role"}
      </h2>
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Field
            label="Name"
            placeholder="Enter full name"
            value={form.name}
            onChange={setField("name")}
            error={errors.name}
          />
          <Field
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={setField("email")}
            error={errors.email}
          />
          <Field
            label="Password"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={setField("password")}
            error={errors.password}
          />
          <Field
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={setField("confirmPassword")}
            error={errors.confirmPassword}
          />
        </div>
      </div>

      {mode === "edit" && (
        <>
          <h2 className="text-[20px] font-medium text-[#1F2020] mb-2">
            Role Details
          </h2>
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#111827]">
                Description
              </label>
              <textarea
                placeholder="Briefly describe the responsibilities and scope of this role."
                value={form.description}
                onChange={(e) => setField("description")(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 text-sm rounded-md border border-[#E5E7EB] bg-white outline-none
              placeholder-[#9CA3AF] text-[#111827] resize-none"
              />
            </div>
          </div>

          <h2 className="text-[20px] font-medium text-[#1F2020] mb-2">
            Permission Assignments
          </h2>
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-5 mb-6">
            <p className="text-sm font-semibold text-[#111827] mb-4">
              Permission Assignments
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PERMISSIONS.map(({ key, label }) => (
                <PermissionCard
                  key={key}
                  label={label}
                  state={permissions[key]}
                  onToggle={() => togglePermission(key)}
                  onToggleAction={(action) => toggleAction(key, action)}
                  isEdit={isEdit}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          onClick={handleSave}
          className="px-8 py-2.5 text-sm font-semibold text-white bg-[#1D3461] rounded-lg hover:bg-[#16213a] transition-colors"
        >
          {isEdit ? "Save" : "Create"}
        </button>
        <button
          onClick={handleCancel}
          className="px-8 py-2.5 text-sm font-semibold text-white bg-[#E70D0D] rounded-lg hover:bg-[#c50b0b] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
