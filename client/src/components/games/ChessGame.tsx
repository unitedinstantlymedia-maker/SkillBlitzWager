import { useLanguage } from "@/context/LanguageContext";
import { Chess3DBoard } from "./Chess3DBoard";

export function ChessGame({ onFinish }: { onFinish: (result: 'win' | 'loss') => void }) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black">
      <div className="w-full h-full relative">
        <Chess3DBoard />
      </div>
    </div>
  );
}
