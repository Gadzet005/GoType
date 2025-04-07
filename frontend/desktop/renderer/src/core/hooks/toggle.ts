import React from "react";

export function useToggle(initial: boolean = false): [boolean, () => void] {
    const [isToggled, setIsToggled] = React.useState(initial);
    const toggle = React.useCallback(
        () => setIsToggled((val) => !val),
        [setIsToggled]
    );
    return [isToggled, toggle];
}
