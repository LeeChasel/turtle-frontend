import updateShippingInfo from "@/actions/updateShippingInfo";
import useUserTokenCookie from "@/hooks/useUserTokenCookie";
import { OrderDetail } from "@/types/Order";
import { showToast } from "@/utils/toastAlert";
import { useRef, forwardRef, useState } from "react";
import { z } from "zod";

export default function UpdateSenderInfo({ data }: { data: OrderDetail }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openDialog() {
    dialogRef.current?.showModal();
  }
  return (
    <>
      <button
        type="button"
        className="shadow-md btn btn-outline"
        onClick={openDialog}
      >
        寄件資訊
      </button>
      <SenderInfoDialog ref={dialogRef} data={data} />
    </>
  );
}

const senderSchema = z.object({
  senderName: z
    .string()
    .regex(/^[^\d\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/u, {
      message: "不可包含特殊符號或數字",
    })
    .min(2, { message: "姓名長度最少2為2" })
    .max(4, { message: "姓名長度最多為4" }),
  senderCellPhone: z.string().regex(/^09\d{8}$/, {
    message: "手機號碼格式錯誤",
  }),
  senderZipCode: z
    .string()
    .regex(/^\d{3}(?:\d{2})?$/, { message: "郵遞區號格式錯誤" }),

  // 只接受數字，且小數點後最多兩位
  goodsWeight: z
    .string()
    .regex(/^(\d+(\.\d{1,2})?)$/, { message: "重量格式錯誤" })
    .transform((value) => parseFloat(value)),
  senderAddress: z
    .string()
    .min(6, { message: "地址長度需大於6個字元" })
    .max(60, { message: "地址長度不可超過60個字元" }),
});

type SenderInfoDialogProps = {
  data: OrderDetail;
};

const SenderInfoDialog = forwardRef<HTMLDialogElement, SenderInfoDialogProps>(
  (props, ref) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const cellPhoneRef = useRef<HTMLInputElement>(null);
    const zipCodeRef = useRef<HTMLInputElement>(null);
    const weightRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const { tokenCookie } = useUserTokenCookie();
    const { data } = props;
    const canUpdateInfo = data.logisticsOrderStatus.length === 0;

    async function handleUpdateSenderInfo() {
      try {
        const validatedData = senderSchema.parse({
          senderName: nameRef.current?.value,
          senderCellPhone: cellPhoneRef.current?.value,
          senderZipCode: zipCodeRef.current?.value,
          goodsWeight: weightRef.current?.value,
          senderAddress: addressRef.current?.value,
        });

        await updateShippingInfo(tokenCookie!, {
          orderId: data.orderId,
          logisticsType: data.shippingInfo.logisticsType,
          logisticsSubType: data.shippingInfo.logisticsSubType,
          payOnDelivery: data.shippingInfo.payOnDelivery,
          receiverName: data.shippingInfo.receiverName,
          receiverEmail: data.shippingInfo.receiverEmail,
          ...validatedData,
        });
        showToast("success", "寄件資訊已更新");
        setIsEditing(false);
      } catch (error) {
        if (error instanceof z.ZodError) {
          showToast("error", error.errors[0].message);
        } else if (error instanceof Error) {
          showToast("error", error.message);
        }
      }
    }

    return (
      <dialog ref={ref} className="modal">
        <div className="max-w-[60%] modal-box">
          <h3 className="text-lg font-bold">寄件資訊</h3>
          <div className="grid grid-cols-2 gap-2">
            <label className="w-full form-control">
              <div className="label">
                <span className="label-text">寄件人姓名</span>
                <span className="label-text-alt">2-4字</span>
              </div>
              <input
                type="text"
                className="w-full bg-white input input-bordered"
                defaultValue={data.shippingInfo.senderName}
                disabled={!isEditing}
                ref={nameRef}
              />
            </label>
            <label className="w-full form-control">
              <div className="label">
                <span className="label-text">寄件人手機號碼</span>
              </div>
              <input
                type="tel"
                className="w-full bg-white input input-bordered"
                defaultValue={data.shippingInfo.senderCellPhone}
                disabled={!isEditing}
                ref={cellPhoneRef}
              />
            </label>
            <label className="w-full form-control">
              <div className="label">
                <span className="label-text">寄件人郵遞區號</span>
                <span className="label-text-alt">3或5碼</span>
              </div>
              <input
                type="number"
                className="w-full bg-white input input-bordered"
                defaultValue={data.shippingInfo.senderZipCode}
                disabled={!isEditing}
                ref={zipCodeRef}
              />
            </label>
            <label className="w-full form-control">
              <div className="label">
                <span className="label-text">寄件重量</span>
                <span className="label-text-alt">
                  單位：公斤，取至小數後兩位
                </span>
              </div>
              <input
                type="number"
                className="w-full bg-white input input-bordered"
                disabled={!isEditing}
                defaultValue={data.shippingInfo.goodsWeight}
                ref={weightRef}
              />
            </label>
            <label className="w-full form-control col-span-full">
              <div className="label">
                <span className="label-text">寄件人地址</span>
              </div>
              <input
                type="text"
                className="w-full bg-white input input-bordered"
                disabled={!isEditing}
                defaultValue={data.shippingInfo.senderAddress}
                ref={addressRef}
              />
            </label>
          </div>

          <div className="modal-action">
            <form method="dialog" className="flex gap-3">
              <button
                className="btn btn-outline"
                onClick={() => setIsEditing(false)}
              >
                {isEditing ? "取消" : "關閉"}
              </button>
              {canUpdateInfo && (
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={
                    isEditing
                      ? handleUpdateSenderInfo
                      : () => setIsEditing(true)
                  }
                >
                  {isEditing ? "儲存" : "編輯"}
                </button>
              )}
            </form>
          </div>
        </div>
      </dialog>
    );
  },
);
