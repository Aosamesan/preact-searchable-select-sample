import { Signal } from "@preact/signals-core";
import { JSX } from "preact/jsx-runtime";
import clsx from "clsx";
import { createRef } from "preact";
import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export type SearchableSelectItem<T = unknown> = T & {
  value: string;
  label: string;
};

export type SearchableSelectProps<T extends SearchableSelectItem> =
  & {
    options: Array<T>;
    value: Signal<T | null>;
  }
  & Pick<
    JSX.HTMLAttributes<HTMLSelectElement>,
    "id" | "name" | "class" | "className" | "placeholder"
  >;

function containFilterValue<T extends SearchableSelectItem>(
  source: T,
  filter: string,
) {
  return source.label.toLocaleLowerCase().includes(
    filter.toLocaleLowerCase(),
  ) ||
    source.value.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
}

export default function SearchableSelect<T extends SearchableSelectItem>(
  props: SearchableSelectProps<T>,
) {
  const datalistRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  const filterValue = useSignal<string>("");
  const filteredOptions = useComputed(() => {
    return props.options.filter((option) =>
      containFilterValue(option, filterValue.value)
    );
  });
  const currentLabel = useComputed(() => props.value.value?.label);

  function toggleDatalist() {
    datalistRef.current!.classList.toggle("d-none");
  }

  function optionOnClick(e: JSX.TargetedEvent<HTMLOptionElement>) {
    inputRef.current!.value = e.currentTarget.value ?? "";
    props.value.value =
      props.options.find((option) =>
        option.value === e.currentTarget.dataset.value
      ) ?? null;
  }

  function inputOnInput(e: JSX.TargetedEvent<HTMLInputElement>) {
    filterValue.value = e.currentTarget.value;
  }

  function resetInput() {
    inputRef.current!.value = "";
    props.value.value = null;
  }

  useEffect(() => {
    inputRef.current!.value = currentLabel.value ?? "";
  }, []);

  return (
    <div
      class={clsx(
        "custom-searchable-select",
        "position-relative",
        props.class,
        props.className,
      )}
    >
      <div className="input-group">
        <input
          id={props.id}
          autocomplete="off"
          name={props.name}
          placeholder={props.placeholder}
          defaultValue={currentLabel.value}
          class="form-control"
          ref={inputRef}
          onFocus={toggleDatalist}
          onfocusoutCapture={toggleDatalist}
          onInput={inputOnInput}
          type="text"
        />
        <button className="btn btn-danger" type="button" onClick={resetInput}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      <div className="datalist-wrapper position-absolute border border-1 border-top-0 border-gray-500 p-1 w-100 d-none"
          ref={datalistRef}>
        <datalist class="d-block"
          id={`${props.id}__list`}
        >
          {filteredOptions.value.map((option) => (
            <option
              class={clsx("p-1 mb-1", {
                "active": option.value === props.value.value?.value,
              })}
              value={option.label}
              data-value={option.value}
              onMouseDown={optionOnClick}
            >
              {option.label}
            </option>
          ))}
        </datalist>
      </div>
    </div>
  );
}
