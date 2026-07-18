import { STATUS_COLORS, STATUS_LABELS } from "../lib/data";

export default function StatusChip({ status }: { status: string | null }) {
  if (!status) return null;
  return (
    <span className="chip" style={{ background: STATUS_COLORS[status] ?? "#868e96" }}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
