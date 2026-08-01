import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatBytes } from "../../../utils/common";
import PermissionGate from "../../../components/PermissionGate";
import EmptyState from "../../../components/EmptyState";
import ConfirmDialog from "../../../components/ConfirmDialog";
import AttachmentPreviewModal from "../../../components/AttachmentPreviewModal";
import { projectAction } from "../../../store/projectSlice";
import UploadDocument from "./modals/UploadDocument";
import buildProjectAttachmentsPayload from "./projectAttachmentsPayload";
import {
  Wrapper,
  TabHeader, TabTitle, TabHint, UploadDocBtn,
  GridSection, SectionLabel, CardGrid, FileCard, RemoveBtn, Thumbnail, IconTile,
  CardDetails, CardName, CardMeta, CardDownload, CardDownloadDisabled,
} from "./component.styles";

const CATEGORIES = [
  { key: "image", label: "Images" },
  { key: "pdf",   label: "PDF Documents" },
  { key: "word",  label: "Word Documents" },
  { key: "other", label: "Other Files" },
];

const ICON_BY_TYPE = {
  pdf:  "bi-file-earmark-pdf",
  word: "bi-file-earmark-word",
  other: "bi-file-earmark",
};

// MIME-based categorization — used for the real project document list, whose
// entries carry a MIME type (e.g. "application/pdf") but no file extension.
const MIME_TYPE_LABEL = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
};

const getCategoryFromMime = (mime = "") => {
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  if (mime.includes("word")) return "word";
  return "other";
};

const getMimeTypeLabel = (mime = "") => {
  if (MIME_TYPE_LABEL[mime]) return MIME_TYPE_LABEL[mime];
  if (mime.startsWith("image/")) return mime.split("/")[1]?.toUpperCase() || "IMAGE";
  return getCategoryFromMime(mime).toUpperCase();
};

// Normalizes a real `projectDocs` entry — { documentId, name, fileSize, fileType (MIME), url } —
// into this tab's internal document shape.
function normalizeProjectDoc(doc) {
  const mime = doc.fileType || "";
  return {
    documentId: doc.documentId,
    documentName: doc.name || "Untitled",
    fileType: getCategoryFromMime(mime),
    typeLabel: getMimeTypeLabel(mime),
    fileSize: Number(doc.fileSize) || 0,
    url: doc.url || "",
  };
}

// The real API's document names often have no file extension (e.g. "RFI 1"),
// so give the browser's save dialog a proper extension to work with.
function getDownloadFilename(doc) {
  const hasExt = /\.[a-zA-Z0-9]+$/.test(doc.documentName || "");
  if (hasExt) return doc.documentName;
  const ext = (doc.typeLabel || "").toLowerCase();
  return ext ? `${doc.documentName}.${ext}` : doc.documentName;
}

