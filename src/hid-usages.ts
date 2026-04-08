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
const overridesLATAM: Record<string, Record<string, HidLabels>> = HidOverridesLATAM;
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
): string | undefined => {
  if (usage_page==0) {
    return usage_id.toString();
  }
  return overridesByLayout[keyboardLayout][usage_page.toString()]?.[
    usage_id.toString()
  ]?.short ||
  getUsagePages(keyboardLayout)
    .find((p) => p.Id === usage_page)
    ?.UsageIds?.find((u) => u.Id === usage_id)?.Name;
}
export const hid_usage_get_labels = (
  usage_page: number,
  usage_id: number,
  keyboardLayout: KeyboardLayout = "en",
): { short?: string; med?: string; long?: string } => {
  if (usage_page==0) {
    return {short: usage_id.toString()};
  }
  return overridesByLayout[keyboardLayout][usage_page.toString()]?.[
    usage_id.toString()
  ] || {
    short: getUsagePages(keyboardLayout)
      .find((p) => p.Id === usage_page)
      ?.UsageIds?.find((u) => u.Id === usage_id)?.Name,
  };
}

