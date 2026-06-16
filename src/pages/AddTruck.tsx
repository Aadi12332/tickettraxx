import { ArrowLeft, Upload, ImageIcon, Plus, Minus } from "lucide-react";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

function TextInput({
  placeholder,
  value,
  title,
  onChange,
}: {
  placeholder: string;
  value: string;
  title: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="h-12">
<label className="text-sm text-[#6B7280]">
            {title}
          </label>
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 text-[15px] mt-1 rounded-lg border border-[#D1D5DB] outline-none bg-white"
        />
    </div>
  );
}

function ImageUploadBox({
  preview,
  onFileChange,
}: {
  preview: string | null;
  onFileChange: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file && file.type.startsWith("image/")) {
      onFileChange(file);
    }
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      onFileChange(file);
    }
  }

  return (
    <div className="grid grid-cols-4 gap-6 mt-8">
      <div className="col-span-3">
        <p className="text-[16px] font-medium text-[#111827] mb-3">
          Truck DOT Inspection Picture
        </p>
<div className="p-4 border-2 border-dashed rounded-lg bg-white  h-[320px]">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`h-full p-4 bg-[#F2F2F7] cursor-pointer ${
            dragging ? "border-[#1D3461]" : "border-[#A1A1AA]"
          }`}
        >
          <div
            className="h-full bg-[#F2F2F7] rounded-lg flex flex-col items-center justify-center"
            onClick={() => inputRef.current?.click()}
          >
            <ImageIcon
              size={60}
              strokeWidth={1}
              className="text-[#B0B0B0]"
            />

            <p className="mt-4 text-[#6B7280] text-lg">
              Drag the picture
            </p>

            <p className="text-[#6B7280] my-2">or</p>

            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2 bg-[#D4D4D4] rounded-md shadow"
            >
              <Upload size={15} />
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
      </div>

      <div>
        <p className="text-[16px] font-medium text-[#111827] mb-3">
          Preview Truck DOT Inspection
        </p>

        <div className="border border-[#D1D5DB] rounded-lg h-[320px] overflow-hidden bg-white flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-[#9CA3AF] text-sm">
              No image uploaded
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AddTruck() {
  const navigate = useNavigate();

  const [aliasCount, setAliasCount] = useState(1);

  const [unitNumber, setUnitNumber] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [modelBrand, setModelBrand] = useState("");
  const [year, setYear] = useState("");
  const [vinNumber, setVinNumber] = useState("");

  const [inspectionPreview, setInspectionPreview] =
    useState<string | null>(null);

  function handleInspectionUpload(file: File) {
    const url = URL.createObjectURL(file);
    setInspectionPreview(url);
  }

  function handleSubmit() {
    console.log({
      unitNumber,
      aliasCount,
      aliasName,
      modelBrand,
      year,
      vinNumber,
    });

    navigate(-1);
  }

  return (
    <div className="bg-[#F3F4F6] text-[#111827]">
      <div className="flex items-center sm:flex-row flex-col gap-5 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 text-white bg-[#1D3461] rounded-lg"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <h1 className="text-[20px] font-bold text-[#111827]">
            Add Truck
          </h1>

          <p className="text-[#707070] text-base">
            Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        <TextInput
          title="Unit Number"
          placeholder="Unit Number"
          value={unitNumber}
          onChange={setUnitNumber}
        />

        <div className="">
          <label className="text-sm text-[#6B7280]">
            Alias
          </label>

          <div className="flex h-12 items-center justify-between mt-1 bg-white border border-[#D1D5DB] rounded-lg px-4 py-3">
            <button
              onClick={() =>
                setAliasCount((prev) =>
                  prev > 1 ? prev - 1 : 1
                )
              }
            >
              <Minus size={16} />
            </button>

            <span className="text-sm">
              {aliasCount}
            </span>

            <button
              onClick={() =>
                setAliasCount((prev) => prev + 1)
              }
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <TextInput
          title="Unit Name"
          placeholder="Alias 1"
          value={aliasName}
          onChange={setAliasName}
        />
      </div>

      <h2 className="text-[#1D3461] text-[20px] font-bold mb-4">
        Truck details
      </h2>

      <div className="grid grid-cols-3 gap-5 mb-8 pb-8">
        <TextInput
          title="Model & Brand"
          placeholder="Model & Brand"
          value={modelBrand}
          onChange={setModelBrand}
        />

        <TextInput
          title="Year"
          placeholder="Year"
          value={year}
          onChange={setYear}
        />

        <TextInput
          title="Truck VIN Number"
          placeholder="Truck VIN Number"
          value={vinNumber}
          onChange={setVinNumber}
        />
      </div>

      <ImageUploadBox
        preview={inspectionPreview}
        onFileChange={handleInspectionUpload}
      />

      <div className="flex justify-end mt-12">
        <button
          onClick={handleSubmit}
          className="px-12 py-4 text-lg font-medium text-white bg-[#1D3461] rounded-lg hover:bg-[#16213a]"
        >
          Add Truck
        </button>
      </div>
    </div>
  );
}