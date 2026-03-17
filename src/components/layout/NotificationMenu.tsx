import { BellIcon } from "lucide-react";

export interface NotificationMenuItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

export interface NotificationMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  items: NotificationMenuItem[];
}

export function NotificationMenu({
  isOpen,
  onToggle,
  onClose,
  items,
}: NotificationMenuProps) {
  const unreadCount = items.filter((i) => i.unread).length;

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="relative inline-flex h-[50px] w-[50px] items-center justify-center rounded-[8px] border border-transparent text-[#64748b] transition-all duration-150 hover:border-[#e5e7eb] hover:bg-white hover:text-[#334155] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bbf7d0]"
      >
        {unreadCount > 0 ? (
          <span className="absolute right-[11px] top-[10px] h-2 w-2 rounded-full bg-[#ef4444]" />
        ) : null}
        <BellIcon className="h-5 w-5" />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-[56px] z-50 w-[360px] overflow-hidden rounded-[8px] border border-[#e5e7eb] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
        >
          <div className="flex items-center justify-between border-b border-[#eef2f7] px-5 py-3">
            <div>
              <p className="text-md font-semibold text-[#0f172a]">
                Notifications
              </p>
              <p className="text-sm text-[#64748b]">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You’re all caught up"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[6px] px-2 py-1 text-sm font-semibold text-[#64748b] transition-colors hover:bg-[#f8fafc] hover:text-[#0f172a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bbf7d0]"
            >
              Close
            </button>
          </div>

          <div className="max-h-[320px] overflow-y-auto p-1">
            {items.length > 0 ? (
              <div className="divide-y divide-[#eef2f7]">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f8fafc] focus:outline-none"
                  >
                    <span
                      className={[
                        "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                        item.unread ? "bg-emerald-500" : "bg-slate-200",
                      ].join(" ")}
                    />
                    <div className="min-w-0">
                      <p className="text-md font-semibold text-[#0f172a]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-sm text-[#475569]">
                        {item.description}
                      </p>
                      <p className="mt-1 text-sm text-[#94a3b8]">{item.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-sm text-[#64748b]">
                No notifications.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
