import {
  hid_usage_get_labels,
  hid_usage_page_and_id_from_usage,
} from "../hid-usages";
import type { KeyboardLayout } from "../keyboardLayout";

export interface HidUsageLabelProps {
  hid_usage: number;
  hid_usage2: number;
  keyboardLayout?: KeyboardLayout;
}

function remove_prefix(s?: string) {
  return s?.replace(/^Keyboard /, "");
}

export const HidUsageLabel = (
    { hid_usage,hid_usage2,keyboardLayout }: HidUsageLabelProps
) => {
  var labels1 = { short: "a", med: "b", long: "c" };
  var labels2 = { short: "A", med: "B", long: "C" };

  let [page, id] = hid_usage_page_and_id_from_usage(hid_usage,keyboardLayout);
  let [page2, id2] = hid_usage_page_and_id_from_usage(hid_usage2,keyboardLayout);

  // TODO: Do something with implicit mods!
  page &= 0xff;

  labels1 = hid_usage_get_labels(page, id,keyboardLayout);
  labels2 = hid_usage_get_labels(page2, id2,keyboardLayout);
    console.log("Got labels for usage " + hid_usage + ": " + JSON.stringify(labels1));
    console.log("Got labels for usage " + hid_usage2 + ": " + JSON.stringify(labels2));

  return (
    <div className="flex w-full h-full flex-col  items-center justify-center leading-none">

    <span
      className="@[4em]:before:content-[attr(data-long-content)] @[2em]:before:content-[attr(data-med-content)] before:content-[attr(aria-label)] text-sm "
      aria-label={remove_prefix(labels1.short)}
      data-med-content={remove_prefix(labels1.med || labels1.short)}
      data-long-content={remove_prefix(
        labels1.long || labels1.med || labels1.short
      )}
    />
    <span
      className="@[4em]:before:content-[attr(data-long-content)] @[2em]:before:content-[attr(data-med-content)] before:content-[attr(aria-label)] text-indigo-700 text-sm font-bold"
      aria-label={remove_prefix(labels2.short)}
      data-med-content={remove_prefix(labels2.med || labels2.short)}
      data-long-content={remove_prefix(
        labels2.long || labels2.med || labels2.short
      )}
    />
    </div>
  );
};

