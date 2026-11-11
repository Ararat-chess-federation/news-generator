import type { NewsStatus } from "../../models/news";
import "./FacebookSave.css";

const STATUS_LABELS: Record<NewsStatus, string> = {
  new: "🆕 Նոր",
  draft: "📝 Սևագիր",
  published: "✅ Հրապարակված",
  unknown: "Կարգավիճակն անհայտ է",
};

export default function StatusBadge({ status }: { status: NewsStatus }) {
  return <span className={`status_badge status_badge--${status}`}>{STATUS_LABELS[status]}</span>;
}
