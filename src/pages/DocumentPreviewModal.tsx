import { X } from "lucide-react";

interface DocumentPreviewModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
}

const DocumentPreviewModal = ({
  open,
  onClose,
  imageUrl,
}: DocumentPreviewModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg w-full max-w-[700px] max-h-[95vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10"
        >
          <X size={20} className="text-black" />
        </button>

        <div className="p-10 flex justify-center">
          <img
            src={imageUrl}
            alt="Document Preview"
            className="max-w-[550px] w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;