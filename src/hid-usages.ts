// import { UsagePages } from "./HidUsageTables-1.5.json";
// Filtered with `cat src/HidUsageTables-1.5.json | jq '{ UsagePages: [.UsagePages[] | select([.Id] |inside([7, 12]))] }' > src/keyboardLayouts/keyboard-and-consumer-usage-tables.json`
import UsageTableEN from "./keyboardLayouts/keyboard-and-consumer-usage-tables.en.json";
import UsageTableLATAM from "./keyboardLayouts/keyboard-and-consumer-usage-tables.latam.json";
import UsageTableES from "./keyboardLayouts/keyboard-and-consumer-usage-tables.es.json";

import HidOverridesEN from "./keyboardLayouts/hid-usage-name-overrides.en.json";
import HidOverridesLATAM from "./keyboardLayouts/hid-usage-name-overrides.latam.json";
import HidOverridesES from "./keyboardLayouts/hid-usage-name-overrides.es.json";
import type { KeyboardLayout } from "./keyboardLayout";

interface HidLabels {
  short?: string;
  med?: string;
  long?: string;
}

const overridesEN: Record<string, Record<string, HidLabels>> = HidOverridesEN;
const overridesLATAM: Record<
  string,
  Record<string, HidLabels>
> = HidOverridesLATAM;
const overridesES: Record<string, Record<string, HidLabels>> = HidOverridesES;

const overridesByLayout: Record<
  KeyboardLayout,
  Record<string, Record<string, HidLabels>>
> = {
  en: overridesEN,
  latam: overridesLATAM,
  es: overridesES,
};

const usagePagesByLayout = {
  en: UsageTableEN.UsagePages,
  latam: UsageTableLATAM.UsagePages,
  es: UsageTableES.UsagePages,
} as const;

export interface UsageId {
  Id: number;
  Name: string;
}

export interface UsagePageInfo {
  Id: number;
  Name: string;
  UsageIds: UsageId[];
}

const emptyHeaders = new Set([
  "None",
  "Studio Unlock",
  "Bootloader",
  "Caps Word",
  "Reset",
]);

const getUsagePages = (
  keyboardLayout: KeyboardLayout = "en",
): UsagePageInfo[] => usagePagesByLayout[keyboardLayout];

export const hid_usage_from_page_and_id = (page: number, id: number) =>
  (page << 16) + id;

export const hid_usage_page_and_id_from_usage = (
  usage: number,
): [number, number] => [(usage >> 16) & 0xffff, usage & 0xffff];

export const hid_usage_page_get_ids = (
  usage_page: number,
  keyboardLayout: KeyboardLayout = "en",
): UsagePageInfo | undefined =>
  getUsagePages(keyboardLayout).find((p) => p.Id === usage_page);

export const hid_usage_get_label = (
  usage_page: number,
  usage_id: number,
  keyboardLayout: KeyboardLayout = "en",
  header?: string,
): string | undefined => {
  if (header && emptyHeaders.has(header)) {
    return undefined;
  }

  if (usage_page == 0) {
    return usage_id.toString();
  }

  if (header == "Bluetooth"){
    var usage_name = ""
    if (usage_page==0){
        usage_name = "Clear"
    }
    return  usage_name 
  }
  return (
    overridesByLayout[keyboardLayout][usage_page.toString()]?.[
      usage_id.toString()
    ]?.short ||
    getUsagePages(keyboardLayout)
      .find((p) => p.Id === usage_page)
      ?.UsageIds?.find((u) => u.Id === usage_id)?.Name
  );
};

export const hid_usage_get_labels = (
  usage_page: number,
  usage_id: number,
  keyboardLayout: KeyboardLayout = "en",
  header?: string,
): { short?: string; med?: string; long?: string } => {
  if (header && emptyHeaders.has(header)) {
    return {};
  }


  if (header == "Bluetooth"){
  console.log(header+usage_page.toString()+usage_id.toString())
    var usage_name = ""
    if (usage_id==0){
        usage_name = "Clr"
    }else if (usage_id==1){
        usage_name = "Next"
    }else if (usage_id==2){
        usage_name = "Prev"
    }else if (usage_id==3){
        usage_name = "Select"
    }else if (usage_id==4){
        usage_name = "ClrAll"
    }else if (usage_id==5){
        usage_name = "Disconnect"
    }
    return { short: usage_name };
  }
  
  if (usage_page == 0) {
    return { short: usage_id.toString() };
  }
  return (
    overridesByLayout[keyboardLayout][usage_page.toString()]?.[
      usage_id.toString()
    ] || {
      short: getUsagePages(keyboardLayout)
        .find((p) => p.Id === usage_page)
        ?.UsageIds?.find((u) => u.Id === usage_id)?.Name,
    }
  );
};
