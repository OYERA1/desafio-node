export const getDate = () => {
	const date = new Date();
	const [day, month, year] = [
		date.getDate().toString(),
		(date.getMonth() + 1).toString(),
		date.getFullYear().toString(),
	];

	const formatedDay = day.padStart(2, "0");
	const formatedMonth = month.padStart(2, "0");

	return { day: formatedDay, month: formatedMonth, year: year };
};
