export const fakeRequest = <T>(valueToResolve: T, delay: number = 10000): Promise<T> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve(valueToResolve);
		}, delay);
	});
