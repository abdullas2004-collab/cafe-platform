/**
 * @startingPoint section="Components" subtitle="Underline tabs, mono caps labels" viewport="700x120"
 */
export interface TabsProps {
  items: { value: string; label: string }[];
  active?: string;
  onChange?: (value: string) => void;
}
