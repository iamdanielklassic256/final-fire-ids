export const formatMemberName = (member) => {
	const names = [member.first_name, member.last_name, member.other_name].filter(Boolean);
	return names.join(' ');
};