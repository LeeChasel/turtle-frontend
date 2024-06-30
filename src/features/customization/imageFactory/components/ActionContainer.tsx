import { FactoryAction } from "../types";

type ActionContainerProps = {
  changeActionCallback: (action: FactoryAction) => void;
};

export function ActionContainer(props: ActionContainerProps) {
  const { changeActionCallback } = props;
  const actionButtonStyle =
    "hover:bg-gray-700 active:bg-gray-600 text-white p-1 m-2 md:p-2 lg:m-5 rounded";
  return (
    <div className="basis-1/3 max-w-[300px] bg-gray-800 h-[540px] flex">
      <div className="basis-1/3 flex flex-col items-centerpy-5 gap-5">
        <button
          className={actionButtonStyle}
          onClick={() => changeActionCallback("crop")}
          type="button"
        >
          剪裁
        </button>
      </div>
      <div className="basis-2/3 border-l-2"></div>
    </div>
  );
}
