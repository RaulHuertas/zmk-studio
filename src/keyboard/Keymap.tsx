import {
  PhysicalLayout,
  Keymap as KeymapMsg,
} from "@zmkfirmware/zmk-studio-ts-client/keymap";
import type { GetBehaviorDetailsResponse } from "@zmkfirmware/zmk-studio-ts-client/behaviors";

import {
  LayoutZoom,
  PhysicalLayout as PhysicalLayoutComp,
} from "./PhysicalLayout";
import { HidUsageLabel } from "./HidUsageLabel";
import type { KeyboardLayout } from "../keyboardLayout";

type BehaviorMap = Record<number, GetBehaviorDetailsResponse>;

export interface KeymapProps {
  layout: PhysicalLayout;
  keymap: KeymapMsg;
  behaviors: BehaviorMap;
  keyboardLayout: KeyboardLayout;
  scale: LayoutZoom;
  selectedLayerIndex: number;
  selectedKeyPosition: number | undefined;
  onKeyPositionClicked: (keyPosition: number) => void;
}

export const Keymap = ({
  layout,
  keymap,
  behaviors,
  keyboardLayout,
  scale,
  selectedLayerIndex,
  selectedKeyPosition,
  onKeyPositionClicked,
}: KeymapProps) => {
  if (!keymap.layers[selectedLayerIndex]) {
    return <></>;
  }

  const positions = layout.keys.map((k, i) => {
    if (i >= keymap.layers[selectedLayerIndex].bindings.length) {
      return {
        id: `${keymap.layers[selectedLayerIndex].id}-${i}`,
        header: "Unknown",
        x: k.x / 100.0,
        y: k.y / 100.0,
        width: k.width / 100,
        height: k.height / 100.0,
        children: <span></span>,
      };
    }

    if (behaviors[keymap.layers[selectedLayerIndex].bindings[i].behaviorId]?.displayName == "To Layer") {
      console.log("Found a to layer behavior at position " + i);
      //console.log(behaviors[keymap.layers[selectedLayerIndex].bindings[i].behaviorId]?.metadata)
      console.log(keymap.layers[selectedLayerIndex].bindings[i].param1)
    }
    if (behaviors[keymap.layers[selectedLayerIndex].bindings[i].behaviorId]?.displayName == "Momentary Layer") {
      console.log("Found a mo layer behavior at position " + i);
      //console.log(behaviors[keymap.layers[selectedLayerIndex].bindings[i].behaviorId]?.metadata)
      console.log(keymap.layers[selectedLayerIndex].bindings[i].param1)
    }
    if (behaviors[keymap.layers[selectedLayerIndex].bindings[i].behaviorId]?.displayName == "Key Press") {
      console.log("Found a keypress behavior at position " + i);
      //console.log(behaviors[keymap.layers[selectedLayerIndex].bindings[i].behaviorId]?.metadata)
      console.log(keymap.layers[selectedLayerIndex].bindings[i].param1)
    }
    return {
      id: `${keymap.layers[selectedLayerIndex].id}-${i}`,
      header:
        behaviors[keymap.layers[selectedLayerIndex].bindings[i].behaviorId]
          ?.displayName || "Unknown",
      x: k.x / 100.0,
      y: k.y / 100.0,
      width: k.width / 100,
      height: k.height / 100.0,
      r: (k.r || 0) / 100.0,
      rx: (k.rx || 0) / 100.0,
      ry: (k.ry || 0) / 100.0,
      children: (
        <HidUsageLabel
          hid_usage={keymap.layers[selectedLayerIndex].bindings[i].param1}
          hid_usage2={keymap.layers[selectedLayerIndex].bindings[i].param2}
          keyboardLayout={keyboardLayout}
        />
      ),
    };
  });

  return (
    <PhysicalLayoutComp
      positions={positions}
      oneU={48}
      hoverZoom={true}
      zoom={scale}
      selectedPosition={selectedKeyPosition}
      onPositionClicked={onKeyPositionClicked}
    />
  );
};
