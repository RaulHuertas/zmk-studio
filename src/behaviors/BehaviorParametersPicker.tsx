import { BehaviorBindingParametersSet } from "@zmkfirmware/zmk-studio-ts-client/behaviors";
import { ParameterValuePicker } from "./ParameterValuePicker";
import { validateValue } from "./parameters";
import type { KeyboardLayout } from "../keyboardLayout";

export interface BehaviorParametersPickerProps {
  param1?: number;
  param2?: number;
  metadata: BehaviorBindingParametersSet[];
  layers: { id: number; name: string }[];
  keyboardLayout?: KeyboardLayout;
  onParam1Changed: (value?: number) => void;
  onParam2Changed: (value?: number) => void;
}

export const BehaviorParametersPicker = ({
  param1,
  param2,
  metadata,
  layers,
  keyboardLayout = "en",
  onParam1Changed,
  onParam2Changed,
}: BehaviorParametersPickerProps) => {
  if (param1 === undefined) {
    return (
      <div>
        <ParameterValuePicker
          values={metadata.flatMap((m) => m.param1)}
          onValueChanged={onParam1Changed}
          layers={layers}
          keyboardLayout={keyboardLayout}
        />
      </div>
    );
  } else {
    const set = metadata.find((s) =>
      validateValue(
        layers.map((l) => l.id),
        param1,
        s.param1,
      ),
    );
    return (
      <>
        <ParameterValuePicker
          values={metadata.flatMap((m) => m.param1)}
          value={param1}
          layers={layers}
          keyboardLayout={keyboardLayout}
          onValueChanged={onParam1Changed}
        />
        {(set?.param2?.length || 0) > 0 && (
          <ParameterValuePicker
            values={set!.param2}
            value={param2}
            layers={layers}
            keyboardLayout={keyboardLayout}
            onValueChanged={onParam2Changed}
          />
        )}
      </>
    );
  }
};
