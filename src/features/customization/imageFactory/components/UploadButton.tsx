import { useRef } from "react";

type UploadButtonProps = {
  hasSourceImage: boolean;
  changeSourceImageCallback: (image: File) => void;
};

export function UploadButton(props: UploadButtonProps) {
  const { hasSourceImage, changeSourceImageCallback } = props;
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleOpenDialog = () => {
    dialogRef.current?.showModal();
  };

  const handleTriggerUpload = () => {
    hiddenInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      changeSourceImageCallback(fileList[0]);
      dialogRef.current?.close();
    }
  };
  return (
    <div className="flex justify-end">
      <button
        type="button"
        className="btn btn-primary"
        onClick={hasSourceImage ? handleOpenDialog : handleTriggerUpload}
      >
        {hasSourceImage ? "重新" : ""}上傳圖片
      </button>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={hiddenInputRef}
        onChange={handleImageChange}
      />

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">確定重新上傳圖片？</h3>
          <p className="py-4">重新上傳圖片將會清除所有的修改</p>
          <div className="modal-action">
            <form method="dialog" className="space-x-3">
              <button className="btn btn-primary" type="submit">
                返回
              </button>
            </form>
            <button className="btn btn-primary" onClick={handleTriggerUpload}>
              確定
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
