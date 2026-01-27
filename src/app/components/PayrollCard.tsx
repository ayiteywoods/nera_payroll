import { FiMoreVertical } from "react-icons/fi";

type PayrollCardProps = {
  period?: string;
  title: string;
  amount: number | string;
  subtitle?: string;
  footer?: string;
};

const PayrollCard = ({
  period = "Current Period",
  title,
  amount,
  subtitle,
  footer,
}: PayrollCardProps) => {
  return (
    <div
      className="
        relative rounded-2xl p-5 flex flex-col justify-between
        bg-[#153361]   odd:bg-[#153361] even:bg-[#7d8fb0] text-white shadow-lg min-w-[220px] overflow-hidden
      "
    >
      {/* ===== White Gradient Overlay ===== */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-white/10 to-transparent rounded-2xl pointer-events-none"></div>

      {/* ===== Header ===== */}
      <div className="flex justify-between items-center relative z-10">
        <span className="text-[11px] bg-white/90 text-[#153361] px-3 py-1 rounded-full font-medium">
          {period}
        </span>

        <button
          className="p-1 rounded-full hover:bg-white/10 transition"
          aria-label="More options"
        >
          <FiMoreVertical size={18} />
        </button>
      </div>

      {/* ===== Main ===== */}
      <div className="my-6 relative z-10">
        <p className="text-sm text-white/70">{title}</p>
        <h1 className="text-3xl font-bold tracking-wide mt-1">{amount}</h1>

        {subtitle && (
          <p className="text-xs text-white/60 mt-1">{subtitle}</p>
        )}
      </div>

      {/* ===== Footer ===== */}
      {footer && (
        <div className="text-xs text-white/60 border-t border-white/20 pt-3 relative z-10">
          {footer}
        </div>
      )}
    </div>
  );
};

export default PayrollCard;
