import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
}

export const PlaceholderPage = ({ title }: PlaceholderPageProps) => (
  <div className="flex flex-col items-center justify-center h-96 gap-4">
    <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center">
      <Construction size={28} className="text-[#1E3A5F]" />
    </div>
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    <p className="text-gray-500 text-sm">This section is under development</p>
  </div>
);
