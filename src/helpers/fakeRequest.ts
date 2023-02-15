export const fakeRequest = <T>(valueToResolve: T, delay: number = 1000): Promise<T> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve(valueToResolve);
		}, delay);
	});
