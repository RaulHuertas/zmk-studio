import {
  hid_usage_get_labels,
  hid_usage_page_and_id_from_usage,
} from "../hid-usages";
import type { KeyboardLayout } from "../keyboardLayout";

export interface HidUsageLabelProps {
  hid_usage: number;
  hid_usage2: number;
  keyboardLayout?: KeyboardLayout;
  header?: string;
}

function remove_prefix(s?: string) {
  return s?.replace(/^Keyboard /, "");
}

export const HidUsageLabel = ({
  hid_usage,
  hid_usage2,
  keyboardLayout,
  header,
}: HidUsageLabelProps) => {
  let labels1: ReturnType<typeof hid_usage_get_labels> = {
    short: "",
    med: "",
    long: "",
  };
  let labels2: ReturnType<typeof hid_usage_get_labels> = {
    short: "",
    med: "",
    long: "",
  };

  let [page, id] = hid_usage_page_and_id_from_usage(hid_usage);
  const [page2, id2] = hid_usage_page_and_id_from_usage(hid_usage2);

  // TODO: Do something with implicit mods!
  page &= 0xff;
  const empty_types = ["None","Studio Unlock","Bootloader","Caps Word","Reset" ]
  const no_second_param = [7,12 ]
  if ( !empty_types.includes(header || "")) {
      labels1 = hid_usage_get_labels(page, id, keyboardLayout);
      if (!no_second_param.includes(page)) {
        labels2 = hid_usage_get_labels(page2, id2, keyboardLayout);
      }
  }


  console.log(
    "header " + header
  );
  console.log(
    "Got labels for usage " + hid_usage + ": " + JSON.stringify(labels1)
  );
  console.log(
    "Got labels2 for usage " + hid_usage2 + ": " + JSON.stringify(labels2)
  );

  return (
    <div className="flex w-full h-full flex-col  items-center justify-center leading-none">
      <span
        className="@[4em]:before:content-[attr(data-long-content)] @[2em]:before:content-[attr(data-med-content)] before:content-[attr(aria-label)] text-sm "
        aria-label={remove_prefix(labels1.short)}
        data-med-content={remove_prefix(labels1.med || labels1.short)}
        data-long-content={remove_prefix(
          labels1.long || labels1.med || labels1.short,
        )}
      />
      <span
        className="@[4em]:before:content-[attr(data-long-content)] @[2em]:before:content-[attr(data-med-content)] before:content-[attr(aria-label)] text-indigo-700 text-sm font-bold"
        aria-label={remove_prefix(labels2.short)}
        data-med-content={remove_prefix(labels2.med || labels2.short)}
        data-long-content={remove_prefix(
          labels2.long || labels2.med || labels2.short,
        )}
      />
    </div>
  );
};