function Documents({ data, projectDocs }) {
  const dispatch = useDispatch();
  const { editProject } = useSelector((s) => s?.project) || {};
  const { isLoading: isRemoving, savedAt } = editProject || {};

  const [documents, setDocuments] = useState(() => (projectDocs || []).map(normalizeProjectDoc));
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [confirmRemoveDoc, setConfirmRemoveDoc] = useState(null);
  const [pendingRemoveId, setPendingRemoveId] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Re-sync when the parent's real project-detail fetch (re)loads — e.g. navigating
  // between projects, or after a document upload/removal triggers a background refetch.
  useEffect(() => {
    setDocuments((projectDocs || []).map(normalizeProjectDoc));
  }, [projectDocs]);

  // Clears the shared editProject state once our own remove request lands, so it
  // doesn't get mistaken for a fresh save by the Upload modal's own savedAt watcher.
  useEffect(() => {
    if (savedAt && pendingRemoveId) {
      setPendingRemoveId(null);
      dispatch(projectAction.resetEditProject());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedAt]);

  function handleConfirmRemove() {
    if (!confirmRemoveDoc) return;
    const remainingIds = (projectDocs || [])
      .map((doc) => doc.documentId)
      .filter((id) => id !== confirmRemoveDoc.documentId);

    setPendingRemoveId(confirmRemoveDoc.documentId);
    setConfirmRemoveDoc(null);
    dispatch(projectAction.updateProjectStart(
      buildProjectAttachmentsPayload(data, remainingIds, "Document removed successfully")
    ));
  }

  const grouped = useMemo(() => {
    const map = { image: [], pdf: [], word: [], other: [] };
    documents.forEach((doc) => {
      const bucket = map[doc.fileType] ? doc.fileType : "other";
      map[bucket].push(doc);
    });
    return map;
  }, [documents]);

  const hasAnyDocuments = documents.length > 0;

  return (
    <Wrapper>
      <TabHeader>
        <div>
          <TabTitle>Documents</TabTitle>
          <TabHint>Files attached to this project</TabHint>
        </div>
        <PermissionGate can="canProjectUpdate">
          <UploadDocBtn type="button" onClick={() => setShowUploadModal(true)}>
            <i className="bi bi-cloud-arrow-up" />
            Upload Document
          </UploadDocBtn>
        </PermissionGate>
      </TabHeader>

      {showUploadModal && (
        <UploadDocument
          project={data}
          existingDocumentIds={(projectDocs || []).map((doc) => doc.documentId)}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {!hasAnyDocuments ? (
        <EmptyState
          icon="bi-folder2-open"
          title="No documents yet"
          subtitle="Upload files above to attach them to this project."
        />
      ) : (
        CATEGORIES.map(({ key, label }) => {
          const docsInCategory = grouped[key];
          if (!docsInCategory || docsInCategory.length === 0) return null;

          return (
            <GridSection key={key}>
              <SectionLabel>{label}</SectionLabel>
              <CardGrid>
                {docsInCategory.map((doc) => (
                  <FileCard
                    key={doc.documentId}
                    title={doc.documentName}
                    $clickable={!!doc.url}
                    onClick={() => doc.url && setPreviewDoc(doc)}
                  >
                    <PermissionGate can="canProjectUpdate">
                      <RemoveBtn
                        type="button"
                        title="Remove document"
                        disabled={isRemoving}
                        onClick={(e) => { e.stopPropagation(); setConfirmRemoveDoc(doc); }}
                      >
                        <i className={pendingRemoveId === doc.documentId ? "bi bi-hourglass-split" : "bi bi-x"} />
                      </RemoveBtn>
                    </PermissionGate>
                    {doc.fileType === "image" ? (
                      <Thumbnail src={doc.url} alt={doc.documentName} />
                    ) : (
                      <IconTile $type={doc.fileType}>
                        <i className={`bi ${ICON_BY_TYPE[doc.fileType] || ICON_BY_TYPE.other}`} />
                      </IconTile>
                    )}
                    <CardDetails>
                      <CardName title={doc.documentName}>{doc.documentName}</CardName>
                      <CardMeta>{doc.typeLabel} · {formatBytes(doc.fileSize)}</CardMeta>
                      {doc.url ? (
                        <CardDownload
                          href={doc.url}
                          download={getDownloadFilename(doc)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="bi bi-download" />
                          Download
                        </CardDownload>
                      ) : (
                        <CardDownloadDisabled>
                          <i className="bi bi-download" />
                          Download
                        </CardDownloadDisabled>
                      )}
                    </CardDetails>
                  </FileCard>
                ))}
              </CardGrid>
            </GridSection>
          );
        })
      )}

      {confirmRemoveDoc && (
        <ConfirmDialog
          title="Remove Document"
          message={`Remove "${confirmRemoveDoc.documentName}" from this project? This cannot be undone.`}
          confirmLabel="Remove"
          variant="danger"
          onConfirm={handleConfirmRemove}
          onCancel={() => setConfirmRemoveDoc(null)}
        />
      )}

      {previewDoc && (
        <AttachmentPreviewModal
          title={previewDoc.documentName}
          attachment={{ name: previewDoc.documentName, url: previewDoc.url, size: previewDoc.fileSize }}
          kind={previewDoc.fileType === "image" || previewDoc.fileType === "pdf" ? previewDoc.fileType : "other"}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </Wrapper>
  );
}

export default Documents;
