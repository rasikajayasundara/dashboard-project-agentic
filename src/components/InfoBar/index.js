import {
  InfoBarWrapper, InfoChip, InfoBarEnd, InfoBarBtn,
  ProfileHeader, ProfileAvatar, ProfileMain, ProfileNameRow,
  ProfileName, ProfileStatusBadge, ProfileSubtitle, ProfileDetails,
  ProfileDetailItem, ProfileRight, ProfileRightItem, ProfileActions,
} from "./component.styles";
import OptionsMenu from "../OptionsMenu";

/**
 * InfoBar — compact chip-badge row used on project / client detail pages.
 *
 * Props:
 *   items      — [{ icon, label, href? }]  chips rendered left to right
 *   files      — [{ documentName, url }]   renders a Files dropdown button
 *   menuItems  — [{ icon, label, onClick, danger?, dividerBefore?, show? }]
 *                renders a three-dot options menu
 *   endSlot    — ReactNode for arbitrary extra content on the right
 */
export default function InfoBar({ items = [], files, menuItems, endSlot }) {
  const visibleMenu = menuItems?.filter((m) => m.show !== false) ?? [];

  return (
    <InfoBarWrapper>
      {items.filter((item) => item.label).map((item, i) => (
        <InfoChip
          key={i}
          as={item.href ? "a" : "span"}
          href={item.href}
          target={item.href ? "_blank" : undefined}
          rel={item.href ? "noreferrer" : undefined}
        >
          {item.icon && <i className={`bi ${item.icon}`} />}
          {item.label}
        </InfoChip>
      ))}

      {(files !== undefined || visibleMenu.length > 0 || endSlot) && (
        <InfoBarEnd>
          {endSlot}

          {/* Files dropdown */}
          {files !== undefined && (
            <div className="dropdown">
              <InfoBarBtn className="dropdown-toggle" data-bs-toggle="dropdown">
                <i className="bi bi-paperclip" /> Files
              </InfoBarBtn>
              <ul className="dropdown-menu dropdown-menu-end">
                {files?.length > 0
                  ? files.map((file, i) => (
                      <li key={i}>
                        <a className="dropdown-item" href={file.url} target="_blank" rel="noreferrer">
                          <i className="bi bi-file-earmark pe-2 text-muted" />{file.documentName}
                        </a>
                      </li>
                    ))
                  : <li><span className="dropdown-item text-muted">No attachments</span></li>
                }
              </ul>
            </div>
          )}

          {/* Options three-dot menu */}
          {visibleMenu.length > 0 && (
            <OptionsMenu items={menuItems} />
          )}
        </InfoBarEnd>
      )}
    </InfoBarWrapper>
  );
}

/**
 * ProfileInfoBar — richer header card for employee / staff detail pages.
 *
 * Props:
 *   avatarSrc   — image URL (optional; falls back to initials)
 *   initials    — fallback text when no avatar image
 *   name        — full name
 *   isActive    — boolean, drives the status badge
 *   subtitle    — role / position line
 *   leftItems   — [{ icon, label, href? }]  shown below subtitle (email, phone)
 *   rightItems  — [{ icon, label }]  right column (joining date, location)
 *   actions     — ReactNode anchored top-right (three-dot menu)
 */
export function ProfileInfoBar({
  avatarSrc,
  initials = "?",
  name,
  isActive = true,
  subtitle,
  leftItems = [],
  rightItems = [],
  actions,
}) {
  return (
    <ProfileHeader>
      <ProfileAvatar>
        {avatarSrc ? <img src={avatarSrc} alt={name} /> : initials}
      </ProfileAvatar>

      <ProfileMain>
        <ProfileNameRow>
          <ProfileName>{name}</ProfileName>
          <ProfileStatusBadge $active={isActive}>
            {isActive ? "Active" : "Inactive"}
          </ProfileStatusBadge>
        </ProfileNameRow>

        {subtitle && <ProfileSubtitle>{subtitle}</ProfileSubtitle>}

        <ProfileDetails>
          {leftItems.filter((i) => i.label).map((item, idx) => (
            <ProfileDetailItem key={idx}>
              {item.icon && <i className={`bi ${item.icon}`} />}
              {item.href
                ? <a href={item.href} target="_blank" rel="noreferrer">{item.label}</a>
                : item.label}
            </ProfileDetailItem>
          ))}
        </ProfileDetails>
      </ProfileMain>

      {rightItems.length > 0 && (
        <ProfileRight>
          {rightItems.filter((i) => i.label).map((item, idx) => (
            <ProfileRightItem key={idx}>
              {item.icon && <i className={`bi ${item.icon}`} />}
              {item.label}
            </ProfileRightItem>
          ))}
        </ProfileRight>
      )}

      {actions && <ProfileActions>{actions}</ProfileActions>}
    </ProfileHeader>
  );
}
