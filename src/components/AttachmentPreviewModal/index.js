import { formatBytes } from "../../utils/common";
import {
  Overlay, ModalBox, ModalBody,
  ModalHeader, ModalTitle, CloseBtn,
  ModalFooter,
} from "../ModalShell";
import {
  PreviewStack, PreviewImageWrap, PreviewImage, PreviewPdfFrame, PreviewIconTile,
  PreviewMeta, PreviewMetaName, PreviewMetaSub,
  PreviewActions, GhostBtn,
} from "./component.styles";

// `kind` picks how the attachment renders inside the preview box — callers already
// know their own file's category (image/pdf/other), so it's passed in rather than
// re-derived here from name/mime.
export default function AttachmentPreviewModal({ title, attachment, kind = "image", onClose }) {
  if (!attachment) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalBox $maxWidth="480px" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseBtn onClick={onClose}><i className="bi bi-x-lg" /></CloseBtn>
        </ModalHeader>

        <ModalBody>
          <PreviewStack>
            <PreviewImageWrap>
              {kind === "pdf" ? (
                <PreviewPdfFrame src={attachment.url} title={attachment.name} />
              ) : kind === "image" ? (
                <PreviewImage src={attachment.url} alt={attachment.name} />
              ) : (
                <PreviewIconTile><i className="bi bi-file-earmark" /></PreviewIconTile>
              )}
            </PreviewImageWrap>
            <PreviewMeta>
              <PreviewMetaName>{attachment.name}</PreviewMetaName>
              {attachment.size ? <PreviewMetaSub>{formatBytes(attachment.size)}</PreviewMetaSub> : null}
            </PreviewMeta>
          </PreviewStack>
        </ModalBody>

        <ModalFooter>
          <PreviewActions>
            <GhostBtn as="a" href={attachment.url} download={attachment.name}>
              <i className="bi bi-download" />
              Download
            </GhostBtn>
            <GhostBtn
              type="button"
              onClick={() => window.open(attachment.url, "_blank", "noopener,noreferrer")}
            >
              <i className="bi bi-box-arrow-up-right" />
              Open in New Window
            </GhostBtn>
          </PreviewActions>
        </ModalFooter>
      </ModalBox>
    </Overlay>
  );
}
