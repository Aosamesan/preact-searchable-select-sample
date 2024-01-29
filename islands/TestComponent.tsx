import { useComputed, useSignal } from "@preact/signals";
import SearchableSelect, {
  type SearchableSelectItem,
} from "../components/SearchableSelect.tsx";

const options: Array<SearchableSelectItem> = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
  { value: "3", label: "Three" },
  { value: "4", label: "Four" },
  { value: "5", label: "Five" },
  { value: "6", label: "Six" },
  { value: "7", label: "Seven" },
  { value: "8", label: "Eight" },
  { value: "9", label: "Nine" },
  { value: "10", label: "Ten" },
  { value: "11", label: "Eleven" },
  { value: "12", label: "Twelve" },
];

export default function TestComponent() {
  const value = useSignal<SearchableSelectItem | null>(options[0]);
  const currentLabel = useComputed(() =>
    value.value?.label ?? "(Not Selected Yet)"
  );

  return (
    <div className="row my-3">
      <div className="col"></div>
      <div className="col">
        <label for="test">
          Current Value : {currentLabel.value}
        </label>
        <SearchableSelect
          id="test"
          options={options}
          value={value}
          placeholder="Select a value..."
        />
      </div>
      <div className="col"></div>
    </div>
  );
}
