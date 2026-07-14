import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { Input } from "@/components/ui/input";

const API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "") as string;

// Grays, Essex — biases (doesn't restrict) results toward the local area so
// nearby streets rank above same-named places elsewhere in the country.
// Customers can still search for airports and other out-of-area destinations.
const GRAYS_ESSEX_BOUNDS: google.maps.LatLngBoundsLiteral = {
  north: 51.62,
  south: 51.38,
  east: 0.55,
  west: 0.05,
};

let loaderConfigured = false;

interface AddressAutocompleteProps {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
  className?: string;
  "data-testid"?: string;
}

const AddressAutocomplete = forwardRef<HTMLInputElement, AddressAutocompleteProps>(
  function AddressAutocomplete(
    { id, value, onValueChange, onBlur, placeholder, className, ...rest },
    forwardedRef,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    // Keeps the effect below mount-only while still calling the latest
    // callback — recreating the Autocomplete instance on every keystroke
    // (which a naive [onValueChange] dependency would cause) leaks widgets.
    const onValueChangeRef = useRef(onValueChange);
    onValueChangeRef.current = onValueChange;

    useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

    useEffect(() => {
      const el = inputRef.current;
      if (!el || !API_KEY) return;
      let destroyed = false;

      if (!loaderConfigured) {
        setOptions({ key: API_KEY, v: "weekly" });
        loaderConfigured = true;
      }

      importLibrary("places")
        .then(({ Autocomplete }) => {
          if (destroyed || !inputRef.current) return;

          const autocomplete = new Autocomplete(inputRef.current, {
            fields: ["formatted_address", "name"],
            componentRestrictions: { country: "gb" },
            bounds: GRAYS_ESSEX_BOUNDS,
            strictBounds: false,
          });
          autocompleteRef.current = autocomplete;

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            const address = place.formatted_address ?? place.name ?? "";
            if (address) onValueChangeRef.current(address);
          });
        })
        .catch((err: unknown) => {
          console.error("[AddressAutocomplete] Google Places failed to load:", err);
        });

      return () => {
        destroyed = true;
        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
          autocompleteRef.current = null;
        }
      };
    }, []);

    return (
      <Input
        id={id}
        ref={inputRef}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
        {...rest}
      />
    );
  },
);

export default AddressAutocomplete;
