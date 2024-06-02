import { useRef } from "react";

type UploadButtonProps = {
  hasVideo: boolean;
  updateFile: (file: File) => void;
};

export function UploadButton(props: UploadButtonProps) {
  const { hasVideo, updateFile } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const buttonText = hasVideo ? "重新上傳影片" : "上傳影片";

  const toggleUpload = () => {
    if (hasVideo) {
      handleOpenDialog();
    } else {
      handleUpload();
    }
  };

  const handleOpenDialog = () => {
    dialogRef.current?.showModal();
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
    dialogRef.current?.close();
  };

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={toggleUpload}>
        {buttonText}
      </button>

      <input
        type="file"
        accept="video/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files?.length) {
            updateFile(e.target.files[0]);
          }
        }}
      />

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">確定重新上傳影片？</h3>
          <p className="py-4">重新上傳影片將會清除所有的修改</p>
          <div className="modal-action">
            <form method="dialog" className="space-x-3">
              <button className="btn btn-primary" type="submit">
                返回
              </button>
            </form>
            <button className="btn btn-primary" onClick={handleUpload}>
              確定
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
