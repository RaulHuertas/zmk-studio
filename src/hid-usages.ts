// import { UsagePages } from "./HidUsageTables-1.5.json";
// Filtered with `cat src/HidUsageTables-1.5.json | jq '{ UsagePages: [.UsagePages[] | select([.Id] |inside([7, 12]))] }' > src/keyboard-and-consumer-usage-tables.json`
import { UsagePages } from "./keyboard-and-consumer-usage-tables.json";
import HidOverridesEN from "./keyboardLayouts/hid-usage-name-overrides.en.json";
import HidOverridesLATAM from "./keyboardLayouts/hid-usage-name-overrides.latam.json";
import HidOverridesES from "./keyboardLayouts/hid-usage-name-overrides.es.json";

interface HidLabels {
  short?: string;
  med?: string;
  long?: string;
}

const overridesEN: Record<string, Record<string, HidLabels>> = HidOverridesEN;
const overridesLATAM: Record<string, Record<string, HidLabels>> = HidOverridesLATAM;
const overridesES: Record<string, Record<string, HidLabels>> = HidOverridesES;
let overridesMap = new Map<string, number>();
overridesMap.set('en', overridesEN);
overridesMap.set('latam', overridesLATAM);
overridesMap.set('es', overridesES);

export interface UsageId {
  Id: number;
  Name: string;
}

export interface UsagePageInfo {
  Name: string;
  UsageIds: UsageId[];
}

export const hid_usage_from_page_and_id = (page: number, id: number) =>
  (page << 16) + id;

export const hid_usage_page_and_id_from_usage = (
  usage: number,
): [number, number] => [(usage >> 16) & 0xffff, usage & 0xffff];

export const hid_usage_page_get_ids = (
  usage_page: number,
): UsagePageInfo | undefined => UsagePages.find((p) => p.Id === usage_page);

export const hid_usage_get_label = (
  usage_page: number,
  usage_id: number,
): string | undefined =>
  overridesEN[usage_page.toString()]?.[usage_id.toString()]?.short ||
  UsagePages.find((p) => p.Id === usage_page)?.UsageIds?.find(
    (u) => u.Id === usage_id,
  )?.Name;

export const hid_usage_get_labels = (
  usage_page: number,
  usage_id: number,
): { short?: string; med?: string; long?: string } =>
  overridesEN[usage_page.toString()]?.[usage_id.toString()] || {
    short: UsagePages.find((p) => p.Id === usage_page)?.UsageIds?.find(
      (u) => u.Id === usage_id,
    )?.Name,
  };
