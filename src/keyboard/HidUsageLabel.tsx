import {
  hid_usage_get_labels,
  hid_usage_page_and_id_from_usage,
} from "../hid-usages";

export interface HidUsageLabelProps {
  hid_usage: number;
  hid_usage2: number;
}

function remove_prefix(s?: string) {
  return s?.replace(/^Keyboard /, "");
}

function mixStrings(s1?: string, s2?: string) {
    if (s2 == undefined || s2 == "") {
        return s1;
    }
    if (s1 == undefined || s1 == "") {
        return s2;
    }
    return remove_prefix(s1) + "/" + remove_prefix(s2);
}
function mixLabels(labels1, labels2){
    if (labels2 == undefined) {
        return labels1;
    }
    let short = mixStrings(labels1.short, labels2.short);
    let med   = mixStrings(labels1.med, labels2.med);
    let long  = mixStrings(labels1.long, labels2.long);
    return {short, med, long};
}


export const HidUsageLabel = ({ hid_usage,hid_usage2 }: HidUsageLabelProps) => {
  let [page, id] = hid_usage_page_and_id_from_usage(hid_usage);
  let [page2, id2] = hid_usage_page_and_id_from_usage(hid_usage2);

  // TODO: Do something with implicit mods!
  page &= 0xff;

  let labels1 = hid_usage_get_labels(page, id);
  let labels2 = hid_usage_get_labels(page2, id2);
  let labels = mixLabels(labels1, labels2);

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
