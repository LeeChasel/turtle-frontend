import useCustomizationResultStore from "../store/useCustomizationResultStore";

export function FinishCustomization() {
  const customizationResult =
    useCustomizationResultStore.use.customizationResult();
  return (
    <div>
      <h2>欲客製化項目</h2>
      <ul>
        {customizationResult.map((customization) => (
          <li key={customization.name}>
            {customization.name} - {customization.customization.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
