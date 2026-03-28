import { useState, useCallback } from "react";

let toastId = 0;

/**
 * Hook custom pour les toasts
 * @returns {{ toasts, addToast, removeToast, toast }}
 */
export const useToast = () => {
	const [toasts, setToasts] = useState([]);

	const addToast = useCallback(({ message, type = "success", duration = 3500 }) => {
		const id = ++toastId;
		setToasts((prev) => [...prev, { id, message, type }]);

		setTimeout(() => {
			removeToast(id);
		}, duration);

		return id;
	}, []);

	const removeToast = useCallback((id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const toast = {
		success: (message) => addToast({ message, type: "success" }),
		error: (message) => addToast({ message, type: "error" }),
		warning: (message) => addToast({ message, type: "warning" }),
		info: (message) => addToast({ message, type: "info" }),
	};

	return { toasts, addToast, removeToast, toast };
};

export default useToast;
