import { Chess3DGame } from "./Chess3D/Chess3DGame";

export function ChessGame({ onFinish }: { onFinish: (result: 'win' | 'loss' | 'draw') => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black">
      <div className="w-full h-full relative">
        <Chess3DGame onFinish={onFinish} />
      </div>
    </div>
  );
}
