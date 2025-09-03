import * as React from "react";
import {
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

// 1. Popover - holds the state and methods, and expose it through context
// 2. Trigger - attach the trigger method to children
// 3. Content - render conditionally based on the state, through context
// 4. Close - attach the close method to children

// TODO: cover more positions

const defaultRect = {
	left: 0,
	top: 0,
	width: 0,
	height: 0,
};

const PopoverContext = React.createContext();

export const Popover = ({ children, preferredPosition = "bottom-center" }) => {
	const [isShow, setIsShow] = useState(false);
	const [triggerRect, setTriggerRect] = useState(defaultRect);

	const contextValue = {
		isShow,
		setIsShow,
		preferredPosition,
		triggerRect,
		setTriggerRect,
	};

	return (
		<PopoverContext.Provider value={contextValue}>
			{children}
		</PopoverContext.Provider>
	);
};

const Trigger = ({ children }) => {
	const { setIsShow, setTriggerRect } = useContext(PopoverContext);

	const ref = useRef(null);

	const onClick = (e) => {
		const element = ref.current;
		if (element == null) {
			return;
		}

		const rect = element.getBoundingClientRect();
		setTriggerRect(rect);
		setIsShow((isShow) => !isShow);
	};

	const onMouseEnter = () => {
		const element = ref.current;
		if (element == null) {
			return;
		}

		const rect = element.getBoundingClientRect();
		setTriggerRect(rect);
		setIsShow(true);
		console.log("hello mouse");
	};

	const onMouseLeave = () => {
		setIsShow(false);
	};

	const childrenToTriggerPopover = React.cloneElement(children, {
		onMouseEnter,
		onClick, // TODO: we better merge the onClick
		ref, // TODO: we better merge the ref
	});

	return childrenToTriggerPopover;
};

const Content = ({ children }) => {
	const { isShow } = useContext(PopoverContext);

	if (!isShow) {
		return null;
	}

	return <ContentInternal>{children}</ContentInternal>;
};

function ContentInternal({ children }) {
	const { triggerRect, preferredPosition, setIsShow } =
		useContext(PopoverContext);
	const ref = useRef(null);
	const [coords, setCoords] = useState({
		left: 0,
		top: 0,
	});

	useLayoutEffect(() => {
		const element = ref.current;
		if (element == null) {
			return;
		}

		const rect = element.getBoundingClientRect();

		const coords = getPopoverCoords(triggerRect, rect, preferredPosition);
		setCoords(coords);
	}, []);

	// const refFocusTrapping = useFocusTrapping();

	const dismiss = useCallback(() => {
		setIsShow(false);
	}, []);
	const refClickOutside = useClickOutside(dismiss);

	const mergedRef = mergeRef(ref, refClickOutside);
	return (
		<dialog
			open={true}
			ref={mergedRef}
			style={{
				position: "fixed",
				left: `${coords.left}px`,
				top: `${coords.top}px`,
				margin: 0,
				background: "white",
				border: "1px solid #e7e7e7",
				borderRadius: "5px",
				boxShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
				padding: 0,
			}}
		>
			{children}
		</dialog>
	);
}

function Close({ children }) {
	const { setIsShow } = useContext(PopoverContext);
	const onClick = (e) => {
		setIsShow(false);

		// popover will be gone
		// prevent this event triggering unexpected click
		e.stopPropagation();
	};
	const childrenToClosePopover = React.cloneElement(children, {
		onClick, // TODO: we better merge the onClick
	});

	return childrenToClosePopover;
}

Popover.Trigger = Trigger;
Popover.Content = Content;
Popover.Close = Close;

function getPopoverCoords(triggerRect, popoverRect, position) {
	switch (position) {
		case "bottom-center":
		default:
			// TODO: cover all positions
			let top = triggerRect.top + triggerRect.height + 10;
			let left = Math.max(
				triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2,
				10
			);

			// failover to top if there is not enough space
			if (top + popoverRect.height > window.innerHeight - 10) {
				top = triggerRect.top - 10 - popoverRect.height;
			}
			return {
				top,
				left,
			};

		case "top-right":
			let topRightTop = triggerRect.top - 10 - popoverRect.height;
			let topRightLeft = triggerRect.left + triggerRect.width - 40;

			// failover to bottom if there is not enough space
			if (topRightTop < 10) {
				topRightTop = triggerRect.top + triggerRect.height + 10;
			}
			return {
				top: topRightTop,
				left: topRightLeft,
			};
		case "top-left":
			let topLeftTop = triggerRect.top - 10 - popoverRect.height;
			let topLeftLeft = triggerRect.left - popoverRect.width + 40;

			// failover to bottom if there is not enough space
			if (topLeftTop < 10) {
				topLeftTop = triggerRect.top + triggerRect.height + 10;
			}

			return {
				top: topLeftTop,
				left: Math.max(topLeftLeft, 10),
			};
		case "top-center":
			let topCenterTop = triggerRect.top - 10 - popoverRect.height;
			let topCenterLeft =
				triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;

			// failover to bottom if there is not enough space
			if (topCenterTop < 10) {
				topCenterTop = triggerRect.top + triggerRect.height + 10;
			}
			return {
				top: topCenterTop,
				left: topCenterLeft,
			};
	}
}

// TODO: better focusable query
const focusableQuery = ":is(input, button, [tab-index]";

// // some hooks
// function useFocusTrapping() {
// 	// @ts-ignore TODO: fix the typings
// 	const refTrigger = useRef( document.activeElement);
// 	const ref = useRef(null);

// 	const onKeyDown = useCallback((e) => {
// 		const popover = ref.current;
// 		if (popover == null) {
// 			return;
// 		}
// 		const focusables = [...popover.querySelectorAll(focusableQuery)];

// 		switch (e.key) {
// 			case "Tab":
// 				// check if it is the last focusable
// 				const lastFocusable = focusables[focusables.length - 1];
// 				if (document.activeElement === lastFocusable) {
// 					// @ts-ignore, TODO: fix typing
// 					focusables[0]?.focus();

// 					e.preventDefault();
// 				}
// 		}
// 	}, []);

// 	useEffect(() => {
// 		const popover = ref.current;
// 		if (popover == null) {
// 			return;
// 		}

// 		const focusables = [...popover.querySelectorAll(focusableQuery)];
// 		// 1. focus the first focusable
// 		// @ts-ignore, TODO: fix typing
// 		focusables[0]?.focus();
// 		console.log("mount popover focusing", focusables[0]);

// 		// 2. attach keyboard event listener to trap the focus
// 		document.addEventListener("keydown", onKeyDown);
// 		return () => {
// 			document.removeEventListener("keydown", onKeyDown);

// 			// 3. refocus the trigger after dismissing
// 			// but only if the current activeElement is body
// 			// since this happens after popover is gone
// 			// TODO: am I right about this?
// 			const trigger = refTrigger.current;
// 			const currentActiveElement = document.activeElement;
// 			if (currentActiveElement == document.body) {
// 				trigger?.focus();
// 			}
// 		};
// 	}, []);

// 	return ref;
// }

function mergeRef(...refs) {
	return (el) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") {
				ref(el);
			} else {
				ref.current = el;
			}
		});
	};
}

function useClickOutside(callback) {
	const ref = useRef(null);
	useEffect(() => {
		const element = ref.current;
		if (element == null) {
			return;
		}

		const onClick = (e) => {
			// @ts-ignore
			if (!element.contains(e.target)) {
				console.log("clicked outside");
				callback();
			}
		};

		// delay it to avoid treating trigger click as click outside
		window.setTimeout(() => document.addEventListener("click", onClick), 0);
		return () => {
			window.setTimeout(
				() => document.removeEventListener("click", onClick),
				0
			);
		};
	}, []);
	return ref;
}
