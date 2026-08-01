import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Wrapper, MenuBtn, Menu, MenuItem, Divider } from "./component.styles";

/**
 * OptionsMenu — reusable three-dot dropdown menu.
 *
 * Props:
 *   items  — [{ icon, label, onClick, danger?, dividerBefore?, show?, disabled?, disabledReason? }]
 *   align  — "end" (default) | "start"  dropdown alignment
 */
export default function OptionsMenu({ items = [], align = "end" }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState(null);
  const btnRef          = useRef(null);
  const menuRef         = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  const toggle = () => {
    if (open) { close(); return; }
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      const visibleCount   = items.filter((item) => item.show !== false).length;
      const dividerCount   = items.filter((item) => item.show !== false && item.dividerBefore).length;
      const estimatedHeight = visibleCount * 38 + dividerCount * 5 + 8;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < estimatedHeight && rect.top > estimatedHeight;

      const vertical = openUpward
        ? { bottom: window.innerHeight - rect.top + 6 }
        : { top: rect.bottom + 6 };

      setPos({
        ...vertical,
        ...(align === "start"
          ? { left: rect.left }
          : { right: window.innerWidth - rect.right }),
      });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        btnRef.current  && !btnRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) close();
    };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    const onScrollOrResize = () => close();
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, close]);

  const visible = items.filter((item) => item.show !== false);
  if (visible.length === 0) return null;

  return (
    <Wrapper onClick={(e) => e.stopPropagation()}>
      <MenuBtn ref={btnRef} type="button" onClick={toggle}>
        <i className="bi bi-three-dots-vertical" />
      </MenuBtn>

      {open && pos && createPortal(
        <Menu ref={menuRef} style={{ position: "fixed", top: pos.top, bottom: pos.bottom, left: pos.left, right: pos.right }}>
          {visible.map((item, i) => (
            <div key={i}>
              {item.dividerBefore && <Divider />}
              <MenuItem
                $danger={item.danger}
                $disabled={item.disabled}
                disabled={item.disabled}
                title={item.disabled ? item.disabledReason : undefined}
                onClick={() => { if (item.disabled) return; item.onClick?.(); close(); }}
              >
                {item.icon && <i className={`bi ${item.icon}`} />}
                {item.label}
              </MenuItem>
            </div>
          ))}
        </Menu>,
        document.body
      )}
    </Wrapper>
  );
}
