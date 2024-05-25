import { useRef } from "react";

type UploadButtonProps = {
  hasVideo: boolean;
  // changeVideo: () => void;
};

export function UploadButton(props: UploadButtonProps) {
  const { hasVideo } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => fileInputRef.current?.click()}
      >
        {hasVideo ? "重新上傳影片" : "上傳影片"}
      </button>

      <input
        type="file"
        accept="video/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => console.log(e.target.files)}
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
            <button className="btn btn-primary">確定</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
