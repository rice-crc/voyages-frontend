export const formatCount = (count: number) => {
    const formattedCount = count.toLocaleString();
    return count >= 1 ? formattedCount : 'No';
};